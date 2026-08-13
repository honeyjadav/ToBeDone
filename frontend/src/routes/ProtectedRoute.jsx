import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute({ children }) {
    const {
        isAuthenticated,
        user,
        isAuthLoading,
    } = useAuth();

    const location = useLocation();

    console.log("ProtectedRoute");
    console.log("isAuthLoading:", isAuthLoading);
    console.log("isAuthenticated:", isAuthenticated);
    console.log("user:", user);

    // Wait until authentication state is restored
    if (isAuthLoading) {
        return null;
    }

    // Only redirect after authentication check is finished
    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location }}
            />
        );
    }

    return children;
}