import { hasAccessToken } from "../utils/authStorage";

export const useAuth = () => {
  const isAuthenticated = hasAccessToken();

  return {
    isAuthenticated,
  };
};