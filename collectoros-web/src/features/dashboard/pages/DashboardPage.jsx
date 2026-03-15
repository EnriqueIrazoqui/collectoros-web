import {
  Box,
  CircularProgress,
  Grid,
  Typography,
  Alert,
  Stack,
  LinearProgress,
} from "@mui/material";
import { useAuth } from "../../auth/hooks/useAuth";
import { useDashboard } from "../hooks/useDashboard";
import DashboardSection from "../components/DashboardSection";
import DashboardStatCard from "../components/DashboardStatCard";
import { formatCurrency } from "../../../utils/formatCurrency";
import DashboardSummaryPanel from "../components/DashboardSummaryPanel";
import DashboardKeyValueList from "../components/DashboardKeyValueList";
import DashboardItemsList from "../components/DashboardItemsList";
import DashboardRecentList from "../components/DashboardRecentList";
import DashboardOpportunityPanel from "../components/DashboardOpportunityPanel";
import DashboardOpportunityList from "../components/DashboardOpportunityList";
import DashboardMoverList from "../components/DashboardMoverList";
import PortfolioPerformanceChart from "../components/PortfolioPerformanceChart";
import CategoryDistributionChart from "../components/CategoryDistributionChart";

const DashboardPage = () => {
  const { user } = useAuth();
  const { data, isLoading, isError, error } = useDashboard();

  if (isLoading) {
    return <CircularProgress />;
  }

  if (isError) {
    return (
      <Alert severity="error">
        {error?.response?.data?.message ||
          "No fue posible cargar el dashboard."}
      </Alert>
    );
  }

  const portfolioChartData = [
    { date: "Jan", value: 1200 },
    { date: "Feb", value: 1500 },
    { date: "Mar", value: 1700 },
    { date: "Apr", value: 2000 },
    { date: "May", value: 2400 },
  ];

  const categoryChartData = [
    { category: "Watch", value: 1200 },
    { category: "TCG Card", value: 1200 },
  ];

  const dashboardData = data?.data;
  const portfolio = dashboardData?.portfolio;
  const analyticsSummary = dashboardData?.analyticsSummary;
  const inventorySummary = analyticsSummary?.inventory;
  const wishlistSummary = analyticsSummary?.wishlist;
  const topItems = dashboardData?.topItems;
  const recentInventoryItems = dashboardData?.recentInventoryItems || [];
  const recentWishlistItems = dashboardData?.recentWishlistItems || [];

  const wishlistOpportunities = dashboardData?.wishlistOpportunities;
  const inventoryMovers = dashboardData?.inventoryMovers;

  const buyNowItems = wishlistOpportunities?.buyNow || [];
  const nearTargetItems = wishlistOpportunities?.nearTarget || [];

  const risingItems = inventoryMovers?.risingItems || [];
  const fallingItems = inventoryMovers?.fallingItems || [];

  const wishlistTarget = Number(wishlistSummary?.totalTargetValue || 0);
  const wishlistObserved = Number(
    wishlistSummary?.totalCurrentObservedValue || 0,
  );

  const wishlistProgress = wishlistTarget
    ? Math.min((wishlistObserved / wishlistTarget) * 100, 100)
    : 0;

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "1400px",
        mx: "auto",
      }}
    >
      <Stack spacing={0.5} mb={4}>
        <Typography variant="h4" fontWeight={700}>
          Welcome back, {user?.displayName || user?.email || "Collector"}
        </Typography>

        <Typography variant="body1" color="text.secondary">
          Here is a quick overview of your collection.
        </Typography>
      </Stack>

      <DashboardSection title="Portfolio overview">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} lg={3}>
            <DashboardStatCard
              title="Items"
              value={portfolio?.itemsCount ?? 0}
            />
          </Grid>

          <Grid item xs={12} sm={6} lg={3}>
            <DashboardStatCard
              title="Portfolio value"
              value={formatCurrency(portfolio?.portfolioValue)}
            />
          </Grid>

          <Grid item xs={12} sm={6} lg={3}>
            <DashboardStatCard
              title="Invested"
              value={formatCurrency(portfolio?.investedAmount)}
              info="Total amount you originally paid for all items in your collection."
            />
          </Grid>

          <Grid item xs={12} sm={6} lg={3}>
            <DashboardStatCard
              title="Profit"
              value={formatCurrency(portfolio?.profit)}
              subtitle={`${portfolio?.profitPercent ?? 0}%`}
              info="Shows the difference between your current portfolio value and the total amount you invested."
            />
          </Grid>
        </Grid>
      </DashboardSection>

      <DashboardSection title="Portfolio insights">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              lg: "2fr 1fr",
            },
            gap: 2,
          }}
        >
          <PortfolioPerformanceChart data={portfolioChartData} />

          <CategoryDistributionChart data={categoryChartData} />
        </Box>
      </DashboardSection>

      <DashboardSection title="Collection summary">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              lg: "repeat(2, 1fr)",
            },
            gap: 2,
          }}
        >
          <DashboardSummaryPanel title="Inventory summary">
            <DashboardKeyValueList
              items={[
                {
                  label: "Total items",
                  value: inventorySummary?.totalItems ?? 0,
                },
                {
                  label: "Total quantity",
                  value: inventorySummary?.totalQuantity ?? 0,
                },
                {
                  label: "Invested amount",
                  value: formatCurrency(inventorySummary?.totalInvestedAmount),
                },
                {
                  label: "Estimated value",
                  value: formatCurrency(
                    inventorySummary?.totalCurrentEstimatedValue,
                  ),
                },
                {
                  label: "Unrealized gain/loss",
                  value: formatCurrency(inventorySummary?.unrealizedGainLoss),
                },
              ]}
            />
          </DashboardSummaryPanel>

          <DashboardSummaryPanel
            title="Wishlist summary"
            info="Summarizes the total target value of the items you want to acquire and their latest observed market value."
          >
            <DashboardKeyValueList
              items={[
                {
                  label: "Total items",
                  value: wishlistSummary?.totalItems ?? 0,
                },
                {
                  label: "Target value",
                  value: formatCurrency(wishlistSummary?.totalTargetValue),
                },
                {
                  label: "Observed value",
                  value: formatCurrency(
                    wishlistSummary?.totalCurrentObservedValue,
                  ),
                },
              ]}
            />

            <Box mt={2}>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2" color="text.secondary">
                  Wishlist progress
                </Typography>

                <Typography variant="body2" fontWeight={600}>
                  {wishlistProgress.toFixed(0)}%
                </Typography>
              </Box>

              <LinearProgress
                variant="determinate"
                value={wishlistProgress}
                sx={{
                  height: 8,
                  borderRadius: 999,
                }}
              />
            </Box>
          </DashboardSummaryPanel>
        </Box>
      </DashboardSection>

      <DashboardSection title="Top items">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              lg: "repeat(2, 1fr)",
            },
            gap: 2,
          }}
        >
          <DashboardItemsList
            title="Most valuable items"
            items={topItems?.topValuableItems}
          />

          <DashboardItemsList
            title="Most profitable items"
            items={topItems?.topProfitableItems}
          />
        </Box>
      </DashboardSection>

      <DashboardSection title="Recent activity">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              lg: "repeat(2, 1fr)",
            },
            gap: 2,
          }}
        >
          <DashboardRecentList
            title="Recent inventory items"
            items={recentInventoryItems}
            valueKey="currentEstimatedValue"
          />

          <DashboardRecentList
            title="Recent wishlist items"
            items={recentWishlistItems}
            valueKey="targetPrice"
          />
        </Box>
      </DashboardSection>
      <DashboardSection title="Opportunities and movers">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              lg: "repeat(2, 1fr)",
            },
            gap: 2,
          }}
        >
          <DashboardOpportunityPanel
            title="Wishlist opportunities"
            info="Highlights wishlist items that are already below or close to your target buying price."
          >
            <DashboardOpportunityList
              title="Buy now"
              items={buyNowItems}
              emptyText="No buy-now opportunities yet"
            />

            <DashboardOpportunityList
              title="Near target"
              items={nearTargetItems}
              emptyText="No near-target items yet"
            />
          </DashboardOpportunityPanel>

          <DashboardOpportunityPanel
            title="Inventory movers"
            info="Shows items whose estimated market value has recently increased or decreased."
          >
            <DashboardMoverList
              title="Rising items"
              items={risingItems}
              direction="up"
            />

            <DashboardMoverList
              title="Falling items"
              items={fallingItems}
              direction="down"
            />
          </DashboardOpportunityPanel>
        </Box>
      </DashboardSection>
    </Box>
  );
};

export default DashboardPage;
