import React, { useState } from 'react';

const CompleteFamilyDataForm = ({ formData = {}, updateFormData, userRole = 'plaintiff' }) => {
  const [children, setChildren] = useState(formData.children || []);
  const [priorChildren, setPriorChildren] = useState(formData.priorChildren || []);

  // New York State Counties
  const nyCounties = [
    'Albany', 'Allegany', 'Bronx', 'Broome', 'Cattaraugus', 'Cayuga', 'Chautauqua', 
    'Chemung', 'Chenango', 'Clinton', 'Columbia', 'Cortland', 'Delaware', 'Dutchess', 
    'Erie', 'Essex', 'Franklin', 'Fulton', 'Genesee', 'Greene', 'Hamilton', 'Herkimer', 
    'Jefferson', 'Kings (Brooklyn)', 'Lewis', 'Livingston', 'Madison', 'Monroe', 
    'Montgomery', 'Nassau', 'New York (Manhattan)', 'Niagara', 'Oneida', 'Onondaga', 
    'Ontario', 'Orange', 'Orleans', 'Oswego', 'Otsego', 'Putnam', 'Queens', 'Rensselaer', 
    'Richmond (Staten Island)', 'Rockland', 'Saratoga', 'Schenectady', 'Schoharie', 
    'Schuyler', 'Seneca', 'St. Lawrence', 'Steuben', 'Suffolk', 'Sullivan', 'Tioga', 
    'Tompkins', 'Ulster', 'Warren', 'Washington', 'Wayne', 'Westchester', 'Wyoming', 'Yates'
  ];

  const addChild = () => {
    const newChildren = [...children, { name: '', dateOfBirth: '' }];
    setChildren(newChildren);
    updateFormData('familyData', 'children', newChildren);
  };

  const removeChild = (index) => {
    const updated = children.filter((_, i) => i !== index);
    setChildren(updated);
    updateFormData('familyData', 'children', updated);
  };

  const updateChild = (index, field, value) => {
    const updated = [...children];
    updated[index][field] = value;
    setChildren(updated);
    updateFormData('familyData', 'children', updated);
  };

  const addPriorChild = () => {
    const newPriorChildren = [...priorChildren, { name: '', dateOfBirth: '', custody: '' }];
    setPriorChildren(newPriorChildren);
    updateFormData('familyData', 'priorChildren', newPriorChildren);
  };

  const removePriorChild = (index) => {
    const updated = priorChildren.filter((_, i) => i !== index);
    setPriorChildren(updated);
    updateFormData('familyData', 'priorChildren', updated);
  };

  const updatePriorChild = (index, field, value) => {
    const updated = [...priorChildren];
    updated[index][field] = value;
    setPriorChildren(updated);
    updateFormData('familyData', 'priorChildren', updated);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-6">
      {/* Header Section */}
      <div className="bg-light-blue border-l-4 border-primary-blue p-4">
        <h2 className="text-lg font-semibold text-primary-blue">SUPREME COURT OF THE STATE OF NEW YORK</h2>
        <p className="text-sm text-primary-blue mt-2">COUNTY OF</p>
        <div className="mt-4 p-4 bg-white rounded border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Plaintiff:</label>
              <input
                type="text"
                value={formData.plaintiffName || ''}
                onChange={(e) => updateFormData('familyData', 'plaintiffName', e.target.value)}
                placeholder="Plaintiff name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Defendant:</label>
              <input
                type="text"
                value={formData.defendantName || ''}
                onChange={(e) => updateFormData('familyData', 'defendantName', e.target.value)}
                placeholder="Defendant name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Statement Date:</label>
              <input
                type="date"
                value={formData.statementDate || ''}
                onChange={(e) => updateFormData('familyData', 'statementDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">County:</label>
              <select
                value={formData.county || ''}
                onChange={(e) => updateFormData('familyData', 'county', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a county</option>
                {nyCounties.map((county, index) => (
                  <option key={index} value={county}>
                    {county}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Index No.:</label>
              <input
                type="text"
                value={formData.indexNumber || ''}
                onChange={(e) => updateFormData('familyData', 'indexNumber', e.target.value)}
                placeholder="Index number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Action Commenced:</label>
              <input
                type="date"
                value={formData.dateActionCommenced || ''}
                onChange={(e) => updateFormData('familyData', 'dateActionCommenced', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Oath Section */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="text-md font-medium text-gray-900 mb-4">OATH SECTION</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">County:</label>
              <select
                value={formData.oathCounty || ''}
                onChange={(e) => updateFormData('familyData', 'oathCounty', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a county</option>
                {nyCounties.map((county, index) => (
                  <option key={index} value={county}>
                    {county}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Deponent Name:</label>
              <input
                type="text"
                value={formData.deponentName || ''}
                onChange={(e) => updateFormData('familyData', 'deponentName', e.target.value)}
                placeholder="Your full name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date of Statement:</label>
            <input
              type="date"
              value={formData.dateOfStatement || ''}
              onChange={(e) => updateFormData('familyData', 'dateOfStatement', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Family Data Section */}
      <div className="bg-white shadow rounded-lg p-6 space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">I. FAMILY DATA</h3>
        
        {/* Basic Family Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              (a) Plaintiff's date of birth:
            </label>
            <input
              type="date"
              value={formData.plaintiffDateOfBirth || ''}
              onChange={(e) => updateFormData('familyData', 'plaintiffDateOfBirth', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              (b) Defendant's date of birth:
            </label>
            <input
              type="date"
              value={formData.defendantDateOfBirth || ''}
              onChange={(e) => updateFormData('familyData', 'defendantDateOfBirth', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              (c) Date married:
            </label>
            <input
              type="date"
              value={formData.dateMarried || ''}
              onChange={(e) => updateFormData('familyData', 'dateMarried', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Children of the Marriage */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            (d) Names and dates of birth of Child(ren) of the marriage:
          </label>
          <div className="space-y-3">
            {children.map((child, index) => (
              <div key={index} className="flex gap-3 items-end">
                <div className="flex-1">
                  <label className="block text-xs text-gray-600 mb-1">Name:</label>
                  <input
                    type="text"
                    value={child.name}
                    onChange={(e) => updateChild(index, 'name', e.target.value)}
                    placeholder="Child's full name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-gray-600 mb-1">Date of Birth:</label>
                  <input
                    type="date"
                    value={child.dateOfBirth}
                    onChange={(e) => updateChild(index, 'dateOfBirth', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeChild(index)}
                  className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addChild}
              className="px-4 py-2 bg-primary-blue text-white rounded-md hover:bg-secondary-blue focus:outline-none focus:ring-2 focus:ring-primary-blue"
            >
              + Add Child
            </button>
          </div>
        </div>

        {/* Minor Children of Prior Marriage */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            (e) Minor child(ren) of prior marriage:
          </label>
          <div className="space-y-3">
            {priorChildren.map((child, index) => (
              <div key={index} className="flex gap-3 items-end">
                <div className="flex-1">
                  <label className="block text-xs text-gray-600 mb-1">Name:</label>
                  <input
                    type="text"
                    value={child.name}
                    onChange={(e) => updatePriorChild(index, 'name', e.target.value)}
                    placeholder="Child's full name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-gray-600 mb-1">Date of Birth:</label>
                  <input
                    type="date"
                    value={child.dateOfBirth}
                    onChange={(e) => updatePriorChild(index, 'dateOfBirth', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-gray-600 mb-1">Custody:</label>
          <input
            type="text"
                    value={child.custody}
                    onChange={(e) => updatePriorChild(index, 'custody', e.target.value)}
                    placeholder="Custody arrangement"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removePriorChild(index)}
                  className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addPriorChild}
              className="px-4 py-2 bg-primary-blue text-white rounded-md hover:bg-secondary-blue focus:outline-none focus:ring-2 focus:ring-primary-blue"
            >
              + Add Prior Marriage Child
            </button>
          </div>
        </div>

        {/* Addresses */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              (g) Plaintiff's present address:
            </label>
            <textarea
              value={formData.plaintiffAddress || ''}
              onChange={(e) => updateFormData('familyData', 'plaintiffAddress', e.target.value)}
              placeholder="Enter full address"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Defendant's present address:
            </label>
            <textarea
              value={formData.defendantAddress || ''}
              onChange={(e) => updateFormData('familyData', 'defendantAddress', e.target.value)}
              placeholder="Enter full address"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Occupations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              (h) Employment Status - Plaintiff:
            </label>
            <select
              value={formData.plaintiffEmploymentStatus || ''}
              onChange={(e) => updateFormData('familyData', 'plaintiffEmploymentStatus', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue mb-3"
            >
              <option value="">Select Employment Status</option>
              <option value="employed">Employed</option>
              <option value="unemployed">Unemployed</option>
              <option value="full-time-student">Full-time Student</option>
              <option value="retired">Retired</option>
              <option value="self-employed">Self-employed</option>
              <option value="disabled">Disabled</option>
              <option value="homemaker">Homemaker</option>
              <option value="other">Other</option>
            </select>
            
            {(formData.plaintiffEmploymentStatus === 'employed' || formData.plaintiffEmploymentStatus === 'self-employed') && (
              <div className="space-y-2">
                <input
                  type="text"
                  value={formData.plaintiffOccupation || ''}
                  onChange={(e) => updateFormData('familyData', 'plaintiffOccupation', e.target.value)}
                  placeholder="Job title/Position"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
                />
                <input
                  type="text"
                  value={formData.plaintiffEmployer || ''}
                  onChange={(e) => updateFormData('familyData', 'plaintiffEmployer', e.target.value)}
                  placeholder="Employer/Company name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
                />
              </div>
            )}
            
            {formData.plaintiffEmploymentStatus === 'other' && (
              <textarea
                value={formData.plaintiffOccupation || ''}
                onChange={(e) => updateFormData('familyData', 'plaintiffOccupation', e.target.value)}
                placeholder="Please specify"
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Employment Status - Defendant:
            </label>
            <select
              value={formData.defendantEmploymentStatus || ''}
              onChange={(e) => updateFormData('familyData', 'defendantEmploymentStatus', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue mb-3"
            >
              <option value="">Select Employment Status</option>
              <option value="employed">Employed</option>
              <option value="unemployed">Unemployed</option>
              <option value="full-time-student">Full-time Student</option>
              <option value="retired">Retired</option>
              <option value="self-employed">Self-employed</option>
              <option value="disabled">Disabled</option>
              <option value="homemaker">Homemaker</option>
              <option value="other">Other</option>
            </select>
            
            {(formData.defendantEmploymentStatus === 'employed' || formData.defendantEmploymentStatus === 'self-employed') && (
              <div className="space-y-2">
                <input
                  type="text"
                  value={formData.defendantOccupation || ''}
                  onChange={(e) => updateFormData('familyData', 'defendantOccupation', e.target.value)}
                  placeholder="Job title/Position"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
                />
                <input
                  type="text"
                  value={formData.defendantEmployer || ''}
                  onChange={(e) => updateFormData('familyData', 'defendantEmployer', e.target.value)}
                  placeholder="Employer/Company name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
                />
              </div>
            )}
            
            {formData.defendantEmploymentStatus === 'other' && (
              <textarea
                value={formData.defendantOccupation || ''}
                onChange={(e) => updateFormData('familyData', 'defendantOccupation', e.target.value)}
                placeholder="Please specify"
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompleteFamilyDataForm;