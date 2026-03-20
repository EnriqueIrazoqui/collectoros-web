import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import InfoTooltip from "../../../components/common/InfoTooltip";
import { formatCurrency } from "../../../utils/formatCurrency";
import usePortfolioAllocation from "../hooks/usePortfolioAllocation";

function renderCenterLabel(totalValue) {
  return (
    <Stack
      spacing={0.5}
      alignItems="center"
      justifyContent="center"
      sx={{ textAlign: "center" }}
    >
      <Typography variant="caption" color="text.secondary">
        Total value
      </Typography>
      <Typography variant="h6" fontWeight={700}>
        {formatCurrency(totalValue)}
      </Typography>
    </Stack>
  );
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;

  const item = payload[0]?.payload;

  return (
    <Card
      elevation={8}
      sx={{
        borderRadius: 3,
      }}
    >
      <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
        <Stack spacing={0.5}>
          <Typography variant="subtitle2" fontWeight={700}>
            {item.category}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {formatCurrency(item.totalValue)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {item.percentage}% of portfolio · {item.itemsCount} item
            {item.itemsCount === 1 ? "" : "s"}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

const PortfolioAllocationChart = () => {
  const theme = useTheme();
  const { data, isLoading, isError, error } = usePortfolioAllocation();

  const totalPortfolioValue = data?.data?.totalPortfolioValue || 0;
  const allocation = data?.data?.allocation || [];
  const categoriesCount = data?.data?.categoriesCount || 0;

  const chartColors = [
    theme.palette.primary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.info.main,
    theme.palette.secondary.main,
    theme.palette.error.main,
    theme.palette.primary.light,
    theme.palette.success.light,
  ];

  if (isLoading) {
    return (
      <Card sx={{ borderRadius: 4 }}>
        <CardContent>
          <Stack spacing={1}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="h6" fontWeight={700}>
                Portfolio allocation
              </Typography>
              <InfoTooltip title="Distribution of your portfolio value across collection categories." />
            </Stack>

            <Typography variant="body2" color="text.secondary">
              Loading allocation data...
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
              "Could not load portfolio allocation."}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (!allocation.length) {
    return (
      <Card sx={{ borderRadius: 4 }}>
        <CardContent>
          <Stack spacing={1}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="h6" fontWeight={700}>
                Portfolio allocation
              </Typography>
              <InfoTooltip title="Distribution of your portfolio value across collection categories." />
            </Stack>

            <Typography variant="body2" color="text.secondary">
              No allocation data available yet.
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
                Portfolio allocation
              </Typography>
              <InfoTooltip title="Distribution of your portfolio value across collection categories." />
            </Stack>

            <Chip
              label={`${categoriesCount} categor${categoriesCount === 1 ? "y" : "ies"}`}
              variant="outlined"
              size="small"
            />
          </Stack>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                lg: "1.1fr 0.9fr",
              },
              gap: 3,
              alignItems: "center",
            }}
          >
            <Box sx={{ width: "100%", height: 340, position: "relative" }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={allocation}
                    dataKey="totalValue"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    innerRadius={85}
                    outerRadius={125}
                    paddingAngle={3}
                    stroke="none"
                  >
                    {allocation.map((entry, index) => (
                      <Cell
                        key={`${entry.category}-${index}`}
                        fill={chartColors[index % chartColors.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>

              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  pointerEvents: "none",
                }}
              >
                {renderCenterLabel(totalPortfolioValue)}
              </Box>
            </Box>

            <Stack spacing={1.5}>
              {allocation.map((item, index) => (
                <Box
                  key={`${item.category}-${index}`}
                  sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 3,
                    p: 1.5,
                  }}
                >
                  <Stack spacing={1}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      spacing={2}
                    >
                      <Stack direction="row" spacing={1.25} alignItems="center">
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            backgroundColor:
                              chartColors[index % chartColors.length],
                            flexShrink: 0,
                          }}
                        />
                        <Typography variant="subtitle2" fontWeight={700}>
                          {item.category}
                        </Typography>
                      </Stack>

                      <Typography variant="subtitle2" fontWeight={700}>
                        {item.percentage}%
                      </Typography>
                    </Stack>

                    <Divider />

                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      spacing={2}
                    >
                      <Typography variant="body2" color="text.secondary">
                        {formatCurrency(item.totalValue)}
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        {item.itemsCount} item{item.itemsCount === 1 ? "" : "s"}
                      </Typography>
                    </Stack>
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default PortfolioAllocationChart;