import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import RemoveIcon from "@mui/icons-material/Remove";
import { formatCurrency } from "../../../utils/formatCurrency";
import InfoTooltip from "../../../components/common/InfoTooltip";

const getTrendConfig = (trend) => {
  const normalized = String(trend || "").toLowerCase();

  if (normalized === "up") {
    return {
      label: "Uptrend",
      color: "success",
      icon: <TrendingUpIcon fontSize="small" />,
      textColor: "success.main",
    };
  }

  if (normalized === "down") {
    return {
      label: "Downtrend",
      color: "error",
      icon: <TrendingDownIcon fontSize="small" />,
      textColor: "error.main",
    };
  }

  return {
    label: "Stable",
    color: "default",
    icon: <RemoveIcon fontSize="small" />,
    textColor: "text.primary",
  };
};

const MetricCard = ({ label, value, color = "text.primary" }) => {
  return (
    <Card
      sx={{
        borderRadius: 4,
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: 6,
        },
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary" mb={0.75}>
          {label}
        </Typography>

        <Typography variant="h6" fontWeight={700} color={color}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

const ItemTrendPanel = ({ isLoading, isError, errorMessage, data }) => {
  if (isLoading) {
    return (
      <Card
        variant="outlined"
        sx={{
          borderRadius: 3,
          height: "100%",
          bgcolor: "transparent",
          borderColor: "#334155",
          transition: "border-color 0.2s ease, transform 0.2s ease",
          "&:hover": {
            borderColor: "#475569",
            transform: "translateY(-2px)",
          },
        }}
      >
        <CardContent>
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Alert severity="error">
        {errorMessage || "Could not load item trend."}
      </Alert>
    );
  }

  if (!data) {
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
          <Typography variant="body2" color="text.secondary">
            Select an item to view trend details.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const trendConfig = getTrendConfig(data.trend);
  const changePercent = Number(data.changePercent || 0);

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
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h5" fontWeight={700}>
              {data.itemName}
              <InfoTooltip title="Trend analysis based on recent price history for this item." />
            </Typography>

            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
              mt={1.5}
              flexWrap="wrap"
            >
              <Chip
                icon={trendConfig.icon}
                label={trendConfig.label}
                color={trendConfig.color}
                variant="outlined"
              />

              <Typography
                variant="body2"
                fontWeight={700}
                color={changePercent >= 0 ? "success.main" : "error.main"}
              >
                {changePercent > 0 ? "+" : ""}
                {changePercent}%
              </Typography>
            </Stack>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                label="Last price"
                value={formatCurrency(data.lastPrice || 0)}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                label="Average price"
                value={formatCurrency(data.averagePrice || 0)}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                label="Change percent"
                value={`${changePercent > 0 ? "+" : ""}${changePercent}%`}
                color={changePercent >= 0 ? "success.main" : "error.main"}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                label="History count"
                value={data.historyCount || 0}
              />
            </Grid>
          </Grid>

          <Box>
            <Typography variant="body2" color="text.secondary" mb={0.5}>
              Trend insight
            </Typography>

            <Typography
              variant="body1"
              color={trendConfig.textColor}
              fontWeight={600}
            >
              {changePercent >= 0
                ? "This item is showing positive movement compared to its recent average."
                : "This item is currently below its recent average and may be losing momentum."}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ItemTrendPanel;
