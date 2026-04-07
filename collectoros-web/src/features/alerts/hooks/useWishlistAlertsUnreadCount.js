import { useQuery } from "@tanstack/react-query";
import { getWishlistAlertsUnreadCountRequest } from "../api/wishlistAlertsApi";

export const useWishlistAlertsUnreadCount = () => {
  return useQuery({
    queryKey: ["wishlist-alerts-unread-count"],
    queryFn: getWishlistAlertsUnreadCountRequest,
    refetchInterval: 60000,
  });
};