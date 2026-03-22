import apiClient from "../../../services/apiClient";

async function getAdminUsersRequest () {
  const response = await apiClient.get("/admin/users");
  return response.data;
};

async function createAdminUserRequest (payload) {
  const response = await apiClient.post("/admin/users", payload);
  return response.data;
};

async function updateAdminUserRoleRequest  (userId, payload) {
  const response = await apiClient.patch(`/admin/users/${userId}/role`, payload);
  return response.data;
};

async function updateAdminUserStatusRequest  (userId, payload)  {
  const response = await apiClient.patch(`/admin/users/${userId}/status`, payload);
  return response.data;
};


export {
  getAdminUsersRequest,
  createAdminUserRequest,
  updateAdminUserRoleRequest,
  updateAdminUserStatusRequest,
};