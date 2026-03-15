import { Box, Stack, Typography } from "@mui/material";
import { formatCurrency } from "../../../utils/formatCurrency";

const DashboardOpportunityList = ({ title, items = [], emptyText = "No items found" }) => {
  return (
    <Stack spacing={1.5}>
      <Typography variant="subtitle1" fontWeight={700}>
        {title}
      </Typography>

      {items.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          {emptyText}
        </Typography>
      ) : (
        items.map((item) => (
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
                {formatCurrency(item.currentObservedValue ?? item.currentMarketPrice ?? 0)}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Target: {formatCurrency(item.targetPrice ?? 0)}
              </Typography>
            </Box>
          </Box>
        ))
      )}
    </Stack>
  );
};

export default DashboardOpportunityList;