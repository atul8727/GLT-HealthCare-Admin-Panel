import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Loader from "../components/ui/Loader";

/**
 * Guards a route group behind authentication, and optionally a role.
 * Usage: <ProtectedRoute allowedRoles={["ADMIN"]} /> as a wrapping route.
 * NOTE: This is a UX/security boundary only — the real backend API must
 * always enforce authorization independently.
 */
export default function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) return <Loader label="Checking session..." />;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
