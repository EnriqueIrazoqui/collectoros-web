import LoginPage from "../../features/auth/pages/LoginPage";
import DashboardPage from "../../features/dashboard/pages/DashboardPage";
import InventoryPage from "../../features/inventory/pages/InventoryPage";
import WishlistPage from "../../features/wishlist/pages/WishlistPage";
import AnalyticsPage from "../../features/analytics/pages/AnalyticsPage";

export const routes = [
  {
    path: "/login",
    element: <LoginPage />,
    isPrivate: false,
  },
  {
    path: "/",
    element: <DashboardPage />,
    isPrivate: true,
  },
  {
    path: "/inventory",
    element: <InventoryPage />,
    isPrivate: true,
  },
  {
    path: "/wishlist",
    element: <WishlistPage />,
    isPrivate: true,
  },
  {
    path: "/analytics",
    element: <AnalyticsPage />,
    isPrivate: true,
  },
];