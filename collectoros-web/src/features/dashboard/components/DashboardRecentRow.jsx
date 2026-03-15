import { Box, Typography } from "@mui/material";
import { formatCurrency } from "../../../utils/formatCurrency";

const DashboardRecentRow = ({ name, category, value, date }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        py: 1,
      }}
    >
      <Box>
        <Typography fontWeight={600}>{name}</Typography>

        <Typography variant="body2" color="text.secondary">
          {category}
        </Typography>
      </Box>

      <Box textAlign="right">
        <Typography fontWeight={600}>
          {formatCurrency(value)}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {date}
        </Typography>
      </Box>
    </Box>
  );
};

export default DashboardRecentRow;