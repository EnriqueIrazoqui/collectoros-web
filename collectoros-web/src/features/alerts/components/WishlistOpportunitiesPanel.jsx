import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import TrackChangesOutlinedIcon from "@mui/icons-material/TrackChangesOutlined";
import { useNavigate } from "react-router-dom";
import InfoTooltip from "../../../components/common/InfoTooltip";
import { formatCurrency } from "../../../utils/formatCurrency";
import useWishlistOpportunities from "../hooks/useWishlistOpportunities";

function getBarValue(value, maxValue) {
  if (!maxValue || maxValue <= 0) return 0;
  return Math.max((Math.abs(Number(value || 0)) / maxValue) * 100, 6);
}

function getPriorityChipProps(priority) {
  const normalizedPriority = String(priority || "").toLowerCase();

  switch (normalizedPriority) {
    case "high":
      return {
        label: "High",
        color: "error",
        variant: "outlined",
      };

    case "medium":
      return {
        label: "Medium",
        color: "warning",
        variant: "outlined",
      };

    case "low":
      return {
        label: "Low",
        color: "info",
        variant: "outlined",
      };

    default:
      return {
        label: priority || "N/A",
        color: "default",
        variant: "outlined",
      };
  }
}

function EmptyColumn({ title, subtitle, icon }) {
  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 4,
        height: "100%",
      }}
    >
      <CardContent>
        <Stack spacing={1.5}>
          <Stack direction="row" spacing={1} alignItems="center">
            {icon}
            <Typography variant="subtitle1" fontWeight={700}>
              {title}
            </Typography>
          </Stack>

          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>

          <Box
            sx={{
              border: "1px dashed",
              borderColor: "divider",
              borderRadius: 3,
              p: 3,
              textAlign: "center",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              No items available in this group.
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

function OpportunityItem({
  item,
  maxSavings = 0,
  type = "buyNow",
  onClick,
}) {
  const targetPrice = Number(item.targetPrice || 0);
  const observedPrice = Number(item.observedPrice || 0);
  const savings = targetPrice - observedPrice;
  const percent =
    targetPrice > 0 ? ((savings / targetPrice) * 100).toFixed(2) : "0.00";
  const priorityChip = getPriorityChipProps(item.priority);

  return (
    <Box
      onClick={onClick}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        p: 2,
        cursor: "pointer",
        transition: "all 0.2s ease",
        "&:hover": {
          borderColor: "primary.main",
          transform: "translateY(-2px)",
          boxShadow: 3,
        },
      }}
    >
      <Stack spacing={1.25}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          spacing={2}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle2" fontWeight={700} noWrap>
              {item.name}
            </Typography>

            <Typography variant="caption" color="text.secondary">
              {item.category || "Uncategorized"}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Chip
              size="small"
              label={type === "buyNow" ? "Buy now" : "Near target"}
              color={type === "buyNow" ? "success" : "warning"}
              variant="outlined"
            />

            <Chip
              size="small"
              label={priorityChip.label}
              color={priorityChip.color}
              variant={priorityChip.variant}
            />
          </Stack>
        </Stack>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          justifyContent="space-between"
        >
          <Typography variant="body2" color="text.secondary">
            {formatCurrency(observedPrice)} observed
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {formatCurrency(targetPrice)} target
          </Typography>
        </Stack>

        <Typography
          variant="body2"
          fontWeight={700}
          color={savings >= 0 ? "success.main" : "error.main"}
        >
          {savings >= 0 ? "+" : ""}
          {formatCurrency(savings)} vs target ({savings >= 0 ? "+" : ""}
          {percent}%)
        </Typography>

        <LinearProgress
          variant="determinate"
          value={getBarValue(savings, maxSavings)}
          color={type === "buyNow" ? "success" : "warning"}
          sx={{
            height: 8,
            borderRadius: 999,
          }}
        />
      </Stack>
    </Box>
  );
}

const WishlistOpportunitiesPanel = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useWishlistOpportunities();

  const buyNow = data?.data?.buyNow || [];
  const nearTarget = data?.data?.nearTarget || [];
  const meta = data?.data?.meta || {};

  const maxBuyNowSavings = Math.max(
    ...buyNow.map((item) =>
      Math.abs(Number(item.targetPrice || 0) - Number(item.observedPrice || 0)),
    ),
    0,
  );

  const maxNearTargetSavings = Math.max(
    ...nearTarget.map((item) =>
      Math.abs(Number(item.targetPrice || 0) - Number(item.observedPrice || 0)),
    ),
    0,
  );

  if (isLoading) {
    return (
      <Card sx={{ borderRadius: 4 }}>
        <CardContent>
          <Stack spacing={2}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="h6" fontWeight={700}>
                Wishlist opportunities
              </Typography>
              <InfoTooltip title="Wishlist items that are already at or below your target price, or very close to it." />
            </Stack>

            <Typography variant="body2" color="text.secondary">
              Loading wishlist opportunities...
            </Typography>

            <LinearProgress />
          </Stack>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card sx={{ borderRadius: 4 }}>
        <CardContent>
          <Typography variant="body2" color="error">
            {error?.response?.data?.message ||
              error?.message ||
              "Could not load wishlist opportunities."}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (!buyNow.length && !nearTarget.length) {
    return (
      <Card sx={{ borderRadius: 4 }}>
        <CardContent>
          <Stack spacing={1}>
            <Typography variant="h6" fontWeight={700}>
              Wishlist opportunities
            </Typography>
            <Typography color="text.secondary">
              No opportunities detected.
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ borderRadius: 4 }}>
      <CardContent>
        <Stack spacing={3}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={1}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="h6" fontWeight={700}>
                Wishlist opportunities
              </Typography>
              <InfoTooltip title="Wishlist items that are already at or below your target price, or very close to it." />
            </Stack>

            <Typography variant="body2" color="text.secondary">
              {meta.buyNowCount || 0} buy now · {meta.nearTargetCount || 0} near
              target
            </Typography>
          </Stack>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                lg: "1fr 1fr",
              },
              gap: 2,
            }}
          >
            {buyNow.length > 0 ? (
              <Card
                variant="outlined"
                sx={{
                  borderRadius: 4,
                  height: "100%",
                }}
              >
                <CardContent>
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <LocalOfferOutlinedIcon color="success" />
                      <Typography variant="subtitle1" fontWeight={700}>
                        Buy now
                      </Typography>
                    </Stack>

                    <Divider />

                    <Stack spacing={1.5}>
                      {buyNow.map((item, index) => (
                        <OpportunityItem
                          key={item.id ?? `buy-now-${index}`}
                          item={item}
                          maxSavings={maxBuyNowSavings}
                          type="buyNow"
                          onClick={() =>
                            navigate("/wishlist", {
                              state: {
                                highlightedWishlistItemId: item.id,
                              },
                            })
                          }
                        />
                      ))}
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            ) : (
              <EmptyColumn
                title="Buy now"
                subtitle="Items already at or below your target price."
                icon={<LocalOfferOutlinedIcon color="success" />}
              />
            )}

            {nearTarget.length > 0 ? (
              <Card
                variant="outlined"
                sx={{
                  borderRadius: 4,
                  height: "100%",
                }}
              >
                <CardContent>
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <TrackChangesOutlinedIcon color="warning" />
                      <Typography variant="subtitle1" fontWeight={700}>
                        Near target
                      </Typography>
                    </Stack>

                    <Divider />

                    <Stack spacing={1.5}>
                      {nearTarget.map((item, index) => (
                        <OpportunityItem
                          key={item.id ?? `near-target-${index}`}
                          item={item}
                          maxSavings={maxNearTargetSavings}
                          type="nearTarget"
                          onClick={() =>
                            navigate("/wishlist", {
                              state: {
                                highlightedWishlistItemId: item.id,
                              },
                            })
                          }
                        />
                      ))}
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            ) : (
              <EmptyColumn
                title="Near target"
                subtitle="Items close to your desired price."
                icon={<TrackChangesOutlinedIcon color="warning" />}
              />
            )}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default WishlistOpportunitiesPanel;