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

function App_Fixed() {
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
  const [showHelpModal, setShowHelpModal] = useState(false);

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
  const saveFormData = (dataToSave, role, showMessage = false) => {
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
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc', 
      display: 'flex', 
      flexDirection: 'column',
      padding: '0',
      margin: '0',
      width: '100%',
      overflowX: 'hidden'
    }}>
      {/* Header */}
      <header style={{ background: 'linear-gradient(135deg, #374151, #4b5563)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '1rem 0',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1rem',
              flex: '1',
              minWidth: '200px'
            }}>
              {/* Logo */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                width: '50px', 
                height: '50px', 
                backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                borderRadius: '12px',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                flexShrink: 0
              }}>
                <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Dollar Sign */}
                  <path d="M16 4V8M16 24V28M20 8C18.5 6.5 16.5 6 16 6C14.5 6 13.5 6.5 12.5 7.5C11.5 8.5 11 10 11 12C11 13.5 11.5 15 12.5 16C13.5 17 14.5 17.5 16 17.5C17.5 17.5 18.5 18 19.5 19C20.5 20 21 21.5 21 23C21 24.5 20.5 26 19.5 27C18.5 28 17.5 28.5 16 28.5C14.5 28.5 13.5 28 12.5 27C11.5 26 11 24.5 11 23" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  {/* Chart Bars */}
                  <rect x="6" y="20" width="2" height="4" fill="white" opacity="0.7"/>
                  <rect x="10" y="16" width="2" height="8" fill="white" opacity="0.7"/>
                  <rect x="14" y="12" width="2" height="12" fill="white" opacity="0.7"/>
                  <rect x="18" y="8" width="2" height="16" fill="white" opacity="0.7"/>
                  <rect x="22" y="14" width="2" height="10" fill="white" opacity="0.7"/>
                </svg>
              </div>
              
              <div style={{ color: 'white', minWidth: 0 }}>
                <h1 style={{ 
                  fontSize: 'clamp(1.2rem, 4vw, 1.5rem)', 
                  fontWeight: 'bold', 
                  margin: 0,
                  lineHeight: '1.2'
                }}>Know Your Net Worth</h1>
                <p style={{ 
                  color: '#dbeafe', 
                  fontSize: 'clamp(0.75rem, 3vw, 0.875rem)', 
                  margin: 0,
                  lineHeight: '1.2'
                }}>Financial Disclosure System</p>
              </div>
            </div>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              flexWrap: 'wrap',
              justifyContent: 'flex-end'
            }}>
              {/* Save Status - Hidden on mobile */}
              <div style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                borderRadius: '0.5rem', 
                padding: '0.5rem 1rem',
                display: 'block'
              }}>
                <div style={{ color: 'white', fontSize: '0.875rem' }}>
                  {isSaving ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '1rem', height: '1rem', border: '2px solid white', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                      <span>Saving...</span>
                    </div>
                  ) : saveMessage ? (
                    <div style={{ color: '#bbf7d0' }}>{saveMessage}</div>
                  ) : lastSaved ? (
                    <div style={{ color: '#dbeafe' }}>
                      Auto-saved at {lastSaved.toLocaleTimeString()}
                    </div>
                  ) : (
                    <div style={{ color: '#dbeafe' }}>All data saves automatically</div>
                  )}
                </div>
              </div>
              
              {/* Help Button */}
              <button
                onClick={() => setShowHelpModal(true)}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem'
                }}
              >
                <span>❓</span>
                <span>Help</span>
              </button>
              
              <button
                onClick={handleManualSave}
                disabled={isSaving}
                style={{
                  backgroundColor: isSaving ? '#6b7280' : '#4b5563',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                {isSaving ? (
                  <>
                    <div style={{ width: '1rem', height: '1rem', border: '2px solid white', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <span>💾</span>
                    <span>Save Now</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <div style={{ backgroundColor: 'white', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            padding: '1rem 0',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div style={{ 
              display: 'flex', 
              gap: '0.25rem', 
              flexWrap: 'wrap',
              overflowX: 'auto',
              flex: '1',
              minWidth: '0'
            }}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '0.5rem 0.75rem',
                    border: 'none',
                    borderRadius: '0.5rem',
                    backgroundColor: activeTab === tab.id ? '#1e40af' : 'transparent',
                    color: activeTab === tab.id ? 'white' : '#374151',
                    cursor: 'pointer',
                    fontSize: 'clamp(0.75rem, 3vw, 0.875rem)',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    minHeight: '40px'
                  }}
                >
                  <span style={{ fontSize: 'clamp(0.875rem, 3.5vw, 1rem)' }}>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
            
            {/* Role Selector */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              flexShrink: 0
            }}>
              <span style={{ 
                fontSize: 'clamp(0.75rem, 3vw, 0.875rem)', 
                color: '#374151'
              }}>Role:</span>
              <select
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
                style={{
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: 'clamp(0.75rem, 3vw, 0.875rem)',
                  minWidth: '100px'
                }}
              >
                <option value="plaintiff">Plaintiff</option>
                <option value="defendant">Defendant</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main style={{ 
        flex: 1, 
        maxWidth: '1280px', 
        margin: '0 auto', 
        width: '100%',
        padding: '0 clamp(0.5rem, 2vw, 1rem)'
      }}>
        <div style={{ 
          padding: 'clamp(1rem, 3vw, 1.5rem)',
          width: '100%'
        }}>
          {activeTab === 'dashboard' ? (
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
              {/* Hero Section */}
              <div style={{ textAlign: 'center', marginBottom: '3rem', padding: '2rem 0' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#111827', lineHeight: '1.2' }}>
                  Know Your Net Worth
                </h1>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: '#374151' }}>
                  Complete Financial Disclosure Forms
                </h2>
                <p style={{ fontSize: '1.25rem', color: '#374151', marginBottom: '1rem', lineHeight: '1.6' }}>
                  Professional financial disclosure forms for legal proceedings. Complete, export, and submit your financial information with ease.
                </p>
                <div style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '0.5rem', 
                  padding: '1rem', 
                  marginBottom: '2rem',
                  maxWidth: '600px',
                  margin: '0 auto 2rem auto'
                }}>
                  <p style={{ fontSize: '1rem', color: '#374151', margin: 0, fontWeight: '500' }}>
                    <strong>🆓 FREE TOOL</strong> • Created by a litigant to help others simplify the financial disclosure process
                  </p>
                </div>
              </div>

              {/* What This Tool Does */}
              <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '2rem', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#111827' }}>What This Tool Does</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                  <div>
                    <h4 style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>📋 Complete Financial Forms</h4>
                    <p style={{ color: '#374151', fontSize: '0.95rem', lineHeight: '1.5' }}>
                      Fill out comprehensive financial disclosure forms including income, assets, liabilities, and expenses.
                    </p>
                  </div>
                  <div>
                    <h4 style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>💾 Auto-Save Protection</h4>
                    <p style={{ color: '#374151', fontSize: '0.95rem', lineHeight: '1.5' }}>
                      Your data automatically saves as you type. No risk of losing your work.
                    </p>
                  </div>
                  <div>
                    <h4 style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>📄 Professional Exports</h4>
                    <p style={{ color: '#374151', fontSize: '0.95rem', lineHeight: '1.5' }}>
                      Generate professional Word and PDF documents ready for legal submission.
                    </p>
                  </div>
                  <div>
                    <h4 style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>🔒 Privacy First</h4>
                    <p style={{ color: '#374151', fontSize: '0.95rem', lineHeight: '1.5' }}>
                      All data stays on your computer. No server storage, maximum privacy.
                    </p>
                  </div>
                </div>
              </div>

              {/* About This Tool */}
              <div style={{ backgroundColor: '#f8fafc', border: '1px solid #d1d5db', borderRadius: '0.75rem', padding: '2rem', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#111827' }}>About This Tool</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                  <div>
                    <h4 style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>👤 Created by a Litigant</h4>
                    <p style={{ color: '#374151', fontSize: '0.95rem', lineHeight: '1.5' }}>
                      This tool was developed by someone who went through the legal process and understands the challenges of completing financial disclosure forms.
                    </p>
                  </div>
                  <div>
                    <h4 style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>🆓 Completely Free</h4>
                    <p style={{ color: '#374151', fontSize: '0.95rem', lineHeight: '1.5' }}>
                      No hidden fees, no subscriptions, no premium features. This tool is provided free of charge to help others navigate the legal process.
                    </p>
                  </div>
                  <div>
                    <h4 style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>🤝 Helping Others</h4>
                    <p style={{ color: '#374151', fontSize: '0.95rem', lineHeight: '1.5' }}>
                      The goal is to simplify the complex process of financial disclosure and make it more accessible to everyone going through legal proceedings.
                    </p>
                  </div>
                </div>
              </div>

              {/* How to Use */}
              <div style={{ backgroundColor: '#f8fafc', border: '1px solid #d1d5db', borderRadius: '0.75rem', padding: '2rem', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#111827' }}>How to Use This Tool</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <div style={{ backgroundColor: '#6b7280', color: 'white', borderRadius: '50%', width: '2rem', height: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 'bold', flexShrink: 0 }}>1</div>
                    <div>
                      <h4 style={{ fontWeight: '600', marginBottom: '0.25rem', color: '#111827' }}>Start with Family Data</h4>
                      <p style={{ color: '#374151', fontSize: '0.875rem' }}>Enter basic information about yourself and your family.</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <div style={{ backgroundColor: '#6b7280', color: 'white', borderRadius: '50%', width: '2rem', height: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 'bold', flexShrink: 0 }}>2</div>
                    <div>
                      <h4 style={{ fontWeight: '600', marginBottom: '0.25rem', color: '#111827' }}>Complete Each Section</h4>
                      <p style={{ color: '#374151', fontSize: '0.875rem' }}>Fill out income, assets, liabilities, and expenses.</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <div style={{ backgroundColor: '#6b7280', color: 'white', borderRadius: '50%', width: '2rem', height: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 'bold', flexShrink: 0 }}>3</div>
                    <div>
                      <h4 style={{ fontWeight: '600', marginBottom: '0.25rem', color: '#111827' }}>Review & Export</h4>
                      <p style={{ color: '#374151', fontSize: '0.875rem' }}>Preview your data and export to Word or PDF.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Legal Disclaimer */}
              <div style={{ backgroundColor: '#f8fafc', border: '2px solid #6b7280', borderRadius: '0.75rem', padding: '2rem', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#374151' }}>⚖️ Legal Disclaimer</h3>
                <div style={{ color: '#374151', lineHeight: '1.6', marginBottom: '1rem' }}>
                  <p style={{ fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                    <strong>IMPORTANT:</strong> This website does not provide legal advice.
                  </p>
                  <p style={{ marginBottom: '1rem' }}>
                    Any documents generated using this tool are the sole responsibility of the person filling them out. 
                    We recommend consulting with a qualified attorney before submitting any legal documents.
                  </p>
                </div>
              </div>

              {/* Important Information */}
              <div style={{ backgroundColor: '#f8fafc', border: '1px solid #d1d5db', borderRadius: '0.75rem', padding: '2rem', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#374151' }}>⚠️ Important Information</h3>
                <ul style={{ color: '#374151', lineHeight: '1.6', paddingLeft: '1.5rem' }}>
                  <li style={{ marginBottom: '0.5rem' }}>This tool is designed for legal financial disclosure forms</li>
                  <li style={{ marginBottom: '0.5rem' }}>All data is stored locally on your computer - no server storage</li>
                  <li style={{ marginBottom: '0.5rem' }}>You can switch between Plaintiff and Defendant roles using the dropdown</li>
                  <li style={{ marginBottom: '0.5rem' }}>Data automatically saves every second as you type</li>
                  <li style={{ marginBottom: '0.5rem' }}>Use the "Save Now" button for manual saves</li>
                  <li>Review all information carefully before exporting</li>
                </ul>
              </div>

              {/* Quick Start */}
              <div style={{ backgroundColor: '#f8fafc', border: '1px solid #9ca3af', borderRadius: '0.75rem', padding: '2rem', textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#374151' }}>Ready to Get Started?</h3>
                <p style={{ color: '#374151', fontSize: '1.125rem', marginBottom: '1.5rem' }}>
                  Click on any tab above to begin filling out your financial information. Start with "Family Data" for the best experience.
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setActiveTab('family')}
                    style={{
                      backgroundColor: '#6b7280',
                      color: 'white',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '0.5rem',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: '600'
                    }}
                  >
                    👨‍👩‍👧‍👦 Start with Family Data
                  </button>
                  <button
                    onClick={() => setActiveTab('income')}
                    style={{
                      backgroundColor: '#6b7280',
                      color: 'white',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '0.5rem',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: '600'
                    }}
                  >
                    💰 Go to Income
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', padding: '2rem' }}>
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
                <div>
                  <PreviewAndEmail 
                    formData={formData} 
                    userRole={userRole} 
                  />
                  <div style={{ marginTop: '2rem', padding: '2rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Export Options</h3>
                    <div style={{ display: 'flex', gap: '1rem' }}>
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
              )}
            </div>
          )}
        </div>
      </main>

      {/* Global Disclaimer Footer */}
      <footer style={{ marginTop: 'auto', backgroundColor: 'rgba(255, 255, 255, 0.7)', borderTop: '1px solid #e5e7eb', padding: '1rem' }}>
        <Disclaimer compact style={{ textAlign: 'center' }} />
      </footer>

      {/* Floating Save Button - Only show on form pages */}
      {activeTab !== 'dashboard' && (
        <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 50 }}>
          <button
            onClick={handleManualSave}
            disabled={isSaving}
            style={{
              background: isSaving ? 'linear-gradient(135deg, #6b7280, #9ca3af)' : 'linear-gradient(135deg, #6b7280, #9ca3af)',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '9999px',
              border: 'none',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              cursor: isSaving ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}
          >
            {isSaving ? (
              <>
                <div style={{ width: '1.25rem', height: '1.25rem', border: '2px solid white', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <span style={{ fontSize: '1.125rem' }}>💾</span>
                <span>Save Progress</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Help Modal */}
      {showHelpModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            padding: '2rem',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>Help & Support</h2>
              <button
                onClick={() => setShowHelpModal(false)}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                ×
              </button>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#374151', marginBottom: '1rem' }}>Getting Started</h3>
              <ul style={{ color: '#374151', lineHeight: '1.6', paddingLeft: '1.5rem' }}>
                <li style={{ marginBottom: '0.5rem' }}>Start with the "Family Data" tab to enter basic information</li>
                <li style={{ marginBottom: '0.5rem' }}>Complete each section (Income, Assets, Liabilities, Expenses)</li>
                <li style={{ marginBottom: '0.5rem' }}>Use the "Preview & Export" tab to review and download your documents</li>
                <li style={{ marginBottom: '0.5rem' }}>Your data saves automatically as you type</li>
              </ul>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#374151', marginBottom: '1rem' }}>Common Issues</h3>
              <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1rem' }}>
                <h4 style={{ fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Data not saving?</h4>
                <p style={{ color: '#374151', fontSize: '0.875rem', margin: 0 }}>Check if your browser allows local storage. Try refreshing the page or using a different browser.</p>
              </div>
              <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1rem' }}>
                <h4 style={{ fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Export not working?</h4>
                <p style={{ color: '#374151', fontSize: '0.875rem', margin: 0 }}>Make sure you have completed at least one section with data. Try using the manual "Save Now" button first.</p>
              </div>
              <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '1rem' }}>
                <h4 style={{ fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Forms not loading?</h4>
                <p style={{ color: '#374151', fontSize: '0.875rem', margin: 0 }}>Try refreshing the page or clearing your browser cache. Make sure you have a stable internet connection.</p>
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#374151', marginBottom: '1rem' }}>Contact Support</h3>
              <div style={{ backgroundColor: '#f8fafc', border: '1px solid #d1d5db', borderRadius: '0.5rem', padding: '1rem' }}>
                <p style={{ color: '#374151', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  <strong>Need additional help?</strong>
                </p>
                <p style={{ color: '#374151', fontSize: '0.875rem', marginBottom: '1rem' }}>
                  This tool is provided free of charge by a fellow litigant. For technical issues or questions about using the tool:
                </p>
                <div style={{ backgroundColor: 'white', border: '1px solid #d1d5db', borderRadius: '0.375rem', padding: '1rem' }}>
                  <p style={{ color: '#374151', fontSize: '0.875rem', margin: 0, fontWeight: '500' }}>
                    📧 Support: <a href="mailto:knowurnet@gmail.com" style={{ color: '#374151', textDecoration: 'none' }}>knowurnet@gmail.com</a>
                  </p>
                  <p style={{ color: '#6b7280', fontSize: '0.75rem', margin: '0.5rem 0 0 0' }}>
                    Response time: 24-48 hours • Click to send email
                  </p>
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <button
                onClick={() => setShowHelpModal(false)}
                style={{
                  backgroundColor: '#6b7280',
                  color: 'white',
                  padding: '0.75rem 2rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
              >
                Close Help
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App_Fixed;
