import apiClient from "../../../services/apiClient";

export const getPriceHistoryByItemId = async (itemId) => {
  const { data } = await apiClient.get(`/price-history/${itemId}`);
  return data;
};

export const createPriceHistoryEntry = async (payload) => {
  const { data } = await apiClient.post("/price-history", payload);
  return data;
};

export const deletePriceHistoryEntry = async (priceHistoryId) => {
  const { data } = await apiClient.delete(`/price-history/entry/${priceHistoryId}`);
  return data;
};