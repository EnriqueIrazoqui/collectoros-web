import {
  Box,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import TrendingDownOutlinedIcon from "@mui/icons-material/TrendingDownOutlined";
import InfoTooltip from "../../../components/common/InfoTooltip";
import { formatCurrency } from "../../../utils/formatCurrency";
import useCollectionGrowth from "../hooks/useCollectionGrowth";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function formatPercent(value) {
  const numericValue = Number(value || 0);
  const sign = numericValue > 0 ? "+" : "";
  return `${sign}${numericValue.toFixed(2)}%`;
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;

  const point = payload[0]?.payload;

  return (
    <Card elevation={8} sx={{ borderRadius: 3 }}>
      <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
        <Stack spacing={0.5}>
          <Typography variant="caption" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="subtitle2" fontWeight={700}>
            {formatCurrency(point?.totalValue || 0)}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

const MetricCard = ({ title, value, subtitle, color }) => {
  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        p: 2,
      }}
    >
      <Stack spacing={0.5}>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>

        <Typography
          variant="h6"
          fontWeight={700}
          sx={color ? { color } : undefined}
        >
          {value}
        </Typography>

        {subtitle ? (
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        ) : null}
      </Stack>
    </Box>
  );
};

const CollectionGrowthChart = () => {
  const theme = useTheme();
  const { data, isLoading, isError, error } = useCollectionGrowth();

  const growthData = data?.data || {};
  const history = growthData.history || [];
  const startValue = Number(growthData.startValue || 0);
  const currentValue = Number(growthData.currentValue || 0);
  const growthAmount = Number(growthData.growthAmount || 0);
  const growthPercent = Number(growthData.growthPercent || 0);
  const pointsCount = Number(growthData.pointsCount || 0);

  const chartData = history.map((point) => ({
    ...point,
    label: new Date(point.date).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
    }),
  }));

  if (isLoading) {
    return (
      <Card sx={{ borderRadius: 4 }}>
        <CardContent>
          <Stack spacing={1}>
            <Typography variant="h6" fontWeight={700}>
              Collection growth
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Loading collection growth...
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card sx={{ borderRadius: 4 }}>
        <CardContent>
          <Typography variant="body2" color="error">
            {error?.response?.data?.message ||
              error?.message ||
              "Could not load collection growth."}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (!chartData.length) {
    return (
      <Card sx={{ borderRadius: 4 }}>
        <CardContent>
          <Stack spacing={1}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="h6" fontWeight={700}>
                Collection growth
              </Typography>
              <InfoTooltip title="Historical portfolio value over time based on tracked item price history." />
            </Stack>

            <Typography variant="body2" color="text.secondary">
              No collection growth data available yet.
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ borderRadius: 4 }}>
      <CardContent>
        <Stack spacing={3}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={1}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="h6" fontWeight={700}>
                Collection growth
              </Typography>
              <InfoTooltip title="Historical portfolio value over time based on tracked item price history." />
            </Stack>

            <Chip
              label={`${pointsCount} point${pointsCount === 1 ? "" : "s"}`}
              variant="outlined"
              size="small"
            />
          </Stack>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                lg: "repeat(3, 1fr)",
              },
              gap: 2,
            }}
          >
            <MetricCard
              title="First tracked value"
              value={formatCurrency(startValue)}
            />

            <MetricCard
              title="Current tracked value"
              value={formatCurrency(currentValue)}
            />

            <MetricCard
              title="Growth"
              value={`${growthAmount > 0 ? "+" : ""}${formatCurrency(growthAmount)}`}
              subtitle={formatPercent(growthPercent)}
              color={
                growthAmount > 0
                  ? "success.main"
                  : growthAmount < 0
                    ? "error.main"
                    : undefined
              }
            />
          </Box>

          <Box sx={{ width: "100%", height: 320 }}>
            <ResponsiveContainer>
              <LineChart
                data={chartData}
                margin={{ top: 10, right: 12, left: 12, bottom: 0 }}
              >
                <CartesianGrid
                  stroke={theme.palette.divider}
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="label"
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

                <Tooltip content={<CustomTooltip />} />

                <Line
                  type="monotone"
                  dataKey="totalValue"
                  stroke={theme.palette.primary.main}
                  strokeWidth={3}
                  dot={{
                    r: 4,
                    strokeWidth: 2,
                    fill: theme.palette.background.paper,
                  }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default CollectionGrowthChart;