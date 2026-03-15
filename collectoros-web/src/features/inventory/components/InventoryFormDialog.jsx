import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  TextField,
  Box,
  Typography,
} from "@mui/material";

const initialFormValues = {
  name: "",
  category: "",
  description: "",
  purchasePrice: "",
  purchaseDate: "",
  currentEstimatedValue: "",
  quantity: "",
  condition: "",
};

const InventoryFormDialog = ({
  open,
  mode = "create",
  initialValues = null,
  isSubmitting = false,
  errorMessage = "",
  onClose,
  onSubmit,
}) => {
  const [formValues, setFormValues] = useState(initialFormValues);

  useEffect(() => {
    if (open) {
      setFormValues(
        initialValues
          ? {
              name: initialValues.name ?? "",
              category: initialValues.category ?? "",
              description: initialValues.description ?? "",
              purchasePrice: initialValues.purchasePrice ?? "",
              purchaseDate: initialValues.purchaseDate
                ? String(initialValues.purchaseDate).slice(0, 10)
                : "",
              currentEstimatedValue: initialValues.currentEstimatedValue ?? "",
              quantity: initialValues.quantity ?? "",
              condition: initialValues.condition ?? "",
            }
          : initialFormValues,
      );
    }
  }, [open, initialValues]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const buildEditPayload = () => {
    if (!initialValues) return {};

    const nextValues = {
      name: formValues.name.trim(),
      category: formValues.category.trim(),
      description: formValues.description.trim(),
      purchasePrice: Number(formValues.purchasePrice),
      purchaseDate: new Date(formValues.purchaseDate).toISOString(),
      currentEstimatedValue: Number(formValues.currentEstimatedValue),
      quantity: Number(formValues.quantity),
      condition: formValues.condition.trim(),
    };

    const originalValues = {
      name: initialValues.name ?? "",
      category: initialValues.category ?? "",
      description: initialValues.description ?? "",
      purchasePrice: Number(initialValues.purchasePrice ?? 0),
      purchaseDate: initialValues.purchaseDate
        ? new Date(initialValues.purchaseDate).toISOString()
        : "",
      currentEstimatedValue: Number(initialValues.currentEstimatedValue ?? 0),
      quantity: Number(initialValues.quantity ?? 0),
      condition: initialValues.condition ?? "",
    };

    const payload = {};

    Object.keys(nextValues).forEach((key) => {
      if (nextValues[key] !== originalValues[key]) {
        payload[key] = nextValues[key];
      }
    });

    return payload;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const normalizedValues = {
      name: formValues.name.trim(),
      category: formValues.category.trim(),
      description: formValues.description.trim(),
      purchasePrice: Number(formValues.purchasePrice),
      purchaseDate: new Date(formValues.purchaseDate).toISOString(),
      currentEstimatedValue: Number(formValues.currentEstimatedValue),
      quantity: Number(formValues.quantity),
      condition: formValues.condition.trim(),
    };

    if (mode === "edit") {
      onSubmit(buildEditPayload());
      return;
    }

    onSubmit(normalizedValues);
  };

  const handleDialogClose = (_, reason) => {
    if (isSubmitting) return;

    if (reason === "backdropClick" || reason === "escapeKeyDown") {
      return;
    }

    onClose();
  };

  const dialogTitle =
    mode === "edit" ? "Edit inventory item" : "Add inventory item";

  const isEditMode = mode === "edit";

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
          {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

          <Grid container spacing={2.5}>
            {!isEditMode ? (
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
                    required
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

                <Grid item xs={12} md={4}>
                  <TextField
                    label="Quantity"
                    name="quantity"
                    type="number"
                    value={formValues.quantity}
                    onChange={handleChange}
                    fullWidth
                    required
                    inputProps={{ min: 1, step: "1" }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Purchase date"
                    name="purchaseDate"
                    type="date"
                    value={formValues.purchaseDate}
                    onChange={handleChange}
                    fullWidth
                    required
                    InputLabelProps={{ shrink: true }}
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
              </>
            )}
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

export default InventoryFormDialog;
