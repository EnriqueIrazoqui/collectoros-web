import { useQuery } from "@tanstack/react-query";
import { getPortfolioAnalyticsRequest } from "../api/analyticsApi";

export const usePortfolioAnalytics = () => {
  return useQuery({
    queryKey: ["analytics-portfolio"],
    queryFn: getPortfolioAnalyticsRequest,
    refetchOnWindowFocus: false,
  });
};