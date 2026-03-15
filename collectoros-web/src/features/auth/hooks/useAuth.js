import { hasAccessToken } from "../utils/authStorage";
import { useCurrentUser } from "./useCurrentUser";

export const useAuth = () => {
  const tokenExists = hasAccessToken();
  const currentUserQuery = useCurrentUser();

  const user = currentUserQuery.data?.data || null;

  return {
    user,
    tokenExists,
    isLoading: tokenExists ? currentUserQuery.isLoading : false,
    isAuthenticated: tokenExists && !!user,
    error: currentUserQuery.error,
  };
};