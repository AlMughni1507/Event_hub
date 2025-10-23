import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastActivity, setLastActivity] = useState(Date.now());

  useEffect(() => {
    // Check if user is logged in from localStorage
    const checkAuthStatus = () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (token && userData) {
          setUser(JSON.parse(userData));
          setLastActivity(Date.now());
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Session timeout - 5 minutes
  useEffect(() => {
    if (!user) return;

    const SESSION_TIMEOUT = 5 * 60 * 1000; // 5 minutes in milliseconds
    
    const checkSessionTimeout = () => {
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivity;
      
      if (timeSinceLastActivity >= SESSION_TIMEOUT) {
        console.log('Session timeout - logging out user');
        logout();
      }
    };

    // Check timeout every minute
    const timeoutCheckInterval = setInterval(checkSessionTimeout, 60000);
    
    // Update last activity on user interaction
    const updateActivity = () => {
      setLastActivity(Date.now());
    };

    // Listen for user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });

    return () => {
      clearInterval(timeoutCheckInterval);
      events.forEach(event => {
        document.removeEventListener(event, updateActivity, true);
      });
    };
  }, [user, lastActivity]);

  const login = (userData, token) => {
    setUser(userData);
    setLastActivity(Date.now());
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Redirect to login page
    window.location.href = '/login';
  };

  const isAuthenticated = !!user;

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
