import apiClient from "../../../services/apiClient";

export const getInventoryListRequest = async () => {
  const { data } = await apiClient.get("/inventory");
  return data;
};

export const getInventoryItemRequest = async (id) => {
  const { data } = await apiClient.get(`/inventory/${id}`);
  return data;
};

export const createInventoryItemRequest = async (payload) => {
  const { data } = await apiClient.post("/inventory", payload);
  return data;
};

export const updateInventoryItemRequest = async ({ id, payload }) => {
  const { data } = await apiClient.patch(`/inventory/${id}`, payload);
  return data;
};

export const deleteInventoryItemRequest = async (id) => {
  const { data } = await apiClient.delete(`/inventory/${id}`);
  return data;
};