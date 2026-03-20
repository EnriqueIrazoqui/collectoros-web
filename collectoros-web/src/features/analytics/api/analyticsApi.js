import apiClient from "../../../services/apiClient";

async function getAnalyticsSummaryRequest() {
  const { data } = await apiClient.get("/analytics/summary");
  return data;
}

async function getPortfolioAnalyticsRequest() {
  const { data } = await apiClient.get("/analytics/portfolio");
  return data;
}

async function getTopItemsAnalyticsRequest() {
  const { data } = await apiClient.get("/analytics/top-items");
  return data;
}

async function getItemTrendAnalyticsRequest(itemId) {
  const { data } = await apiClient.get(`/analytics/item-trend/${itemId}`);
  return data;
}

async function getPortfolioAllocation() {
  const { data } = await apiClient.get("/analytics/allocation");
  return data;
}

async function getCollectionGrowth() {
  const { data } = await apiClient.get("/analytics/collection-growth");
  return data;
}

async function getTradePerformance() {
  const { data } = await apiClient.get("/analytics/trade-performance");
  return data;
}

export {
  getPortfolioAllocation,
  getItemTrendAnalyticsRequest,
  getTopItemsAnalyticsRequest,
  getPortfolioAnalyticsRequest,
  getAnalyticsSummaryRequest,
  getCollectionGrowth,
  getTradePerformance,
};
