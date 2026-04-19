import apiClient from "../../../services/apiClient";

async function getWhatsNewAdminListRequest() {
  const response = await apiClient.get("/whats-new/admin/all");
  return response.data;
}

async function getWhatsNewListRequest() {
  const response = await apiClient.get("/whats-new");
  return response.data;
}

async function getLatestWhatsNewRequest() {
  const response = await apiClient.get("/whats-new/latest");
  return response.data;
}

async function markWhatsNewAsViewedRequest(whatsNewId) {
  const response = await apiClient.post(`/whats-new/${whatsNewId}/mark-viewed`);
  return response.data;
}

async function createWhatsNewRequest(payload) {
  const response = await apiClient.post("/whats-new", payload);
  return response.data;
}

async function updateWhatsNewRequest({ whatsNewId, payload }) {
  const response = await apiClient.patch(`/whats-new/${whatsNewId}`, payload);
  return response.data;
}

async function publishWhatsNewRequest(whatsNewId) {
  const response = await apiClient.patch(`/whats-new/${whatsNewId}/publish`);
  return response.data;
}

async function deleteWhatsNewRequest(whatsNewId) {
  const response = await apiClient.delete(`/whats-new/${whatsNewId}`);
  return response.data;
}

export {
  getWhatsNewAdminListRequest,
  getWhatsNewListRequest,
  getLatestWhatsNewRequest,
  markWhatsNewAsViewedRequest,
  createWhatsNewRequest,
  updateWhatsNewRequest,
  publishWhatsNewRequest,
  deleteWhatsNewRequest,
};