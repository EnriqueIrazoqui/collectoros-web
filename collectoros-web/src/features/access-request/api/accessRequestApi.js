import apiClient from "../../../services/apiClient";

const createAccessRequest = async (payload) => {
  const { data } = await apiClient.post("/access-requests", payload);
  return data;
};

export {
  createAccessRequest,
};