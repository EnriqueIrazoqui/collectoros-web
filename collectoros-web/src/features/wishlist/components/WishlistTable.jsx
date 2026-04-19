import {
  Box,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import WishlistRowActions from "./WishlistRowActions";
import { formatCurrency } from "../../../utils/formatCurrency";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import ScheduleIcon from "@mui/icons-material/Schedule";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import {
  getWishlistItemStatus,
  wishlistItemStatus,
} from "../utils/getWishlistItemStatus";

const getPriorityColor = (priority) => {
  const normalized = String(priority || "").toLowerCase();

  if (normalized === "high") return "error";
  if (normalized === "medium") return "warning";
  if (normalized === "low") return "success";

  return "default";
};

const getTrackingVisualState = (item, activelyPollingIds = []) => {
  const lastCheckStatus = String(item.lastCheckStatus || "").toLowerCase();
  const isLocallyPolling = activelyPollingIds.includes(item.id);

  if (lastCheckStatus === "bot_protection") {
    return {
      label: "Retry scheduled",
      color: "warning",
      icon: <WarningAmberIcon fontSize="small" />,
    };
  }

  if (
    lastCheckStatus === "error" ||
    lastCheckStatus === "not_found" ||
    lastCheckStatus === "rate_limited"
  ) {
    return {
      label: "Tracking issue",
      color: "error",
      icon: <WarningAmberIcon fontSize="small" />,
    };
  }

  if (item.currentObservedPrice != null || lastCheckStatus === "success") {
    return {
      label: "Updated",
      color: "success",
      icon: <CheckCircleOutlineIcon fontSize="small" />,
    };
  }

  if (isLocallyPolling) {
    return {
      label: "Processing",
      color: "info",
      icon: <AutorenewIcon fontSize="small" />,
    };
  }

  return {
    label: "Queued",
    color: "default",
    icon: <ScheduleIcon fontSize="small" />,
  };
};

const getStatusConfig = (status) => {
  switch (status) {
    case wishlistItemStatus.BUY_NOW:
      return {
        label: "Buy now",
        color: "success",
        icon: <TrackChangesIcon fontSize="small" />,
        rowBorderColor: "success.main",
        rowBackgroundColor: "rgba(76, 175, 80, 0.06)",
      };

    case wishlistItemStatus.NEAR_TARGET:
      return {
        label: "Near target",
        color: "warning",
        icon: <VisibilityOutlinedIcon fontSize="small" />,
        rowBorderColor: "warning.main",
        rowBackgroundColor: "rgba(255, 152, 0, 0.05)",
      };

    case wishlistItemStatus.PRICE_DROPPED:
      return {
        label: "Price dropped",
        color: "info",
        icon: <TrendingDownIcon fontSize="small" />,
        rowBorderColor: "info.main",
        rowBackgroundColor: "rgba(33, 150, 243, 0.05)",
      };

    case wishlistItemStatus.TRACKING_ERROR:
      return {
        label: "Tracking issue",
        color: "error",
        icon: <WarningAmberIcon fontSize="small" />,
        rowBorderColor: "error.main",
        rowBackgroundColor: "rgba(244, 67, 54, 0.05)",
      };

    default:
      return {
        label: "Watching",
        color: "default",
        icon: <VisibilityOutlinedIcon fontSize="small" />,
        rowBorderColor: "transparent",
        rowBackgroundColor: "transparent",
      };
  }
};

const WishlistTable = ({
  items = [],
  alerts = [],
  total = 0,
  page = 0,
  rowsPerPage = 10,
  onPageChange,
  onRowsPerPageChange,
  onViewItem,
  onEditItem,
  onDeleteItem,
  trackingItemIds = [],
}) => {
  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: "24px",
        backgroundColor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "none",
        overflowX: "auto",
        overflowY: "hidden",
        WebkitOverflowScrolling: "touch",
        touchAction: "pan-x pan-y",
      }}
    >
      <Box
        sx={{
          display: "inline-block",
          minWidth: "100%",
        }}
      >
        <Table sx={{ minWidth: 980 }}>
          <TableHead>
            <TableRow
              sx={{
                "& th": {
                  borderBottom: "1px solid",
                  borderColor: "divider",
                  py: 2.5,
                  fontWeight: 500,
                  color: "text.primary",
                  whiteSpace: "nowrap",
                },
              }}
            >
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Target price</TableCell>
              <TableCell align="right">Observed price</TableCell>
              <TableCell align="right">Delta to target</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {items.map((item, index) => {
              const targetPrice = Number(item.targetPrice || 0);
              const hasObservedPrice = item.currentObservedPrice != null;
              const observedPrice = hasObservedPrice
                ? Number(item.currentObservedPrice)
                : null;
              const delta = hasObservedPrice
                ? observedPrice - targetPrice
                : null;
              const isLastRow = index === items.length - 1;

              const status = getWishlistItemStatus(item, alerts);
              const statusConfig = getStatusConfig(status);
              const trackingVisualState = getTrackingVisualState(
                item,
                trackingItemIds,
              );

              const isBuyNow = status === wishlistItemStatus.BUY_NOW;
              const isPriceDropped =
                status === wishlistItemStatus.PRICE_DROPPED;
              const shouldShowTrackingChip =
                trackingItemIds.includes(item.id) ||
                item.lastCheckStatus === "bot_protection";

              return (
                <TableRow
                  key={item.id}
                  hover
                  sx={{
                    backgroundColor: statusConfig.rowBackgroundColor,
                    "& td": {
                      py: 2.75,
                      borderBottom: isLastRow ? "none" : "1px solid",
                      borderColor: "divider",
                      verticalAlign: "middle",
                    },
                  }}
                >
                  <TableCell
                    sx={{
                      minWidth: 240,
                      borderLeft: "4px solid",
                      borderLeftColor: statusConfig.rowBorderColor,
                    }}
                  >
                    <Box>
                      <Typography fontWeight={700}>{item.name}</Typography>

                      {item.description ? (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 0.35 }}
                        >
                          {item.description}
                        </Typography>
                      ) : null}

                      {shouldShowTrackingChip ? (
                        <Chip
                          icon={trackingVisualState.icon}
                          label={trackingVisualState.label}
                          color={trackingVisualState.color}
                          size="small"
                          variant="outlined"
                          sx={{
                            mt: 1,
                            fontWeight: 600,
                          }}
                        />
                      ) : null}
                    </Box>
                  </TableCell>

                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {item.category || "-"}
                  </TableCell>

                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    <Chip
                      label={item.priority || "Unknown"}
                      color={getPriorityColor(item.priority)}
                      size="small"
                      variant="outlined"
                      sx={{
                        fontWeight: 600,
                        opacity: 0.9,
                      }}
                    />
                  </TableCell>

                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    <Chip
                      icon={statusConfig.icon}
                      label={statusConfig.label}
                      color={statusConfig.color}
                      size="small"
                      variant={
                        status === wishlistItemStatus.WATCHING
                          ? "outlined"
                          : "filled"
                      }
                      sx={{
                        fontWeight: 700,
                      }}
                    />
                  </TableCell>

                  <TableCell
                    align="right"
                    sx={{
                      whiteSpace: "nowrap",
                      fontVariantNumeric: "tabular-nums",
                      minWidth: 120,
                    }}
                  >
                    {formatCurrency(targetPrice)}
                  </TableCell>

                  <TableCell
                    align="right"
                    sx={{
                      fontWeight: 700,
                      color: isBuyNow
                        ? "success.main"
                        : isPriceDropped
                          ? "info.main"
                          : "text.primary",
                      whiteSpace: "nowrap",
                      fontVariantNumeric: "tabular-nums",
                      minWidth: 160,
                    }}
                  >
                    {hasObservedPrice ? (
                      formatCurrency(observedPrice)
                    ) : (
                      <Box
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 0.75,
                          color: "text.secondary",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {trackingVisualState.icon}
                        <Typography variant="body2" color="text.secondary">
                          {trackingVisualState.label}
                        </Typography>
                      </Box>
                    )}
                  </TableCell>

                  <TableCell
                    align="right"
                    sx={{
                      color:
                        delta == null
                          ? "text.secondary"
                          : delta <= 0
                            ? "success.main"
                            : "warning.main",
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                      fontVariantNumeric: "tabular-nums",
                      minWidth: 140,
                    }}
                  >
                    {delta == null
                      ? "-"
                      : `${delta > 0 ? "+" : ""}${formatCurrency(delta)}`}
                  </TableCell>

                  <TableCell align="center" sx={{ minWidth: 100 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <WishlistRowActions
                        onView={() => onViewItem?.(item)}
                        onEdit={() => onEditItem?.(item)}
                        onDelete={() => onDeleteItem?.(item)}
                      />
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={onPageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={onRowsPerPageChange}
          rowsPerPageOptions={[5, 10, 25, 50]}
          sx={{
            width: "100%",
            borderTop: "1px solid",
            borderColor: "divider",
            "& .MuiTablePagination-toolbar": {
              px: { xs: 1, sm: 2 },
              minHeight: { xs: 64, sm: 52 },
              flexWrap: { xs: "wrap", sm: "nowrap" },
              justifyContent: { xs: "center", sm: "flex-end" },
              alignItems: "center",
              columnGap: { xs: 1, sm: 0 },
              rowGap: { xs: 1, sm: 0 },
            },
            "& .MuiTablePagination-spacer": {
              display: { xs: "none", sm: "block" },
              flex: "1 1 auto",
            },
            "& .MuiTablePagination-selectLabel": {
              margin: 0,
              whiteSpace: "nowrap",
            },
            "& .MuiTablePagination-displayedRows": {
              margin: 0,
              whiteSpace: "nowrap",
            },
            "& .MuiTablePagination-actions": {
              marginLeft: { xs: 0, sm: 1 },
              flexShrink: 0,
            },
          }}
        />
      </Box>
    </TableContainer>
  );
};

export default WishlistTable;
