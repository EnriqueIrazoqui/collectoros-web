import { IconButton, Tooltip } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const InfoTooltip = ({ title, placement = "top" }) => {
  return (
    <Tooltip title={title} placement={placement} arrow>
      <IconButton
        size="small"
        sx={{
          color: "text.secondary",
          p: 0.25,
          ml: 0.5,
        }}
      >
        <InfoOutlinedIcon fontSize="inherit" />
      </IconButton>
    </Tooltip>
  );
};

export default InfoTooltip;