import React, { useState } from 'react';

// Move MoneyInput outside the component to prevent recreation
const MoneyInput = ({ value, onChange, placeholder = "0.00" }) => (
  <div className="relative">
    <span className="absolute left-3 top-2 text-gray-500">$</span>
    <input
      type="number"
      step="0.01"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
    />
  </div>
);

const CompleteLiabilitiesForm = ({ formData = {}, updateFormData, userRole = 'plaintiff' }) => {
  const [accountsPayableEntries, setAccountsPayableEntries] = useState(formData.accountsPayableEntries || [{ id: 1 }]);
  const [creditCardEntries, setCreditCardEntries] = useState(formData.creditCardEntries || [{ id: 1 }]);
  const [mortgageEntries, setMortgageEntries] = useState(formData.mortgageEntries || [{ id: 1 }]);
  const [homeEquityEntries, setHomeEquityEntries] = useState(formData.homeEquityEntries || [{ id: 1 }]);
  const [notesPayableEntries, setNotesPayableEntries] = useState(formData.notesPayableEntries || [{ id: 1 }]);
  const [brokerMarginEntries, setBrokerMarginEntries] = useState(formData.brokerMarginEntries || [{ id: 1 }]);
  const [taxesPayableEntries, setTaxesPayableEntries] = useState(formData.taxesPayableEntries || [{ id: 1 }]);
  const [lifeInsuranceLoanEntries, setLifeInsuranceLoanEntries] = useState(formData.lifeInsuranceLoanEntries || [{ id: 1 }]);
  const [installmentAccountEntries, setInstallmentAccountEntries] = useState(formData.installmentAccountEntries || [{ id: 1 }]);
  const [otherLiabilityEntries, setOtherLiabilityEntries] = useState(formData.otherLiabilityEntries || [{ id: 1 }]);

  const addEntry = (entries, setEntries, fieldName) => {
    const newId = Math.max(...entries.map(e => e.id), 0) + 1;
    const newEntries = [...entries, { id: newId }];
    setEntries(newEntries);
    updateFormData('liabilities', fieldName, newEntries);
  };

  const removeEntry = (entries, setEntries, fieldName, id) => {
    const newEntries = entries.filter(entry => entry.id !== id);
    setEntries(newEntries);
    updateFormData('liabilities', fieldName, newEntries);
  };

  const updateEntry = (entries, setEntries, fieldName, id, field, value) => {
    const newEntries = entries.map(entry => 
      entry.id === id ? { ...entry, [field]: value } : entry
    );
    setEntries(newEntries);
    updateFormData('liabilities', fieldName, newEntries);
  };

  // Safe number conversion function
  const toNumber = (value) => {
    if (value === '' || value === null || value === undefined) return 0;
    const num = parseFloat(value);
    return isNaN(num) ? 0 : num;
  };

  // Calculate totals with safe conversion
  const accountsPayableTotal = accountsPayableEntries.reduce((sum, entry) => sum + toNumber(entry.currentDebt), 0);
  const creditCardTotal = creditCardEntries.reduce((sum, entry) => sum + toNumber(entry.currentDebt), 0);
  const mortgageTotal = mortgageEntries.reduce((sum, entry) => sum + toNumber(entry.currentDebt), 0);
  const homeEquityTotal = homeEquityEntries.reduce((sum, entry) => sum + toNumber(entry.currentDebt), 0);
  const notesPayableTotal = notesPayableEntries.reduce((sum, entry) => sum + toNumber(entry.currentDebt), 0);
  const brokerMarginTotal = brokerMarginEntries.reduce((sum, entry) => sum + toNumber(entry.currentDebt), 0);
  const taxesPayableTotal = taxesPayableEntries.reduce((sum, entry) => sum + toNumber(entry.amount), 0);
  const lifeInsuranceLoanTotal = lifeInsuranceLoanEntries.reduce((sum, entry) => sum + toNumber(entry.currentDebt), 0);
  const installmentAccountTotal = installmentAccountEntries.reduce((sum, entry) => sum + toNumber(entry.currentDebt), 0);
  const otherLiabilityTotal = otherLiabilityEntries.reduce((sum, entry) => sum + toNumber(entry.currentDebt), 0);

  const totalLiabilities = accountsPayableTotal + creditCardTotal + mortgageTotal + homeEquityTotal + 
                          notesPayableTotal + brokerMarginTotal + taxesPayableTotal + lifeInsuranceLoanTotal + 
                          installmentAccountTotal + otherLiabilityTotal;

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="bg-red-50 border-l-4 border-red-600 p-4">
        <h2 className="text-lg font-semibold text-red-900">V. LIABILITIES</h2>
      </div>

      <div className="bg-white shadow rounded-lg p-6 space-y-8">
        {/* A. Accounts Payable */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-md font-medium text-gray-900">A. Accounts Payable</h3>
            <button
              type="button"
              onClick={() => addEntry(accountsPayableEntries, setAccountsPayableEntries, 'accountsPayableEntries')}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              + Add Account
            </button>
          </div>
          
          {accountsPayableEntries.map((entry, index) => (
            <div key={entry.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-800">1.{index + 1}</h4>
                {accountsPayableEntries.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEntry(accountsPayableEntries, setAccountsPayableEntries, 'accountsPayableEntries', entry.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">a. Name and address of creditor</label>
                  <input
                    type="text"
                    value={entry.creditorName || ''}
                    onChange={(e) => updateEntry(accountsPayableEntries, setAccountsPayableEntries, 'accountsPayableEntries', entry.id, 'creditorName', e.target.value)}
                    placeholder="Creditor name and address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">b. Debtor</label>
                  <input
                    type="text"
                    value={entry.debtor || ''}
                    onChange={(e) => updateEntry(accountsPayableEntries, setAccountsPayableEntries, 'accountsPayableEntries', entry.id, 'debtor', e.target.value)}
                    placeholder="Debtor name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">c. Amount of original debt</label>
                  <MoneyInput
                    value={entry.originalDebt}
                    onChange={(value) => updateEntry(accountsPayableEntries, setAccountsPayableEntries, 'accountsPayableEntries', entry.id, 'originalDebt', value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">d. Date of incurring debt</label>
                  <input
                    type="date"
                    value={entry.dateIncurred || ''}
                    onChange={(e) => updateEntry(accountsPayableEntries, setAccountsPayableEntries, 'accountsPayableEntries', entry.id, 'dateIncurred', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">e. Purpose</label>
                  <select
                    value={entry.purpose || ''}
                    onChange={(e) => updateEntry(accountsPayableEntries, setAccountsPayableEntries, 'accountsPayableEntries', entry.id, 'purpose', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
                  >
                    <option value="">Select Purpose</option>
                    <option value="medical">Medical Expenses</option>
                    <option value="legal">Legal Fees</option>
                    <option value="business">Business Expenses</option>
                    <option value="personal">Personal Expenses</option>
                    <option value="education">Education</option>
                    <option value="home-improvement">Home Improvement</option>
                    <option value="vehicle">Vehicle Purchase/Repair</option>
                    <option value="taxes">Tax Payments</option>
                    <option value="other">Other</option>
                  </select>
                  {entry.purpose === 'other' && (
                    <input
                      type="text"
                      value={entry.purposeOther || ''}
                      onChange={(e) => updateEntry(accountsPayableEntries, setAccountsPayableEntries, 'accountsPayableEntries', entry.id, 'purposeOther', e.target.value)}
                      placeholder="Please specify purpose"
                      className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
                    />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">f. Monthly or other periodic payment</label>
                  <MoneyInput
                    value={entry.periodicPayment}
                    onChange={(value) => updateEntry(accountsPayableEntries, setAccountsPayableEntries, 'accountsPayableEntries', entry.id, 'periodicPayment', value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">g. Amount of debt as of date of commencement</label>
                  <MoneyInput
                    value={entry.debtCommenced}
                    onChange={(value) => updateEntry(accountsPayableEntries, setAccountsPayableEntries, 'accountsPayableEntries', entry.id, 'debtCommenced', value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">h. Amount of current debt</label>
                  <MoneyInput
                    value={entry.currentDebt}
                    onChange={(value) => updateEntry(accountsPayableEntries, setAccountsPayableEntries, 'accountsPayableEntries', entry.id, 'currentDebt', value)}
                  />
                </div>
              </div>
            </div>
          ))}
          
          <div className="bg-red-50 p-3 rounded">
            <div className="flex justify-between items-center">
              <span className="font-medium text-red-900">TOTAL: ACCOUNTS PAYABLE</span>
              <span className="font-bold text-red-900">${accountsPayableTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* B. Credit Card Debt */}
        <div className="space-y-4 border-t pt-6">
          <div className="flex justify-between items-center">
            <h3 className="text-md font-medium text-gray-900">B. Credit Card Debt</h3>
            <button
              type="button"
              onClick={() => addEntry(creditCardEntries, setCreditCardEntries, 'creditCardEntries')}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              + Add Card
            </button>
          </div>
          
          {creditCardEntries.map((entry, index) => (
            <div key={entry.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-800">2.{index + 1}</h4>
                {creditCardEntries.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEntry(creditCardEntries, setCreditCardEntries, 'creditCardEntries', entry.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">a. Debtor</label>
                  <input
                    type="text"
                    value={entry.debtor || ''}
                    onChange={(e) => updateEntry(creditCardEntries, setCreditCardEntries, 'creditCardEntries', entry.id, 'debtor', e.target.value)}
                    placeholder="Debtor name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">b. Amount of original debt</label>
                  <MoneyInput
                    value={entry.originalDebt}
                    onChange={(value) => updateEntry(creditCardEntries, setCreditCardEntries, 'creditCardEntries', entry.id, 'originalDebt', value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">c. Date of incurring debt</label>
                  <input
                    type="date"
                    value={entry.dateIncurred || ''}
                    onChange={(e) => updateEntry(creditCardEntries, setCreditCardEntries, 'creditCardEntries', entry.id, 'dateIncurred', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">d. Purpose</label>
                  <input
                    type="text"
                    value={entry.purpose || ''}
                    onChange={(e) => updateEntry(creditCardEntries, setCreditCardEntries, 'creditCardEntries', entry.id, 'purpose', e.target.value)}
                    placeholder="Purpose of debt"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">e. Monthly or other periodic payment</label>
                  <MoneyInput
                    value={entry.periodicPayment}
                    onChange={(value) => updateEntry(creditCardEntries, setCreditCardEntries, 'creditCardEntries', entry.id, 'periodicPayment', value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">f. Amount of debt as of date of commencement</label>
                  <MoneyInput
                    value={entry.debtCommenced}
                    onChange={(value) => updateEntry(creditCardEntries, setCreditCardEntries, 'creditCardEntries', entry.id, 'debtCommenced', value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">g. Amount of current debt</label>
                  <MoneyInput
                    value={entry.currentDebt}
                    onChange={(value) => updateEntry(creditCardEntries, setCreditCardEntries, 'creditCardEntries', entry.id, 'currentDebt', value)}
                  />
                </div>
              </div>
            </div>
          ))}
          
          <div className="bg-red-50 p-3 rounded">
            <div className="flex justify-between items-center">
              <span className="font-medium text-red-900">TOTAL: CREDIT CARD DEBT</span>
              <span className="font-bold text-red-900">${creditCardTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* C. Mortgages Payable on Real Estate */}
        <div className="space-y-4 border-t pt-6">
          <div className="flex justify-between items-center">
            <h3 className="text-md font-medium text-gray-900">C. Mortgages Payable on Real Estate</h3>
            <button
              type="button"
              onClick={() => addEntry(mortgageEntries, setMortgageEntries, 'mortgageEntries')}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              + Add Mortgage
            </button>
          </div>
          
          {mortgageEntries.map((entry, index) => (
            <div key={entry.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-800">3.{index + 1}</h4>
                {mortgageEntries.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEntry(mortgageEntries, setMortgageEntries, 'mortgageEntries', entry.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">a. Name and address of mortgagee</label>
                  <input
                    type="text"
                    value={entry.mortgageeName || ''}
                    onChange={(e) => updateEntry(mortgageEntries, setMortgageEntries, 'mortgageEntries', entry.id, 'mortgageeName', e.target.value)}
                    placeholder="Mortgagee name and address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">b. Address of property mortgaged</label>
                  <input
                    type="text"
                    value={entry.propertyAddress || ''}
                    onChange={(e) => updateEntry(mortgageEntries, setMortgageEntries, 'mortgageEntries', entry.id, 'propertyAddress', e.target.value)}
                    placeholder="Property address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">c. Mortgagor(s)</label>
                  <input
                    type="text"
                    value={entry.mortgagor || ''}
                    onChange={(e) => updateEntry(mortgageEntries, setMortgageEntries, 'mortgageEntries', entry.id, 'mortgagor', e.target.value)}
                    placeholder="Mortgagor name(s)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">d. Original debt</label>
                  <MoneyInput
                    value={entry.originalDebt}
                    onChange={(value) => updateEntry(mortgageEntries, setMortgageEntries, 'mortgageEntries', entry.id, 'originalDebt', value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">e. Date of incurring debt</label>
                  <input
                    type="date"
                    value={entry.dateIncurred || ''}
                    onChange={(e) => updateEntry(mortgageEntries, setMortgageEntries, 'mortgageEntries', entry.id, 'dateIncurred', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">f. Monthly or other periodic payment</label>
                  <MoneyInput
                    value={entry.periodicPayment}
                    onChange={(value) => updateEntry(mortgageEntries, setMortgageEntries, 'mortgageEntries', entry.id, 'periodicPayment', value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">g. Maturity date</label>
                  <input
                    type="date"
                    value={entry.maturityDate || ''}
                    onChange={(e) => updateEntry(mortgageEntries, setMortgageEntries, 'mortgageEntries', entry.id, 'maturityDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">h. Amount of debt as of date of commencement</label>
                  <MoneyInput
                    value={entry.debtCommenced}
                    onChange={(value) => updateEntry(mortgageEntries, setMortgageEntries, 'mortgageEntries', entry.id, 'debtCommenced', value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">i. Amount of current debt</label>
                  <MoneyInput
                    value={entry.currentDebt}
                    onChange={(value) => updateEntry(mortgageEntries, setMortgageEntries, 'mortgageEntries', entry.id, 'currentDebt', value)}
                  />
                </div>
              </div>
            </div>
          ))}
          
          <div className="bg-red-50 p-3 rounded">
            <div className="flex justify-between items-center">
              <span className="font-medium text-red-900">TOTAL: MORTGAGES PAYABLE</span>
              <span className="font-bold text-red-900">${mortgageTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* D. Home Equity and Other Lines of Credit */}
        <div className="space-y-4 border-t pt-6">
          <div className="flex justify-between items-center">
            <h3 className="text-md font-medium text-gray-900">D. Home Equity and Other Lines of Credit</h3>
            <button
              type="button"
              onClick={() => addEntry(homeEquityEntries, setHomeEquityEntries, 'homeEquityEntries')}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              + Add Line of Credit
            </button>
          </div>
          
          {homeEquityEntries.map((entry, index) => (
            <div key={entry.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-800">4.{index + 1}</h4>
                {homeEquityEntries.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEntry(homeEquityEntries, setHomeEquityEntries, 'homeEquityEntries', entry.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">a. Name and address of mortgagee</label>
                  <input
                    type="text"
                    value={entry.mortgageeName || ''}
                    onChange={(e) => updateEntry(homeEquityEntries, setHomeEquityEntries, 'homeEquityEntries', entry.id, 'mortgageeName', e.target.value)}
                    placeholder="Lender name and address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">b. Address of property mortgaged</label>
                  <input
                    type="text"
                    value={entry.propertyAddress || ''}
                    onChange={(e) => updateEntry(homeEquityEntries, setHomeEquityEntries, 'homeEquityEntries', entry.id, 'propertyAddress', e.target.value)}
                    placeholder="Property address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">c. Mortgagor(s)</label>
                  <input
                    type="text"
                    value={entry.mortgagor || ''}
                    onChange={(e) => updateEntry(homeEquityEntries, setHomeEquityEntries, 'homeEquityEntries', entry.id, 'mortgagor', e.target.value)}
                    placeholder="Borrower name(s)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">d. Original debt</label>
                  <MoneyInput
                    value={entry.originalDebt}
                    onChange={(value) => updateEntry(homeEquityEntries, setHomeEquityEntries, 'homeEquityEntries', entry.id, 'originalDebt', value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">e. Date of incurring debt</label>
                  <input
                    type="date"
                    value={entry.dateIncurred || ''}
                    onChange={(e) => updateEntry(homeEquityEntries, setHomeEquityEntries, 'homeEquityEntries', entry.id, 'dateIncurred', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">f. Monthly or other periodic payment</label>
                  <MoneyInput
                    value={entry.periodicPayment}
                    onChange={(value) => updateEntry(homeEquityEntries, setHomeEquityEntries, 'homeEquityEntries', entry.id, 'periodicPayment', value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">g. Maturity date</label>
                  <input
                    type="date"
                    value={entry.maturityDate || ''}
                    onChange={(e) => updateEntry(homeEquityEntries, setHomeEquityEntries, 'homeEquityEntries', entry.id, 'maturityDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">h. Amount of debt at date of commencement</label>
                  <MoneyInput
                    value={entry.debtCommenced}
                    onChange={(value) => updateEntry(homeEquityEntries, setHomeEquityEntries, 'homeEquityEntries', entry.id, 'debtCommenced', value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">i. Amount of current debt</label>
                  <MoneyInput
                    value={entry.currentDebt}
                    onChange={(value) => updateEntry(homeEquityEntries, setHomeEquityEntries, 'homeEquityEntries', entry.id, 'currentDebt', value)}
                  />
                </div>
              </div>
            </div>
          ))}
          
          <div className="bg-red-50 p-3 rounded">
            <div className="flex justify-between items-center">
              <span className="font-medium text-red-900">TOTAL: HOME EQUITY AND OTHER LINES OF CREDIT</span>
              <span className="font-bold text-red-900">${homeEquityTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* E. Notes Payable */}
        <div className="space-y-4 border-t pt-6">
          <div className="flex justify-between items-center">
            <h3 className="text-md font-medium text-gray-900">E. Notes Payable</h3>
            <button
              type="button"
              onClick={() => addEntry(notesPayableEntries, setNotesPayableEntries, 'notesPayableEntries')}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              + Add Note
            </button>
          </div>
          
          {notesPayableEntries.map((entry, index) => (
            <div key={entry.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-800">5.{index + 1}</h4>
                {notesPayableEntries.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEntry(notesPayableEntries, setNotesPayableEntries, 'notesPayableEntries', entry.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">a. Name and address of noteholder</label>
                  <input
                    type="text"
                    value={entry.noteholderName || ''}
                    onChange={(e) => updateEntry(notesPayableEntries, setNotesPayableEntries, 'notesPayableEntries', entry.id, 'noteholderName', e.target.value)}
                    placeholder="Noteholder name and address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">b. Debtor</label>
                  <input
                    type="text"
                    value={entry.debtor || ''}
                    onChange={(e) => updateEntry(notesPayableEntries, setNotesPayableEntries, 'notesPayableEntries', entry.id, 'debtor', e.target.value)}
                    placeholder="Debtor name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">c. Amount of original debt</label>
                  <MoneyInput
                    value={entry.originalDebt}
                    onChange={(value) => updateEntry(notesPayableEntries, setNotesPayableEntries, 'notesPayableEntries', entry.id, 'originalDebt', value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">d. Date of incurring debt</label>
                  <input
                    type="date"
                    value={entry.dateIncurred || ''}
                    onChange={(e) => updateEntry(notesPayableEntries, setNotesPayableEntries, 'notesPayableEntries', entry.id, 'dateIncurred', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">e. Purpose</label>
                  <input
                    type="text"
                    value={entry.purpose || ''}
                    onChange={(e) => updateEntry(notesPayableEntries, setNotesPayableEntries, 'notesPayableEntries', entry.id, 'purpose', e.target.value)}
                    placeholder="Purpose of debt"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">f. Monthly or other periodic payment</label>
                  <MoneyInput
                    value={entry.periodicPayment}
                    onChange={(value) => updateEntry(notesPayableEntries, setNotesPayableEntries, 'notesPayableEntries', entry.id, 'periodicPayment', value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">g. Amount of debt as of date of commencement</label>
                  <MoneyInput
                    value={entry.debtCommenced}
                    onChange={(value) => updateEntry(notesPayableEntries, setNotesPayableEntries, 'notesPayableEntries', entry.id, 'debtCommenced', value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">h. Amount of current debt</label>
                  <MoneyInput
                    value={entry.currentDebt}
                    onChange={(value) => updateEntry(notesPayableEntries, setNotesPayableEntries, 'notesPayableEntries', entry.id, 'currentDebt', value)}
                  />
                </div>
              </div>
            </div>
          ))}
          
          <div className="bg-red-50 p-3 rounded">
            <div className="flex justify-between items-center">
              <span className="font-medium text-red-900">TOTAL: NOTES PAYABLE</span>
              <span className="font-bold text-red-900">${notesPayableTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* F. Brokers Margin Accounts */}
        <div className="space-y-4 border-t pt-6">
          <div className="flex justify-between items-center">
            <h3 className="text-md font-medium text-gray-900">F. Brokers Margin Accounts</h3>
            <button
              type="button"
              onClick={() => addEntry(brokerMarginEntries, setBrokerMarginEntries, 'brokerMarginEntries')}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              + Add Account
            </button>
          </div>
          
          {brokerMarginEntries.map((entry, index) => (
            <div key={entry.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-800">6.{index + 1}</h4>
                {brokerMarginEntries.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEntry(brokerMarginEntries, setBrokerMarginEntries, 'brokerMarginEntries', entry.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">a. Name and address of broker</label>
                  <input
                    type="text"
                    value={entry.brokerName || ''}
                    onChange={(e) => updateEntry(brokerMarginEntries, setBrokerMarginEntries, 'brokerMarginEntries', entry.id, 'brokerName', e.target.value)}
                    placeholder="Broker name and address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">b. Amount of original debt</label>
                  <MoneyInput
                    value={entry.originalDebt}
                    onChange={(value) => updateEntry(brokerMarginEntries, setBrokerMarginEntries, 'brokerMarginEntries', entry.id, 'originalDebt', value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">c. Date of incurring debt</label>
                  <input
                    type="date"
                    value={entry.dateIncurred || ''}
                    onChange={(e) => updateEntry(brokerMarginEntries, setBrokerMarginEntries, 'brokerMarginEntries', entry.id, 'dateIncurred', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">d. Purpose</label>
                  <input
                    type="text"
                    value={entry.purpose || ''}
                    onChange={(e) => updateEntry(brokerMarginEntries, setBrokerMarginEntries, 'brokerMarginEntries', entry.id, 'purpose', e.target.value)}
                    placeholder="Purpose of debt"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">e. Monthly or other periodic payment</label>
                  <MoneyInput
                    value={entry.periodicPayment}
                    onChange={(value) => updateEntry(brokerMarginEntries, setBrokerMarginEntries, 'brokerMarginEntries', entry.id, 'periodicPayment', value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">f. Amount of debt as of date of commencement</label>
                  <MoneyInput
                    value={entry.debtCommenced}
                    onChange={(value) => updateEntry(brokerMarginEntries, setBrokerMarginEntries, 'brokerMarginEntries', entry.id, 'debtCommenced', value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">g. Amount of current debt</label>
                  <MoneyInput
                    value={entry.currentDebt}
                    onChange={(value) => updateEntry(brokerMarginEntries, setBrokerMarginEntries, 'brokerMarginEntries', entry.id, 'currentDebt', value)}
                  />
                </div>
              </div>
            </div>
          ))}
          
          <div className="bg-red-50 p-3 rounded">
            <div className="flex justify-between items-center">
              <span className="font-medium text-red-900">TOTAL: BROKER'S MARGIN ACCOUNTS</span>
              <span className="font-bold text-red-900">${brokerMarginTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* G. Taxes Payable */}
        <div className="space-y-4 border-t pt-6">
          <div className="flex justify-between items-center">
            <h3 className="text-md font-medium text-gray-900">G. Taxes Payable</h3>
            <button
              type="button"
              onClick={() => addEntry(taxesPayableEntries, setTaxesPayableEntries, 'taxesPayableEntries')}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              + Add Tax
            </button>
          </div>
          
          {taxesPayableEntries.map((entry, index) => (
            <div key={entry.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-800">7.{index + 1}</h4>
                {taxesPayableEntries.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEntry(taxesPayableEntries, setTaxesPayableEntries, 'taxesPayableEntries', entry.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">a. Description of Tax</label>
                  <input
                    type="text"
                    value={entry.taxDescription || ''}
                    onChange={(e) => updateEntry(taxesPayableEntries, setTaxesPayableEntries, 'taxesPayableEntries', entry.id, 'taxDescription', e.target.value)}
                    placeholder="Type of tax (e.g., Federal Income Tax, State Tax)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">b. Amount of Tax</label>
                  <MoneyInput
                    value={entry.amount}
                    onChange={(value) => updateEntry(taxesPayableEntries, setTaxesPayableEntries, 'taxesPayableEntries', entry.id, 'amount', value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">c. Date Due</label>
                  <input
                    type="date"
                    value={entry.dateDue || ''}
                    onChange={(e) => updateEntry(taxesPayableEntries, setTaxesPayableEntries, 'taxesPayableEntries', entry.id, 'dateDue', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
            </div>
          ))}
          
          <div className="bg-red-50 p-3 rounded">
            <div className="flex justify-between items-center">
              <span className="font-medium text-red-900">TOTAL: TAXES PAYABLE</span>
              <span className="font-bold text-red-900">${taxesPayableTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* H. Loans on Life Insurance Policies */}
        <div className="space-y-4 border-t pt-6">
          <div className="flex justify-between items-center">
            <h3 className="text-md font-medium text-gray-900">H. Loans on Life Insurance Policies</h3>
            <button
              type="button"
              onClick={() => addEntry(lifeInsuranceLoanEntries, setLifeInsuranceLoanEntries, 'lifeInsuranceLoanEntries')}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              + Add Loan
            </button>
          </div>
          
          {lifeInsuranceLoanEntries.map((entry, index) => (
            <div key={entry.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-800">8.{index + 1}</h4>
                {lifeInsuranceLoanEntries.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEntry(lifeInsuranceLoanEntries, setLifeInsuranceLoanEntries, 'lifeInsuranceLoanEntries', entry.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">a. Name and address of insurer</label>
                  <input
                    type="text"
                    value={entry.insurerName || ''}
                    onChange={(e) => updateEntry(lifeInsuranceLoanEntries, setLifeInsuranceLoanEntries, 'lifeInsuranceLoanEntries', entry.id, 'insurerName', e.target.value)}
                    placeholder="Insurance company name and address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">b. Amount of loan</label>
                  <MoneyInput
                    value={entry.loanAmount}
                    onChange={(value) => updateEntry(lifeInsuranceLoanEntries, setLifeInsuranceLoanEntries, 'lifeInsuranceLoanEntries', entry.id, 'loanAmount', value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">c. Date incurred</label>
                  <input
                    type="date"
                    value={entry.dateIncurred || ''}
                    onChange={(e) => updateEntry(lifeInsuranceLoanEntries, setLifeInsuranceLoanEntries, 'lifeInsuranceLoanEntries', entry.id, 'dateIncurred', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">d. Purpose</label>
                  <input
                    type="text"
                    value={entry.purpose || ''}
                    onChange={(e) => updateEntry(lifeInsuranceLoanEntries, setLifeInsuranceLoanEntries, 'lifeInsuranceLoanEntries', entry.id, 'purpose', e.target.value)}
                    placeholder="Purpose of loan"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">e. Name of Borrower</label>
                  <input
                    type="text"
                    value={entry.borrowerName || ''}
                    onChange={(e) => updateEntry(lifeInsuranceLoanEntries, setLifeInsuranceLoanEntries, 'lifeInsuranceLoanEntries', entry.id, 'borrowerName', e.target.value)}
                    placeholder="Borrower name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">f. Monthly or other periodic payment</label>
                  <MoneyInput
                    value={entry.periodicPayment}
                    onChange={(value) => updateEntry(lifeInsuranceLoanEntries, setLifeInsuranceLoanEntries, 'lifeInsuranceLoanEntries', entry.id, 'periodicPayment', value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">g. Amount of debt as of date of commencement</label>
                  <MoneyInput
                    value={entry.debtCommenced}
                    onChange={(value) => updateEntry(lifeInsuranceLoanEntries, setLifeInsuranceLoanEntries, 'lifeInsuranceLoanEntries', entry.id, 'debtCommenced', value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">h. Amount of current debt</label>
                  <MoneyInput
                    value={entry.currentDebt}
                    onChange={(value) => updateEntry(lifeInsuranceLoanEntries, setLifeInsuranceLoanEntries, 'lifeInsuranceLoanEntries', entry.id, 'currentDebt', value)}
                  />
                </div>
              </div>
            </div>
          ))}
          
          <div className="bg-red-50 p-3 rounded">
            <div className="flex justify-between items-center">
              <span className="font-medium text-red-900">TOTAL: LOANS ON LIFE INSURANCE</span>
              <span className="font-bold text-red-900">${lifeInsuranceLoanTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* I. Installment accounts payable */}
        <div className="space-y-4 border-t pt-6">
          <div className="flex justify-between items-center">
            <h3 className="text-md font-medium text-gray-900">I. Installment accounts payable (security agreements, chattel mortgages)</h3>
            <button
              type="button"
              onClick={() => addEntry(installmentAccountEntries, setInstallmentAccountEntries, 'installmentAccountEntries')}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              + Add Account
            </button>
          </div>
          
          {installmentAccountEntries.map((entry, index) => (
            <div key={entry.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-800">9.{index + 1}</h4>
                {installmentAccountEntries.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEntry(installmentAccountEntries, setInstallmentAccountEntries, 'installmentAccountEntries', entry.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">a. Name and address of creditor</label>
                  <input
                    type="text"
                    value={entry.creditorName || ''}
                    onChange={(e) => updateEntry(installmentAccountEntries, setInstallmentAccountEntries, 'installmentAccountEntries', entry.id, 'creditorName', e.target.value)}
                    placeholder="Creditor name and address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">b. Debtor</label>
                  <input
                    type="text"
                    value={entry.debtor || ''}
                    onChange={(e) => updateEntry(installmentAccountEntries, setInstallmentAccountEntries, 'installmentAccountEntries', entry.id, 'debtor', e.target.value)}
                    placeholder="Debtor name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">c. Amount of original debt</label>
                  <MoneyInput
                    value={entry.originalDebt}
                    onChange={(value) => updateEntry(installmentAccountEntries, setInstallmentAccountEntries, 'installmentAccountEntries', entry.id, 'originalDebt', value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">d. Date of incurring debt</label>
                  <input
                    type="date"
                    value={entry.dateIncurred || ''}
                    onChange={(e) => updateEntry(installmentAccountEntries, setInstallmentAccountEntries, 'installmentAccountEntries', entry.id, 'dateIncurred', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">e. Purpose</label>
                  <input
                    type="text"
                    value={entry.purpose || ''}
                    onChange={(e) => updateEntry(installmentAccountEntries, setInstallmentAccountEntries, 'installmentAccountEntries', entry.id, 'purpose', e.target.value)}
                    placeholder="Purpose of debt"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">f. Monthly or other periodic payment</label>
                  <MoneyInput
                    value={entry.periodicPayment}
                    onChange={(value) => updateEntry(installmentAccountEntries, setInstallmentAccountEntries, 'installmentAccountEntries', entry.id, 'periodicPayment', value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">g. Amount of debt as of date of commencement</label>
                  <MoneyInput
                    value={entry.debtCommenced}
                    onChange={(value) => updateEntry(installmentAccountEntries, setInstallmentAccountEntries, 'installmentAccountEntries', entry.id, 'debtCommenced', value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">h. Amount of current debt</label>
                  <MoneyInput
                    value={entry.currentDebt}
                    onChange={(value) => updateEntry(installmentAccountEntries, setInstallmentAccountEntries, 'installmentAccountEntries', entry.id, 'currentDebt', value)}
                  />
                </div>
              </div>
            </div>
          ))}
          
          <div className="bg-red-50 p-3 rounded">
            <div className="flex justify-between items-center">
              <span className="font-medium text-red-900">TOTAL: INSTALLMENT ACCOUNTS</span>
              <span className="font-bold text-red-900">${installmentAccountTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* J. Other Liabilities */}
        <div className="space-y-4 border-t pt-6">
          <div className="flex justify-between items-center">
            <h3 className="text-md font-medium text-gray-900">J. Other Liabilities</h3>
            <button
              type="button"
              onClick={() => addEntry(otherLiabilityEntries, setOtherLiabilityEntries, 'otherLiabilityEntries')}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              + Add Liability
            </button>
          </div>
          
          {otherLiabilityEntries.map((entry, index) => (
            <div key={entry.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-800">10.{index + 1}</h4>
                {otherLiabilityEntries.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEntry(otherLiabilityEntries, setOtherLiabilityEntries, 'otherLiabilityEntries', entry.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">a. Description</label>
                  <input
                    type="text"
                    value={entry.description || ''}
                    onChange={(e) => updateEntry(otherLiabilityEntries, setOtherLiabilityEntries, 'otherLiabilityEntries', entry.id, 'description', e.target.value)}
                    placeholder="Description of liability"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">b. Name and address of creditor</label>
                  <input
                    type="text"
                    value={entry.creditorName || ''}
                    onChange={(e) => updateEntry(otherLiabilityEntries, setOtherLiabilityEntries, 'otherLiabilityEntries', entry.id, 'creditorName', e.target.value)}
                    placeholder="Creditor name and address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">c. Debtor</label>
                  <input
                    type="text"
                    value={entry.debtor || ''}
                    onChange={(e) => updateEntry(otherLiabilityEntries, setOtherLiabilityEntries, 'otherLiabilityEntries', entry.id, 'debtor', e.target.value)}
                    placeholder="Debtor name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">d. Original amount of debt</label>
                  <MoneyInput
                    value={entry.originalDebt}
                    onChange={(value) => updateEntry(otherLiabilityEntries, setOtherLiabilityEntries, 'otherLiabilityEntries', entry.id, 'originalDebt', value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">e. Date incurred</label>
                  <input
                    type="date"
                    value={entry.dateIncurred || ''}
                    onChange={(e) => updateEntry(otherLiabilityEntries, setOtherLiabilityEntries, 'otherLiabilityEntries', entry.id, 'dateIncurred', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">f. Purpose</label>
          <input
            type="text"
                    value={entry.purpose || ''}
                    onChange={(e) => updateEntry(otherLiabilityEntries, setOtherLiabilityEntries, 'otherLiabilityEntries', entry.id, 'purpose', e.target.value)}
                    placeholder="Purpose of debt"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">g. Monthly or other periodic payment</label>
                  <MoneyInput
                    value={entry.periodicPayment}
                    onChange={(value) => updateEntry(otherLiabilityEntries, setOtherLiabilityEntries, 'otherLiabilityEntries', entry.id, 'periodicPayment', value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">h. Amount of debt as of date of commencement</label>
                  <MoneyInput
                    value={entry.debtCommenced}
                    onChange={(value) => updateEntry(otherLiabilityEntries, setOtherLiabilityEntries, 'otherLiabilityEntries', entry.id, 'debtCommenced', value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">i. Amount of current debt</label>
                  <MoneyInput
                    value={entry.currentDebt}
                    onChange={(value) => updateEntry(otherLiabilityEntries, setOtherLiabilityEntries, 'otherLiabilityEntries', entry.id, 'currentDebt', value)}
                  />
                </div>
              </div>
            </div>
          ))}
          
          <div className="bg-red-50 p-3 rounded">
            <div className="flex justify-between items-center">
              <span className="font-medium text-red-900">TOTAL: OTHER LIABILITIES</span>
              <span className="font-bold text-red-900">${otherLiabilityTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Total Liabilities */}
        <div className="border-t pt-6">
          <div className="bg-red-100 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-red-900">TOTAL LIABILITIES:</span>
              <span className="text-xl font-bold text-red-900">${totalLiabilities.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Net Worth Calculation */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900">NET WORTH (Assets - Liabilities):</span>
            <span className="text-xl font-bold text-gray-900">
              ${(toNumber(formData.totalAssets) - totalLiabilities).toFixed(2)}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Note: This calculation requires assets data from the Assets section
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompleteLiabilitiesForm;