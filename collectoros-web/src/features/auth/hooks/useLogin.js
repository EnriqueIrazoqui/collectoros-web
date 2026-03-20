import { useMutation } from "@tanstack/react-query";
import { loginRequest } from "../api/authApi";
import {
  setAccessToken,
  setRefreshToken,
} from "../utils/authStorage";

function useLogin() {
  return useMutation({
    mutationFn: loginRequest,
    onSuccess: (response) => {
      const accessToken = response?.data?.accessToken;
      const refreshToken = response?.data?.refreshToken;

      if (accessToken) {
        setAccessToken(accessToken);
      }

      if (refreshToken) {
        setRefreshToken(refreshToken);
      }
    },
  });
}

export { useLogin };