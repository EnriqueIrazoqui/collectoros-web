import { useQuery } from "@tanstack/react-query";
import { getPriceHistoryByItemId } from "../api/priceHistoryApi";

export const usePriceHistory = (itemId, enabled = true) => {
  return useQuery({
    queryKey: ["priceHistory", itemId],
    queryFn: () => getPriceHistoryByItemId(itemId),
    enabled: !!itemId && enabled,
  });
};