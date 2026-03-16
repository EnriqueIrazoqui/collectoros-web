import apiClient from "../../../services/apiClient";

export const getWishlistListRequest = async () => {
  const { data } = await apiClient.get("/wishlist");
  return data;
};

export const getWishlistItemRequest = async (id) => {
  const { data } = await apiClient.get(`/wishlist/${id}`);
  return data;
};

export const createWishlistItemRequest = async (payload) => {
  const { data } = await apiClient.post("/wishlist", payload);
  return data;
};

export const updateWishlistItemRequest = async ({ id, payload }) => {
  const { data } = await apiClient.patch(`/wishlist/${id}`, payload);
  return data;
};

export const deleteWishlistItemRequest = async (id) => {
  const { data } = await apiClient.delete(`/wishlist/${id}`);
  return data;
};