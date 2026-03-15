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

const InventoryToolbar = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  categories = [],
  onAddItem,
}) => {
  return (
    <Stack spacing={2} mb={3}>
      <Box>
        <Typography variant="h4" fontWeight={700}>
          Inventory
        </Typography>

        <Typography variant="body1" color="text.secondary">
          Manage and review all items in your collection.
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "2fr 1fr 1fr auto",
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
            <MenuItem value="all">All categories</MenuItem>

            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Sort by</InputLabel>
          <Select
            label="Sort by"
            value={sortBy}
            onChange={(event) => onSortChange(event.target.value)}
          >
            <MenuItem value="name-asc">Name (A-Z)</MenuItem>
            <MenuItem value="name-desc">Name (Z-A)</MenuItem>
            <MenuItem value="purchasePrice-desc">Purchase price (high-low)</MenuItem>
            <MenuItem value="purchasePrice-asc">Purchase price (low-high)</MenuItem>
            <MenuItem value="estimatedValue-desc">Estimated value (high-low)</MenuItem>
            <MenuItem value="estimatedValue-asc">Estimated value (low-high)</MenuItem>
            <MenuItem value="gain-desc">Gain / Loss (high-low)</MenuItem>
            <MenuItem value="gain-asc">Gain / Loss (low-high)</MenuItem>
            <MenuItem value="purchaseDate-desc">Purchase date (newest)</MenuItem>
            <MenuItem value="purchaseDate-asc">Purchase date (oldest)</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAddItem}
          sx={{ whiteSpace: "nowrap" }}
        >
          Add item
        </Button>
      </Box>
    </Stack>
  );
};

export default InventoryToolbar;