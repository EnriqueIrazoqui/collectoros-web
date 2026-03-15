import { Box, Typography } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

const DashboardItemRow = ({ name, category, value, gain }) => {
  const isPositive = Number(gain) >= 0;

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
        <Typography fontWeight={600}>{value}</Typography>

        {gain !== undefined && gain !== null ? (
          <Box
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
            gap={0.5}
          >
            {isPositive ? (
              <ArrowUpwardIcon sx={{ fontSize: 16, color: "success.main" }} />
            ) : (
              <ArrowDownwardIcon sx={{ fontSize: 16, color: "error.main" }} />
            )}

            <Typography
              variant="body2"
              color={isPositive ? "success.main" : "error.main"}
            >
              {isPositive ? `+${gain}` : gain}
            </Typography>
          </Box>
        ) : null}
      </Box>
    </Box>
  );
};

export default DashboardItemRow;
