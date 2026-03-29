import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

const initialFormValues = {
  name: "",
  category: "",
  description: "",
  targetPrice: "",
  currentObservedPrice: "",
  priority: "Medium",
  purchaseUrl: "",
  notes: "",
};

const WishlistFormDialog = ({
  open,
  mode = "create",
  initialValues = null,
  isSubmitting = false,
  errorMessage = "",
  onClose,
  onSubmit,
}) => {
  const [formValues, setFormValues] = useState(initialFormValues);
  const [localError, setLocalError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (open) {
      setFormValues(
        initialValues
          ? {
              name: initialValues.name ?? "",
              category: initialValues.category ?? "",
              description: initialValues.description ?? "",
              targetPrice: initialValues.targetPrice ?? "",
              currentObservedPrice: initialValues.currentObservedPrice ?? "",
              priority: initialValues.priority ?? "Medium",
              purchaseUrl: initialValues.purchaseUrl ?? "",
              notes: initialValues.notes ?? "",
            }
          : initialFormValues,
      );
      setLocalError("");
      setFieldErrors({});
      setFormError("");
    }
  }, [open, initialValues]);

  const isValidUrl = (value) => {
    if (!value) return true;

    try {
      const url = new URL(value);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  };

  const normalizeUrl = (value) => {
    if (!value) return "";

    const trimmed = value.trim();

    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return trimmed;
    }

    return `https://${trimmed}`;
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
    setLocalError("");
  };

  const handleDialogClose = (_, reason) => {
    if (isSubmitting) return;

    if (reason === "backdropClick" || reason === "escapeKeyDown") {
      return;
    }

    onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const normalizedPurchaseUrl = normalizeUrl(formValues.purchaseUrl);

    if (!isValidUrl(normalizedPurchaseUrl)) {
      setLocalError(
        "Purchase URL must be a valid URL starting with http:// or https://",
      );
      return;
    }

    try {
      setLocalError("");
      setFieldErrors({});
      setFormError("");

      if (mode === "edit") {
        await onSubmit(buildEditPayload());
        return;
      }

      await onSubmit({
        name: formValues.name.trim(),
        category: formValues.category.trim(),
        description: formValues.description.trim(),
        targetPrice: Number(formValues.targetPrice),
        currentObservedPrice: Number(formValues.currentObservedPrice),
        priority: formValues.priority,
        purchaseUrl: normalizedPurchaseUrl,
        notes: formValues.notes.trim(),
      });
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

  const buildEditPayload = () => {
    if (!initialValues) return {};

    const normalizedPurchaseUrl = normalizeUrl(formValues.purchaseUrl);

    const nextValues = {
      name: formValues.name.trim(),
      category: formValues.category.trim(),
      description: formValues.description.trim(),
      targetPrice: Number(formValues.targetPrice),
      currentObservedPrice: Number(formValues.currentObservedPrice),
      priority: formValues.priority,
      purchaseUrl: normalizedPurchaseUrl,
      notes: formValues.notes.trim(),
    };

    const originalValues = {
      name: initialValues.name ?? "",
      category: initialValues.category ?? "",
      description: initialValues.description ?? "",
      targetPrice: Number(initialValues.targetPrice ?? 0),
      currentObservedPrice: Number(initialValues.currentObservedPrice ?? 0),
      priority: initialValues.priority ?? "Medium",
      purchaseUrl: initialValues.purchaseUrl ?? "",
      notes: initialValues.notes ?? "",
    };

    const payload = {};

    Object.keys(nextValues).forEach((key) => {
      if (nextValues[key] !== originalValues[key]) {
        payload[key] = nextValues[key];
      }
    });

    return payload;
  };

  const dialogTitle =
    mode === "edit" ? "Edit wishlist item" : "Add wishlist item";

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
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h5" fontWeight={700}>
          {dialogTitle}
        </Typography>
      </DialogTitle>

      <DialogContent dividers sx={{ py: 3 }}>
        <Stack component="form" spacing={3} onSubmit={handleSubmit}>
          {localError ? (
            <Alert severity="error">{localError}</Alert>
          ) : formError || errorMessage ? (
            <Alert severity="error">{formError || errorMessage}</Alert>
          ) : null}

          <Grid container spacing={2.5}>
            <Grid item xs={12} md={6}>
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

            <Grid item xs={12} md={6}>
              <TextField
                label="Category"
                name="category"
                value={formValues.category}
                onChange={handleChange}
                fullWidth
                required
                error={!!fieldErrors.category}
                helperText={fieldErrors.category || ""}
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
                minRows={2}
                error={!!fieldErrors.description}
                helperText={fieldErrors.description || ""}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Target price"
                name="targetPrice"
                type="number"
                value={formValues.targetPrice}
                onChange={handleChange}
                fullWidth
                required
                inputProps={{ min: 0, step: "0.01" }}
                error={!!fieldErrors.targetPrice}
                helperText={fieldErrors.targetPrice || ""}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Current observed price"
                name="currentObservedPrice"
                type="number"
                value={formValues.currentObservedPrice}
                onChange={handleChange}
                fullWidth
                required
                inputProps={{ min: 0, step: "0.01" }}
                error={!!fieldErrors.currentObservedPrice}
                helperText={fieldErrors.currentObservedPrice || ""}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Priority"
                name="priority"
                value={formValues.priority}
                onChange={handleChange}
                fullWidth
                required
                error={!!fieldErrors.priority}
                helperText={fieldErrors.priority || ""}
              >
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Purchase URL"
                name="purchaseUrl"
                value={formValues.purchaseUrl}
                onChange={handleChange}
                fullWidth
                error={!!fieldErrors.purchaseUrl}
                helperText={fieldErrors.purchaseUrl || ""}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Notes"
                name="notes"
                value={formValues.notes}
                onChange={handleChange}
                fullWidth
                multiline
                minRows={3}
                error={!!fieldErrors.notes}
                helperText={fieldErrors.notes || ""}
              />
            </Grid>
          </Grid>

          <DialogActions sx={{ px: 0, pt: 1 }}>
            <Button onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>

            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save item"}
            </Button>
          </DialogActions>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default WishlistFormDialog;
