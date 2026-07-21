import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, user } = useAuth();

  console.log("ProtectedRoute");
  console.log("isAuthenticated:", isAuthenticated);
  console.log("user:", user);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}