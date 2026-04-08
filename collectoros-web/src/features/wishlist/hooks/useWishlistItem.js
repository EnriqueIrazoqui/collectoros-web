import { useQuery } from "@tanstack/react-query";
import { getWishlistItemRequest } from "../api/wishlistApi";

export const useWishlistItem = (
  itemId,
  enabled = true,
  pollingEnabled = false,
) => {
  return useQuery({
    queryKey: ["wishlist-item", itemId],
    queryFn: () => getWishlistItemRequest(itemId),
    enabled: Boolean(itemId) && enabled,
    refetchOnWindowFocus: false,
    refetchInterval: pollingEnabled ? 3000 : false,
  });
};