import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getWishlistListRequest } from "../api/wishlistApi";

export const useWishlistList = ({
  page = 1,
  limit = 10,
  search = "",
  category = "all",
  priority = "all",
  status = "all",
  sortBy = "createdAt-desc",
  pollingEnabled = false,
}) => {
  return useQuery({
    queryKey: [
      "wishlist-list",
      page,
      limit,
      search,
      category,
      priority,
      status,
      sortBy,
    ],
    queryFn: () =>
      getWishlistListRequest({
        page,
        limit,
        search,
        category,
        priority,
        status,
        sortBy,
      }),
    placeholderData: keepPreviousData,
    refetchInterval: pollingEnabled ? 3000 : false,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false,
  });
};