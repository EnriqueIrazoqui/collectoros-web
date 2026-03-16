import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createWishlistItemRequest } from "../api/wishlistApi";

export const useCreateWishlistItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createWishlistItemRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist-list"] });
    },
  });
};