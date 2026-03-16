import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePriceHistoryEntry } from "../api/priceHistoryApi";

const useDeletePriceHistory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ priceHistoryId }) => deletePriceHistoryEntry(priceHistoryId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["priceHistory", variables.itemId],
      });

      queryClient.invalidateQueries({
        queryKey: ["inventory-list"],
      });

      queryClient.invalidateQueries({
        queryKey: ["inventory-item", variables.itemId],
      });
    },
  });
};

export default useDeletePriceHistory;
