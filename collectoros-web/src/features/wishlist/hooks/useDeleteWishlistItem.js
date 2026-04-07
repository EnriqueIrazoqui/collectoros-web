import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteWishlistItemRequest } from "../api/wishlistApi";

export const useDeleteWishlistItem = () => {
  const queryClient = useQueryClient();

  const invalidateWishlistEcosystem = () => {
    queryClient.invalidateQueries({ queryKey: ["wishlist-list"] });
    queryClient.invalidateQueries({ queryKey: ["wishlist-alerts"] });
    queryClient.invalidateQueries({ queryKey: ["wishlist-alerts-unread-count"] });
  };

  return useMutation({
    mutationFn: deleteWishlistItemRequest,
    onSuccess: async () => {
      invalidateWishlistEcosystem();
    },
  });
};