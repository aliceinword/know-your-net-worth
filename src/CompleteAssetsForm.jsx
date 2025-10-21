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
      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
    />
  </div>
);

const CompleteAssetsForm = ({ formData = {}, updateFormData, userRole = 'plaintiff' }) => {
  const [realEstateEntries, setRealEstateEntries] = useState(formData.realEstateEntries || [{ id: 1 }]);
  const [retirementEntries, setRetirementEntries] = useState(formData.retirementEntries || [{ id: 1 }]);
  const [vehicleEntries, setVehicleEntries] = useState(formData.vehicleEntries || [{ id: 1 }]);
  const [jewelryArtEntries, setJewelryArtEntries] = useState(formData.jewelryArtEntries || [{ id: 1 }]);
  const [businessEntries, setBusinessEntries] = useState(formData.businessEntries || [{ id: 1 }]);
  const [lifeInsuranceEntries, setLifeInsuranceEntries] = useState(formData.lifeInsuranceEntries || [{ id: 1 }]);
  const [investmentEntries, setInvestmentEntries] = useState(formData.investmentEntries || [{ id: 1 }]);
  const [loanReceivableEntries, setLoanReceivableEntries] = useState(formData.loanReceivableEntries || [{ id: 1 }]);
  const [contingentInterestEntries, setContingentInterestEntries] = useState(formData.contingentInterestEntries || [{ id: 1 }]);
  const [otherAssetEntries, setOtherAssetEntries] = useState(formData.otherAssetEntries || [{ id: 1 }]);

  const addEntry = (entries, setEntries, fieldName) => {
    const newId = Math.max(...entries.map(e => e.id), 0) + 1;
    const newEntries = [...entries, { id: newId }];
    setEntries(newEntries);
    updateFormData('assets', fieldName, newEntries);
  };

  const removeEntry = (entries, setEntries, fieldName, id) => {
    const newEntries = entries.filter(entry => entry.id !== id);
    setEntries(newEntries);
    updateFormData('assets', fieldName, newEntries);
  };

  const updateEntry = (entries, setEntries, fieldName, id, field, value) => {
    const newEntries = entries.map(entry => 
      entry.id === id ? { ...entry, [field]: value } : entry
    );
    setEntries(newEntries);
    updateFormData('assets', fieldName, newEntries);
  };

  // Safe number conversion function
  const toNumber = (value) => {
    if (value === '' || value === null || value === undefined) return 0;
    const num = parseFloat(value);
    return isNaN(num) ? 0 : num;
  };

  // Calculate totals with safe conversion
  const cashTotal = toNumber(formData.cashAmount);
  const checkingTotal = toNumber(formData.checkingAccount1Balance) + toNumber(formData.checkingAccount2Balance);
  const savingsTotal = toNumber(formData.savingsAccount1Balance) + toNumber(formData.savingsAccount2Balance);
  const cashAccountsTotal = cashTotal + checkingTotal + savingsTotal;

  const realEstateTotal = realEstateEntries.reduce((sum, entry) => sum + toNumber(entry.currentFairMarketValue), 0);
  const retirementTotal = retirementEntries.reduce((sum, entry) => sum + toNumber(entry.currentValue), 0);
  const vehicleTotal = vehicleEntries.reduce((sum, entry) => sum + toNumber(entry.currentFairMarketValue), 0);
  const jewelryArtTotal = jewelryArtEntries.reduce((sum, entry) => sum + toNumber(entry.estimateCurrentValue), 0);
  const businessTotal = businessEntries.reduce((sum, entry) => sum + toNumber(entry.netWorth), 0);
  const lifeInsuranceTotal = lifeInsuranceEntries.reduce((sum, entry) => sum + toNumber(entry.currentCashSurrenderValue), 0);
  const investmentTotal = investmentEntries.reduce((sum, entry) => sum + toNumber(entry.currentValue), 0);
  const loanReceivableTotal = loanReceivableEntries.reduce((sum, entry) => sum + toNumber(entry.currentAmountDue), 0);
  const contingentInterestTotal = contingentInterestEntries.reduce((sum, entry) => sum + toNumber(entry.currentValue), 0);
  const otherAssetTotal = otherAssetEntries.reduce((sum, entry) => sum + toNumber(entry.currentValue), 0);

  const totalAssets = cashAccountsTotal + realEstateTotal + retirementTotal + vehicleTotal + 
                     jewelryArtTotal + businessTotal + lifeInsuranceTotal + investmentTotal + 
                     loanReceivableTotal + contingentInterestTotal + otherAssetTotal;

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="bg-purple-50 border-l-4 border-purple-600 p-4">
        <h2 className="text-lg font-semibold text-purple-900">IV. ASSETS</h2>
        <p className="text-sm text-purple-800 mt-2">
          If any asset is held jointly with spouse or another, so state, and set forth your respective shares. Attach additional sheets, if needed.
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6 space-y-8">
        {/* A. Cash Accounts */}
        <div className="space-y-4">
          <h3 className="text-md font-medium text-gray-900">A. Cash Accounts:</h3>
          
          {/* 1. Cash */}
          <div className="border rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-3">1. Cash</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">a. Location</label>
                <select
                  value={formData.cashLocation || ''}
                  onChange={(e) => updateFormData('assets', 'cashLocation', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
                >
                  <option value="">Select Cash Location</option>
                  <option value="home">At Home</option>
                  <option value="safe-deposit-box">Safe Deposit Box</option>
                  <option value="bank-vault">Bank Vault</option>
                  <option value="hidden-location">Hidden Location</option>
                  <option value="other">Other</option>
                </select>
                {formData.cashLocation === 'other' && (
                  <input
                    type="text"
                    value={formData.cashLocationOther || ''}
                    onChange={(e) => updateFormData('assets', 'cashLocationOther', e.target.value)}
                    placeholder="Please specify location"
                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">b. Source of Funds</label>
                <select
                  value={formData.cashSource || ''}
                  onChange={(e) => updateFormData('assets', 'cashSource', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
                >
                  <option value="">Select Source of Funds</option>
                  <option value="employment">Employment Income</option>
                  <option value="business">Business Income</option>
                  <option value="investment">Investment Returns</option>
                  <option value="inheritance">Inheritance</option>
                  <option value="gift">Gift</option>
                  <option value="sale-of-asset">Sale of Asset</option>
                  <option value="loan">Loan Proceeds</option>
                  <option value="settlement">Legal Settlement</option>
                  <option value="other">Other</option>
                </select>
                {formData.cashSource === 'other' && (
                  <input
                    type="text"
                    value={formData.cashSourceOther || ''}
                    onChange={(e) => updateFormData('assets', 'cashSourceOther', e.target.value)}
                    placeholder="Please specify source"
                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">c. Amount as of date of commencement</label>
                <MoneyInput value={formData.cashAmountCommenced} onChange={(value) => updateFormData('assets', 'cashAmountCommenced', value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">d. Current amount</label>
                <MoneyInput value={formData.cashAmount} onChange={(value) => updateFormData('assets', 'cashAmount', value)} />
              </div>
            </div>
          </div>

          {/* 2. Checking Accounts */}
          <div className="border rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-3">2. Checking Accounts:</h4>
            {[1, 2].map((num) => (
              <div key={num} className="mb-4 p-3 bg-gray-50 rounded">
                <h5 className="font-medium text-gray-700 mb-2">{num}.{num}</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">a. Financial Institution</label>
                    <input
                      type="text"
                      value={formData[`checkingAccount${num}Institution`] || ''}
                      onChange={(e) => updateFormData('assets', `checkingAccount${num}Institution`, e.target.value)}
                      placeholder="Financial institution"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">b. Account Number</label>
                    <input
                      type="text"
                      value={formData[`checkingAccount${num}Number`] || ''}
                      onChange={(e) => updateFormData('assets', `checkingAccount${num}Number`, e.target.value)}
                      placeholder="Account number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">c. Title holder</label>
                    <input
                      type="text"
                      value={formData[`checkingAccount${num}TitleHolder`] || ''}
                      onChange={(e) => updateFormData('assets', `checkingAccount${num}TitleHolder`, e.target.value)}
                      placeholder="Title holder"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">d. Date opened</label>
                    <input
                      type="date"
                      value={formData[`checkingAccount${num}DateOpened`] || ''}
                      onChange={(e) => updateFormData('assets', `checkingAccount${num}DateOpened`, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">e. Source of Funds</label>
                    <input
                      type="text"
                      value={formData[`checkingAccount${num}Source`] || ''}
                      onChange={(e) => updateFormData('assets', `checkingAccount${num}Source`, e.target.value)}
                      placeholder="Source of funds"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">f. Balance as of date of commencement</label>
                    <MoneyInput 
                      value={formData[`checkingAccount${num}BalanceCommenced`]} 
                      onChange={(value) => updateFormData('assets', `checkingAccount${num}BalanceCommenced`, value)} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">g. Current balance</label>
                    <MoneyInput 
                      value={formData[`checkingAccount${num}Balance`]} 
                      onChange={(value) => updateFormData('assets', `checkingAccount${num}Balance`, value)} 
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 3. Savings Accounts */}
          <div className="border rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-3">3. Savings Account (including individual, joint, totten trust, certificates of deposit, treasury notes)</h4>
            {[1, 2].map((num) => (
              <div key={num} className="mb-4 p-3 bg-gray-50 rounded">
                <h5 className="font-medium text-gray-700 mb-2">{num}.{num}</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">a. Financial Institution</label>
                    <input
                      type="text"
                      value={formData[`savingsAccount${num}Institution`] || ''}
                      onChange={(e) => updateFormData('assets', `savingsAccount${num}Institution`, e.target.value)}
                      placeholder="Financial institution"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">b. Account Number</label>
                    <input
                      type="text"
                      value={formData[`savingsAccount${num}Number`] || ''}
                      onChange={(e) => updateFormData('assets', `savingsAccount${num}Number`, e.target.value)}
                      placeholder="Account number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">c. Title holder</label>
                    <input
                      type="text"
                      value={formData[`savingsAccount${num}TitleHolder`] || ''}
                      onChange={(e) => updateFormData('assets', `savingsAccount${num}TitleHolder`, e.target.value)}
                      placeholder="Title holder"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">d. Type of account</label>
                    <input
                      type="text"
                      value={formData[`savingsAccount${num}Type`] || ''}
                      onChange={(e) => updateFormData('assets', `savingsAccount${num}Type`, e.target.value)}
                      placeholder="Account type"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">e. Date opened</label>
                    <input
                      type="date"
                      value={formData[`savingsAccount${num}DateOpened`] || ''}
                      onChange={(e) => updateFormData('assets', `savingsAccount${num}DateOpened`, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">f. Source of Funds</label>
                    <input
                      type="text"
                      value={formData[`savingsAccount${num}Source`] || ''}
                      onChange={(e) => updateFormData('assets', `savingsAccount${num}Source`, e.target.value)}
                      placeholder="Source of funds"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">g. Balance as of date of commencement</label>
                    <MoneyInput 
                      value={formData[`savingsAccount${num}BalanceCommenced`]} 
                      onChange={(value) => updateFormData('assets', `savingsAccount${num}BalanceCommenced`, value)} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">h. Current balance</label>
                    <MoneyInput 
                      value={formData[`savingsAccount${num}Balance`]} 
                      onChange={(value) => updateFormData('assets', `savingsAccount${num}Balance`, value)} 
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-purple-50 p-3 rounded">
            <div className="flex justify-between items-center">
              <span className="font-medium text-purple-900">TOTAL: CASH ACCOUNTS</span>
              <span className="font-bold text-purple-900">${cashAccountsTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* B. Real Estate */}
        <div className="space-y-4 border-t pt-6">
          <div className="flex justify-between items-center">
            <h3 className="text-md font-medium text-gray-900">B. Real Estate (Including real property, leaseholds, life estates, etc. at market value – do not deduct any mortgage)</h3>
            <button
              type="button"
              onClick={() => addEntry(realEstateEntries, setRealEstateEntries, 'realEstateEntries')}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              + Add Property
            </button>
          </div>
          
          {realEstateEntries.map((entry, index) => (
            <div key={entry.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-800">4.{index + 1}</h4>
                {realEstateEntries.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEntry(realEstateEntries, setRealEstateEntries, 'realEstateEntries', entry.id)}
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
                    onChange={(e) => updateEntry(realEstateEntries, setRealEstateEntries, 'realEstateEntries', entry.id, 'description', e.target.value)}
                    placeholder="Property description"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">b. Title owner</label>
                  <input
                    type="text"
                    value={entry.titleOwner || ''}
                    onChange={(e) => updateEntry(realEstateEntries, setRealEstateEntries, 'realEstateEntries', entry.id, 'titleOwner', e.target.value)}
                    placeholder="Title owner"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">c. Date of acquisition</label>
                  <input
                    type="date"
                    value={entry.dateAcquisition || ''}
                    onChange={(e) => updateEntry(realEstateEntries, setRealEstateEntries, 'realEstateEntries', entry.id, 'dateAcquisition', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">d. Original price</label>
                  <MoneyInput
                    value={entry.originalPrice}
                    onChange={(value) => updateEntry(realEstateEntries, setRealEstateEntries, 'realEstateEntries', entry.id, 'originalPrice', value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">e. Source of funds to acquire</label>
                  <input
                    type="text"
                    value={entry.sourceFunds || ''}
                    onChange={(e) => updateEntry(realEstateEntries, setRealEstateEntries, 'realEstateEntries', entry.id, 'sourceFunds', e.target.value)}
                    placeholder="Source of funds"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">f. Amount of mortgage or lien unpaid</label>
                  <MoneyInput
                    value={entry.mortgageAmount}
                    onChange={(value) => updateEntry(realEstateEntries, setRealEstateEntries, 'realEstateEntries', entry.id, 'mortgageAmount', value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">g. Estimate current fair market value</label>
                  <MoneyInput
                    value={entry.currentFairMarketValue}
                    onChange={(value) => updateEntry(realEstateEntries, setRealEstateEntries, 'realEstateEntries', entry.id, 'currentFairMarketValue', value)}
                  />
                </div>
              </div>
            </div>
          ))}
          
          <div className="bg-purple-50 p-3 rounded">
            <div className="flex justify-between items-center">
              <span className="font-medium text-purple-900">TOTAL: REAL ESTATE</span>
              <span className="font-bold text-purple-900">${realEstateTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* C. Retirement Accounts */}
        <div className="space-y-4 border-t pt-6">
          <div className="flex justify-between items-center">
            <h3 className="text-md font-medium text-gray-900">C. Retirement Accounts (e.g. IRAs, 401(k)s, 403(b)s, pension, profit sharing plans, deferred compensation plans, etc.)</h3>
            <button
              type="button"
              onClick={() => addEntry(retirementEntries, setRetirementEntries, 'retirementEntries')}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              + Add Account
            </button>
          </div>
          
          {retirementEntries.map((entry, index) => (
            <div key={entry.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-800">5.{index + 1}</h4>
                {retirementEntries.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEntry(retirementEntries, setRetirementEntries, 'retirementEntries', entry.id)}
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
                    onChange={(e) => updateEntry(retirementEntries, setRetirementEntries, 'retirementEntries', entry.id, 'description', e.target.value)}
                    placeholder="Account description"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">b. Location of assets</label>
                  <input
                    type="text"
                    value={entry.location || ''}
                    onChange={(e) => updateEntry(retirementEntries, setRetirementEntries, 'retirementEntries', entry.id, 'location', e.target.value)}
                    placeholder="Location of assets"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">c. Title owner</label>
                  <input
                    type="text"
                    value={entry.titleOwner || ''}
                    onChange={(e) => updateEntry(retirementEntries, setRetirementEntries, 'retirementEntries', entry.id, 'titleOwner', e.target.value)}
                    placeholder="Title owner"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">d. Date of acquisition</label>
                  <input
                    type="date"
                    value={entry.dateAcquisition || ''}
                    onChange={(e) => updateEntry(retirementEntries, setRetirementEntries, 'retirementEntries', entry.id, 'dateAcquisition', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">e. Source of funds</label>
          <input
            type="text"
                    value={entry.sourceFunds || ''}
                    onChange={(e) => updateEntry(retirementEntries, setRetirementEntries, 'retirementEntries', entry.id, 'sourceFunds', e.target.value)}
                    placeholder="Source of funds"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">f. Amount of unpaid liens</label>
                  <MoneyInput
                    value={entry.unpaidLiens}
                    onChange={(value) => updateEntry(retirementEntries, setRetirementEntries, 'retirementEntries', entry.id, 'unpaidLiens', value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">g. Value as of date of commencement</label>
                  <MoneyInput
                    value={entry.valueCommenced}
                    onChange={(value) => updateEntry(retirementEntries, setRetirementEntries, 'retirementEntries', entry.id, 'valueCommenced', value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">h. Current value</label>
                  <MoneyInput
                    value={entry.currentValue}
                    onChange={(value) => updateEntry(retirementEntries, setRetirementEntries, 'retirementEntries', entry.id, 'currentValue', value)}
                  />
                </div>
              </div>
            </div>
          ))}
          
          <div className="bg-purple-50 p-3 rounded">
            <div className="flex justify-between items-center">
              <span className="font-medium text-purple-900">TOTAL: RETIREMENT ACCOUNTS</span>
              <span className="font-bold text-purple-900">${retirementTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* D. Vehicles */}
        <div className="space-y-4 border-t pt-6">
          <div className="flex justify-between items-center">
            <h3 className="text-md font-medium text-gray-900">D. Vehicles (Auto, Boat, Truck, Plane, Camper, Motorcycles, etc.)</h3>
            <button
              type="button"
              onClick={() => addEntry(vehicleEntries, setVehicleEntries, 'vehicleEntries')}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              + Add Vehicle
            </button>
          </div>
          
          {vehicleEntries.map((entry, index) => (
            <div key={entry.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-800">6.{index + 1}</h4>
                {vehicleEntries.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEntry(vehicleEntries, setVehicleEntries, 'vehicleEntries', entry.id)}
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
                    onChange={(e) => updateEntry(vehicleEntries, setVehicleEntries, 'vehicleEntries', entry.id, 'description', e.target.value)}
                    placeholder="Vehicle description"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">b. Title owner</label>
                  <input
                    type="text"
                    value={entry.titleOwner || ''}
                    onChange={(e) => updateEntry(vehicleEntries, setVehicleEntries, 'vehicleEntries', entry.id, 'titleOwner', e.target.value)}
                    placeholder="Title owner"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">c. Date of acquisition</label>
                  <input
                    type="date"
                    value={entry.dateAcquisition || ''}
                    onChange={(e) => updateEntry(vehicleEntries, setVehicleEntries, 'vehicleEntries', entry.id, 'dateAcquisition', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">d. Original price</label>
                  <MoneyInput
                    value={entry.originalPrice}
                    onChange={(value) => updateEntry(vehicleEntries, setVehicleEntries, 'vehicleEntries', entry.id, 'originalPrice', value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">e. Source of funds to acquire</label>
                  <input
                    type="text"
                    value={entry.sourceFunds || ''}
                    onChange={(e) => updateEntry(vehicleEntries, setVehicleEntries, 'vehicleEntries', entry.id, 'sourceFunds', e.target.value)}
                    placeholder="Source of funds"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">f. Amount of lien unpaid</label>
                  <MoneyInput
                    value={entry.lienUnpaid}
                    onChange={(value) => updateEntry(vehicleEntries, setVehicleEntries, 'vehicleEntries', entry.id, 'lienUnpaid', value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">g. Current fair market value</label>
                  <MoneyInput
                    value={entry.currentFairMarketValue}
                    onChange={(value) => updateEntry(vehicleEntries, setVehicleEntries, 'vehicleEntries', entry.id, 'currentFairMarketValue', value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">h. Value as of date of commencement</label>
                  <MoneyInput
                    value={entry.valueCommenced}
                    onChange={(value) => updateEntry(vehicleEntries, setVehicleEntries, 'vehicleEntries', entry.id, 'valueCommenced', value)}
                  />
                </div>
              </div>
            </div>
          ))}
          
          <div className="bg-purple-50 p-3 rounded">
            <div className="flex justify-between items-center">
              <span className="font-medium text-purple-900">TOTAL: VALUE OF VEHICLES</span>
              <span className="font-bold text-purple-900">${vehicleTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* E. Jewelry, Art, Antiques */}
        <div className="space-y-4 border-t pt-6">
          <div className="flex justify-between items-center">
            <h3 className="text-md font-medium text-gray-900">E. Jewelry, art, antiques, household furnishings, precious objects, gold and precious metals (only if valued at more than $500)</h3>
            <button
              type="button"
              onClick={() => addEntry(jewelryArtEntries, setJewelryArtEntries, 'jewelryArtEntries')}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              + Add Item
            </button>
          </div>
          
          {jewelryArtEntries.map((entry, index) => (
            <div key={entry.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-800">7.{index + 1}</h4>
                {jewelryArtEntries.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEntry(jewelryArtEntries, setJewelryArtEntries, 'jewelryArtEntries', entry.id)}
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
                    onChange={(e) => updateEntry(jewelryArtEntries, setJewelryArtEntries, 'jewelryArtEntries', entry.id, 'description', e.target.value)}
                    placeholder="Item description"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">b. Title owner</label>
                  <input
                    type="text"
                    value={entry.titleOwner || ''}
                    onChange={(e) => updateEntry(jewelryArtEntries, setJewelryArtEntries, 'jewelryArtEntries', entry.id, 'titleOwner', e.target.value)}
                    placeholder="Title owner"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">c. Location</label>
                  <input
                    type="text"
                    value={entry.location || ''}
                    onChange={(e) => updateEntry(jewelryArtEntries, setJewelryArtEntries, 'jewelryArtEntries', entry.id, 'location', e.target.value)}
                    placeholder="Location"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">d. Original price or value</label>
                  <MoneyInput
                    value={entry.originalPrice}
                    onChange={(value) => updateEntry(jewelryArtEntries, setJewelryArtEntries, 'jewelryArtEntries', entry.id, 'originalPrice', value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">e. Source of funds to acquire</label>
                  <input
                    type="text"
                    value={entry.sourceFunds || ''}
                    onChange={(e) => updateEntry(jewelryArtEntries, setJewelryArtEntries, 'jewelryArtEntries', entry.id, 'sourceFunds', e.target.value)}
                    placeholder="Source of funds"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">f. Amount of lien unpaid</label>
                  <MoneyInput
                    value={entry.lienUnpaid}
                    onChange={(value) => updateEntry(jewelryArtEntries, setJewelryArtEntries, 'jewelryArtEntries', entry.id, 'lienUnpaid', value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">g. Value as of date of commencement</label>
                  <MoneyInput
                    value={entry.valueCommenced}
                    onChange={(value) => updateEntry(jewelryArtEntries, setJewelryArtEntries, 'jewelryArtEntries', entry.id, 'valueCommenced', value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">h. Estimate Current Value</label>
                  <MoneyInput
                    value={entry.estimateCurrentValue}
                    onChange={(value) => updateEntry(jewelryArtEntries, setJewelryArtEntries, 'jewelryArtEntries', entry.id, 'estimateCurrentValue', value)}
                  />
                </div>
              </div>
            </div>
          ))}
          
          <div className="bg-purple-50 p-3 rounded">
            <div className="flex justify-between items-center">
              <span className="font-medium text-purple-900">TOTAL VALUE OF JEWELRY, ART, ANTIQUES, ETC.</span>
              <span className="font-bold text-purple-900">${jewelryArtTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* F. Interest in any Business */}
        <div className="space-y-4 border-t pt-6">
          <div className="flex justify-between items-center">
            <h3 className="text-md font-medium text-gray-900">F. Interest in any Business</h3>
            <button
              type="button"
              onClick={() => addEntry(businessEntries, setBusinessEntries, 'businessEntries')}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              + Add Business
            </button>
          </div>
          
          {businessEntries.map((entry, index) => (
            <div key={entry.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-800">8.{index + 1}</h4>
                {businessEntries.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEntry(businessEntries, setBusinessEntries, 'businessEntries', entry.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">a. Name and Address of Business</label>
                  <input
                    type="text"
                    value={entry.businessName || ''}
                    onChange={(e) => updateEntry(businessEntries, setBusinessEntries, 'businessEntries', entry.id, 'businessName', e.target.value)}
                    placeholder="Business name and address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">b. Type of Business</label>
                  <select
                    value={entry.businessType || ''}
                    onChange={(e) => updateEntry(businessEntries, setBusinessEntries, 'businessEntries', entry.id, 'businessType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select type</option>
                    <option value="corporate">Corporate</option>
                    <option value="partnership">Partnership</option>
                    <option value="sole_proprietorship">Sole Proprietorship</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">c. Your percentage of interest</label>
                  <input
                    type="text"
                    value={entry.percentageInterest || ''}
                    onChange={(e) => updateEntry(businessEntries, setBusinessEntries, 'businessEntries', entry.id, 'percentageInterest', e.target.value)}
                    placeholder="Percentage of interest"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">d. Date of acquisition</label>
                  <input
                    type="date"
                    value={entry.dateAcquisition || ''}
                    onChange={(e) => updateEntry(businessEntries, setBusinessEntries, 'businessEntries', entry.id, 'dateAcquisition', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">e. Original price or value</label>
                  <MoneyInput
                    value={entry.originalPrice}
                    onChange={(value) => updateEntry(businessEntries, setBusinessEntries, 'businessEntries', entry.id, 'originalPrice', value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">f. Source of funds to acquire</label>
                  <input
                    type="text"
                    value={entry.sourceFunds || ''}
                    onChange={(e) => updateEntry(businessEntries, setBusinessEntries, 'businessEntries', entry.id, 'sourceFunds', e.target.value)}
                    placeholder="Source of funds"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">g. Net worth of business and date of such valuation</label>
                  <input
                    type="text"
                    value={entry.netWorth || ''}
                    onChange={(e) => updateEntry(businessEntries, setBusinessEntries, 'businessEntries', entry.id, 'netWorth', e.target.value)}
                    placeholder="Net worth and valuation date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">h. Other relevant information</label>
                  <input
                    type="text"
                    value={entry.otherInfo || ''}
                    onChange={(e) => updateEntry(businessEntries, setBusinessEntries, 'businessEntries', entry.id, 'otherInfo', e.target.value)}
                    placeholder="Other relevant information"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>
          ))}
          
          <div className="bg-purple-50 p-3 rounded">
            <div className="flex justify-between items-center">
              <span className="font-medium text-purple-900">TOTAL: VALUE OF BUSINESS INTERESTS</span>
              <span className="font-bold text-purple-900">${businessTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* G. Cash Surrender Value of Life Insurance */}
        <div className="space-y-4 border-t pt-6">
          <div className="flex justify-between items-center">
            <h3 className="text-md font-medium text-gray-900">G. Cash Surrender Value of Life Insurance</h3>
            <button
              type="button"
              onClick={() => addEntry(lifeInsuranceEntries, setLifeInsuranceEntries, 'lifeInsuranceEntries')}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              + Add Policy
            </button>
          </div>
          
          {lifeInsuranceEntries.map((entry, index) => (
            <div key={entry.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-800">9.{index + 1}</h4>
                {lifeInsuranceEntries.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEntry(lifeInsuranceEntries, setLifeInsuranceEntries, 'lifeInsuranceEntries', entry.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">a. Insurer's name and address</label>
                  <input
                    type="text"
                    value={entry.insurerName || ''}
                    onChange={(e) => updateEntry(lifeInsuranceEntries, setLifeInsuranceEntries, 'lifeInsuranceEntries', entry.id, 'insurerName', e.target.value)}
                    placeholder="Insurer name and address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">b. Name of insured</label>
                  <input
                    type="text"
                    value={entry.insuredName || ''}
                    onChange={(e) => updateEntry(lifeInsuranceEntries, setLifeInsuranceEntries, 'lifeInsuranceEntries', entry.id, 'insuredName', e.target.value)}
                    placeholder="Name of insured"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">c. Policy number</label>
                  <input
                    type="text"
                    value={entry.policyNumber || ''}
                    onChange={(e) => updateEntry(lifeInsuranceEntries, setLifeInsuranceEntries, 'lifeInsuranceEntries', entry.id, 'policyNumber', e.target.value)}
                    placeholder="Policy number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">d. Face amount of policy</label>
                  <MoneyInput
                    value={entry.faceAmount}
                    onChange={(value) => updateEntry(lifeInsuranceEntries, setLifeInsuranceEntries, 'lifeInsuranceEntries', entry.id, 'faceAmount', value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">e. Policy owner</label>
                  <input
                    type="text"
                    value={entry.policyOwner || ''}
                    onChange={(e) => updateEntry(lifeInsuranceEntries, setLifeInsuranceEntries, 'lifeInsuranceEntries', entry.id, 'policyOwner', e.target.value)}
                    placeholder="Policy owner"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">f. Date of acquisition</label>
                  <input
                    type="date"
                    value={entry.dateAcquisition || ''}
                    onChange={(e) => updateEntry(lifeInsuranceEntries, setLifeInsuranceEntries, 'lifeInsuranceEntries', entry.id, 'dateAcquisition', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">g. Source of funds</label>
                  <input
                    type="text"
                    value={entry.sourceFunds || ''}
                    onChange={(e) => updateEntry(lifeInsuranceEntries, setLifeInsuranceEntries, 'lifeInsuranceEntries', entry.id, 'sourceFunds', e.target.value)}
                    placeholder="Source of funds"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">h. Cash surrender value as of date of commencement</label>
                  <MoneyInput
                    value={entry.cashSurrenderValueCommenced}
                    onChange={(value) => updateEntry(lifeInsuranceEntries, setLifeInsuranceEntries, 'lifeInsuranceEntries', entry.id, 'cashSurrenderValueCommenced', value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">i. Current cash surrender value</label>
                  <MoneyInput
                    value={entry.currentCashSurrenderValue}
                    onChange={(value) => updateEntry(lifeInsuranceEntries, setLifeInsuranceEntries, 'lifeInsuranceEntries', entry.id, 'currentCashSurrenderValue', value)}
                  />
                </div>
              </div>
            </div>
          ))}
          
          <div className="bg-purple-50 p-3 rounded">
            <div className="flex justify-between items-center">
              <span className="font-medium text-purple-900">TOTAL: CASH SURRENDER VALUE OF LIFE INSURANCE</span>
              <span className="font-bold text-purple-900">${lifeInsuranceTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* H. Investment Accounts/Securities/Stock Options */}
        <div className="space-y-4 border-t pt-6">
          <div className="flex justify-between items-center">
            <h3 className="text-md font-medium text-gray-900">H. Investment Accounts/Securities/Stock Options/Commodities/Broker Margin Accounts</h3>
            <button
              type="button"
              onClick={() => addEntry(investmentEntries, setInvestmentEntries, 'investmentEntries')}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              + Add Investment
            </button>
          </div>
          
          {investmentEntries.map((entry, index) => (
            <div key={entry.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-800">10.{index + 1}</h4>
                {investmentEntries.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEntry(investmentEntries, setInvestmentEntries, 'investmentEntries', entry.id)}
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
                    onChange={(e) => updateEntry(investmentEntries, setInvestmentEntries, 'investmentEntries', entry.id, 'description', e.target.value)}
                    placeholder="Investment description"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">b. Title holder</label>
                  <input
                    type="text"
                    value={entry.titleHolder || ''}
                    onChange={(e) => updateEntry(investmentEntries, setInvestmentEntries, 'investmentEntries', entry.id, 'titleHolder', e.target.value)}
                    placeholder="Title holder"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">c. Location</label>
                  <input
                    type="text"
                    value={entry.location || ''}
                    onChange={(e) => updateEntry(investmentEntries, setInvestmentEntries, 'investmentEntries', entry.id, 'location', e.target.value)}
                    placeholder="Location"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">d. Date of acquisition</label>
                  <input
                    type="date"
                    value={entry.dateAcquisition || ''}
                    onChange={(e) => updateEntry(investmentEntries, setInvestmentEntries, 'investmentEntries', entry.id, 'dateAcquisition', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">e. Source of funds</label>
                  <input
                    type="text"
                    value={entry.sourceFunds || ''}
                    onChange={(e) => updateEntry(investmentEntries, setInvestmentEntries, 'investmentEntries', entry.id, 'sourceFunds', e.target.value)}
                    placeholder="Source of funds"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">f. Value as of date of commencement</label>
                  <MoneyInput
                    value={entry.valueCommenced}
                    onChange={(value) => updateEntry(investmentEntries, setInvestmentEntries, 'investmentEntries', entry.id, 'valueCommenced', value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">g. Current value</label>
                  <MoneyInput
                    value={entry.currentValue}
                    onChange={(value) => updateEntry(investmentEntries, setInvestmentEntries, 'investmentEntries', entry.id, 'currentValue', value)}
                  />
                </div>
              </div>
            </div>
          ))}
          
          <div className="bg-purple-50 p-3 rounded">
            <div className="flex justify-between items-center">
              <span className="font-medium text-purple-900">TOTAL: INVESTMENT ACCOUNTS/SECURITIES/STOCK OPTIONS/COMMODITIES/BROKER MARGIN ACCOUNTS</span>
              <span className="font-bold text-purple-900">${investmentTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* I. Loans to Others and Accounts Receivable */}
        <div className="space-y-4 border-t pt-6">
          <div className="flex justify-between items-center">
            <h3 className="text-md font-medium text-gray-900">I. Loans to Others and Accounts Receivable</h3>
            <button
              type="button"
              onClick={() => addEntry(loanReceivableEntries, setLoanReceivableEntries, 'loanReceivableEntries')}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              + Add Loan
            </button>
          </div>
          
          {loanReceivableEntries.map((entry, index) => (
            <div key={entry.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-800">11.{index + 1}</h4>
                {loanReceivableEntries.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEntry(loanReceivableEntries, setLoanReceivableEntries, 'loanReceivableEntries', entry.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">a. Debtor's Name and Address</label>
                  <input
                    type="text"
                    value={entry.debtorName || ''}
                    onChange={(e) => updateEntry(loanReceivableEntries, setLoanReceivableEntries, 'loanReceivableEntries', entry.id, 'debtorName', e.target.value)}
                    placeholder="Debtor's name and address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">b. Original amount of loan or debt</label>
                  <MoneyInput
                    value={entry.originalAmount}
                    onChange={(value) => updateEntry(loanReceivableEntries, setLoanReceivableEntries, 'loanReceivableEntries', entry.id, 'originalAmount', value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">c. Source of funds from which loan made or origin of debt</label>
                  <input
                    type="text"
                    value={entry.sourceFunds || ''}
                    onChange={(e) => updateEntry(loanReceivableEntries, setLoanReceivableEntries, 'loanReceivableEntries', entry.id, 'sourceFunds', e.target.value)}
                    placeholder="Source of funds or origin"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">d. Date payment(s) due</label>
                  <input
                    type="date"
                    value={entry.paymentDue || ''}
                    onChange={(e) => updateEntry(loanReceivableEntries, setLoanReceivableEntries, 'loanReceivableEntries', entry.id, 'paymentDue', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">e. Amount due as of date of commencement</label>
                  <MoneyInput
                    value={entry.amountDueCommenced}
                    onChange={(value) => updateEntry(loanReceivableEntries, setLoanReceivableEntries, 'loanReceivableEntries', entry.id, 'amountDueCommenced', value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">f. Current amount due</label>
                  <MoneyInput
                    value={entry.currentAmountDue}
                    onChange={(value) => updateEntry(loanReceivableEntries, setLoanReceivableEntries, 'loanReceivableEntries', entry.id, 'currentAmountDue', value)}
                  />
                </div>
              </div>
            </div>
          ))}
          
          <div className="bg-purple-50 p-3 rounded">
            <div className="flex justify-between items-center">
              <span className="font-medium text-purple-900">TOTAL: LOANS TO OTHERS AND ACCOUNTS RECEIVABLE</span>
              <span className="font-bold text-purple-900">${loanReceivableTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* J. Contingent Interests */}
        <div className="space-y-4 border-t pt-6">
          <div className="flex justify-between items-center">
            <h3 className="text-md font-medium text-gray-900">J. Contingent Interests (stock options, interests subject to life estates, prospective inheritances)</h3>
            <button
              type="button"
              onClick={() => addEntry(contingentInterestEntries, setContingentInterestEntries, 'contingentInterestEntries')}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              + Add Interest
            </button>
          </div>
          
          {contingentInterestEntries.map((entry, index) => (
            <div key={entry.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-800">12.{index + 1}</h4>
                {contingentInterestEntries.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEntry(contingentInterestEntries, setContingentInterestEntries, 'contingentInterestEntries', entry.id)}
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
                    onChange={(e) => updateEntry(contingentInterestEntries, setContingentInterestEntries, 'contingentInterestEntries', entry.id, 'description', e.target.value)}
                    placeholder="Interest description"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">b. Location</label>
                  <input
                    type="text"
                    value={entry.location || ''}
                    onChange={(e) => updateEntry(contingentInterestEntries, setContingentInterestEntries, 'contingentInterestEntries', entry.id, 'location', e.target.value)}
                    placeholder="Location"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">c. Date of vesting</label>
                  <input
                    type="date"
                    value={entry.dateVesting || ''}
                    onChange={(e) => updateEntry(contingentInterestEntries, setContingentInterestEntries, 'contingentInterestEntries', entry.id, 'dateVesting', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">d. Title owner</label>
                  <input
                    type="text"
                    value={entry.titleOwner || ''}
                    onChange={(e) => updateEntry(contingentInterestEntries, setContingentInterestEntries, 'contingentInterestEntries', entry.id, 'titleOwner', e.target.value)}
                    placeholder="Title owner"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">e. Date of acquisition</label>
                  <input
                    type="date"
                    value={entry.dateAcquisition || ''}
                    onChange={(e) => updateEntry(contingentInterestEntries, setContingentInterestEntries, 'contingentInterestEntries', entry.id, 'dateAcquisition', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">f. Original price or value</label>
                  <MoneyInput
                    value={entry.originalPrice}
                    onChange={(value) => updateEntry(contingentInterestEntries, setContingentInterestEntries, 'contingentInterestEntries', entry.id, 'originalPrice', value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">g. Source of acquisition to acquire</label>
                  <input
                    type="text"
                    value={entry.sourceAcquisition || ''}
                    onChange={(e) => updateEntry(contingentInterestEntries, setContingentInterestEntries, 'contingentInterestEntries', entry.id, 'sourceAcquisition', e.target.value)}
                    placeholder="Source of acquisition"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">h. Method of valuation</label>
                  <input
                    type="text"
                    value={entry.methodValuation || ''}
                    onChange={(e) => updateEntry(contingentInterestEntries, setContingentInterestEntries, 'contingentInterestEntries', entry.id, 'methodValuation', e.target.value)}
                    placeholder="Method of valuation"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">i. Value as of date of commencement</label>
                  <MoneyInput
                    value={entry.valueCommenced}
                    onChange={(value) => updateEntry(contingentInterestEntries, setContingentInterestEntries, 'contingentInterestEntries', entry.id, 'valueCommenced', value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">j. Current value</label>
                  <MoneyInput
                    value={entry.currentValue}
                    onChange={(value) => updateEntry(contingentInterestEntries, setContingentInterestEntries, 'contingentInterestEntries', entry.id, 'currentValue', value)}
                  />
                </div>
              </div>
            </div>
          ))}
          
          <div className="bg-purple-50 p-3 rounded">
            <div className="flex justify-between items-center">
              <span className="font-medium text-purple-900">TOTAL: CONTINGENT INTERESTS</span>
              <span className="font-bold text-purple-900">${contingentInterestTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* K. Other Assets */}
        <div className="space-y-4 border-t pt-6">
          <div className="flex justify-between items-center">
            <h3 className="text-md font-medium text-gray-900">K. Other Assets (e.g., tax shelter investments, collections, judgments, causes of action, patents, trademarks, copyrights, and any other asset not hereinabove itemized)</h3>
            <button
              type="button"
              onClick={() => addEntry(otherAssetEntries, setOtherAssetEntries, 'otherAssetEntries')}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              + Add Asset
            </button>
          </div>
          
          {otherAssetEntries.map((entry, index) => (
            <div key={entry.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-800">13.{index + 1}</h4>
                {otherAssetEntries.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEntry(otherAssetEntries, setOtherAssetEntries, 'otherAssetEntries', entry.id)}
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
                    onChange={(e) => updateEntry(otherAssetEntries, setOtherAssetEntries, 'otherAssetEntries', entry.id, 'description', e.target.value)}
                    placeholder="Asset description"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">b. Title owner</label>
                  <input
                    type="text"
                    value={entry.titleOwner || ''}
                    onChange={(e) => updateEntry(otherAssetEntries, setOtherAssetEntries, 'otherAssetEntries', entry.id, 'titleOwner', e.target.value)}
                    placeholder="Title owner"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">c. Location</label>
                  <input
                    type="text"
                    value={entry.location || ''}
                    onChange={(e) => updateEntry(otherAssetEntries, setOtherAssetEntries, 'otherAssetEntries', entry.id, 'location', e.target.value)}
                    placeholder="Location"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">d. Original Price or value</label>
                  <MoneyInput
                    value={entry.originalPrice}
                    onChange={(value) => updateEntry(otherAssetEntries, setOtherAssetEntries, 'otherAssetEntries', entry.id, 'originalPrice', value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">e. Source of funds to acquire</label>
                  <input
                    type="text"
                    value={entry.sourceFunds || ''}
                    onChange={(e) => updateEntry(otherAssetEntries, setOtherAssetEntries, 'otherAssetEntries', entry.id, 'sourceFunds', e.target.value)}
                    placeholder="Source of funds"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">f. Amount of lien unpaid</label>
                  <MoneyInput
                    value={entry.lienUnpaid}
                    onChange={(value) => updateEntry(otherAssetEntries, setOtherAssetEntries, 'otherAssetEntries', entry.id, 'lienUnpaid', value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">g. Value as of date of commencement</label>
                  <MoneyInput
                    value={entry.valueCommenced}
                    onChange={(value) => updateEntry(otherAssetEntries, setOtherAssetEntries, 'otherAssetEntries', entry.id, 'valueCommenced', value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">h. Current value</label>
                  <MoneyInput
                    value={entry.currentValue}
                    onChange={(value) => updateEntry(otherAssetEntries, setOtherAssetEntries, 'otherAssetEntries', entry.id, 'currentValue', value)}
                  />
                </div>
              </div>
            </div>
          ))}
          
          <div className="bg-purple-50 p-3 rounded">
            <div className="flex justify-between items-center">
              <span className="font-medium text-purple-900">TOTAL: OTHER ASSETS</span>
              <span className="font-bold text-purple-900">${otherAssetTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Total Assets */}
        <div className="border-t pt-6">
          <div className="bg-purple-100 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-purple-900">TOTAL ASSETS:</span>
              <span className="text-xl font-bold text-purple-900">${totalAssets.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompleteAssetsForm;