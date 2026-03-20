import { useQuery } from "@tanstack/react-query";
import { getInventoryItemImages } from "../api/inventoryApi";

export const useInventoryItemImages = (inventoryItemId, enabled = true) => {
  return useQuery({
    queryKey: ["inventory-item-images", inventoryItemId],
    queryFn: () => getInventoryItemImages(inventoryItemId),
    enabled: enabled && !!inventoryItemId,
  });
};