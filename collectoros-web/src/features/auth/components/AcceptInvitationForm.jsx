import { useState } from "react";
import {
  Alert,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

const AcceptInvitationForm = ({
  onSubmit,
  isSubmitting = false,
  errorMessage = "",
}) => {
  const [formValues, setFormValues] = useState({
    password: "",
    confirmPassword: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const validatePassword = (password) => {
    if (!password) {
      return "Password is required.";
    }

    if (password.length < 8) {
      return "Password must contain at least 8 characters.";
    }

    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter.";
    }

    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter.";
    }

    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = {};

    const passwordError = validatePassword(formValues.password);

    if (passwordError) {
      nextErrors.password = passwordError;
    }

    if (!formValues.confirmPassword) {
      nextErrors.confirmPassword = "Please confirm your password.";
    } else if (formValues.password !== formValues.confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      return;
    }

    setFieldErrors({});

    try {
      await onSubmit({
        password: formValues.password,
      });
    } catch (error) {
      const backendErrors = error?.response?.data?.errors || [];

      if (backendErrors.length > 0) {
        const nextBackendErrors = backendErrors.reduce((acc, current) => {
          if (current?.path) {
            acc[current.path] = current.message;
          }

          return acc;
        }, {});

        setFieldErrors(nextBackendErrors);
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
        label="New password"
        name="password"
        type={showPassword ? "text" : "password"}
        value={formValues.password}
        onChange={handleChange}
        fullWidth
        required
        disabled={isSubmitting}
        error={Boolean(fieldErrors.password)}
        helperText={
          fieldErrors.password ||
          "Minimum 8 characters, with uppercase, lowercase and a number."
        }
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword((prev) => !prev)}
                  edge="end"
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  {showPassword ? (
                    <VisibilityOffOutlinedIcon />
                  ) : (
                    <VisibilityOutlinedIcon />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />

      <TextField
        label="Confirm password"
        name="confirmPassword"
        type={showConfirmPassword ? "text" : "password"}
        value={formValues.confirmPassword}
        onChange={handleChange}
        fullWidth
        required
        disabled={isSubmitting}
        error={Boolean(fieldErrors.confirmPassword)}
        helperText={fieldErrors.confirmPassword || ""}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  edge="end"
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirmation password"
                      : "Show confirmation password"
                  }
                >
                  {showConfirmPassword ? (
                    <VisibilityOffOutlinedIcon />
                  ) : (
                    <VisibilityOutlinedIcon />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
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
        {isSubmitting ? "Creating account..." : "Create account"}
      </Button>
    </Stack>
  );
};

export default AcceptInvitationForm;