import React, { useState } from 'react';

const CompleteFamilyDataForm = ({ formData = {}, updateFormData, userRole = 'plaintiff' }) => {
  const [children, setChildren] = useState(formData.children || []);
  const [hasChildren, setHasChildren] = useState(formData.hasChildren ?? null);
  const [priorChildren, setPriorChildren] = useState(formData.priorChildren || []);
  const [hasPriorChildren, setHasPriorChildren] = useState(formData.hasPriorChildren ?? null);
  const [customCourtName, setCustomCourtName] = useState(false);
  const [customCounty, setCustomCounty] = useState(false);

  // New York State Counties
  const nyCounties = [
    'Albany', 'Allegany', 'Bronx', 'Broome', 'Cattaraugus', 'Cayuga', 'Chautauqua', 'Chemung', 
    'Chenango', 'Clinton', 'Columbia', 'Cortland', 'Delaware', 'Dutchess', 'Erie', 'Essex', 
    'Franklin', 'Fulton', 'Genesee', 'Greene', 'Hamilton', 'Herkimer', 'Jefferson', 'Kings', 
    'Lewis', 'Livingston', 'Madison', 'Monroe', 'Montgomery', 'Nassau', 'New York', 'Niagara', 
    'Oneida', 'Onondaga', 'Ontario', 'Orange', 'Orleans', 'Oswego', 'Otsego', 'Putnam', 
    'Queens', 'Rensselaer', 'Richmond', 'Rockland', 'Saratoga', 'Schenectady', 'Schoharie', 
    'Schuyler', 'Seneca', 'St. Lawrence', 'Steuben', 'Suffolk', 'Sullivan', 'Tioga', 'Tompkins', 
    'Ulster', 'Warren', 'Washington', 'Wayne', 'Westchester', 'Wyoming', 'Yates'
  ];

  // Court options
  const courtOptions = [
    'Supreme Court of the State of New York',
    'Family Court of the State of New York',
    'Surrogate\'s Court',
    'County Court',
    'City Court',
    'Justice Court',
    'Custom (Enter manually)'
  ];

  const yourLabel = userRole === 'plaintiff' ? 'Plaintiff (You)' : 'Defendant (You)';
  const otherLabel = userRole === 'plaintiff' ? 'Defendant (Other Party)' : 'Plaintiff (Other Party)';
  const yourField = userRole === 'plaintiff' ? 'plaintiff' : 'defendant';
  const otherField = userRole === 'plaintiff' ? 'defendant' : 'plaintiff';

  const handleChildrenChoice = (choice) => {
    setHasChildren(choice);
    updateFormData('familyData', 'hasChildren', choice);
    if (!choice) {
      setChildren([]);
      updateFormData('familyData', 'children', []);
    }
  };

  const handlePriorChildrenChoice = (choice) => {
    setHasPriorChildren(choice);
    updateFormData('familyData', 'hasPriorChildren', choice);
    if (!choice) {
      setPriorChildren([]);
      updateFormData('familyData', 'priorChildren', []);
    }
  };

  const addChild = () => {
    const newChildren = [...children, { name: '', dob: '' }];
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
    const newPriorChildren = [...priorChildren, { name: '', dob: '', custody: '' }];
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
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="bg-blue-50 border-l-4 border-blue-600 p-4">
        <p className="text-sm text-blue-800">
          <strong>📝 You are filling this out as: {yourLabel}</strong>
        </p>
      </div>

      <h2 className="text-2xl font-bold text-gray-900">Family Information</h2>
      
      {/* Court Information */}
      <div className="bg-blue-50 border border-blue-300 rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Court Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Court Name
            </label>
            {!customCourtName ? (
              <div>
                <select
                  value={formData.courtName || 'Supreme Court of the State of New York'}
                  onChange={(e) => {
                    if (e.target.value === 'Custom (Enter manually)') {
                      setCustomCourtName(true);
                      updateFormData('familyData', 'courtName', '');
                    } else {
                      updateFormData('familyData', 'courtName', e.target.value);
                    }
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {courtOptions.map((court) => (
                    <option key={court} value={court}>
                      {court}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setCustomCourtName(true)}
                  className="text-xs text-blue-600 hover:text-blue-800 mt-1"
                >
                  Enter custom court name
                </button>
              </div>
            ) : (
              <div>
                <input
                  type="text"
                  value={formData.courtName || ''}
                  onChange={(e) => updateFormData('familyData', 'courtName', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter custom court name"
                />
                <button
                  type="button"
                  onClick={() => {
                    setCustomCourtName(false);
                    updateFormData('familyData', 'courtName', 'Supreme Court of the State of New York');
                  }}
                  className="text-xs text-blue-600 hover:text-blue-800 mt-1"
                >
                  Use dropdown selection
                </button>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">Court hearing your case (defaults to Supreme Court)</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              County
            </label>
            {!customCounty ? (
              <div>
                <select
                  value={formData.county || ''}
                  onChange={(e) => {
                    if (e.target.value === 'Custom (Enter manually)') {
                      setCustomCounty(true);
                      updateFormData('familyData', 'county', '');
                    } else {
                      updateFormData('familyData', 'county', e.target.value);
                    }
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a county...</option>
                  {nyCounties.map((county) => (
                    <option key={county} value={county}>
                      {county}
                    </option>
                  ))}
                  <option value="Custom (Enter manually)">Custom (Enter manually)</option>
                </select>
                <button
                  type="button"
                  onClick={() => setCustomCounty(true)}
                  className="text-xs text-blue-600 hover:text-blue-800 mt-1"
                >
                  Enter custom county
                </button>
              </div>
            ) : (
              <div>
                <input
                  type="text"
                  value={formData.county || ''}
                  onChange={(e) => updateFormData('familyData', 'county', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter custom county name"
                />
                <button
                  type="button"
                  onClick={() => {
                    setCustomCounty(false);
                    updateFormData('familyData', 'county', '');
                  }}
                  className="text-xs text-blue-600 hover:text-blue-800 mt-1"
                >
                  Use dropdown selection
                </button>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">New York State county where case is being heard</p>
          </div>
        </div>
      </div>

      {/* Date Form is Being Filled Out & Index Number */}
      <div className="bg-gray-50 border border-gray-300 rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Case Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Statement Prepared
            </label>
            <input
              type="date"
              value={formData.formFilledDate || new Date().toISOString().split('T')[0]}
              onChange={(e) => updateFormData('familyData', 'formFilledDate', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">This date will appear on the official form</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Index No
            </label>
            <input
              type="text"
              value={formData.indexNumber || ''}
              onChange={(e) => updateFormData('familyData', 'indexNumber', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter case index number"
            />
            <p className="text-xs text-gray-500 mt-1">Case reference number for court records</p>
          </div>
        </div>
      </div>
      
      {/* Basic Information */}
      <div className="border border-gray-300 rounded-lg p-6 bg-white">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Basic Information</h3>
        
        {/* Names Section */}
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="text-md font-semibold text-gray-800 mb-3">Full Names (for Court Documents)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {yourLabel} - First Name
              </label>
              <input
                type="text"
                value={formData[`${yourField}FirstName`] || ''}
                onChange={(e) => updateFormData('familyData', `${yourField}FirstName`, e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your first name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {yourLabel} - Last Name
              </label>
              <input
                type="text"
                value={formData[`${yourField}LastName`] || ''}
                onChange={(e) => updateFormData('familyData', `${yourField}LastName`, e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your last name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {otherLabel} - First Name
              </label>
              <input
                type="text"
                value={formData[`${otherField}FirstName`] || ''}
                onChange={(e) => updateFormData('familyData', `${otherField}FirstName`, e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter other party's first name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {otherLabel} - Last Name
              </label>
              <input
                type="text"
                value={formData[`${otherField}LastName`] || ''}
                onChange={(e) => updateFormData('familyData', `${otherField}LastName`, e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter other party's last name"
              />
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            💡 These names will automatically appear in the sworn statement section of your court document.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {yourLabel} - Date of Birth
            </label>
            <input
              type="date"
              value={formData[`${yourField}DOB`] || ''}
              onChange={(e) => updateFormData('familyData', `${yourField}DOB`, e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {otherLabel} - Date of Birth
            </label>
            <input
              type="date"
              value={formData[`${otherField}DOB`] || ''}
              onChange={(e) => updateFormData('familyData', `${otherField}DOB`, e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Married
            </label>
            <input
              type="date"
              value={formData.dateMarried || ''}
              onChange={(e) => updateFormData('familyData', 'dateMarried', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Children of the Marriage */}
      <div className="border border-gray-300 rounded-lg p-6 bg-white">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Children of the Marriage</h3>
        
        <div className="flex gap-4 mb-6">
          <button
            type="button"
            onClick={() => handleChildrenChoice(false)}
            className={`flex-1 px-6 py-4 rounded-lg border-2 transition ${
              hasChildren === false
                ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold'
                : 'border-gray-300 hover:border-gray-400 text-gray-700'
            }`}
          >
            <div className="text-2xl mb-1">👤</div>
            <div>No Children</div>
          </button>
          
          <button
            type="button"
            onClick={() => handleChildrenChoice(true)}
            className={`flex-1 px-6 py-4 rounded-lg border-2 transition ${
              hasChildren === true
                ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold'
                : 'border-gray-300 hover:border-gray-400 text-gray-700'
            }`}
          >
            <div className="text-2xl mb-1">👨‍👩‍👧‍👦</div>
            <div>Has Children</div>
          </button>
        </div>

        {hasChildren === true && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">Add each child below:</p>
              <button
                type="button"
                onClick={addChild}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
              >
                <span className="text-lg">+</span>
                Add Child
              </button>
            </div>
            
            {children.length === 0 && (
              <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <p className="text-gray-500">No children added yet. Click "Add Child" to begin.</p>
              </div>
            )}

            {children.map((child, index) => (
              <div key={index} className="relative p-4 bg-gray-50 rounded-lg border border-gray-200">
                <button
                  type="button"
                  onClick={() => removeChild(index)}
                  className="absolute top-2 right-2 text-red-600 hover:text-red-800 font-bold text-xl"
                  title="Remove child"
                >
                  ×
                </button>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Child #{index + 1} - Full Name
                    </label>
                    <input
                      type="text"
                      value={child.name}
                      onChange={(e) => updateChild(index, 'name', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter child's full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={child.dob}
                      onChange={(e) => updateChild(index, 'dob', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {hasChildren === false && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              ✓ You've indicated there are no children of this marriage.
            </p>
          </div>
        )}
      </div>

      {/* Minor Children from Prior Marriages */}
      <div className="border border-gray-300 rounded-lg p-6 bg-white">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Minor Children from Prior Marriages or Relationships</h3>
        
        <div className="flex gap-4 mb-6">
          <button
            type="button"
            onClick={() => handlePriorChildrenChoice(false)}
            className={`flex-1 px-6 py-4 rounded-lg border-2 transition ${
              hasPriorChildren === false
                ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold'
                : 'border-gray-300 hover:border-gray-400 text-gray-700'
            }`}
          >
            <div className="text-2xl mb-1">👤</div>
            <div>No Prior Children</div>
          </button>
          
          <button
            type="button"
            onClick={() => handlePriorChildrenChoice(true)}
            className={`flex-1 px-6 py-4 rounded-lg border-2 transition ${
              hasPriorChildren === true
                ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold'
                : 'border-gray-300 hover:border-gray-400 text-gray-700'
            }`}
          >
            <div className="text-2xl mb-1">👶</div>
            <div>Has Prior Children</div>
          </button>
        </div>

        {hasPriorChildren === true && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">Add each minor child from prior marriage/relationship below:</p>
              <button
                type="button"
                onClick={addPriorChild}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
              >
                <span className="text-lg">+</span>
                Add Prior Child
              </button>
            </div>
            
            {priorChildren.length === 0 && (
              <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <p className="text-gray-500">No prior children added yet. Click "Add Prior Child" to begin.</p>
              </div>
            )}

            {priorChildren.map((child, index) => (
              <div key={index} className="relative p-4 bg-purple-50 rounded-lg border border-purple-200">
                <button
                  type="button"
                  onClick={() => removePriorChild(index)}
                  className="absolute top-2 right-2 text-red-600 hover:text-red-800 font-bold text-xl"
                  title="Remove child"
                >
                  ×
                </button>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prior Child #{index + 1} - Full Name
                    </label>
                    <input
                      type="text"
                      value={child.name}
                      onChange={(e) => updatePriorChild(index, 'name', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter child's full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={child.dob}
                      onChange={(e) => updatePriorChild(index, 'dob', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Custody Arrangement
                    </label>
                    <select
                      value={child.custody}
                      onChange={(e) => updatePriorChild(index, 'custody', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Select custody...</option>
                      <option value="sole">Sole Custody (You)</option>
                      <option value="joint">Joint Custody</option>
                      <option value="other-parent">Other Parent Has Custody</option>
                      <option value="shared">Shared/Split Custody</option>
                      <option value="third-party">Third Party Custody</option>
                      <option value="other">Other Arrangement</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mt-4">
              <p className="text-sm text-purple-800">
                <strong>ℹ️ Note:</strong> Include only minor children (under 18) from prior marriages or relationships. You may need to provide supporting documentation regarding custody arrangements.
              </p>
            </div>
          </div>
        )}

        {hasPriorChildren === false && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              ✓ You've indicated there are no minor children from prior marriages or relationships.
            </p>
          </div>
        )}
      </div>

      {/* Addresses */}
      <div className="border border-gray-300 rounded-lg p-6 bg-white">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Current Addresses</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {yourLabel} - Current Address
            </label>
            <textarea
              value={formData[`${yourField}Address`] || ''}
              onChange={(e) => updateFormData('familyData', `${yourField}Address`, e.target.value)}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Street, City, State, ZIP"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {otherLabel} - Current Address
            </label>
            <textarea
              value={formData[`${otherField}Address`] || ''}
              onChange={(e) => updateFormData('familyData', `${otherField}Address`, e.target.value)}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Street, City, State, ZIP"
            />
          </div>
        </div>
      </div>

      {/* Employment Information */}
      <div className="border border-gray-300 rounded-lg p-6 bg-white">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Employment Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Your Employment */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">{yourLabel} - Employment</h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employment Status
              </label>
              <select
                value={formData[`${yourField}EmploymentStatus`] || 'employed'}
                onChange={(e) => updateFormData('familyData', `${yourField}EmploymentStatus`, e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="employed">Employed</option>
                <option value="self-employed">Self-Employed</option>
                <option value="unemployed">Unemployed</option>
                <option value="student">Full-Time Student</option>
                <option value="retired">Retired</option>
                <option value="disabled">Disabled/Unable to Work</option>
                <option value="homemaker">Homemaker</option>
              </select>
            </div>

            {(formData[`${yourField}EmploymentStatus`] === 'employed' || 
              formData[`${yourField}EmploymentStatus`] === 'self-employed' || 
              formData[`${yourField}EmploymentStatus`] === 'student') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {formData[`${yourField}EmploymentStatus`] === 'student' 
                    ? 'Educational Institution' 
                    : 'Occupation/Employer'}
                </label>
                <input
                  type="text"
                  value={formData[`${yourField}Occupation`] || ''}
                  onChange={(e) => updateFormData('familyData', `${yourField}Occupation`, e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder={formData[`${yourField}EmploymentStatus`] === 'self-employed' 
                    ? 'Business name or description' 
                    : 'Job title and employer name'}
                />
              </div>
            )}

            {formData[`${yourField}EmploymentStatus`] === 'unemployed' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  ℹ️ You may still have income from unemployment benefits, savings, or other sources. Be sure to report these in the Income section.
                </p>
              </div>
            )}

            {formData[`${yourField}EmploymentStatus`] === 'retired' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  ℹ️ Be sure to report any pension or retirement income in the Income section.
                </p>
              </div>
            )}

            {formData[`${yourField}EmploymentStatus`] === 'disabled' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  ℹ️ Be sure to report any disability benefits in the Income section.
                </p>
              </div>
            )}
          </div>

          {/* Other Party Employment */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">{otherLabel} - Employment</h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employment Status
              </label>
              <select
                value={formData[`${otherField}EmploymentStatus`] || 'employed'}
                onChange={(e) => updateFormData('familyData', `${otherField}EmploymentStatus`, e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="employed">Employed</option>
                <option value="self-employed">Self-Employed</option>
                <option value="unemployed">Unemployed</option>
                <option value="student">Full-Time Student</option>
                <option value="retired">Retired</option>
                <option value="disabled">Disabled/Unable to Work</option>
                <option value="homemaker">Homemaker</option>
                <option value="unknown">Unknown</option>
              </select>
            </div>

            {(formData[`${otherField}EmploymentStatus`] === 'employed' || 
              formData[`${otherField}EmploymentStatus`] === 'self-employed' || 
              formData[`${otherField}EmploymentStatus`] === 'student') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {formData[`${otherField}EmploymentStatus`] === 'student' 
                    ? 'Educational Institution' 
                    : 'Occupation/Employer'}
                </label>
                <input
                  type="text"
                  value={formData[`${otherField}Occupation`] || ''}
                  onChange={(e) => updateFormData('familyData', `${otherField}Occupation`, e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder={formData[`${otherField}EmploymentStatus`] === 'self-employed' 
                    ? 'Business name or description' 
                    : 'Job title and employer name'}
                />
              </div>
            )}

            {formData[`${otherField}EmploymentStatus`] === 'unknown' && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <p className="text-sm text-gray-700">
                  ℹ️ If you don't know the other party's employment status, that's okay. Provide what information you have.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompleteFamilyDataForm;