import React from 'react';
import ProgressCard from './ProgressCard.jsx';

const FinancialDashboard = ({ formData, userRole, currentUser }) => {
  // Calculate completion statistics
  const getSectionStats = () => {
    const sections = [
      { id: 'familyData', name: 'Family Data', icon: '👨‍👩‍👧‍👦', color: 'blue' },
      { id: 'income', name: 'Income', icon: '💰', color: 'green' },
      { id: 'assets', name: 'Assets', icon: '🏠', color: 'purple' },
      { id: 'liabilities', name: 'Liabilities', icon: '💳', color: 'red' },
      { id: 'expenses', name: 'Expenses', icon: '🛒', color: 'orange' }
    ];

    return sections.map(section => {
      const fields = Object.keys(formData[section.id] || {}).length;
      const percentage = Math.min(fields * 10, 100); // Assuming 10 fields per section max
      return {
        ...section,
        value: fields,
        total: 10,
        percentage
      };
    });
  };

  const sectionStats = getSectionStats();
  const overallCompletion = Math.round(sectionStats.reduce((acc, section) => acc + section.percentage, 0) / sectionStats.length);

  // Calculate financial summary (mock data for demonstration)
  const getFinancialSummary = () => {
    const assets = formData.assets || {};
    const liabilities = formData.liabilities || {};
    
    // Mock calculations - in real app, these would be actual calculations
    const totalAssets = Object.keys(assets).length * 50000; // Mock calculation
    const totalLiabilities = Object.keys(liabilities).length * 25000; // Mock calculation
    const netWorth = totalAssets - totalLiabilities;

    return {
      totalAssets,
      totalLiabilities,
      netWorth,
      monthlyIncome: Object.keys(formData.income || {}).length * 5000, // Mock calculation
      monthlyExpenses: Object.keys(formData.expenses || {}).length * 3000 // Mock calculation
    };
  };

  const financialSummary = getFinancialSummary();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Financial Dashboard</h2>
            <p className="text-blue-100 text-lg">
              Complete overview of your financial disclosure progress
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{overallCompletion}%</div>
            <div className="text-blue-100">Overall Complete</div>
          </div>
        </div>
        
        {/* Overall Progress Bar */}
        <div className="mt-6 w-full bg-white/20 rounded-full h-3">
          <div 
            className="bg-white h-3 rounded-full transition-all duration-1000"
            style={{ width: `${overallCompletion}%` }}
          ></div>
        </div>
      </div>

      {/* Section Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sectionStats.map((section) => (
          <ProgressCard
            key={section.id}
            title={section.name}
            value={section.value}
            total={section.total}
            percentage={section.percentage}
            icon={section.icon}
            color={section.color}
          />
        ))}
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Total Assets</p>
              <p className="text-2xl font-bold">{formatCurrency(financialSummary.totalAssets)}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🏠</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Total Liabilities</p>
              <p className="text-2xl font-bold">{formatCurrency(financialSummary.totalLiabilities)}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">💳</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Net Worth</p>
              <p className="text-2xl font-bold">{formatCurrency(financialSummary.netWorth)}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Monthly Income</p>
              <p className="text-2xl font-bold">{formatCurrency(financialSummary.monthlyIncome)}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </div>
      </div>

      {/* User Information */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filing Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl mb-2">👤</div>
            <div className="font-medium text-gray-900">{currentUser.name}</div>
            <div className="text-sm text-gray-500 capitalize">{currentUser.role}</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl mb-2">⚖️</div>
            <div className="font-medium text-gray-900 capitalize">{userRole}</div>
            <div className="text-sm text-gray-500">Filing as</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl mb-2">📅</div>
            <div className="font-medium text-gray-900">{new Date().toLocaleDateString()}</div>
            <div className="text-sm text-gray-500">Last Updated</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialDashboard;
