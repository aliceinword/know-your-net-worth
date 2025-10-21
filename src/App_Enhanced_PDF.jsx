import React, { useState, useEffect } from 'react';
import ComprehensivePDFExport from './components/ComprehensivePDFExport.jsx';
import ComprehensiveWordExport from './components/ComprehensiveWordExport.jsx';
import CompleteFamilyDataForm from './CompleteFamilyDataForm.jsx';
import CompleteIncomeForm from './CompleteIncomeForm.jsx';
import CompleteAssetsForm from './CompleteAssetsForm.jsx';
import CompleteLiabilitiesForm from './CompleteLiabilitiesForm.jsx';
import CompleteExpensesForm from './CompleteExpensesForm.jsx';
import LoginForm from './LoginForm.jsx';
import UserManagement from './UserManagement.jsx';
import SessionMonitor from './SessionMonitor.jsx';
import EmailFormModal from './EmailFormModal.jsx';
import authService from './AuthService.js';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loginError, setLoginError] = useState('');
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [userRole, setUserRole] = useState('plaintiff');
  const [activeTab, setActiveTab] = useState('family');
  const [lastSaved, setLastSaved] = useState(null);
  const [formData, setFormData] = useState({
    familyData: {},
    income: {},
    assets: {},
    liabilities: {},
    expenses: {}
  });

  useEffect(() => {
    if (authService.isAuthenticated()) {
      setIsAuthenticated(true);
      setCurrentUser(authService.getCurrentUser());
      loadFormData();
    }
  }, []);

  const loadFormData = () => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      const savedData = localStorage.getItem(`kynw_formdata_${currentUser.username}`);
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          setFormData(parsedData.formData);
          setUserRole(parsedData.userRole || 'plaintiff');
          if (parsedData.lastSaved) {
            setLastSaved(new Date(parsedData.lastSaved));
          }
        } catch (error) {
          console.error('Error loading saved form data:', error);
        }
      }
    }
  };

  const saveFormData = (newFormData, newUserRole) => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      const now = new Date();
      const dataToSave = {
        formData: newFormData,
        userRole: newUserRole,
        lastSaved: now.toISOString()
      };
      localStorage.setItem(`kynw_formdata_${currentUser.username}`, JSON.stringify(dataToSave));
      setLastSaved(now);
    }
  };

  const handleLogin = (username, password) => {
    const result = authService.login(username, password);
    
    if (result.success) {
      setIsAuthenticated(true);
      setCurrentUser(result.user);
      setLoginError('');
    } else {
      setLoginError(result.message);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
    setFormData({
      familyData: {},
      income: {},
      assets: {},
      liabilities: {},
      expenses: {}
    });
    setUserRole('plaintiff');
    setActiveTab('family');
  };

  const updateFormData = (section, field, value) => {
    const newFormData = {
      ...formData,
      [section]: {
        ...formData[section],
        [field]: value
      }
    };
    
    setFormData(newFormData);
    saveFormData(newFormData, userRole);
    authService.extendSession();
  };

  const tabs = [
    { id: 'family', name: 'Family Data', icon: '👨‍👩‍👧‍👦' },
    { id: 'income', name: 'Income', icon: '💰' },
    { id: 'assets', name: 'Assets', icon: '🏠' },
    { id: 'liabilities', name: 'Liabilities', icon: '💳' },
    { id: 'expenses', name: 'Expenses', icon: '🛒' }
  ];

  const exportData = () => {
    const exportPackage = {
      metadata: {
        exportedBy: currentUser.username,
        exportedAt: new Date().toISOString(),
        version: '1.0'
      },
      formData
    };
    
    const dataStr = JSON.stringify(exportPackage, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `financial-data-${currentUser.username}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          
          if (importedData.formData) {
            setFormData(importedData.formData);
            alert(`Data imported successfully!`);
          } else {
            setFormData(importedData);
            alert('Data imported successfully!');
          }
        } catch (error) {
          alert('Error importing data. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} error={loginError} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SessionMonitor onSessionExpired={handleLogout} />
      
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">KYNW Financial Forms</h1>
              <p className="text-sm text-gray-600 mt-1">Complete Financial Disclosure Statement</p>
              <p className="text-xs text-gray-500 mt-1">
                Welcome, <strong>{currentUser.name}</strong> ({currentUser.role})
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-sm text-gray-600">You are filling this out as:</span>
                <select
                  value={userRole}
                  onChange={(e) => {
                    const newRole = e.target.value;
                    setUserRole(newRole);
                    saveFormData(formData, newRole);
                  }}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="plaintiff">Plaintiff</option>
                  <option value="defendant">Defendant</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 items-center">
              {currentUser.role === 'admin' && (
                <button
                  onClick={() => setShowUserManagement(true)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
                >
                  👥 Users
                </button>
              )}
              <div className="flex gap-2">
                <button
                  onClick={exportData}
                  className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-1 text-sm"
                >
                  📥 Export JSON
                </button>
                <ComprehensivePDFExport 
                  formData={formData}
                  userRole={userRole}
                  currentUser={currentUser}
                />
                <ComprehensiveWordExport 
                  formData={formData}
                  userRole={userRole}
                  currentUser={currentUser}
                />
              </div>
              <button
                onClick={() => setShowEmailModal(true)}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition flex items-center gap-2"
              >
                📧 Email Form
              </button>
              <label className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 cursor-pointer">
                📤 Import Data
                <input type="file" accept=".json" onChange={importData} className="hidden" />
              </label>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="bg-blue-50 border-b border-blue-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex justify-between text-sm">
            <span className="text-blue-800">
              Section: <strong>{tabs.find(t => t.id === activeTab)?.name}</strong>
            </span>
            <span className="text-blue-600">
              Progress: {tabs.findIndex(t => t.id === activeTab) + 1} of {tabs.length}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
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
      </div>

      <div className="bg-white border-t mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <button
              onClick={() => {
                const currentIndex = tabs.findIndex(t => t.id === activeTab);
                if (currentIndex > 0) {
                  setActiveTab(tabs[currentIndex - 1].id);
                }
              }}
              disabled={tabs.findIndex(t => t.id === activeTab) === 0}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>
            
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              {lastSaved ? (
                <>Auto-saved at {lastSaved.toLocaleTimeString()}</>
              ) : (
                <>All data saves automatically as you type</>
              )}
            </div>
            
            <button
              onClick={() => {
                const currentIndex = tabs.findIndex(t => t.id === activeTab);
                if (currentIndex < tabs.length - 1) {
                  setActiveTab(tabs[currentIndex + 1].id);
                }
              }}
              disabled={tabs.findIndex(t => t.id === activeTab) === tabs.length - 1}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        </div>
      </div>

      <div className="fixed bottom-4 right-4 flex flex-col gap-3">
        <button
          onClick={() => {
            const summary = {
              'Family Data': Object.keys(formData.familyData).length,
              'Income': Object.keys(formData.income).length,
              'Assets': Object.keys(formData.assets).length,
              'Liabilities': Object.keys(formData.liabilities).length,
              'Expenses': Object.keys(formData.expenses).length
            };
            alert(`Form Completion Summary:\n${Object.entries(summary).map(([k,v]) => `${k}: ${v} fields`).join('\n')}\n\nUser: ${currentUser.name}\nSession: ${new Date().toLocaleString()}`);
          }}
          className="bg-purple-600 text-white rounded-full p-3 shadow-lg hover:bg-purple-700 transition"
          title="View Summary"
        >
          📊
        </button>
        
        <div className="bg-white rounded-full p-2 shadow-lg text-xs">
          <div className="text-center text-gray-600">
            <div className="font-medium">{currentUser.username}</div>
            <div className="text-xs text-gray-400">{currentUser.role}</div>
          </div>
        </div>
      </div>

      {showUserManagement && (
        <UserManagement 
          currentUser={currentUser}
          onClose={() => setShowUserManagement(false)}
        />
      )}

      {showEmailModal && (
        <EmailFormModal 
          formData={formData}
          currentUser={currentUser}
          userRole={userRole}
          onClose={() => setShowEmailModal(false)}
        />
      )}
    </div>
  );
}

export default App;