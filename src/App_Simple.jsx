import React, { useState } from 'react';

function App_Simple() {
  const [activeTab, setActiveTab] = useState('dashboard');

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

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Header */}
      <header style={{ backgroundColor: '#1e40af', color: 'white', padding: '1rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Know Your Net Worth</h1>
          <p style={{ fontSize: '0.875rem', opacity: 0.8 }}>Financial Disclosure System</p>
        </div>
      </header>

      {/* Navigation */}
      <nav style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '0.75rem 1rem',
                  border: 'none',
                  borderRadius: '0.5rem',
                  backgroundColor: activeTab === tab.id ? '#1e40af' : 'transparent',
                  color: activeTab === tab.id ? 'white' : '#374151',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
              >
                <span style={{ marginRight: '0.5rem' }}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {activeTab === 'dashboard' ? (
          <div>
            <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#111827' }}>
              Welcome to KYNW Financial Forms!
            </h2>
            <p style={{ fontSize: '1.125rem', color: '#374151', marginBottom: '2rem' }}>
              This is your financial disclosure dashboard. No login required!
            </p>
            <div style={{ backgroundColor: '#dbeafe', border: '1px solid #1e40af', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1.5rem' }}>
              <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Auto-Save Feature</h3>
              <p>Your data automatically saves locally as you type. No need to worry about losing your work!</p>
            </div>
            <div style={{ backgroundColor: '#dcfce7', border: '1px solid #16a34a', borderRadius: '0.5rem', padding: '1rem' }}>
              <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Ready to Start</h3>
              <p>Click on any tab above to begin filling out your financial information.</p>
            </div>
          </div>
        ) : (
          <div style={{ padding: '2rem', backgroundColor: 'white', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              {tabs.find(tab => tab.id === activeTab)?.label} Form
            </h2>
            <p>This form will be implemented for the {activeTab} tab.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App_Simple;
