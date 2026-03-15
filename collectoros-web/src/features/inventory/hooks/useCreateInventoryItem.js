import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createInventoryItemRequest } from "../api/inventoryApi";

export const useCreateInventoryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createInventoryItemRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory-list"] });
    },
  });
};