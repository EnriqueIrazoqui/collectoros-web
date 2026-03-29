import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar, { drawerWidth } from "./Sidebar";
import Topbar from "./Topbar";
import AppFooter from "./AppFooter";

import { useAuth } from "../../features/auth/hooks/useAuth";
import { useMarkWelcomeSeen } from "../../features/auth/hooks/useMarkWelcomeSeen";
import WelcomeDialog from "../../features/auth/components/WelcomeDialog";

const AppLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(false);
  const [hasCheckedWelcome, setHasCheckedWelcome] = useState(false);

  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();
  const markWelcomeSeenMutation = useMarkWelcomeSeen();

  const handleToggleDrawer = () => {
    setMobileOpen((prev) => !prev);
  };

  const handleCloseDrawer = () => {
    setMobileOpen(false);
  };

  useEffect(() => {
    if (!isAuthenticated || isLoading || !user || hasCheckedWelcome) {
      return;
    }

    if (!user.hasSeenWelcome) {
      setIsWelcomeOpen(true);
    }

    setHasCheckedWelcome(true);
  }, [isAuthenticated, isLoading, user, hasCheckedWelcome]);

  const markWelcomeSeen = async () => {
    if (!user?.hasSeenWelcome) {
      await markWelcomeSeenMutation.mutateAsync();
    }
  };

  const handleStartNow = async () => {
    try {
      await markWelcomeSeen();
      setIsWelcomeOpen(false);
    } catch (error) {
      console.error("Mark welcome as seen error:", error);
    }
  };

  const handleViewGuide = async () => {
    try {
      await markWelcomeSeen();
      setIsWelcomeOpen(false);
      navigate("/get-started");
    } catch (error) {
      console.error("Mark welcome as seen error:", error);
    }
  };

  return (
    <>
      <WelcomeDialog
        open={isWelcomeOpen}
        onStartNow={handleStartNow}
        onViewGuide={handleViewGuide}
        isSubmitting={markWelcomeSeenMutation.isPending}
      />

      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <Topbar onMenuClick={handleToggleDrawer} />
        <Sidebar mobileOpen={mobileOpen} onClose={handleCloseDrawer} />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            minWidth: 0,
            ml: { xs: 0, md: `${drawerWidth}px` },
            mt: 8,
            p: 3,
            bgcolor: "background.default",
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: "1400px",
              mx: "auto",
            }}
          >
            <Outlet />
            <AppFooter />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default AppLayout;