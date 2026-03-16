import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import TrendingDownOutlinedIcon from "@mui/icons-material/TrendingDownOutlined";
import InfoTooltip from "../../../components/common/InfoTooltip";
import { formatCurrency } from "../../../utils/formatCurrency";
import useInventoryMovers from "../hooks/useInventoryMovers";

function formatPercent(value) {
  const numericValue = Number(value || 0);
  const sign = numericValue > 0 ? "+" : "";
  return `${sign}${numericValue.toFixed(2)}%`;
}

function getBarValue(value, maxValue) {
  if (!maxValue || maxValue <= 0) return 0;
  return Math.max((Math.abs(Number(value || 0)) / maxValue) * 100, 6);
}

function EmptyColumn({ title, subtitle, icon }) {
  return (
    <Card
      sx={{
        borderRadius: 4,
        height: "100%",
      }}
    >
      <CardContent>
        <Stack spacing={1.5}>
          <Stack direction="row" spacing={1} alignItems="center">
            {icon}
            <Typography variant="h6" fontWeight={700}>
              {title}
            </Typography>
          </Stack>

          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>

          <Box
            sx={{
              border: "1px dashed",
              borderColor: "divider",
              borderRadius: 3,
              p: 3,
              textAlign: "center",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              No items available yet.
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

function MoverItem({ item, positive = true, maxChange = 0 }) {
  const changeAmount = Number(item.change || 0);
  const barValue = getBarValue(changeAmount, maxChange);

  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        p: 2,
      }}
    >
      <Stack spacing={1.25}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          spacing={2}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle2" fontWeight={700} noWrap>
              {item.name}
            </Typography>

            <Typography variant="caption" color="text.secondary">
              {item.category || "Uncategorized"}
            </Typography>
          </Box>

          <Chip
            size="small"
            label={formatPercent(item.changePercent)}
            color={positive ? "success" : "error"}
            variant="outlined"
          />
        </Stack>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          justifyContent="space-between"
        >
          <Typography
            variant="body2"
            fontWeight={700}
            color={positive ? "success.main" : "error.main"}
          >
            {changeAmount > 0 ? "+" : ""}
            {formatCurrency(changeAmount)}
          </Typography>

          <Typography variant="caption" color="text.secondary">
            {formatCurrency(item.firstPrice)} → {formatCurrency(item.lastPrice)}
          </Typography>
        </Stack>

        <LinearProgress
          variant="determinate"
          value={barValue}
          color={positive ? "success" : "error"}
          sx={{
            height: 8,
            borderRadius: 999,
          }}
        />
      </Stack>
    </Box>
  );
}

const InventoryMoversPanel = () => {
  const { data, isLoading, isError, error } = useInventoryMovers();

  const risingItems = data?.data?.risingItems || [];
  const fallingItems = data?.data?.fallingItems || [];

  const maxRisingChange = Math.max(
    ...risingItems.map((item) => Math.abs(Number(item.change || 0))),
    0,
  );

  const maxFallingChange = Math.max(
    ...fallingItems.map((item) => Math.abs(Number(item.change || 0))),
    0,
  );

  if (isLoading) {
    return (
      <Card sx={{ borderRadius: 4 }}>
        <CardContent>
          <Stack spacing={2}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="h6" fontWeight={700}>
                Inventory Movers
              </Typography>
              <InfoTooltip title="Items with the strongest upward or downward price movement based on their recorded price history." />
            </Stack>

            <Typography variant="body2" color="text.secondary">
              Loading movement insights...
            </Typography>

            <LinearProgress />
          </Stack>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card sx={{ borderRadius: 4 }}>
        <CardContent>
          <Stack spacing={1}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="h6" fontWeight={700}>
                Inventory Movers
              </Typography>
              <InfoTooltip title="Items with the strongest upward or downward price movement based on their recorded price history." />
            </Stack>

            <Typography variant="body2" color="error">
              {error?.response?.data?.message ||
                error?.message ||
                "Could not load inventory movers."}
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
                Inventory Movers
              </Typography>

              <InfoTooltip title="Items with the strongest upward or downward price movement based on their recorded price history." />
            </Stack>

            <Typography variant="body2" color="text.secondary">
              Based on first vs last recorded price
            </Typography>
          </Stack>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                lg: "1fr 1fr",
              },
              gap: 2,
            }}
          >
            {risingItems.length > 0 ? (
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
                      <TrendingUpOutlinedIcon color="success" />
                      <Typography variant="subtitle1" fontWeight={700}>
                        Rising Items
                      </Typography>
                    </Stack>

                    <Divider />

                    <Stack spacing={1.5}>
                      {risingItems.map((item, index) => (
                        <MoverItem
                          key={item.itemId ?? `${item.name}-rising-${index}`}
                          item={item}
                          positive
                          maxChange={maxRisingChange}
                        />
                      ))}
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            ) : (
              <EmptyColumn
                title="Rising Items"
                subtitle="No items with positive movement detected yet."
                icon={<TrendingUpOutlinedIcon color="success" />}
              />
            )}

            {fallingItems.length > 0 ? (
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
                      <TrendingDownOutlinedIcon color="error" />
                      <Typography variant="subtitle1" fontWeight={700}>
                        Falling Items
                      </Typography>
                    </Stack>

                    <Divider />

                    <Stack spacing={1.5}>
                      {fallingItems.map((item, index) => (
                        <MoverItem
                          key={item.itemId ?? `${item.name}-falling-${index}`}
                          item={item}
                          positive={false}
                          maxChange={maxFallingChange}
                        />
                      ))}
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            ) : (
              <EmptyColumn
                title="Falling Items"
                subtitle="No items with negative movement detected yet."
                icon={<TrendingDownOutlinedIcon color="error" />}
              />
            )}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default InventoryMoversPanel;
