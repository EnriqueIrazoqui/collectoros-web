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
  Divider,
  Button,
  CircularProgress,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogout } from "../../features/auth/hooks/useLogout";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { useWishlistAlerts } from "../../features/alerts/hooks/useWishlistAlerts";
import { useWishlistAlertsUnreadCount } from "../../features/alerts/hooks/useWishlistAlertsUnreadCount";
import { useMarkWishlistAlertAsRead } from "../../features/alerts/hooks/useMarkWishlistAlertAsRead";
import { useMarkAllWishlistAlertsAsRead } from "../../features/alerts/hooks/useMarkAllWishlistAlertsAsRead";
import { formatCurrency } from "../../utils/formatCurrency";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

const formatAlertType = (type) => {
  const normalized = String(type || "").toLowerCase();

  if (normalized === "target_reached") return "Target price reached";
  if (normalized === "price_dropped") return "Price dropped";
  if (normalized === "significant_drop") return "Significant drop";
  if (normalized === "tracking_error") return "Tracking error";

  return "Wishlist alert";
};

const getAlertVisual = (type) => {
  const normalized = String(type || "").toLowerCase();

  if (normalized === "target_reached") {
    return {
      icon: <TrackChangesIcon fontSize="small" />,
      color: "success.main",
      bg: "rgba(76, 175, 80, 0.08)",
    };
  }

  if (normalized === "price_dropped") {
    return {
      icon: <TrendingDownIcon fontSize="small" />,
      color: "info.main",
      bg: "rgba(33, 150, 243, 0.08)",
    };
  }

  if (normalized === "significant_drop") {
    return {
      icon: <LocalOfferIcon fontSize="small" />,
      color: "success.main",
      bg: "rgba(76, 175, 80, 0.12)",
    };
  }

  if (normalized === "tracking_error") {
    return {
      icon: <WarningAmberIcon fontSize="small" />,
      color: "error.main",
      bg: "rgba(244, 67, 54, 0.08)",
    };
  }

  return {
    icon: <NotificationsNoneIcon fontSize="small" />,
    color: "text.secondary",
    bg: "transparent",
  };
};

const formatRelativeDate = (value) => {
  if (!value) return "";

  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes} min ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} h ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} d ago`;
};

const Topbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const logoutMutation = useLogout();
  const { user } = useAuth();

  const [anchorEl, setAnchorEl] = useState(null);
  const [alertsAnchorEl, setAlertsAnchorEl] = useState(null);

  const alertsQuery = useWishlistAlerts();
  const unreadCountQuery = useWishlistAlertsUnreadCount();
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

  const alerts = useMemo(() => {
    return alertsQuery.data?.data || [];
  }, [alertsQuery.data]);

  const unreadCount = unreadCountQuery.data?.data || 0;
  const latestAlerts = alerts.slice(0, 5);

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

          <Menu
            anchorEl={alertsAnchorEl}
            open={Boolean(alertsAnchorEl)}
            onClose={handleCloseAlertsMenu}
            PaperProps={{
              sx: {
                width: 380,
                maxWidth: "calc(100vw - 24px)",
                mt: 1,
                borderRadius: 3,
                overflow: "hidden",
              },
            }}
          >
            <Box
              sx={{
                px: 2,
                py: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="subtitle1" fontWeight={700}>
                Wishlist alerts
              </Typography>

              <Button
                size="small"
                onClick={handleMarkAllAsRead}
                disabled={unreadCount === 0 || markAllAsReadMutation.isPending}
              >
                Mark all read
              </Button>
            </Box>

            <Divider />

            {alertsQuery.isLoading ? (
              <Box
                sx={{
                  py: 4,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <CircularProgress size={24} />
              </Box>
            ) : latestAlerts.length === 0 ? (
              <MenuItem disabled>No wishlist alerts yet</MenuItem>
            ) : (
              latestAlerts.map((alert) => {
                const visual = getAlertVisual(alert.type);

                return (
                  <MenuItem
                    key={alert.id}
                    sx={{
                      alignItems: "flex-start",
                      gap: 1.5,
                      py: 1.5,
                      px: 2,
                      borderLeft: "3px solid",
                      borderLeftColor:
                        alert.status === "unread"
                          ? "primary.main"
                          : "transparent",
                      backgroundColor: visual.bg,
                      cursor: "default",
                    }}
                  >
                    <Box
                      sx={{
                        mt: "2px",
                        color: visual.color,
                      }}
                    >
                      {visual.icon}
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.5,
                        minWidth: 0,
                        width: "100%",
                      }}
                    >
                      <Typography variant="body2" fontWeight={700} noWrap>
                        {alert.wishlistItem?.name || "Wishlist item"}
                      </Typography>

                      <Typography variant="caption" color="text.secondary">
                        {formatAlertType(alert.type)}
                      </Typography>

                      <Typography variant="body2">
                        Current price:{" "}
                        {alert.triggeredPrice != null
                          ? formatCurrency(Number(alert.triggeredPrice))
                          : "-"}
                      </Typography>

                      <Typography variant="caption" color="text.secondary">
                        {formatRelativeDate(alert.triggeredAt)}
                      </Typography>

                      <Box sx={{ display: "flex", gap: 1, pt: 0.5 }}>
                        <Button
                          size="small"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleViewAlertItem(alert);
                          }}
                        >
                          View in Wishlist
                        </Button>

                        <Button
                          size="small"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleOpenStoreLink(alert);
                          }}
                          disabled={!alert?.wishlistItem?.purchaseUrl}
                        >
                          Open store
                        </Button>
                      </Box>
                    </Box>
                  </MenuItem>
                );
              })
            )}
          </Menu>

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