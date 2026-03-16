import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const AnalyticsItemSelector = ({
  value,
  onChange,
  items = [],
}) => {
  return (
    <FormControl fullWidth>
      <InputLabel>Select item</InputLabel>
      <Select
        label="Select item"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {items.map((item) => (
          <MenuItem key={item.id} value={item.id}>
            {item.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default AnalyticsItemSelector;