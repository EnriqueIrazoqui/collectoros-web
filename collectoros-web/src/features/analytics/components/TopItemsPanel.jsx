import {
  Box,
  Card,
  CardContent,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import { formatCurrency } from "../../../utils/formatCurrency";
import InfoTooltip from "../../../components/common/InfoTooltip";

const TopItemsList = ({ title, items = [], mode = "value" }) => {
  const maxMetric = Math.max(
    ...items.map((item) =>
      mode === "value"
        ? Number(item.totalCurrentValue || 0)
        : Math.abs(Number(item.gain || 0)),
    ),
    1,
  );

  return (
    <Card
      sx={{
        borderRadius: 4,
        height: "100%",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: 6,
        },
      }}
    >
      <CardContent>
        <Stack spacing={3}>
          <Box display="flex" alignItems="center">
            <Typography variant="h6" fontWeight={700}>
              {title}
            </Typography>

            <InfoTooltip
              title={
                title.includes("valuable")
                  ? "Items with the highest current estimated market value."
                  : "Items with the highest profit compared to their purchase price."
              }
            />
          </Box>

          {items.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No items available
            </Typography>
          ) : (
            items.map((item) => {
              const currentValue = Number(item.totalCurrentValue || 0);
              const gain = Number(item.gain || 0);

              const metricValue =
                mode === "value" ? currentValue : Math.abs(gain);

              const progress = (metricValue / maxMetric) * 100;

              return (
                <Box key={item.id}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: 2,
                      mb: 1,
                    }}
                  >
                    <Box>
                      <Typography fontWeight={600}>{item.name}</Typography>

                      <Typography variant="body2" color="text.secondary">
                        {item.category}
                      </Typography>
                    </Box>

                    <Box textAlign="right">
                      <Typography fontWeight={700}>
                        {formatCurrency(currentValue)}
                      </Typography>

                      <Typography
                        variant="body2"
                        color={gain >= 0 ? "success.main" : "error.main"}
                        fontWeight={600}
                      >
                        {gain > 0 ? "+" : ""}
                        {formatCurrency(gain)}
                      </Typography>
                    </Box>
                  </Box>

                  <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{
                      height: 8,
                      borderRadius: 999,
                      backgroundColor: "#23314d",
                      "& .MuiLinearProgress-bar": {
                        borderRadius: 999,
                        backgroundColor:
                          mode === "value" ? "#7c6cff" : "#5fd38d",
                      },
                    }}
                  />
                </Box>
              );
            })
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

const TopItemsPanel = ({ data }) => {
  const topValuableItems = data?.topValuableItems || [];
  const topProfitableItems = data?.topProfitableItems || [];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          lg: "repeat(2, 1fr)",
        },
        gap: 2,
      }}
    >
      <TopItemsList
        title="Top valuable items"
        items={topValuableItems}
        mode="value"
      />

      <TopItemsList
        title="Top profitable items"
        items={topProfitableItems}
        mode="profit"
      />
    </Box>
  );
};

export default TopItemsPanel;
