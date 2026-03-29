import { Button, Card, CardContent, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const GuideHero = () => {
  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h4" fontWeight={700}>
            Get started with CollectorOS
          </Typography>

          <Typography variant="body1" color="text.secondary">
            CollectorOS helps you organize your inventory, track wishlist items,
            and review collection insights in one place.
          </Typography>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Button component={RouterLink} to="/inventory" variant="contained">
              Go to Inventory
            </Button>

            <Button component={RouterLink} to="/wishlist" variant="outlined">
              Go to Wishlist
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default GuideHero;