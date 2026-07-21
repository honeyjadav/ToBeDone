import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "../layouts/DashboardLayout";

import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Analytics from "../pages/Analytics";
import Chat from "../pages/Chat";
import FileManager from "../pages/FileManager";
import Workflows from "../pages/Workflows";
import Slack from "../pages/Slack";
import Digest from "../pages/Digest";
import Activity from "../pages/Activity";
import Team from "../pages/Team";

export default function AppRouter() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />

      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Login />
          )
        }
      />

      {/* Protected Dashboard Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="chat" element={<Chat />} />
        <Route path="files" element={<FileManager />} />
        <Route path="workflows" element={<Workflows />} />
        <Route path="slack" element={<Slack />} />
        <Route path="digest" element={<Digest />} />
        <Route path="activity" element={<Activity />} />
        <Route path="team" element={<Team />} />
      </Route>

      {/* Redirect old URLs to new URLs */}
      <Route path="/analytics" element={<Navigate to="/dashboard/analytics" replace />} />
      <Route path="/chat" element={<Navigate to="/dashboard/chat" replace />} />
      <Route path="/files" element={<Navigate to="/dashboard/files" replace />} />
      <Route path="/workflows" element={<Navigate to="/dashboard/workflows" replace />} />
      <Route path="/slack" element={<Navigate to="/dashboard/slack" replace />} />
      <Route path="/digest" element={<Navigate to="/dashboard/digest" replace />} />
      <Route path="/activity" element={<Navigate to="/dashboard/activity" replace />} />
      <Route path="/team" element={<Navigate to="/dashboard/team" replace />} />

      {/* Catch All */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}