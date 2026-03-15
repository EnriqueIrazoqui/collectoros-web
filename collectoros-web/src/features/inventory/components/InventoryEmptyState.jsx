import { Paper, Typography } from "@mui/material";

const InventoryFilteredEmptyState = () => {
  return (
    <Paper
      sx={{
        p: 4,
        borderRadius: 4,
        textAlign: "center",
      }}
    >
      <Typography variant="h6" fontWeight={700} mb={1}>
        No items match your current filters
      </Typography>

      <Typography variant="body2" color="text.secondary">
        Try adjusting your search, category, or sorting options.
      </Typography>
    </Paper>
  );
};

export default InventoryFilteredEmptyState;