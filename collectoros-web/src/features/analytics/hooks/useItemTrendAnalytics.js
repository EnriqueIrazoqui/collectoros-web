import { useQuery } from "@tanstack/react-query";
import { getItemTrendAnalyticsRequest } from "../api/analyticsApi";

export const useItemTrendAnalytics = (itemId, enabled = true) => {
  return useQuery({
    queryKey: ["analytics-item-trend", itemId],
    queryFn: () => getItemTrendAnalyticsRequest(itemId),
    enabled: Boolean(itemId) && enabled,
    refetchOnWindowFocus: false,
  });
};