import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateWishlistItemRequest } from "../api/wishlistApi";

export const useUpdateWishlistItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateWishlistItemRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist-list"] });
    },
  });
};