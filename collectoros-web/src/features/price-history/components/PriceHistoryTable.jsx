import {
  Box,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  Chip,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import { formatCurrency } from "../../../utils/formatCurrency";

const getSourceLabel = (source) => {
  const normalizedSource = String(source || "").toLowerCase();

  if (!normalizedSource || normalizedSource === "manual") {
    return "Manual entry";
  }

  if (normalizedSource.includes("mercadolibre")) {
    return "Mercado Libre";
  }

  if (normalizedSource.includes("amazon")) {
    return "Amazon";
  }

  return source;
};

const getSourceType = (source) => {
  const normalizedSource = String(source || "").toLowerCase();

  if (!normalizedSource || normalizedSource === "manual") {
    return "Manual";
  }

  return "Automatic";
};

const formatDate = (value) => {
  if (!value) return "-";

  return new Date(value).toLocaleString("es-MX", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const PriceHistoryTable = ({ rows = [], onDelete, deletingId = null }) => {
  if (!rows.length) {
    return (
      <Box
        sx={{
          border: "1px dashed",
          borderColor: "divider",
          borderRadius: 3,
          p: 4,
          textAlign: "center",
        }}
      >
        <Stack spacing={1.5} alignItems="center">
          <HistoryOutlinedIcon color="disabled" />
          <Typography variant="subtitle1" fontWeight={600}>
            No price history yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Add the first price record to start tracking this item&apos;s value.
          </Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Stack spacing={1.5}>
      {rows.map((row, index) => {
        const isDeleting = deletingId === row.id;

        const previousRow = rows[index + 1];
        const hasPreviousRow = Boolean(previousRow);

        const currentPrice = Number(row.price || 0);
        const previousPrice = Number(previousRow?.price || 0);

        const delta = hasPreviousRow ? currentPrice - previousPrice : 0;
        const deltaPercent =
          hasPreviousRow && previousPrice > 0
            ? (delta / previousPrice) * 100
            : 0;

        const isPositive = delta > 0;
        const isNegative = delta < 0;

        const sourceLabel = getSourceLabel(row.source);
        const sourceType = getSourceType(row.source);

        return (
          <Box
            key={row.id}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 3,
              p: 2,
            }}
          >
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", md: "center" }}
            >
              <Stack spacing={1} sx={{ width: "100%" }}>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={1}
                  alignItems={{ xs: "flex-start", sm: "center" }}
                  justifyContent="space-between"
                >
                  <Stack spacing={0.5}>
                    <Typography variant="h6" fontWeight={700}>
                      {formatCurrency(currentPrice)}
                    </Typography>

                    {hasPreviousRow ? (
                      <Typography
                        variant="body2"
                        fontWeight={700}
                        color={
                          isPositive
                            ? "success.main"
                            : isNegative
                              ? "error.main"
                              : "text.secondary"
                        }
                      >
                        {isPositive ? "+" : ""}
                        {formatCurrency(delta)}{" "}
                        {deltaPercent !== 0
                          ? `(${isPositive ? "+" : ""}${deltaPercent.toFixed(2)}%)`
                          : "(0.00%)"}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        First recorded value
                      </Typography>
                    )}
                  </Stack>

                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    <Chip size="small" label={sourceLabel} variant="outlined" />

                    <Chip
                      size="small"
                      label={sourceType}
                      color={sourceType === "Automatic" ? "primary" : "default"}
                      variant="outlined"
                    />
                  </Stack>
                </Stack>

                <Typography variant="body2" color="text.secondary">
                  Recorded on {formatDate(row.createdAt)}
                </Typography>
              </Stack>

              <Tooltip title="Delete record">
                <span>
                  <IconButton
                    color="error"
                    onClick={() => onDelete?.(row)}
                    disabled={isDeleting}
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                </span>
              </Tooltip>
            </Stack>
          </Box>
        );
      })}
    </Stack>
  );
};

export default PriceHistoryTable;