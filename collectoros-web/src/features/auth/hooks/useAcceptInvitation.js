import { useMutation } from "@tanstack/react-query";
import { acceptInvitationRequest } from "../api/authApi";

const useAcceptInvitation = () => {
  return useMutation({
    mutationFn: acceptInvitationRequest,
  });
};

export {
  useAcceptInvitation,
};