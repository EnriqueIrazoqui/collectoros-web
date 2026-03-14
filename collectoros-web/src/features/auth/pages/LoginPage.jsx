import { useEffect } from "react";
import { Box, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import { useLogin } from "../hooks/useLogin";
import { hasAccessToken } from "../utils/authStorage";

const LoginPage = () => {
  const navigate = useNavigate();
  const loginMutation = useLogin();

  useEffect(() => {
    if (hasAccessToken()) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (formValues) => {
    try {
      const response = await loginMutation.mutateAsync(formValues);

      const token = response.data.accessToken;

      localStorage.setItem("collectoros_token", token);

      navigate("/", { replace: true });
    } catch (error) {
      console.error(error);
    }
  };

  const errorMessage =
    loginMutation.error?.response?.data?.message ||
    "No fue posible iniciar sesión.";

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
          Inicia sesión para continuar
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
