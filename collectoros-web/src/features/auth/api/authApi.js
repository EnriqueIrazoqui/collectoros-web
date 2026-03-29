import apiClient from "../../../services/apiClient";

async function loginRequest(credentials) {
  const { data } = await apiClient.post("/auth/login", credentials);
  return data;
}

async function refreshRequest(refreshToken) {
  const { data } = await apiClient.post("/auth/refresh", {
    refreshToken,
  });
  return data;
}

async function logoutRequest() {
  const { data } = await apiClient.post("/auth/logout");
  return data;
}

async function getCurrentUserRequest() {
  const { data } = await apiClient.get("/auth/me");
  return data;
}

async function getMicrosoftAuthUrlRequest() {
  const { data } = await apiClient.get("/auth/microsoft/login");
  return data;
}

async function markWelcomeSeenRequest() {
  const { data } = await apiClient.patch("/auth/me/welcome/seen");
  return data;
}

export {
  loginRequest,
  refreshRequest,
  logoutRequest,
  getCurrentUserRequest,
  getMicrosoftAuthUrlRequest,
  markWelcomeSeenRequest,
};