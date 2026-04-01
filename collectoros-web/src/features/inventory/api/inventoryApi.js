import apiClient from "../../../services/apiClient";

const getInventoryListRequest = async ({
  page = 1,
  limit = 10,
  search = "",
  category = "all",
  sortBy = "purchaseDate-desc",
}) => {
  const { data } = await apiClient.get("/inventory", {
    params: {
      page,
      limit,
      search,
      category,
      sortBy,
    },
  });

  return data;
};

const getInventoryItemRequest = async (id) => {
  const { data } = await apiClient.get(`/inventory/${id}`);
  return data;
};

const getInventoryItemImages = async (inventoryItemId) => {
  const { data } = await apiClient.get(`/inventory/${inventoryItemId}/images`);
  return data;
};

const getInventoryImageBlob = async (imageId) => {
  const { data } = await apiClient.get(`/inventory/images/${imageId}/content`, {
    responseType: "blob",
  });

  return data;
};

const createInventoryItemRequest = async (payload) => {
  const { data } = await apiClient.post("/inventory", payload);
  return data;
};

const updateInventoryItemRequest = async ({ id, payload }) => {
  const { data } = await apiClient.patch(`/inventory/${id}`, payload);
  return data;
};

const deleteInventoryItemRequest = async (id) => {
  const { data } = await apiClient.delete(`/inventory/${id}`);
  return data;
};

export {
  getInventoryListRequest,
  getInventoryItemRequest,
  getInventoryItemImages,
  getInventoryImageBlob,
  createInventoryItemRequest,
  updateInventoryItemRequest,
  deleteInventoryItemRequest,
};
