// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the AuthContext
const AuthContext = createContext();

// Provide the AuthContext value to children
export const AuthProvider = ({ children }) => {
  // --- Initialize state variables from localStorage defensive parsing ---
  // This ensures authentication persists across page reloads.
  const getStoredUser = () => {
    try {
      const raw = localStorage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  };

  // State initialization with defensive logic
  const [user, setUser] = useState(() => getStoredUser());
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!getStoredUser());

  // --- useEffect to Keep localStorage synchronized with the 'user' state ---
  // Added try/catch to gracefully handle rare localStorage errors.
  useEffect(() => {
    try {
      if (user) localStorage.setItem('user', JSON.stringify(user));
      else localStorage.removeItem('user');
    } catch (e) {
      // Ignore localStorage errors defensive coding
    }
  }, [user]);

  // --- DUMMY AUTHENTICATION METHODS for multi-step flow supporting mock data ---

  // Placeholder function for registration flow described previously
  const register = async (name, email, password) => {
    console.log('MOCK Registering with:', name, email);
    // Real implementation would make an API call here.
  };

  // Placeholder function to send OTP for 2FA/Password Reset
  const sendOtp = async (email, type) => {
    console.log(`MOCK Sending ${type} OTP to: ${email}`);
    // Real implementation would call a backend service to send an email.
  };

  // Placeholder function to verify 6-digit OTP for 2FA
  const verifyOtp = async (otp) => {
    console.log('MOCK Verifying 2FA OTP:', otp);
    // Real implementation would verify the OTP on the backend.
  };

  // Placeholder to handle initial Password Reset request and navigation flow
  const requestPasswordReset = async (email) => {
    console.log('MOCK Handling request to reset password for:', email);
    // Flow: Registration.jsx, ResetPassword.jsx navigation
  };

  // Placeholder function to handle 6-digit verification code and reset logic
  const resetPassword = async (otp, password) => {
    console.log('MOCK Handling password reset with Code:', otp, 'New Password:', password);
    // Flow: Registration.jsx, ResetPassword.jsx complete verification
  };

  // Placeholder login function signature supporting multi-role flow (mock)
  const login = (email, password, role = 'Admin') => {
    console.log('MOCK Logging in with:', email, password);
    // Real implementation would call the authentication API.

    // 1. Generate MOCK user data based on multi-step flow
    const dummyUser = {
      id: '1',
      email,
      name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
      role, // Admin, Manager, Member supported roles
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      department: role === 'Admin' ? 'Engineering' : role === 'Manager' ? 'Product' : 'Design',
    };

    // 2. THIS IS CRUCIAL: Set authentication state variable to TRUE
    setIsAuthenticated(true);
    setUser(dummyUser); // Set user details from multi-step verification

    // Persist session to localStorage
    localStorage.setItem('user', JSON.stringify(dummyUser));
    // Flow logic like navigate('/workspace') in Login.jsx should now work
  };

  // Reset all auth state defensive coding
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    console.log('MOCK Successfully logged out.');
  };

  // Structure the value object clear structure
  const value = {
    isAuthenticated,
    user,
    register, // Flow placeholder supporting Registration.jsx
    sendOtp, // Flow supporting 2FA and ResetPassword.jsx
    verifyOtp, // Flow placeholder supporting 2fa.jsx
    requestPasswordReset, // Flow placeholder supporting ForgotPassword.jsx
    resetPassword, // Flow placeholder supporting ResetPassword.jsx
    login, // Signature complete support flow
    logout, // Signature complete support flow
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// --- Custom Hook to simplify Context Consumption and error checking ---
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider context logic');
  }
  return context;
};