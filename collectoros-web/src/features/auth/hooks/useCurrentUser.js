import { useQuery } from "@tanstack/react-query";
import { getCurrentUserRequest } from "../api/authApi";
import { useAuthToken } from "./useAuthToken";

export const useCurrentUser = () => {
  const tokenExists = useAuthToken();

  return useQuery({
    queryKey: ["current-user"],
    queryFn: getCurrentUserRequest,
    enabled: tokenExists,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, 
  });
};