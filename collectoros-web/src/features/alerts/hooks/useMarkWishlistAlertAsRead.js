import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markWishlistAlertAsReadRequest } from "../api/wishlistAlertsApi";

export const useMarkWishlistAlertAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markWishlistAlertAsReadRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist-alerts"] });
      queryClient.invalidateQueries({ queryKey: ["wishlist-alerts-unread-count"] });
    },
  });
};