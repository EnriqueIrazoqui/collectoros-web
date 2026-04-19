import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SessionManager from "../src/features/auth/components/SessionManager";
import ProtectedRoute from "../src/features/auth/components/ProtectedRoute";
import AdminRoute from "../src/features/auth/components/AdminRoute";
import { useAuthToken } from "../src/features/auth/hooks/useAuthToken";

import LoginPage from "../src/features/auth/pages/LoginPage";
import DashboardPage from "../src/features/dashboard/pages/DashboardPage";
import InventoryPage from "../src/features/inventory/pages/InventoryPage";
import WishlistPage from "../src/features/wishlist/pages/WishlistPage";
import AnalyticsPage from "../src/features/analytics/pages/AnalyticsPage";
import AdminUsersPage from "../src/features/admin/pages/AdminUsersPage";
import GetStartedPage from "../src/features/get-started/pages/GetStartedPage";
import WhatsNewPage from "../src/features/whats-new/pages/WhatsNewPage";
import WhatsNewAdminPage from "../src/features/whats-new/pages/WhatsNewAdminPage";

import AppLayout from "../src/components/layout/AppLayout";

function AppRouter() {
  const tokenExists = useAuthToken();

  return (
    <BrowserRouter>
      {tokenExists ? <SessionManager /> : null}

      <Routes>
        <Route
          path="/"
          element={
            tokenExists ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/login"
          element={
            tokenExists ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LoginPage />
            )
          }
        />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/get-started" element={<GetStartedPage />} />
            <Route path="/whats-new" element={<WhatsNewPage />} />

            <Route element={<AdminRoute />}>
              <Route path="/admin/users" element={<AdminUsersPage />} />
              <Route path="/admin/whats-new" element={<WhatsNewAdminPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;