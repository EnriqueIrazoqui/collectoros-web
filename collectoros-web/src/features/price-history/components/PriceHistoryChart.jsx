import { Box, Paper, Stack, Typography, useTheme } from "@mui/material";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ReferenceLine,
} from "recharts";
import {
  formatPriceHistoryCurrency,
  transformPriceHistoryForChart,
} from "../utils/formatPriceHistory";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;

  const point = payload[0]?.payload;
  const change = Number(point?.change || 0);
  const isPositive = change > 0;
  const isNegative = change < 0;

  return (
    <Paper
      elevation={8}
      sx={{
        px: 1.5,
        py: 1.25,
        borderRadius: 2,
        minWidth: 190,
      }}
    >
      <Stack spacing={0.5}>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>

        <Typography variant="subtitle2" fontWeight={700}>
          {formatPriceHistoryCurrency(point?.price || 0)}
        </Typography>

        {point?.previousPrice !== null ? (
          <Typography
            variant="caption"
            color={
              isPositive
                ? "success.main"
                : isNegative
                  ? "error.main"
                  : "text.secondary"
            }
          >
            {isPositive ? "+" : ""}
            {formatPriceHistoryCurrency(change)}{" "}
            {point.changePercent
              ? `(${isPositive ? "+" : ""}${point.changePercent.toFixed(2)}%)`
              : ""}
          </Typography>
        ) : null}

        <Typography variant="caption" color="text.secondary">
          Source: {point?.source || "Manual"}
        </Typography>
      </Stack>
    </Paper>
  );
}

const PriceHistoryChart = ({ history = [] }) => {
  const theme = useTheme();
  const chartData = transformPriceHistoryForChart(history);

  if (!chartData.length) {
    return (
      <Box
        sx={{
          border: "1px dashed",
          borderColor: "divider",
          borderRadius: 3,
          p: 3,
          textAlign: "center",
        }}
      >
        <Typography variant="subtitle2" fontWeight={700}>
          No chart data yet
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Add more price records to visualize the trend over time.
        </Typography>
      </Box>
    );
  }

  if (chartData.length === 1) {
    return (
      <Box
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
          p: 3,
        }}
      >
        <Typography variant="subtitle2" fontWeight={700} mb={1}>
          Price trend
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={2}>
          At least two records are recommended to visualize a trend.
        </Typography>

        <Typography variant="h5" fontWeight={700}>
          {formatPriceHistoryCurrency(chartData[0].price)}
        </Typography>

        <Typography variant="caption" color="text.secondary">
          Recorded on {chartData[0].date}
        </Typography>
      </Box>
    );
  }

  const firstPrice = chartData[0]?.price || 0;
  const lastPrice = chartData[chartData.length - 1]?.price || 0;
  const isUptrend = lastPrice > firstPrice;
  const isDowntrend = lastPrice < firstPrice;

  const lineColor = isUptrend
    ? theme.palette.success.main
    : isDowntrend
      ? theme.palette.error.main
      : theme.palette.primary.main;

  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        p: 2,
      }}
    >
      <Stack spacing={0.5} mb={2}>
        <Typography variant="subtitle1" fontWeight={700}>
          Price trend
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Historical market value movement for this item.
        </Typography>

        {chartData.length < 3 ? (
          <Typography variant="caption" color="text.secondary">
            More records will make this trend easier to analyze.
          </Typography>
        ) : null}
      </Stack>

      <Box sx={{ width: "100%", height: 280 }}>
        <ResponsiveContainer>
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 16, left: 10, bottom: 0 }}
          >
            <CartesianGrid
              stroke={theme.palette.divider}
              strokeDasharray="3 3"
              opacity={0.65}
            />

            <XAxis
              dataKey="date"
              tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
              axisLine={{ stroke: theme.palette.divider }}
              tickLine={{ stroke: theme.palette.divider }}
            />

            <YAxis
              tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
              axisLine={{ stroke: theme.palette.divider }}
              tickLine={{ stroke: theme.palette.divider }}
              tickFormatter={(value) =>
                `$${Number(value).toLocaleString("en-US")}`
              }
            />

            <ReferenceLine
              y={firstPrice}
              stroke={theme.palette.text.disabled}
              strokeDasharray="4 4"
            />

            <Tooltip content={<CustomTooltip />} />

            <Line
              type="monotone"
              dataKey="price"
              stroke={lineColor}
              strokeWidth={3}
              dot={{
                r: 4,
                strokeWidth: 2,
                stroke: lineColor,
                fill: theme.palette.background.paper,
              }}
              activeDot={{
                r: 7,
                stroke: lineColor,
                strokeWidth: 2,
                fill: theme.palette.background.paper,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default PriceHistoryChart;
