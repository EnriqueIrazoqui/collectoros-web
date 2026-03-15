import { Box, Typography } from "@mui/material";

const DashboardSection = ({ title, children }) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" fontWeight={700} mb={2}>
        {title}
      </Typography>

      {children}
    </Box>
  );
};

export default DashboardSection;