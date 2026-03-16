import { useQuery } from "@tanstack/react-query";
import { getPriceHistoryByItemId } from "../api/priceHistoryApi";

const usePriceHistory = (itemId, enabled = true) => {
  return useQuery({
    queryKey: ["priceHistory", itemId],
    queryFn: () => getPriceHistoryByItemId(itemId),
    enabled: Boolean(itemId) && enabled,
    refetchOnWindowFocus: false,
  });
};

export default usePriceHistory;
