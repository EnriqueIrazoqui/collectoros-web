import { AppBar, Toolbar, IconButton, Typography, Box, Avatar } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const Topbar = ({ onMenuClick }) => {
  return (
    <AppBar
      position="fixed"
      color="inherit"
      elevation={1}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={onMenuClick}
            sx={{ display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap>
            CollectorOS
          </Typography>
        </Box>

        <Avatar sx={{ width: 36, height: 36 }}>C</Avatar>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;