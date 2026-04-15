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
} from "@mui/material";
import { NavLink } from "react-router-dom";
import { navigationItems } from "./navigationItems";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { useUnreadWhatsNewCount } from "../../features/whats-new/hooks/useUnreadWhatsNewCount";

const drawerWidth = 260;

const SidebarContent = ({ onNavigate }) => {
  const { user } = useAuth();
  const { unreadCount } = useUnreadWhatsNewCount();

  const visibleNavigationItems = navigationItems.filter((item) => {
    if (!item.adminOnly) {
      return true;
    }

    return user?.role === "admin";
  });

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