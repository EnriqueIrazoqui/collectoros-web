import { Navigate } from "react-router-dom";
import { hasAccessToken } from "../../features/auth/utils/authStorage";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = hasAccessToken();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;