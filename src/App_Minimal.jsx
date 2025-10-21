import React, { useState } from 'react';

function App_Minimal() {
  const [currentTab, setCurrentTab] = useState('landing');

  const tabs = [
    { id: 'landing', name: 'Home' },
    { id: 'family', name: 'Family Data' },
    { id: 'assets', name: 'Assets' },
    { id: 'liabilities', name: 'Liabilities' },
    { id: 'income', name: 'Income' },
    { id: 'expenses', name: 'Expenses' },
    { id: 'additional', name: 'Additional' },
    { id: 'preview', name: 'Preview & Export' }
  ];

  const renderContent = () => {
    switch (currentTab) {
      case 'landing':
        return (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h1 style={{ color: '#333', marginBottom: '1rem' }}>Know Your Net Worth</h1>
            <p style={{ color: '#666', fontSize: '18px', marginBottom: '2rem' }}>
              Complete your financial disclosure forms quickly and accurately
            </p>
            <div style={{ backgroundColor: '#f8f9fa', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>
              <h3>Features:</h3>
              <ul style={{ textAlign: 'left', display: 'inline-block' }}>
                <li>All required form sections</li>
                <li>PDF and Word export</li>
                <li>Auto-save functionality</li>
                <li>No registration required</li>
              </ul>
            </div>
            <button 
              style={{
                padding: '12px 24px',
                fontSize: '16px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
              onClick={() => setCurrentTab('family')}
            >
              Get Started
            </button>
          </div>
        );
      case 'family':
        return (
          <div style={{ padding: '2rem' }}>
            <h2>Family Data</h2>
            <p>Family data form will be here...</p>
            <button onClick={() => setCurrentTab('assets')}>Next: Assets</button>
          </div>
        );
      default:
        return (
          <div style={{ padding: '2rem' }}>
            <h2>{tabs.find(tab => tab.id === currentTab)?.name}</h2>
            <p>Form content will be here...</p>
          </div>
        );
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <header style={{ 
        backgroundColor: 'white', 
        padding: '1rem 2rem', 
        borderBottom: '1px solid #ddd',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ margin: 0, color: '#333' }}>Know Your Net Worth</h1>
        <button 
          style={{
            padding: '8px 16px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
          onClick={() => alert('Help: Contact knowurnet@gmail.com')}
        >
          Help
        </button>
      </header>

      {/* Navigation */}
      <nav style={{ 
        backgroundColor: 'white', 
        padding: '0 2rem',
        borderBottom: '1px solid #ddd'
      }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              style={{
                padding: '12px 16px',
                border: 'none',
                backgroundColor: currentTab === tab.id ? '#007bff' : 'transparent',
                color: currentTab === tab.id ? 'white' : '#333',
                cursor: 'pointer',
                borderBottom: currentTab === tab.id ? '3px solid #0056b3' : '3px solid transparent'
              }}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ padding: '2rem' }}>
        {renderContent()}
      </main>
    </div>
  );
}

export default App_Minimal;
