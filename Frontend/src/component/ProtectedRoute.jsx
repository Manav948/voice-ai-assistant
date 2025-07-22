import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Children } from "react";

export default function ProtectedRoute({ children }) {
    const { user, authLoading } = useAuth();

    if (authLoading) return null;
    if (!user) return <Navigate to="/signin" replace />;
    return children;
}