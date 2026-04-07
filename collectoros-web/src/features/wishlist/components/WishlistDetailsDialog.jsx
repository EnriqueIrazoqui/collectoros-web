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

const formatStoreLabel = (store) => {
  const normalized = String(store || "").toLowerCase();

  if (normalized === "mercadolibre") return "Mercado Libre";
  if (normalized === "amazon") return "Amazon";
  if (normalized === "generic") return "Generic";

  return store || "-";
};

const formatAvailabilityLabel = (availability) => {
  const normalized = String(availability || "").toLowerCase();

  if (normalized === "in_stock") return "In stock";
  if (normalized === "out_of_stock") return "Out of stock";
  if (normalized === "unknown") return "Unknown";

  return availability || "-";
};

const getAvailabilityColor = (availability) => {
  const normalized = String(availability || "").toLowerCase();

  if (normalized === "in_stock") return "success";
  if (normalized === "out_of_stock") return "error";
  if (normalized === "unknown") return "default";

  return "default";
};

const formatDateTime = (value) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString();
};

const formatShortUrl = (url) => {
  if (!url) return "-";

  try {
    const parsed = new URL(url);

    const domain = parsed.hostname.replace("www.", "");

    const pathParts = parsed.pathname.split("/").filter(Boolean);

    const lastPart = pathParts[pathParts.length - 1] || "";

    const shortPath =
      lastPart.length > 30 ? lastPart.slice(0, 30) + "..." : lastPart;

    return `${domain} • ${shortPath}`;
  } catch (error) {
    return url;
  }
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

  const storeLabel = formatStoreLabel(item?.store);
  const availabilityLabel = formatAvailabilityLabel(item?.lastAvailability);
  const availabilityColor = getAvailabilityColor(item?.lastAvailability);
  const lastCheckedAtLabel = formatDateTime(item?.lastCheckedAt);

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
                <DetailItem label="Notes" value={item.notes || "-"} />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary" mb={0.5}>
                  Purchase URL
                </Typography>

                {item.purchaseUrl ? (
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    flexWrap="wrap"
                  >
                    <Typography variant="body1" fontWeight={600}>
                      {formatShortUrl(item.purchaseUrl)}
                    </Typography>

                    <Button
                      size="small"
                      component="a"
                      href={item.purchaseUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open
                    </Button>

                    <Button
                      size="small"
                      onClick={() =>
                        navigator.clipboard.writeText(item.purchaseUrl)
                      }
                    >
                      Copy
                    </Button>
                  </Stack>
                ) : (
                  <Typography variant="body1" fontWeight={600}>
                    -
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" fontWeight={700}>
                  Tracking details
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <DetailItem label="Store" value={storeLabel} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="body2" color="text.secondary" mb={0.5}>
                    Last availability
                  </Typography>

                  <Chip
                    label={availabilityLabel}
                    color={availabilityColor}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <DetailItem
                  label="Last provider source"
                  value={item?.lastProviderSource || "-"}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <DetailItem
                  label="Last checked at"
                  value={lastCheckedAtLabel}
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

export default WishlistDetailsDialog;
