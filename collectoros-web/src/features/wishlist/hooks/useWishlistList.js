import { useQuery } from "@tanstack/react-query";
import { getWishlistListRequest } from "../api/wishlistApi";

export const useWishlistList = () => {
  return useQuery({
    queryKey: ["wishlist-list"],
    queryFn: getWishlistListRequest,
    refetchOnWindowFocus: false,
  });
};