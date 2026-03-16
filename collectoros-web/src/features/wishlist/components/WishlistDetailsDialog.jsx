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
  Link,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { formatCurrency } from "../../../utils/formatCurrency";

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

const getPriorityColor = (priority) => {
  const normalized = String(priority || "").toLowerCase();

  if (normalized === "high") return "error";
  if (normalized === "medium") return "warning";
  if (normalized === "low") return "success";

  return "default";
};

const WishlistDetailsDialog = ({
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

  const targetPrice = Number(item?.targetPrice || 0);
  const observedPrice = Number(item?.currentObservedPrice || 0);
  const delta = observedPrice - targetPrice;

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
      <DialogTitle>Wishlist item details</DialogTitle>

      <DialogContent dividers sx={{ py: 3 }}>
        {isLoading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : isError ? (
          <Alert severity="error">
            {errorMessage || "Could not load wishlist item details."}
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
                  label={item.priority || "Unknown priority"}
                  color={getPriorityColor(item.priority)}
                  size="small"
                  variant="outlined"
                />
              </Stack>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <DetailMetricCard
                  label="Target price"
                  value={formatCurrency(targetPrice)}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <DetailMetricCard
                  label="Observed price"
                  value={formatCurrency(observedPrice)}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <DetailMetricCard
                  label="Delta to target"
                  value={formatCurrency(delta)}
                  color={delta <= 0 ? "success.main" : "warning.main"}
                />
              </Grid>
            </Grid>

            <Divider />

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <DetailItem
                  label="Description"
                  value={item.description || "-"}
                />
              </Grid>

              <Grid item xs={12}>
                <DetailItem
                  label="Notes"
                  value={item.notes || "-"}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary" mb={0.5}>
                  Purchase URL
                </Typography>

                {item.purchaseUrl ? (
                  <Link
                    href={item.purchaseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="hover"
                    sx={{ fontWeight: 600 }}
                  >
                    {item.purchaseUrl}
                  </Link>
                ) : (
                  <Typography variant="body1" fontWeight={600}>
                    -
                  </Typography>
                )}
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

export default WishlistDetailsDialog;