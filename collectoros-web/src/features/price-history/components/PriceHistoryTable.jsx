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
            Add the first price record to start tracking this item's value.
          </Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Stack spacing={1.5}>
      {rows.map((row) => {
        const isDeleting = deletingId === row.id;

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
                  <Typography variant="h6" fontWeight={700}>
                    {formatCurrency(row.price || 0)}
                  </Typography>

                  <Chip
                    size="small"
                    label={row.source || "Manual"}
                    variant="outlined"
                  />
                </Stack>

                <Typography variant="body2" color="text.secondary">
                  Recorded on{" "}
                  {new Date(row.createdAt).toLocaleString("es-MX", {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
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