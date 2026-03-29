import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";

const initialForm = {
  email: "",
  displayName: "",
  password: "",
  role: "user",
};

function CreateUserDialog({ open, onClose, onSubmit, isSubmitting }) {
  const [form, setForm] = useState(initialForm);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (!open) {
      setForm(initialForm);
      setFieldErrors({});
    }
  }, [open]);

  const handleChange = (field) => (event) => {
    const value = event.target.value;

    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setFieldErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const handleClose = (_, reason) => {
    if (reason === "backdropClick") return;
    if (isSubmitting) return;
    onClose();
  };

  const handleSubmit = async () => {
    try {
      setFieldErrors({});

      await onSubmit({
        email: form.email.trim(),
        displayName: form.displayName.trim(),
        password: form.password,
        role: form.role,
      });
    } catch (error) {
      const backendErrors = error?.response?.data?.errors || [];

      const formattedErrors = backendErrors.reduce((acc, current) => {
        if (current?.path) {
          acc[current.path] = current.message;
        }
        return acc;
      }, {});

      setFieldErrors(formattedErrors);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Create User</DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Display Name"
            value={form.displayName}
            onChange={handleChange("displayName")}
            fullWidth
            error={!!fieldErrors.displayName}
            helperText={fieldErrors.displayName || ""}
          />

          <TextField
            label="Email"
            type="email"
            value={form.email}
            onChange={handleChange("email")}
            fullWidth
            error={!!fieldErrors.email}
            helperText={fieldErrors.email || ""}
          />

          <TextField
            label="Password"
            type="password"
            value={form.password}
            onChange={handleChange("password")}
            fullWidth
            error={!!fieldErrors.password}
            helperText={fieldErrors.password || ""}
          />

          <FormControl fullWidth error={!!fieldErrors.role}>
            <InputLabel>Role</InputLabel>
            <Select
              value={form.role}
              label="Role"
              onChange={handleChange("role")}
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>

        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitting}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CreateUserDialog;