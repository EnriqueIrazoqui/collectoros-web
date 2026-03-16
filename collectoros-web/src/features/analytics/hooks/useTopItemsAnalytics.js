import { useQuery } from "@tanstack/react-query";
import { getTopItemsAnalyticsRequest } from "../api/analyticsApi";

export const useTopItemsAnalytics = () => {
  return useQuery({
    queryKey: ["analytics-top-items"],
    queryFn: getTopItemsAnalyticsRequest,
    refetchOnWindowFocus: false,
  });
};