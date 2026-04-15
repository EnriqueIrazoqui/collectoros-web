import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteWhatsNewRequest } from "../api/whatsNewApi";

function useDeleteWhatsNew() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteWhatsNewRequest,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["whats-new-admin-list"] });
      await queryClient.invalidateQueries({ queryKey: ["whats-new-list"] });
      await queryClient.invalidateQueries({ queryKey: ["whats-new-latest"] });
    },
  });
}

export { useDeleteWhatsNew };