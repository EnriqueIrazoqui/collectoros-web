import { useState } from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar, { drawerWidth } from "./Sidebar";
import Topbar from "./Topbar";
import AppFooter from "./AppFooter";

const AppLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleToggleDrawer = () => {
    setMobileOpen((prev) => !prev);
  };

  const handleCloseDrawer = () => {
    setMobileOpen(false);
  };

  return (
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
  );
};

export default AppLayout;