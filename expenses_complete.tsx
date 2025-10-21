import React, { useState } from 'react';

const CompleteExpensesForm = ({ formData = {}, updateFormData, userRole = 'plaintiff' }) => {
  const [automobiles, setAutomobiles] = useState(formData.automobiles || []);
  const [otherExpenses, setOtherExpenses] = useState(formData.other || []);
  
  const yourLabel = userRole === 'plaintiff' ? 'Plaintiff' : 'Defendant';

  const updateExpense = (category, key, value) => {
    const currentCategory = formData[category] || {};
    updateFormData('expenses', category, {
      ...currentCategory,
      [key]: value
    });
  };

  const addAutomobile = () => {
    const newAutos = [...automobiles, {
      year: '',
      make: '',
      useType: 'personal',
      leasePayment: '',
      leaseTerm: '',
      gasOil: '',
      repairs: '',
      carWash: '',
      parkingTolls: '',
      other: ''
    }];
    setAutomobiles(newAutos);
    updateFormData('expenses', 'automobiles', newAutos);
  };

  const removeAutomobile = (index) => {
    const updated = automobiles.filter((_, i) => i !== index);
    setAutomobiles(updated);
    updateFormData('expenses', 'automobiles', updated);
  };

  const updateAutomobile = (index, field, value) => {
    const updated = [...automobiles];
    updated[index][field] = value;
    setAutomobiles(updated);
    updateFormData('expenses', 'automobiles', updated);
  };

  const addOtherExpense = () => {
    const newOther = [...otherExpenses, { description: '', amount: '' }];
    setOtherExpenses(newOther);
    updateFormData('expenses', 'other', newOther);
  };

  const removeOtherExpense = (index) => {
    const updated = otherExpenses.filter((_, i) => i !== index);
    setOtherExpenses(updated);
    updateFormData('expenses', 'other', updated);
  };

  const updateOtherExpense = (index, field, value) => {
    const updated = [...otherExpenses];
    updated[index][field] = value;
    setOtherExpenses(updated);
    updateFormData('expenses', 'other', updated);
  };

  const MoneyInput = ({ label, value, onChange, helpText }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {helpText && <span className="text-xs text-gray-500 ml-2">({helpText})</span>}
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

  const calcTotal = (category, fields) => {
    if (!formData[category]) return 0;
    return fields.reduce((sum, field) => sum + (parseFloat(formData[category][field]) || 0), 0);
  };

  const housingTotal = calcTotal('housing', ['mortgage', 'homeEquity', 'realEstateTax', 'insurance', 'hoaFees', 'rent', 'other']);
  const utilitiesTotal = calcTotal('utilities', ['fuelOilGas', 'electric', 'landline', 'mobile', 'cableSatellite', 'internet', 'alarm', 'water', 'other']);
  const foodTotal = calcTotal('food', ['groceries', 'diningOut', 'other']);
  const clothingTotal = calcTotal('clothing', ['yourself', 'children', 'dryCleaning', 'other']);
  const insuranceTotal = calcTotal('insurance', ['life', 'fireTheft', 'automotive', 'umbrella', 'medicalSelf', 'medicalChildren', 'dental', 'optical', 'disability', 'workersComp', 'longTerm', 'other']);
  const medicalTotal = calcTotal('medical', ['medical', 'dental', 'optical', 'pharmaceutical', 'surgical', 'psychotherapy', 'other']);
  const householdTotal = calcTotal('household', ['repairs', 'gardening', 'sanitation', 'snowRemoval', 'extermination', 'other']);
  const householdHelpTotal = calcTotal('householdHelp', ['domestic', 'nanny', 'babysitter', 'other']);
  
  const autoTotal = automobiles.reduce((sum, auto) => {
    return sum + ['leasePayment', 'gasOil', 'repairs', 'carWash', 'parkingTolls', 'other']
      .reduce((autoSum, field) => autoSum + (parseFloat(auto[field]) || 0), 0);
  }, 0);

  const educationTotal = calcTotal('education', ['nursery', 'primarySecondary', 'college', 'postGrad', 'religious', 'transportation', 'supplies', 'lunches', 'tutoring', 'events', 'extracurricular', 'other']);
  const recreationalTotal = calcTotal('recreational', ['vacations', 'entertainment', 'music', 'clubs', 'activities', 'healthClub', 'summerCamp', 'birthdayParties', 'other']);
  const taxesTotal = calcTotal('taxes', ['federal', 'state', 'city', 'socialSecurity']);
  const miscTotal = calcTotal('miscellaneous', ['beautyBarber', 'toiletries', 'books', 'gifts', 'charitable', 'religious', 'union', 'commutation', 'pet', 'childSupport', 'alimony', 'loanPayments', 'businessExpenses', 'safeDeposit']);
  
  const otherTotal = otherExpenses.reduce((sum, exp) => sum + (parseFloat(exp.amount) || 0), 0);
  const grandTotal = housingTotal + utilitiesTotal + foodTotal + clothingTotal + insuranceTotal + medicalTotal + householdTotal + householdHelpTotal + autoTotal + educationTotal + recreationalTotal + taxesTotal + miscTotal + otherTotal;

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-600 p-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Monthly Expenses</h2>
        <p className="text-sm text-gray-700">Complete all expense categories below</p>
      </div>

      <div className="bg-blue-600 text-white rounded-lg p-6 shadow-lg sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold">TOTAL MONTHLY EXPENSES</h3>
          <div className="text-3xl font-bold">${grandTotal.toFixed(2)}</div>
        </div>
      </div>

      <div className="border border-gray-300 rounded-lg p-6 bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">(a) Housing</h3>
          <span className="text-blue-600 font-semibold">${housingTotal.toFixed(2)}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MoneyInput label="1. Mortgage/Co-op Loan" value={formData.housing?.mortgage} onChange={(v) => updateExpense('housing', 'mortgage', v)} />
          <MoneyInput label="2. Home Equity/Second Mortgage" value={formData.housing?.homeEquity} onChange={(v) => updateExpense('housing', 'homeEquity', v)} />
          <MoneyInput label="3. Real Estate Taxes" value={formData.housing?.realEstateTax} onChange={(v) => updateExpense('housing', 'realEstateTax', v)} helpText="if not in mortgage" />
          <MoneyInput label="4. Homeowners/Renters Insurance" value={formData.housing?.insurance} onChange={(v) => updateExpense('housing', 'insurance', v)} />
          <MoneyInput label="5. HOA/Maintenance Charges" value={formData.housing?.hoaFees} onChange={(v) => updateExpense('housing', 'hoaFees', v)} />
          <MoneyInput label="6. Rent" value={formData.housing?.rent} onChange={(v) => updateExpense('housing', 'rent', v)} />
          <MoneyInput label="7. Other" value={formData.housing?.other} onChange={(v) => updateExpense('housing', 'other', v)} />
        </div>
      </div>

      <div className="border border-gray-300 rounded-lg p-6 bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">(b) Utilities</h3>
          <span className="text-blue-600 font-semibold">${utilitiesTotal.toFixed(2)}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MoneyInput label="1. Fuel Oil/Gas" value={formData.utilities?.fuelOilGas} onChange={(v) => updateExpense('utilities', 'fuelOilGas', v)} />
          <MoneyInput label="2. Electric" value={formData.utilities?.electric} onChange={(v) => updateExpense('utilities', 'electric', v)} />
          <MoneyInput label="3. Telephone (land line)" value={formData.utilities?.landline} onChange={(v) => updateExpense('utilities', 'landline', v)} />
          <MoneyInput label="4. Mobile Phone" value={formData.utilities?.mobile} onChange={(v) => updateExpense('utilities', 'mobile', v)} />
          <MoneyInput label="5. Cable/Satellite TV" value={formData.utilities?.cableSatellite} onChange={(v) => updateExpense('utilities', 'cableSatellite', v)} />
          <MoneyInput label="6. Internet" value={formData.utilities?.internet} onChange={(v) => updateExpense('utilities', 'internet', v)} />
          <MoneyInput label="7. Alarm" value={formData.utilities?.alarm} onChange={(v) => updateExpense('utilities', 'alarm', v)} />
          <MoneyInput label="8. Water" value={formData.utilities?.water} onChange={(v) => updateExpense('utilities', 'water', v)} />
          <MoneyInput label="9. Other" value={formData.utilities?.other} onChange={(v) => updateExpense('utilities', 'other', v)} />
        </div>
      </div>

      <div className="border border-gray-300 rounded-lg p-6 bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">(c) Food</h3>
          <span className="text-blue-600 font-semibold">${foodTotal.toFixed(2)}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MoneyInput label="1. Groceries" value={formData.food?.groceries} onChange={(v) => updateExpense('food', 'groceries', v)} />
          <MoneyInput label="2. Dining Out/Take Out" value={formData.food?.diningOut} onChange={(v) => updateExpense('food', 'diningOut', v)} />
          <MoneyInput label="3. Other" value={formData.food?.other} onChange={(v) => updateExpense('food', 'other', v)} />
        </div>
      </div>

      <div className="border border-gray-300 rounded-lg p-6 bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">(d) Clothing</h3>
          <span className="text-blue-600 font-semibold">${clothingTotal.toFixed(2)}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MoneyInput label={`1. ${yourLabel}`} value={formData.clothing?.yourself} onChange={(v) => updateExpense('clothing', 'yourself', v)} />
          <MoneyInput label="2. Children" value={formData.clothing?.children} onChange={(v) => updateExpense('clothing', 'children', v)} />
          <MoneyInput label="3. Dry Cleaning" value={formData.clothing?.dryCleaning} onChange={(v) => updateExpense('clothing', 'dryCleaning', v)} />
          <MoneyInput label="4. Other" value={formData.clothing?.other} onChange={(v) => updateExpense('clothing', 'other', v)} />
        </div>
      </div>

      <div className="border border-gray-300 rounded-lg p-6 bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">(e) Insurance</h3>
          <span className="text-blue-600 font-semibold">${insuranceTotal.toFixed(2)}</span>
        </div>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MoneyInput label="1. Life" value={formData.insurance?.life} onChange={(v) => updateExpense('insurance', 'life', v)} />
            <MoneyInput label="2. Fire, Theft, Liability" value={formData.insurance?.fireTheft} onChange={(v) => updateExpense('insurance', 'fireTheft', v)} />
            <MoneyInput label="3. Automotive" value={formData.insurance?.automotive} onChange={(v) => updateExpense('insurance', 'automotive', v)} />
            <MoneyInput label="4. Umbrella Policy" value={formData.insurance?.umbrella} onChange={(v) => updateExpense('insurance', 'umbrella', v)} />
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <MoneyInput label={`5A. Medical Plan for ${yourLabel}`} value={formData.insurance?.medicalSelf} onChange={(v) => updateExpense('insurance', 'medicalSelf', v)} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <input type="text" placeholder="Carrier name" value={formData.insurance?.medicalSelfCarrier || ''} onChange={(e) => updateExpense('insurance', 'medicalSelfCarrier', e.target.value)} className="px-4 py-2 border rounded-lg text-sm" />
              <input type="text" placeholder="Name of insured" value={formData.insurance?.medicalSelfInsured || ''} onChange={(e) => updateExpense('insurance', 'medicalSelfInsured', e.target.value)} className="px-4 py-2 border rounded-lg text-sm" />
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <MoneyInput label="5B. Medical Plan for Children" value={formData.insurance?.medicalChildren} onChange={(v) => updateExpense('insurance', 'medicalChildren', v)} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <input type="text" placeholder="Carrier name" value={formData.insurance?.medicalChildrenCarrier || ''} onChange={(e) => updateExpense('insurance', 'medicalChildrenCarrier', e.target.value)} className="px-4 py-2 border rounded-lg text-sm" />
              <input type="text" placeholder="Name of insured" value={formData.insurance?.medicalChildrenInsured || ''} onChange={(e) => updateExpense('insurance', 'medicalChildrenInsured', e.target.value)} className="px-4 py-2 border rounded-lg text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MoneyInput label="6. Dental Plan" value={formData.insurance?.dental} onChange={(v) => updateExpense('insurance', 'dental', v)} />
            <MoneyInput label="7. Optical Plan" value={formData.insurance?.optical} onChange={(v) => updateExpense('insurance', 'optical', v)} />
            <MoneyInput label="8. Disability" value={formData.insurance?.disability} onChange={(v) => updateExpense('insurance', 'disability', v)} />
            <MoneyInput label="9. Workers Compensation" value={formData.insurance?.workersComp} onChange={(v) => updateExpense('insurance', 'workersComp', v)} />
            <MoneyInput label="10. Long Term Care" value={formData.insurance?.longTerm} onChange={(v) => updateExpense('insurance', 'longTerm', v)} />
            <MoneyInput label="11. Other" value={formData.insurance?.other} onChange={(v) => updateExpense('insurance', 'other', v)} />
          </div>
        </div>
      </div>

      <div className="bg-blue-600 text-white rounded-lg p-6 shadow-lg">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold">TOTAL MONTHLY EXPENSES</h3>
          <div className="text-3xl font-bold">${grandTotal.toFixed(2)}</div>
        </div>
        <div className="mt-4 text-sm opacity-90">
          <p className="text-lg">Annual Total: ${(grandTotal * 12).toFixed(2)}</p>
        </div>
        
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-xs opacity-90">
          <div><strong>Housing:</strong> ${housingTotal.toFixed(2)}</div>
          <div><strong>Utilities:</strong> ${utilitiesTotal.toFixed(2)}</div>
          <div><strong>Food:</strong> ${foodTotal.toFixed(2)}</div>
          <div><strong>Clothing:</strong> ${clothingTotal.toFixed(2)}</div>
          <div><strong>Insurance:</strong> ${insuranceTotal.toFixed(2)}</div>
          <div><strong>Medical:</strong> ${medicalTotal.toFixed(2)}</div>
          <div><strong>Household:</strong> ${householdTotal.toFixed(2)}</div>
          <div><strong>Household Help:</strong> ${householdHelpTotal.toFixed(2)}</div>
          <div><strong>Automobile:</strong> ${autoTotal.toFixed(2)}</div>
          <div><strong>Education:</strong> ${educationTotal.toFixed(2)}</div>
          <div><strong>Recreational:</strong> ${recreationalTotal.toFixed(2)}</div>
          <div><strong>Taxes:</strong> ${taxesTotal.toFixed(2)}</div>
          <div><strong>Miscellaneous:</strong> ${miscTotal.toFixed(2)}</div>
          <div><strong>Other:</strong> ${otherTotal.toFixed(2)}</div>
        </div>
      </div>

      {/* f. Unreimbursed Medical */}
      <div className="border border-gray-300 rounded-lg p-6 bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">(f) Unreimbursed Medical</h3>
          <span className="text-blue-600 font-semibold">${medicalTotal.toFixed(2)}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MoneyInput label="1. Medical" value={formData.medical?.medical} onChange={(v) => updateExpense('medical', 'medical', v)} />
          <MoneyInput label="2. Dental" value={formData.medical?.dental} onChange={(v) => updateExpense('medical', 'dental', v)} />
          <MoneyInput label="3. Optical" value={formData.medical?.optical} onChange={(v) => updateExpense('medical', 'optical', v)} />
          <MoneyInput label="4. Pharmaceutical" value={formData.medical?.pharmaceutical} onChange={(v) => updateExpense('medical', 'pharmaceutical', v)} />
          <MoneyInput label="5. Surgical, Nursing, Hospital" value={formData.medical?.surgical} onChange={(v) => updateExpense('medical', 'surgical', v)} />
          <MoneyInput label="6. Psychotherapy" value={formData.medical?.psychotherapy} onChange={(v) => updateExpense('medical', 'psychotherapy', v)} />
          <MoneyInput label="7. Other" value={formData.medical?.other} onChange={(v) => updateExpense('medical', 'other', v)} />
        </div>
      </div>

      {/* g. Household Maintenance */}
      <div className="border border-gray-300 rounded-lg p-6 bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">(g) Household Maintenance</h3>
          <span className="text-blue-600 font-semibold">${householdTotal.toFixed(2)}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MoneyInput label="1. Repairs/Maintenance" value={formData.household?.repairs} onChange={(v) => updateExpense('household', 'repairs', v)} />
          <MoneyInput label="2. Gardening/Landscaping" value={formData.household?.gardening} onChange={(v) => updateExpense('household', 'gardening', v)} />
          <MoneyInput label="3. Sanitation/Carting" value={formData.household?.sanitation} onChange={(v) => updateExpense('household', 'sanitation', v)} />
          <MoneyInput label="4. Snow Removal" value={formData.household?.snowRemoval} onChange={(v) => updateExpense('household', 'snowRemoval', v)} />
          <MoneyInput label="5. Extermination" value={formData.household?.extermination} onChange={(v) => updateExpense('household', 'extermination', v)} />
          <MoneyInput label="6. Other" value={formData.household?.other} onChange={(v) => updateExpense('household', 'other', v)} />
        </div>
      </div>

      {/* h. Household Help */}
      <div className="border border-gray-300 rounded-lg p-6 bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">(h) Household Help</h3>
          <span className="text-blue-600 font-semibold">${householdHelpTotal.toFixed(2)}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MoneyInput label="1. Domestic (housekeeper, etc.)" value={formData.householdHelp?.domestic} onChange={(v) => updateExpense('householdHelp', 'domestic', v)} />
          <MoneyInput label="2. Nanny/Au Pair/Child Care" value={formData.householdHelp?.nanny} onChange={(v) => updateExpense('householdHelp', 'nanny', v)} />
          <MoneyInput label="3. Babysitter" value={formData.householdHelp?.babysitter} onChange={(v) => updateExpense('householdHelp', 'babysitter', v)} />
          <MoneyInput label="4. Other" value={formData.householdHelp?.other} onChange={(v) => updateExpense('householdHelp', 'other', v)} />
        </div>
      </div>

      {/* i. Automobile */}
      <div className="border border-gray-300 rounded-lg p-6 bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">(i) Automobile</h3>
          <span className="text-blue-600 font-semibold">${autoTotal.toFixed(2)}</span>
        </div>
        <div className="space-y-4">
          <button
            type="button"
            onClick={addAutomobile}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            + Add Automobile
          </button>

          {automobiles.map((auto, index) => (
            <div key={index} className="relative p-4 bg-blue-50 rounded-lg border border-blue-200">
              <button
                type="button"
                onClick={() => removeAutomobile(index)}
                className="absolute top-2 right-2 text-red-600 hover:text-red-800 font-bold text-xl"
              >
                ×
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                  <input
                    type="number"
                    value={auto.year}
                    onChange={(e) => updateAutomobile(index, 'year', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="2020"
                    min="1900"
                    max="2030"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Make</label>
                  <input
                    type="text"
                    value={auto.make}
                    onChange={(e) => updateAutomobile(index, 'make', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Toyota, Honda, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Use Type</label>
                  <select
                    value={auto.useType}
                    onChange={(e) => updateAutomobile(index, 'useType', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="personal">Personal</option>
                    <option value="business">Business</option>
                    <option value="both">Both</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Lease Term (if applicable)</label>
                  <input
                    type="text"
                    value={auto.leaseTerm}
                    onChange={(e) => updateAutomobile(index, 'leaseTerm', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="36 months"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <MoneyInput label="1. Lease or Loan Payments" value={auto.leasePayment} onChange={(v) => updateAutomobile(index, 'leasePayment', v)} />
                <MoneyInput label="2. Gas and Oil" value={auto.gasOil} onChange={(v) => updateAutomobile(index, 'gasOil', v)} />
                <MoneyInput label="3. Repairs" value={auto.repairs} onChange={(v) => updateAutomobile(index, 'repairs', v)} />
                <MoneyInput label="4. Car Wash" value={auto.carWash} onChange={(v) => updateAutomobile(index, 'carWash', v)} />
                <MoneyInput label="5. Parking and Tolls" value={auto.parkingTolls} onChange={(v) => updateAutomobile(index, 'parkingTolls', v)} />
                <MoneyInput label="6. Other" value={auto.other} onChange={(v) => updateAutomobile(index, 'other', v)} />
              </div>
            </div>
          ))}

          {automobiles.length === 0 && (
            <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-gray-500">No automobiles added. Click "Add Automobile" to begin.</p>
            </div>
          )}
        </div>
      </div>

      {/* j. Education Costs */}
      <div className="border border-gray-300 rounded-lg p-6 bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">(j) Education Costs</h3>
          <span className="text-blue-600 font-semibold">${educationTotal.toFixed(2)}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MoneyInput label="1. Nursery and Pre-school" value={formData.education?.nursery} onChange={(v) => updateExpense('education', 'nursery', v)} />
          <MoneyInput label="2. Primary and Secondary" value={formData.education?.primarySecondary} onChange={(v) => updateExpense('education', 'primarySecondary', v)} />
          <MoneyInput label="3. College" value={formData.education?.college} onChange={(v) => updateExpense('education', 'college', v)} />
          <MoneyInput label="4. Post-Graduate" value={formData.education?.postGrad} onChange={(v) => updateExpense('education', 'postGrad', v)} />
          <MoneyInput label="5. Religious Instruction" value={formData.education?.religious} onChange={(v) => updateExpense('education', 'religious', v)} />
          <MoneyInput label="6. School Transportation" value={formData.education?.transportation} onChange={(v) => updateExpense('education', 'transportation', v)} />
          <MoneyInput label="7. School Supplies/Books" value={formData.education?.supplies} onChange={(v) => updateExpense('education', 'supplies', v)} />
          <MoneyInput label="8. School Lunches" value={formData.education?.lunches} onChange={(v) => updateExpense('education', 'lunches', v)} />
          <MoneyInput label="9. Tutoring" value={formData.education?.tutoring} onChange={(v) => updateExpense('education', 'tutoring', v)} />
          <MoneyInput label="10. School Events" value={formData.education?.events} onChange={(v) => updateExpense('education', 'events', v)} />
          <MoneyInput label="11. Child(ren)'s Extra-curricular Activities" value={formData.education?.extracurricular} onChange={(v) => updateExpense('education', 'extracurricular', v)} helpText="Dance, Music, Sports, etc." />
          <MoneyInput label="12. Other" value={formData.education?.other} onChange={(v) => updateExpense('education', 'other', v)} />
        </div>
      </div>

      {/* k. Recreational */}
      <div className="border border-gray-300 rounded-lg p-6 bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">(k) Recreational</h3>
          <span className="text-blue-600 font-semibold">${recreationalTotal.toFixed(2)}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MoneyInput label="1. Vacations" value={formData.recreational?.vacations} onChange={(v) => updateExpense('recreational', 'vacations', v)} />
          <MoneyInput label="2. Movies, Theatre, Ballet, Etc." value={formData.recreational?.entertainment} onChange={(v) => updateExpense('recreational', 'entertainment', v)} />
          <MoneyInput label="3. Music (Digital or Physical Media)" value={formData.recreational?.music} onChange={(v) => updateExpense('recreational', 'music', v)} />
          <MoneyInput label="4. Recreation Clubs and Memberships" value={formData.recreational?.clubs} onChange={(v) => updateExpense('recreational', 'clubs', v)} />
          <MoneyInput label={`5. Activities for ${yourLabel}`} value={formData.recreational?.activities} onChange={(v) => updateExpense('recreational', 'activities', v)} />
          <MoneyInput label="6. Health Club" value={formData.recreational?.healthClub} onChange={(v) => updateExpense('recreational', 'healthClub', v)} />
          <MoneyInput label="7. Summer Camp" value={formData.recreational?.summerCamp} onChange={(v) => updateExpense('recreational', 'summerCamp', v)} />
          <MoneyInput label={`8. Birthday Party Costs for ${yourLabel}'s Child(ren)`} value={formData.recreational?.birthdayParties} onChange={(v) => updateExpense('recreational', 'birthdayParties', v)} />
          <MoneyInput label="9. Other" value={formData.recreational?.other} onChange={(v) => updateExpense('recreational', 'other', v)} />
        </div>
      </div>

      {/* l. Income Taxes */}
      <div className="border border-gray-300 rounded-lg p-6 bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">(l) Income Taxes</h3>
          <span className="text-blue-600 font-semibold">${taxesTotal.toFixed(2)}</span>
        </div>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MoneyInput label="1. Federal" value={formData.taxes?.federal} onChange={(v) => updateExpense('taxes', 'federal', v)} />
            <MoneyInput label="2. State" value={formData.taxes?.state} onChange={(v) => updateExpense('taxes', 'state', v)} />
            <MoneyInput label="3. City" value={formData.taxes?.city} onChange={(v) => updateExpense('taxes', 'city', v)} />
            <MoneyInput label="4. Social Security and Medicare" value={formData.taxes?.socialSecurity} onChange={(v) => updateExpense('taxes', 'socialSecurity', v)} />
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  5. Number of Dependents Claimed in Prior Tax Year
                </label>
                <input
                  type="number"
                  value={formData.taxes?.dependents || ''}
                  onChange={(e) => updateExpense('taxes', 'dependents', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  6. Refund Received for Prior Tax Year
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={formData.taxes?.refund || ''}
                    onChange={(e) => updateExpense('taxes', 'refund', e.target.value)}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* m. Miscellaneous */}
      <div className="border border-gray-300 rounded-lg p-6 bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">(m) Miscellaneous</h3>
          <span className="text-blue-600 font-semibold">${miscTotal.toFixed(2)}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MoneyInput label="1. Beauty Parlor/Barber/Spa" value={formData.miscellaneous?.beautyBarber} onChange={(v) => updateExpense('miscellaneous', 'beautyBarber', v)} />
          <MoneyInput label="2. Toiletries/Non-Prescription Drugs" value={formData.miscellaneous?.toiletries} onChange={(v) => updateExpense('miscellaneous', 'toiletries', v)} />
          <MoneyInput label="3. Books, Magazines, Newspapers" value={formData.miscellaneous?.books} onChange={(v) => updateExpense('miscellaneous', 'books', v)} />
          <MoneyInput label="4. Gifts to Others" value={formData.miscellaneous?.gifts} onChange={(v) => updateExpense('miscellaneous', 'gifts', v)} />
          <MoneyInput label="5. Charitable Contributions" value={formData.miscellaneous?.charitable} onChange={(v) => updateExpense('miscellaneous', 'charitable', v)} />
          <MoneyInput label="6. Religious Organizations Dues" value={formData.miscellaneous?.religious} onChange={(v) => updateExpense('miscellaneous', 'religious', v)} />
          <MoneyInput label="7. Union and Organization Dues" value={formData.miscellaneous?.union} onChange={(v) => updateExpense('miscellaneous', 'union', v)} />
          <MoneyInput label="8. Commutation Expenses" value={formData.miscellaneous?.commutation} onChange={(v) => updateExpense('miscellaneous', 'commutation', v)} />
          <MoneyInput label="9. Veterinarian/Pet Expenses" value={formData.miscellaneous?.pet} onChange={(v) => updateExpense('miscellaneous', 'pet', v)} />
          <MoneyInput label="10. Child Support Payments" value={formData.miscellaneous?.childSupport} onChange={(v) => updateExpense('miscellaneous', 'childSupport', v)} helpText="For children of prior marriage/relationship" />
          <MoneyInput label="11. Alimony and Maintenance Payments" value={formData.miscellaneous?.alimony} onChange={(v) => updateExpense('miscellaneous', 'alimony', v)} helpText="Prior marriage pursuant to court order" />
          <MoneyInput label="12. Loan Payments" value={formData.miscellaneous?.loanPayments} onChange={(v) => updateExpense('miscellaneous', 'loanPayments', v)} />
          <MoneyInput label="13. Unreimbursed Business Expenses" value={formData.miscellaneous?.businessExpenses} onChange={(v) => updateExpense('miscellaneous', 'businessExpenses', v)} />
          <MoneyInput label="14. Safe Deposit Box Rental Fee" value={formData.miscellaneous?.safeDeposit} onChange={(v) => updateExpense('miscellaneous', 'safeDeposit', v)} />
        </div>
      </div>

      {/* n. Other */}
      <div className="border border-gray-300 rounded-lg p-6 bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">(n) Other</h3>
          <span className="text-blue-600 font-semibold">${otherTotal.toFixed(2)}</span>
        </div>
        <div className="space-y-4">
          <button
            type="button"
            onClick={addOtherExpense}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            + Add Other Expense
          </button>

          {otherExpenses.map((expense, index) => (
            <div key={index} className="relative p-4 bg-green-50 rounded-lg border border-green-200">
              <button
                type="button"
                onClick={() => removeOtherExpense(index)}
                className="absolute top-2 right-2 text-red-600 hover:text-red-800 font-bold text-xl"
              >
                ×
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <input
                    type="text"
                    value={expense.description}
                    onChange={(e) => updateOtherExpense(index, 'description', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="Describe the expense"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={expense.amount}
                      onChange={(e) => updateOtherExpense(index, 'amount', e.target.value)}
                      className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="0.00"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          {otherExpenses.length === 0 && (
            <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-gray-500">No other expenses added.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompleteExpensesForm;