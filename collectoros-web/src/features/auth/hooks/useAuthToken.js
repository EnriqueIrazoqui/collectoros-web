import { useSyncExternalStore } from "react";
import { hasAccessToken, subscribeAuth } from "../utils/authStorage";

export const useAuthToken = () => {
  const tokenExists = useSyncExternalStore(
    subscribeAuth,
    hasAccessToken,
    () => false,
  );

  return tokenExists;
};