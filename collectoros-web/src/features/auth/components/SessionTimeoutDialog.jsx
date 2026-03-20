import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";

const SessionTimeoutDialog = ({
  open,
  countdown = 60,
  onContinue,
  onLogout,
  loading = false,
}) => {
  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason === "backdropClick" || reason === "escapeKeyDown") {
          return;
        }
      }}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          borderRadius: 4,
        },
      }}
    >
      <DialogTitle>Session expiring</DialogTitle>

      <DialogContent>
        <Stack spacing={1.5}>
          <Typography variant="body2" color="text.secondary">
            You have been inactive for a while.
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Do you want to continue using CollectorOS?
          </Typography>

          <Typography variant="subtitle2" fontWeight={700}>
            Automatic logout in {countdown}s
          </Typography>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onLogout} color="inherit" disabled={loading}>
          Logout
        </Button>

        <Button
          variant="contained"
          onClick={onContinue}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Continue session"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SessionTimeoutDialog;