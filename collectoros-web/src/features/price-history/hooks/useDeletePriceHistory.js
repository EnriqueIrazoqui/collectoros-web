import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePriceHistoryEntry } from "../api/priceHistoryApi";

export const useDeletePriceHistory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ priceHistoryId }) => deletePriceHistoryEntry(priceHistoryId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["priceHistory", variables.itemId],
      });
    },
  });
};