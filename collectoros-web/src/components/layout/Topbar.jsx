import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Badge,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogout } from "../../features/auth/hooks/useLogout";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { useWishlistAlerts } from "../../features/alerts/hooks/useWishlistAlerts";
import { useMarkWishlistAlertAsRead } from "../../features/alerts/hooks/useMarkWishlistAlertAsRead";
import { useMarkAllWishlistAlertsAsRead } from "../../features/alerts/hooks/useMarkAllWishlistAlertsAsRead";
import TopbarAlertsMenu from "../../features/alerts/components/TopbarAlertsMenu";

const Topbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const logoutMutation = useLogout();
  const { user } = useAuth();

  const [anchorEl, setAnchorEl] = useState(null);
  const [alertsAnchorEl, setAlertsAnchorEl] = useState(null);

  const alertsQuery = useWishlistAlerts();
  const markAlertAsReadMutation = useMarkWishlistAlertAsRead();
  const markAllAsReadMutation = useMarkAllWishlistAlertsAsRead();

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleOpenAlertsMenu = (event) => {
    setAlertsAnchorEl(event.currentTarget);
  };

  const handleCloseAlertsMenu = () => {
    setAlertsAnchorEl(null);
  };

  const handleLogout = async () => {
    handleCloseMenu();

    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.error("Logout error:", error);
    }

    navigate("/login", { replace: true });
  };

  const handleMarkAlertAsRead = async (alertId) => {
    try {
      await markAlertAsReadMutation.mutateAsync(alertId);
    } catch (error) {
      console.error("Mark alert as read error:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsReadMutation.mutateAsync();
    } catch (error) {
      console.error("Mark all alerts as read error:", error);
    }
  };

  const handleViewAlertItem = async (alert) => {
    try {
      await handleMarkAlertAsRead(alert.id);
    } catch (error) {
      console.error("View alert item error:", error);
    }

    handleCloseAlertsMenu();
    navigate(`/wishlist?viewItem=${alert.wishlistItemId}`);
  };

  const handleOpenStoreLink = async (alert) => {
    try {
      await handleMarkAlertAsRead(alert.id);
    } catch (error) {
      console.error("Open store link error:", error);
    }

    const purchaseUrl = alert?.wishlistItem?.purchaseUrl;

    if (purchaseUrl) {
      window.open(purchaseUrl, "_blank", "noopener,noreferrer");
    }
  };

  const userLabel = user?.displayName || user?.email || "Usuario";
  const avatarLetter = userLabel.charAt(0).toUpperCase();

  const alerts = alertsQuery.data?.data || [];
  const unreadCount = alerts.filter((alert) => alert.status === "unread").length;

  return (
    <AppBar
      position="fixed"
      color="inherit"
      elevation={1}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={onMenuClick}
            sx={{ display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap>
            CollectorOS
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={1}>
          <IconButton onClick={handleOpenAlertsMenu} color="inherit">
            <Badge
              badgeContent={unreadCount}
              color="error"
              overlap="circular"
              max={99}
            >
              <NotificationsNoneIcon />
            </Badge>
          </IconButton>

          <Typography variant="body2" color="text.secondary">
            {userLabel}
          </Typography>

          <IconButton onClick={handleOpenMenu} size="small">
            <Avatar sx={{ width: 36, height: 36 }}>{avatarLetter}</Avatar>
          </IconButton>

          <TopbarAlertsMenu
            anchorEl={alertsAnchorEl}
            open={Boolean(alertsAnchorEl)}
            onClose={handleCloseAlertsMenu}
            alerts={alerts}
            unreadCount={unreadCount}
            isLoading={alertsQuery.isLoading}
            isMarkingAllAsRead={markAllAsReadMutation.isPending}
            onMarkAllAsRead={handleMarkAllAsRead}
            onViewAlertItem={handleViewAlertItem}
            onOpenStoreLink={handleOpenStoreLink}
          />

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
          >
            <MenuItem
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? "Cerrando..." : "Cerrar sesión"}
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;