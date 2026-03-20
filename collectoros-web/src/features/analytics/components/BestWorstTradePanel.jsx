import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import InfoTooltip from "../../../components/common/InfoTooltip";
import { formatCurrency } from "../../../utils/formatCurrency";
import useTradePerformance from "../hooks/useTradePerformance";

function formatPercent(value) {
  const numericValue = Number(value || 0);
  const sign = numericValue > 0 ? "+" : "";
  return `${sign}${numericValue.toFixed(2)}%`;
}

function TradeCard({ title, item, type = "best" }) {
  const isBest = type === "best";
  const amountColor =
    Number(item?.profitAmount || 0) > 0
      ? "success.main"
      : Number(item?.profitAmount || 0) < 0
        ? "error.main"
        : "text.primary";

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 4,
        height: "100%",
      }}
    >
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" spacing={1} alignItems="center">
            {isBest ? (
              <EmojiEventsOutlinedIcon color="success" />
            ) : (
              <WarningAmberOutlinedIcon color="error" />
            )}

            <Typography variant="subtitle1" fontWeight={700}>
              {title}
            </Typography>
          </Stack>

          {!item ? (
            <Typography variant="body2" color="text.secondary">
              No trade data available yet.
            </Typography>
          ) : (
            <>
              <Box>
                <Typography variant="h6" fontWeight={700}>
                  {item.name}
                </Typography>

                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  flexWrap="wrap"
                  useFlexGap
                  sx={{ mt: 0.75 }}
                >
                  <Chip size="small" label={item.category} variant="outlined" />
                  <Chip
                    size="small"
                    label={`Qty ${item.quantity}`}
                    variant="outlined"
                  />
                  <Chip
                    size="small"
                    label={item.condition || "-"}
                    variant="outlined"
                  />
                </Stack>
              </Box>

              <Divider />

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "1fr 1fr",
                  },
                  gap: 2,
                }}
              >
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total purchase value
                  </Typography>
                  <Typography variant="subtitle2" fontWeight={700}>
                    {formatCurrency(item.totalPurchaseValue)}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Current total value
                  </Typography>
                  <Typography variant="subtitle2" fontWeight={700}>
                    {formatCurrency(item.totalCurrentValue)}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Per-unit purchase price
                  </Typography>
                  <Typography variant="subtitle2" fontWeight={700}>
                    {formatCurrency(item.purchasePrice)}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Per-unit estimated value
                  </Typography>
                  <Typography variant="subtitle2" fontWeight={700}>
                    {formatCurrency(item.currentEstimatedValue)}
                  </Typography>
                </Box>
              </Box>

              <Divider />

              <Stack spacing={0.5}>
                <Typography variant="body2" color="text.secondary">
                  Performance
                </Typography>

                <Typography
                  variant="h5"
                  fontWeight={700}
                  sx={{ color: amountColor }}
                >
                  {Number(item.profitAmount || 0) > 0 ? "+" : ""}
                  {formatCurrency(item.profitAmount)}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  {formatPercent(item.profitPercent)}
                </Typography>
              </Stack>
            </>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

const BestWorstTradePanel = () => {
  const { data, isLoading, isError, error } = useTradePerformance();

  const bestTrade = data?.data?.bestTrade || null;
  const worstTrade = data?.data?.worstTrade || null;

  if (isLoading) {
    return (
      <Card sx={{ borderRadius: 4 }}>
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            Loading trade performance...
          </Typography>
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
              "Could not load trade performance."}
          </Typography>
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
                Best / Worst trade
              </Typography>
              <InfoTooltip title="Highlights the strongest and weakest performing inventory positions based on purchase price versus current estimated value." />
            </Stack>
          </Stack>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                xl: "1fr 1fr",
              },
              gap: 2,
            }}
          >
            <TradeCard title="Best trade" item={bestTrade} type="best" />
            <TradeCard title="Worst trade" item={worstTrade} type="worst" />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default BestWorstTradePanel;