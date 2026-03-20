import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import SessionTimeoutDialog from "./SessionTimeoutDialog";
import { refreshRequest, logoutRequest } from "../api/authApi";
import {
  clearAuthTokens,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from "../utils/authStorage";

const IDLE_TIMEOUT_MS = 25 * 60 * 1000;
const WARNING_COUNTDOWN_SECONDS = 60;

const SessionManager = () => {
  const navigate = useNavigate();

  const idleTimerRef = useRef(null);
  const countdownTimerRef = useRef(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [countdown, setCountdown] = useState(WARNING_COUNTDOWN_SECONDS);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const clearTimers = useCallback(() => {
    if (idleTimerRef.current) {
      window.clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }

    if (countdownTimerRef.current) {
      window.clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
  }, []);

  const forceLogout = useCallback(async () => {
    try {
      await logoutRequest();
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      clearTimers();
      clearAuthTokens();
      setDialogOpen(false);
      navigate("/login", { replace: true });
    }
  }, [clearTimers, navigate]);

  const startCountdown = useCallback(() => {
    setCountdown(WARNING_COUNTDOWN_SECONDS);

    countdownTimerRef.current = window.setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          window.clearInterval(countdownTimerRef.current);
          countdownTimerRef.current = null;
          forceLogout();
          return 0;
        }

        return prev - 1;
      });
    }, 1000);
  }, [forceLogout]);

  const openWarningDialog = useCallback(() => {
    setDialogOpen(true);
    startCountdown();
  }, [startCountdown]);

  const resetIdleTimer = useCallback(() => {
    clearTimers();

    if (dialogOpen) return;

    idleTimerRef.current = window.setTimeout(() => {
      openWarningDialog();
    }, IDLE_TIMEOUT_MS);
  }, [clearTimers, dialogOpen, openWarningDialog]);

  const handleContinueSession = useCallback(async () => {
    try {
      setIsRefreshing(true);

      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        await forceLogout();
        return;
      }

      const response = await refreshRequest(refreshToken);

      const newAccessToken = response?.data?.accessToken;
      const newRefreshToken = response?.data?.refreshToken;

      if (!newAccessToken || !newRefreshToken) {
        await forceLogout();
        return;
      }

      setAccessToken(newAccessToken);
      setRefreshToken(newRefreshToken);

      setDialogOpen(false);
      setCountdown(WARNING_COUNTDOWN_SECONDS);
      setIsRefreshing(false);

      resetIdleTimer();
    } catch (error) {
      console.error("Session refresh failed:", error);
      setIsRefreshing(false);
      await forceLogout();
    }
  }, [forceLogout, resetIdleTimer]);

  useEffect(() => {
    const events = ["mousemove", "keydown", "click", "scroll"];

    const handleUserActivity = () => {
      if (!dialogOpen) {
        resetIdleTimer();
      }
    };

    events.forEach((eventName) => {
      window.addEventListener(eventName, handleUserActivity);
    });

    resetIdleTimer();

    return () => {
      events.forEach((eventName) => {
        window.removeEventListener(eventName, handleUserActivity);
      });

      clearTimers();
    };
  }, [clearTimers, dialogOpen, resetIdleTimer]);

  return (
    <SessionTimeoutDialog
      open={dialogOpen}
      countdown={countdown}
      onContinue={handleContinueSession}
      onLogout={forceLogout}
      loading={isRefreshing}
    />
  );
};

export default SessionManager;