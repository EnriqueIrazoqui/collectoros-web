import { useMemo, useState } from "react";
import { Alert, Box, CircularProgress, Stack } from "@mui/material";
import AnalyticsHero from "../components/AnalyticsHero";
import AnalyticsSection from "../components/AnalyticsSection";
import AnalyticsSummaryCards from "../components/AnalyticsSummaryCards";
import PortfolioOverviewCards from "../components/PortfolioOverviewCards";
import TopItemsPanel from "../components/TopItemsPanel";
import AnalyticsItemSelector from "../components/AnalyticsItemSelector";
import ItemTrendPanel from "../components/ItemTrendPanel";
import { useAnalyticsSummary } from "../hooks/useAnalyticsSummary";
import { usePortfolioAnalytics } from "../hooks/usePortfolioAnalytics";
import { useTopItemsAnalytics } from "../hooks/useTopItemsAnalytics";
import { useItemTrendAnalytics } from "../hooks/useItemTrendAnalytics";
import PortfolioComparisonChart from "../components/PortfolioComparisonChart";
import InventoryMoversPanel from "../components/InventoryMoversPanel";
import WishlistOpportunitiesPanel from "../../alerts/components/WishlistOpportunitiesPanel";
import PortfolioAllocationChart from "../components/PortfolioAllocationChart";
import CollectionGrowthChart from "../components/CollectionGrowthChart";
import BestWorstTradePanel from "../components/BestWorstTradePanel";
import AutomatedInsightsPanel from "../components/AutomatedInsightsPanel";

const AnalyticsPage = () => {
  const [selectedItemId, setSelectedItemId] = useState("");

  const summaryQuery = useAnalyticsSummary();
  const portfolioQuery = usePortfolioAnalytics();
  const topItemsQuery = useTopItemsAnalytics();
  const trendQuery = useItemTrendAnalytics(
    selectedItemId,
    Boolean(selectedItemId),
  );

  const isLoading =
    summaryQuery.isLoading ||
    portfolioQuery.isLoading ||
    topItemsQuery.isLoading;

  const isError =
    summaryQuery.isError || portfolioQuery.isError || topItemsQuery.isError;

  const errorMessage =
    summaryQuery.error?.response?.data?.message ||
    portfolioQuery.error?.response?.data?.message ||
    topItemsQuery.error?.response?.data?.message ||
    "Could not load analytics.";

  const summaryData = summaryQuery.data?.data || {};
  const portfolioData = portfolioQuery.data?.data || {};
  const topItemsData = topItemsQuery.data?.data || {};
  const trendData = trendQuery.data?.data || null;

  const selectableItems = useMemo(() => {
    const combined = [
      ...(topItemsData.topValuableItems || []),
      ...(topItemsData.topProfitableItems || []),
    ];

    const uniqueMap = new Map();

    combined.forEach((item) => {
      if (!uniqueMap.has(item.id)) {
        uniqueMap.set(item.id, item);
      }
    });

    return Array.from(uniqueMap.values());
  }, [topItemsData]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" py={6}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return <Alert severity="error">{errorMessage}</Alert>;
  }

  return (
    <Box sx={{ width: "100%", maxWidth: "1400px", mx: "auto" }}>
      <AnalyticsHero />

      <Stack spacing={3}>
         <AutomatedInsightsPanel />
        <AnalyticsSummaryCards data={summaryData} />
        <PortfolioOverviewCards data={portfolioData} />
        <PortfolioComparisonChart data={portfolioData} />
        <PortfolioAllocationChart />
        <CollectionGrowthChart />
        <BestWorstTradePanel />
        <TopItemsPanel data={topItemsData} />
        <InventoryMoversPanel />
        <AnalyticsSection title="Wishlist opportunities">
          <WishlistOpportunitiesPanel />
        </AnalyticsSection>
        <AnalyticsSection title="Item trend explorer">
          <Box sx={{ mb: 2 }}>
            <AnalyticsItemSelector
              value={selectedItemId}
              onChange={setSelectedItemId}
              items={selectableItems}
            />
          </Box>
        </AnalyticsSection>
        <ItemTrendPanel
          isLoading={trendQuery.isLoading}
          isError={trendQuery.isError}
          errorMessage={
            trendQuery.error?.response?.data?.message ||
            "Could not load item trend."
          }
          data={trendData}
        />
      </Stack>
    </Box>
  );
};

export default AnalyticsPage;
