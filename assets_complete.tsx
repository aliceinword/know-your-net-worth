import React, { useState } from 'react';

const CompleteAssetsForm = ({ formData = {}, updateFormData }) => {
  // State for dynamic arrays
  const [cashAccounts, setCashAccounts] = useState(formData.cashAccounts || []);
  const [checkingAccounts, setCheckingAccounts] = useState(formData.checkingAccounts || []);
  const [savingsAccounts, setSavingsAccounts] = useState(formData.savingsAccounts || []);
  const [realEstate, setRealEstate] = useState(formData.realEstate || []);
  const [retirementAccounts, setRetirementAccounts] = useState(formData.retirementAccounts || []);
  const [vehicles, setVehicles] = useState(formData.vehicles || []);
  const [valuables, setValuables] = useState(formData.valuables || []);
  const [businessInterests, setBusinessInterests] = useState(formData.businessInterests || []);
  const [lifeInsurance, setLifeInsurance] = useState(formData.lifeInsurance || []);
  const [securities, setSecurities] = useState(formData.securities || []);
  const [loansReceivable, setLoansReceivable] = useState(formData.loansReceivable || []);
  const [contingentInterests, setContingentInterests] = useState(formData.contingentInterests || []);
  const [otherAssets, setOtherAssets] = useState(formData.otherAssets || []);

  // Generic add/remove/update functions
  const addItem = (category, setState, template) => {
    const newItems = [...(formData[category] || []), template];
    setState(newItems);
    updateFormData('assets', category, newItems);
  };

  const removeItem = (category, setState, items, index) => {
    const updated = items.filter((_, i) => i !== index);
    setState(updated);
    updateFormData('assets', category, updated);
  };

  const updateItem = (category, setState, items, index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setState(updated);
    updateFormData('assets', category, updated);
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

  const cashTotal = calculateTotal(cashAccounts, 'currentAmount');
  const checkingTotal = calculateTotal(checkingAccounts, 'currentBalance');
  const savingsTotal = calculateTotal(savingsAccounts, 'currentBalance');
  const accountsTotal = cashTotal + checkingTotal + savingsTotal;
  const realEstateTotal = calculateTotal(realEstate, 'currentValue');
  const retirementTotal = calculateTotal(retirementAccounts, 'currentValue');
  const vehiclesTotal = calculateTotal(vehicles, 'currentValue');
  const valuablesTotal = calculateTotal(valuables, 'currentValue');
  const businessTotal = calculateTotal(businessInterests, 'netWorth');
  const lifeInsuranceTotal = calculateTotal(lifeInsurance, 'currentCashValue');
  const securitiesTotal = calculateTotal(securities, 'currentValue');
  const loansTotal = calculateTotal(loansReceivable, 'currentAmount');
  const contingentTotal = calculateTotal(contingentInterests, 'currentValue');
  const otherAssetsTotal = calculateTotal(otherAssets, 'currentValue');

  const grandTotal = accountsTotal + realEstateTotal + retirementTotal + vehiclesTotal + 
    valuablesTotal + businessTotal + lifeInsuranceTotal + securitiesTotal + loansTotal + 
    contingentTotal + otherAssetsTotal;

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-600 p-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Assets</h2>
        <p className="text-sm text-gray-700">
          If any asset is held jointly with spouse or another, so state, and set forth your respective shares
        </p>
      </div>

      {/* Total Assets Summary */}
      <div className="bg-purple-600 text-white rounded-lg p-6 shadow-lg sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold">TOTAL ASSETS</h3>
          <div className="text-3xl font-bold">${grandTotal.toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
        </div>
      </div>

      {/* A. CASH ACCOUNTS */}
      <div className="border border-gray-300 rounded-lg p-6 bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">A.1. Cash Accounts</h3>
          <span className="text-purple-600 font-semibold">${cashTotal.toFixed(2)}</span>
        </div>
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => addItem('cashAccounts', setCashAccounts, {
              location: '', sourceOfFunds: '', commencementAmount: '', currentAmount: ''
            })}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            + Add Cash Account
          </button>

          {cashAccounts.map((account, index) => (
            <div key={index} className="relative p-4 bg-purple-50 rounded-lg border border-purple-200">
              <button
                type="button"
                onClick={() => removeItem('cashAccounts', setCashAccounts, cashAccounts, index)}
                className="absolute top-2 right-2 text-red-600 hover:text-red-800 font-bold text-xl"
              >
                ×
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput label="Location" value={account.location} onChange={(v) => updateItem('cashAccounts', setCashAccounts, cashAccounts, index, 'location', v)} placeholder="Where cash is kept" />
                <TextInput label="Source of Funds" value={account.sourceOfFunds} onChange={(v) => updateItem('cashAccounts', setCashAccounts, cashAccounts, index, 'sourceOfFunds', v)} placeholder="Origin of funds" />
                <MoneyInput label="Amount at Commencement" value={account.commencementAmount} onChange={(v) => updateItem('cashAccounts', setCashAccounts, cashAccounts, index, 'commencementAmount', v)} />
                <MoneyInput label="Current Amount" value={account.currentAmount} onChange={(v) => updateItem('cashAccounts', setCashAccounts, cashAccounts, index, 'currentAmount', v)} required />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* A.2. CHECKING ACCOUNTS */}
      <div className="border border-gray-300 rounded-lg p-6 bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">A.2. Checking Accounts</h3>
          <span className="text-purple-600 font-semibold">${checkingTotal.toFixed(2)}</span>
        </div>
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => addItem('checkingAccounts', setCheckingAccounts, {
              institution: '', accountNumber: '', titleHolder: '', dateOpened: '', 
              sourceOfFunds: '', commencementBalance: '', currentBalance: ''
            })}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            + Add Checking Account
          </button>

          {checkingAccounts.map((account, index) => (
            <div key={index} className="relative p-4 bg-purple-50 rounded-lg border border-purple-200">
              <button
                type="button"
                onClick={() => removeItem('checkingAccounts', setCheckingAccounts, checkingAccounts, index)}
                className="absolute top-2 right-2 text-red-600 hover:text-red-800 font-bold text-xl"
              >
                ×
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput label="Financial Institution" value={account.institution} onChange={(v) => updateItem('checkingAccounts', setCheckingAccounts, checkingAccounts, index, 'institution', v)} required />
                <TextInput label="Account Number" value={account.accountNumber} onChange={(v) => updateItem('checkingAccounts', setCheckingAccounts, checkingAccounts, index, 'accountNumber', v)} />
                <TextInput label="Title Holder" value={account.titleHolder} onChange={(v) => updateItem('checkingAccounts', setCheckingAccounts, checkingAccounts, index, 'titleHolder', v)} placeholder="Individual, Joint, etc." />
                <DateInput label="Date Opened" value={account.dateOpened} onChange={(v) => updateItem('checkingAccounts', setCheckingAccounts, checkingAccounts, index, 'dateOpened', v)} />
                <TextInput label="Source of Funds" value={account.sourceOfFunds} onChange={(v) => updateItem('checkingAccounts', setCheckingAccounts, checkingAccounts, index, 'sourceOfFunds', v)} />
                <MoneyInput label="Balance at Commencement" value={account.commencementBalance} onChange={(v) => updateItem('checkingAccounts', setCheckingAccounts, checkingAccounts, index, 'commencementBalance', v)} />
                <MoneyInput label="Current Balance" value={account.currentBalance} onChange={(v) => updateItem('checkingAccounts', setCheckingAccounts, checkingAccounts, index, 'currentBalance', v)} required />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* A.3. SAVINGS ACCOUNTS */}
      <div className="border border-gray-300 rounded-lg p-6 bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">A.3. Savings Accounts</h3>
          <span className="text-purple-600 font-semibold">${savingsTotal.toFixed(2)}</span>
        </div>
        <p className="text-sm text-gray-600 mb-4">Including individual, joint, Totten trust, CDs, treasury notes</p>
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => addItem('savingsAccounts', setSavingsAccounts, {
              institution: '', accountNumber: '', titleHolder: '', accountType: '', 
              dateOpened: '', sourceOfFunds: '', commencementBalance: '', currentBalance: ''
            })}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            + Add Savings Account
          </button>

          {savingsAccounts.map((account, index) => (
            <div key={index} className="relative p-4 bg-purple-50 rounded-lg border border-purple-200">
              <button
                type="button"
                onClick={() => removeItem('savingsAccounts', setSavingsAccounts, savingsAccounts, index)}
                className="absolute top-2 right-2 text-red-600 hover:text-red-800 font-bold text-xl"
              >
                ×
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput label="Financial Institution" value={account.institution} onChange={(v) => updateItem('savingsAccounts', setSavingsAccounts, savingsAccounts, index, 'institution', v)} required />
                <TextInput label="Account Number" value={account.accountNumber} onChange={(v) => updateItem('savingsAccounts', setSavingsAccounts, savingsAccounts, index, 'accountNumber', v)} />
                <TextInput label="Title Holder" value={account.titleHolder} onChange={(v) => updateItem('savingsAccounts', setSavingsAccounts, savingsAccounts, index, 'titleHolder', v)} />
                <TextInput label="Type of Account" value={account.accountType} onChange={(v) => updateItem('savingsAccounts', setSavingsAccounts, savingsAccounts, index, 'accountType', v)} placeholder="Savings, CD, etc." />
                <DateInput label="Date Opened" value={account.dateOpened} onChange={(v) => updateItem('savingsAccounts', setSavingsAccounts, savingsAccounts, index, 'dateOpened', v)} />
                <TextInput label="Source of Funds" value={account.sourceOfFunds} onChange={(v) => updateItem('savingsAccounts', setSavingsAccounts, savingsAccounts, index, 'sourceOfFunds', v)} />
                <MoneyInput label="Balance at Commencement" value={account.commencementBalance} onChange={(v) => updateItem('savingsAccounts', setSavingsAccounts, savingsAccounts, index, 'commencementBalance', v)} />
                <MoneyInput label="Current Balance" value={account.currentBalance} onChange={(v) => updateItem('savingsAccounts', setSavingsAccounts, savingsAccounts, index, 'currentBalance', v)} required />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Accounts Summary */}
      <div className="bg-purple-100 border border-purple-300 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-purple-900">TOTAL ACCOUNTS (Cash + Checking + Savings)</span>
          <span className="text-xl font-bold text-purple-900">${accountsTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* B. REAL ESTATE */}
      <div className="border border-gray-300 rounded-lg p-6 bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">B.4. Real Estate</h3>
          <span className="text-purple-600 font-semibold">${realEstateTotal.toFixed(2)}</span>
        </div>
        <p className="text-sm text-gray-600 mb-4">Including real property, leaseholds, life estates (at market value - do not deduct mortgage)</p>
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => addItem('realEstate', setRealEstate, {
              description: '', titleOwner: '', dateAcquired: '', originalPrice: '', 
              sourceOfFunds: '', mortgageUnpaid: '', currentValue: ''
            })}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            + Add Real Estate
          </button>

          {realEstate.map((property, index) => (
            <div key={index} className="relative p-4 bg-purple-50 rounded-lg border border-purple-200">
              <button
                type="button"
                onClick={() => removeItem('realEstate', setRealEstate, realEstate, index)}
                className="absolute top-2 right-2 text-red-600 hover:text-red-800 font-bold text-xl"
              >
                ×
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <TextInput label="Description" value={property.description} onChange={(v) => updateItem('realEstate', setRealEstate, realEstate, index, 'description', v)} placeholder="Address and property details" required />
                </div>
                <TextInput label="Title Owner" value={property.titleOwner} onChange={(v) => updateItem('realEstate', setRealEstate, realEstate, index, 'titleOwner', v)} />
                <DateInput label="Date of Acquisition" value={property.dateAcquired} onChange={(v) => updateItem('realEstate', setRealEstate, realEstate, index, 'dateAcquired', v)} />
                <MoneyInput label="Original Price" value={property.originalPrice} onChange={(v) => updateItem('realEstate', setRealEstate, realEstate, index, 'originalPrice', v)} />
                <TextInput label="Source of Funds to Acquire" value={property.sourceOfFunds} onChange={(v) => updateItem('realEstate', setRealEstate, realEstate, index, 'sourceOfFunds', v)} />
                <MoneyInput label="Mortgage/Lien Unpaid" value={property.mortgageUnpaid} onChange={(v) => updateItem('realEstate', setRealEstate, realEstate, index, 'mortgageUnpaid', v)} />
                <MoneyInput label="Current Fair Market Value" value={property.currentValue} onChange={(v) => updateItem('realEstate', setRealEstate, realEstate, index, 'currentValue', v)} required />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* C. RETIREMENT ACCOUNTS */}
      <div className="border border-gray-300 rounded-lg p-6 bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">C.5. Retirement Accounts</h3>
          <span className="text-purple-600 font-semibold">${retirementTotal.toFixed(2)}</span>
        </div>
        <p className="text-sm text-gray-600 mb-4">IRAs, 401(k)s, 403(b)s, pension, profit sharing, deferred compensation, etc.</p>
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => addItem('retirementAccounts', setRetirementAccounts, {
              description: '', location: '', titleOwner: '', dateAcquired: '', 
              sourceOfFunds: '', unpaidLiens: '', commencementValue: '', currentValue: ''
            })}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            + Add Retirement Account
          </button>

          {retirementAccounts.map((account, index) => (
            <div key={index} className="relative p-4 bg-purple-50 rounded-lg border border-purple-200">
              <button
                type="button"
                onClick={() => removeItem('retirementAccounts', setRetirementAccounts, retirementAccounts, index)}
                className="absolute top-2 right-2 text-red-600 hover:text-red-800 font-bold text-xl"
              >
                ×
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput label="Description" value={account.description} onChange={(v) => updateItem('retirementAccounts', setRetirementAccounts, retirementAccounts, index, 'description', v)} placeholder="401k, IRA, etc." required />
                <TextInput label="Location of Assets" value={account.location} onChange={(v) => updateItem('retirementAccounts', setRetirementAccounts, retirementAccounts, index, 'location', v)} placeholder="Financial institution" />
                <TextInput label="Title Owner" value={account.titleOwner} onChange={(v) => updateItem('retirementAccounts', setRetirementAccounts, retirementAccounts, index, 'titleOwner', v)} />
                <DateInput label="Date of Acquisition" value={account.dateAcquired} onChange={(v) => updateItem('retirementAccounts', setRetirementAccounts, retirementAccounts, index, 'dateAcquired', v)} />
                <TextInput label="Source of Funds" value={account.sourceOfFunds} onChange={(v) => updateItem('retirementAccounts', setRetirementAccounts, retirementAccounts, index, 'sourceOfFunds', v)} />
                <MoneyInput label="Unpaid Liens" value={account.unpaidLiens} onChange={(v) => updateItem('retirementAccounts', setRetirementAccounts, retirementAccounts, index, 'unpaidLiens', v)} />
                <MoneyInput label="Value at Commencement" value={account.commencementValue} onChange={(v) => updateItem('retirementAccounts', setRetirementAccounts, retirementAccounts, index, 'commencementValue', v)} />
                <MoneyInput label="Current Value" value={account.currentValue} onChange={(v) => updateItem('retirementAccounts', setRetirementAccounts, retirementAccounts, index, 'currentValue', v)} required />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary at Bottom */}
      <div className="bg-purple-600 text-white rounded-lg p-6 shadow-lg">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold">TOTAL ASSETS</h3>
          <div className="text-3xl font-bold">${grandTotal.toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
        </div>
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-xs opacity-90">
          <div><strong>Cash Accounts:</strong> ${cashTotal.toFixed(2)}</div>
          <div><strong>Checking:</strong> ${checkingTotal.toFixed(2)}</div>
          <div><strong>Savings:</strong> ${savingsTotal.toFixed(2)}</div>
          <div><strong>Real Estate:</strong> ${realEstateTotal.toFixed(2)}</div>
          <div><strong>Retirement:</strong> ${retirementTotal.toFixed(2)}</div>
          <div><strong>Vehicles:</strong> ${vehiclesTotal.toFixed(2)}</div>
          <div><strong>Valuables:</strong> ${valuablesTotal.toFixed(2)}</div>
          <div><strong>Business:</strong> ${businessTotal.toFixed(2)}</div>
          <div><strong>Life Insurance:</strong> ${lifeInsuranceTotal.toFixed(2)}</div>
          <div><strong>Securities:</strong> ${securitiesTotal.toFixed(2)}</div>
          <div><strong>Loans/Receivables:</strong> ${loansTotal.toFixed(2)}</div>
          <div><strong>Contingent:</strong> ${contingentTotal.toFixed(2)}</div>
          <div><strong>Other Assets:</strong> ${otherAssetsTotal.toFixed(2)}</div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-purple-400">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="opacity-90">Total Liquid Assets</p>
              <p className="text-lg font-bold">${(cashTotal + checkingTotal + savingsTotal + securitiesTotal).toFixed(2)}</p>
            </div>
            <div>
              <p className="opacity-90">Total Fixed Assets</p>
              <p className="text-lg font-bold">${(realEstateTotal + vehiclesTotal + valuablesTotal).toFixed(2)}</p>
            </div>
            <div>
              <p className="opacity-90">Investment Assets</p>
              <p className="text-lg font-bold">${(retirementTotal + businessTotal + lifeInsuranceTotal + contingentTotal).toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* D. VEHICLES */}
      <div className="border border-gray-300 rounded-lg p-6 bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">D.6. Vehicles</h3>
          <span className="text-purple-600 font-semibold">${vehiclesTotal.toFixed(2)}</span>
        </div>
        <p className="text-sm text-gray-600 mb-4">Auto, Boat, Truck, Plane, Camper, Motorcycles, etc.</p>
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => addItem('vehicles', setVehicles, {
              description: '', titleOwner: '', dateAcquired: '', originalPrice: '', 
              sourceOfFunds: '', lienUnpaid: '', currentValue: '', commencementValue: ''
            })}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            + Add Vehicle
          </button>

          {vehicles.map((vehicle, index) => (
            <div key={index} className="relative p-4 bg-purple-50 rounded-lg border border-purple-200">
              <button
                type="button"
                onClick={() => removeItem('vehicles', setVehicles, vehicles, index)}
                className="absolute top-2 right-2 text-red-600 hover:text-red-800 font-bold text-xl"
              >
                ×
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <TextInput label="Description" value={vehicle.description} onChange={(v) => updateItem('vehicles', setVehicles, vehicles, index, 'description', v)} placeholder="Year, Make, Model, VIN" required />
                </div>
                <TextInput label="Title Owner" value={vehicle.titleOwner} onChange={(v) => updateItem('vehicles', setVehicles, vehicles, index, 'titleOwner', v)} />
                <DateInput label="Date of Acquisition" value={vehicle.dateAcquired} onChange={(v) => updateItem('vehicles', setVehicles, vehicles, index, 'dateAcquired', v)} />
                <MoneyInput label="Original Price" value={vehicle.originalPrice} onChange={(v) => updateItem('vehicles', setVehicles, vehicles, index, 'originalPrice', v)} />
                <TextInput label="Source of Funds to Acquire" value={vehicle.sourceOfFunds} onChange={(v) => updateItem('vehicles', setVehicles, vehicles, index, 'sourceOfFunds', v)} />
                <MoneyInput label="Lien Unpaid" value={vehicle.lienUnpaid} onChange={(v) => updateItem('vehicles', setVehicles, vehicles, index, 'lienUnpaid', v)} />
                <MoneyInput label="Current Fair Market Value" value={vehicle.currentValue} onChange={(v) => updateItem('vehicles', setVehicles, vehicles, index, 'currentValue', v)} required />
                <MoneyInput label="Value at Commencement" value={vehicle.commencementValue} onChange={(v) => updateItem('vehicles', setVehicles, vehicles, index, 'commencementValue', v)} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* E. VALUABLES */}
      <div className="border border-gray-300 rounded-lg p-6 bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">E.7. Jewelry, Art, Antiques, Valuables</h3>
          <span className="text-purple-600 font-semibold">${valuablesTotal.toFixed(2)}</span>
        </div>
        <p className="text-sm text-gray-600 mb-4">Jewelry, art, antiques, household furnishings, precious objects, gold and precious metals (only if valued at more than $500)</p>
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => addItem('valuables', setValuables, {
              description: '', titleOwner: '', location: '', originalPrice: '', 
              sourceOfFunds: '', lienUnpaid: '', commencementValue: '', currentValue: ''
            })}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            + Add Valuable Item
          </button>

          {valuables.map((item, index) => (
            <div key={index} className="relative p-4 bg-purple-50 rounded-lg border border-purple-200">
              <button
                type="button"
                onClick={() => removeItem('valuables', setValuables, valuables, index)}
                className="absolute top-2 right-2 text-red-600 hover:text-red-800 font-bold text-xl"
              >
                ×
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <TextInput label="Description" value={item.description} onChange={(v) => updateItem('valuables', setValuables, valuables, index, 'description', v)} placeholder="Detailed description of item" required />
                </div>
                <TextInput label="Title Owner" value={item.titleOwner} onChange={(v) => updateItem('valuables', setValuables, valuables, index, 'titleOwner', v)} />
                <TextInput label="Location" value={item.location} onChange={(v) => updateItem('valuables', setValuables, valuables, index, 'location', v)} placeholder="Where item is kept" />
                <MoneyInput label="Original Price or Value" value={item.originalPrice} onChange={(v) => updateItem('valuables', setValuables, valuables, index, 'originalPrice', v)} />
                <TextInput label="Source of Funds to Acquire" value={item.sourceOfFunds} onChange={(v) => updateItem('valuables', setValuables, valuables, index, 'sourceOfFunds', v)} />
                <MoneyInput label="Lien Unpaid" value={item.lienUnpaid} onChange={(v) => updateItem('valuables', setValuables, valuables, index, 'lienUnpaid', v)} />
                <MoneyInput label="Value at Commencement" value={item.commencementValue} onChange={(v) => updateItem('valuables', setValuables, valuables, index, 'commencementValue', v)} />
                <MoneyInput label="Current Estimated Value" value={item.currentValue} onChange={(v) => updateItem('valuables', setValuables, valuables, index, 'currentValue', v)} required />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* F. BUSINESS INTERESTS */}
      <div className="border border-gray-300 rounded-lg p-6 bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">F.8. Interest in Any Business</h3>
          <span className="text-purple-600 font-semibold">${businessTotal.toFixed(2)}</span>
        </div>
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => addItem('businessInterests', setBusinessInterests, {
              nameAddress: '', businessType: '', percentageInterest: '', dateAcquired: '', 
              originalPrice: '', sourceOfFunds: '', netWorth: '', valuationDate: '', otherInfo: ''
            })}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            + Add Business Interest
          </button>

          {businessInterests.map((business, index) => (
            <div key={index} className="relative p-4 bg-purple-50 rounded-lg border border-purple-200">
              <button
                type="button"
                onClick={() => removeItem('businessInterests', setBusinessInterests, businessInterests, index)}
                className="absolute top-2 right-2 text-red-600 hover:text-red-800 font-bold text-xl"
              >
                ×
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <TextInput label="Name and Address of Business" value={business.nameAddress} onChange={(v) => updateItem('businessInterests', setBusinessInterests, businessInterests, index, 'nameAddress', v)} required />
                </div>
                <TextInput label="Type of Business" value={business.businessType} onChange={(v) => updateItem('businessInterests', setBusinessInterests, businessInterests, index, 'businessType', v)} placeholder="Corporate, Partnership, Sole Proprietorship" />
                <TextInput label="Your Percentage of Interest" value={business.percentageInterest} onChange={(v) => updateItem('businessInterests', setBusinessInterests, businessInterests, index, 'percentageInterest', v)} placeholder="e.g., 25%" />
                <DateInput label="Date of Acquisition" value={business.dateAcquired} onChange={(v) => updateItem('businessInterests', setBusinessInterests, businessInterests, index, 'dateAcquired', v)} />
                <MoneyInput label="Original Price or Value" value={business.originalPrice} onChange={(v) => updateItem('businessInterests', setBusinessInterests, businessInterests, index, 'originalPrice', v)} />
                <TextInput label="Source of Funds to Acquire" value={business.sourceOfFunds} onChange={(v) => updateItem('businessInterests', setBusinessInterests, businessInterests, index, 'sourceOfFunds', v)} />
                <MoneyInput label="Net Worth of Business" value={business.netWorth} onChange={(v) => updateItem('businessInterests', setBusinessInterests, businessInterests, index, 'netWorth', v)} required />
                <DateInput label="Date of Valuation" value={business.valuationDate} onChange={(v) => updateItem('businessInterests', setBusinessInterests, businessInterests, index, 'valuationDate', v)} />
                <div className="md:col-span-2">
                  <TextInput label="Other Relevant Information" value={business.otherInfo} onChange={(v) => updateItem('businessInterests', setBusinessInterests, businessInterests, index, 'otherInfo', v)} placeholder="Additional details" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* G. LIFE INSURANCE */}
      <div className="border border-gray-300 rounded-lg p-6 bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">G.9. Cash Surrender Value of Life Insurance</h3>
          <span className="text-purple-600 font-semibold">${lifeInsuranceTotal.toFixed(2)}</span>
        </div>
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => addItem('lifeInsurance', setLifeInsurance, {
              insurerNameAddress: '', nameOfInsured: '', policyNumber: '', faceAmount: '', 
              policyOwner: '', dateAcquired: '', sourceOfFunds: '', commencementCashValue: '', currentCashValue: ''
            })}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            + Add Life Insurance Policy
          </button>

          {lifeInsurance.map((policy, index) => (
            <div key={index} className="relative p-4 bg-purple-50 rounded-lg border border-purple-200">
              <button
                type="button"
                onClick={() => removeItem('lifeInsurance', setLifeInsurance, lifeInsurance, index)}
                className="absolute top-2 right-2 text-red-600 hover:text-red-800 font-bold text-xl"
              >
                ×
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <TextInput label="Insurer's Name and Address" value={policy.insurerNameAddress} onChange={(v) => updateItem('lifeInsurance', setLifeInsurance, lifeInsurance, index, 'insurerNameAddress', v)} required />
                </div>
                <TextInput label="Name of Insured" value={policy.nameOfInsured} onChange={(v) => updateItem('lifeInsurance', setLifeInsurance, lifeInsurance, index, 'nameOfInsured', v)} />
                <TextInput label="Policy Number" value={policy.policyNumber} onChange={(v) => updateItem('lifeInsurance', setLifeInsurance, lifeInsurance, index, 'policyNumber', v)} />
                <MoneyInput label="Face Amount of Policy" value={policy.faceAmount} onChange={(v) => updateItem('lifeInsurance', setLifeInsurance, lifeInsurance, index, 'faceAmount', v)} />
                <TextInput label="Policy Owner" value={policy.policyOwner} onChange={(v) => updateItem('lifeInsurance', setLifeInsurance, lifeInsurance, index, 'policyOwner', v)} />
                <DateInput label="Date of Acquisition" value={policy.dateAcquired} onChange={(v) => updateItem('lifeInsurance', setLifeInsurance, lifeInsurance, index, 'dateAcquired', v)} />
                <TextInput label="Source of Funds" value={policy.sourceOfFunds} onChange={(v) => updateItem('lifeInsurance', setLifeInsurance, lifeInsurance, index, 'sourceOfFunds', v)} />
                <MoneyInput label="Cash Surrender Value at Commencement" value={policy.commencementCashValue} onChange={(v) => updateItem('lifeInsurance', setLifeInsurance, lifeInsurance, index, 'commencementCashValue', v)} />
                <MoneyInput label="Current Cash Surrender Value" value={policy.currentCashValue} onChange={(v) => updateItem('lifeInsurance', setLifeInsurance, lifeInsurance, index, 'currentCashValue', v)} required />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* H. SECURITIES/INVESTMENTS */}
      <div className="border border-gray-300 rounded-lg p-6 bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">H.10. Investment Accounts/Securities/Stock Options</h3>
          <span className="text-purple-600 font-semibold">${securitiesTotal.toFixed(2)}</span>
        </div>
        <p className="text-sm text-gray-600 mb-4">Securities, Stock Options, Commodities, Broker Margin Accounts</p>
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => addItem('securities', setSecurities, {
              description: '', titleHolder: '', location: '', dateAcquired: '', 
              sourceOfFunds: '', commencementValue: '', currentValue: ''
            })}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            + Add Investment/Security
          </button>

          {securities.map((security, index) => (
            <div key={index} className="relative p-4 bg-purple-50 rounded-lg border border-purple-200">
              <button
                type="button"
                onClick={() => removeItem('securities', setSecurities, securities, index)}
                className="absolute top-2 right-2 text-red-600 hover:text-red-800 font-bold text-xl"
              >
                ×
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <TextInput label="Description" value={security.description} onChange={(v) => updateItem('securities', setSecurities, securities, index, 'description', v)} placeholder="Stock name, bonds, mutual funds, etc." required />
                </div>
                <TextInput label="Title Holder" value={security.titleHolder} onChange={(v) => updateItem('securities', setSecurities, securities, index, 'titleHolder', v)} />
                <TextInput label="Location" value={security.location} onChange={(v) => updateItem('securities', setSecurities, securities, index, 'location', v)} placeholder="Brokerage firm, bank, etc." />
                <DateInput label="Date of Acquisition" value={security.dateAcquired} onChange={(v) => updateItem('securities', setSecurities, securities, index, 'dateAcquired', v)} />
                <TextInput label="Source of Funds" value={security.sourceOfFunds} onChange={(v) => updateItem('securities', setSecurities, securities, index, 'sourceOfFunds', v)} />
                <MoneyInput label="Value at Commencement" value={security.commencementValue} onChange={(v) => updateItem('securities', setSecurities, securities, index, 'commencementValue', v)} />
                <MoneyInput label="Current Value" value={security.currentValue} onChange={(v) => updateItem('securities', setSecurities, securities, index, 'currentValue', v)} required />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* I. LOANS TO OTHERS */}
      <div className="border border-gray-300 rounded-lg p-6 bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">I.11. Loans to Others and Accounts Receivable</h3>
          <span className="text-purple-600 font-semibold">${loansTotal.toFixed(2)}</span>
        </div>
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => addItem('loansReceivable', setLoansReceivable, {
              debtorNameAddress: '', originalAmount: '', sourceOfFunds: '', dateDue: '', 
              commencementAmount: '', currentAmount: ''
            })}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            + Add Loan/Receivable
          </button>

          {loansReceivable.map((loan, index) => (
            <div key={index} className="relative p-4 bg-purple-50 rounded-lg border border-purple-200">
              <button
                type="button"
                onClick={() => removeItem('loansReceivable', setLoansReceivable, loansReceivable, index)}
                className="absolute top-2 right-2 text-red-600 hover:text-red-800 font-bold text-xl"
              >
                ×
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <TextInput label="Debtor's Name and Address" value={loan.debtorNameAddress} onChange={(v) => updateItem('loansReceivable', setLoansReceivable, loansReceivable, index, 'debtorNameAddress', v)} required />
                </div>
                <MoneyInput label="Original Amount of Loan" value={loan.originalAmount} onChange={(v) => updateItem('loansReceivable', setLoansReceivable, loansReceivable, index, 'originalAmount', v)} />
                <TextInput label="Source of Funds" value={loan.sourceOfFunds} onChange={(v) => updateItem('loansReceivable', setLoansReceivable, loansReceivable, index, 'sourceOfFunds', v)} />
                <DateInput label="Date Payment(s) Due" value={loan.dateDue} onChange={(v) => updateItem('loansReceivable', setLoansReceivable, loansReceivable, index, 'dateDue', v)} />
                <MoneyInput label="Amount Due at Commencement" value={loan.commencementAmount} onChange={(v) => updateItem('loansReceivable', setLoansReceivable, loansReceivable, index, 'commencementAmount', v)} />
                <MoneyInput label="Current Amount Due" value={loan.currentAmount} onChange={(v) => updateItem('loansReceivable', setLoansReceivable, loansReceivable, index, 'currentAmount', v)} required />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* J. CONTINGENT INTERESTS */}
      <div className="border border-gray-300 rounded-lg p-6 bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">J.12. Contingent Interests</h3>
          <span className="text-purple-600 font-semibold">${contingentTotal.toFixed(2)}</span>
        </div>
        <p className="text-sm text-gray-600 mb-4">Stock options, interests subject to life estates, prospective inheritances</p>
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => addItem('contingentInterests', setContingentInterests, {
              description: '', location: '', dateVesting: '', titleOwner: '', dateAcquired: '', 
              originalPrice: '', sourceOfAcquisition: '', valuationMethod: '', commencementValue: '', currentValue: ''
            })}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            + Add Contingent Interest
          </button>

          {contingentInterests.map((interest, index) => (
            <div key={index} className="relative p-4 bg-purple-50 rounded-lg border border-purple-200">
              <button
                type="button"
                onClick={() => removeItem('contingentInterests', setContingentInterests, contingentInterests, index)}
                className="absolute top-2 right-2 text-red-600 hover:text-red-800 font-bold text-xl"
              >
                ×
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <TextInput label="Description" value={interest.description} onChange={(v) => updateItem('contingentInterests', setContingentInterests, contingentInterests, index, 'description', v)} required />
                </div>
                <TextInput label="Location" value={interest.location} onChange={(v) => updateItem('contingentInterests', setContingentInterests, contingentInterests, index, 'location', v)} />
                <DateInput label="Date of Vesting" value={interest.dateVesting} onChange={(v) => updateItem('contingentInterests', setContingentInterests, contingentInterests, index, 'dateVesting', v)} />
                <TextInput label="Title Owner" value={interest.titleOwner} onChange={(v) => updateItem('contingentInterests', setContingentInterests, contingentInterests, index, 'titleOwner', v)} />
                <DateInput label="Date of Acquisition" value={interest.dateAcquired} onChange={(v) => updateItem('contingentInterests', setContingentInterests, contingentInterests, index, 'dateAcquired', v)} />
                <MoneyInput label="Original Price or Value" value={interest.originalPrice} onChange={(v) => updateItem('contingentInterests', setContingentInterests, contingentInterests, index, 'originalPrice', v)} />
                <TextInput label="Source of Acquisition" value={interest.sourceOfAcquisition} onChange={(v) => updateItem('contingentInterests', setContingentInterests, contingentInterests, index, 'sourceOfAcquisition', v)} />
                <TextInput label="Method of Valuation" value={interest.valuationMethod} onChange={(v) => updateItem('contingentInterests', setContingentInterests, contingentInterests, index, 'valuationMethod', v)} />
                <MoneyInput label="Value at Commencement" value={interest.commencementValue} onChange={(v) => updateItem('contingentInterests', setContingentInterests, contingentInterests, index, 'commencementValue', v)} />
                <MoneyInput label="Current Value" value={interest.currentValue} onChange={(v) => updateItem('contingentInterests', setContingentInterests, contingentInterests, index, 'currentValue', v)} required />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* K. OTHER ASSETS */}
      <div className="border border-gray-300 rounded-lg p-6 bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">K.13. Other Assets</h3>
          <span className="text-purple-600 font-semibold">${otherAssetsTotal.toFixed(2)}</span>
        </div>
        <p className="text-sm text-gray-600 mb-4">Tax shelter investments, collections, judgments, causes of action, patents, trademarks, copyrights, and any other asset not itemized above</p>
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => addItem('otherAssets', setOtherAssets, {
              description: '', titleOwner: '', location: '', originalPrice: '', 
              sourceOfFunds: '', lienUnpaid: '', commencementValue: '', currentValue: ''
            })}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            + Add Other Asset
          </button>

          {otherAssets.map((asset, index) => (
            <div key={index} className="relative p-4 bg-purple-50 rounded-lg border border-purple-200">
              <button
                type="button"
                onClick={() => removeItem('otherAssets', setOtherAssets, otherAssets, index)}
                className="absolute top-2 right-2 text-red-600 hover:text-red-800 font-bold text-xl"
              >
                ×
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <TextInput label="Description" value={asset.description} onChange={(v) => updateItem('otherAssets', setOtherAssets, otherAssets, index, 'description', v)} required />
                </div>
                <TextInput label="Title Owner" value={asset.titleOwner} onChange={(v) => updateItem('otherAssets', setOtherAssets, otherAssets, index, 'titleOwner', v)} />
                <TextInput label="Location" value={asset.location} onChange={(v) => updateItem('otherAssets', setOtherAssets, otherAssets, index, 'location', v)} />
                <MoneyInput label="Original Price or Value" value={asset.originalPrice} onChange={(v) => updateItem('otherAssets', setOtherAssets, otherAssets, index, 'originalPrice', v)} />
                <TextInput label="Source of Funds to Acquire" value={asset.sourceOfFunds} onChange={(v) => updateItem('otherAssets', setOtherAssets, otherAssets, index, 'sourceOfFunds', v)} />
                <MoneyInput label="Lien Unpaid" value={asset.lienUnpaid} onChange={(v) => updateItem('otherAssets', setOtherAssets, otherAssets, index, 'lienUnpaid', v)} />
                <MoneyInput label="Value at Commencement" value={asset.commencementValue} onChange={(v) => updateItem('otherAssets', setOtherAssets, otherAssets, index, 'commencementValue', v)} />
                <MoneyInput label="Current Value" value={asset.currentValue} onChange={(v) => updateItem('otherAssets', setOtherAssets, otherAssets, index, 'currentValue', v)} required />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompleteAssetsForm;