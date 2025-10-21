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
      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
    />
  </div>
);

const CompleteAdditionalSectionsForm = ({ formData = {}, updateFormData, userRole = 'plaintiff' }) => {
  const [assetsTransferredEntries, setAssetsTransferredEntries] = useState(formData.assetsTransferredEntries || []);
  const [legalExpertFeesEntries, setLegalExpertFeesEntries] = useState(formData.legalExpertFeesEntries || [{ id: 1 }]);

  const addAssetsTransferredEntry = () => {
    const newEntry = { id: Date.now(), description: '', transferee: '', date: '', value: '' };
    const newEntries = [...assetsTransferredEntries, newEntry];
    setAssetsTransferredEntries(newEntries);
    updateFormData('additionalSections', 'assetsTransferredEntries', newEntries);
  };

  const removeAssetsTransferredEntry = (id) => {
    const newEntries = assetsTransferredEntries.filter(entry => entry.id !== id);
    setAssetsTransferredEntries(newEntries);
    updateFormData('additionalSections', 'assetsTransferredEntries', newEntries);
  };

  const updateAssetsTransferredEntry = (id, field, value) => {
    const newEntries = assetsTransferredEntries.map(entry => 
      entry.id === id ? { ...entry, [field]: value } : entry
    );
    setAssetsTransferredEntries(newEntries);
    updateFormData('additionalSections', 'assetsTransferredEntries', newEntries);
  };

  const addLegalExpertFeesEntry = () => {
    const newId = Math.max(...legalExpertFeesEntries.map(e => e.id), 0) + 1;
    const newEntries = [...legalExpertFeesEntries, { id: newId }];
    setLegalExpertFeesEntries(newEntries);
    updateFormData('additionalSections', 'legalExpertFeesEntries', newEntries);
  };

  const removeLegalExpertFeesEntry = (id) => {
    const newEntries = legalExpertFeesEntries.filter(entry => entry.id !== id);
    setLegalExpertFeesEntries(newEntries);
    updateFormData('additionalSections', 'legalExpertFeesEntries', newEntries);
  };

  const updateLegalExpertFeesEntry = (id, field, value) => {
    const newEntries = legalExpertFeesEntries.map(entry => 
      entry.id === id ? { ...entry, [field]: value } : entry
    );
    setLegalExpertFeesEntries(newEntries);
    updateFormData('additionalSections', 'legalExpertFeesEntries', newEntries);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="bg-gray-50 border-l-4 border-gray-600 p-4">
        <h2 className="text-lg font-semibold text-gray-900">Additional Required Sections</h2>
        <p className="text-sm text-gray-800">Complete all items, marking "NONE", "INAPPLICABLE" and "UNKNOWN", if appropriate</p>
      </div>

      <div className="bg-white shadow rounded-lg p-6 space-y-8">
        {/* VI. Assets Transferred */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-md font-medium text-gray-900">VI. ASSETS TRANSFERRED</h3>
            <button
              type="button"
              onClick={addAssetsTransferredEntry}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              + Add Transfer
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            List all assets transferred in any manner during the preceding three years, or length of the marriage, whichever is shorter. 
            Note: Transfers in the routine course of business which resulted in an exchange of assets of substantially equivalent value need not be specifically disclosed where such assets are otherwise identified in the Statement of Net Worth.
          </p>
          
          {assetsTransferredEntries.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No assets transferred. Click "Add Transfer" to add entries.</p>
              <p className="text-sm mt-2">Or mark "NONE" if no transfers occurred.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700 border-b pb-2">
                <div className="col-span-4">Description of Property</div>
                <div className="col-span-3">To Whom Transferred and Relationship to Transferee</div>
                <div className="col-span-2">Date of Transfer</div>
                <div className="col-span-2">Value</div>
                <div className="col-span-1">Actions</div>
              </div>
              
              {assetsTransferredEntries.map((entry, index) => (
                <div key={entry.id} className="grid grid-cols-12 gap-4 items-end">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Description</label>
                    <input
                      type="text"
                      value={entry.description || ''}
                      onChange={(e) => updateAssetsTransferredEntry(entry.id, 'description', e.target.value)}
                      placeholder="Property description"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Transferee & Relationship</label>
                    <input
                      type="text"
                      value={entry.transferee || ''}
                      onChange={(e) => updateAssetsTransferredEntry(entry.id, 'transferee', e.target.value)}
                      placeholder="Name and relationship"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Date</label>
                    <input
                      type="date"
                      value={entry.date || ''}
                      onChange={(e) => updateAssetsTransferredEntry(entry.id, 'date', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Value</label>
                    <MoneyInput
                      value={entry.value}
                      onChange={(value) => updateAssetsTransferredEntry(entry.id, 'value', value)}
                    />
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => removeAssetsTransferredEntry(entry.id)}
                      className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* VII. Legal & Expert Fees */}
        <div className="space-y-4 border-t pt-6">
          <div className="flex justify-between items-center">
            <h3 className="text-md font-medium text-gray-900">VII. LEGAL & EXPERT FEES</h3>
            <button
              type="button"
              onClick={addLegalExpertFeesEntry}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              + Add Fee
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Please state the amount you have paid to all lawyers and experts retained in connection with your marital dissolution, 
            including name of professional, amounts and dates paid, and source of funds. Attach retainer agreement for your present attorney.
          </p>
          
          {legalExpertFeesEntries.map((entry, index) => (
            <div key={entry.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-800">Entry {index + 1}</h4>
                {legalExpertFeesEntries.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeLegalExpertFeesEntry(entry.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Professional Name:
                  </label>
                  <input
                    type="text"
                    value={entry.professionalName || ''}
                    onChange={(e) => updateLegalExpertFeesEntry(entry.id, 'professionalName', e.target.value)}
                    placeholder="Lawyer/Expert name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type of Professional:
                  </label>
                  <select
                    value={entry.professionalType || ''}
                    onChange={(e) => updateLegalExpertFeesEntry(entry.id, 'professionalType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    <option value="">Select type</option>
                    <option value="attorney">Attorney</option>
                    <option value="expert">Expert</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount Paid:
                  </label>
                  <MoneyInput
                    value={entry.amountPaid}
                    onChange={(value) => updateLegalExpertFeesEntry(entry.id, 'amountPaid', value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Paid:
                  </label>
                  <input
                    type="date"
                    value={entry.datePaid || ''}
                    onChange={(e) => updateLegalExpertFeesEntry(entry.id, 'datePaid', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Source of Funds:
                  </label>
                  <input
                    type="text"
                    value={entry.sourceOfFunds || ''}
                    onChange={(e) => updateLegalExpertFeesEntry(entry.id, 'sourceOfFunds', e.target.value)}
                    placeholder="Source of funds used to pay fees"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Details:
                  </label>
                  <textarea
                    value={entry.additionalDetails || ''}
                    onChange={(e) => updateLegalExpertFeesEntry(entry.id, 'additionalDetails', e.target.value)}
                    placeholder="Additional details about services provided"
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* VIII. Other Financial Circumstances */}
        <div className="space-y-4 border-t pt-6">
          <h3 className="text-md font-medium text-gray-900">VIII. OTHER FINANCIAL CIRCUMSTANCES</h3>
          <p className="text-sm text-gray-600 mb-4">
            Other data concerning the financial circumstances of the parties that should be brought to the attention of the court are:
          </p>
          <textarea
            value={formData.otherFinancialCircumstances || ''}
            onChange={(e) => updateFormData('additionalSections', 'otherFinancialCircumstances', e.target.value)}
            placeholder="Describe any other financial circumstances that may be relevant to the case. Mark 'NONE' if no additional circumstances apply."
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
        </div>

        {/* Sworn Statement */}
        <div className="border-t pt-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">SWORN STATEMENT</h4>
            <p className="text-sm text-blue-800 mb-4">
              The foregoing statements and a rider consisting of _____ page(s) annexed hereto and made a part hereof, 
              have been carefully read by the undersigned who states that they are true and correct and states same, 
              under oath, subject to the penalties of perjury.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Signature:
                </label>
                <input
                  type="text"
                  value={formData.signature || ''}
                  onChange={(e) => updateFormData('additionalSections', 'signature', e.target.value)}
                  placeholder="Your signature"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date:
                </label>
                <input
                  type="date"
                  value={formData.signatureDate || ''}
                  onChange={(e) => updateFormData('additionalSections', 'signatureDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statement Number:
              </label>
              <input
                type="text"
                value={formData.statementNumber || ''}
                onChange={(e) => updateFormData('additionalSections', 'statementNumber', e.target.value)}
                placeholder="This is the _______ Statement of Net Worth I have filed in this proceeding"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Required Attachments Notice */}
        <div className="border-t pt-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-900 mb-2">REQUIRED ATTACHMENTS:</h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Retainer Agreement</li>
              <li>• Most recent W-2, 1099s, K1s and Income Tax Returns</li>
            </ul>
            <p className="text-xs text-yellow-700 mt-2">
              <strong>Note:</strong> Despite amendment of CPLR 2106 to permit civil litigants to file affirmations instead of affidavits, 
              this form should still be signed before a notary public to comply with DRL 236(B)(4) (Sworn Statement of Net Worth), 
              which statute remains in effect.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompleteAdditionalSectionsForm;
