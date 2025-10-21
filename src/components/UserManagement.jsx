import React, { useState, useEffect } from 'react';
import authService from '../AuthService.js';

const UserManagement = ({ currentUser }) => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    role: 'user'
  });
  const [emailData, setEmailData] = useState({
    recipientEmail: '',
    subject: '',
    message: '',
    password: ''
  });
  const [isEmailing, setIsEmailing] = useState(false);

  // Load users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    setIsLoading(true);
    try {
      const result = authService.getAllUsers();
      if (result.success) {
        setUsers(result.users);
      } else {
        setMessage('Error loading users: ' + result.message);
      }
    } catch (error) {
      setMessage('Error loading users: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.username || !newUser.password) {
      setMessage('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const result = authService.addUser(newUser);
      if (result.success) {
        setMessage('User created successfully!');
        setNewUser({
          name: '',
          email: '',
          username: '',
          password: '',
          role: 'user'
        });
        setShowAddForm(false);
        loadUsers();
      } else {
        setMessage('Error creating user: ' + result.message);
      }
    } catch (error) {
      setMessage('Error creating user: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = (userId) => {
    if (userId === currentUser?.id) {
      setMessage('Cannot delete your own account');
      return;
    }

    if (window.confirm('Are you sure you want to delete this user?')) {
      setIsLoading(true);
      try {
        const result = authService.deleteUser(userId);
        if (result.success) {
          setMessage('User deleted successfully!');
          loadUsers();
        } else {
          setMessage('Error deleting user: ' + result.message);
        }
      } catch (error) {
        setMessage('Error deleting user: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setNewUser({
      name: user.name,
      email: user.email,
      username: user.username,
      password: '', // Don't show existing password
      role: user.role
    });
    setShowAddForm(true);
  };

  const handleUpdateUser = () => {
    if (!editingUser) return;

    if (!newUser.name || !newUser.email || !newUser.username) {
      setMessage('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const result = authService.updateUser(editingUser.id, newUser);
      if (result.success) {
        setMessage('User updated successfully!');
        setEditingUser(null);
        setNewUser({
          name: '',
          email: '',
          username: '',
          password: '',
          role: 'user'
        });
        setShowAddForm(false);
        loadUsers();
      } else {
        setMessage('Error updating user: ' + result.message);
      }
    } catch (error) {
      setMessage('Error updating user: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendPasswordEmail = (user) => {
    setEmailData({
      recipientEmail: user.email,
      subject: `Your KYNW Account Password - ${user.name}`,
      message: `Dear ${user.name},\n\nYour KYNW Financial Forms account details:\n\nUsername: ${user.username}\nEmail: ${user.email}\n\nPlease contact your administrator for your password or to reset it.\n\nBest regards,\nKYNW Team`,
      password: ''
    });
  };

  const handleEmailSend = async () => {
    if (!emailData.recipientEmail) {
      setMessage('Please enter a recipient email address.');
      return;
    }

    setIsEmailing(true);
    try {
      const emailBody = emailData.password 
        ? `${emailData.message}\n\nPassword: ${emailData.password}`
        : emailData.message;

      const mailtoLink = `mailto:${emailData.recipientEmail}?subject=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(emailBody)}`;
      
      window.open(mailtoLink);
      setMessage('Email client opened. Please review and send.');
    } catch (error) {
      setMessage('Error opening email client: ' + error.message);
    } finally {
      setIsEmailing(false);
    }
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewUser({ ...newUser, password });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setMessage('Copied to clipboard!');
    setTimeout(() => setMessage(''), 2000);
  };

  if (!authService.isAdmin()) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-red-800">Access Denied</h2>
          <p className="text-red-600">You need administrator privileges to access user management.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
            >
              <span>+</span>
              Add New User
            </button>
          </div>
        </div>

        {message && (
          <div className={`mx-6 mt-4 p-3 rounded-lg ${
            message.includes('Error') || message.includes('denied') 
              ? 'bg-red-50 text-red-700 border border-red-200' 
              : 'bg-green-50 text-green-700 border border-green-200'
          }`}>
            {message}
          </div>
        )}

        {/* Add/Edit User Form */}
        {showAddForm && (
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {editingUser ? 'Edit User' : 'Create New User'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username *
                </label>
                <input
                  type="text"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter username"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password {editingUser ? '(leave blank to keep current)' : '*'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter password or generate one"
                  />
                  <button
                    type="button"
                    onClick={generatePassword}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition"
                  >
                    Generate
                  </button>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(newUser.password)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition"
                    disabled={!newUser.password}
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 mt-4">
              <button
                onClick={editingUser ? handleUpdateUser : handleAddUser}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg transition flex items-center gap-2"
              >
                {isLoading ? (editingUser ? 'Updating...' : 'Creating...') : (editingUser ? 'Update User' : 'Create User')}
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingUser(null);
                  setNewUser({
                    name: '',
                    email: '',
                    username: '',
                    password: '',
                    role: 'user'
                  });
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Email Section */}
        {emailData.recipientEmail && (
          <div className="p-6 border-b border-gray-200 bg-blue-50">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Send Email to User</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipient Email
                </label>
                <input
                  type="email"
                  value={emailData.recipientEmail}
                  onChange={(e) => setEmailData({...emailData, recipientEmail: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={emailData.subject}
                  onChange={(e) => setEmailData({...emailData, subject: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password (optional - will be included in email)
                </label>
                <input
                  type="text"
                  value={emailData.password}
                  onChange={(e) => setEmailData({...emailData, password: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter password to include in email"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  value={emailData.message}
                  onChange={(e) => setEmailData({...emailData, message: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleEmailSend}
                disabled={isEmailing}
                className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-2 rounded-lg transition flex items-center gap-2"
              >
                {isEmailing ? 'Opening Email...' : '📧 Send Email'}
              </button>
              <button
                onClick={() => setEmailData({recipientEmail: '', subject: '', message: '', password: ''})}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Users List */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Existing Users</h3>
          
          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading users...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Username
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.username}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.role === 'admin' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditUser(user)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit user"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleSendPasswordEmail(user)}
                            className="text-green-600 hover:text-green-900"
                            title="Send email with password"
                          >
                            📧 Email
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={user.id === currentUser?.id}
                            className="text-red-600 hover:text-red-900 disabled:text-gray-400 disabled:cursor-not-allowed"
                            title="Delete user"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {users.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No users found. Create your first user above.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
