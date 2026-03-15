import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateInventoryItemRequest } from "../api/inventoryApi";

export const useUpdateInventoryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateInventoryItemRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory-list"] });
    },
  });
};