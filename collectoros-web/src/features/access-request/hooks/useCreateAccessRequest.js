import { useMutation } from "@tanstack/react-query";
import { createAccessRequest } from "../api/accessRequestApi";

const useCreateAccessRequest = () => {
  return useMutation({
    mutationFn: createAccessRequest,
  });
};

export {
  useCreateAccessRequest,
};