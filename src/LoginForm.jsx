import React, { useState, useEffect } from 'react';
import LogoKYNW from './components/LogoKNYW.jsx';
import Disclaimer from './components/Disclaimer.jsx';

// Helper to get admin email from localStorage (mocked for now)
function getAdminEmail() {
  try {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const admin = users.find(u => u.role === 'admin');
    return admin?.email || 'admin@example.com';
  } catch {
    return 'admin@example.com';
  }
}

function LoginForm({ onLogin }) {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [showReset, setShowReset] = useState(false);
  const [resetValue, setResetValue] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load remembered username if available
    const remembered = localStorage.getItem('kynw_remembered_username');
    if (remembered) {
      setCredentials(prev => ({ ...prev, username: remembered }));
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (rememberMe) {
        localStorage.setItem('kynw_remembered_username', credentials.username);
      } else {
        localStorage.removeItem('kynw_remembered_username');
      }
      
      onLogin(credentials);
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setCredentials({ username: 'Admin', password: 'Admin' });
  };

  return (
    <div className="min-h-screen bg-gradient-blue-light flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-light-blue rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-light-orange rounded-full opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>

        {/* Main Card */}
        <div className="relative backdrop-blur-sm bg-white/90 rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header with enhanced branding */}
          <div className="text-center p-8 bg-gradient-blue-orange text-white">
            <div className="mb-4 transform hover:scale-105 transition-transform duration-300">
              <LogoKYNW style={{ margin: '0 auto', filter: 'brightness(0) invert(1)' }} />
            </div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">
              <span className="text-white">Know Your Net Worth</span>
            </h2>
            <p className="text-white text-sm opacity-90">
              Secure Financial Disclosure System
            </p>
            <div className="mt-4 flex justify-center space-x-2">
              <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>

          {/* Login or Reset Form */}
          <div className="p-8">
            {showReset ? (
              resetSent ? (
                <div className="text-center">
                  <div className="text-green-700 font-semibold mb-2">Password reset request sent!</div>
                  <div className="text-xs text-gray-500 mb-4">The administrator will contact you at your registered email.</div>
                  <button className="text-primary-blue hover:underline text-sm" onClick={() => setShowReset(false)}>Back to Login</button>
                </div>
              ) : (
                <form className="space-y-6" onSubmit={e => { e.preventDefault(); setResetSent(true); }}>
                  <div className="text-center text-lg font-bold text-primary-blue mb-2">Reset Password</div>
                  <div className="text-xs text-gray-500 mb-4">Enter your username or email and the administrator will be notified to assist you.</div>
                  <input
                    type="text"
                    value={resetValue}
                    onChange={e => setResetValue(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Username or Email"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full py-2 px-4 bg-primary-blue text-white rounded-lg font-medium hover:bg-secondary-blue transition"
                  >
                    Send Reset Request
                  </button>
                  <div className="text-xs text-gray-500 mt-2">Admin will be notified at: <span className="font-semibold">{getAdminEmail()}</span></div>
                  <button type="button" className="text-primary-blue hover:underline text-xs mt-4" onClick={() => setShowReset(false)}>Back to Login</button>
                </form>
              )
            ) : (
              <>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  {error && (
                    <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-4 py-3 rounded-r-lg text-sm animate-shake">
                      <div className="flex items-center">
                        <span className="mr-2 text-lg">⚠️</span>
                        <span className="font-medium">{error}</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Username Field */}
                  <div className="space-y-2">
                    <label htmlFor="username" className="block text-sm font-semibold text-gray-700">
                      Username
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-400 text-lg">👤</span>
                      </div>
                      <input
                        id="username"
                        name="username"
                        type="text"
                        required
                        value={credentials.username}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                        placeholder="Enter your username"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-400 text-lg">🔒</span>
                      </div>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        value={credentials.password}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                        placeholder="Enter your password"
                      />
                    </div>
                  </div>

                  {/* Remember Me */}
                  <div className="flex items-center justify-between">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={e => setRememberMe(e.target.checked)}
                        className="h-4 w-4 text-primary-blue focus:ring-primary-blue border-gray-300 rounded transition-colors"
                      />
                      <span className="ml-2 text-sm text-gray-700 font-medium">Remember Me</span>
                    </label>
                    <button
                      type="button"
                      className="text-sm text-primary-blue hover:text-secondary-blue font-medium transition-colors"
                      onClick={() => { setShowReset(true); setResetSent(false); setResetValue(''); }}
                    >
                      Forgot Password?
                    </button>
                  </div>

                  {/* Sign In Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-blue-orange text-white py-3 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                        <span>Signing in...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <span className="mr-2">🚀</span>
                        <span>Sign In</span>
                      </div>
                    )}
                  </button>
                </form>
                {/* Demo Credentials */}
                <div className="mt-8">
                  <div className="bg-gradient-blue-light border border-primary-blue rounded-xl p-6 shadow-sm">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-light-blue rounded-lg flex items-center justify-center mr-3">
                        <span className="text-primary-blue text-lg">🎯</span>
                      </div>
                      <h3 className="text-lg font-semibold text-primary-blue">Demo Access</h3>
                    </div>
                    <p className="text-sm text-secondary-blue mb-4">
                      Use these credentials to test the application:
                    </p>
                    <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center">
                          <span className="text-gray-500 mr-2">👤</span>
                          <span className="font-medium text-gray-700">Username:</span>
                          <span className="ml-2 font-mono text-primary-blue">Admin</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-gray-500 mr-2">🔒</span>
                          <span className="font-medium text-gray-700">Password:</span>
                          <span className="ml-2 font-mono text-primary-blue">Admin</span>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleDemoLogin}
                      className="w-full bg-primary-blue hover:bg-secondary-blue text-white py-2 px-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] shadow-md hover:shadow-lg"
                    >
                      <span className="mr-2">✨</span>
                      Fill Demo Credentials
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Enhanced Footer */}
          <div className="bg-gray-50 px-8 py-6 text-center space-y-3">
            <div className="flex items-center justify-center space-x-4 text-xs text-gray-500 mb-2">
              <span className="flex items-center">
                <span className="mr-1">🔒</span>
                <span>Secure & Encrypted</span>
              </span>
              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
              <span className="flex items-center">
                <span className="mr-1">⚡</span>
                <span>Fast & Reliable</span>
              </span>
            </div>
            <p className="text-xs text-gray-400">© 2025 KYNW Legal Forms • All rights reserved</p>
            <Disclaimer compact className="pt-1 border-t border-gray-200" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;