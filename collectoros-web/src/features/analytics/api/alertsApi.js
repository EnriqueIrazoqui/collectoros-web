import apiClient from "../../../services/apiClient";

async function getInventoryMovers() {
  const { data } = await apiClient.get("/alerts/inventory-movers");
  return data;
}

export { getInventoryMovers };