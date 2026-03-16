import { Paper, Typography } from "@mui/material";

const WishlistFilteredEmptyState = () => {
  return (
    <Paper
      sx={{
        p: 4,
        borderRadius: 4,
        textAlign: "center",
      }}
    >
      <Typography variant="h6" fontWeight={700} mb={1}>
        No wishlist items match your filters
      </Typography>

      <Typography variant="body2" color="text.secondary">
        Try adjusting your search, category, priority or sorting options.
      </Typography>
    </Paper>
  );
};

export default WishlistFilteredEmptyState;