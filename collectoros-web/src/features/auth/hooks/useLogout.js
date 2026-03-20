import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutRequest } from "../api/authApi";
import { clearAuthTokens } from "../utils/authStorage";

function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutRequest,
    onSettled: () => {
      clearAuthTokens();
      queryClient.clear();
    },
  });
}

export { useLogout };