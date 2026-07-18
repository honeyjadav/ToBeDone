import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize from localStorage so auth persists across reloads
  const getStoredUser = () => {
    try {
      const raw = localStorage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  };

  const [user, setUser] = useState(() => getStoredUser());
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!getStoredUser());

  // Keep localStorage in sync if user changes (defensive)
  useEffect(() => {
    try {
      if (user) localStorage.setItem('user', JSON.stringify(user));
      else localStorage.removeItem('user');
    } catch (e) {
      // ignore localStorage errors
    }
  }, [user]);

  const login = (email, password, role = 'Admin') => {
    // Dummy authentication
    const dummyUser = {
      id: '1',
      email,
      name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
      role, // Admin, Manager, Member
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      department: role === 'Admin' ? 'Engineering' : role === 'Manager' ? 'Product' : 'Design',
    };
    setUser(dummyUser);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(dummyUser));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
