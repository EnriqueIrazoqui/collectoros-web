import { useMutation } from "@tanstack/react-query";
import { getMicrosoftAuthUrlRequest } from "../api/authApi";

export const useConnectMicrosoft = () => {
  return useMutation({
    mutationFn: getMicrosoftAuthUrlRequest,
  });
};