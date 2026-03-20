import apiClient from "../../../services/apiClient";

async function getInventoryMovers() {
  const { data } = await apiClient.get("/alerts/inventory-movers");
  return data;
}

async function getWishlistOpportunities() {
  const response = await apiClient.get("/alerts/wishlist-opportunities");
  return response.data;
}

export { getInventoryMovers, getWishlistOpportunities };
