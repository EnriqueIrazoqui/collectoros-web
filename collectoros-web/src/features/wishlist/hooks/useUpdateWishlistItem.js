import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateWishlistItemRequest } from "../api/wishlistApi";

export const useUpdateWishlistItem = () => {
  const queryClient = useQueryClient();

  const invalidateWishlistEcosystem = () => {
    queryClient.invalidateQueries({ queryKey: ["wishlist-list"] });
    queryClient.invalidateQueries({ queryKey: ["wishlist-alerts"] });
    queryClient.invalidateQueries({
      queryKey: ["wishlist-alerts-unread-count"],
    });
  };

  return useMutation({
    mutationFn: updateWishlistItemRequest,
    onSuccess: async (_, variables) => {
      invalidateWishlistEcosystem();

      const payload = variables?.payload || {};
      const purchaseUrlChanged = Object.prototype.hasOwnProperty.call(
        payload,
        "purchaseUrl",
      );

      if (purchaseUrlChanged) {
        setTimeout(() => {
          invalidateWishlistEcosystem();
        }, 2000);

        setTimeout(() => {
          invalidateWishlistEcosystem();
        }, 5000);
      }
    },
  });
};