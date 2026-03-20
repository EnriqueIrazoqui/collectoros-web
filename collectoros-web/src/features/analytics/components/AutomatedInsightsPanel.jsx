import { Box, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import TrendingDownOutlinedIcon from "@mui/icons-material/TrendingDownOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import ShowChartOutlinedIcon from "@mui/icons-material/ShowChartOutlined";
import InfoTooltip from "../../../components/common/InfoTooltip";
import { formatCurrency } from "../../../utils/formatCurrency";
import useCollectionGrowth from "../hooks/useCollectionGrowth";
import useTradePerformance from "../hooks/useTradePerformance";
import useInventoryMovers from "../hooks/useInventoryMovers";
import useWishlistOpportunities from "../hooks/useWishlistOpportunities";
import { useNavigate } from "react-router-dom";

function formatPercent(value) {
  const numericValue = Number(value || 0);
  const sign = numericValue > 0 ? "+" : "";
  return `${sign}${numericValue.toFixed(2)}%`;
}

function buildInsights({
  growthData,
  tradeData,
  moversData,
  wishlistData,
  navigate,
}) {
  const insights = [];

  const growthPercent = Number(growthData?.growthPercent || 0);
  const growthAmount = Number(growthData?.growthAmount || 0);
  const pointsCount = Number(growthData?.pointsCount || 0);

  if (pointsCount > 0) {
    insights.push({
      id: "collection-growth",
      icon:
        growthAmount >= 0 ? (
          <ShowChartOutlinedIcon color="primary" />
        ) : (
          <TrendingDownOutlinedIcon color="error" />
        ),
      title: "Collection growth",
      message:
        growthAmount >= 0
          ? `Your collection has grown ${formatPercent(growthPercent)} (${formatCurrency(
              growthAmount,
            )}) since tracking began.`
          : `Your collection is down ${formatPercent(growthPercent)} (${formatCurrency(
              growthAmount,
            )}) since tracking began.`,
      tone: growthAmount >= 0 ? "positive" : "negative",
    });
  }

  const bestTrade = tradeData?.bestTrade || null;
  if (bestTrade) {
    insights.push({
      id: "best-trade",
      icon: <EmojiEventsOutlinedIcon color="success" />,
      title: "Best trade",
      message: `${bestTrade.name} is currently your best trade at ${
        Number(bestTrade.profitAmount || 0) > 0 ? "+" : ""
      }${formatCurrency(bestTrade.profitAmount)} (${formatPercent(
        bestTrade.profitPercent,
      )}).`,
      tone: Number(bestTrade.profitAmount || 0) >= 0 ? "positive" : "neutral",
      onClick: () =>
        navigate("/inventory", {
          state: {
            highlightedInventoryItemId: bestTrade.id,
          },
        }),
    });
  }

  const risingItems = moversData?.risingItems || [];
  if (risingItems.length > 0) {
    const topRiser = risingItems[0];

    insights.push({
      id: "top-riser",
      icon: <TrendingUpOutlinedIcon color="success" />,
      title: "Top rising item",
      message: `${topRiser.name} is your strongest rising item right now at ${
        Number(topRiser.change || 0) > 0 ? "+" : ""
      }${formatCurrency(topRiser.change)} (${formatPercent(
        topRiser.changePercent,
      )}) from first to last tracked price.`,
      tone: "positive",
      onClick: () =>
        navigate("/inventory", {
          state: {
            highlightedInventoryItemId: topRiser.itemId,
          },
        }),
    });
  }

  const fallingItems = moversData?.fallingItems || [];
  if (fallingItems.length > 0) {
    const topFaller = fallingItems[0];

    insights.push({
      id: "top-faller",
      icon: <TrendingDownOutlinedIcon color="error" />,
      title: "Top falling item",
      message: `${topFaller.name} is the sharpest falling item at ${formatCurrency(
        topFaller.change,
      )} (${formatPercent(topFaller.changePercent)}).`,
      tone: "negative",
      onClick: () =>
        navigate("/inventory", {
          state: {
            highlightedInventoryItemId: topFaller.itemId,
          },
        }),
    });
  }

  const buyNow = wishlistData?.buyNow || [];
  const nearTarget = wishlistData?.nearTarget || [];
  const meta = wishlistData?.meta || {};

  if (buyNow.length > 0 || nearTarget.length > 0) {
    insights.push({
      id: "wishlist-opportunities",
      icon: <LocalOfferOutlinedIcon color="warning" />,
      title: "Wishlist opportunities",
      message: `${meta.buyNowCount || buyNow.length || 0} wishlist item${
        (meta.buyNowCount || buyNow.length || 0) === 1 ? "" : "s"
      } ${
        (meta.buyNowCount || buyNow.length || 0) === 1 ? "is" : "are"
      } already at or below your target price, and ${
        meta.nearTargetCount || nearTarget.length || 0
      } ${
        (meta.nearTargetCount || nearTarget.length || 0) === 1 ? "is" : "are"
      } near target.`,
      tone: "warning",
      onClick: () =>
        navigate("/wishlist", {
          state: {
            wishlistViewMode: "opportunities",
          },
        }),
    });
  }

  return insights.slice(0, 4);
}

function getToneStyles(tone) {
  switch (tone) {
    case "positive":
      return {
        borderColor: "success.light",
        chipColor: "success",
      };
    case "negative":
      return {
        borderColor: "error.light",
        chipColor: "error",
      };
    case "warning":
      return {
        borderColor: "warning.light",
        chipColor: "warning",
      };
    default:
      return {
        borderColor: "divider",
        chipColor: "default",
      };
  }
}

function InsightCard({ insight }) {
  const styles = getToneStyles(insight.tone);

  return (
    <Box
      onClick={insight.onClick}
      sx={{
        border: "1px solid",
        borderColor: styles.borderColor,
        borderRadius: 3,
        p: 2,
        height: "100%",
        cursor: insight.onClick ? "pointer" : "default",
        transition: "all 0.2s ease",
        "&:hover": insight.onClick
          ? {
              transform: "translateY(-2px)",
              boxShadow: 3,
              borderColor: "primary.main",
            }
          : {},
      }}
    >
      <Stack spacing={1.25}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          spacing={2}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            {insight.icon}
            <Typography variant="subtitle2" fontWeight={700}>
              {insight.title}
            </Typography>
          </Stack>

          <Chip
            size="small"
            label="Insight"
            color={styles.chipColor}
            variant="outlined"
          />
        </Stack>

        <Typography variant="body2" color="text.secondary">
          {insight.message}
        </Typography>
      </Stack>
    </Box>
  );
}

const AutomatedInsightsPanel = () => {
  const growthQuery = useCollectionGrowth();
  const tradeQuery = useTradePerformance();
  const moversQuery = useInventoryMovers();
  const wishlistQuery = useWishlistOpportunities();
  const navigate = useNavigate();

  const isLoading =
    growthQuery.isLoading ||
    tradeQuery.isLoading ||
    moversQuery.isLoading ||
    wishlistQuery.isLoading;

  const isError =
    growthQuery.isError ||
    tradeQuery.isError ||
    moversQuery.isError ||
    wishlistQuery.isError;

  const errorMessage =
    growthQuery.error?.response?.data?.message ||
    tradeQuery.error?.response?.data?.message ||
    moversQuery.error?.response?.data?.message ||
    wishlistQuery.error?.response?.data?.message ||
    "Could not load automated insights.";

  if (isLoading) {
    return (
      <Card sx={{ borderRadius: 4 }}>
        <CardContent>
          <Stack spacing={1}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="h6" fontWeight={700}>
                Automated insights
              </Typography>
              <InfoTooltip title="Auto-generated portfolio highlights based on your current analytics, price history, and wishlist opportunities." />
            </Stack>

            <Typography variant="body2" color="text.secondary">
              Building smart insights...
            </Typography>
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
            {errorMessage}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const insights = buildInsights({
    growthData: growthQuery.data?.data || {},
    tradeData: tradeQuery.data?.data || {},
    moversData: moversQuery.data?.data || {},
    wishlistData: wishlistQuery.data?.data || {},
    navigate,
  });

  if (!insights.length) {
    return (
      <Card sx={{ borderRadius: 4 }}>
        <CardContent>
          <Stack spacing={1}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="h6" fontWeight={700}>
                Automated insights
              </Typography>
              <InfoTooltip title="Auto-generated portfolio highlights based on your current analytics, price history, and wishlist opportunities." />
            </Stack>

            <Typography variant="body2" color="text.secondary">
              Not enough data yet to generate insights.
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
              <AutoAwesomeOutlinedIcon color="primary" />
              <Typography variant="h6" fontWeight={700}>
                Automated insights
              </Typography>
              <InfoTooltip title="Auto-generated portfolio highlights based on your current analytics, price history, and wishlist opportunities." />
            </Stack>

            <Chip
              size="small"
              label={`${insights.length} highlight${
                insights.length === 1 ? "" : "s"
              }`}
              variant="outlined"
            />
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
            {insights.map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default AutomatedInsightsPanel;
