import { Box, Button, Grid, Paper, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

import LoginForm from "../components/LoginForm";
import LoginProductPreview from "../components/LoginProductPreview";
import { useLogin } from "../hooks/useLogin";

const LoginPage = () => {
  const navigate = useNavigate();
  const loginMutation = useLogin();

  const handleLogin = async (formValues) => {
    try {
      await loginMutation.mutateAsync(formValues);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const errorMessage = loginMutation.isError
    ? loginMutation.error?.response?.data?.message || "Log in failed."
    : "";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        bgcolor: "background.default",
        px: { xs: 2, md: 5 },
        py: 4,
      }}
    >
      <Grid
        container
        spacing={{ xs: 4, md: 7 }}
        alignItems="center"
        sx={{
          width: "100%",
          maxWidth: 1250,
          mx: "auto",
        }}
      >
        {/* LOGIN */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Box
            sx={{
              width: "100%",
              maxWidth: 455,
              mx: "auto",
            }}
          >
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/overview")}
              sx={{
                mb: 1,
                px: 0,
              }}
            >
              Discover CollectorOS
            </Button>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 3,
                maxWidth: 380,
                lineHeight: 1.6,
              }}
            >
              New here? Explore how CollectorOS works and request access if
              you'd like to try the app.
            </Typography>

            <Paper
              elevation={3}
              sx={{
                p: { xs: 3.5, sm: 4.5 },
                minHeight: 390,
                borderRadius: 4,
                border: "1px solid",
                borderColor: "divider",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
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
                  Welcome back
                </Typography>

                <Typography variant="h4" fontWeight={800}>
                  CollectorOS
                </Typography>

                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{
                    maxWidth: 330,
                    lineHeight: 1.6,
                  }}
                >
                  Sign in to continue managing and tracking your collection.
                </Typography>
              </Stack>

              <Box
                sx={{
                  "& form": {
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  },
                  "& .MuiButton-root": {
                    minHeight: 46,
                    mt: 1.5,
                  },
                }}
              >
                <LoginForm
                  onSubmit={handleLogin}
                  isLoading={loginMutation.isPending}
                  errorMessage={errorMessage}
                />
              </Box>

              <Typography
                variant="caption"
                color="text.secondary"
                textAlign="center"
                sx={{ mt: 3 }}
              >
                Secure access to your CollectorOS workspace.
              </Typography>
            </Paper>
          </Box>
        </Grid>

        {/* PRODUCT PREVIEW */}
        <Grid
          size={{ xs: 12, md: 7 }}
          sx={{
            display: {
              xs: "none",
              md: "block",
            },
          }}
        >
          <LoginProductPreview />
        </Grid>
      </Grid>
    </Box>
  );
};

export default LoginPage;
