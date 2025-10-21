import React, { useState, useEffect } from 'react';
import CompleteFamilyDataForm from './CompleteFamilyDataForm.jsx';
import CompleteIncomeForm from './CompleteIncomeForm.jsx';
import CompleteAssetsForm from './CompleteAssetsForm.jsx';
import CompleteLiabilitiesForm from './CompleteLiabilitiesForm.jsx';
import CompleteExpensesForm from './CompleteExpensesForm.jsx';
import CompleteAdditionalSectionsForm from './CompleteAdditionalSectionsForm.jsx';
import ComprehensivePDFExport from './components/ComprehensivePDFExport.jsx';
import ComprehensiveWordExport from './components/ComprehensiveWordExport.jsx';
import PreviewAndEmail from './components/PreviewAndEmail.jsx';
import Disclaimer from './components/Disclaimer.jsx';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userRole, setUserRole] = useState('plaintiff');
  const [formData, setFormData] = useState({
    familyData: {},
    income: {},
    assets: {},
    liabilities: {},
    expenses: {},
    additionalSections: {}
  });
  const [lastSaved, setLastSaved] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Load saved data on app load
  useEffect(() => {
    const savedData = localStorage.getItem('kynw_form_data');
    if (savedData) {
      try {
        setFormData(JSON.parse(savedData));
        console.log('Loaded saved form data');
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  // Authentication removed for public access

  const updateFormData = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  // Save form data to localStorage
  const saveFormData = async (dataToSave, role, showMessage = true) => {
    if (!currentUser) return;
    
    setIsSaving(true);
    try {
      const now = new Date();
      const saveData = {
        formData: dataToSave,
        userRole: role,
        lastSaved: now.toISOString(),
        version: '1.0'
      };
      
      localStorage.setItem('kynw_form_data', JSON.stringify(saveData));
      setLastSaved(now);
      
      if (showMessage) {
        setSaveMessage('Data saved successfully!');
        setTimeout(() => setSaveMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error saving form data:', error);
      setSaveMessage('Error saving data');
      setTimeout(() => setSaveMessage(''), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  // Load form data from localStorage (public access)
  const loadFormData = () => {
    try {
      const savedData = localStorage.getItem('kynw_form_data');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        if (parsedData.formData) {
          setFormData(parsedData.formData);
        }
        if (parsedData.userRole) {
          setUserRole(parsedData.userRole);
        }
        if (parsedData.lastSaved) {
          setLastSaved(new Date(parsedData.lastSaved));
        }
      }
    } catch (error) {
      console.error('Error loading saved form data:', error);
    }
  };

  // Manual save function
  const handleManualSave = () => {
    saveFormData(formData, userRole, true);
  };

  // Auto-save when form data changes (public access)
  useEffect(() => {
    const autoSaveTimeout = setTimeout(() => {
      saveFormData(formData, userRole, false);
    }, 1000); // Auto-save after 1 second of inactivity

    return () => clearTimeout(autoSaveTimeout);
  }, [formData, userRole]);

  // Auto-save on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveFormData(formData, userRole, false);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [formData, userRole]);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'family', label: 'Family Data', icon: '👨‍👩‍👧‍👦' },
    { id: 'income', label: 'Income', icon: '💰' },
    { id: 'expenses', label: 'Expenses', icon: '💸' },
    { id: 'assets', label: 'Assets', icon: '🏠' },
    { id: 'liabilities', label: 'Liabilities', icon: '📋' },
    { id: 'additional', label: 'Additional Sections', icon: '📄' },
    { id: 'preview', label: 'Preview & Export', icon: '👁️' }
  ];

  // Authentication removed - direct access to application

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ background: 'linear-gradient(135deg, #1e40af, #ea580c)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ color: 'white' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Know Your Net Worth</h1>
                <p style={{ color: '#dbeafe', fontSize: '0.875rem' }}>Financial Disclosure System</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Save Status */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <div className="text-white text-sm">
                  {isSaving ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>Saving...</span>
                    </div>
                  ) : saveMessage ? (
                    <div className="text-green-200">{saveMessage}</div>
                  ) : lastSaved ? (
                    <div className="text-blue-200">
                      Auto-saved at {lastSaved.toLocaleTimeString()}
                    </div>
                  ) : (
                    <div className="text-blue-200">All data saves automatically</div>
                  )}
                </div>
              </div>

              {/* User Info */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <div className="text-white text-sm">
                  <div className="font-medium">{currentUser?.name || 'User'}</div>
                  <div className="text-blue-100 text-xs capitalize">{currentUser?.role || 'user'}</div>
                </div>
              </div>

              {/* Manual Save Button */}
              <button
                onClick={handleManualSave}
                disabled={isSaving}
                className="bg-primary-orange/80 hover:bg-primary-orange disabled:bg-gray-500/50 text-white px-4 py-2 rounded-lg transition-all duration-200 backdrop-blur-sm flex items-center space-x-2"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <span>💾</span>
                    <span>Save Now</span>
                  </>
                )}
              </button>
              
              {/* Logout button removed for public access */}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-blue-orange text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-light-blue border border-gray-200'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-blue-orange rounded-lg flex items-center justify-center text-white text-xl">
                {tabs.find(tab => tab.id === activeTab)?.icon || '📊'}
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  {tabs.find(tab => tab.id === activeTab)?.label || 'Dashboard'}
                </h2>
                <p className="text-lg text-gray-700">
                  {activeTab === 'dashboard' 
                    ? 'Overview of your financial information'
                    : `Complete your ${tabs.find(tab => tab.id === activeTab)?.label.toLowerCase()} information`
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            {activeTab === 'dashboard' ? (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Welcome to KYNW Financial Forms!</h3>
                <p className="text-lg text-gray-700 mb-8">
                  You have successfully logged in. This is your financial disclosure dashboard.
                </p>
                
                {/* Save Status Information */}
                <div className="bg-gradient-blue-light border border-primary-blue rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary-blue rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">💾</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">Auto-Save Enabled</h4>
                        <p className="text-base text-gray-700">
                          Your data is automatically saved every 2 seconds as you type.
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {lastSaved ? (
                        <div className="text-base text-green-600">
                          <div className="font-semibold">Last saved:</div>
                          <div>{lastSaved.toLocaleString()}</div>
                        </div>
                      ) : (
                        <div className="text-base text-gray-500">No data saved yet</div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-light-blue p-6 rounded-lg border border-primary-blue">
                    <h4 className="text-lg font-semibold text-primary-blue mb-3">Family Data</h4>
                    <p className="text-base text-secondary-blue mb-2">Complete family information</p>
                    <div className="mt-2 text-sm font-medium text-primary-blue">Not started</div>
                  </div>
                  
                  <div className="bg-light-orange p-6 rounded-lg border border-primary-orange">
                    <h4 className="text-lg font-semibold text-primary-orange mb-3">Income</h4>
                    <p className="text-base text-secondary-orange mb-2">Financial income details</p>
                    <div className="mt-2 text-sm font-medium text-primary-orange">Not started</div>
                  </div>
                  
                  <div className="bg-light-blue p-6 rounded-lg border border-primary-blue">
                    <h4 className="text-lg font-semibold text-primary-blue mb-3">Assets</h4>
                    <p className="text-base text-secondary-blue mb-2">Asset information</p>
                    <div className="mt-2 text-sm font-medium text-primary-blue">Not started</div>
                  </div>
                  
                  <div className="bg-light-orange p-6 rounded-lg border border-primary-orange">
                    <h4 className="text-lg font-semibold text-primary-orange mb-3">Liabilities</h4>
                    <p className="text-base text-secondary-orange mb-2">Debt and liability information</p>
                    <div className="mt-2 text-sm font-medium text-primary-orange">Not started</div>
                  </div>
                  
                  <div className="bg-light-blue p-6 rounded-lg border border-primary-blue">
                    <h4 className="text-lg font-semibold text-primary-blue mb-3">Expenses</h4>
                    <p className="text-base text-secondary-blue mb-2">Monthly expense information</p>
                    <div className="mt-2 text-sm font-medium text-primary-blue">Not started</div>
                  </div>
                  
                  <div className="bg-light-orange p-6 rounded-lg border border-primary-orange">
                    <h4 className="text-lg font-semibold text-primary-orange mb-3">Export</h4>
                    <p className="text-base text-secondary-orange mb-2">Generate PDF or email forms</p>
                    <div className="mt-4">
                      <div className="mb-2">
                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                          You are filling this out as:
                        </label>
                        <select
                          value={userRole}
                          onChange={(e) => setUserRole(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-base bg-white focus:outline-none focus:ring-2 focus:ring-primary-blue"
                        >
                          <option value="plaintiff">Plaintiff</option>
                          <option value="defendant">Defendant</option>
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <ComprehensivePDFExport 
                          formData={formData}
                          userRole={userRole}
                        />
                        <ComprehensiveWordExport 
                          formData={formData}
                          userRole={userRole}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {activeTab === 'family' && (
                  <CompleteFamilyDataForm 
                    formData={formData.familyData} 
                    updateFormData={updateFormData} 
                    userRole={userRole} 
                  />
                )}
                {activeTab === 'income' && (
                  <CompleteIncomeForm 
                    formData={formData.income} 
                    updateFormData={updateFormData} 
                    userRole={userRole} 
                  />
                )}
                {activeTab === 'assets' && (
                  <CompleteAssetsForm 
                    formData={formData.assets} 
                    updateFormData={updateFormData} 
                    userRole={userRole} 
                  />
                )}
                {activeTab === 'liabilities' && (
                  <CompleteLiabilitiesForm 
                    formData={formData.liabilities} 
                    updateFormData={updateFormData} 
                    userRole={userRole} 
                  />
                )}
                {activeTab === 'expenses' && (
                  <CompleteExpensesForm 
                    formData={formData.expenses} 
                    updateFormData={updateFormData} 
                    userRole={userRole} 
                  />
                )}
                {activeTab === 'additional' && (
                  <CompleteAdditionalSectionsForm 
                    formData={formData.additionalSections} 
                    updateFormData={updateFormData} 
                    userRole={userRole} 
                  />
                )}
                {activeTab === 'preview' && (
                  <PreviewAndEmail 
                    formData={formData} 
                    userRole={userRole} 
                  />
                )}
                {/* User management removed for public access */}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Global Disclaimer Footer */}
      <footer className="mt-auto bg-white/70 backdrop-blur-sm border-t border-gray-200 py-4 px-4">
        <Disclaimer compact className="text-center" />
      </footer>

      {/* Floating Save Button - Only show on form pages */}
      {activeTab !== 'dashboard' && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={handleManualSave}
            disabled={isSaving}
            className="bg-gradient-blue-orange hover:opacity-90 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2 text-sm font-medium"
          >
            {isSaving ? (
              <>
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <span className="text-lg">💾</span>
                <span>Save Progress</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export default App;