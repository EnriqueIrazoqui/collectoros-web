import { useQuery } from "@tanstack/react-query";
import { getTradePerformance } from "../api/analyticsApi";

const useTradePerformance = () => {
  return useQuery({
    queryKey: ["trade-performance"],
    queryFn: getTradePerformance,
    refetchOnWindowFocus: false,
  });
};

export default useTradePerformance;