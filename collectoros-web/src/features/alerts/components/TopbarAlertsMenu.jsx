import {
  Menu,
  MenuItem,
  Box,
  Typography,
  Button,
  Divider,
  CircularProgress,
} from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { useMemo } from "react";
import { formatCurrency } from "../../../utils/formatCurrency";

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

const TopbarAlertsMenu = ({
  anchorEl,
  open,
  onClose,
  alerts = [],
  unreadCount = 0,
  isLoading = false,
  isMarkingAllAsRead = false,
  onMarkAllAsRead,
  onViewAlertItem,
  onOpenStoreLink,
}) => {
  const visibleAlerts = useMemo(() => {
    const now = Date.now();

    const sortedAlerts = [...alerts].sort((a, b) => {
      if (a.status === "unread" && b.status !== "unread") return -1;
      if (a.status !== "unread" && b.status === "unread") return 1;

      return (
        new Date(b.triggeredAt).getTime() - new Date(a.triggeredAt).getTime()
      );
    });

    const filteredAlerts = sortedAlerts.filter((alert) => {
      if (alert.status === "unread") return true;

      const triggeredAt = new Date(alert.triggeredAt).getTime();
      const ageInDays = (now - triggeredAt) / (1000 * 60 * 60 * 24);

      return ageInDays <= 2;
    });

    return filteredAlerts.slice(0, 5);
  }, [alerts]);

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
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
          onClick={onMarkAllAsRead}
          disabled={unreadCount === 0 || isMarkingAllAsRead}
        >
          Mark all read
        </Button>
      </Box>

      <Divider />

      {isLoading ? (
        <Box
          sx={{
            py: 4,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <CircularProgress size={24} />
        </Box>
      ) : visibleAlerts.length === 0 ? (
        <MenuItem disabled>No wishlist alerts yet</MenuItem>
      ) : (
        visibleAlerts.map((alert) => {
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
                      onViewAlertItem?.(alert);
                    }}
                  >
                    View in wishlist
                  </Button>

                  <Button
                    size="small"
                    onClick={(event) => {
                      event.stopPropagation();
                      onOpenStoreLink?.(alert);
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
  );
};

export default TopbarAlertsMenu;