import { useQuery } from "@tanstack/react-query";
import { getCurrentUserRequest } from "../api/authApi";
import { hasAccessToken } from "../utils/authStorage";

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: getCurrentUserRequest,
    enabled: hasAccessToken(),
    retry: false,
    refetchOnWindowFocus: false,
  });
};