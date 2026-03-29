import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markWelcomeSeenRequest } from "../api/authApi";

export const useMarkWelcomeSeen = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markWelcomeSeenRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
    },
  });
};