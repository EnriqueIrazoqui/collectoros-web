import { Card, CardContent, Stack, Typography } from "@mui/material";

const QuickStartSteps = () => {
  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h5" fontWeight={600}>
            Recommended first steps
          </Typography>

          <Stack spacing={1.5}>
            <Typography variant="body2">
              1. Add your first inventory item so CollectorOS has a starting point.
            </Typography>
            <Typography variant="body2">
              2. Add one wishlist item to begin tracking future goals.
            </Typography>
            <Typography variant="body2">
              3. Review the dashboard to understand your current collection snapshot.
            </Typography>
            <Typography variant="body2">
              4. Explore analytics after you have added enough data to generate useful insights.
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default QuickStartSteps;