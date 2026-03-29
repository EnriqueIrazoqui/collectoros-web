import { Card, CardContent, Stack, Typography } from "@mui/material";

const TipsSection = () => {
  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h5" fontWeight={600}>
            Tips
          </Typography>

          <Stack spacing={1}>
            <Typography variant="body2" color="text.secondary">
              Keep your inventory updated so your summaries and analytics stay useful.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Use Wishlist for future goals, not for items you already own.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Check your Dashboard regularly for a quick view of your collection status.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              The more complete your item data is, the more valuable your analytics become.
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default TipsSection;