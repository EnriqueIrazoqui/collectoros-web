import { useQuery } from "@tanstack/react-query";
import { getWishlistOpportunities } from "../api/alertsApi";

const useWishlistOpportunities = () => {
  return useQuery({
    queryKey: ["wishlist-opportunities"],
    queryFn: getWishlistOpportunities,
    refetchOnWindowFocus: false,
  });
};

export default useWishlistOpportunities;