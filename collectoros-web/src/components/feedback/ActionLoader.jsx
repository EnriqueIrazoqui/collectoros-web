import { Backdrop, Box, CircularProgress, Typography } from "@mui/material";

const ActionLoader = ({
  open,
  title = "Processing...",
  subtitle = "Please wait a moment.",
}) => {
  return (
    <Backdrop
      open={open}
      sx={{
        position: "absolute",
        zIndex: 10,
        color: "#fff",
        borderRadius: 4,
      }}
    >
      <Box
        sx={{
          minWidth: 280,
          maxWidth: 360,
          px: 4,
          py: 3,
          borderRadius: 3,
          bgcolor: "rgba(18, 18, 18, 0.88)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: 1.5,
          boxShadow: 24,
        }}
      >
        <CircularProgress color="inherit" size={36} />
        <Typography variant="h6" fontWeight={700}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.85 }}>
          {subtitle}
        </Typography>
      </Box>
    </Backdrop>
  );
};

export default ActionLoader;