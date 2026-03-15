import apiClient from "../../../services/apiClient";

export const getDashboardSummary = async () => {
  const { data } = await apiClient.get("/dashboard");
  return data;
};