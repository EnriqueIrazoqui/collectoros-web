import { useMutation, useQueryClient } from "@tanstack/react-query";
import { publishWhatsNewRequest } from "../api/whatsNewApi";

function usePublishWhatsNew() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: publishWhatsNewRequest,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["whats-new-admin-list"],
      });
      await queryClient.invalidateQueries({ queryKey: ["whats-new-list"] });
      await queryClient.invalidateQueries({ queryKey: ["whats-new-latest"] });
    },
  });
}

export { usePublishWhatsNew };
