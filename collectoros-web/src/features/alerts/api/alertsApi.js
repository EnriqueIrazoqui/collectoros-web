import apiClient from "../../../services/apiClient";

export const getWishlistOpportunities = async () => {
  const response = await apiClient.get("/alerts/wishlist-opportunities");
  return response.data;
};