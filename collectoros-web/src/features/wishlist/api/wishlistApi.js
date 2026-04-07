import apiClient from "../../../services/apiClient";

const getWishlistListRequest = async ({
  page = 1,
  limit = 10,
  search = "",
  category = "all",
  priority = "all",
  status = "all",
  sortBy = "createdAt-desc",
}) => {
  const { data } = await apiClient.get("/wishlist", {
    params: {
      page,
      limit,
      search,
      category,
      priority,
      status,
      sortBy,
    },
  });

  return data;
};

async function getWishlistItemRequest(id) {
  const { data } = await apiClient.get(`/wishlist/${id}`);
  return data;
}

async function createWishlistItemRequest(payload) {
  const { data } = await apiClient.post("/wishlist", payload);
  return data;
}

async function updateWishlistItemRequest({ id, payload }) {
  const { data } = await apiClient.patch(`/wishlist/${id}`, payload);
  return data;
}

async function deleteWishlistItemRequest(id) {
  const { data } = await apiClient.delete(`/wishlist/${id}`);
  return data;
}

export {
  getWishlistListRequest,
  getWishlistItemRequest,
  createWishlistItemRequest,
  updateWishlistItemRequest,
  deleteWishlistItemRequest,
};
