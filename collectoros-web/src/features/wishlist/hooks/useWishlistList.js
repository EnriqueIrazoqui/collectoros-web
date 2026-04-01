import { useQuery } from "@tanstack/react-query";
import { getWishlistListRequest } from "../api/wishlistApi";

export const useWishlistList = ({
  page = 1,
  limit = 10,
  search = "",
  category = "all",
  priority = "all",
  sortBy = "createdAt-desc",
}) => {
  return useQuery({
    queryKey: [
      "wishlist-list",
      page,
      limit,
      search,
      category,
      priority,
      sortBy,
    ],
    queryFn: () =>
      getWishlistListRequest({
        page,
        limit,
        search,
        category,
        priority,
        sortBy,
      }),
    placeholderData: (previousData) => previousData,
    refetchOnWindowFocus: false,
  });
};
