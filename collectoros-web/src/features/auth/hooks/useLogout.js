import { useNavigate } from "react-router-dom";
import { removeAccessToken } from "../utils/authStorage";

export const useLogout = () => {
  const navigate = useNavigate();

  const logout = () => {
    removeAccessToken();
    navigate("/login", { replace: true });
  };

  return { logout };
};