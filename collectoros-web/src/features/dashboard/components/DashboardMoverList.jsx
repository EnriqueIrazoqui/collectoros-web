import { Box, Stack, Typography } from "@mui/material";
import { formatCurrency } from "../../../utils/formatCurrency";

const DashboardMoverList = ({ title, items = [], direction = "up" }) => {
  return (
    <Stack spacing={1.5}>
      <Typography variant="subtitle1" fontWeight={700}>
        {title}
      </Typography>

      {items.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No items in this category yet
        </Typography>
      ) : (
        items.map((item) => {
          const changeValue =
            item.priceChange ??
            item.change ??
            item.delta ??
            item.gainLoss ??
            0;

          return (
            <Box
              key={item.id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                py: 1,
              }}
            >
              <Box>
                <Typography fontWeight={600}>{item.name}</Typography>

                <Typography variant="body2" color="text.secondary">
                  {item.category}
                </Typography>
              </Box>

              <Box textAlign="right">
                <Typography fontWeight={600}>
                  {formatCurrency(item.currentValue ?? item.currentEstimatedValue ?? 0)}
                </Typography>

                <Typography
                  variant="body2"
                  color={direction === "up" ? "success.main" : "error.main"}
                >
                  {direction === "up" ? "+" : "-"}
                  {formatCurrency(Math.abs(changeValue))}
                </Typography>
              </Box>
            </Box>
          );
        })
      )}
    </Stack>
  );
};

export default DashboardMoverList;