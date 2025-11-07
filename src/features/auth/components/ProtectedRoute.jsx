import { Navigate, Outlet, useLocation } from "react-router-dom";
import authService from "../../../services/authService";

const ProtectedRoute = () => {
  const token = authService.getToken();
  const user = authService.getUser();
  const location = useLocation();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  const path = location.pathname;

  // Block admins from accessing /pos
  if (user.role === "admin" && path.startsWith("/pos")) {
    return <Navigate to="/admin-dashboard" replace />;
  }

  // Block cashiers from accessing admin-only pages
  const adminOnlyPaths = ["/admin-dashboard", "/manage-users", "/inventory"];
  if (user.role === "cashier" && adminOnlyPaths.some(p => path.startsWith(p))) {
    return <Navigate to="/pos" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;