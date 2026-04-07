import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  IconButton,
  LinearProgress,
  Snackbar,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const SUCCESS_DURATION = 5000;
const TICK_MS = 100;

const AppFeedbackSnackbar = ({
  open,
  severity = "success",
  title = "",
  message = "",
  onClose,
}) => {
  const isTimedFeedback =
    severity === "success" || severity === "info" || severity === "warning";
  const autoHideDuration = isTimedFeedback ? SUCCESS_DURATION : null;

  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!open || !isTimedFeedback) {
      setProgress(100);
      return;
    }

    setProgress(100);

    const totalTicks = SUCCESS_DURATION / TICK_MS;
    const decrement = 100 / totalTicks;

    const intervalId = window.setInterval(() => {
      setProgress((prev) => {
        const next = prev - decrement;
        return next <= 0 ? 0 : next;
      });
    }, TICK_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [open, isTimedFeedback]);

  useEffect(() => {
    if (!open || !isTimedFeedback) return;
    if (progress > 0) return;

    onClose?.();
  }, [open, isTimedFeedback, progress, onClose]);

  const handleClose = (_, reason) => {
    if (reason === "clickaway") return;
    onClose?.();
  };

  const alertAction = useMemo(
    () => (
      <IconButton size="small" color="inherit" onClick={() => onClose?.()}>
        <CloseIcon fontSize="small" />
      </IconButton>
    ),
    [onClose],
  );

  return (
    <Snackbar
      open={open}
      onClose={handleClose}
      autoHideDuration={autoHideDuration || undefined}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      sx={{
        mt: 9,
        mr: 2,
      }}
    >
      <Alert
        severity={severity}
        variant="filled"
        onClose={handleClose}
        action={alertAction}
        sx={{
          width: 420,
          maxWidth: "calc(100vw - 32px)",
          alignItems: "flex-start",
          boxShadow: 6,
          p: 0,
          overflow: "hidden",
        }}
      >
        <Box sx={{ px: 2, pt: 1.5, pb: isTimedFeedback ? 1 : 1.5 }}>
          {title ? (
            <Typography variant="subtitle2" fontWeight={700} mb={0.5}>
              {title}
            </Typography>
          ) : null}

          <Typography variant="body2">{message}</Typography>
        </Box>

        {isTimedFeedback ? (
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 4,
              borderRadius: 0,
              "& .MuiLinearProgress-bar": {
                transition: `transform ${TICK_MS}ms linear`,
              },
            }}
          />
        ) : null}
      </Alert>
    </Snackbar>
  );
};

export default AppFeedbackSnackbar;