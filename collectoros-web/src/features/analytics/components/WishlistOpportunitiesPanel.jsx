import { Box, Card, CardContent, Stack, Typography, Chip } from "@mui/material";
import { useWishlistOpportunities } from "../hooks/useWishlistOpportunities";
import CircularProgress from "@mui/material/CircularProgress";

const OpportunityItem = ({ item }) => {
  const difference = item.targetPrice - item.currentPrice;

  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent>
        <Stack spacing={1}>
          <Typography fontWeight={600}>{item.name}</Typography>

          <Stack direction="row" spacing={2}>
            <Typography variant="body2">
              Current: ${item.currentPrice}
            </Typography>

            <Typography variant="body2">
              Target: ${item.targetPrice}
            </Typography>
          </Stack>

          <Chip
            label={`$${difference} below target`}
            color="success"
            size="small"
          />
        </Stack>
      </CardContent>
    </Card>
  );
};

const WishlistOpportunitiesPanel = () => {
  const { data, isLoading, isError } = useWishlistOpportunities();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" py={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Typography color="error">
        Could not load wishlist opportunities.
      </Typography>
    );
  }

  const opportunities = data?.data || [];

  if (!opportunities.length) {
    return (
      <Typography color="text.secondary">
        No opportunities detected.
      </Typography>
    );
  }

  return (
    <Stack spacing={2}>
      {opportunities.map((item) => (
        <OpportunityItem key={item.id} item={item} />
      ))}
    </Stack>
  );
};

export default WishlistOpportunitiesPanel;