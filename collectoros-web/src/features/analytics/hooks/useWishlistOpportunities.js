import { useQuery } from "@tanstack/react-query";
import { getWishlistOpportunities } from "../api/alertsApi";

export const useWishlistOpportunities = () => {
  return useQuery({
    queryKey: ["wishlist-opportunities"],
    queryFn: getWishlistOpportunities,
  });
};

export default useWishlistOpportunities;
