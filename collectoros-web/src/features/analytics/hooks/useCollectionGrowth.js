import { useQuery } from "@tanstack/react-query";
import { getCollectionGrowth } from "../api/analyticsApi";

const useCollectionGrowth = () => {
  return useQuery({
    queryKey: ["collection-growth"],
    queryFn: getCollectionGrowth,
    refetchOnWindowFocus: false,
  });
};

export default useCollectionGrowth;