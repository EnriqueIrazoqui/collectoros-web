import DashboardIcon from "@mui/icons-material/Dashboard";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BarChartIcon from "@mui/icons-material/BarChart";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

export const navigationItems = [
  {
    label: "Admin Users",
    path: "/admin/users",
    icon: AdminPanelSettingsIcon,
    adminOnly: true,
  },
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: DashboardIcon,
  },
  {
    label: "Inventory",
    path: "/inventory",
    icon: Inventory2Icon,
  },
  {
    label: "Wishlist",
    path: "/wishlist",
    icon: FavoriteBorderIcon,
  },
  {
    label: "Analytics",
    path: "/analytics",
    icon: BarChartIcon,
  },
];
