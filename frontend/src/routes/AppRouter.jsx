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
        <Route path="analytics" element={<Analytics />} />
        <Route path="chat" element={<Chat />} />
        <Route path="files" element={<FileManager />} />
        <Route path="workflows" element={<Workflows />} />
        <Route path="slack" element={<Slack />} />
        <Route path="digest" element={<Digest />} />
        <Route path="activity" element={<Activity />} />
        <Route path="team" element={<Team />} />
      </Route>

      {/* Default route mappings */}
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Analytics />} />
      </Route>

      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Chat />} />
      </Route>

      <Route
        path="/files"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<FileManager />} />
      </Route>

      <Route
        path="/workflows"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Workflows />} />
      </Route>

      <Route
        path="/slack"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Slack />} />
      </Route>

      <Route
        path="/digest"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Digest />} />
      </Route>

      <Route
        path="/activity"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Activity />} />
      </Route>

      <Route
        path="/team"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Team />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
