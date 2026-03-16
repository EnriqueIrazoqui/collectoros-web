import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteWishlistItemRequest } from "../api/wishlistApi";

export const useDeleteWishlistItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteWishlistItemRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist-list"] });
    },
  });
};