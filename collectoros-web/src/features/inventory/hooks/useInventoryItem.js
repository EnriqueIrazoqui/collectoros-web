import { useQuery } from "@tanstack/react-query";
import { getInventoryItemRequest } from "../api/inventoryApi";

export const useInventoryItem = (itemId, enabled = true) => {
  return useQuery({
    queryKey: ["inventory-item", itemId],
    queryFn: () => getInventoryItemRequest(itemId),
    enabled: Boolean(itemId) && enabled,
    refetchOnWindowFocus: false,
  });
};