import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const WishlistToolbar = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedPriority,
  onPriorityChange,
  selectedStatus,
  onStatusChange,
  sortBy,
  onSortChange,
  categories = [],
  onAddItem,
}) => {
  return (
    <Stack spacing={2} mb={3}>
      <Box>
        <Typography variant="h4" fontWeight={700}>
          Wishlist
        </Typography>

        <Typography variant="body1" color="text.secondary">
          Track items you want and monitor their target prices.
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "2fr 1fr 1fr 1fr 1fr auto",
          },
          gap: 2,
          alignItems: "center",
        }}
      >
        <TextField
          placeholder="Search by name or category"
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          fullWidth
        />

        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select
            label="Category"
            value={selectedCategory}
            onChange={(event) => onCategoryChange(event.target.value)}
          >
            <MenuItem value="all">All</MenuItem>

            {categories.map((category) => (
              <MenuItem key={category.value} value={category.value}>
                {category.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Priority</InputLabel>
          <Select
            label="Priority"
            value={selectedPriority}
            onChange={(event) => onPriorityChange(event.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="High">High</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Low">Low</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select
            label="Status"
            value={selectedStatus}
            onChange={(event) => onStatusChange(event.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="buy_now">Buy now</MenuItem>
            <MenuItem value="near_target">Near target</MenuItem>
            <MenuItem value="price_dropped">Price dropped</MenuItem>
            <MenuItem value="tracking_error">Tracking issue</MenuItem>
            <MenuItem value="watching">Watching</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Sort</InputLabel>
          <Select
            label="Sort"
            value={sortBy}
            onChange={(event) => onSortChange(event.target.value)}
          >
            <MenuItem value="name-asc">Name A-Z</MenuItem>
            <MenuItem value="name-desc">Name Z-A</MenuItem>
            <MenuItem value="targetPrice-desc">Target price ↓</MenuItem>
            <MenuItem value="targetPrice-asc">Target price ↑</MenuItem>
            <MenuItem value="observed-desc">Observed price ↓</MenuItem>
            <MenuItem value="observed-asc">Observed price ↑</MenuItem>
            <MenuItem value="delta-desc">Best opportunity</MenuItem>
            <MenuItem value="delta-asc">Worst opportunity</MenuItem>
          </Select>
        </FormControl>

        <Button variant="contained" startIcon={<AddIcon />} onClick={onAddItem}>
          Add item
        </Button>
      </Box>
    </Stack>
  );
};

export default WishlistToolbar;