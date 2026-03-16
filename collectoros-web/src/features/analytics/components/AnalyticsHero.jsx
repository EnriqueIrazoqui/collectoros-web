import { Box, Stack, Typography } from "@mui/material";

const AnalyticsHero = () => {
  return (
    <Stack spacing={0.5} mb={4}>
      <Typography variant="h4" fontWeight={700}>
        Analytics
      </Typography>

      <Typography variant="body1" color="text.secondary">
        Explore your collection performance, category breakdown and market insights.
      </Typography>
    </Stack>
  );
};

export default AnalyticsHero;