import { useState, useEffect, useMemo, useCallback } from 'react';
import APICallService from '../services/APICallService';
import { LOCAL_STORAGE_KEYS } from '../constants/Constants';
import { AuthContext } from './AuthContextValue';

const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getStoredUser());
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!getStoredUser());

  // ---- Workspace state (NEW) ----
  const [workspaces, setWorkspaces] = useState([]); // [{ workspaceId, name, role }]
  const [activeWorkspace, setActiveWorkspace] = useState(null); // full details, incl. logo
  const [workspacesLoading, setWorkspacesLoading] = useState(false);

  useEffect(() => {
    try {
      if (user) localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(user));
      else localStorage.removeItem(LOCAL_STORAGE_KEYS.USER);
    } catch {
      // Ignore localStorage errors
    }
  }, [user]);

  // Fetch the list of workspaces the user belongs to
  const fetchWorkspaces = useCallback(async () => {
    setWorkspacesLoading(true);
    try {
      const response = await APICallService.getMyWorkspaces();
      const list = response?.data?.data || [];
      setWorkspaces(list);
      return list;
    } catch (error) {
      console.error('Failed to fetch workspaces:', error);
      setWorkspaces([]);
      throw error;
    } finally {
      setWorkspacesLoading(false);
    }
  }, []);

  // Fetch full details for one workspace (name, logo, role, etc.) and make it active
  const selectWorkspace = useCallback(async (workspaceId) => {
    const response = await APICallService.getWorkspaceById(workspaceId);
    const payload = response?.data;

    if (!payload?.success) {
      throw new Error(payload?.message || 'Unable to load workspace');
    }

    setActiveWorkspace(payload.data);
    localStorage.setItem(LOCAL_STORAGE_KEYS.ACTIVE_WORKSPACE_ID, payload.data.workspaceId);
    return payload.data;
  }, []);

  const createWorkspace = useCallback(async (formData) => {
    const response = await APICallService.createWorkspace(formData);
    const payload = response?.data;

    if (!payload?.success) {
      throw new Error(payload?.message || 'Unable to create workspace');
    }

    await fetchWorkspaces();
    await selectWorkspace(payload.data.workspaceId);
    return payload.data;
  }, [fetchWorkspaces, selectWorkspace]);

  // On login / app load, restore workspaces + whichever one was last active
  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    let isMounted = true;

    (async () => {
      try {
        const list = await fetchWorkspaces();
        if (!isMounted) return;

        const storedId = localStorage.getItem(LOCAL_STORAGE_KEYS.ACTIVE_WORKSPACE_ID);
        const target = list.find((w) => w.workspaceId === storedId) || list[0];
        if (target) {
          await selectWorkspace(target.workspaceId);
        }
      } catch (error) {
        console.error('Failed to restore workspace state:', error);
      }
    })();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // ---- existing auth methods (unchanged) ----

  const login = async (email, password) => {
    try {
      const response = await APICallService.userLogin({ email, password });
      const payload = response?.data;

      if (!payload?.success) {
        throw new Error(payload?.message || 'Login failed');
      }

      const pendingEmail = payload?.data?.email || email;
      sessionStorage.setItem(LOCAL_STORAGE_KEYS.PENDING_LOGIN_EMAIL, pendingEmail);

      return {
        email: pendingEmail,
        message: payload.message || 'OTP sent to your email',
      };
    } catch (error) {
      console.error('Login API error:', error);

      if (error?.code === 'ERR_NETWORK') {
        throw new Error('No Internet connection', { cause: error });
      }

      const validationMessage = error?.response?.data?.errors?.[0]?.message;
      if (validationMessage) {
        throw new Error(validationMessage, { cause: error });
      }

      const backendMessage = error?.response?.data?.message || error?.message || '';

      if (
        backendMessage.includes('ENOTFOUND') ||
        backendMessage.includes('ECONNREFUSED') ||
        backendMessage.includes('ETIMEDOUT') ||
        backendMessage.includes('MongoServerSelectionError')
      ) {
        throw new Error('No Internet connection', { cause: error });
      }

      throw new Error(backendMessage || 'Login failed', { cause: error });
    }
  };

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
    setWorkspaces([]);
    setActiveWorkspace(null);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.USER);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.ACTIVE_WORKSPACE_ID);
    sessionStorage.removeItem(LOCAL_STORAGE_KEYS.PENDING_LOGIN_EMAIL);
    sessionStorage.removeItem(LOCAL_STORAGE_KEYS.PENDING_REGISTER_EMAIL);
  };

  const register = async (name, email, password) => {
    try {
      const response = await APICallService.register({ name, email, password });
      const payload = response?.data;
      if (!payload?.success) {
        throw new Error(payload?.message || 'Registration failed');
      }

      const pendingEmail = payload?.data?.email || email;
      sessionStorage.setItem(LOCAL_STORAGE_KEYS.PENDING_REGISTER_EMAIL, pendingEmail);

      return payload;
    } catch (error) {
      if (error?.code === 'ERR_NETWORK') {
        throw new Error('No Internet connection', { cause: error });
      }

      const validationMessage = error?.response?.data?.errors?.[0]?.message;
      if (validationMessage) {
        throw new Error(validationMessage, { cause: error });
      }

      const backendMessage = error?.response?.data?.message || error?.message || '';

      if (
        backendMessage.includes('ENOTFOUND') ||
        backendMessage.includes('ECONNREFUSED') ||
        backendMessage.includes('ETIMEDOUT') ||
        backendMessage.includes('MongoServerSelectionError')
      ) {
        throw new Error('No Internet connection', { cause: error });
      }

      throw new Error(backendMessage || 'Registration failed', { cause: error });
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
      // Workspace state (NEW)
      workspaces,
      activeWorkspace,
      workspacesLoading,
      fetchWorkspaces,
      selectWorkspace,
      createWorkspace,
    }),
    [isAuthenticated, user, workspaces, activeWorkspace, workspacesLoading, fetchWorkspaces, selectWorkspace, createWorkspace]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { useAuth } from '../hooks/useAuth';