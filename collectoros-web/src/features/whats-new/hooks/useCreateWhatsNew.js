import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createWhatsNewRequest } from "../api/whatsNewApi";

function useCreateWhatsNew() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createWhatsNewRequest,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["whats-new-admin-list"],
      });
      await queryClient.invalidateQueries({ queryKey: ["whats-new-list"] });
      await queryClient.invalidateQueries({ queryKey: ["whats-new-latest"] });
    },
  });
}

export { useCreateWhatsNew };
