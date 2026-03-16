import { Box, Chip, Stack, Typography } from "@mui/material";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import TrendingDownOutlinedIcon from "@mui/icons-material/TrendingDownOutlined";
import SwapVertOutlinedIcon from "@mui/icons-material/SwapVertOutlined";
import {
  formatPriceHistoryCurrency,
  getHighestPriceHistoryRecord,
  getLowestPriceHistoryRecord,
  getPriceHistoryChangeFromFirst,
} from "../utils/formatPriceHistory";

const StatCard = ({ title, value, subtitle, icon, valueColor }) => {
  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        p: 2,
        minHeight: 110,
      }}
    >
      <Stack spacing={1}>
        <Stack direction="row" spacing={1} alignItems="center">
          {icon}
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
        </Stack>

        <Typography
          variant="h6"
          fontWeight={700}
          sx={valueColor ? { color: valueColor } : undefined}
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

const PriceHistoryStats = ({ history = [] }) => {
  const highestRecord = getHighestPriceHistoryRecord(history);
  const lowestRecord = getLowestPriceHistoryRecord(history);
  const changeSummary = getPriceHistoryChangeFromFirst(history);

  const changeValue = changeSummary.change || 0;
  const isPositive = changeValue > 0;
  const isNegative = changeValue < 0;

  const changeLabel = `${isPositive ? "+" : ""}${formatPriceHistoryCurrency(changeValue)}`;
  const percentLabel =
    history.length >= 2
      ? `${isPositive ? "+" : ""}${changeSummary.changePercent.toFixed(2)}% from first`
      : "Not enough history yet";

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          md: "repeat(3, 1fr)",
        },
        gap: 2,
      }}
    >
      <StatCard
        title="Highest recorded"
        value={
          highestRecord
            ? formatPriceHistoryCurrency(highestRecord.price)
            : "N/A"
        }
        subtitle={highestRecord ? `Source: ${highestRecord.source || "Manual"}` : ""}
        icon={<TrendingUpOutlinedIcon fontSize="small" color="success" />}
        valueColor="success.main"
      />

      <StatCard
        title="Lowest recorded"
        value={
          lowestRecord
            ? formatPriceHistoryCurrency(lowestRecord.price)
            : "N/A"
        }
        subtitle={lowestRecord ? `Source: ${lowestRecord.source || "Manual"}` : ""}
        icon={<TrendingDownOutlinedIcon fontSize="small" color="error" />}
        valueColor="error.main"
      />

      <StatCard
        title="Change from first"
        value={changeLabel}
        subtitle={percentLabel}
        icon={<SwapVertOutlinedIcon fontSize="small" color="primary" />}
        valueColor={
          isPositive
            ? "success.main"
            : isNegative
              ? "error.main"
              : "text.primary"
        }
      />
    </Box>
  );
};

export default PriceHistoryStats;