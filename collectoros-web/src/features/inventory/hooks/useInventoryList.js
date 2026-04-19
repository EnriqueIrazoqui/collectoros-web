import { useQuery } from "@tanstack/react-query";
import { getInventoryListRequest } from "../api/inventoryApi";

export const useInventoryList = (
  {
    page = 1,
    limit = 10,
    search = "",
    category = "all",
    sortBy = "purchaseDate-desc",
  },
  options = {},
) => {
  return useQuery({
    queryKey: ["inventory-list", page, limit, search, category, sortBy],
    queryFn: () =>
      getInventoryListRequest({
        page,
        limit,
        search,
        category,
        sortBy,
      }),
    placeholderData: (previousData) => previousData,
    refetchOnWindowFocus: false,
    refetchInterval: options.refetchInterval || false,
  });
};