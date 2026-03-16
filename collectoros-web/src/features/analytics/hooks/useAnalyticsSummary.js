import { useQuery } from "@tanstack/react-query";
import { getAnalyticsSummaryRequest } from "../api/analyticsApi";

export const useAnalyticsSummary = () => {
  return useQuery({
    queryKey: ["analytics-summary"],
    queryFn: getAnalyticsSummaryRequest,
    refetchOnWindowFocus: false,
  });
};