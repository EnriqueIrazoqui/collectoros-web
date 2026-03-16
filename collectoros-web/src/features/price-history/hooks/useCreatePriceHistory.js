import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPriceHistoryEntry } from "../api/priceHistoryApi";

const useCreatePriceHistory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPriceHistoryEntry,
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

export default useCreatePriceHistory;
