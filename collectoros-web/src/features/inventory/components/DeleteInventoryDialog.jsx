import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";

const DeleteInventoryDialog = ({
  open,
  item,
  isDeleting = false,
  onClose,
  onConfirm,
}) => {
  const handleDialogClose = (_, reason) => {
    if (isDeleting) return;

    if (reason === "backdropClick" || reason === "escapeKeyDown") {
      return;
    }

    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 4,
        },
      }}
    >
      <DialogTitle>Delete inventory item</DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2}>
          <Typography variant="body1">
            Are you sure you want to delete this item from your inventory?
          </Typography>

          <Typography variant="body2" color="text.secondary">
            This action cannot be undone.
          </Typography>

          {item ? (
            <Typography variant="subtitle2" fontWeight={700}>
              {item.name}
            </Typography>
          ) : null}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isDeleting}>
          Cancel
        </Button>

        <Button
          variant="contained"
          color="warning"
          onClick={onConfirm}
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete item"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteInventoryDialog;