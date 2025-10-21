const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

(async () => {
  const outPath = path.resolve(__dirname, '..', 'exported.pdf');
  if (fs.existsSync(outPath)) fs.unlinkSync(outPath);

  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  try {
    const page = await browser.newPage();
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 60000 });

    // Listen for download via window.open/saveAs usage; intercept blob response by evaluating in page context
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));

    // Click the PDF export button
    const exportSelector = 'button:has-text("Export PDF")';
    // Fallback: try by innerText match
    const btn = await page.$x("//button[contains(., 'Export PDF') or contains(., '📄 Export PDF')]");
    if (!btn || btn.length === 0) {
      throw new Error('Export PDF button not found on page');
    }
    // Click and wait for download logic (the page triggers jsPDF save which calls a file save via browser APIs)
    // We'll override window.saveAs / anchor download to capture the blob
    await page.exposeFunction('nodeSaveFile', async (bufferBase64) => {
      const buf = Buffer.from(bufferBase64, 'base64');
      fs.writeFileSync(outPath, buf);
      console.log('Saved PDF to', outPath);
    });

    await page.evaluate(() => {
      // Monkey-patch jsPDF's output behavior to forward base64 to Node
      // If doc.save triggers a download via an anchor with blob, intercept window.open / anchor clicks
      // Also override HTMLAnchorElement.prototype.click to capture blobURLs
      (function() {
        const origOpen = window.open;
        window.open = function() { return null; };

        // hook URL.createObjectURL to capture the blob URL and then read the blob
        const origCreateObjectURL = URL.createObjectURL.bind(URL);
        URL.createObjectURL = function(blob) {
          // read blob as base64 and send to Node
          const reader = new FileReader();
          reader.onloadend = function() {
            const base64 = reader.result.split(',')[1];
            window.nodeSaveFile(base64);
          };
          reader.readAsDataURL(blob);
          return origCreateObjectURL(blob);
        };

        // In case jsPDF triggers a download by creating an <a download> and clicking it, intercept appendChild
        const origAppend = Element.prototype.appendChild;
        Element.prototype.appendChild = function(el) {
          try {
            if (el && el.tagName === 'A' && el.href && el.download) {
              // try to fetch blob href
              const href = el.href;
              if (href.startsWith('blob:')) {
                // find blob by URL; createObjectURL already reads the blob so nothing further needed
              }
            }
          } catch (e) {}
          return origAppend.call(this, el);
        };
      })();
    });

    // Click the first match
    await btn[0].click();

    // Wait up to 10s for exported.pdf to appear
    const maxWait = 15000;
    const start = Date.now();
    while (!fs.existsSync(outPath) && Date.now() - start < maxWait) {
      await new Promise(r => setTimeout(r, 200));
    }

    if (!fs.existsSync(outPath)) throw new Error('PDF not captured within timeout');

    console.log('Export completed, file:', outPath, 'size:', fs.statSync(outPath).size);
  } catch (err) {
    console.error('Headless export failed:', err);
    process.exitCode = 2;
  } finally {
    await browser.close();
  }
})();
