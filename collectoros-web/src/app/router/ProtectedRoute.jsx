import { Navigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { hasAccessToken } from "../../features/auth/utils/authStorage";
import { useAuth } from "../../features/auth/hooks/useAuth";

const ProtectedRoute = ({ children }) => {
  const tokenExists = hasAccessToken();
  const { isAuthenticated, isLoading } = useAuth();

  if (!tokenExists) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading) {
    return (
      <Box
        minHeight="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;