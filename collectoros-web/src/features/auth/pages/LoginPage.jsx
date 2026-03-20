import { Box, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import { useLogin } from "../hooks/useLogin";

const LoginPage = () => {
  const navigate = useNavigate();
  const loginMutation = useLogin();

const handleLogin = async (formValues) => {
  try {
    await loginMutation.mutateAsync(formValues);
    navigate("/", { replace: true });
  } catch (error) {
    console.error("Login error:", error);
  }
};

 const errorMessage = loginMutation.isError
  ? loginMutation.error?.response?.data?.message ||
    "Log in failed."
  : "";

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      px={2}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 420,
          borderRadius: 3,
        }}
      >
        <Typography variant="h4" fontWeight={700} mb={1}>
          CollectorOS
        </Typography>

        <Typography variant="body1" color="text.secondary" mb={3}>
          log in to continue
        </Typography>

        <LoginForm
          onSubmit={handleLogin}
          isLoading={loginMutation.isPending}
          errorMessage={errorMessage}
        />
      </Paper>
    </Box>
  );
};

export default LoginPage;
