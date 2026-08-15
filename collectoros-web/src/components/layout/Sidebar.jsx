import { useState } from "react";
import {
  Drawer,
  Box,
  Toolbar,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Chip,
  Collapse,
} from "@mui/material";

import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { NavLink, useLocation } from "react-router-dom";
import { navigationItems } from "./navigationItems";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { useUnreadWhatsNewCount } from "../../features/whats-new/hooks/useUnreadWhatsNewCount";

const drawerWidth = 260;

const SidebarContent = ({ onNavigate }) => {
  const { user } = useAuth();
  const { unreadCount } = useUnreadWhatsNewCount();

  const location = useLocation();

  const [openMenus, setOpenMenus] = useState({
    Admin: location.pathname.startsWith("/admin"),
  });

  const visibleNavigationItems = navigationItems.filter((item) => {
    if (!item.adminOnly) {
      return true;
    }

    return user?.role === "admin";
  });

  const handleToggleMenu = (label) => {
    setOpenMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <Box>
      <Toolbar>
        <Typography variant="h6" fontWeight={700}>
          CollectorOS
        </Typography>
      </Toolbar>

      <List>
        {visibleNavigationItems.map((item) => {
          const Icon = item.icon;

          /*
           * ITEM CON SUBMENÚ
           */
          if (item.children) {
            const isOpen = Boolean(openMenus[item.label]);

            const childIsActive = item.children.some(
              (child) => location.pathname === child.path,
            );

            return (
              <Box key={item.label}>
                <ListItemButton
                  onClick={() => handleToggleMenu(item.label)}
                  sx={{
                    mx: 1,
                    mb: 0.5,
                    borderRadius: 2,
                    bgcolor: childIsActive ? "action.selected" : "transparent",
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Icon />
                  </ListItemIcon>

                  <ListItemText primary={item.label} />

                  {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </ListItemButton>

                <Collapse in={isOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.children.map((child) => {
                      const ChildIcon = child.icon;

                      return (
                        <ListItemButton
                          key={child.path}
                          component={NavLink}
                          to={child.path}
                          onClick={onNavigate}
                          sx={{
                            mx: 1,
                            mb: 0.5,
                            pl: 4,
                            borderRadius: 2,

                            "&.active": {
                              bgcolor: "primary.main",
                              color: "primary.contrastText",
                            },

                            "&.active .MuiListItemIcon-root": {
                              color: "primary.contrastText",
                            },
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 40 }}>
                            <ChildIcon fontSize="small" />
                          </ListItemIcon>

                          <ListItemText primary={child.label} />
                        </ListItemButton>
                      );
                    })}
                  </List>
                </Collapse>
              </Box>
            );
          }

          /*
           * ITEM NORMAL
           */
          const isWhatsNewItem = item.path === "/whats-new";

          return (
            <ListItemButton
              key={item.path}
              component={NavLink}
              to={item.path}
              onClick={onNavigate}
              sx={{
                mx: 1,
                mb: 0.5,
                borderRadius: 2,

                "&.active": {
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                },

                "&.active .MuiListItemIcon-root": {
                  color: "primary.contrastText",
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Icon />
              </ListItemIcon>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  gap: 1,
                }}
              >
                <ListItemText primary={item.label} />

                {isWhatsNewItem && unreadCount > 0 ? (
                  <Chip
                    label={unreadCount > 99 ? "99+" : unreadCount}
                    color="primary"
                    size="small"
                    sx={{
                      height: 22,
                      minWidth: 22,
                      fontWeight: 700,
                      borderRadius: "999px",

                      "& .MuiChip-label": {
                        px: 1,
                      },
                    }}
                  />
                ) : null}
              </Box>
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );
};

const Sidebar = ({ mobileOpen, onClose }) => {
  return (
    <>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <SidebarContent onNavigate={onClose} />
      </Drawer>

      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <SidebarContent />
      </Drawer>
    </>
  );
};

export default Sidebar;
export { drawerWidth };
