import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const ComprehensivePDFExport = ({ formData }) => {
  const [isExporting, setIsExporting] = useState(false);

  const safe = (v) => (v === undefined || v === null ? '' : String(v));
  const toNum = (v) => (typeof v === 'number' ? v : (parseFloat(v) || 0));
  const money = (v) => {
    const num = toNum(v);
    return num === 0 ? '' : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
  };

  // Get county from familyData and format it properly
  const getCountyDisplay = () => {
    // Try multiple possible county field locations
    const county = formData.familyData?.county || 
                   formData.familyData?.oathCounty || 
                   formData.county || 
                   '';
    
    if (!county) return '________'; // Show blank if no county found
    
    // Special case for New York county - be more flexible with matching
    const countyLower = county.toLowerCase();
    if (countyLower.includes('new york') || 
        countyLower.includes('manhattan') || 
        county === 'New York (Manhattan)') {
      return 'NEW YORK';
    }
    
    return county.toUpperCase();
  };

  const exportToPDF = () => {
    setIsExporting(true);
    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'letter' });
      const margin = 40;
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      const contentWidth = pageWidth - (2 * margin);
      let y = margin;

  const fd = formData.familyData || {};
  const exp = formData.expenses || {};
  const inc = formData.income || {};
  const ast = formData.assets || {};
  const liab = formData.liabilities || {};
  const add = formData.additionalSections || {};
      const caseInfo = {
        plaintiffName: formData.plaintiffName || formData.familyData?.plaintiffName || '',
        defendantName: formData.defendantName || formData.familyData?.defendantName || '',
        indexNo: formData.case?.indexNo || '',
        dateCommenced: formData.case?.dateCommenced || '',
        county: formData.county || formData.familyData?.county || ''
      };

      // Helper functions
      const checkPageBreak = (neededSpace = 60) => {
        if (y + neededSpace > pageHeight - margin) {
          doc.addPage();
          y = margin;
          return true;
        }
        return false;
      };


      // Create expense categories with proper formatting
      const createExpenseTable = (title, items, totalLabel = 'TOTAL:') => {
        checkPageBreak(80);
        
        if (title) {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10);
          doc.text(title, margin, y);
          y += 10;
        }

        const tableData = items.map(([label, value]) => [label, money(value)]);
        const categoryTotal = items.reduce((sum, item) => sum + toNum(item[1]), 0);
        tableData.push([totalLabel, money(categoryTotal)]);

        autoTable(doc, {
          startY: y,
          body: tableData,
          theme: 'grid',
          styles: {
            fontSize: 9,
            cellPadding: 2,
            lineColor: [200, 200, 200],
            lineWidth: 0.5
          },
          columnStyles: {
            0: { cellWidth: contentWidth - 100 },
            1: { cellWidth: 100, halign: 'right' }
          },
          margin: { left: margin, right: margin },
          didParseCell: (data) => {
            if (data.row.index === tableData.length - 1) {
              data.cell.styles.fontStyle = 'bold';
              data.cell.styles.fillColor = [240, 240, 240];
            }
          }
        });
        y = doc.lastAutoTable.finalY + 8;
        
        return categoryTotal;
      };

      // Create detailed asset entry with all subsections
      const createDetailedAssetEntry = (entryNumber, fields) => {
        checkPageBreak(80);
        
        const tableData = fields.map(([label, value]) => [label, value]);

        autoTable(doc, {
          startY: y,
          body: tableData,
          theme: 'grid',
          styles: {
            fontSize: 8,
            cellPadding: 2,
            lineColor: [200, 200, 200],
            lineWidth: 0.5
          },
          columnStyles: {
            0: { cellWidth: contentWidth * 0.65 },
            1: { cellWidth: contentWidth * 0.35, halign: 'left' }
          },
          margin: { left: margin, right: margin }
        });
        y = doc.lastAutoTable.finalY + 6;
      };

      // Create asset category total
      const createAssetTotal = (title, total) => {
        checkPageBreak(30);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.text(title, margin, y);
        doc.text(money(total), pageWidth - margin - 20, y, { align: 'right' });
        y += 12;
        return total;
      };

      // Create detailed liability entry with all subsections
      const createDetailedLiabilityEntry = (entryNumber, fields) => {
        checkPageBreak(80);
        
        const tableData = fields.map(([label, value]) => [label, value]);

        autoTable(doc, {
          startY: y,
          body: tableData,
          theme: 'grid',
          styles: {
            fontSize: 8,
            cellPadding: 2,
            lineColor: [200, 200, 200],
            lineWidth: 0.5
          },
          columnStyles: {
            0: { cellWidth: contentWidth * 0.65 },
            1: { cellWidth: contentWidth * 0.35, halign: 'left' }
          },
          margin: { left: margin, right: margin }
        });
        y = doc.lastAutoTable.finalY + 6;
      };

      // Create liability category total
      const createLiabilityTotal = (title, total) => {
        checkPageBreak(30);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.text(title, margin, y);
        doc.text(money(total), pageWidth - margin - 20, y, { align: 'right' });
        y += 12;
        return total;
      };

      // ========== PAGE 1: HEADER ==========
      // Position at the very top
      y = 20; // Start closer to top of page
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      doc.text('SUPREME COURT OF THE STATE OF NEW YORK', margin, y);
      y += 12;
      doc.setFont('helvetica', 'bold');
      doc.text(`COUNTY OF ${getCountyDisplay()}`, margin, y);
      y += 20; // Add gap after county before caption
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text('---------------------------------------------------------------------X', margin, y);
      y += 12;

      // Create caption with proper layout matching XML template
      const rightX = pageWidth - margin - 160;
      doc.setFontSize(10);
      
      // Plaintiff line
      doc.setFont('helvetica', 'normal');
      doc.text(`${safe(caseInfo.plaintiffName) || 'Plaintiff'},`, margin + 40, y);
      y += 12;

      // STATEMENT OF NET WORTH - right aligned
      doc.setFont('helvetica', 'bold');
      doc.text('STATEMENT OF NET WORTH', rightX, y);
      y += 12;

      // DATED line - right aligned
      doc.setFont('helvetica', 'bold');
      doc.text('DATED: __________', rightX, y);
      y += 12;

      // -against line
      doc.setFont('helvetica', 'normal');
      doc.text('- against -', pageWidth / 2, y, { align: 'center' });
      y += 12;

      // Defendant line
      doc.text(`${safe(caseInfo.defendantName) || 'Defendant'}.`, margin + 40, y);
      y += 12;

      // Index No. line - right aligned
      doc.setFont('helvetica', 'normal');
      doc.text(`Index No. ${safe(caseInfo.indexNo) || '_______'}`, rightX, y);
      y += 12;

      // Date Action Commenced line - right aligned
      doc.text(`Date Action Commenced: ${safe(caseInfo.dateCommenced) || '_______'}`, rightX, y);
      y += 12;

      doc.setFont('helvetica', 'normal');
      doc.text('----------------------------------------------------------------------X', margin, y);
      y += 12;

      // Instruction line - moved after county information
      doc.setFontSize(9);
      doc.text(
        'Complete all items, marking "NONE", "INAPPLICABLE" and "UNKNOWN", if appropriate',
        margin,
        y
      );
      y += 20; // Gap before STATE OF NEW YORK section

      // "STATE OF NEW YORK )  )ss.:  COUNTY OF )" - positioned to the left
      const leftBlockX = margin; // Position to the left
      const midBlockX = leftBlockX + 130;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text('STATE OF NEW YORK', leftBlockX, y);
      doc.text(')', midBlockX, y);
      y += 12;
      doc.text(')ss.:', midBlockX, y);
      y += 12;
      doc.text(`COUNTY OF ${getCountyDisplay()}`, leftBlockX, y);
      doc.text(')', midBlockX, y);
      y += 60; // Even larger gap below this block to move oath paragraph lower

      // Oath paragraph
      const deponentName = safe(fd.deponentName) || '__________________________';
      const oathText =
        `${deponentName}, the Plaintiff/Defendant herein, being duly sworn, deposes and says that, ` +
        'subject to the penalties of perjury, the following is an accurate statement as of ' +
        '______, __ , 20__, of my net worth (assets of whatsoever kind and nature and wherever situated minus liabilities), ' +
        'statement of income from all sources and statement of assets transferred of whatsoever kind and nature and wherever situated and statement of expenses:';
      const oathLines = doc.splitTextToSize(oathText, contentWidth);
      oathLines.forEach(line => {
        checkPageBreak(11);
        doc.text(line, margin, y);
        y += 12; // Increased line spacing for better readability
      });

      // ========== PAGE 2: FAMILY DATA ==========
      doc.addPage();
      y = margin;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('I. FAMILY DATA', margin, y);
      y += 16;

      // Create family data table with consistent format
      const createFamilyTable = (title, items) => {
        checkPageBreak(80);
        
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text(title, margin, y);
        y += 10;

        const tableData = items.map(([label, value]) => [label, safe(value)]);

        autoTable(doc, {
          startY: y,
          body: tableData,
          theme: 'grid',
          styles: {
            fontSize: 9,
            cellPadding: 2,
            lineColor: [200, 200, 200],
            lineWidth: 0.5
          },
          columnStyles: {
            0: { cellWidth: contentWidth - 100 },
            1: { cellWidth: 100, halign: 'right' }
          },
          margin: { left: margin, right: margin }
        });
        y = doc.lastAutoTable.finalY + 8;
      };

      // Basic Family Information
      createFamilyTable('A. Basic Family Information:', [
        ["Plaintiff's date of birth", fd.plaintiffDateOfBirth],
        ["Defendant's date of birth", fd.defendantDateOfBirth],
        ["Date married", fd.dateMarried]
      ]);

      // Children Information
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('B. Children Information:', margin, y);
      y += 10;
      
      autoTable(doc, {
        startY: y,
        head: [['Name', 'Date of Birth']],
        body: (fd.children?.length ? fd.children : [{}, {}, {}]).map(c => [
          safe(c?.name), safe(c?.dateOfBirth)
        ]),
        theme: 'grid',
        styles: { fontSize: 9, cellPadding: 3 },
        headStyles: { fillColor: [220, 220, 220], fontStyle: 'bold' },
        margin: { left: margin, right: margin },
      });
      y = doc.lastAutoTable.finalY + 10;

      // Additional Family Data
      createFamilyTable('C. Additional Family Information:', [
        ["Minor child(ren) of prior marriage", fd.minorChildrenPriorMarriage],
        ["Custody of child(ren) of prior marriage", fd.custodyPriorMarriage],
        ["Plaintiff's present address", fd.plaintiffAddress],
        ["Defendant's present address", fd.defendantAddress],
        ["Plaintiff's occupation/employer", fd.plaintiffOccupation],
        ["Defendant's occupation/employer", fd.defendantOccupation]
      ]);

      // Rider note
      checkPageBreak(40);
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      const riderText = 'If there is any additional information that does not fit on this form, please use the rider on the last page.';
      doc.text(riderText, margin, y);
      y += 16;

      // ========== EXPENSES ==========
      doc.addPage();
      y = margin;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('II. EXPENSES: (List monthly expenses and other expenses as indicated)', margin, y);
      y += 16;

      // Add descriptive paragraph for expenses section
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      const expenseDescription = 'List your current expenses on a monthly basis. If there has been any change in these expenses during the recent past please indicate. Items included under "other" should be listed separately with separate dollar amounts.';
      const expenseDescLines = doc.splitTextToSize(expenseDescription, contentWidth);
      expenseDescLines.forEach(line => {
        checkPageBreak(11);
        doc.text(line, margin, y);
        y += 10;
      });
      y += 8; // Extra space after description

      let grandTotal = 0;

      // (a) Housing
      grandTotal += createExpenseTable('(a) Housing: Monthly', [
        ['1. Mortgage/Co-op Loan', exp.mortgage],
        ['2. Home Equity Line of Credit/Second Mortgage', exp.homeEquityLine],
        ['3. Real Estate Taxes (if not included in mortgage payment)', exp.realEstateTaxes],
        ['4. Homeowners/Renter\'s Insurance', exp.homeownersInsurance],
        ['5. Homeowner\'s Association/Maintenance charges/Condominium Charges', exp.hoaMaintenance],
        ['6. Rent', exp.rent],
        ['7. Other', exp.otherHousing]
      ], 'TOTAL: HOUSING');

      // (b) Utilities
      grandTotal += createExpenseTable('(b) Utilities: Monthly', [
        ['1. Fuel Oil/Gas', exp.fuelOilGas],
        ['2. Electric', exp.electric],
        ['3. Telephone (land line)', exp.landlinePhone],
        ['4. Mobile Phone', exp.mobilePhone],
        ['5. Cable/Satellite TV', exp.cableSatellite],
        ['6. Internet', exp.internet],
        ['7. Alarm', exp.alarm],
        ['8. Water', exp.water],
        ['9. Other', exp.otherUtilities]
      ], 'TOTAL: UTILITIES');

      // (c) Food
      grandTotal += createExpenseTable('(c) Food: Monthly', [
        ['1. Groceries', exp.groceries],
        ['2. Dining Out/Take Out', exp.diningOut],
        ['3. Other', exp.otherFood]
      ], 'TOTAL: FOOD');

      // (d) Clothing
      grandTotal += createExpenseTable('(d) Clothing: Monthly', [
        ['1. Yourself', exp.clothingYourself],
        ['2. Child(ren)', exp.clothingChildren],
        ['3. Dry Cleaning', exp.dryCleaning],
        ['4. Other', exp.otherClothing]
      ], 'TOTAL: CLOTHING');

      // (e) Insurance
      grandTotal += createExpenseTable('(e) Insurance: Monthly', [
        ['1. Life', exp.lifeInsurance],
        ['2. Fire, theft and liability and personal articles policy', exp.fireTheftLiability],
        ['3. Automotive', exp.automotiveInsurance],
        ['4. Umbrella Policy', exp.umbrellaPolicy],
        ['5. Medical Plan', exp.medicalPlanYourself],
        ['5A. Medical Plan for yourself (Including name of carrier and name of insured)', safe(exp.medicalPlanYourselfDetails)],
        ['5B. Medical Plan for children (Including name of carrier and name of insured)', safe(exp.medicalPlanChildrenDetails)],
        ['6. Dental Plan', exp.dentalPlan],
        ['7. Optical Plan', exp.opticalPlan],
        ['8. Disability', exp.disabilityInsurance],
        ['9. Worker\'s Compensation', exp.workersCompensation],
        ['10. Long Term Care Insurance', exp.longTermCare],
        ['11. Other', exp.otherInsurance]
      ], 'TOTAL: INSURANCE');

      // (f) Unreimbursed Medical
      grandTotal += createExpenseTable('(f) Unreimbursed Medical: Monthly', [
        ['1. Medical', exp.medical],
        ['2. Dental', exp.dental],
        ['3. Optical', exp.optical],
        ['4. Pharmaceutical', exp.pharmaceutical],
        ['5. Surgical, Nursing, Hospital', exp.surgicalNursing],
        ['6. Psychotherapy', exp.psychotherapy],
        ['7. Other', exp.otherMedical]
      ], 'TOTAL: UNREIMBURSED MEDICAL');

      // (g) Household Maintenance
      grandTotal += createExpenseTable('(g) Household Maintenance: Monthly', [
        ['1. Repairs/Maintenance', exp.repairsMaintenance],
        ['2. Gardening/landscaping', exp.gardeningLandscaping],
        ['3. Sanitation/carting', exp.sanitationCarting],
        ['4. Snow Removal', exp.snowRemoval],
        ['5. Extermination', exp.extermination],
        ['6. Other', exp.otherHouseholdMaintenance]
      ], 'TOTAL: HOUSEHOLD MAINTENANCE');

      // (h) Household Help
      grandTotal += createExpenseTable('(h) Household Help: Monthly', [
        ['1. Domestic (housekeeper, etc.)', exp.domestic],
        ['2. Nanny/Au Pair/Child Care', exp.nannyAuPair],
        ['3. Babysitter', exp.babysitter],
        ['4. Other', exp.otherHouseholdHelp]
      ], 'TOTAL: HOUSEHOLD HELP');

      // (i) Automobile
      checkPageBreak(80);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('(i) Automobile: Monthly (List data for each car separately)', margin, y);
      y += 10;
      
      // Car 1 entry if data exists
      if (exp.carYear || exp.carMake || exp.carPersonal || exp.carBusiness) {
        checkPageBreak(60);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        
        // Car details header
        const carDetails = [];
        if (exp.carYear) carDetails.push(`Year: ${exp.carYear}`);
        if (exp.carMake) carDetails.push(`Make: ${exp.carMake}`);
        if (exp.carPersonal) carDetails.push(`Personal: ${exp.carPersonal}%`);
        if (exp.carBusiness) carDetails.push(`Business: ${exp.carBusiness}%`);
        
        if (carDetails.length > 0) {
          doc.text(carDetails.join('  '), margin, y);
          y += 10;
        }
        
        // Create table for this car's expenses
        const carTableData = [
          ['1. Lease or Loan Payments (indicate lease term) mos', exp.leaseLoanPayments],
          ['2. Gas and Oil', exp.gasAndOil],
          ['3. Repairs', exp.repairs],
          ['4. Car Wash', exp.carWash],
          ['5. Parking and tolls', exp.parkingTolls],
          ['6. Other', exp.otherAutomobile]
        ];
        
        autoTable(doc, {
          startY: y,
          body: carTableData.map(([label, value]) => [label, money(value)]),
          theme: 'grid',
          styles: {
            fontSize: 9,
            cellPadding: 2,
            lineColor: [200, 200, 200],
            lineWidth: 0.5
          },
          columnStyles: {
            0: { cellWidth: contentWidth - 100 },
            1: { cellWidth: 100, halign: 'right' }
          },
          margin: { left: margin, right: margin }
        });
        y = doc.lastAutoTable.finalY + 8;
      }
      
      // Calculate and show total
      const automobileTotal = (exp.leaseLoanPayments || 0) + 
                            (exp.gasAndOil || 0) + 
                            (exp.repairs || 0) + 
                            (exp.carWash || 0) + 
                            (exp.parkingTolls || 0) + 
                            (exp.otherAutomobile || 0);
      
      grandTotal += automobileTotal;
      
      // Show total
      checkPageBreak(30);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text(`TOTAL: AUTOMOTIVE - $${automobileTotal.toFixed(2)}`, margin, y);
      y += 12;

      // (j) Education Costs
      grandTotal += createExpenseTable('(j) Education Costs: Monthly', [
        ['1. Nursery and Pre-school', exp.nurseryPreschool],
        ['2. Primary and Secondary', exp.primarySecondary],
        ['3. College', exp.college],
        ['4. Post-Graduate', exp.postGraduate],
        ['5. Religious Instruction', exp.religiousInstruction],
        ['6. School Transportation', exp.schoolTransportation],
        ['7. School Supplies/Books', exp.schoolSuppliesBooks],
        ['8. School Lunches', exp.schoolLunches],
        ['9. Tutoring', exp.tutoring],
        ['10. School Events', exp.schoolEvents],
        ['11. Child(ren)\'s extra-curricular and educational enrichment activities (Dance, Music, Sports, etc.)', exp.extracurricularActivities],
        ['12. Other', exp.otherEducation]
      ], 'TOTAL: EDUCATION');

      // (k) Recreational
      grandTotal += createExpenseTable('(k) Recreational: Monthly', [
        ['1. Vacations', exp.vacations],
        ['2. Movies, Theatre, Ballet, Etc.', exp.moviesTheatre],
        ['3. Music (Digital or Physical Media)', exp.music],
        ['4. Recreation Clubs and Memberships', exp.recreationClubs],
        ['5. Activities for yourself', exp.activitiesYourself],
        ['6. Health Club', exp.healthClub],
        ['7. Summer Camp', exp.summerCamp],
        ['8. Birthday party costs for your child(ren)', exp.birthdayParties],
        ['9. Other', exp.otherRecreational]
      ], 'TOTAL: RECREATIONAL');

      // (l) Income Taxes
      checkPageBreak(80);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('(l) Income Taxes: Monthly', margin, y);
      y += 10;
      
      // Create comprehensive income taxes table
      const incomeTaxTableData = [
        ['1. Federal', exp.federalTaxes],
        ['2. State', exp.stateTaxes],
        ['3. City', exp.cityTaxes],
        ['4. Social Security and Medicare', exp.socialSecurityMedicare],
        ['5. Number of dependents claimed in prior tax year', exp.numberOfDependents || ''],
        ['6. List any refund received by you for prior tax year', money(exp.taxRefund)]
      ];
      
      autoTable(doc, {
        startY: y,
        body: incomeTaxTableData.map(([label, value]) => [label, value]),
        theme: 'grid',
        styles: {
          fontSize: 9,
          cellPadding: 2,
          lineColor: [200, 200, 200],
          lineWidth: 0.5
        },
        columnStyles: {
          0: { cellWidth: contentWidth - 100 },
          1: { cellWidth: 100, halign: 'right' }
        },
        margin: { left: margin, right: margin }
      });
      y = doc.lastAutoTable.finalY + 8;
      
      // Calculate and show total
      const incomeTaxesTotal = (exp.federalTaxes || 0) + 
                             (exp.stateTaxes || 0) + 
                             (exp.cityTaxes || 0) + 
                             (exp.socialSecurityMedicare || 0);
      
      grandTotal += incomeTaxesTotal;
      
      // Show total
      checkPageBreak(30);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text(`TOTAL: INCOME TAXES - $${incomeTaxesTotal.toFixed(2)}`, margin, y);
      y += 12;

      // (m) Miscellaneous
      grandTotal += createExpenseTable('(m) Miscellaneous: Monthly', [
        ['1. Beauty parlor/Barber/Spa', exp.beautyBarberSpa],
        ['2. Toiletries/Non-Prescription Drugs', exp.toiletriesNonPrescription],
        ['3. Books, magazines, newspapers', exp.booksMagazinesNewspapers],
        ['4. Gifts to others', exp.giftsToOthers],
        ['5. Charitable contributions', exp.charitableContributions],
        ['6. Religious organizations dues', exp.religiousOrganizationDues],
        ['7. Union and organization dues', exp.unionOrganizationDues],
        ['8. Commutation expenses', exp.commutationExpenses],
        ['9. Veterinarian/pet expenses', exp.veterinarianPetExpenses],
        ['10. Child support payments (for Child(ren) of a prior marriage or relationship pursuant to court order or agreement)', exp.childSupportPayments],
        ['11. Alimony and maintenance payments (prior marriage pursuant to court order or agreement)', exp.alimonyMaintenancePayments],
        ['12. Loan payments', exp.loanPayments],
        ['13. Unreimbursed business expenses', exp.unreimbursedBusinessExpenses],
        ['14. Safe Deposit Box rental fee', exp.safeDepositBoxRental]
      ], 'TOTAL: MISCELLANEOUS');

      // (n) Other
      grandTotal += createExpenseTable('(n) Other: Monthly', [
        ['1.', exp.otherExpense1],
        ['2.', exp.otherExpense2],
        ['3.', exp.otherExpense3]
      ], 'TOTAL: OTHER');

      // Grand Total
      checkPageBreak(30);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('TOTAL: MONTHLY EXPENSES', margin, y);
      doc.text(money(grandTotal), pageWidth - margin - 20, y, { align: 'right' });
      y += 20;

      // ========== III. GROSS INCOME ==========
      doc.addPage();
      y = margin;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('III. GROSS INCOME INFORMATION:', margin, y);
      y += 16;

      // Create income table with consistent format
      const createIncomeTable = (title, items, totalLabel = 'TOTAL:', includeTotal = true) => {
        checkPageBreak(80);
        
        if (title) {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10);
          doc.text(title, margin, y);
          y += 10;
        }

        const tableData = items.map(([label, value]) => [label, money(value)]);
        const categoryTotal = items.reduce((sum, item) => sum + toNum(item[1]), 0);
        
        if (includeTotal) {
          tableData.push([totalLabel, money(categoryTotal)]);
        }

        autoTable(doc, {
          startY: y,
          body: tableData,
          theme: 'grid',
          styles: {
            fontSize: 9,
            cellPadding: 2,
            lineColor: [200, 200, 200],
            lineWidth: 0.5
          },
          columnStyles: {
            0: { cellWidth: contentWidth - 100 },
            1: { cellWidth: 100, halign: 'right' }
          },
          margin: { left: margin, right: margin },
          didParseCell: (data) => {
            if (includeTotal && data.row.index === tableData.length - 1) {
              data.cell.styles.fontStyle = 'bold';
              data.cell.styles.fillColor = [240, 240, 240];
            }
          }
        });
        y = doc.lastAutoTable.finalY + 8;
        
        return categoryTotal;
      };

      let totalIncomeValue = 0;

      // (a) Gross Income
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      const grossIncomeDesc = '(a) Gross (total) income - as should have been or should be reported in the most recent Federal income tax return. (State whether your income has changed during the year preceding date of this affidavit. If so, please explain.) Attach most recent W-2, 1099s, K1s and income tax returns.';
      const grossIncomeDescLines = doc.splitTextToSize(grossIncomeDesc, contentWidth);
      grossIncomeDescLines.forEach(line => {
        checkPageBreak(11);
        doc.text(line, margin, y);
        y += 10;
      });
      y += 8;
      
      totalIncomeValue += createIncomeTable('', [
        ['Gross (total) income', inc.grossIncome],
        ['List any amount deducted from gross income for retirement benefits or tax deferred savings', inc.retirementDeductions]
      ], 'TOTAL:', false);

      // (b) Additional Income Sources
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text('(b) To the extent not already included in gross income in (a) above:', margin, y);
      y += 12;
      
      totalIncomeValue += createIncomeTable('', [
        ['1. Investment income, including interest and dividend income, reduced by sums expended in connection with such investment', inc.investmentIncome],
        ['2. Worker\'s compensation (indicate percentage of amount due to lost wages)', inc.workersCompensation],
        ['3. Disability benefits (indicate percentage of amount due to lost wages)', inc.disabilityBenefits],
        ['4. Unemployment insurance benefits', inc.unemploymentBenefits],
        ['5. Social Security benefits', inc.socialSecurityBenefits],
        ['6. Supplemental Security Income', inc.supplementalSecurityIncome],
        ['7. Public assistance', inc.publicAssistance],
        ['8. Food stamps', inc.foodStamps],
        ['9. Veterans benefits', inc.veteransBenefits],
        ['10. Pensions and retirement benefits', inc.pensionsRetirementBenefits],
        ['11. Fellowships and stipends', inc.fellowshipsStipends],
        ['12. Annuity payments', inc.annuityPayments]
      ], 'TOTAL:', false);

      // (c), (d), (e) Income subsections in table format
      checkPageBreak(80);
      
      // Create table for income subsections
      autoTable(doc, {
        startY: y,
        body: [
          ['(c) If any child or other member of your household is employed, set forth name and that person\'s annual income:', safe(inc.householdMemberIncome)],
          ['(d) List any maintenance and/or child support you are receiving pursuant to court order or agreement:', safe(inc.maintenanceChildSupportReceived)],
          ['(e) Other:', safe(inc.otherIncome)]
        ],
        theme: 'grid',
        styles: {
          fontSize: 9,
          cellPadding: 3,
          lineColor: [200, 200, 200],
          lineWidth: 0.5
        },
        columnStyles: {
          0: { cellWidth: contentWidth * 0.6 },
          1: { cellWidth: contentWidth * 0.4, halign: 'left' }
        },
        margin: { left: margin, right: margin }
      });
      y = doc.lastAutoTable.finalY + 20;

      // Final total for all income sections (a), (b), (c), (d), (e)
      checkPageBreak(30);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('TOTAL: GROSS INCOME', margin, y);
      doc.text(money(totalIncomeValue), pageWidth - margin - 20, y, { align: 'right' });
      y += 30;

      // ========== IV. ASSETS ==========
      doc.addPage();
      y = margin;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('IV. ASSETS', margin, y);
      y += 10;
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      doc.text('(If any asset is held jointly with spouse or another, so state, and set forth your respective shares. Attach additional sheets, if needed)', margin, y);
      y += 16;

      let totalAssetsValue = 0;

      // A. 1. Cash Accounts
      checkPageBreak(80);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('A. 1. Cash Accounts:', margin, y);
      y += 12;
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text('Cash', margin + 10, y);
      y += 10;
      
      createDetailedAssetEntry('1.1', [
        ['a. Location', safe(ast.cashLocation) + (ast.cashLocation === 'other' ? ` - ${safe(ast.cashLocationOther)}` : '')],
        ['b. Source of Funds', safe(ast.cashSource) + (ast.cashSource === 'other' ? ` - ${safe(ast.cashSourceOther)}` : '')],
        ['c. Amount as of date of commencement', money(ast.cashAmountCommenced)],
        ['d. Current amount', money(ast.cashAmount)]
      ]);
      
      const cashTotal = toNum(ast.cashAmount);
      totalAssetsValue += createAssetTotal('TOTAL: CASH', cashTotal);

      // 2. Checking Accounts
      checkPageBreak(80);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text('2. Checking Accounts:', margin + 10, y);
      y += 10;
      
      // 2.1
      createDetailedAssetEntry('2.1', [
        ['a. Financial Institution', safe(ast.checkingAccount1Institution)],
        ['b. Account Number', safe(ast.checkingAccount1Number)],
        ['c. Title holder', safe(ast.checkingAccount1TitleHolder)],
        ['d. Date opened', safe(ast.checkingAccount1DateOpened)],
        ['e. Source of Funds', safe(ast.checkingAccount1Source)],
        ['f. Balance as of date of commencement', money(ast.checkingAccount1BalanceCommenced)],
        ['g. Current balance', money(ast.checkingAccount1Balance)]
      ]);
      
      // 2.2
      createDetailedAssetEntry('2.2', [
        ['a. Financial Institution', safe(ast.checkingAccount2Institution)],
        ['b. Account Number', safe(ast.checkingAccount2Number)],
        ['c. Title holder', safe(ast.checkingAccount2TitleHolder)],
        ['d. Date opened', safe(ast.checkingAccount2DateOpened)],
        ['e. Source of Funds', safe(ast.checkingAccount2Source)],
        ['f. Balance as of date of commencement', money(ast.checkingAccount2BalanceCommenced)],
        ['g. Current balance', money(ast.checkingAccount2Balance)]
      ]);
      
      const checkingTotal = toNum(ast.checkingAccount1Balance) + toNum(ast.checkingAccount2Balance);
      totalAssetsValue += createAssetTotal('TOTAL: Checking Accounts', checkingTotal);

      // 3. Savings Accounts
      checkPageBreak(80);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text('3. Savings Account (including individual, joint, totten trust, certificates of deposit, treasury notes)', margin + 10, y);
      y += 10;
      
      // 3.1
      createDetailedAssetEntry('3.1', [
        ['a. Financial Institution', safe(ast.savingsAccount1Institution)],
        ['b. Account Number', safe(ast.savingsAccount1Number)],
        ['c. Title holder', safe(ast.savingsAccount1TitleHolder)],
        ['d. Type of account', safe(ast.savingsAccount1Type)],
        ['e. Date opened', safe(ast.savingsAccount1DateOpened)],
        ['f. Source of Funds', safe(ast.savingsAccount1Source)],
        ['g. Balance as of date of commencement', money(ast.savingsAccount1BalanceCommenced)],
        ['h. Current balance', money(ast.savingsAccount1Balance)]
      ]);
      
      // 3.2
      createDetailedAssetEntry('3.2', [
        ['a. Financial Institution', safe(ast.savingsAccount2Institution)],
        ['b. Account Number', safe(ast.savingsAccount2Number)],
        ['c. Title holder', safe(ast.savingsAccount2TitleHolder)],
        ['d. Type of account', safe(ast.savingsAccount2Type)],
        ['e. Date opened', safe(ast.savingsAccount2DateOpened)],
        ['f. Source of Funds', safe(ast.savingsAccount2Source)],
        ['g. Balance as of date of commencement', money(ast.savingsAccount2BalanceCommenced)],
        ['h. Current balance', money(ast.savingsAccount2Balance)]
      ]);
      
      const savingsTotal = toNum(ast.savingsAccount1Balance) + toNum(ast.savingsAccount2Balance);
      totalAssetsValue += createAssetTotal('TOTAL: Savings Accounts', savingsTotal);
      
      const accountsTotal = cashTotal + checkingTotal + savingsTotal;
      checkPageBreak(30);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('TOTAL: Accounts', margin, y);
      doc.text(money(accountsTotal), pageWidth - margin - 20, y, { align: 'right' });
      y += 16;

      // B. 4. Real Estate
      checkPageBreak(80);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('B. 4. Real Estate (Including real property, leaseholds, life estates, etc. at market value – do not deduct any mortgage)', margin, y);
      y += 12;
      
      const realEstateEntries = ast.realEstateEntries || [{ id: 1 }, { id: 2 }];
      let realEstateTotal = 0;
      
      realEstateEntries.slice(0, 2).forEach((property, index) => {
        createDetailedAssetEntry(`4.${index + 1}`, [
          ['a. Description', safe(property.description)],
          ['b. Title owner', safe(property.titleOwner)],
          ['c. Date of acquisition', safe(property.dateAcquisition)],
          ['d. Original price', money(property.originalPrice)],
          ['e. Source of funds to acquire', safe(property.sourceFunds)],
          ['f. Amount of mortgage or lien unpaid', money(property.mortgageAmount)],
          ['g. Estimate current fair market value', money(property.currentFairMarketValue)]
        ]);
        realEstateTotal += toNum(property.currentFairMarketValue);
      });
      
      totalAssetsValue += createAssetTotal('TOTAL: Real Estate', realEstateTotal);

      // C. 5. Retirement Accounts
      checkPageBreak(80);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('C. 5. Retirement Accounts (e.g. IRAs, 401(k)s, 403(b)s, pension, profit sharing plans, deferred compensation plans, etc.)', margin, y);
      y += 12;
      
      const retirementEntries = ast.retirementEntries || [{ id: 1 }, { id: 2 }];
      let retirementTotal = 0;
      
      retirementEntries.slice(0, 2).forEach((account, index) => {
        createDetailedAssetEntry(`5.${index + 1}`, [
          ['a. Description', safe(account.description)],
          ['b. Location of assets', safe(account.location)],
          ['c. Title owner', safe(account.titleOwner)],
          ['d. Date of acquisition', safe(account.dateAcquisition)],
          ['e. Source of funds', safe(account.sourceFunds)],
          ['f. Amount of unpaid liens', money(account.unpaidLiens)],
          ['g. Value as of date of commencement', money(account.valueCommenced)],
          ['h. Current value', money(account.currentValue)]
        ]);
        retirementTotal += toNum(account.currentValue);
      });
      
      totalAssetsValue += createAssetTotal('TOTAL: Retirement Accounts', retirementTotal);

      // D. 6. Vehicles
      checkPageBreak(80);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('D. 6. Vehicles (Auto, Boat, Truck, Plane, Camper, Motorcycles, etc.)', margin, y);
      y += 12;
      
      const vehicleEntries = ast.vehicleEntries || [{ id: 1 }, { id: 2 }];
      let vehicleTotal = 0;
      
      vehicleEntries.slice(0, 2).forEach((vehicle, index) => {
        createDetailedAssetEntry(`6.${index + 1}`, [
          ['a. Description', safe(vehicle.description)],
          ['b. Title owner', safe(vehicle.titleOwner)],
          ['c. Date of acquisition', safe(vehicle.dateAcquisition)],
          ['d. Original price', money(vehicle.originalPrice)],
          ['e. Source of funds to acquire', safe(vehicle.sourceFunds)],
          ['f. Amount of lien unpaid', money(vehicle.lienUnpaid)],
          ['g. Current fair market value', money(vehicle.currentFairMarketValue)],
          ['h. Value as of date of commencement', money(vehicle.valueCommenced)]
        ]);
        vehicleTotal += toNum(vehicle.currentFairMarketValue);
      });
      
      totalAssetsValue += createAssetTotal('TOTAL: Value of Vehicles', vehicleTotal);

      // E. 7. Jewelry, Art, Antiques
      checkPageBreak(80);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('E. 7. Jewelry, art, antiques, household furnishings, precious objects, gold and precious metals', margin, y);
      y += 10;
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      doc.text('(only if valued at more than $500)', margin, y);
      y += 12;
      
      const jewelryEntries = ast.jewelryArtEntries || [{ id: 1 }, { id: 2 }];
      let jewelryTotal = 0;
      
      jewelryEntries.slice(0, 2).forEach((item, index) => {
        createDetailedAssetEntry(`7.${index + 1}`, [
          ['a. Description', safe(item.description)],
          ['b. Title owner', safe(item.titleOwner)],
          ['c. Location', safe(item.location)],
          ['d. Original price or value', money(item.originalPrice)],
          ['e. Source of funds to acquire', safe(item.sourceFunds)],
          ['f. Amount of lien unpaid', money(item.lienUnpaid)],
          ['g. Value as of date of commencement', money(item.valueCommenced)],
          ['h. Estimate Current Value', money(item.estimateCurrentValue)]
        ]);
          jewelryTotal += toNum(item.estimateCurrentValue);
        });
      
      totalAssetsValue += createAssetTotal('TOTAL Value of Jewelry, Art, Antiques, etc.', jewelryTotal);
      
      // Add note matching official form
      checkPageBreak(30);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('IF YOU HAVE NO OTHER ASSETS OR BUSINESS INTERESTS, GO TO THE LIABILITIES SECTION ON PAGE 17', margin, y);
      y += 16;

      // F. 8. Interest in any Business
      checkPageBreak(80);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('F. 8. Interest in any Business', margin, y);
      y += 12;
      
      const businessEntries = ast.businessEntries || [{ id: 1 }];
      let businessTotal = 0;
      
      businessEntries.slice(0, 1).forEach((business, index) => {
        createDetailedAssetEntry(`8.${index + 1}`, [
          ['a. Name and Address of Business', safe(business.businessName)],
          ['b. Type of Business (corporate, partnership, sole proprietorship or other)', safe(business.businessType)],
          ['c. Your percentage of interest', safe(business.percentageInterest) ? `${safe(business.percentageInterest)}%` : ''],
          ['d. Date of acquisition', safe(business.dateAcquisition)],
          ['e. Original price or value', money(business.originalPrice)],
          ['f. Source of funds to acquire', safe(business.sourceFunds)],
          ['g. Net worth of business and date of such valuation', safe(business.netWorth) ? `${money(business.netWorth)} as of ${safe(business.valuationDate)}` : ''],
          ['h. Other relevant information', safe(business.otherInfo)]
        ]);
          businessTotal += toNum(business.netWorth);
        });
      
      totalAssetsValue += createAssetTotal('TOTAL: Value of Business Interests', businessTotal);

      // G. 9. Cash Surrender Value of Life Insurance
      checkPageBreak(80);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('G. 9. Cash Surrender Value of Life Insurance', margin, y);
      y += 12;
      
      const lifeInsuranceEntries = ast.lifeInsuranceEntries || [{ id: 1 }, { id: 2 }];
      let lifeInsuranceTotal = 0;
      
      lifeInsuranceEntries.slice(0, 2).forEach((policy, index) => {
        createDetailedAssetEntry(`9.${index + 1}`, [
          ['a. Insurer\'s name and address', safe(policy.insurerName)],
          ['b. Name of insured', safe(policy.insuredName)],
          ['c. Policy number', safe(policy.policyNumber)],
          ['d. Face amount of policy', money(policy.faceAmount)],
          ['e. Policy owner', safe(policy.policyOwner)],
          ['f. Date of acquisition', safe(policy.dateAcquisition)],
          ['g. Source of funds', safe(policy.sourceFunds)],
          ['h. Cash surrender value as of date of commencement', money(policy.cashSurrenderValueCommenced)],
          ['i. Current cash surrender value', money(policy.currentCashSurrenderValue)]
        ]);
        lifeInsuranceTotal += toNum(policy.currentCashSurrenderValue);
      });
      
      totalAssetsValue += createAssetTotal('Total: Cash Surrender Value of Life Insurance', lifeInsuranceTotal);

      // H. 10. Investment Accounts/Securities/Stock Options/Commodities/Broker Margin Accounts
      checkPageBreak(80);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('H. 10. Investment Accounts/Securities/Stock Options/Commodities/Broker Margin Accounts', margin, y);
      y += 12;
      
      const investmentEntries = ast.investmentEntries || [{ id: 1 }, { id: 2 }];
      let investmentTotal = 0;
      
      investmentEntries.slice(0, 2).forEach((investment, index) => {
        createDetailedAssetEntry(`10.${index + 1}`, [
          ['a. Description', safe(investment.description)],
          ['b. Title holder', safe(investment.titleHolder)],
          ['c. Location', safe(investment.location)],
          ['d. Date of acquisition', safe(investment.dateAcquisition)],
          ['e. Source of funds', safe(investment.sourceFunds)],
          ['f. Value as of date of commencement', money(investment.valueCommenced)],
          ['g. Current value', money(investment.currentValue)]
        ]);
          investmentTotal += toNum(investment.currentValue);
        });
      
      checkPageBreak(30);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('TOTAL: Investment Accounts/Securities/Stock Options/Commodities/Broker Margin Accounts', margin, y);
      y += 10;
      totalAssetsValue += createAssetTotal('TOTAL: Value of Securities', investmentTotal);

      // I. 11. Loans to Others and Accounts Receivable
      checkPageBreak(80);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('I. 11. Loans to Others and Accounts Receivable', margin, y);
      y += 12;
      
      const loanReceivableEntries = ast.loanReceivableEntries || [{ id: 1 }];
      let loanReceivableTotal = 0;
      
      loanReceivableEntries.slice(0, 1).forEach((loan, index) => {
        createDetailedAssetEntry(`11.${index + 1}`, [
          ['a. Debtor\'s Name and Address', safe(loan.debtorName)],
          ['b. Original amount of loan or debt', money(loan.originalAmount)],
          ['c. Source of funds from which loan made or origin of debt', safe(loan.sourceFunds)],
          ['d. Date payment(s) due', safe(loan.paymentDue)],
          ['e. Amount due as of date of commencement', money(loan.amountDueCommenced)],
          ['f. Current amount due', money(loan.currentAmountDue)]
        ]);
        loanReceivableTotal += toNum(loan.currentAmountDue);
      });
      
      totalAssetsValue += createAssetTotal('TOTAL: Loans to Others and Accounts Receivable', loanReceivableTotal);

      // J. 12. Contingent Interests
      checkPageBreak(80);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('J. 12. Contingent Interests (stock options, interests subject to life estates, prospective inheritances)', margin, y);
      y += 12;
      
      const contingentEntries = ast.contingentInterestEntries || [{ id: 1 }];
      let contingentTotal = 0;
      
      contingentEntries.slice(0, 1).forEach((interest, index) => {
        createDetailedAssetEntry(`12.${index + 1}`, [
          ['a. Description', safe(interest.description)],
          ['b. Location', safe(interest.location)],
          ['c. Date of vesting', safe(interest.dateVesting)],
          ['d. Title owner', safe(interest.titleOwner)],
          ['e. Date of acquisition', safe(interest.dateAcquisition)],
          ['f. Original price or value', money(interest.originalPrice)],
          ['g. Source of acquisition to acquire', safe(interest.sourceAcquisition)],
          ['h. Method of valuation', safe(interest.methodValuation)],
          ['i. Value as of date of commencement', money(interest.valueCommenced)],
          ['j. Current value', money(interest.currentValue)]
        ]);
        contingentTotal += toNum(interest.currentValue);
      });
      
      totalAssetsValue += createAssetTotal('TOTAL: Contingent Interests', contingentTotal);

      // K. 13. Other Assets
      checkPageBreak(80);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('K. 13. Other Assets (e.g., tax shelter investments, collections, judgments, causes of action,', margin, y);
      y += 10;
      doc.text('patents, trademarks, copyrights, and any other asset not hereinabove itemized)', margin, y);
      y += 12;
      
      const otherAssetEntries = ast.otherAssetEntries || [{ id: 1 }];
      let otherAssetTotal = 0;
      
      otherAssetEntries.slice(0, 1).forEach((asset, index) => {
        createDetailedAssetEntry(`13.${index + 1}`, [
          ['a. Description', safe(asset.description)],
          ['b. Title owner', safe(asset.titleOwner)],
          ['c. Location', safe(asset.location)],
          ['d. Original Price or value', money(asset.originalPrice)],
          ['e. Source of funds to acquire', safe(asset.sourceFunds)],
          ['f. Amount of lien unpaid', money(asset.lienUnpaid)],
          ['g. Value as of date of commencement', money(asset.valueCommenced)],
          ['h. Current value', money(asset.currentValue)]
        ]);
        otherAssetTotal += toNum(asset.currentValue);
      });
      
      totalAssetsValue += createAssetTotal('TOTAL: Other Assets', otherAssetTotal);

      // Final total
      checkPageBreak(30);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('TOTAL ASSETS', margin, y);
      doc.text(money(totalAssetsValue), pageWidth - margin - 20, y, { align: 'right' });

      // ========== V. LIABILITIES ==========
      doc.addPage();
      y = margin;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('V. LIABILITIES', margin, y);
      y += 16;

      let totalLiabilitiesValue = 0;

      // A. 1. Accounts Payable
      checkPageBreak(80);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('A. 1. Accounts Payable', margin, y);
      y += 12;
      
      const accountsPayableEntries = liab.accountsPayableEntries || [{ id: 1 }, { id: 2 }];
      let accountsPayableTotal = 0;
      
      accountsPayableEntries.slice(0, 2).forEach((entry, index) => {
        createDetailedLiabilityEntry(`1.${index + 1}`, [
          ['a. Name and address of creditor', safe(entry.creditorName)],
          ['b. Debtor', safe(entry.debtor)],
          ['c. Amount of original debt', money(entry.originalDebt)],
          ['d. Date of incurring debt', safe(entry.dateIncurred)],
          ['e. Purpose', safe(entry.purpose) + (entry.purpose === 'other' ? ` - ${safe(entry.purposeOther)}` : '')],
          ['f. Monthly or other periodic payment', money(entry.periodicPayment)],
          ['g. Amount of debt as of date of commencement', money(entry.debtCommenced)],
          ['h. Amount of current debt', money(entry.currentDebt)]
        ]);
        accountsPayableTotal += toNum(entry.currentDebt);
      });
      
      totalLiabilitiesValue += createLiabilityTotal('TOTAL: Accounts Payable', accountsPayableTotal);

      // B. Credit Card Debt
      checkPageBreak(80);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('B. Credit Card Debt', margin, y);
      y += 12;
      
      const creditCardEntries = liab.creditCardEntries || [{ id: 1 }, { id: 2 }];
      let creditCardTotal = 0;
      
      creditCardEntries.slice(0, 2).forEach((entry, index) => {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text(`2. ${index + 1}.${index + 1}`, margin + 10, y);
        y += 10;
        
        createDetailedLiabilityEntry(`2.${index + 1}`, [
          ['a. Debtor', safe(entry.debtor)],
          ['b. Amount of original debt', money(entry.originalDebt)],
          ['c. Date of incurring debt', safe(entry.dateIncurred)],
          ['d. Purpose', safe(entry.purpose)],
          ['e. Monthly or other periodic payment', money(entry.periodicPayment)],
          ['f. Amount of debt as of date of commencement', money(entry.debtCommenced)],
          ['g. Amount of current debt', money(entry.currentDebt)]
        ]);
        creditCardTotal += toNum(entry.currentDebt);
      });
      
      totalLiabilitiesValue += createLiabilityTotal('TOTAL: Credit Card Debt', creditCardTotal);

      // C. 3. Mortgages Payable on Real Estate
      checkPageBreak(80);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('C. 3. Mortgages Payable on Real Estate', margin, y);
      y += 12;
      
      const mortgageEntries = liab.mortgageEntries || [{ id: 1 }, { id: 2 }];
      let mortgageTotal = 0;
      
      mortgageEntries.slice(0, 2).forEach((entry, index) => {
        createDetailedLiabilityEntry(`3.${index + 1}`, [
          ['a. Name and address of mortgagee', safe(entry.mortgageeName)],
          ['b. Address of property mortgaged', safe(entry.propertyAddress)],
          ['c. Mortgagor(s)', safe(entry.mortgagor)],
          ['d. Original debt', money(entry.originalDebt)],
          ['e. Date of incurring debt', safe(entry.dateIncurred)],
          ['f. Monthly or other periodic payment', money(entry.periodicPayment)],
          ['g. Maturity date', safe(entry.maturityDate)],
          ['h. Amount of debt as of date of commencement', money(entry.debtCommenced)],
          ['i. Amount of current debt', money(entry.currentDebt)]
        ]);
        mortgageTotal += toNum(entry.currentDebt);
      });
      
      totalLiabilitiesValue += createLiabilityTotal('TOTAL: Mortgages Payable', mortgageTotal);

      // D. 4. Home Equity and Other Lines of Credit
      checkPageBreak(80);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('D. 4. Home Equity and Other Lines of Credit', margin, y);
      y += 12;
      
      const homeEquityEntries = liab.homeEquityEntries || [{ id: 1 }];
      let homeEquityTotal = 0;
      
      homeEquityEntries.slice(0, 1).forEach((entry, index) => {
        createDetailedLiabilityEntry(`4.${index + 1}`, [
          ['a. Name and address of mortgagee', safe(entry.mortgageeName)],
          ['b. Address of property mortgaged', safe(entry.propertyAddress)],
          ['c. Mortgagor(s)', safe(entry.mortgagor)],
          ['d. Original debt', money(entry.originalDebt)],
          ['e. Date of incurring debt', safe(entry.dateIncurred)],
          ['f. Monthly or other periodic payment', money(entry.periodicPayment)],
          ['g. Maturity date', safe(entry.maturityDate)],
          ['h. Amount of debt at date of commencement', money(entry.debtCommenced)],
          ['i. Amount of current debt', money(entry.currentDebt)]
        ]);
        homeEquityTotal += toNum(entry.currentDebt);
      });
      
      totalLiabilitiesValue += createLiabilityTotal('TOTAL: Home Equity and Other Lines of Credit', homeEquityTotal);

      // E. 5. Notes Payable
      checkPageBreak(80);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('E. 5. Notes Payable', margin, y);
      y += 12;
      
      const notesPayableEntries = liab.notesPayableEntries || [{ id: 1 }];
      let notesPayableTotal = 0;
      
      notesPayableEntries.slice(0, 1).forEach((entry, index) => {
        createDetailedLiabilityEntry(`5.${index + 1}`, [
          ['a. Name and address of noteholder', safe(entry.noteholderName)],
          ['b. Debtor', safe(entry.debtor)],
          ['c. Amount of original debt', money(entry.originalDebt)],
          ['d. Date of incurring debt', safe(entry.dateIncurred)],
          ['e. Purpose', safe(entry.purpose)],
          ['f. Monthly or other periodic payment', money(entry.periodicPayment)],
          ['g. Amount of debt as of date of commencement', money(entry.debtCommenced)],
          ['h. Amount of current debt', money(entry.currentDebt)]
        ]);
        notesPayableTotal += toNum(entry.currentDebt);
      });
      
      totalLiabilitiesValue += createLiabilityTotal('TOTAL: Notes Payable', notesPayableTotal);

      // F. 6. Brokers Margin Accounts
      checkPageBreak(80);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('F. 6. Brokers Margin Accounts', margin, y);
      y += 12;
      
      const brokerMarginEntries = liab.brokerMarginEntries || [{ id: 1 }];
      let brokerMarginTotal = 0;
      
      brokerMarginEntries.slice(0, 1).forEach((entry, index) => {
        createDetailedLiabilityEntry(`6.${index + 1}`, [
          ['a. Name and address of broker', safe(entry.brokerName)],
          ['b. Amount of original debt', money(entry.originalDebt)],
          ['c. Date of incurring debt', safe(entry.dateIncurred)],
          ['d. Purpose', safe(entry.purpose)],
          ['e. Monthly or other periodic payment', money(entry.periodicPayment)],
          ['f. Amount of debt as of date of commencement', money(entry.debtCommenced)],
          ['g. Amount of current debt', money(entry.currentDebt)]
        ]);
        brokerMarginTotal += toNum(entry.currentDebt);
      });
      
      totalLiabilitiesValue += createLiabilityTotal('TOTAL: Broker\'s Margin Accounts', brokerMarginTotal);

      // G. 7. Taxes Payable
      checkPageBreak(80);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('G. 7. Taxes Payable', margin, y);
      y += 12;
      
      const taxesPayableEntries = liab.taxesPayableEntries || [{ id: 1 }];
      let taxesPayableTotal = 0;
      
      taxesPayableEntries.slice(0, 1).forEach((entry, index) => {
        createDetailedLiabilityEntry(`7.${index + 1}`, [
          ['a. Description of Tax', safe(entry.taxDescription)],
          ['b. Amount of Tax', money(entry.amount)],
          ['c. Date Due', safe(entry.dateDue)]
        ]);
        taxesPayableTotal += toNum(entry.amount);
      });
      
      totalLiabilitiesValue += createLiabilityTotal('TOTAL: Taxes Payable', taxesPayableTotal);

      // H. 8. Loans on Life Insurance Policies
      checkPageBreak(80);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('H. 8. Loans on Life Insurance Policies', margin, y);
      y += 12;
      
      const lifeInsuranceLoanEntries = liab.lifeInsuranceLoanEntries || [{ id: 1 }];
      let lifeInsuranceLoanTotal = 0;
      
      lifeInsuranceLoanEntries.slice(0, 1).forEach((entry, index) => {
        createDetailedLiabilityEntry(`8.${index + 1}`, [
          ['a. Name and address of insurer', safe(entry.insurerName)],
          ['b. Amount of loan', money(entry.loanAmount)],
          ['c. Date incurred', safe(entry.dateIncurred)],
          ['d. Purpose', safe(entry.purpose)],
          ['e. Name of Borrower', safe(entry.borrowerName)],
          ['f. Monthly or other periodic payment', money(entry.periodicPayment)],
          ['g. Amount of debt as of date of commencement', money(entry.debtCommenced)],
          ['h. Amount of current debt', money(entry.currentDebt)]
        ]);
        lifeInsuranceLoanTotal += toNum(entry.currentDebt);
      });
      
      totalLiabilitiesValue += createLiabilityTotal('TOTAL: Loans on Life Insurance', lifeInsuranceLoanTotal);

      // I. 9. Installment accounts payable
      checkPageBreak(80);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('I. 9. Installment accounts payable (security agreements, chattel mortgages)', margin, y);
      y += 12;
      
      const installmentEntries = liab.installmentAccountEntries || [{ id: 1 }];
      let installmentTotal = 0;
      
      installmentEntries.slice(0, 1).forEach((entry, index) => {
        createDetailedLiabilityEntry(`9.${index + 1}`, [
          ['a. Name and address of creditor', safe(entry.creditorName)],
          ['b. Debtor', safe(entry.debtor)],
          ['c. Amount of original debt', money(entry.originalDebt)],
          ['d. Date of incurring debt', safe(entry.dateIncurred)],
          ['e. Purpose', safe(entry.purpose)],
          ['f. Monthly or other periodic payment', money(entry.periodicPayment)],
          ['g. Amount of debt as of date of commencement', money(entry.debtCommenced)],
          ['h. Amount of current debt', money(entry.currentDebt)]
        ]);
        installmentTotal += toNum(entry.currentDebt);
      });
      
      totalLiabilitiesValue += createLiabilityTotal('TOTAL: Installment Accounts', installmentTotal);

      // J. 10. Other Liabilities
      checkPageBreak(80);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('J. 10. Other Liabilities', margin, y);
      y += 12;
      
      const otherLiabilityEntries = liab.otherLiabilityEntries || [{ id: 1 }, { id: 2 }];
      let otherLiabilityTotal = 0;
      
      otherLiabilityEntries.slice(0, 2).forEach((entry, index) => {
        createDetailedLiabilityEntry(`10.${index + 1}`, [
          ['a. Description', safe(entry.description)],
          ['b. Name and address of creditor', safe(entry.creditorName)],
          ['c. Debtor', safe(entry.debtor)],
          ['d. Original amount of debt', money(entry.originalDebt)],
          ['e. Date incurred', safe(entry.dateIncurred)],
          ['f. Purpose', safe(entry.purpose)],
          ['g. Monthly or other periodic payment', money(entry.periodicPayment)],
          ['h. Amount of debt as of date of commencement', money(entry.debtCommenced)],
          ['i. Amount of current debt', money(entry.currentDebt)]
        ]);
        otherLiabilityTotal += toNum(entry.currentDebt);
      });
      
      totalLiabilitiesValue += createLiabilityTotal('TOTAL: Other Liabilities', otherLiabilityTotal);

      // Final total
      checkPageBreak(30);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('TOTAL LIABILITIES', margin, y);
      doc.text(money(totalLiabilitiesValue), pageWidth - margin - 20, y, { align: 'right' });

      // ========== VI. ASSETS TRANSFERRED ==========
      doc.addPage();
      y = margin;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('VI. ASSETS TRANSFERRED', margin, y);
      y += 16;

      // Add description text
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      const transferDescription = 'List all assets transferred in any manner during the preceding three years, or length of the marriage, whichever is shorter. Note: Transfers in the routine course of business which resulted in an exchange of assets of substantially equivalent value need not be specifically disclosed where such assets are otherwise identified in the Statement of Net Worth.';
      const transferDescLines = doc.splitTextToSize(transferDescription, contentWidth);
      transferDescLines.forEach(line => {
        checkPageBreak(11);
        doc.text(line, margin, y);
        y += 10;
      });
      y += 10;

      // Assets Transferred Table
      checkPageBreak(80);
      const transferredAssets = add.assetsTransferredEntries || [];
      const transferTableData = transferredAssets.length > 0
        ? transferredAssets.map((asset) => [
            safe(asset.description),
            safe(asset.toWhomTransferred) + (asset.relationshipToTransferee ? ` (${safe(asset.relationshipToTransferee)})` : ''),
            safe(asset.dateOfTransfer),
            money(asset.value)
          ])
        : [['', '', '', '']];

      autoTable(doc, {
        startY: y,
        head: [['Description of Property', 'To Whom Transferred and Relationship to Transferee', 'Date of Transfer', 'Value']],
        body: transferTableData,
        theme: 'grid',
        styles: {
          fontSize: 8,
          cellPadding: 3,
          lineColor: [200, 200, 200],
          lineWidth: 0.5
        },
        headStyles: {
          fillColor: [220, 220, 220],
          fontStyle: 'bold',
          fontSize: 8
        },
        columnStyles: {
          0: { cellWidth: contentWidth * 0.35 },
          1: { cellWidth: contentWidth * 0.35 },
          2: { cellWidth: contentWidth * 0.15 },
          3: { cellWidth: contentWidth * 0.15, halign: 'right' }
        },
        margin: { left: margin, right: margin }
      });
      y = doc.lastAutoTable.finalY + 16;

      // ========== VII. LEGAL & EXPERT FEES ==========
      checkPageBreak(60);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('VII. LEGAL & EXPERT FEES', margin, y);
      y += 16;

      // Add description text
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      const legalFeesDesc = 'Please state the amount you have paid to all lawyers and experts retained in connection with your marital dissolution, including name of professional, amounts and dates paid, and source of funds. Attach retainer agreement for your present attorney.';
      const legalFeesDescLines = doc.splitTextToSize(legalFeesDesc, contentWidth);
      legalFeesDescLines.forEach(line => {
        checkPageBreak(11);
        doc.text(line, margin, y);
        y += 10;
      });
      y += 10;

      // Legal Fees Table
      checkPageBreak(80);
      const legalFees = add.legalFeesEntries || [];
      const legalFeesTableData = legalFees.length > 0
        ? legalFees.map((fee) => [
            safe(fee.professionalName),
            safe(fee.typeOfProfessional),
            money(fee.amountPaid),
            safe(fee.datePaid),
            safe(fee.sourceOfFunds)
          ])
        : [['', '', '', '', '']];

      autoTable(doc, {
        startY: y,
        head: [['Name of Professional', 'Type', 'Amount Paid', 'Date Paid', 'Source of Funds']],
        body: legalFeesTableData,
        theme: 'grid',
        styles: {
          fontSize: 8,
          cellPadding: 3,
          lineColor: [200, 200, 200],
          lineWidth: 0.5
        },
        headStyles: {
          fillColor: [220, 220, 220],
          fontStyle: 'bold',
          fontSize: 8
        },
        columnStyles: {
          0: { cellWidth: contentWidth * 0.25 },
          1: { cellWidth: contentWidth * 0.20 },
          2: { cellWidth: contentWidth * 0.20, halign: 'right' },
          3: { cellWidth: contentWidth * 0.15 },
          4: { cellWidth: contentWidth * 0.20 }
        },
        margin: { left: margin, right: margin }
      });
      y = doc.lastAutoTable.finalY + 16;

      // ========== VIII. OTHER DATA ==========
      checkPageBreak(60);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('VIII. OTHER DATA CONCERNING THE FINANCIAL CIRCUMSTANCES OF THE', margin, y);
      y += 12;
      doc.text('PARTIES THAT SHOULD BE BROUGHT TO THE ATTENTION OF THE COURT ARE:', margin, y);
      y += 16;

      // Other Financial Circumstances
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      const otherData = safe(add.otherFinancialCircumstances);
      if (otherData) {
        const otherDataLines = doc.splitTextToSize(otherData, contentWidth);
        otherDataLines.forEach(line => {
          checkPageBreak(11);
          doc.text(line, margin, y);
          y += 10;
        });
      } else {
        doc.text('_____________________________________________________________________', margin, y);
        y += 12;
        doc.text('_____________________________________________________________________', margin, y);
        y += 12;
        doc.text('_____________________________________________________________________', margin, y);
      }
      y += 16;

      // Affirmation
      checkPageBreak(120);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const affirmText = 'The foregoing statements and a rider consisting of _____ page(s) annexed hereto and made a part hereof, have been carefully read by the undersigned who states that they are true and correct and states same, under oath, subject to the penalties of perjury.';
      const affirmLines = doc.splitTextToSize(affirmText, contentWidth);
      affirmLines.forEach(line => {
        doc.text(line, margin, y);
        y += 10;
      });
      y += 16;

      doc.setFontSize(10);
      doc.text('*Sworn to before me this', margin, y);
      doc.text('This is the _______ Statement of Net Worth', pageWidth - margin - 200, y);
      y += 11;
      doc.text('day of _____________, 20__', margin, y);
      doc.text('I have filed in this proceeding.', pageWidth - margin - 200, y);
      y += 22;
      doc.text('________________________', margin, y);
      y += 11;
      doc.text('Notary Public', margin, y);
      y += 18;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('REQUIRED ATTACHMENTS:', margin, y);
      y += 11;
      doc.setFont('helvetica', 'normal');
      doc.text('Retainer Agreement', margin, y);
      y += 10;
      doc.text('Most recent W-2, 1099s, K1s and Income Tax Returns', margin, y);

      // Add page numbers to all pages
      const totalPages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        const w = doc.internal.pageSize.width;
        const h = doc.internal.pageSize.height;
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text('[UCS Rev.1/1/24]', margin, h - 20);
        doc.text(`Page ${i} of ${totalPages}`, w - margin - 60, h - 20);
      }

      // Save
      doc.save('Statement_of_Net_Worth.pdf');
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Error generating PDF: ' + error.message);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Export Statement of Net Worth</h2>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800 mb-2">
          This will generate a complete Statement of Net Worth PDF in the official NYS court format.
        </p>
        <p className="text-sm text-blue-800">
          The PDF will match the official form layout with proper tables and formatting.
        </p>
          </div>
      <button
        onClick={exportToPDF}
        disabled={isExporting}
        className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 w-auto h-auto text-sm ${
          isExporting ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-700'
        }`}
      >
        {isExporting ? '⏳ Generating PDF...' : '📄 Export to PDF'}
      </button>
          </div>
  );
};

export default ComprehensivePDFExport;