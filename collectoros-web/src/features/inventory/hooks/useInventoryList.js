import { useQuery } from "@tanstack/react-query";
import { getInventoryListRequest } from "../api/inventoryApi";

export const useInventoryList = () => {
  return useQuery({
    queryKey: ["inventory-list"],
    queryFn: getInventoryListRequest,
    refetchOnWindowFocus: false,
  });
};