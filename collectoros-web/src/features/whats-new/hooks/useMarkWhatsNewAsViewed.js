import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markWhatsNewAsViewedRequest } from "../api/whatsNewApi";

function useMarkWhatsNewAsViewed() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markWhatsNewAsViewedRequest,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["whats-new-list"] });
      await queryClient.invalidateQueries({ queryKey: ["whats-new-latest"] });
    },
  });
}

export { useMarkWhatsNewAsViewed };