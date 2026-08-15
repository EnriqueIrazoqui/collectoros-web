import apiClient from "../../../services/apiClient";

async function getAdminAccessRequestsRequest() {
  const { data } = await apiClient.get("/access-requests");
  return data;
}

async function updateAccessRequestStatusRequest(requestId, status) {
  const { data } = await apiClient.patch(
    `/access-requests/${requestId}/status`,
    {
      status,
    },
  );

  return data;
}

export {
  getAdminAccessRequestsRequest,
  updateAccessRequestStatusRequest,
};