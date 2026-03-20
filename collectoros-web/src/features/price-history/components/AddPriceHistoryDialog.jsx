import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";

import useCreatePriceHistory from "../hooks/useCreatePriceHistory";
import { formatCurrency } from "../../../utils/formatCurrency";

const AddPriceHistoryDialog = ({ open, onClose, item, onCreateSuccess }) => {
  const createMutation = useCreatePriceHistory();

  const [form, setForm] = useState({
    price: "",
    source: "Manual",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setForm({
        price: item?.currentEstimatedValue ?? "",
        source: "Manual",
      });
      setErrors({});
    }
  }, [open, item]);

  const parsedPrice = useMemo(() => {
    const value = Number(form.price);
    return Number.isNaN(value) ? 0 : value;
  }, [form.price]);

  const handleChange = (field) => (event) => {
    const value = event.target.value;

    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = () => {
    const nextErrors = {};

    if (form.price === "" || form.price === null || form.price === undefined) {
      nextErrors.price = "Price is required";
    } else if (Number(form.price) <= 0) {
      nextErrors.price = "Price must be greater than 0";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!item?.id) return;
    if (!validateForm()) return;

    try {
      await createMutation.mutateAsync({
        itemId: item.id,
        price: Number(form.price),
        source: form.source?.trim() || "Manual",
      });

      onClose?.();
      onCreateSuccess?.();
    } catch (error) {
      console.error("Error creating price history entry:", error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (createMutation.isPending) return;

        if (reason === "backdropClick" || reason === "escapeKeyDown") {
          return;
        }

        onClose();
      }}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 4,
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
        >
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Add Price Record
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {item?.name || "Selected item"}
            </Typography>
          </Box>

          <IconButton onClick={onClose} disabled={createMutation.isPending}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <Stack spacing={2.5}>
          <Box
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 3,
              p: 2,
            }}
          >
            <Stack spacing={0.5}>
              <Typography variant="subtitle2" color="text.secondary">
                Current estimated value
              </Typography>
              <Typography variant="h6" fontWeight={700}>
                {formatCurrency(item?.currentEstimatedValue || 0)}
              </Typography>
            </Stack>
          </Box>

          <TextField
            label="Price"
            type="number"
            fullWidth
            value={form.price}
            onChange={handleChange("price")}
            error={!!errors.price}
            helperText={errors.price}
            inputProps={{
              min: 0,
              step: "0.01",
            }}
          />

          <TextField
            label="Source"
            fullWidth
            value={form.source}
            onChange={handleChange("source")}
            placeholder="Manual"
          />

          <Box
            sx={{
              border: "1px dashed",
              borderColor: "divider",
              borderRadius: 3,
              p: 2,
            }}
          >
            <Stack spacing={0.5}>
              <Typography variant="subtitle2" color="text.secondary">
                Preview
              </Typography>
              <Typography variant="h6" fontWeight={700}>
                {formatCurrency(parsedPrice)}
              </Typography>
            </Stack>
          </Box>

          {createMutation.isError && (
            <Typography variant="body2" color="error">
              {createMutation.error?.response?.data?.message ||
                createMutation.error?.message ||
                "Could not create the price history entry."}
            </Typography>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} disabled={createMutation.isPending}>
          Cancel
        </Button>

        <Button
          variant="contained"
          startIcon={<SaveOutlinedIcon />}
          onClick={handleSubmit}
          disabled={createMutation.isPending || !item?.id}
        >
          {createMutation.isPending ? "Saving..." : "Save record"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddPriceHistoryDialog;
