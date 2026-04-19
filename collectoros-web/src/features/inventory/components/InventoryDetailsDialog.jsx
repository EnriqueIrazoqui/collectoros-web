import { useState } from "react";
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
import { useInventoryItemImages } from "../hooks/useInventoryItemImages";
import InventoryImage from "./InventoryImage";

const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-US");
};

const getTrackingStatusConfig = (status) => {
  const normalizedStatus = String(status || "").toLowerCase();

  switch (normalizedStatus) {
    case "success":
      return { label: "Updated", color: "success" };
    case "bot_protection":
      return { label: "Retry scheduled", color: "warning" };
    case "error":
    case "not_found":
    case "rate_limited":
      return { label: "Tracking issue", color: "error" };
    default:
      return { label: "Queued", color: "default" };
  }
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
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const { data: imagesResponse, isLoading: isImagesLoading } =
    useInventoryItemImages(item?.id, open && !!item?.id);

  const images = imagesResponse?.data || [];

  const handleDialogClose = (_, reason) => {
    if (reason === "backdropClick" || reason === "escapeKeyDown") {
      return;
    }

    onClose();
  };

  const handleOpenPreview = (image) => {
    setSelectedImage(image);
    setPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
    setSelectedImage(null);
  };

  const gain =
    Number(item?.currentEstimatedValue || 0) - Number(item?.purchasePrice || 0);

  const trackingStatusConfig = getTrackingStatusConfig(item?.lastCheckStatus);

  return (
    <>
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

                  {item?.isTrackingEnabled ? (
                    <Chip
                      label={trackingStatusConfig.label}
                      size="small"
                      color={trackingStatusConfig.color}
                      variant="outlined"
                    />
                  ) : (
                    <Chip
                      label="Manual value"
                      size="small"
                      variant="outlined"
                    />
                  )}
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

              <Box>
                <Typography variant="h6" fontWeight={700} mb={2}>
                  Images
                </Typography>

                {isImagesLoading ? (
                  <Box display="flex" justifyContent="center" py={2}>
                    <CircularProgress size={24} />
                  </Box>
                ) : images.length === 0 ? (
                  <Alert severity="info">This item has no images.</Alert>
                ) : (
                  <Grid container spacing={2}>
                    {images.map((image) => (
                      <Grid item xs={12} sm={6} md={4} key={image.id}>
                        <Paper
                          variant="outlined"
                          sx={{
                            borderRadius: 3,
                            overflow: "hidden",
                            height: "100%",
                          }}
                        >
                          <Box
                            onClick={() => handleOpenPreview(image)}
                            sx={{
                              cursor: "pointer",
                            }}
                          >
                            <InventoryImage
                              imageId={image.id}
                              alt={image.fileName}
                            />
                          </Box>

                          <Box sx={{ p: 1.5 }}>
                            <Typography variant="body2" noWrap>
                              {image.fileName}
                            </Typography>
                          </Box>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Box>

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
                  <Box>
                    <Typography variant="body2" color="text.secondary" mb={0.5}>
                      Tracking URL
                    </Typography>

                    {item.trackingUrl ? (
                      <Link
                        href={item.trackingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="hover"
                        sx={{
                          display: "inline-block",
                          wordBreak: "break-word",
                          overflowWrap: "anywhere",
                          fontWeight: 600,
                        }}
                      >
                        {item.trackingUrl}
                      </Link>
                    ) : (
                      <Typography variant="body1" fontWeight={600}>
                        -
                      </Typography>
                    )}
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <DetailItem label="Currency" value={item.currency || "-"} />
                </Grid>

                <Grid item xs={12} md={6}>
                  <DetailItem
                    label="Tracking frequency"
                    value={
                      item.isTrackingEnabled
                        ? `${item.trackingFrequencyHours || 24} hours`
                        : "Disabled"
                    }
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <DetailItem
                    label="Last checked"
                    value={formatDate(item.lastCheckedAt)}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <DetailItem
                    label="Next check"
                    value={formatDate(item.nextCheckAt)}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <DetailItem
                    label="Last status"
                    value={trackingStatusConfig.label}
                  />
                </Grid>

                <Grid item xs={12}>
                  <DetailItem
                    label="Last error"
                    value={item.lastErrorMessage || "-"}
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

      <Dialog
        open={previewOpen}
        onClose={(event, reason) => {
          if (reason === "backdropClick" || reason === "escapeKeyDown") {
            return;
          }
          handleClosePreview();
        }}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
          },
        }}
      >
        <DialogTitle>{selectedImage?.fileName || "Image preview"}</DialogTitle>

        <DialogContent dividers>
          {selectedImage ? (
            <InventoryImage
              imageId={selectedImage.id}
              alt={selectedImage.fileName}
              sx={{
                width: "100%",
                height: "auto",
                maxHeight: "75vh",
                objectFit: "contain",
                bgcolor: "black",
              }}
            />
          ) : null}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClosePreview}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default InventoryDetailsDialog;
