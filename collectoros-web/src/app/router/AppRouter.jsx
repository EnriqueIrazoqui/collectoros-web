import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../../features/auth/pages/LoginPage";
import DashboardPage from "../../features/dashboard/pages/DashboardPage";
import InventoryPage from "../../features/inventory/pages/InventoryPage";
import WishlistPage from "../../features/wishlist/pages/WishlistPage";
import AnalyticsPage from "../../features/analytics/pages/AnalyticsPage";
import ProtectedRoute from "./ProtectedRoute";
import AppLayout from "../../components/layout/AppLayout";
import PublicOverviewPage from "../../features/public-overview/pages/PublicOverviewPage";
import RequestAccessPage from "../../features/access-request/pages/RequestAccessPage";
import AcceptInvitationPage from "../../features/auth/pages/AcceptInvitationPage";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>

         {/* PUBLIC */}
        <Route path="/" element={<PublicOverviewPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/request-access" element={<RequestAccessPage />} />
        <Route
          path="/accept-invitation"
          element={<AcceptInvitationPage />}
        />

        {/* AUTHENTICATED APP */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;