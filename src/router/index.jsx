import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import ProtectedRoute from "../features/auth/components/ProtectedRoute";
import LoginPage from "../features/auth/pages/LoginPage";
import CashierDashboardPage from "../features/cashierDashboard/pages/CashierDashboardPage";
import InventoryManagementPage from "../features/inventory/pages/InventoryManagementPage";
import POSPage from "../features/pos/pages/POSPage";
import AdminDashboardPage from "../features/reports/pages/AdminDashboardPage";
import AdminBackgroundSettingsPage from "../features/settings/AdminBackgroundSettingsPage";
import ManageUsers from "../features/users/pages/ManageUsers";
import CashierReportsPage from "../features/reports/pages/CashierReportsPage";

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      <Route path="/" element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route index element={<Navigate to="/pos" replace />} />
          <Route path="pos" element={<POSPage />} />
          <Route path="manage-users" element={<ManageUsers />} />
          <Route path="admin-dashboard" element={<AdminDashboardPage />} />
          <Route path="inventory" element={<InventoryManagementPage />} />
          <Route path="cashier-dashboard" element={<CashierDashboardPage />} />
          <Route path="/admin/cashier-reports" element={<CashierReportsPage />} />
        </Route>
      </Route>
    </Routes>
  </BrowserRouter>
);

export default AppRouter;