import apiClient from "../../../services/apiClient";

export const getAnalyticsSummaryRequest = async () => {
  const { data } = await apiClient.get("/analytics/summary");
  return data;
};

export const getPortfolioAnalyticsRequest = async () => {
  const { data } = await apiClient.get("/analytics/portfolio");
  return data;
};

export const getTopItemsAnalyticsRequest = async () => {
  const { data } = await apiClient.get("/analytics/top-items");
  return data;
};

export const getItemTrendAnalyticsRequest = async (itemId) => {
  const { data } = await apiClient.get(`/analytics/item-trend/${itemId}`);
  return data;
};