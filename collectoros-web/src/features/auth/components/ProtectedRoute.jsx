import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthToken } from "../hooks/useAuthToken";

const ProtectedRoute = () => {
  const tokenExists = useAuthToken();
  const location = useLocation();

  if (!tokenExists) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;