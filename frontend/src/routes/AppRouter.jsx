import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "../layouts/DashboardLayout";

// Existing Pages
import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import Tasks from "../pages/Tasks";
import Chat from "../pages/Chat";
import StickyNotes from "../pages/StickyNotes";
import Digest from "../pages/Digest";
import Settings from "../pages/Settings";
import Users from "../pages/Users";
import Profile from "../pages/UserProfile/Profile";


import Registration from "../pages/Registration";
import TwoFactorAuth from "../pages/TwoFactorAuth";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import Workspace from "../pages/Workspace";
import Webhooks from "../pages/Webhooks";
import Notifications from "../pages/Notifications";

export default function AppRouter() {
  const { isAuthenticated } = useAuth();

  // Helper component to redirect authenticated users away from auth pages (login, register, etc.)
  // Redirect to workspace so login lands on the workspace selection screen
  const AuthRoute = ({ children }) => {
    return isAuthenticated ? <Navigate to="/workspace" replace /> : children;
  };

  const AuthOnlyRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" replace />;
  };

  const TwoFactorRoute = ({ children }) => {
    return isAuthenticated ? <Navigate to="/workspace" replace /> : children;
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />

      {/* Auth Routes (Public, but redirect to dashboard if already logged in) */}
      <Route
        path="/login"
        element={
          <AuthRoute>
            <Login />
          </AuthRoute>
        }
      />
      <Route
        path="/register"
        element={
          <AuthRoute>
            <Registration />
          </AuthRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <AuthRoute>
            <ForgotPassword />
          </AuthRoute>
        }
      />
      <Route
        path="/reset-password"
        element={
          <AuthRoute>
            <ResetPassword />
          </AuthRoute>
        }
      />
      <Route
        path="/workspace"
        element={
          <ProtectedRoute>
            <Workspace />
          </ProtectedRoute>
        }
      />

      {/* 
         Depending on how you handle session state, 2FA might be public 
         (part of login flow) or protected. Assuming it's part of the login flow here.
      */}
      <Route
        path="/two-factor-auth"
        element={
          <TwoFactorRoute>
            <TwoFactorAuth />
          </TwoFactorRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="chat" element={<Chat />} />
        <Route path="notes" element={<StickyNotes />} />
        <Route path="digest" element={<Digest />} />
        <Route path="users" element={<Users />} />
        <Route path="settings" element={<Settings />} />
         <Route path="profile" element={<Profile />} />
        <Route path="webhooks" element={<Webhooks />} />
        <Route path="notifications" element={<Notifications/>}/>
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}