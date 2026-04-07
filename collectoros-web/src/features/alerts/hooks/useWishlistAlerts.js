import { useQuery } from "@tanstack/react-query";
import { getWishlistAlertsRequest } from "../api/wishlistAlertsApi";

export const useWishlistAlerts = () => {
  return useQuery({
    queryKey: ["wishlist-alerts"],
    queryFn: getWishlistAlertsRequest,
  });
};