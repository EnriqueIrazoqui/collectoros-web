import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteInventoryItemRequest } from "../api/inventoryApi";

export const useDeleteInventoryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteInventoryItemRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory-list"] });
    },
  });
};