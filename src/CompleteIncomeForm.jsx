import React from 'react';

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
      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
    />
  </div>
);

const CompleteIncomeForm = ({ formData = {}, updateFormData, userRole = 'plaintiff' }) => {

  // Calculate totals - with simple fallbacks
  const grossIncomeTotal = ((parseFloat(formData.grossIncome) || 0) + 
                           (parseFloat(formData.investmentIncome) || 0) + 
                           (parseFloat(formData.workersCompensation) || 0) + 
                           (parseFloat(formData.disabilityBenefits) || 0) + 
                           (parseFloat(formData.unemploymentBenefits) || 0) + 
                           (parseFloat(formData.socialSecurityBenefits) || 0) + 
                           (parseFloat(formData.supplementalSecurityIncome) || 0) + 
                           (parseFloat(formData.publicAssistance) || 0) + 
                           (parseFloat(formData.foodStamps) || 0) + 
                           (parseFloat(formData.veteransBenefits) || 0) + 
                           (parseFloat(formData.pensionsRetirementBenefits) || 0) + 
                           (parseFloat(formData.fellowshipsStipends) || 0) + 
                           (parseFloat(formData.annuityPayments) || 0) + 
                           (parseFloat(formData.maintenanceChildSupportReceived) || 0) + 
                           (parseFloat(formData.otherIncome) || 0));

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="bg-green-50 border-l-4 border-green-600 p-4">
        <h2 className="text-lg font-semibold text-green-900">III. GROSS INCOME INFORMATION</h2>
      </div>

      <div className="bg-white shadow rounded-lg p-6 space-y-8">
        {/* Section (a) - Gross Income */}
        <div className="space-y-4">
          <h3 className="text-md font-medium text-gray-900">
            (a) Gross (total) income - as should have been or should be reported in the most recent Federal income tax return.
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            State whether your income has changed during the year preceding date of this affidavit. If so, please explain.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gross Income:
              </label>
              <MoneyInput
                value={formData.grossIncome}
                onChange={(value) => updateFormData('income', 'grossIncome', value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                List any amount deducted from gross income for retirement benefits or tax deferred savings:
              </label>
              <MoneyInput
                value={formData.retirementDeductions}
                onChange={(value) => updateFormData('income', 'retirementDeductions', value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Income Source Type:
              </label>
              <select
                value={formData.primaryIncomeSource || ''}
                onChange={(e) => updateFormData('income', 'primaryIncomeSource', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-orange"
              >
                <option value="">Select Primary Income Source</option>
                <option value="employment">Employment (W-2)</option>
                <option value="self-employment">Self-Employment (1099)</option>
                <option value="business-owner">Business Owner</option>
                <option value="investment">Investment Income</option>
                <option value="retirement">Retirement Benefits</option>
                <option value="disability">Disability Benefits</option>
                <option value="unemployment">Unemployment Benefits</option>
                <option value="social-security">Social Security</option>
                <option value="child-support">Child Support</option>
                <option value="alimony">Alimony/Maintenance</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employment Status:
              </label>
              <select
                value={formData.employmentStatus || ''}
                onChange={(e) => updateFormData('income', 'employmentStatus', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select Employment Status</option>
                <option value="full-time">Full-Time Employee</option>
                <option value="part-time">Part-Time Employee</option>
                <option value="self-employed">Self-Employed</option>
                <option value="unemployed">Unemployed</option>
                <option value="retired">Retired</option>
                <option value="disabled">Disabled</option>
                <option value="student">Student</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Attach most recent W-2, 1099s, K1s and income tax returns.
            </p>
          </div>
        </div>

        {/* Section (b) - Additional Income Sources */}
        <div className="space-y-4 border-t pt-6">
          <h3 className="text-md font-medium text-gray-900">
            (b) To the extent not already included in gross income in (a) above:
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1. Investment income, including interest and dividend income, reduced by sums expended in connection with such investment:
              </label>
              <MoneyInput
                value={formData.investmentIncome}
                onChange={(value) => updateFormData('income', 'investmentIncome', value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                2. Worker's compensation (indicate percentage of amount due to lost wages):
              </label>
              <MoneyInput
                value={formData.workersCompensation}
                onChange={(value) => updateFormData('income', 'workersCompensation', value)}
              />
              <input
                type="text"
                value={formData.workersCompPercentage || ''}
                onChange={(e) => updateFormData('income', 'workersCompPercentage', e.target.value)}
                placeholder="Percentage due to lost wages"
                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                3. Disability benefits (indicate percentage of amount due to lost wages):
              </label>
              <MoneyInput
                value={formData.disabilityBenefits}
                onChange={(value) => updateFormData('income', 'disabilityBenefits', value)}
              />
              <input
                type="text"
                value={formData.disabilityPercentage || ''}
                onChange={(e) => updateFormData('income', 'disabilityPercentage', e.target.value)}
                placeholder="Percentage due to lost wages"
                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                4. Unemployment insurance benefits:
              </label>
              <MoneyInput
                value={formData.unemploymentBenefits}
                onChange={(value) => updateFormData('income', 'unemploymentBenefits', value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                5. Social Security benefits:
              </label>
              <MoneyInput
                value={formData.socialSecurityBenefits}
                onChange={(value) => updateFormData('income', 'socialSecurityBenefits', value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                6. Supplemental Security Income:
              </label>
              <MoneyInput
                value={formData.supplementalSecurityIncome}
                onChange={(value) => updateFormData('income', 'supplementalSecurityIncome', value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                7. Public assistance:
              </label>
              <MoneyInput
                value={formData.publicAssistance}
                onChange={(value) => updateFormData('income', 'publicAssistance', value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                8. Food stamps:
              </label>
              <MoneyInput
                value={formData.foodStamps}
                onChange={(value) => updateFormData('income', 'foodStamps', value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                9. Veterans benefits:
              </label>
              <MoneyInput
                value={formData.veteransBenefits}
                onChange={(value) => updateFormData('income', 'veteransBenefits', value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                10. Pensions and retirement benefits:
              </label>
              <MoneyInput
                value={formData.pensionsRetirementBenefits}
                onChange={(value) => updateFormData('income', 'pensionsRetirementBenefits', value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                11. Fellowships and stipends:
              </label>
              <MoneyInput
                value={formData.fellowshipsStipends}
                onChange={(value) => updateFormData('income', 'fellowshipsStipends', value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                12. Annuity payments:
              </label>
              <MoneyInput
                value={formData.annuityPayments}
                onChange={(value) => updateFormData('income', 'annuityPayments', value)}
              />
            </div>
          </div>
        </div>

        {/* Section (c) - Household Member Income */}
        <div className="space-y-4 border-t pt-6">
          <h3 className="text-md font-medium text-gray-900">
            (c) Household member income (name / annual income):
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maintenance/Child Support received:
              </label>
              <MoneyInput
                value={formData.maintenanceChildSupportReceived}
                onChange={(value) => updateFormData('income', 'maintenanceChildSupportReceived', value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Other income:
              </label>
              <MoneyInput
                value={formData.otherIncome}
                onChange={(value) => updateFormData('income', 'otherIncome', value)}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Other income details:
            </label>
            <textarea
              value={formData.otherIncomeDetails || ''}
              onChange={(e) => updateFormData('income', 'otherIncomeDetails', e.target.value)}
              placeholder="Describe other income sources"
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Total Income Display */}
        <div className="border-t pt-6">
          <div className="bg-green-100 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-green-900">TOTAL GROSS INCOME:</span>
              <span className="text-xl font-bold text-green-900">${(grossIncomeTotal || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompleteIncomeForm;