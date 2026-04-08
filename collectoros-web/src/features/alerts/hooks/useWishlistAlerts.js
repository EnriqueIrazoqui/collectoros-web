import { useQuery } from "@tanstack/react-query";
import { getWishlistAlertsRequest } from "../api/wishlistAlertsApi";

export const useWishlistAlerts = ({ pollingEnabled = false } = {}) => {
  return useQuery({
    queryKey: ["wishlist-alerts"],
    queryFn: getWishlistAlertsRequest,
    refetchInterval: pollingEnabled ? 3000 : false,
    refetchOnWindowFocus: false,
  });
};