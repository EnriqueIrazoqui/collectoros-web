import { Box, Typography, Button, Paper } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const WishlistEmptyState = ({ onAddItem }) => {
  return (
    <Paper
      sx={{
        p: 4,
        borderRadius: 4,
        textAlign: "center",
      }}
    >
      <Box>
        <Typography variant="h6" fontWeight={700} mb={1}>
          No wishlist items yet
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={3}>
          Start tracking the items you want to buy in the future.
        </Typography>

        <Button variant="contained" startIcon={<AddIcon />} onClick={onAddItem}>
          Add your first item
        </Button>
      </Box>
    </Paper>
  );
};

export default WishlistEmptyState;