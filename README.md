# KYNW Financial Forms

A comprehensive React application for financial disclosure forms used in legal proceedings.

## Features

- **Complete Financial Disclosure**: All required sections (Family Data, Income, Assets, Liabilities, Expenses)
- **Dynamic Forms**: Add/remove multiple entries for each category
- **Auto-save**: Data is automatically saved as you type
- **Export/Import**: Save your progress and reload later
- **Responsive Design**: Works on desktop and mobile devices
- **Professional UI**: Clean, modern interface with Tailwind CSS

## Quick Start

### Prerequisites

Make sure you have Node.js installed on your computer:
- Download from: https://nodejs.org/
- Choose the LTS (Long Term Support) version

### Installation & Running

1. **Open Command Prompt or PowerShell**
   - Press `Win + R`, type `cmd`, and press Enter
   - Or search for "Command Prompt" in the Start menu

2. **Navigate to your project folder**
   ```bash
   cd "C:\Users\olesi\OneDrive\Desktop\KYNW"
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```
   *This will download all required packages (may take a few minutes)*

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   - The application will automatically open in your default browser
   - If not, go to: http://localhost:3000

## How to Use

### Navigation
- Use the tabs at the top to switch between different sections
- Use Previous/Next buttons at the bottom for guided navigation
- Progress indicator shows your current section

### Data Entry
- Fill out each section completely
- Click "+" buttons to add multiple entries (cars, bank accounts, etc.)
- Click "×" to remove entries
- All data saves automatically

### Export/Import
- **Export**: Click "📥 Export Data" to download your data as a JSON file
- **Import**: Click "📤 Import Data" to load previously saved data

### Sections

1. **👨‍👩‍👧‍👦 Family Data**: Basic information, children, employment
2. **💰 Income**: All income sources, employment details
3. **🏠 Assets**: Bank accounts, real estate, investments, etc.
4. **💳 Liabilities**: Debts, mortgages, credit cards, etc.
5. **🛒 Expenses**: Monthly expenses in all categories

## Troubleshooting

### If npm install fails:
```bash
npm cache clean --force
npm install
```

### If the app won't start:
```bash
npm run dev -- --port 3001
```

### If you get permission errors:
- Run Command Prompt as Administrator
- Or use PowerShell as Administrator

## File Structure

```
KYNW/
├── src/
│   ├── App.jsx          # Main application
│   ├── main.jsx         # Entry point
│   └── index.css        # Styles
├── components/
│   ├── assets_complete.tsx
│   ├── expenses_complete.tsx
│   ├── family_data_complete.tsx
│   ├── income_complete.tsx
│   └── liabilities_complete.tsx
├── package.json         # Dependencies
├── vite.config.js       # Build configuration
└── index.html           # Main HTML file
```

## Data Storage

- Data is stored in browser memory while using the app
- Use Export feature to save data permanently
- Import previously exported files to continue work

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Support

If you encounter any issues:
1. Make sure Node.js is installed
2. Check that you're in the correct directory
3. Try clearing npm cache: `npm cache clean --force`
4. Restart the development server

## Development

To make changes to the forms:
1. Edit the respective `.tsx` files
2. The browser will automatically reload with your changes
3. Use browser developer tools (F12) to debug issues