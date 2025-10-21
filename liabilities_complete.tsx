import React, { useState } from 'react';

const CompleteLiabilitiesForm = ({ formData = {}, updateFormData }) => {
  // State for dynamic arrays
  const [accountsPayable, setAccountsPayable] = useState(formData.accountsPayable || []);
  const [creditCards, setCreditCards] = useState(formData.creditCards || []);
  const [mortgages, setMortgages] = useState(formData.mortgages || []);
  const [homeEquityLines, setHomeEquityLines] = useState(formData.homeEquityLines || []);
  const [notesPayable, setNotesPayable] = useState(formData.notesPayable || []);
  const [brokerMargin, setBrokerMargin] = useState(formData.brokerMargin || []);
  const [taxesPayable, setTaxesPayable] = useState(formData.taxesPayable || []);
  const [lifeInsuranceLoans, setLifeInsuranceLoans] = useState(formData.lifeInsuranceLoans || []);
  const [installmentAccounts, setInstallmentAccounts] = useState(formData.installmentAccounts || []);
  const [otherLiabilities, setOtherLiabilities] = useState(formData.otherLiabilities || []);

  // Generic add/remove/update functions
  const addItem = (category, setState, template) => {
    const newItems = [...(formData[category] || []), template];
    setState(newItems);
    updateFormData('liabilities', category, newItems);
  };

  const removeItem = (category, setState, items, index) => {
    const updated = items.filter((_, i) => i !== index);
    setState(updated);
    updateFormData('liabilities', category, updated);
  };

  const updateItem = (category, setState, items, index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setState(updated);
    updateFormData('liabilities', category, updated);
  };

  const MoneyInput = ({ label, value, onChange, required }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-600 ml-1">*</span>}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-2 text-gray-500">$</span>
        <input
          type="number"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="0.00"
          step="0.01"
        />
      </div>
    </div>
  );

  const TextInput = ({ label, value, onChange, placeholder, required }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-600 ml-1">*</span>}
      </label>
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        placeholder={placeholder}
      />
    </div>
  );

  const DateInput = ({ label, value, onChange }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <input
        type="date"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );

  // Calculate totals
  const calculateTotal = (items, field) => {
    return items.reduce((sum, item) => sum + (parseFloat(item[field]) || 0), 0);
  };

  const accountsPayableTotal = calculateTotal(accountsPayable, 'currentDebt');
  const creditCardsTotal = calculateTotal(creditCards, 'currentDebt');
  const mortgagesTotal = calculateTotal(mortgages, 'currentDebt');
  const homeEquityTotal = calculateTotal(homeEquityLines, 'currentDebt');
  const notesPayableTotal = calculateTotal(notesPayable, 'currentDebt');
  const brokerMarginTotal = calculateTotal(brokerMargin, 'currentDebt');
  const taxesPayableTotal = calculateTotal(taxesPayable, 'amount');
  const lifeInsuranceLoansTotal = calculateTotal(lifeInsuranceLoans, 'currentDebt');
  const installmentAccountsTotal = calculateTotal(installmentAccounts, 'currentDebt');
  const otherLiabilitiesTotal = calculateTotal(otherLiabilities, 'currentDebt');

  const grandTotal = accountsPayableTotal + creditCardsTotal + mortgagesTotal + homeEquityTotal +
    notesPayableTotal + brokerMarginTotal + taxesPayableTotal + lifeInsuranceLoansTotal +
    installmentAccountsTotal + otherLiabilitiesTotal;

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-600 p-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Liabilities</h2>
        <p className="text-sm text-gray-700">List all debts and financial obligations</p>
      </div>

      {/* Total Liabilities Summary */}
      <div className="bg-red-600 text-white rounded-lg p-6 shadow-lg sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold">TOTAL LIABILITIES</h3>
          <div className="text-3xl font-bold">${grandTotal.toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
        </div>
      </div>

      {/* A. Accounts Payable */}
      <div className="border border-gray-300 rounded-lg p-6 bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">A.1. Accounts Payable</h3>
          <span className="text-red-600 font-semibold">${accountsPayableTotal.toFixed(2)}</span>
        </div>
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => addItem('accountsPayable', setAccountsPayable, {
              creditorName: '', creditorAddress: '', debtor: '', originalDebt: '',
              dateIncurred: '', purpose: '', periodicPayment: '', commencementDebt: '', currentDebt: ''
            })}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            + Add Account Payable
          </button>

          {accountsPayable.map((account, index) => (
            <div key={index} className="relative p-4 bg-red-50 rounded-lg border border-red-200">
              <button
                type="button"
                onClick={() => removeItem('accountsPayable', setAccountsPayable, accountsPayable, index)}
                className="absolute top-2 right-2 text-red-600 hover:text-red-800 font-bold text-xl"
              >
                ×
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput label="Creditor Name" value={account.creditorName} onChange={(v) => updateItem('accountsPayable', setAccountsPayable, accountsPayable, index, 'creditorName', v)} required />
                <TextInput label="Creditor Address" value={account.creditorAddress} onChange={(v) => updateItem('accountsPayable', setAccountsPayable, accountsPayable, index, 'creditorAddress', v)} />
                <TextInput label="Debtor" value={account.debtor} onChange={(v) => updateItem('accountsPayable', setAccountsPayable, accountsPayable, index, 'debtor', v)} placeholder="Who owes this debt" />
                <MoneyInput label="Original Debt Amount" value={account.originalDebt} onChange={(v) => updateItem('accountsPayable', setAccountsPayable, accountsPayable, index, 'originalDebt', v)} />
                <DateInput label="Date Debt Incurred" value={account.dateIncurred} onChange={(v) => updateItem('accountsPayable', setAccountsPayable, accountsPayable, index, 'dateIncurred', v)} />
                <TextInput label="Purpose" value={account.purpose} onChange={(v) => updateItem('accountsPayable', setAccountsPayable, accountsPayable, index, 'purpose', v)} placeholder="Reason for debt" />
                <MoneyInput label="Monthly/Periodic Payment" value={account.periodicPayment} onChange={(v) => updateItem('accountsPayable', setAccountsPayable, accountsPayable, index, 'periodicPayment', v)} />
                <MoneyInput label="Debt at Commencement" value={account.commencementDebt} onChange={(v) => updateItem('accountsPayable', setAccountsPayable, accountsPayable, index, 'commencementDebt', v)} />
                <MoneyInput label="Current Debt Amount" value={account.currentDebt} onChange={(v) => updateItem('accountsPayable', setAccountsPayable, accountsPayable, index, 'currentDebt', v)} required />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* B. Credit Card Debt */}
      <div className="border border-gray-300 rounded-lg p-6 bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">B.2. Credit Card Debt</h3>
          <span className="text-red-600 font-semibold">${creditCardsTotal.toFixed(2)}</span>
        </div>
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => addItem('creditCards', setCreditCards, {
              debtor: '', originalDebt: '', dateIncurred: '', purpose: '', 
              periodicPayment: '', commencementDebt: '', currentDebt: ''
            })}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            + Add Credit Card
          </button>

          {creditCards.map((card, index) => (
            <div key={index} className="relative p-4 bg-red-50 rounded-lg border border-red-200">
              <button
                type="button"
                onClick={() => removeItem('creditCards', setCreditCards, creditCards, index)}
                className="absolute top-2 right-2 text-red-600 hover:text-red-800 font-bold text-xl"
              >
                ×
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput label="Debtor" value={card.debtor} onChange={(v) => updateItem('creditCards', setCreditCards, creditCards, index, 'debtor', v)} placeholder="Who owes this debt" required />
                <MoneyInput label="Amount of Original Debt" value={card.originalDebt} onChange={(v) => updateItem('creditCards', setCreditCards, creditCards, index, 'originalDebt', v)} />
                <DateInput label="Date of Incurring Debt" value={card.dateIncurred} onChange={(v) => updateItem('creditCards', setCreditCards, creditCards, index, 'dateIncurred', v)} />
                <TextInput label="Purpose" value={card.purpose} onChange={(v) => updateItem('creditCards', setCreditCards, creditCards, index, 'purpose', v)} placeholder="What was purchased" />
                <MoneyInput label="Monthly or Other Periodic Payment" value={card.periodicPayment} onChange={(v) => updateItem('creditCards', setCreditCards, creditCards, index, 'periodicPayment', v)} />
                <MoneyInput label="Amount of Debt as of Date of Commencement" value={card.commencementDebt} onChange={(v) => updateItem('creditCards', setCreditCards, creditCards, index, 'commencementDebt', v)} />
                <MoneyInput label="Amount of Current Debt" value={card.currentDebt} onChange={(v) => updateItem('creditCards', setCreditCards, creditCards, index, 'currentDebt', v)} required />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* C. Mortgages Payable on Real Estate */}
      <div className="border border-gray-300 rounded-lg p-6 bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">C.3. Mortgages Payable on Real Estate</h3>
          <span className="text-red-600 font-semibold">${mortgagesTotal.toFixed(2)}</span>
        </div>
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => addItem('mortgages', setMortgages, {
              mortgageeName: '', mortgageeAddress: '', propertyAddress: '', mortgagors: '',
              originalDebt: '', dateIncurred: '', periodicPayment: '', maturityDate: '',
              commencementDebt: '', currentDebt: ''
            })}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            + Add Mortgage
          </button>

          {mortgages.map((mortgage, index) => (
            <div key={index} className="relative p-4 bg-red-50 rounded-lg border border-red-200">
              <button
                type="button"
                onClick={() => removeItem('mortgages', setMortgages, mortgages, index)}
                className="absolute top-2 right-2 text-red-600 hover:text-red-800 font-bold text-xl"
              >
                ×
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput label="Mortgagee Name" value={mortgage.mortgageeName} onChange={(v) => updateItem('mortgages', setMortgages, mortgages, index, 'mortgageeName', v)} placeholder="Lender name" required />
                <TextInput label="Mortgagee Address" value={mortgage.mortgageeAddress} onChange={(v) => updateItem('mortgages', setMortgages, mortgages, index, 'mortgageeAddress', v)} />
                <div className="md:col-span-2">
                  <TextInput label="Property Address" value={mortgage.propertyAddress} onChange={(v) => updateItem('mortgages', setMortgages, mortgages, index, 'propertyAddress', v)} placeholder="Address of mortgaged property" />
                </div>
                <TextInput label="Mortgagor(s)" value={mortgage.mortgagors} onChange={(v) => updateItem('mortgages', setMortgages, mortgages, index, 'mortgagors', v)} placeholder="Who owes the mortgage" />
                <MoneyInput label="Original Debt" value={mortgage.originalDebt} onChange={(v) => updateItem('mortgages', setMortgages, mortgages, index, 'originalDebt', v)} />
                <DateInput label="Date Incurred" value={mortgage.dateIncurred} onChange={(v) => updateItem('mortgages', setMortgages, mortgages, index, 'dateIncurred', v)} />
                <MoneyInput label="Monthly/Periodic Payment" value={mortgage.periodicPayment} onChange={(v) => updateItem('mortgages', setMortgages, mortgages, index, 'periodicPayment', v)} />
                <DateInput label="Maturity Date" value={mortgage.maturityDate} onChange={(v) => updateItem('mortgages', setMortgages, mortgages, index, 'maturityDate', v)} />
                <MoneyInput label="Debt at Commencement" value={mortgage.commencementDebt} onChange={(v) => updateItem('mortgages', setMortgages, mortgages, index, 'commencementDebt', v)} />
                <MoneyInput label="Current Debt Amount" value={mortgage.currentDebt} onChange={(v) => updateItem('mortgages', setMortgages, mortgages, index, 'currentDebt', v)} required />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* D. Home Equity and Other Lines of Credit */}
      <div className="border border-gray-300 rounded-lg p-6 bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">D.4. Home Equity and Other Lines of Credit</h3>
          <span className="text-red-600 font-semibold">${homeEquityTotal.toFixed(2)}</span>
        </div>
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => addItem('homeEquityLines', setHomeEquityLines, {
              mortgageeName: '', mortgageeAddress: '', propertyAddress: '', mortgagors: '',
              originalDebt: '', dateIncurred: '', periodicPayment: '', maturityDate: '',
              commencementDebt: '', currentDebt: ''
            })}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            + Add Home Equity/Line of Credit
          </button>

          {homeEquityLines.map((line, index) => (
            <div key={index} className="relative p-4 bg-red-50 rounded-lg border border-red-200">
              <button
                type="button"
                onClick={() => removeItem('homeEquityLines', setHomeEquityLines, homeEquityLines, index)}
                className="absolute top-2 right-2 text-red-600 hover:text-red-800 font-bold text-xl"
              >
                ×
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput label="Lender Name" value={line.mortgageeName} onChange={(v) => updateItem('homeEquityLines', setHomeEquityLines, homeEquityLines, index, 'mortgageeName', v)} required />
                <TextInput label="Lender Address" value={line.mortgageeAddress} onChange={(v) => updateItem('homeEquityLines', setHomeEquityLines, homeEquityLines, index, 'mortgageeAddress', v)} />
                <div className="md:col-span-2">
                  <TextInput label="Property Address" value={line.propertyAddress} onChange={(v) => updateItem('homeEquityLines', setHomeEquityLines, homeEquityLines, index, 'propertyAddress', v)} />
                </div>
                <TextInput label="Mortgagor(s)" value={line.mortgagors} onChange={(v) => updateItem('homeEquityLines', setHomeEquityLines, homeEquityLines, index, 'mortgagors', v)} />
                <MoneyInput label="Original Debt/Credit Limit" value={line.originalDebt} onChange={(v) => updateItem('homeEquityLines', setHomeEquityLines, homeEquityLines, index, 'originalDebt', v)} />
                <DateInput label="Date Incurred" value={line.dateIncurred} onChange={(v) => updateItem('homeEquityLines', setHomeEquityLines, homeEquityLines, index, 'dateIncurred', v)} />
                <MoneyInput label="Monthly/Periodic Payment" value={line.periodicPayment} onChange={(v) => updateItem('homeEquityLines', setHomeEquityLines, homeEquityLines, index, 'periodicPayment', v)} />
                <DateInput label="Maturity Date" value={line.maturityDate} onChange={(v) => updateItem('homeEquityLines', setHomeEquityLines, homeEquityLines, index, 'maturityDate', v)} />
                <MoneyInput label="Debt at Commencement" value={line.commencementDebt} onChange={(v) => updateItem('homeEquityLines', setHomeEquityLines, homeEquityLines, index, 'commencementDebt', v)} />
                <MoneyInput label="Current Debt Amount" value={line.currentDebt} onChange={(v) => updateItem('homeEquityLines', setHomeEquityLines, homeEquityLines, index, 'currentDebt', v)} required />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* E. Notes Payable */}
      <div className="border border-gray-300 rounded-lg p-6 bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">E.5. Notes Payable</h3>
          <span className="text-red-600 font-semibold">${notesPayableTotal.toFixed(2)}</span>
        </div>
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => addItem('notesPayable', setNotesPayable, {
              noteholderName: '', noteholderAddress: '', debtor: '', originalDebt: '',
              dateIncurred: '', purpose: '', periodicPayment: '', commencementDebt: '', currentDebt: ''
            })}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            + Add Note Payable
          </button>

          {notesPayable.map((note, index) => (
            <div key={index} className="relative p-4 bg-red-50 rounded-lg border border-red-200">
              <button
                type="button"
                onClick={() => removeItem('notesPayable', setNotesPayable, notesPayable, index)}
                className="absolute top-2 right-2 text-red-600 hover:text-red-800 font-bold text-xl"
              >
                ×
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput label="Noteholder Name" value={note.noteholderName} onChange={(v) => updateItem('notesPayable', setNotesPayable, notesPayable, index, 'noteholderName', v)} required />
                <TextInput label="Noteholder Address" value={note.noteholderAddress} onChange={(v) => updateItem('notesPayable', setNotesPayable, notesPayable, index, 'noteholderAddress', v)} />
                <TextInput label="Debtor" value={note.debtor} onChange={(v) => updateItem('notesPayable', setNotesPayable, notesPayable, index, 'debtor', v)} />
                <MoneyInput label="Original Debt Amount" value={note.originalDebt} onChange={(v) => updateItem('notesPayable', setNotesPayable, notesPayable, index, 'originalDebt', v)} />
                <DateInput label="Date Debt Incurred" value={note.dateIncurred} onChange={(v) => updateItem('notesPayable', setNotesPayable, notesPayable, index, 'dateIncurred', v)} />
                <TextInput label="Purpose" value={note.purpose} onChange={(v) => updateItem('notesPayable', setNotesPayable, notesPayable, index, 'purpose', v)} />
                <MoneyInput label="Monthly/Periodic Payment" value={note.periodicPayment} onChange={(v) => updateItem('notesPayable', setNotesPayable, notesPayable, index, 'periodicPayment', v)} />
                <MoneyInput label="Debt at Commencement" value={note.commencementDebt} onChange={(v) => updateItem('notesPayable', setNotesPayable, notesPayable, index, 'commencementDebt', v)} />
                <MoneyInput label="Current Debt Amount" value={note.currentDebt} onChange={(v) => updateItem('notesPayable', setNotesPayable, notesPayable, index, 'currentDebt', v)} required />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary at Bottom */}
      <div className="bg-red-600 text-white rounded-lg p-6 shadow-lg">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold">TOTAL LIABILITIES</h3>
          <div className="text-3xl font-bold">${grandTotal.toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
        </div>
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-xs opacity-90">
          <div><strong>Accounts Payable:</strong> ${accountsPayableTotal.toFixed(2)}</div>
          <div><strong>Credit Cards:</strong> ${creditCardsTotal.toFixed(2)}</div>
          <div><strong>Mortgages:</strong> ${mortgagesTotal.toFixed(2)}</div>
          <div><strong>Home Equity:</strong> ${homeEquityTotal.toFixed(2)}</div>
          <div><strong>Notes Payable:</strong> ${notesPayableTotal.toFixed(2)}</div>
          <div><strong>Broker Margin:</strong> ${brokerMarginTotal.toFixed(2)}</div>
          <div><strong>Taxes Payable:</strong> ${taxesPayableTotal.toFixed(2)}</div>
          <div><strong>Life Insurance Loans:</strong> ${lifeInsuranceLoansTotal.toFixed(2)}</div>
          <div><strong>Installment Accounts:</strong> ${installmentAccountsTotal.toFixed(2)}</div>
          <div><strong>Other Liabilities:</strong> ${otherLiabilitiesTotal.toFixed(2)}</div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-red-400">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="opacity-90">Short-term Debt</p>
              <p className="text-lg font-bold">${(accountsPayableTotal + creditCardsTotal + taxesPayableTotal).toFixed(2)}</p>
            </div>
            <div>
              <p className="opacity-90">Long-term Debt</p>
              <p className="text-lg font-bold">${(mortgagesTotal + homeEquityTotal + notesPayableTotal + installmentAccountsTotal).toFixed(2)}</p>
            </div>
            <div>
              <p className="opacity-90">Other Debt</p>
              <p className="text-lg font-bold">${(brokerMarginTotal + lifeInsuranceLoansTotal + otherLiabilitiesTotal).toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* F. Broker Margin Accounts */}
      <div className="border border-gray-300 rounded-lg p-6 bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">F.6. Broker Margin Accounts</h3>
          <span className="text-red-600 font-semibold">${brokerMarginTotal.toFixed(2)}</span>
        </div>
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => addItem('brokerMargin', setBrokerMargin, {
              brokerNameAddress: '', originalDebt: '', dateIncurred: '', purpose: '', 
              periodicPayment: '', commencementDebt: '', currentDebt: ''
            })}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            + Add Broker Margin Account
          </button>

          {brokerMargin.map((account, index) => (
            <div key={index} className="relative p-4 bg-red-50 rounded-lg border border-red-200">
              <button
                type="button"
                onClick={() => removeItem('brokerMargin', setBrokerMargin, brokerMargin, index)}
                className="absolute top-2 right-2 text-red-600 hover:text-red-800 font-bold text-xl"
              >
                ×
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <TextInput label="Name and Address of Broker" value={account.brokerNameAddress} onChange={(v) => updateItem('brokerMargin', setBrokerMargin, brokerMargin, index, 'brokerNameAddress', v)} required />
                </div>
                <MoneyInput label="Original Debt Amount" value={account.originalDebt} onChange={(v) => updateItem('brokerMargin', setBrokerMargin, brokerMargin, index, 'originalDebt', v)} />
                <DateInput label="Date of Incurring Debt" value={account.dateIncurred} onChange={(v) => updateItem('brokerMargin', setBrokerMargin, brokerMargin, index, 'dateIncurred', v)} />
                <TextInput label="Purpose" value={account.purpose} onChange={(v) => updateItem('brokerMargin', setBrokerMargin, brokerMargin, index, 'purpose', v)} placeholder="Reason for debt" />
                <MoneyInput label="Monthly/Other Periodic Payment" value={account.periodicPayment} onChange={(v) => updateItem('brokerMargin', setBrokerMargin, brokerMargin, index, 'periodicPayment', v)} />
                <MoneyInput label="Debt at Date of Commencement" value={account.commencementDebt} onChange={(v) => updateItem('brokerMargin', setBrokerMargin, brokerMargin, index, 'commencementDebt', v)} />
                <MoneyInput label="Amount of Current Debt" value={account.currentDebt} onChange={(v) => updateItem('brokerMargin', setBrokerMargin, brokerMargin, index, 'currentDebt', v)} required />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* G. Taxes Payable */}
      <div className="border border-gray-300 rounded-lg p-6 bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">G.7. Taxes Payable</h3>
          <span className="text-red-600 font-semibold">${taxesPayableTotal.toFixed(2)}</span>
        </div>
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => addItem('taxesPayable', setTaxesPayable, {
              description: '', amount: '', dateDue: ''
            })}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            + Add Tax Liability
          </button>

          {taxesPayable.map((tax, index) => (
            <div key={index} className="relative p-4 bg-red-50 rounded-lg border border-red-200">
              <button
                type="button"
                onClick={() => removeItem('taxesPayable', setTaxesPayable, taxesPayable, index)}
                className="absolute top-2 right-2 text-red-600 hover:text-red-800 font-bold text-xl"
              >
                ×
              </button>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <TextInput label="Description of Tax" value={tax.description} onChange={(v) => updateItem('taxesPayable', setTaxesPayable, taxesPayable, index, 'description', v)} placeholder="Federal, State, Property, etc." required />
                <MoneyInput label="Amount of Tax" value={tax.amount} onChange={(v) => updateItem('taxesPayable', setTaxesPayable, taxesPayable, index, 'amount', v)} required />
                <DateInput label="Date Due" value={tax.dateDue} onChange={(v) => updateItem('taxesPayable', setTaxesPayable, taxesPayable, index, 'dateDue', v)} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* H. Loans on Life Insurance Policies */}
      <div className="border border-gray-300 rounded-lg p-6 bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">H.8. Loans on Life Insurance Policies</h3>
          <span className="text-red-600 font-semibold">${lifeInsuranceLoansTotal.toFixed(2)}</span>
        </div>
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => addItem('lifeInsuranceLoans', setLifeInsuranceLoans, {
              insurerNameAddress: '', loanAmount: '', dateIncurred: '', purpose: '', 
              borrowerName: '', periodicPayment: '', commencementDebt: '', currentDebt: ''
            })}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            + Add Life Insurance Loan
          </button>

          {lifeInsuranceLoans.map((loan, index) => (
            <div key={index} className="relative p-4 bg-red-50 rounded-lg border border-red-200">
              <button
                type="button"
                onClick={() => removeItem('lifeInsuranceLoans', setLifeInsuranceLoans, lifeInsuranceLoans, index)}
                className="absolute top-2 right-2 text-red-600 hover:text-red-800 font-bold text-xl"
              >
                ×
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <TextInput label="Name and Address of Insurer" value={loan.insurerNameAddress} onChange={(v) => updateItem('lifeInsuranceLoans', setLifeInsuranceLoans, lifeInsuranceLoans, index, 'insurerNameAddress', v)} required />
                </div>
                <MoneyInput label="Amount of Loan" value={loan.loanAmount} onChange={(v) => updateItem('lifeInsuranceLoans', setLifeInsuranceLoans, lifeInsuranceLoans, index, 'loanAmount', v)} />
                <DateInput label="Date Incurred" value={loan.dateIncurred} onChange={(v) => updateItem('lifeInsuranceLoans', setLifeInsuranceLoans, lifeInsuranceLoans, index, 'dateIncurred', v)} />
                <TextInput label="Purpose" value={loan.purpose} onChange={(v) => updateItem('lifeInsuranceLoans', setLifeInsuranceLoans, lifeInsuranceLoans, index, 'purpose', v)} placeholder="Reason for loan" />
                <TextInput label="Name of Borrower" value={loan.borrowerName} onChange={(v) => updateItem('lifeInsuranceLoans', setLifeInsuranceLoans, lifeInsuranceLoans, index, 'borrowerName', v)} />
                <MoneyInput label="Monthly/Other Periodic Payment" value={loan.periodicPayment} onChange={(v) => updateItem('lifeInsuranceLoans', setLifeInsuranceLoans, lifeInsuranceLoans, index, 'periodicPayment', v)} />
                <MoneyInput label="Debt at Date of Commencement" value={loan.commencementDebt} onChange={(v) => updateItem('lifeInsuranceLoans', setLifeInsuranceLoans, lifeInsuranceLoans, index, 'commencementDebt', v)} />
                <MoneyInput label="Amount of Current Debt" value={loan.currentDebt} onChange={(v) => updateItem('lifeInsuranceLoans', setLifeInsuranceLoans, lifeInsuranceLoans, index, 'currentDebt', v)} required />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* I. Installment Accounts Payable */}
      <div className="border border-gray-300 rounded-lg p-6 bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">I.9. Installment Accounts Payable</h3>
          <span className="text-red-600 font-semibold">${installmentAccountsTotal.toFixed(2)}</span>
        </div>
        <p className="text-sm text-gray-600 mb-4">Security agreements, chattel mortgages</p>
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => addItem('installmentAccounts', setInstallmentAccounts, {
              creditorNameAddress: '', debtor: '', originalDebt: '', dateIncurred: '', 
              purpose: '', periodicPayment: '', commencementDebt: '', currentDebt: ''
            })}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            + Add Installment Account
          </button>

          {installmentAccounts.map((account, index) => (
            <div key={index} className="relative p-4 bg-red-50 rounded-lg border border-red-200">
              <button
                type="button"
                onClick={() => removeItem('installmentAccounts', setInstallmentAccounts, installmentAccounts, index)}
                className="absolute top-2 right-2 text-red-600 hover:text-red-800 font-bold text-xl"
              >
                ×
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <TextInput label="Name and Address of Creditor" value={account.creditorNameAddress} onChange={(v) => updateItem('installmentAccounts', setInstallmentAccounts, installmentAccounts, index, 'creditorNameAddress', v)} required />
                </div>
                <TextInput label="Debtor" value={account.debtor} onChange={(v) => updateItem('installmentAccounts', setInstallmentAccounts, installmentAccounts, index, 'debtor', v)} placeholder="Who owes this debt" />
                <MoneyInput label="Original Debt Amount" value={account.originalDebt} onChange={(v) => updateItem('installmentAccounts', setInstallmentAccounts, installmentAccounts, index, 'originalDebt', v)} />
                <DateInput label="Date of Incurring Debt" value={account.dateIncurred} onChange={(v) => updateItem('installmentAccounts', setInstallmentAccounts, installmentAccounts, index, 'dateIncurred', v)} />
                <TextInput label="Purpose" value={account.purpose} onChange={(v) => updateItem('installmentAccounts', setInstallmentAccounts, installmentAccounts, index, 'purpose', v)} placeholder="What was purchased" />
                <MoneyInput label="Monthly/Other Periodic Payment" value={account.periodicPayment} onChange={(v) => updateItem('installmentAccounts', setInstallmentAccounts, installmentAccounts, index, 'periodicPayment', v)} />
                <MoneyInput label="Debt at Date of Commencement" value={account.commencementDebt} onChange={(v) => updateItem('installmentAccounts', setInstallmentAccounts, installmentAccounts, index, 'commencementDebt', v)} />
                <MoneyInput label="Amount of Current Debt" value={account.currentDebt} onChange={(v) => updateItem('installmentAccounts', setInstallmentAccounts, installmentAccounts, index, 'currentDebt', v)} required />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* J. Other Liabilities */}
      <div className="border border-gray-300 rounded-lg p-6 bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">J.10. Other Liabilities</h3>
          <span className="text-red-600 font-semibold">${otherLiabilitiesTotal.toFixed(2)}</span>
        </div>
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => addItem('otherLiabilities', setOtherLiabilities, {
              description: '', creditorNameAddress: '', debtor: '', originalDebt: '', 
              dateIncurred: '', purpose: '', periodicPayment: '', commencementDebt: '', currentDebt: ''
            })}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            + Add Other Liability
          </button>

          {otherLiabilities.map((liability, index) => (
            <div key={index} className="relative p-4 bg-red-50 rounded-lg border border-red-200">
              <button
                type="button"
                onClick={() => removeItem('otherLiabilities', setOtherLiabilities, otherLiabilities, index)}
                className="absolute top-2 right-2 text-red-600 hover:text-red-800 font-bold text-xl"
              >
                ×
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <TextInput label="Description" value={liability.description} onChange={(v) => updateItem('otherLiabilities', setOtherLiabilities, otherLiabilities, index, 'description', v)} placeholder="Type of liability" required />
                </div>
                <div className="md:col-span-2">
                  <TextInput label="Name and Address of Creditor" value={liability.creditorNameAddress} onChange={(v) => updateItem('otherLiabilities', setOtherLiabilities, otherLiabilities, index, 'creditorNameAddress', v)} required />
                </div>
                <TextInput label="Debtor" value={liability.debtor} onChange={(v) => updateItem('otherLiabilities', setOtherLiabilities, otherLiabilities, index, 'debtor', v)} placeholder="Who owes this debt" />
                <MoneyInput label="Original Amount of Debt" value={liability.originalDebt} onChange={(v) => updateItem('otherLiabilities', setOtherLiabilities, otherLiabilities, index, 'originalDebt', v)} />
                <DateInput label="Date Incurred" value={liability.dateIncurred} onChange={(v) => updateItem('otherLiabilities', setOtherLiabilities, otherLiabilities, index, 'dateIncurred', v)} />
                <TextInput label="Purpose" value={liability.purpose} onChange={(v) => updateItem('otherLiabilities', setOtherLiabilities, otherLiabilities, index, 'purpose', v)} placeholder="Reason for debt" />
                <MoneyInput label="Monthly/Other Periodic Payment" value={liability.periodicPayment} onChange={(v) => updateItem('otherLiabilities', setOtherLiabilities, otherLiabilities, index, 'periodicPayment', v)} />
                <MoneyInput label="Debt at Date of Commencement" value={liability.commencementDebt} onChange={(v) => updateItem('otherLiabilities', setOtherLiabilities, otherLiabilities, index, 'commencementDebt', v)} />
                <MoneyInput label="Amount of Current Debt" value={liability.currentDebt} onChange={(v) => updateItem('otherLiabilities', setOtherLiabilities, otherLiabilities, index, 'currentDebt', v)} required />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompleteLiabilitiesForm;