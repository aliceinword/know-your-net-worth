// Authentication service for managing user sessions
class AuthService {
  constructor() {
    this.users = [
      {
        id: 1,
        username: 'Admin',
        password: 'Admin',
        role: 'admin',
        name: 'Administrator',
        email: 'admin@kynw.com',
        createdAt: new Date().toISOString()
      },
      // You can add more users here
      {
        id: 2,
        username: 'user1',
        password: 'password123',
        role: 'user',
        name: 'John Doe',
        email: 'john@kynw.com',
        createdAt: new Date().toISOString()
      }
    ];
    
    this.currentUser = null;
    this.sessionTimeout = 24 * 60 * 60 * 1000; // 24 hours
  }

  // Login method
  login(username, password) {
    const user = this.users.find(u => 
      u.username === username && u.password === password
    );

    if (user) {
      const session = {
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
          name: user.name,
          email: user.email
        },
        loginTime: new Date().toISOString(),
        expiresAt: new Date(Date.now() + this.sessionTimeout).toISOString()
      };

      // Store session in localStorage
      localStorage.setItem('kynw_session', JSON.stringify(session));
      this.currentUser = session.user;
      
      return {
        success: true,
        user: session.user,
        message: 'Login successful'
      };
    }

    return {
      success: false,
      message: 'Invalid username or password'
    };
  }

  // Logout method
  logout() {
    localStorage.removeItem('kynw_session');
    this.currentUser = null;
    return {
      success: true,
      message: 'Logged out successfully'
    };
  }

  // Check if user is authenticated
  isAuthenticated() {
    const session = this.getSession();
    if (!session) return false;

    // Check if session has expired
    const now = new Date();
    const expiresAt = new Date(session.expiresAt);
    
    if (now > expiresAt) {
      this.logout();
      return false;
    }

    this.currentUser = session.user;
    return true;
  }

  // Get current session
  getSession() {
    try {
      const sessionStr = localStorage.getItem('kynw_session');
      return sessionStr ? JSON.parse(sessionStr) : null;
    } catch (error) {
      console.error('Error parsing session:', error);
      return null;
    }
  }

  // Get current user
  getCurrentUser() {
    if (this.isAuthenticated()) {
      return this.currentUser;
    }
    return null;
  }

  // Check if user is admin
  isAdmin() {
    const user = this.getCurrentUser();
    return user && user.role === 'admin';
  }

  // Extend session
  extendSession() {
    const session = this.getSession();
    if (session) {
      session.expiresAt = new Date(Date.now() + this.sessionTimeout).toISOString();
      localStorage.setItem('kynw_session', JSON.stringify(session));
      return true;
    }
    return false;
  }

  // Add new user (admin only)
  addUser(userData) {
    if (!this.isAdmin()) {
      return {
        success: false,
        message: 'Unauthorized: Admin access required'
      };
    }

    // Check if username already exists
    if (this.users.find(u => u.username === userData.username)) {
      return {
        success: false,
        message: 'Username already exists'
      };
    }

    const newUser = {
      id: this.users.length + 1,
      username: userData.username,
      password: userData.password,
      role: userData.role || 'user',
      name: userData.name,
      email: userData.email,
      createdAt: new Date().toISOString()
    };

    this.users.push(newUser);
    
    return {
      success: true,
      message: 'User created successfully',
      user: { ...newUser, password: undefined } // Don't return password
    };
  }

  // Get all users (admin only)
  getAllUsers() {
    if (!this.isAdmin()) {
      return {
        success: false,
        message: 'Unauthorized: Admin access required'
      };
    }

    return {
      success: true,
      users: this.users.map(user => ({ ...user, password: undefined }))
    };
  }

  // Change password
  changePassword(currentPassword, newPassword) {
    const user = this.getCurrentUser();
    if (!user) {
      return {
        success: false,
        message: 'Not authenticated'
      };
    }

    const userRecord = this.users.find(u => u.id === user.id);
    if (!userRecord || userRecord.password !== currentPassword) {
      return {
        success: false,
        message: 'Current password is incorrect'
      };
    }

    userRecord.password = newPassword;
    return {
      success: true,
      message: 'Password changed successfully'
    };
  }

  // Update user (admin only)
  updateUser(userId, userData) {
    if (!this.isAdmin()) {
      return {
        success: false,
        message: 'Unauthorized: Admin access required'
      };
    }

    const userIndex = this.users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return {
        success: false,
        message: 'User not found'
      };
    }

    // Check if username already exists (excluding current user)
    const existingUser = this.users.find(u => u.username === userData.username && u.id !== userId);
    if (existingUser) {
      return {
        success: false,
        message: 'Username already exists'
      };
    }

    // Update user data
    const updatedUser = {
      ...this.users[userIndex],
      name: userData.name,
      email: userData.email,
      username: userData.username,
      role: userData.role,
      updatedAt: new Date().toISOString()
    };

    // Only update password if provided
    if (userData.password && userData.password.trim() !== '') {
      updatedUser.password = userData.password;
    }

    this.users[userIndex] = updatedUser;
    
    return {
      success: true,
      message: 'User updated successfully',
      user: { ...updatedUser, password: undefined } // Don't return password
    };
  }

  // Delete user (admin only)
  deleteUser(userId) {
    if (!this.isAdmin()) {
      return {
        success: false,
        message: 'Unauthorized: Admin access required'
      };
    }

    const userIndex = this.users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return {
        success: false,
        message: 'User not found'
      };
    }

    // Don't allow deleting the current admin user
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      return {
        success: false,
        message: 'Cannot delete your own account'
      };
    }

    this.users.splice(userIndex, 1);
    return {
      success: true,
      message: 'User deleted successfully'
    };
  }
}

// Create singleton instance
const authService = new AuthService();

export default authService;