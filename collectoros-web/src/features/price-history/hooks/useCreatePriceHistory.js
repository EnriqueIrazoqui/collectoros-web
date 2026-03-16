import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPriceHistoryEntry } from "../api/priceHistoryApi";

export const useCreatePriceHistory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPriceHistoryEntry,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["priceHistory", variables.itemId],
      });
    },
  });
};