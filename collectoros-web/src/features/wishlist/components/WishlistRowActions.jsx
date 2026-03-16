import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState } from "react";

const WishlistRowActions = ({ onView, onEdit, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleAction = (callback) => {
    handleCloseMenu();

    if (callback) {
      callback();
    }
  };

  return (
    <>
      <IconButton onClick={handleOpenMenu} size="small">
        <MoreVertIcon fontSize="small" />
      </IconButton>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
        <MenuItem onClick={() => handleAction(onView)}>View</MenuItem>
        <MenuItem onClick={() => handleAction(onEdit)}>Edit</MenuItem>
        <MenuItem onClick={() => handleAction(onDelete)}>Delete</MenuItem>
      </Menu>
    </>
  );
};

export default WishlistRowActions;