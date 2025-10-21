import React, { useState } from 'react';

const CompleteIncomeForm = ({ formData = {}, updateFormData, userRole = 'plaintiff' }) => {
  const [householdMembers, setHouseholdMembers] = useState(formData.householdMembers || []);
  const [otherIncome, setOtherIncome] = useState(formData.otherIncome || []);
  
  const yourLabel = userRole === 'plaintiff' ? 'Plaintiff' : 'Defendant';

  const updateIncome = (field, value) => {
    updateFormData('income', field, value);
  };

  const addHouseholdMember = () => {
    const newMembers = [...householdMembers, { name: '', relationship: '', annualIncome: '' }];
    setHouseholdMembers(newMembers);
    updateFormData('income', 'householdMembers', newMembers);
  };

  const removeHouseholdMember = (index) => {
    const updated = householdMembers.filter((_, i) => i !== index);
    setHouseholdMembers(updated);
    updateFormData('income', 'householdMembers', updated);
  };

  const updateHouseholdMember = (index, field, value) => {
    const updated = [...householdMembers];
    updated[index][field] = value;
    setHouseholdMembers(updated);
    updateFormData('income', 'householdMembers', updated);
  };

  const addOtherIncome = () => {
    const newOther = [...otherIncome, { description: '', amount: '' }];
    setOtherIncome(newOther);
    updateFormData('income', 'otherIncome', newOther);
  };

  const removeOtherIncome = (index) => {
    const updated = otherIncome.filter((_, i) => i !== index);
    setOtherIncome(updated);
    updateFormData('income', 'otherIncome', updated);
  };

  const updateOtherIncome = (index, field, value) => {
    const updated = [...otherIncome];
    updated[index][field] = value;
    setOtherIncome(updated);
    updateFormData('income', 'otherIncome', updated);
  };

  const MoneyInput = ({ label, value, onChange, helpText, required }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-600 ml-1">*</span>}
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

  const PercentageInput = ({ label, value, onChange }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="relative">
        <input
          type="number"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pr-8 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="0"
          step="1"
          min="0"
          max="100"
        />
        <span className="absolute right-3 top-2 text-gray-500">%</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-600 p-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Gross Income Information</h2>
        <p className="text-sm text-gray-700">Provide complete income information from all sources</p>
      </div>

      {/* Primary Gross Income */}
      <div className="border border-gray-300 rounded-lg p-6 bg-white">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Primary Gross Income</h3>
        
        <div className="space-y-6">
          <MoneyInput 
            label="Gross (Total) Income" 
            value={formData.grossIncome} 
            onChange={(v) => updateIncome('grossIncome', v)}
            helpText="As reported on most recent federal tax return"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Has {yourLabel.toLowerCase()}'s income changed during the past year?
            </label>
            <div className="flex gap-4 mb-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={formData.incomeChanged === false}
                  onChange={() => updateIncome('incomeChanged', false)}
                  className="mr-2"
                />
                No change
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={formData.incomeChanged === true}
                  onChange={() => updateIncome('incomeChanged', true)}
                  className="mr-2"
                />
                Yes, income has changed
              </label>
            </div>

            {formData.incomeChanged === true && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Please explain the change:
                </label>
                <textarea
                  value={formData.incomeChangeExplanation || ''}
                  onChange={(e) => updateIncome('incomeChangeExplanation', e.target.value)}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder={`Describe how and why ${yourLabel.toLowerCase()}'s income changed`}
                />
              </div>
            )}
          </div>

          <MoneyInput 
            label="Retirement Benefits or Tax Deferred Savings" 
            value={formData.retirementDeductions} 
            onChange={(v) => updateIncome('retirementDeductions', v)}
            helpText="Amount deducted from gross income"
          />

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800 mb-2">
              <strong>📎 Required Attachments:</strong>
            </p>
            <ul className="text-sm text-yellow-800 list-disc list-inside space-y-1">
              <li>Most recent W-2 forms</li>
              <li>All 1099 forms</li>
              <li>All K-1 forms</li>
              <li>Most recent complete income tax return</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Additional Income Sources */}
      <div className="border border-gray-300 rounded-lg p-6 bg-white">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Additional Income Sources</h3>
        <p className="text-sm text-gray-600 mb-6">To the extent not already included in gross income above:</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MoneyInput 
            label="1. Investment Income" 
            value={formData.investmentIncome} 
            onChange={(v) => updateIncome('investmentIncome', v)}
            helpText="Interest and dividends, reduced by expenses"
          />

          <div className="space-y-3">
            <MoneyInput 
              label="2. Worker's Compensation" 
              value={formData.workersComp} 
              onChange={(v) => updateIncome('workersComp', v)}
            />
            <PercentageInput
              label="Percentage due to lost wages"
              value={formData.workersCompPercent}
              onChange={(v) => updateIncome('workersCompPercent', v)}
            />
          </div>

          <div className="space-y-3">
            <MoneyInput 
              label="3. Disability Benefits" 
              value={formData.disabilityBenefits} 
              onChange={(v) => updateIncome('disabilityBenefits', v)}
            />
            <PercentageInput
              label="Percentage due to lost wages"
              value={formData.disabilityPercent}
              onChange={(v) => updateIncome('disabilityPercent', v)}
            />
          </div>

          <MoneyInput 
            label="4. Unemployment Insurance Benefits" 
            value={formData.unemploymentBenefits} 
            onChange={(v) => updateIncome('unemploymentBenefits', v)}
          />

          <MoneyInput 
            label="5. Social Security Benefits" 
            value={formData.socialSecurityBenefits} 
            onChange={(v) => updateIncome('socialSecurityBenefits', v)}
          />

          <MoneyInput 
            label="6. Supplemental Security Income" 
            value={formData.ssi} 
            onChange={(v) => updateIncome('ssi', v)}
          />

          <MoneyInput 
            label="7. Public Assistance" 
            value={formData.publicAssistance} 
            onChange={(v) => updateIncome('publicAssistance', v)}
          />

          <MoneyInput 
            label="8. Food Stamps" 
            value={formData.foodStamps} 
            onChange={(v) => updateIncome('foodStamps', v)}
          />

          <MoneyInput 
            label="9. Veterans Benefits" 
            value={formData.veteransBenefits} 
            onChange={(v) => updateIncome('veteransBenefits', v)}
          />

          <MoneyInput 
            label="10. Pensions and Retirement Benefits" 
            value={formData.pensionBenefits} 
            onChange={(v) => updateIncome('pensionBenefits', v)}
          />

          <MoneyInput 
            label="11. Fellowships and Stipends" 
            value={formData.fellowships} 
            onChange={(v) => updateIncome('fellowships', v)}
          />

          <MoneyInput 
            label="12. Annuity Payments" 
            value={formData.annuityPayments} 
            onChange={(v) => updateIncome('annuityPayments', v)}
          />
        </div>
      </div>

      {/* Household Members with Income */}
      <div className="border border-gray-300 rounded-lg p-6 bg-white">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Employed Household Members</h3>
        <p className="text-sm text-gray-600 mb-4">If any child or other member of {yourLabel.toLowerCase()}'s household is employed, list their information:</p>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">Add employed household members:</p>
            <button
              type="button"
              onClick={addHouseholdMember}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
            >
              <span className="text-lg">+</span>
              Add Household Member
            </button>
          </div>

          {householdMembers.length === 0 && (
            <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-gray-500">No employed household members added</p>
            </div>
          )}

          {householdMembers.map((member, index) => (
            <div key={index} className="relative p-4 bg-blue-50 rounded-lg border border-blue-200">
              <button
                type="button"
                onClick={() => removeHouseholdMember(index)}
                className="absolute top-2 right-2 text-red-600 hover:text-red-800 font-bold text-xl"
                title="Remove member"
              >
                ×
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={member.name}
                    onChange={(e) => updateHouseholdMember(index, 'name', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Relationship
                  </label>
                  <input
                    type="text"
                    value={member.relationship}
                    onChange={(e) => updateHouseholdMember(index, 'relationship', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Child, Parent, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Annual Income
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={member.annualIncome}
                      onChange={(e) => updateHouseholdMember(index, 'annualIncome', e.target.value)}
                      className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Child Support and Maintenance Received */}
      <div className="border border-gray-300 rounded-lg p-6 bg-white">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Support Received</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <MoneyInput 
              label="Child Support Received (Annual)" 
              value={formData.childSupportReceived} 
              onChange={(v) => updateIncome('childSupportReceived', v)}
              helpText="Pursuant to court order or agreement"
            />
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Details (optional)
              </label>
              <textarea
                value={formData.childSupportDetails || ''}
                onChange={(e) => updateIncome('childSupportDetails', e.target.value)}
                rows="2"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Court order date, case number, etc."
              />
            </div>
          </div>

          <div>
            <MoneyInput 
              label="Maintenance/Alimony Received (Annual)" 
              value={formData.maintenanceReceived} 
              onChange={(v) => updateIncome('maintenanceReceived', v)}
              helpText="Pursuant to court order or agreement"
            />
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Details (optional)
              </label>
              <textarea
                value={formData.maintenanceDetails || ''}
                onChange={(e) => updateIncome('maintenanceDetails', e.target.value)}
                rows="2"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Court order date, case number, etc."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Other Income */}
      <div className="border border-gray-300 rounded-lg p-6 bg-white">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Other Income</h3>
        <p className="text-sm text-gray-600 mb-4">List any other sources of income not mentioned above:</p>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">Add other income sources:</p>
            <button
              type="button"
              onClick={addOtherIncome}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
            >
              <span className="text-lg">+</span>
              Add Other Income
            </button>
          </div>

          {otherIncome.length === 0 && (
            <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-gray-500">No other income sources added</p>
            </div>
          )}

          {otherIncome.map((income, index) => (
            <div key={index} className="relative p-4 bg-green-50 rounded-lg border border-green-200">
              <button
                type="button"
                onClick={() => removeOtherIncome(index)}
                className="absolute top-2 right-2 text-red-600 hover:text-red-800 font-bold text-xl"
                title="Remove income source"
              >
                ×
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    value={income.description}
                    onChange={(e) => updateOtherIncome(index, 'description', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="Describe the income source"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Annual Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={income.amount}
                      onChange={(e) => updateOtherIncome(index, 'amount', e.target.value)}
                      className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="0.00"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Income Summary */}
      <div className="bg-green-600 text-white rounded-lg p-6 shadow-lg">
        <h3 className="text-xl font-bold mb-4">Income Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="opacity-90 mb-1">Primary Gross Income</p>
            <p className="text-2xl font-bold">${parseFloat(formData.grossIncome || 0).toLocaleString('en-US', {minimumFractionDigits: 2})}</p>
          </div>
          <div>
            <p className="opacity-90 mb-1">Additional Income</p>
            <p className="text-2xl font-bold">
              ${(
                (parseFloat(formData.investmentIncome || 0)) +
                (parseFloat(formData.workersComp || 0)) +
                (parseFloat(formData.disabilityBenefits || 0)) +
                (parseFloat(formData.unemploymentBenefits || 0)) +
                (parseFloat(formData.socialSecurityBenefits || 0)) +
                (parseFloat(formData.ssi || 0)) +
                (parseFloat(formData.publicAssistance || 0)) +
                (parseFloat(formData.foodStamps || 0)) +
                (parseFloat(formData.veteransBenefits || 0)) +
                (parseFloat(formData.pensionBenefits || 0)) +
                (parseFloat(formData.fellowships || 0)) +
                (parseFloat(formData.annuityPayments || 0)) +
                (parseFloat(formData.childSupportReceived || 0)) +
                (parseFloat(formData.maintenanceReceived || 0)) +
                otherIncome.reduce((sum, inc) => sum + parseFloat(inc.amount || 0), 0)
              ).toLocaleString('en-US', {minimumFractionDigits: 2})}
            </p>
          </div>
          <div>
            <p className="opacity-90 mb-1">Total Annual Income</p>
            <p className="text-2xl font-bold">
              ${(
                (parseFloat(formData.grossIncome || 0)) +
                (parseFloat(formData.investmentIncome || 0)) +
                (parseFloat(formData.workersComp || 0)) +
                (parseFloat(formData.disabilityBenefits || 0)) +
                (parseFloat(formData.unemploymentBenefits || 0)) +
                (parseFloat(formData.socialSecurityBenefits || 0)) +
                (parseFloat(formData.ssi || 0)) +
                (parseFloat(formData.publicAssistance || 0)) +
                (parseFloat(formData.foodStamps || 0)) +
                (parseFloat(formData.veteransBenefits || 0)) +
                (parseFloat(formData.pensionBenefits || 0)) +
                (parseFloat(formData.fellowships || 0)) +
                (parseFloat(formData.annuityPayments || 0)) +
                (parseFloat(formData.childSupportReceived || 0)) +
                (parseFloat(formData.maintenanceReceived || 0)) +
                otherIncome.reduce((sum, inc) => sum + parseFloat(inc.amount || 0), 0)
              ).toLocaleString('en-US', {minimumFractionDigits: 2})}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompleteIncomeForm;