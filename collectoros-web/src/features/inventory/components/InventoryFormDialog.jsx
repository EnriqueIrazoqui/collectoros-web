import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import InventoryImage from "./InventoryImage";

const MAX_IMAGES = 5;

const getInitialFormValues = (initialValues, mode) => {
  if (mode === "edit" && initialValues) {
    return {
      name: initialValues.name ?? "",
      category: initialValues.category ?? "",
      description: initialValues.description ?? "",
      purchasePrice: initialValues.purchasePrice ?? "",
      purchaseDate: initialValues.purchaseDate
        ? new Date(initialValues.purchaseDate).toISOString().split("T")[0]
        : "",
      currentEstimatedValue: initialValues.currentEstimatedValue ?? "",
      quantity: initialValues.quantity ?? 1,
      condition: initialValues.condition ?? "",
    };
  }

  return {
    name: "",
    category: "",
    description: "",
    purchasePrice: "",
    purchaseDate: "",
    currentEstimatedValue: "",
    quantity: 1,
    condition: "",
  };
};

const InventoryFormDialog = ({
  open,
  mode = "create",
  initialValues = null,
  existingImages = [],
  isSubmitting = false,
  errorMessage = "",
  isMicrosoftConnected = false,
  onClose,
  onSubmit,
}) => {
  const [formValues, setFormValues] = useState(
    getInitialFormValues(initialValues, mode),
  );
  const [selectedImages, setSelectedImages] = useState([]);
  const [localImageError, setLocalImageError] = useState("");

  useEffect(() => {
    if (open) {
      setFormValues(getInitialFormValues(initialValues, mode));
      setSelectedImages([]);
      setLocalImageError("");
    }
  }, [open, initialValues, mode]);

  const imagePreviews = useMemo(() => {
    return selectedImages.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));
  }, [selectedImages]);

  useEffect(() => {
    return () => {
      imagePreviews.forEach((image) => URL.revokeObjectURL(image.previewUrl));
    };
  }, [imagePreviews]);

  const handleDialogClose = (_, reason) => {
    if (reason === "backdropClick" || reason === "escapeKeyDown") {
      return;
    }

    onClose();
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImagesChange = (event) => {
    if (!isMicrosoftConnected) {
      setLocalImageError(
        "Connect Microsoft first to upload images for inventory items.",
      );
      event.target.value = "";
      return;
    }

    const files = Array.from(event.target.files || []);
    const currentCount =
      mode === "edit"
        ? existingImages.length + selectedImages.length
        : selectedImages.length;

    if (currentCount + files.length > MAX_IMAGES) {
      setLocalImageError("You can only have up to 5 images per item.");
      event.target.value = "";
      return;
    }

    setSelectedImages((prev) => [...prev, ...files]);
    setLocalImageError("");
    event.target.value = "";
  };

  const handleRemoveSelectedImage = (indexToRemove) => {
    setSelectedImages((prev) =>
      prev.filter((_, index) => index !== indexToRemove),
    );
  };

  const buildCreateFormData = () => {
    const formData = new FormData();

    formData.append("name", formValues.name.trim());
    formData.append("category", formValues.category.trim());
    formData.append("description", formValues.description.trim());
    formData.append("purchasePrice", String(formValues.purchasePrice || 0));
    formData.append("purchaseDate", formValues.purchaseDate || "");
    formData.append(
      "currentEstimatedValue",
      String(formValues.currentEstimatedValue || 0),
    );
    formData.append("quantity", String(formValues.quantity || 1));
    formData.append("condition", formValues.condition.trim());

    selectedImages.forEach((file) => {
      formData.append("images", file);
    });

    return formData;
  };

  const buildEditFormData = () => {
    const formData = new FormData();

    const nextValues = {
      description: formValues.description.trim(),
      currentEstimatedValue: String(
        Number(formValues.currentEstimatedValue || 0),
      ),
      condition: formValues.condition.trim(),
    };

    const originalValues = {
      description: initialValues?.description ?? "",
      currentEstimatedValue: String(
        Number(initialValues?.currentEstimatedValue ?? 0),
      ),
      condition: initialValues?.condition ?? "",
    };

    let hasChanges = false;

    Object.keys(nextValues).forEach((key) => {
      if (nextValues[key] !== originalValues[key]) {
        formData.append(key, nextValues[key]);
        hasChanges = true;
      }
    });

    selectedImages.forEach((file) => {
      formData.append("images", file);
      hasChanges = true;
    });

    formData.append("hasChanges", hasChanges ? "true" : "false");

    return formData;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (mode === "edit") {
      onSubmit(buildEditFormData());
      return;
    }

    onSubmit(buildCreateFormData());
  };

  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      fullWidth
      maxWidth="lg"
      PaperProps={{
        sx: {
          borderRadius: 4,
        },
      }}
    >
      <DialogTitle>
        {mode === "edit" ? "Edit inventory item" : "Create inventory item"}
      </DialogTitle>

      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Stack spacing={3}>
            {!!errorMessage && <Alert severity="error">{errorMessage}</Alert>}

            {!!localImageError && (
              <Alert severity="warning">{localImageError}</Alert>
            )}

            <Grid container spacing={2}>
              {mode === "create" ? (
                <>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Name"
                      name="name"
                      value={formValues.name}
                      onChange={handleChange}
                      fullWidth
                      required
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Category"
                      name="category"
                      value={formValues.category}
                      onChange={handleChange}
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      label="Description"
                      name="description"
                      value={formValues.description}
                      onChange={handleChange}
                      fullWidth
                      multiline
                      minRows={3}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <TextField
                      label="Purchase price"
                      name="purchasePrice"
                      type="number"
                      value={formValues.purchasePrice}
                      onChange={handleChange}
                      fullWidth
                      required
                      inputProps={{ min: 0, step: "0.01" }}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <TextField
                      label="Purchase date"
                      name="purchaseDate"
                      type="date"
                      value={formValues.purchaseDate}
                      onChange={handleChange}
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <TextField
                      label="Quantity"
                      name="quantity"
                      type="number"
                      value={formValues.quantity}
                      onChange={handleChange}
                      fullWidth
                      required
                      inputProps={{ min: 1, step: 1 }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Current estimated value"
                      name="currentEstimatedValue"
                      type="number"
                      value={formValues.currentEstimatedValue}
                      onChange={handleChange}
                      fullWidth
                      required
                      inputProps={{ min: 0, step: "0.01" }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Condition"
                      name="condition"
                      value={formValues.condition}
                      onChange={handleChange}
                      fullWidth
                      required
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Stack spacing={1.5}>
                      <Typography variant="subtitle1" fontWeight={600}>
                        Images
                      </Typography>

                      <Button
                        variant="outlined"
                        component="label"
                        disabled={!isMicrosoftConnected}
                      >
                        {isMicrosoftConnected
                          ? "Select up to 5 images"
                          : "Connect Microsoft to upload images"}
                        <input
                          hidden
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          multiple
                          onChange={handleImagesChange}
                          disabled={!isMicrosoftConnected}
                        />
                      </Button>

                      <Typography variant="body2" color="text.secondary">
                        {isMicrosoftConnected
                          ? "You can upload up to 5 images for this item."
                          : "Image uploads are disabled until you connect your Microsoft account."}
                      </Typography>

                      {imagePreviews.length > 0 && (
                        <Grid container spacing={2}>
                          {imagePreviews.map((image, index) => (
                            <Grid
                              item
                              xs={12}
                              sm={6}
                              md={4}
                              key={`${image.file.name}-${index}`}
                            >
                              <Box
                                sx={{
                                  border: "1px solid",
                                  borderColor: "divider",
                                  borderRadius: 3,
                                  p: 1.5,
                                }}
                              >
                                <Box
                                  component="img"
                                  src={image.previewUrl}
                                  alt={image.file.name}
                                  sx={{
                                    width: "100%",
                                    height: 180,
                                    objectFit: "cover",
                                    borderRadius: 2,
                                    mb: 1,
                                  }}
                                />

                                <Stack
                                  direction="row"
                                  alignItems="center"
                                  justifyContent="space-between"
                                  spacing={1}
                                >
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                      flex: 1,
                                    }}
                                  >
                                    {image.file.name}
                                  </Typography>

                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() =>
                                      handleRemoveSelectedImage(index)
                                    }
                                    disabled={isSubmitting}
                                  >
                                    <DeleteOutlineIcon fontSize="small" />
                                  </IconButton>
                                </Stack>
                              </Box>
                            </Grid>
                          ))}
                        </Grid>
                      )}
                    </Stack>
                  </Grid>
                </>
              ) : (
                <>
                  <Grid item xs={12}>
                    <TextField
                      label="Description"
                      name="description"
                      value={formValues.description}
                      onChange={handleChange}
                      fullWidth
                      multiline
                      minRows={3}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Current estimated value"
                      name="currentEstimatedValue"
                      type="number"
                      value={formValues.currentEstimatedValue}
                      onChange={handleChange}
                      fullWidth
                      required
                      inputProps={{ min: 0, step: "0.01" }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Condition"
                      name="condition"
                      value={formValues.condition}
                      onChange={handleChange}
                      fullWidth
                      required
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Stack spacing={1.5}>
                      <Typography variant="subtitle1" fontWeight={600}>
                        Current images
                      </Typography>

                      {existingImages.length > 0 ? (
                        <Grid container spacing={2}>
                          {existingImages.map((image) => (
                            <Grid item xs={12} sm={6} md={4} key={image.id}>
                              <Box
                                sx={{
                                  border: "1px solid",
                                  borderColor: "divider",
                                  borderRadius: 3,
                                  p: 1.5,
                                }}
                              >
                                <InventoryImage
                                  imageId={image.id}
                                  alt={image.fileName}
                                />

                                <Typography
                                  variant="body2"
                                  sx={{
                                    mt: 1,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {image.fileName}
                                </Typography>
                              </Box>
                            </Grid>
                          ))}
                        </Grid>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          This item has no images yet.
                        </Typography>
                      )}
                    </Stack>
                  </Grid>

                  <Grid item xs={12}>
                    <Stack spacing={1.5}>
                      <Typography variant="subtitle1" fontWeight={600}>
                        Add new images
                      </Typography>

                      <Button
                        variant="outlined"
                        component="label"
                        disabled={!isMicrosoftConnected}
                      >
                        {isMicrosoftConnected
                          ? "Select up to 5 images"
                          : "Connect Microsoft to upload images"}
                        <input
                          hidden
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          multiple
                          onChange={handleImagesChange}
                          disabled={!isMicrosoftConnected}
                        />
                      </Button>

                      <Typography variant="body2" color="text.secondary">
                        {isMicrosoftConnected
                          ? "You can add new images to this item."
                          : "New image uploads are disabled until you connect your Microsoft account."}
                      </Typography>

                      {imagePreviews.length > 0 && (
                        <Grid container spacing={2}>
                          {imagePreviews.map((image, index) => (
                            <Grid
                              item
                              xs={12}
                              sm={6}
                              md={4}
                              key={`${image.file.name}-${index}`}
                            >
                              <Box
                                sx={{
                                  border: "1px solid",
                                  borderColor: "divider",
                                  borderRadius: 3,
                                  p: 1.5,
                                }}
                              >
                                <Box
                                  component="img"
                                  src={image.previewUrl}
                                  alt={image.file.name}
                                  sx={{
                                    width: "100%",
                                    height: 180,
                                    objectFit: "cover",
                                    borderRadius: 2,
                                    mb: 1,
                                  }}
                                />

                                <Stack
                                  direction="row"
                                  alignItems="center"
                                  justifyContent="space-between"
                                  spacing={1}
                                >
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                      flex: 1,
                                    }}
                                  >
                                    {image.file.name}
                                  </Typography>

                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() =>
                                      handleRemoveSelectedImage(index)
                                    }
                                    disabled={isSubmitting}
                                  >
                                    <DeleteOutlineIcon fontSize="small" />
                                  </IconButton>
                                </Stack>
                              </Box>
                            </Grid>
                          ))}
                        </Grid>
                      )}
                    </Stack>
                  </Grid>
                </>
              )}
            </Grid>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>

          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {mode === "edit" ? "Save item" : "Create item"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default InventoryFormDialog;
