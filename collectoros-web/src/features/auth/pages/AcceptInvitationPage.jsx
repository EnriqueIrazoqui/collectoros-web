import {
  Box,
  Button,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useNavigate, useSearchParams } from "react-router-dom";

import AcceptInvitationForm from "../components/AcceptInvitationForm";
import { useAcceptInvitation } from "../hooks/useAcceptInvitation";

const AcceptInvitationPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const acceptInvitationMutation = useAcceptInvitation();

  const handleSubmit = async ({ password }) => {
    await acceptInvitationMutation.mutateAsync({
      token,
      password,
    });
  };

  const errorMessage = acceptInvitationMutation.isError
    ? acceptInvitationMutation.error?.response?.data?.message ||
      "Could not create your CollectorOS account."
    : "";

  if (!token) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          bgcolor: "background.default",
          px: 2,
        }}
      >
        <Paper
          variant="outlined"
          sx={{
            width: "100%",
            maxWidth: 520,
            p: { xs: 3, sm: 5 },
            borderRadius: 4,
            textAlign: "center",
          }}
        >
          <Stack spacing={2.5} alignItems="center">
            <ErrorOutlineIcon
              color="error"
              sx={{
                fontSize: 64,
              }}
            />

            <Typography variant="h4" fontWeight={800}>
              Invalid invitation
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 400 }}
            >
              This invitation link is incomplete or invalid.
            </Typography>

            <Button
              variant="contained"
              onClick={() => navigate("/")}
            >
              Back to CollectorOS
            </Button>
          </Stack>
        </Paper>
      </Box>
    );
  }

  if (acceptInvitationMutation.isSuccess) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          bgcolor: "background.default",
          px: 2,
        }}
      >
        <Paper
          variant="outlined"
          sx={{
            width: "100%",
            maxWidth: 520,
            p: { xs: 3, sm: 5 },
            borderRadius: 4,
            textAlign: "center",
          }}
        >
          <Stack spacing={2.5} alignItems="center">
            <CheckCircleOutlineIcon
              color="success"
              sx={{
                fontSize: 64,
              }}
            />

            <Typography variant="h4" fontWeight={800}>
              Your account is ready
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                maxWidth: 400,
                lineHeight: 1.7,
              }}
            >
              Your CollectorOS account has been created successfully. You can
              now sign in using your email and password.
            </Typography>

            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/login", { replace: true })}
            >
              Go to login
            </Button>
          </Stack>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        bgcolor: "background.default",
        px: 2,
        py: 4,
      }}
    >
      <Paper
        variant="outlined"
        sx={{
          width: "100%",
          maxWidth: 480,
          p: { xs: 3.5, sm: 4.5 },
          borderRadius: 4,
        }}
      >
        <Stack spacing={1} mb={3.5}>
          <Typography
            variant="overline"
            color="primary.main"
            sx={{
              letterSpacing: "0.12em",
              fontWeight: 700,
            }}
          >
            CollectorOS invitation
          </Typography>

          <Typography variant="h4" fontWeight={800}>
            Create your account
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              lineHeight: 1.7,
            }}
          >
            Your access request has been approved. Create a password to finish
            setting up your CollectorOS account.
          </Typography>
        </Stack>

        <AcceptInvitationForm
          onSubmit={handleSubmit}
          isSubmitting={acceptInvitationMutation.isPending}
          errorMessage={errorMessage}
        />
      </Paper>
    </Box>
  );
};

export default AcceptInvitationPage;