import { useQuery } from "@tanstack/react-query";
import { getPortfolioAllocation } from "../api/analyticsApi";

const usePortfolioAllocation = () => {
  return useQuery({
    queryKey: ["portfolio-allocation"],
    queryFn: getPortfolioAllocation,
    refetchOnWindowFocus: false,
  });
};

export default usePortfolioAllocation;