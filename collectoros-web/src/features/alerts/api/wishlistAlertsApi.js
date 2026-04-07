import apiClient from "../../../services/apiClient";

async function getWishlistAlertsRequest() {
  const { data } = await apiClient.get("/alerts/wishlist");
  return data;
}

async function getWishlistAlertsUnreadCountRequest() {
  const { data } = await apiClient.get("/alerts/wishlist/unread-count");
  return data;
}

async function markWishlistAlertAsReadRequest(id) {
  const { data } = await apiClient.patch(`/alerts/wishlist/${id}/read`);
  return data;
}

async function markAllWishlistAlertsAsReadRequest() {
  const { data } = await apiClient.patch("/alerts/wishlist/read-all");
  return data;
}

export {
  getWishlistAlertsRequest,
  getWishlistAlertsUnreadCountRequest,
  markWishlistAlertAsReadRequest,
  markAllWishlistAlertsAsReadRequest,
};