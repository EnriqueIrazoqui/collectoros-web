import { useState } from "react";
import {
  Alert,
  Button,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";

const interestOptions = [
  {
    value: "inventory_management",
    label: "Inventory management",
  },
  {
    value: "automatic_tracking",
    label: "Automatic value tracking",
  },
  {
    value: "wishlist_tracking",
    label: "Wishlist tracking",
  },
  {
    value: "price_history",
    label: "Price history and analytics",
  },
  {
    value: "general",
    label: "General CollectorOS evaluation",
  },
];

const initialValues = {
  name: "",
  email: "",
  interest: "",
  message: "",
};

const RequestAccessForm = ({
  onSubmit,
  isSubmitting = false,
  errorMessage = "",
}) => {
  const [formValues, setFormValues] = useState(initialValues);
  const [fieldErrors, setFieldErrors] = useState({});

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
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setFieldErrors({});

    try {
      await onSubmit({
        name: formValues.name.trim(),
        email: formValues.email.trim(),
        interest: formValues.interest || null,
        message: formValues.message.trim() || null,
      });

      setFormValues(initialValues);
    } catch (error) {
      const backendErrors = error?.response?.data?.errors || [];

      if (backendErrors.length > 0) {
        const nextErrors = backendErrors.reduce((acc, current) => {
          if (current?.path) {
            acc[current.path] = current.message;
          }

          return acc;
        }, {});

        setFieldErrors(nextErrors);
      }

      throw error;
    }
  };

  return (
    <Stack component="form" spacing={2.25} onSubmit={handleSubmit}>
      {errorMessage ? (
        <Alert severity="error">
          {errorMessage}
        </Alert>
      ) : null}

      <TextField
        label="Name"
        name="name"
        value={formValues.name}
        onChange={handleChange}
        fullWidth
        required
        disabled={isSubmitting}
        error={Boolean(fieldErrors.name)}
        helperText={fieldErrors.name || ""}
      />

      <TextField
        label="Email"
        name="email"
        type="email"
        value={formValues.email}
        onChange={handleChange}
        fullWidth
        required
        disabled={isSubmitting}
        error={Boolean(fieldErrors.email)}
        helperText={fieldErrors.email || ""}
      />

      <TextField
        select
        label="What are you interested in?"
        name="interest"
        value={formValues.interest}
        onChange={handleChange}
        fullWidth
        disabled={isSubmitting}
      >
        {interestOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label="Message"
        name="message"
        value={formValues.message}
        onChange={handleChange}
        fullWidth
        multiline
        minRows={4}
        disabled={isSubmitting}
        error={Boolean(fieldErrors.message)}
        helperText={
          fieldErrors.message ||
          "Tell us briefly how you would like to use CollectorOS."
        }
      />

      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={isSubmitting}
        sx={{
          minHeight: 48,
          mt: 1,
        }}
      >
        {isSubmitting ? "Submitting..." : "Request access"}
      </Button>
    </Stack>
  );
};

export default RequestAccessForm;