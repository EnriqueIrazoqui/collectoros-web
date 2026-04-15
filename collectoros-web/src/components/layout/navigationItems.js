import DashboardIcon from "@mui/icons-material/Dashboard";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BarChartIcon from "@mui/icons-material/BarChart";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import ArticleIcon from "@mui/icons-material/Article";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import EditNoteIcon from "@mui/icons-material/EditNote";

export const navigationItems = [
  {
    label: "Admin Users",
    path: "/admin/users",
    icon: AdminPanelSettingsIcon,
    adminOnly: true,
  },
  {
    label: "What's New Admin",
    path: "/admin/whats-new",
    icon: EditNoteIcon,
    adminOnly: true,
  },
  {
    label: "Get Started",
    path: "/get-started",
    icon: ArticleIcon,
  },
  {
    label: "What's New",
    path: "/whats-new",
    icon: NewReleasesIcon,
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
