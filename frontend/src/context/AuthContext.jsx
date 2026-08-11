// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import APICallService from '../services/APICallService';
import { LOCAL_STORAGE_KEYS } from '../constants/Constants';

// Create the AuthContext
const AuthContext = createContext();

const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

// Provide the AuthContext value to children
export const AuthProvider = ({ children }) => {
  // State initialization with defensive logic
  const [user, setUser] = useState(() => getStoredUser());
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!getStoredUser());

  // Keep localStorage synchronized with the 'user' state
  useEffect(() => {
    try {
      if (user) localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(user));
      else localStorage.removeItem(LOCAL_STORAGE_KEYS.USER);
    } catch (e) {
      // Ignore localStorage errors
    }
  }, [user]);

// Login step 1: email + password -> OTP sent
const login = async (email, password) => {
  try {
    const response = await APICallService.userLogin({
      email,
      password,
    });

    const payload = response?.data;

    if (!payload?.success) {
      throw new Error(payload?.message || "Login failed");
    }

    const pendingEmail = payload?.data?.email || email;

    sessionStorage.setItem(
      LOCAL_STORAGE_KEYS.PENDING_LOGIN_EMAIL,
      pendingEmail
    );

    return {
      email: pendingEmail,
      message: payload.message || "OTP sent to your email",
    };
  } catch (error) {
    console.error("Login API error:", error);

    // Axios network error
    if (error?.code === "ERR_NETWORK") {
      throw new Error("No Internet connection");
    }
    
    // Backend validation errors
    const validationMessage= error?.response?.data?.errors?.[0]?.message;

    if (validationMessage) {
        throw new Error(validationMessage);
    }

    // Backend MongoDB/DNS/network error
    const backendMessage =
      error?.response?.data?.message ||
      error?.message ||
      "";

    if (
      backendMessage.includes("ENOTFOUND") ||
      backendMessage.includes("ECONNREFUSED") ||
      backendMessage.includes("ETIMEDOUT") ||
      backendMessage.includes("MongoServerSelectionError")
    ) {
      throw new Error("No Internet connection");
    }

    throw new Error(backendMessage || "Login failed");
  }
};

  // Login step 2: email + OTP -> access token and auth state
  const verifyLoginOtp = async (otp) => {
    const email = sessionStorage.getItem(LOCAL_STORAGE_KEYS.PENDING_LOGIN_EMAIL);
    if (!email) {
      throw new Error('No pending login flow found. Please log in again.');
    }

    const response = await APICallService.verifyLoginOtp({ email, otp });
    const payload = response?.data;

    if (!payload?.success) {
      throw new Error(payload?.message || 'OTP verification failed');
    }

    const data = payload.data;
    const userData = {
      id: data.id,
      name: data.name,
      email: data.email,
      authProvider: data.authProvider,
      workspaces: data.workspaces || [],
      hasWorkspace: data.hasWorkspace,
    };

    localStorage.setItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, data.accessToken);
    setUser(userData);
    setIsAuthenticated(true);
    sessionStorage.removeItem(LOCAL_STORAGE_KEYS.PENDING_LOGIN_EMAIL);

    return userData;
  };

  const resendLoginOtp = async () => {
    const email = sessionStorage.getItem(LOCAL_STORAGE_KEYS.PENDING_LOGIN_EMAIL);
    if (!email) {
      throw new Error('No pending login flow found. Please log in again.');
    }

    const response = await APICallService.resendLoginOtp(email);
    const payload = response?.data;

    if (!payload?.success) {
      throw new Error(payload?.message || 'Failed to resend OTP');
    }

    return payload.message || 'OTP resent successfully';
  };

  const logout = async () => {
    try {
      await APICallService.logout();
    } catch (error) {
      console.warn('Logout call failed:', error);
    }

    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.USER);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
    sessionStorage.removeItem(LOCAL_STORAGE_KEYS.PENDING_LOGIN_EMAIL);
    sessionStorage.removeItem(LOCAL_STORAGE_KEYS.PENDING_REGISTER_EMAIL);
  };

  // Placeholder functions for other auth flows
  const register = async (name, email, password) => {
    try {
      const response = await APICallService.register({
        name,
        email,
        password,
      });

      const payload = response?.data;
      if (!payload?.success) {
        throw new Error(payload?.message || 'Registration failed');
      }

      const pendingEmail = payload?.data?.email || email;
      sessionStorage.setItem(LOCAL_STORAGE_KEYS.PENDING_REGISTER_EMAIL, pendingEmail);

      return payload;
    } catch (error) {
      if (error?.code === 'ERR_NETWORK') {
        throw new Error('No Internet connection');
      }

      const validationMessage = error?.response?.data?.errors?.[0]?.message;
      if (validationMessage) {
        throw new Error(validationMessage);
      }

      const backendMessage =
        error?.response?.data?.message ||
        error?.message ||
        '';

      if (
        backendMessage.includes('ENOTFOUND') ||
        backendMessage.includes('ECONNREFUSED') ||
        backendMessage.includes('ETIMEDOUT') ||
        backendMessage.includes('MongoServerSelectionError')
      ) {
        throw new Error('No Internet connection');
      }

      throw new Error(backendMessage || 'Registration failed');
    }
  };

  const sendOtp = async (email, type) => {
    console.log(`MOCK Sending ${type} OTP to: ${email}`);
  };

  const verifyOtp = async (otp) => {
    const email = sessionStorage.getItem(LOCAL_STORAGE_KEYS.PENDING_REGISTER_EMAIL);
    if (!email) {
      throw new Error('No pending registration found. Please sign up again.');
    }

    const response = await APICallService.verifyOtp({ email, otp });
    const payload = response?.data;

    if (!payload?.success) {
      throw new Error(payload?.message || 'OTP verification failed');
    }

    sessionStorage.removeItem(LOCAL_STORAGE_KEYS.PENDING_REGISTER_EMAIL);
    return payload;
  };

  const resendOtp = async () => {
    const email = sessionStorage.getItem(LOCAL_STORAGE_KEYS.PENDING_REGISTER_EMAIL);
    if (!email) {
      throw new Error('No pending registration found. Please sign up again.');
    }

    const response = await APICallService.resendOtp(email);
    const payload = response?.data;

    if (!payload?.success) {
      throw new Error(payload?.message || 'Failed to resend OTP');
    }

    return payload.message || 'OTP resent successfully';
  };

  const requestPasswordReset = async (email) => {
    console.log('MOCK Handling request to reset password for:', email);
  };

  const resetPassword = async (otp, password) => {
    console.log('MOCK Handling password reset with Code:', otp, 'New Password:', password);
  };

  const value = useMemo(
    () => ({
      isAuthenticated,
      user,
      register,
      sendOtp,
      verifyOtp,
      resendOtp,
      requestPasswordReset,
      resetPassword,
      login,
      verifyLoginOtp,
      resendLoginOtp,
      logout,
    }),
    [isAuthenticated, user]
  );

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