import { useMutation } from "@tanstack/react-query";
import { loginRequest } from "../api/authApi";
import { setAccessToken } from "../utils/authStorage";

export const useLogin = () => {
  return useMutation({
    mutationFn: loginRequest,
    onSuccess: (response) => {
      const token = response?.data?.accessToken;

      if (token) {
        setAccessToken(token);
      }
    },
  });
};
