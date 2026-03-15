import { useState } from "react";
import { Box, Toolbar } from "@mui/material";
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
          p: 3,
          mt: 8,
          ml: { xs: 0, md: `${drawerWidth}px` },
          width: { xs: "100%", md: `calc(100% - ${drawerWidth}px)` },
          bgcolor: "background.default",
        }}
      >
        <Outlet />
        <AppFooter />
      </Box>
    </Box>
  );
};

export default AppLayout;
