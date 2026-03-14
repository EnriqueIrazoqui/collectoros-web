import apiClient from "../../../services/apiClient";

export const loginRequest = async (credentials) => {
  const { data } = await apiClient.post("/auth/login", credentials);
  return data;
};

export const getCurrentUserRequest = async () => {
  const { data } = await apiClient.get("/auth/me");
  return data;
};