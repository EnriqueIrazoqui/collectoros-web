import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../../features/auth/pages/LoginPage";
import DashboardPage from "../../features/dashboard/pages/DashboardPage";
import InventoryPage from "../../features/inventory/pages/InventoryPage";
import WishlistPage from "../../features/wishlist/pages/WishlistPage";
import AnalyticsPage from "../../features/analytics/pages/AnalyticsPage";
import ProtectedRoute from "./ProtectedRoute";
import AppLayout from "../../components/layout/AppLayout";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<DashboardPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;