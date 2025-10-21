import { useEffect } from 'react';
import authService from './AuthService.js';

const SessionMonitor = ({ onSessionExpired }) => {
  useEffect(() => {
    // Check session every minute
    const interval = setInterval(() => {
      if (!authService.isAuthenticated()) {
        onSessionExpired();
      }
    }, 60000); // 1 minute

    // Extend session on user activity
    const handleActivity = () => {
      if (authService.isAuthenticated()) {
        authService.extendSession();
      }
    };

    // Listen for user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    return () => {
      clearInterval(interval);
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [onSessionExpired]);

  return null; // This component doesn't render anything
};

export default SessionMonitor;