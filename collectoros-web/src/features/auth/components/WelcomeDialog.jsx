import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";

const WelcomeDialog = ({
  open,
  onStartNow,
  onViewGuide,
  isSubmitting = false,
}) => {
  const handleDialogClose = (_, reason) => {
    if (reason === "backdropClick" || reason === "escapeKeyDown") {
      return;
    }
  };

  return (
    <Dialog open={open} onClose={handleDialogClose} fullWidth maxWidth="sm">
      <DialogTitle>Welcome to CollectorOS</DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2}>
          <Typography variant="body1">
            CollectorOS helps you organize, track, and understand your collection
            in one place.
          </Typography>

          <Stack spacing={1}>
            <Typography variant="subtitle1" fontWeight={600}>
              What you can do here
            </Typography>

            <Typography variant="body2">
              • Manage your inventory items
            </Typography>
            <Typography variant="body2">
              • Keep track of wishlist items
            </Typography>
            <Typography variant="body2">
              • Review analytics and collection insights
            </Typography>
          </Stack>

          <Typography variant="body2" color="text.secondary">
            You can revisit the full getting started guide anytime from the app.
          </Typography>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          variant="outlined"
          onClick={onViewGuide}
          disabled={isSubmitting}
        >
          View full guide
        </Button>

        <Button
          variant="contained"
          onClick={onStartNow}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Start now"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WelcomeDialog;