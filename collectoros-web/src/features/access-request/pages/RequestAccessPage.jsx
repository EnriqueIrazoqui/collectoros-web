import {
  Box,
  Button,
  Chip,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import { useNavigate } from "react-router-dom";

import RequestAccessForm from "../components/RequestAccessForm";
import { useCreateAccessRequest } from "../hooks/useCreateAccessRequest";

const RequestAccessPage = () => {
  const navigate = useNavigate();
  const createAccessRequestMutation = useCreateAccessRequest();

  const handleSubmit = async (payload) => {
    await createAccessRequestMutation.mutateAsync(payload);
  };

  const errorMessage = createAccessRequestMutation.isError
    ? createAccessRequestMutation.error?.response?.data?.message ||
      "Could not submit your access request."
    : "";

  if (createAccessRequestMutation.isSuccess) {
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
            maxWidth: 540,
            p: { xs: 3, sm: 5 },
            borderRadius: 4,
            textAlign: "center",
          }}
        >
          <Stack spacing={2.5} alignItems="center">
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                bgcolor: "success.main",
                color: "success.contrastText",
              }}
            >
              ✓
            </Box>

            <Typography variant="h4" fontWeight={800}>
              Request received
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 420 }}
            >
              Thanks for your interest in CollectorOS. Your request has been
              submitted and will be reviewed shortly.
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

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        px: { xs: 2, md: 5 },
        py: { xs: 4, md: 6 },
        display: "flex",
        alignItems: "center",
      }}
    >
      <Grid
        container
        spacing={{ xs: 4, md: 7 }}
        alignItems="center"
        sx={{
          width: "100%",
          maxWidth: 1200,
          mx: "auto",
        }}
      >
        <Grid size={{ xs: 12, md: 5 }}>
          <Box sx={{ maxWidth: 460, mx: "auto" }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/")}
              sx={{ mb: 3, px: 0 }}
            >
              Back to overview
            </Button>

            <Paper
              variant="outlined"
              sx={{
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
                  Request access
                </Typography>

                <Typography variant="h4" fontWeight={800}>
                  Try CollectorOS
                </Typography>

                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ lineHeight: 1.7 }}
                >
                  Tell us a little about yourself and how you would like to use
                  CollectorOS.
                </Typography>
              </Stack>

              <RequestAccessForm
                onSubmit={handleSubmit}
                isSubmitting={createAccessRequestMutation.isPending}
                errorMessage={errorMessage}
              />
            </Paper>
          </Box>
        </Grid>

        <Grid
          size={{ xs: 12, md: 7 }}
          sx={{
            display: { xs: "none", md: "block" },
          }}
        >
          <Paper
            variant="outlined"
            sx={{
              p: 4,
              borderRadius: 5,
            }}
          >
            <Stack spacing={3}>
              <Box>
                <Chip
                  label="Private preview access"
                  color="primary"
                  variant="outlined"
                  sx={{ mb: 2 }}
                />

                <Typography variant="h3" fontWeight={800}>
                  See if CollectorOS fits your collection.
                </Typography>

                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mt: 1.5, lineHeight: 1.8 }}
                >
                  Explore inventory management, automatic market value
                  tracking, price history, and smart wishlist tools.
                </Typography>
              </Box>

              <Stack spacing={2}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <AutoAwesomeOutlinedIcon color="primary" />

                  <Box>
                    <Typography fontWeight={700}>
                      Automatic value tracking
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Keep compatible collection values updated automatically.
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={2} alignItems="center">
                  <TimelineOutlinedIcon color="primary" />

                  <Box>
                    <Typography fontWeight={700}>
                      Historical insight
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Understand how the value of your items changes over time.
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={2} alignItems="center">
                  <LockOutlinedIcon color="primary" />

                  <Box>
                    <Typography fontWeight={700}>
                      Controlled access
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Requests are reviewed before CollectorOS access is granted.
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RequestAccessPage;