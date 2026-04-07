import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createWishlistItemRequest } from "../api/wishlistApi";

export const useCreateWishlistItem = () => {
  const queryClient = useQueryClient();

  const invalidateWishlistEcosystem = () => {
    queryClient.invalidateQueries({ queryKey: ["wishlist-list"] });
    queryClient.invalidateQueries({ queryKey: ["wishlist-alerts"] });
    queryClient.invalidateQueries({ queryKey: ["wishlist-alerts-unread-count"] });
  };

  return useMutation({
    mutationFn: createWishlistItemRequest,
    onSuccess: async () => {
      invalidateWishlistEcosystem();

      setTimeout(() => {
        invalidateWishlistEcosystem();
      }, 2000);

      setTimeout(() => {
        invalidateWishlistEcosystem();
      }, 5000);
    },
  });
};