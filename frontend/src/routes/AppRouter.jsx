import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Tasks from "../pages/Tasks";
import Chat from "../pages/Chat";
import StickyNotes from "../pages/StickyNotes";
import Digest from "../pages/Digest";
import Settings from "../pages/Settings";
import Webhooks from "../pages/Webhooks";
import Notifications from "../pages/Notifications";

export default function AppRouter() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
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
        <Route path="settings" element={<Settings />} />
        <Route path="webhooks" element={<Webhooks />} />
        <Route path="notifications" element={<Notifications/>}/>
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}