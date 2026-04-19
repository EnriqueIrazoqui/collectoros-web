import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateWhatsNewRequest } from "../api/whatsNewApi";

function useUpdateWhatsNew() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateWhatsNewRequest,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["whats-new-admin-list"] });
      await queryClient.invalidateQueries({ queryKey: ["whats-new-list"] });
      await queryClient.invalidateQueries({ queryKey: ["whats-new-latest"] });
    },
  });
}

export { useUpdateWhatsNew };