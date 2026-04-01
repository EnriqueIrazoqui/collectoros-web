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
  MenuItem,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import InventoryImage from "./InventoryImage";
import ActionLoader from "../../../components/feedback/ActionLoader";
import InputAdornment from "@mui/material/InputAdornment";

const MAX_IMAGES = 5;

const getTodayDate = () => {
  const today = new Date();
  const offset = today.getTimezoneOffset();
  const localDate = new Date(today.getTime() - offset * 60000);
  return localDate.toISOString().split("T")[0];
};

const conditionOptions = [
  { value: "mint", label: "Mint" },
  { value: "excellent", label: "Excellent" },
  { value: "very_good", label: "Very Good" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
  { value: "poor", label: "Poor" },
];

const categoryOptions = [
  { value: "figure", label: "Figure" },
  { value: "statue", label: "Statue" },
  { value: "card", label: "Card" },
  { value: "comic", label: "Comic" },
  { value: "manga", label: "Manga" },
  { value: "game", label: "Game" },
  { value: "console", label: "Console" },
  { value: "artbook", label: "Artbook" },
  { value: "merch", label: "Merch" },
  { value: "watch", label: "Watch" },
  { value: "other", label: "Other" },
];

const getInitialFormValues = (initialValues, mode) => {
  if (mode === "edit" && initialValues) {
    return {
      name: initialValues.name ?? "",
      category: initialValues.category ?? "",
      description: initialValues.description ?? "",
      purchasePrice: initialValues.purchasePrice ?? "",
      purchaseDate: initialValues.purchaseDate ?? getTodayDate(),
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
    purchaseDate: getTodayDate(),
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
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");

  const totalImagesCount =
    mode === "edit"
      ? existingImages.length + selectedImages.length
      : selectedImages.length;

  const hasReachedMaxImages = totalImagesCount >= MAX_IMAGES;

  useEffect(() => {
    if (open) {
      setFormValues(getInitialFormValues(initialValues, mode));
      setSelectedImages([]);
      setLocalImageError("");
      setFieldErrors({});
      setFormError("");
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
    if (isSubmitting) {
      return;
    }

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

    setFieldErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setFormError("");
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
    if (isSubmitting) return;

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setFieldErrors({});
      setFormError("");

      if (mode === "edit") {
        await onSubmit(buildEditFormData());
        return;
      }

      await onSubmit(buildCreateFormData());
    } catch (error) {
      const backendErrors = error?.response?.data?.errors || [];
      const backendMessage =
        error?.response?.data?.message || "An unexpected error occurred.";

      if (backendErrors.length > 0) {
        const formattedErrors = backendErrors.reduce((acc, current) => {
          if (current?.path) {
            acc[current.path] = current.message;
          }
          return acc;
        }, {});

        setFieldErrors(formattedErrors);
      }

      setFormError(backendMessage);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      fullWidth
      maxWidth="lg"
      disableEscapeKeyDown={isSubmitting}
      PaperProps={{
        sx: {
          borderRadius: 4,
          position: "relative",
          overflow: "hidden",
          width: "100%",
          maxHeight: "95vh",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <ActionLoader
        open={isSubmitting}
        title={mode === "edit" ? "Updating item..." : "Creating item..."}
        subtitle="Images and item data are being processed."
      />

      <DialogTitle>
        {mode === "edit" ? "Edit inventory item" : "Create inventory item"}
      </DialogTitle>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minHeight: 0,
          pointerEvents: isSubmitting ? "none" : "auto",
          opacity: isSubmitting ? 0.72 : 1,
          transition: "opacity 0.2s ease",
        }}
      >
        <DialogContent
          dividers
          sx={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
          }}
        >
          <Stack spacing={3}>
            {!!(formError || errorMessage) && (
              <Alert severity="error">{formError || errorMessage}</Alert>
            )}

            {!!localImageError && (
              <Alert severity="warning">{localImageError}</Alert>
            )}

            <Grid container spacing={3}>
              {mode === "create" ? (
                <>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      label="Name"
                      name="name"
                      value={formValues.name}
                      onChange={handleChange}
                      fullWidth
                      required
                      error={!!fieldErrors.name}
                      helperText={fieldErrors.name || ""}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      select
                      label="Category"
                      name="category"
                      value={formValues.category}
                      onChange={handleChange}
                      fullWidth
                      required
                      error={!!fieldErrors.category}
                      helperText={fieldErrors.category || ""}
                      InputLabelProps={{ shrink: true }}
                      SelectProps={{
                        displayEmpty: true,
                        renderValue: (selected) => {
                          if (!selected) {
                            return (
                              <Typography
                                component="span"
                                sx={{ color: "text.disabled" }}
                              >
                                Select a category
                              </Typography>
                            );
                          }

                          const option = categoryOptions.find(
                            (currentOption) => currentOption.value === selected,
                          );

                          return option?.label || selected;
                        },
                      }}
                      sx={{
                        "& .MuiInputBase-root": {
                          minHeight: 56,
                        },
                      }}
                    >
                      {categoryOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid size={12}>
                    <TextField
                      label="Description"
                      name="description"
                      value={formValues.description}
                      onChange={handleChange}
                      fullWidth
                      multiline
                      minRows={3}
                      error={!!fieldErrors.description}
                      helperText={fieldErrors.description || ""}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      label="Purchase price"
                      name="purchasePrice"
                      type="number"
                      value={formValues.purchasePrice}
                      onChange={handleChange}
                      fullWidth
                      required
                      inputProps={{ min: 0, step: "0.01" }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        ),
                      }}
                      error={!!fieldErrors.purchasePrice}
                      helperText={fieldErrors.purchasePrice || ""}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      label="Current estimated value"
                      name="currentEstimatedValue"
                      type="number"
                      value={formValues.currentEstimatedValue}
                      onChange={handleChange}
                      fullWidth
                      required
                      inputProps={{ min: 0, step: "0.01" }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        ),
                      }}
                      error={!!fieldErrors.currentEstimatedValue}
                      helperText={fieldErrors.currentEstimatedValue || ""}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      label="Purchase date"
                      name="purchaseDate"
                      type="date"
                      value={formValues.purchaseDate}
                      onChange={handleChange}
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      error={!!fieldErrors.purchaseDate}
                      helperText={fieldErrors.purchaseDate || ""}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      label="Quantity"
                      name="quantity"
                      type="number"
                      value={formValues.quantity}
                      onChange={handleChange}
                      fullWidth
                      required
                      inputProps={{ min: 1, step: 1 }}
                      error={!!fieldErrors.quantity}
                      helperText={fieldErrors.quantity || ""}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      select
                      label="Condition"
                      name="condition"
                      value={formValues.condition}
                      onChange={handleChange}
                      fullWidth
                      required
                      error={!!fieldErrors.condition}
                      helperText={fieldErrors.condition || ""}
                      InputLabelProps={{ shrink: true }}
                      SelectProps={{
                        displayEmpty: true,
                        renderValue: (selected) => {
                          if (!selected) {
                            return (
                              <Typography
                                component="span"
                                sx={{ color: "text.disabled" }}
                              >
                                Select a condition
                              </Typography>
                            );
                          }

                          const option = conditionOptions.find(
                            (currentOption) => currentOption.value === selected,
                          );

                          return option?.label || selected;
                        },
                      }}
                      sx={{
                        "& .MuiInputBase-root": {
                          minHeight: 56,
                        },
                      }}
                    >
                      {conditionOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid size={12}>
                    <Stack spacing={1.5}>
                      <Typography variant="subtitle1" fontWeight={600}>
                        Images
                      </Typography>

                      <Button
                        variant="outlined"
                        component="label"
                        disabled={
                          !isMicrosoftConnected ||
                          isSubmitting ||
                          hasReachedMaxImages
                        }
                      >
                        {!isMicrosoftConnected
                          ? "Connect Microsoft to upload images"
                          : hasReachedMaxImages
                            ? "Maximum of 5 images reached"
                            : "Select up to 5 images"}
                        <input
                          hidden
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          multiple
                          onChange={handleImagesChange}
                          disabled={
                            !isMicrosoftConnected ||
                            isSubmitting ||
                            hasReachedMaxImages
                          }
                        />
                      </Button>

                      <Typography variant="body2" color="text.secondary">
                        {!isMicrosoftConnected
                          ? "New image uploads are disabled until you connect your Microsoft account."
                          : hasReachedMaxImages
                            ? "This item already has the maximum of 5 images."
                            : `You can add ${MAX_IMAGES - totalImagesCount} more image${
                                MAX_IMAGES - totalImagesCount === 1 ? "" : "s"
                              }.`}
                      </Typography>

                      {imagePreviews.length > 0 && (
                        <Box
                          sx={{
                            maxHeight: 320,
                            overflowY: "auto",
                            pr: 1,
                            borderRadius: 2,
                            "&::-webkit-scrollbar": {
                              width: 6,
                            },
                            "&::-webkit-scrollbar-thumb": {
                              backgroundColor: "#888",
                              borderRadius: 4,
                            },
                          }}
                        >
                          <Grid container spacing={2}>
                            {imagePreviews.map((image, index) => (
                              <Grid
                                key={`${image.file.name}-${index}`}
                                size={{ xs: 12, sm: 6, md: 4 }}
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
                        </Box>
                      )}
                    </Stack>
                  </Grid>
                </>
              ) : (
                <>
                  <Grid size={12}>
                    <TextField
                      label="Description"
                      name="description"
                      value={formValues.description}
                      onChange={handleChange}
                      fullWidth
                      multiline
                      minRows={3}
                      error={!!fieldErrors.description}
                      helperText={fieldErrors.description || ""}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      label="Current estimated value"
                      name="currentEstimatedValue"
                      type="number"
                      value={formValues.currentEstimatedValue}
                      onChange={handleChange}
                      fullWidth
                      required
                      inputProps={{ min: 0, step: "0.01" }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        ),
                      }}
                      error={!!fieldErrors.currentEstimatedValue}
                      helperText={fieldErrors.currentEstimatedValue || ""}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      select
                      label="Condition"
                      name="condition"
                      value={formValues.condition}
                      onChange={handleChange}
                      fullWidth
                      required
                      error={!!fieldErrors.condition}
                      helperText={fieldErrors.condition || ""}
                      InputLabelProps={{ shrink: true }}
                      SelectProps={{
                        displayEmpty: true,
                        renderValue: (selected) => {
                          if (!selected) {
                            return (
                              <Typography
                                component="span"
                                sx={{ color: "text.disabled" }}
                              >
                                Select a condition
                              </Typography>
                            );
                          }

                          const option = conditionOptions.find(
                            (currentOption) => currentOption.value === selected,
                          );

                          return option?.label || selected;
                        },
                      }}
                      sx={{
                        "& .MuiInputBase-root": {
                          minHeight: 56,
                        },
                      }}
                    >
                      {conditionOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item size={12}>
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

                  <Grid size={12}>
                    <Stack spacing={1.5}>
                      <Typography variant="subtitle1" fontWeight={600}>
                        Add new images
                      </Typography>

                      <Button
                        variant="outlined"
                        component="label"
                        disabled={
                          !isMicrosoftConnected ||
                          isSubmitting ||
                          hasReachedMaxImages
                        }
                      >
                        {!isMicrosoftConnected
                          ? "Connect Microsoft to upload images"
                          : hasReachedMaxImages
                            ? "Maximum of 5 images reached"
                            : "Select up to 5 images"}
                        <input
                          hidden
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          multiple
                          onChange={handleImagesChange}
                          disabled={
                            !isMicrosoftConnected ||
                            isSubmitting ||
                            hasReachedMaxImages
                          }
                        />
                      </Button>

                      <Typography variant="body2" color="text.secondary">
                        {!isMicrosoftConnected
                          ? "New image uploads are disabled until you connect your Microsoft account."
                          : hasReachedMaxImages
                            ? "This item already has the maximum of 5 images."
                            : `You can add ${MAX_IMAGES - totalImagesCount} more image${
                                MAX_IMAGES - totalImagesCount === 1 ? "" : "s"
                              }.`}
                      </Typography>

                      {imagePreviews.length > 0 && (
                        <Box
                          sx={{
                            maxHeight: 320,
                            overflowY: "auto",
                            pr: 1,
                            borderRadius: 2,

                            "&::-webkit-scrollbar": {
                              width: 6,
                            },
                            "&::-webkit-scrollbar-thumb": {
                              backgroundColor: "#888",
                              borderRadius: 4,
                            },
                          }}
                        >
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
                        </Box>
                      )}
                    </Stack>
                  </Grid>
                </>
              )}
            </Grid>
          </Stack>
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            py: 2,
            borderTop: "1px solid",
            borderColor: "divider",
            bgcolor: "transparent",
            flexShrink: 0,
            position: "sticky",
            bottom: 0,
            zIndex: 1,
          }}
        >
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
