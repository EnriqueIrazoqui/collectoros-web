import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markAllWishlistAlertsAsReadRequest } from "../api/wishlistAlertsApi";

export const useMarkAllWishlistAlertsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllWishlistAlertsAsReadRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist-alerts"] });
      queryClient.invalidateQueries({ queryKey: ["wishlist-alerts-unread-count"] });
    },
  });
};