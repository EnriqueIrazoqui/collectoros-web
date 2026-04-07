import { Box, Paper, Typography } from "@mui/material";
import {
  getWishlistItemStatus,
  wishlistItemStatus,
} from "../utils/getWishlistItemStatus";

const summaryCardStyles = {
  borderRadius: "20px",
  px: 2.5,
  py: 2,
  border: "1px solid",
  borderColor: "divider",
  backgroundColor: "background.paper",
  boxShadow: "none",
  minWidth: 0,
};

const WishlistStatusSummary = ({ items = [], alerts = [] }) => {
  const summary = items.reduce(
    (accumulator, item) => {
      const status = getWishlistItemStatus(item, alerts);

      if (status === wishlistItemStatus.BUY_NOW) {
        accumulator.buyNow += 1;
      } else if (status === wishlistItemStatus.NEAR_TARGET) {
        accumulator.nearTarget += 1;
      } else if (status === wishlistItemStatus.PRICE_DROPPED) {
        accumulator.priceDropped += 1;
      } else if (status === wishlistItemStatus.TRACKING_ERROR) {
        accumulator.trackingIssues += 1;
      }

      return accumulator;
    },
    {
      buyNow: 0,
      nearTarget: 0,
      priceDropped: 0,
      trackingIssues: 0,
    },
  );

  const unreadAlerts = alerts.filter((alert) => alert.status === "unread").length;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          lg: "repeat(4, 1fr)",
        },
        gap: 2,
        mb: 3,
      }}
    >
      <Paper
        sx={{
          ...summaryCardStyles,
          backgroundColor: "rgba(76, 175, 80, 0.08)",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Buy now
        </Typography>
        <Typography variant="h5" fontWeight={700}>
          {summary.buyNow}
        </Typography>
      </Paper>

      <Paper
        sx={{
          ...summaryCardStyles,
          backgroundColor: "rgba(255, 152, 0, 0.08)",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Near target
        </Typography>
        <Typography variant="h5" fontWeight={700}>
          {summary.nearTarget}
        </Typography>
      </Paper>

      <Paper
        sx={{
          ...summaryCardStyles,
          backgroundColor: "rgba(33, 150, 243, 0.08)",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Price dropped
        </Typography>
        <Typography variant="h5" fontWeight={700}>
          {summary.priceDropped}
        </Typography>
      </Paper>

      <Paper
        sx={{
          ...summaryCardStyles,
          backgroundColor: "rgba(156, 39, 176, 0.08)",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Unread alerts
        </Typography>
        <Typography variant="h5" fontWeight={700}>
          {unreadAlerts}
        </Typography>
      </Paper>
    </Box>
  );
};

export default WishlistStatusSummary;