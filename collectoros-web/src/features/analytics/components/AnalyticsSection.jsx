import { Box, Typography } from "@mui/material";

const AnalyticsSection = ({ title, children }) => {
  return (
    <Box sx={{ mb: 5 }}>
      <Typography variant="h5" fontWeight={700} mb={2.5}>
        {title}
      </Typography>

      {children}
    </Box>
  );
};

export default AnalyticsSection;