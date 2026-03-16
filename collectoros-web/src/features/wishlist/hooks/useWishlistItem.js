import { useQuery } from "@tanstack/react-query";
import { getWishlistItemRequest } from "../api/wishlistApi";

export const useWishlistItem = (itemId, enabled = true) => {
  return useQuery({
    queryKey: ["wishlist-item", itemId],
    queryFn: () => getWishlistItemRequest(itemId),
    enabled: Boolean(itemId) && enabled,
    refetchOnWindowFocus: false,
  });
};