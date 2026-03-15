import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { formatCurrency } from "../../../utils/formatCurrency";

const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-US");
};

const DetailMetricCard = ({ label, value, color = "text.primary" }) => {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: 3,
        height: "100%",
      }}
    >
      <Typography variant="body2" color="text.secondary" mb={0.5}>
        {label}
      </Typography>

      <Typography variant="h6" fontWeight={700} color={color}>
        {value}
      </Typography>
    </Paper>
  );
};

const DetailItem = ({ label, value }) => {
  return (
    <Box>
      <Typography variant="body2" color="text.secondary" mb={0.5}>
        {label}
      </Typography>

      <Typography variant="body1" fontWeight={600}>
        {value || "-"}
      </Typography>
    </Box>
  );
};

const InventoryDetailsDialog = ({
  open,
  item,
  isLoading = false,
  isError = false,
  errorMessage = "",
  onClose,
}) => {
  const handleDialogClose = (_, reason) => {
    if (reason === "backdropClick" || reason === "escapeKeyDown") {
      return;
    }

    onClose();
  };

  const gain =
    Number(item?.currentEstimatedValue || 0) - Number(item?.purchasePrice || 0);

  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: 4,
        },
      }}
    >
      <DialogTitle>Inventory item details</DialogTitle>

      <DialogContent dividers sx={{ py: 3 }}>
        {isLoading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : isError ? (
          <Alert severity="error">
            {errorMessage || "Could not load item details."}
          </Alert>
        ) : item ? (
          <Stack spacing={3}>
            <Box>
              <Typography variant="h4" fontWeight={700}>
                {item.name}
              </Typography>

              <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
                mt={1}
                flexWrap="wrap"
              >
                <Typography variant="body1" color="text.secondary">
                  {item.category || "-"}
                </Typography>

                <Chip
                  label={item.condition || "Unknown condition"}
                  size="small"
                  variant="outlined"
                />
              </Stack>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <DetailMetricCard
                  label="Quantity"
                  value={item.quantity ?? "-"}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <DetailMetricCard
                  label="Purchase price"
                  value={formatCurrency(item.purchasePrice)}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <DetailMetricCard
                  label="Estimated value"
                  value={formatCurrency(item.currentEstimatedValue)}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <DetailMetricCard
                  label="Gain / Loss"
                  value={formatCurrency(gain)}
                  color={gain >= 0 ? "success.main" : "error.main"}
                />
              </Grid>
            </Grid>

            <Divider />

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <DetailItem
                  label="Purchase date"
                  value={formatDate(item.purchaseDate)}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <DetailItem
                  label="Created at"
                  value={formatDate(item.createdAt)}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <DetailItem
                  label="Updated at"
                  value={formatDate(item.updatedAt)}
                />
              </Grid>

              <Grid item xs={12}>
                <DetailItem
                  label="Description"
                  value={item.description || "-"}
                />
              </Grid>
            </Grid>
          </Stack>
        ) : (
          <Alert severity="info">No item selected.</Alert>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default InventoryDetailsDialog;