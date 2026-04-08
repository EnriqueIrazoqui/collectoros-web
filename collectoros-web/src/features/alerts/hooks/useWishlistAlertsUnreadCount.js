import { useQuery } from "@tanstack/react-query";
import { getWishlistAlertsUnreadCountRequest } from "../api/wishlistAlertsApi";

export const useWishlistAlertsUnreadCount = ({ pollingEnabled = false } = {}) => {
  return useQuery({
    queryKey: ["wishlist-alerts-unread-count"],
    queryFn: getWishlistAlertsUnreadCountRequest,
    refetchInterval: pollingEnabled ? 3000 : 60000,
    refetchOnWindowFocus: false,
  });
};