import { useQuery } from "@tanstack/react-query";
import { getInventoryMovers } from "../api/alertsApi";

function useInventoryMovers() {
  return useQuery({
    queryKey: ["inventory-movers"],
    queryFn: getInventoryMovers,
    refetchOnWindowFocus: false,
  });
}

export default useInventoryMovers;