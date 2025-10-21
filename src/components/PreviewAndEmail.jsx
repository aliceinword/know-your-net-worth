import React, { useState, useEffect } from 'react';

const PreviewAndEmail = ({ formData = {}, userRole = 'plaintiff' }) => {
  const [isEmailing, setIsEmailing] = useState(false);
  const [emailData, setEmailData] = useState({
    recipientEmail: '',
    subject: '',
    message: ''
  });

  const safeValue = (value) => {
    return value || 'Not provided';
  };

  const formatCurrency = (amount) => {
    if (!amount || isNaN(amount)) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Generate subject line and message with person's name
  useEffect(() => {
    const generatePersonName = () => {
      let personName = '';
      
      if (userRole === 'plaintiff') {
        // Try to get plaintiff's name from various possible fields
        personName = formData.plaintiffName || 
                    formData.familyData?.plaintiffName ||
                    (formData.familyData?.plaintiffFirstName && formData.familyData?.plaintiffLastName ? 
                      `${formData.familyData.plaintiffFirstName} ${formData.familyData.plaintiffLastName}` : '') ||
                    'Plaintiff';
      } else {
        // Try to get defendant's name from various possible fields
        personName = formData.defendantName || 
                    formData.familyData?.defendantName ||
                    (formData.familyData?.defendantFirstName && formData.familyData?.defendantLastName ? 
                      `${formData.familyData.defendantFirstName} ${formData.familyData.defendantLastName}` : '') ||
                    'Defendant';
      }
      
      // Clean up the name (remove undefined/null values)
      personName = personName.replace(/undefined|null/g, '').trim();
      if (!personName || personName === '') {
        personName = userRole === 'plaintiff' ? 'Plaintiff' : 'Defendant';
      }
      
      return personName;
    };

    const personName = generatePersonName();
    const subject = `Statement of Net Worth - ${personName}`;
    const message = `Dear Recipient,\n\nPlease find attached the Statement of Net Worth document for ${personName}.\n\nThis document contains comprehensive financial information as required for the legal proceedings.\n\nBest regards,\n${personName}`;

    setEmailData(prev => ({
      ...prev,
      subject: subject,
      message: message
    }));
  }, [formData, userRole]);

  const handleEmailSend = async () => {
    if (!emailData.recipientEmail) {
      alert('Please enter a recipient email address.');
      return;
    }

    setIsEmailing(true);
    
    try {
      // Create a comprehensive text version of the form data
      const formText = generateFormText();
      
      // Create a mailto link with the form data
      const subject = encodeURIComponent(emailData.subject);
      const body = encodeURIComponent(`${emailData.message}\n\n${formText}`);
      const mailtoLink = `mailto:${emailData.recipientEmail}?subject=${subject}&body=${body}`;
      
      // Open the default email client
      window.open(mailtoLink);
      
      alert('Email client opened with the form data. Please review and send.');
    } catch (error) {
      console.error('Error preparing email:', error);
      alert('Error preparing email. Please try again.');
    } finally {
      setIsEmailing(false);
    }
  };

  const generateFormText = () => {
    let text = 'STATEMENT OF NET WORTH - PREVIEW\n';
    text += '=====================================\n\n';
    
    // I. FAMILY DATA
    text += 'I. FAMILY DATA\n';
    text += '==============\n';
    text += `(a) Plaintiff's date of birth: ${safeValue(formData.familyData?.plaintiffDateOfBirth)}\n`;
    text += `(b) Defendant's date of birth: ${safeValue(formData.familyData?.defendantDateOfBirth)}\n`;
    text += `(c) Date married: ${safeValue(formData.familyData?.marriageDate)}\n`;
    text += `(d) Names and dates of birth of Child(ren) of the marriage:\n`;
    
    const childrenOfMarriage = formData.familyData?.childrenOfMarriage || [];
    if (childrenOfMarriage.length > 0) {
      childrenOfMarriage.forEach((child, index) => {
        text += `   ${index + 1}. ${safeValue(child.name)} - ${safeValue(child.dateOfBirth)}\n`;
      });
    } else {
      text += '   None\n';
    }
    
    text += `(e) Minor child(ren) of prior marriage: ${safeValue(formData.familyData?.minorChildrenPriorMarriage)}\n`;
    text += `(f) Custody of child(ren) of prior marriage: ${safeValue(formData.familyData?.custodyArrangement)}\n`;
    text += `(g) Plaintiff's present address: ${safeValue(formData.familyData?.plaintiffAddress)}\n`;
    text += `   Defendant's present address: ${safeValue(formData.familyData?.defendantAddress)}\n`;
    text += `(h) Occupation/Employer of Plaintiff: ${safeValue(formData.familyData?.plaintiffOccupation)}\n`;
    text += `   Occupation/Employer of Defendant: ${safeValue(formData.familyData?.defendantOccupation)}\n\n`;

    // II. EXPENSES
    text += 'II. EXPENSES\n';
    text += '============\n';
    
    // Housing
    text += '(a) Housing: Monthly\n';
    text += `1. Mortgage/Co-op Loan: ${formatCurrency(formData.expenses?.housing?.mortgageCoopLoan || 0)}\n`;
    text += `2. Home Equity Line of Credit/Second Mortgage: ${formatCurrency(formData.expenses?.housing?.homeEquityLine || 0)}\n`;
    text += `3. Real Estate Taxes: ${formatCurrency(formData.expenses?.housing?.realEstateTaxes || 0)}\n`;
    text += `4. Homeowners/Renter's Insurance: ${formatCurrency(formData.expenses?.housing?.homeownersInsurance || 0)}\n`;
    text += `5. Homeowner's Association/Maintenance charges: ${formatCurrency(formData.expenses?.housing?.hoaMaintenance || 0)}\n`;
    text += `6. Rent: ${formatCurrency(formData.expenses?.housing?.rent || 0)}\n`;
    text += `7. Other: ${formatCurrency(formData.expenses?.housing?.other || 0)}\n`;
    const housingTotal = (formData.expenses?.housing?.mortgageCoopLoan || 0) + (formData.expenses?.housing?.homeEquityLine || 0) + (formData.expenses?.housing?.realEstateTaxes || 0) + (formData.expenses?.housing?.homeownersInsurance || 0) + (formData.expenses?.housing?.hoaMaintenance || 0) + (formData.expenses?.housing?.rent || 0) + (formData.expenses?.housing?.other || 0);
    text += `TOTAL: HOUSING ${formatCurrency(housingTotal)}\n\n`;

    // Utilities
    text += '(b) Utilities: Monthly\n';
    text += `1. Fuel Oil/Gas: ${formatCurrency(formData.expenses?.utilities?.fuelOilGas || 0)}\n`;
    text += `2. Electric: ${formatCurrency(formData.expenses?.utilities?.electric || 0)}\n`;
    text += `3. Telephone (land line): ${formatCurrency(formData.expenses?.utilities?.landlinePhone || 0)}\n`;
    text += `4. Mobile Phone: ${formatCurrency(formData.expenses?.utilities?.mobilePhone || 0)}\n`;
    text += `5. Cable/Satellite TV: ${formatCurrency(formData.expenses?.utilities?.cableSatellite || 0)}\n`;
    text += `6. Internet: ${formatCurrency(formData.expenses?.utilities?.internet || 0)}\n`;
    text += `7. Alarm: ${formatCurrency(formData.expenses?.utilities?.alarm || 0)}\n`;
    text += `8. Water: ${formatCurrency(formData.expenses?.utilities?.water || 0)}\n`;
    text += `9. Other: ${formatCurrency(formData.expenses?.utilities?.other || 0)}\n`;
    const utilitiesTotal = (formData.expenses?.utilities?.fuelOilGas || 0) + (formData.expenses?.utilities?.electric || 0) + (formData.expenses?.utilities?.landlinePhone || 0) + (formData.expenses?.utilities?.mobilePhone || 0) + (formData.expenses?.utilities?.cableSatellite || 0) + (formData.expenses?.utilities?.internet || 0) + (formData.expenses?.utilities?.alarm || 0) + (formData.expenses?.utilities?.water || 0) + (formData.expenses?.utilities?.other || 0);
    text += `TOTAL: UTILITIES ${formatCurrency(utilitiesTotal)}\n\n`;

    // Food
    text += '(c) Food: Monthly\n';
    text += `1. Groceries: ${formatCurrency(formData.expenses?.food?.groceries || 0)}\n`;
    text += `2. Dining Out/Take Out: ${formatCurrency(formData.expenses?.food?.diningOut || 0)}\n`;
    text += `3. Other: ${formatCurrency(formData.expenses?.food?.other || 0)}\n`;
    const foodTotal = (formData.expenses?.food?.groceries || 0) + (formData.expenses?.food?.diningOut || 0) + (formData.expenses?.food?.other || 0);
    text += `TOTAL: FOOD ${formatCurrency(foodTotal)}\n\n`;

    // Clothing
    text += '(d) Clothing: Monthly\n';
    text += `1. Yourself: ${formatCurrency(formData.expenses?.clothing?.yourself || 0)}\n`;
    text += `2. Child(ren): ${formatCurrency(formData.expenses?.clothing?.children || 0)}\n`;
    text += `3. Dry Cleaning: ${formatCurrency(formData.expenses?.clothing?.dryCleaning || 0)}\n`;
    text += `4. Other: ${formatCurrency(formData.expenses?.clothing?.other || 0)}\n`;
    const clothingTotal = (formData.expenses?.clothing?.yourself || 0) + (formData.expenses?.clothing?.children || 0) + (formData.expenses?.clothing?.dryCleaning || 0) + (formData.expenses?.clothing?.other || 0);
    text += `TOTAL: CLOTHING ${formatCurrency(clothingTotal)}\n\n`;

    // Insurance
    text += '(e) Insurance: Monthly\n';
    text += `1. Life: ${formatCurrency(formData.expenses?.insurance?.life || 0)}\n`;
    text += `2. Fire, theft and liability: ${formatCurrency(formData.expenses?.insurance?.fireTheftLiability || 0)}\n`;
    text += `3. Automotive: ${formatCurrency(formData.expenses?.insurance?.automotive || 0)}\n`;
    text += `4. Umbrella Policy: ${formatCurrency(formData.expenses?.insurance?.umbrellaPolicy || 0)}\n`;
    text += `5. Medical Plan for yourself: ${formatCurrency(formData.expenses?.insurance?.medicalPlanYourself || 0)}\n`;
    text += `5A. Medical Plan for yourself (carrier): ${safeValue(formData.expenses?.insurance?.medicalPlanYourselfCarrier)}\n`;
    text += `5B. Medical Plan for children (carrier): ${safeValue(formData.expenses?.insurance?.medicalPlanChildrenCarrier)}\n`;
    text += `6. Dental Plan: ${formatCurrency(formData.expenses?.insurance?.dentalPlan || 0)}\n`;
    text += `7. Optical Plan: ${formatCurrency(formData.expenses?.insurance?.opticalPlan || 0)}\n`;
    text += `8. Disability: ${formatCurrency(formData.expenses?.insurance?.disability || 0)}\n`;
    text += `9. Worker's Compensation: ${formatCurrency(formData.expenses?.insurance?.workersCompensation || 0)}\n`;
    text += `10. Long Term Care Insurance: ${formatCurrency(formData.expenses?.insurance?.longTermCare || 0)}\n`;
    text += `11. Other: ${formatCurrency(formData.expenses?.insurance?.other || 0)}\n`;
    const insuranceTotal = (formData.expenses?.insurance?.life || 0) + (formData.expenses?.insurance?.fireTheftLiability || 0) + (formData.expenses?.insurance?.automotive || 0) + (formData.expenses?.insurance?.umbrellaPolicy || 0) + (formData.expenses?.insurance?.medicalPlanYourself || 0) + (formData.expenses?.insurance?.medicalPlanChildren || 0) + (formData.expenses?.insurance?.dentalPlan || 0) + (formData.expenses?.insurance?.opticalPlan || 0) + (formData.expenses?.insurance?.disability || 0) + (formData.expenses?.insurance?.workersCompensation || 0) + (formData.expenses?.insurance?.longTermCare || 0) + (formData.expenses?.insurance?.other || 0);
    text += `TOTAL: INSURANCE ${formatCurrency(insuranceTotal)}\n\n`;

    // III. GROSS INCOME INFORMATION
    text += 'III. GROSS INCOME INFORMATION\n';
    text += '=============================\n';
    text += `(a) Gross (total) income: ${formatCurrency(formData.income?.grossIncome || 0)}\n`;
    text += `Income change explanation: ${safeValue(formData.income?.incomeChangeExplanation)}\n`;
    text += `Retirement/tax-deferred savings deductions: ${formatCurrency(formData.income?.retirementDeductions || 0)}\n\n`;

    text += '(b) Additional income sources:\n';
    text += `1. Investment income: ${formatCurrency(formData.income?.investmentIncome || 0)}\n`;
    text += `2. Worker's compensation: ${formatCurrency(formData.income?.workersCompensation || 0)}\n`;
    text += `3. Disability benefits: ${formatCurrency(formData.income?.disabilityBenefits || 0)}\n`;
    text += `4. Unemployment insurance: ${formatCurrency(formData.income?.unemploymentInsurance || 0)}\n`;
    text += `5. Social Security benefits: ${formatCurrency(formData.income?.socialSecurityBenefits || 0)}\n`;
    text += `6. Public assistance: ${formatCurrency(formData.income?.publicAssistance || 0)}\n`;
    text += `7. Food stamps: ${formatCurrency(formData.income?.foodStamps || 0)}\n`;
    text += `8. Veterans benefits: ${formatCurrency(formData.income?.veteransBenefits || 0)}\n`;
    text += `9. Pensions and retirement benefits: ${formatCurrency(formData.income?.pensionRetirement || 0)}\n`;
    text += `10. Fellowships and stipends: ${formatCurrency(formData.income?.fellowshipsStipends || 0)}\n`;
    text += `11. Annuity payments: ${formatCurrency(formData.income?.annuityPayments || 0)}\n\n`;

    text += `(c) Employed household members: ${safeValue(formData.income?.employedHouseholdMembers)}\n`;
    text += `(d) Maintenance and child support received: ${formatCurrency(formData.income?.maintenanceChildSupport || 0)}\n`;
    text += `(e) Other income: ${formatCurrency(formData.income?.otherIncome || 0)}\n`;
    text += `Description: ${safeValue(formData.income?.otherIncomeDescription)}\n\n`;

    // IV. ASSETS
    text += 'IV. ASSETS\n';
    text += '==========\n';
    
    // Cash Accounts
    text += 'A.1. Cash Accounts:\n';
    text += 'Cash:\n';
    text += `a. Location: ${safeValue(formData.assets?.cashLocation)}\n`;
    text += `b. Source of Funds: ${safeValue(formData.assets?.cashSource)}\n`;
    text += `c. Amount as of date of commencement: ${formatCurrency(formData.assets?.cashAmountCommenced || 0)}\n`;
    text += `d. Current amount: ${formatCurrency(formData.assets?.cashAmount || 0)}\n\n`;

    // Checking Accounts
    text += '2. Checking Accounts:\n';
    const checkingAccounts = formData.assets?.checkingAccounts || [];
    if (checkingAccounts.length > 0) {
      checkingAccounts.forEach((account, index) => {
        text += `${index + 1}. Account ${index + 1}:\n`;
        text += `a. Financial Institution: ${safeValue(account.financialInstitution)}\n`;
        text += `b. Account Number: ${safeValue(account.accountNumber)}\n`;
        text += `c. Title holder: ${safeValue(account.titleHolder)}\n`;
        text += `d. Date opened: ${safeValue(account.dateOpened)}\n`;
        text += `e. Source of Funds: ${safeValue(account.sourceOfFunds)}\n`;
        text += `f. Balance as of date of commencement: ${formatCurrency(account.balanceCommenced || 0)}\n`;
        text += `g. Current balance: ${formatCurrency(account.currentBalance || 0)}\n\n`;
      });
    } else {
      text += 'No checking accounts\n\n';
    }

    // Savings Accounts
    text += '3. Savings Accounts:\n';
    const savingsAccounts = formData.assets?.savingsAccounts || [];
    if (savingsAccounts.length > 0) {
      savingsAccounts.forEach((account, index) => {
        text += `${index + 1}. Account ${index + 1}:\n`;
        text += `a. Financial Institution: ${safeValue(account.financialInstitution)}\n`;
        text += `b. Account Number: ${safeValue(account.accountNumber)}\n`;
        text += `c. Title holder: ${safeValue(account.titleHolder)}\n`;
        text += `d. Type of account: ${safeValue(account.accountType)}\n`;
        text += `e. Date opened: ${safeValue(account.dateOpened)}\n`;
        text += `f. Source of Funds: ${safeValue(account.sourceOfFunds)}\n`;
        text += `g. Balance as of date of commencement: ${formatCurrency(account.balanceCommenced || 0)}\n`;
        text += `h. Current balance: ${formatCurrency(account.currentBalance || 0)}\n\n`;
      });
    } else {
      text += 'No savings accounts\n\n';
    }

    // Real Estate
    text += 'B.4. Real Estate:\n';
    const realEstateEntries = formData.assets?.realEstateEntries || [];
    if (realEstateEntries.length > 0) {
      realEstateEntries.forEach((property, index) => {
        text += `${index + 1}. Property ${index + 1}:\n`;
        text += `a. Description: ${safeValue(property.description)}\n`;
        text += `b. Title owner: ${safeValue(property.titleOwner)}\n`;
        text += `c. Date of acquisition: ${safeValue(property.acquisitionDate)}\n`;
        text += `d. Original price: ${formatCurrency(property.originalPrice || 0)}\n`;
        text += `e. Source of funds to acquire: ${safeValue(property.sourceOfFunds)}\n`;
        text += `f. Amount of mortgage or lien unpaid: ${formatCurrency(property.unpaidMortgage || 0)}\n`;
        text += `g. Estimate current fair market value: ${formatCurrency(property.currentValue || 0)}\n\n`;
      });
    } else {
      text += 'No real estate entries\n\n';
    }

    // V. LIABILITIES
    text += 'V. LIABILITIES\n';
    text += '==============\n';
    
    // Accounts Payable
    text += 'A.1. Accounts Payable:\n';
    const accountsPayableEntries = formData.liabilities?.accountsPayableEntries || [];
    if (accountsPayableEntries.length > 0) {
      accountsPayableEntries.forEach((entry, index) => {
        text += `${index + 1}. Account ${index + 1}:\n`;
        text += `a. Name and address of creditor: ${safeValue(entry.creditorNameAddress)}\n`;
        text += `b. Debtor: ${safeValue(entry.debtor)}\n`;
        text += `c. Amount of original debt: ${formatCurrency(entry.originalDebt || 0)}\n`;
        text += `d. Date of incurring debt: ${safeValue(entry.dateIncurred)}\n`;
        text += `e. Purpose: ${safeValue(entry.purpose)}\n`;
        text += `f. Monthly or other periodic payment: ${formatCurrency(entry.periodicPayment || 0)}\n`;
        text += `g. Amount of debt as of date of commencement: ${formatCurrency(entry.debtAtCommencement || 0)}\n`;
        text += `h. Amount of current debt: ${formatCurrency(entry.currentDebt || 0)}\n\n`;
      });
    } else {
      text += 'No accounts payable entries\n\n';
    }

    // Credit Card Debt
    text += 'B.2. Credit Card Debt:\n';
    const creditCardEntries = formData.liabilities?.creditCardEntries || [];
    if (creditCardEntries.length > 0) {
      creditCardEntries.forEach((debt, index) => {
        text += `${index + 1}. Card ${index + 1}:\n`;
        text += `a. Debtor: ${safeValue(debt.debtor)}\n`;
        text += `b. Amount of original debt: ${formatCurrency(debt.originalDebt || 0)}\n`;
        text += `c. Date of incurring debt: ${safeValue(debt.dateIncurred)}\n`;
        text += `d. Purpose: ${safeValue(debt.purpose)}\n`;
        text += `e. Monthly or other periodic payment: ${formatCurrency(debt.periodicPayment || 0)}\n`;
        text += `f. Amount of debt as of date of commencement: ${formatCurrency(debt.debtAtCommencement || 0)}\n`;
        text += `g. Amount of current debt: ${formatCurrency(debt.currentDebt || 0)}\n\n`;
      });
    } else {
      text += 'No credit card debt entries\n\n';
    }

    // VI. ASSETS TRANSFERRED
    text += 'VI. ASSETS TRANSFERRED\n';
    text += '======================\n';
    const assetsTransferredEntries = formData.additionalSections?.assetsTransferredEntries || [];
    if (assetsTransferredEntries.length > 0) {
      assetsTransferredEntries.forEach((entry, index) => {
        text += `${index + 1}. ${entry.description || 'Asset'}:\n`;
        text += `To whom transferred: ${safeValue(entry.toWhomTransferred)}\n`;
        text += `Date of transfer: ${safeValue(entry.dateOfTransfer)}\n`;
        text += `Value: ${formatCurrency(entry.value || 0)}\n\n`;
      });
    } else {
      text += 'No assets transferred entries\n\n';
    }

    // VII. LEGAL & EXPERT FEES
    text += 'VII. LEGAL & EXPERT FEES\n';
    text += '========================\n';
    const legalFeesEntries = formData.additionalSections?.legalFeesEntries || [];
    if (legalFeesEntries.length > 0) {
      legalFeesEntries.forEach((entry, index) => {
        text += `${index + 1}. ${entry.professionalName || 'Professional'}:\n`;
        text += `Type of professional: ${safeValue(entry.typeOfProfessional)}\n`;
        text += `Amount paid: ${formatCurrency(entry.amountPaid || 0)}\n`;
        text += `Date paid: ${safeValue(entry.datePaid)}\n`;
        text += `Source of funds: ${safeValue(entry.sourceOfFunds)}\n\n`;
      });
    } else {
      text += 'No legal fees entries\n\n';
    }

    // VIII. OTHER FINANCIAL CIRCUMSTANCES
    text += 'VIII. OTHER FINANCIAL CIRCUMSTANCES\n';
    text += '====================================\n';
    const otherFinancialCircumstances = formData.additionalSections?.otherFinancialCircumstances || '';
    if (otherFinancialCircumstances) {
      text += otherFinancialCircumstances + '\n\n';
    } else {
      text += 'No additional financial circumstances provided\n\n';
    }

    return text;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Email Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          📧 Email Preview
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recipient Email Address
              </label>
              <input
                type="email"
                value={emailData.recipientEmail}
                onChange={(e) => setEmailData({...emailData, recipientEmail: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="recipient@example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                value={emailData.subject}
                onChange={(e) => setEmailData({...emailData, subject: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              value={emailData.message}
              onChange={(e) => setEmailData({...emailData, message: e.target.value})}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <button
            onClick={handleEmailSend}
            disabled={isEmailing}
            className={`px-4 py-2 rounded-lg transition flex items-center gap-2 text-sm font-medium shadow-lg ${
              isEmailing 
                ? 'bg-gray-400 text-white cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isEmailing ? '⏳ Preparing Email...' : '📧 Send Email Preview'}
          </button>
        </div>
      </div>

      {/* Preview Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          👁️ Form Data Preview
        </h3>
        
        <div className="bg-gray-50 p-6 rounded-md border max-h-[600px] overflow-y-auto">
          <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono leading-relaxed">
            {generateFormText()}
          </pre>
        </div>
        
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => {
              const text = generateFormText();
              navigator.clipboard.writeText(text);
              alert('Form data copied to clipboard!');
            }}
            className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition flex items-center gap-1 text-sm font-medium shadow-lg"
          >
            📋 Copy to Clipboard
          </button>
          
          <button
            onClick={() => {
              const text = generateFormText();
              const blob = new Blob([text], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'Statement_of_Net_Worth_Preview.txt';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }}
            className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-1 text-sm font-medium shadow-lg"
          >
            💾 Download as Text File
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreviewAndEmail;