import { Box, Card, CardContent, Stack, Typography } from "@mui/material";
import { formatCurrency } from "../../../utils/formatCurrency";
import InfoTooltip from "../../../components/common/InfoTooltip";
import SavingsOutlinedIcon from "@mui/icons-material/SavingsOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";

const SummaryCard = ({ title, value, subtitle, info, icon }) => {
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
        <Stack spacing={1.5}>
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "#23314d",
            }}
          >
            {icon}
          </Box>

          <Box display="flex" alignItems="center">
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>

            {info && <InfoTooltip title={info} />}
          </Box>

          <Typography variant="h4" fontWeight={700}>
            {value}
          </Typography>

          {subtitle ? (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  );
};

const AnalyticsSummaryCards = ({ data }) => {
  const inventory = data?.inventory || {};
  const wishlist = data?.wishlist || {};

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2,1fr)",
          xl: "repeat(4,1fr)",
        },
        gap: 2,
      }}
    >
      <SummaryCard
        title="Inventory value"
        value={formatCurrency(inventory.totalCurrentEstimatedValue || 0)}
        subtitle="Current estimated value"
        info="Estimated current market value of all items in your inventory."
        icon={<SavingsOutlinedIcon sx={{ color: "#4da3ff" }} />}
      />

      <SummaryCard
        title="Invested capital"
        value={formatCurrency(inventory.totalInvestedAmount || 0)}
        subtitle="Total invested amount"
        info="Total amount originally spent to acquire the items in your inventory."
        icon={<AccountBalanceWalletOutlinedIcon sx={{ color: "#7c6cff" }} />}
      />

      <SummaryCard
        title="Unrealized gain"
        value={formatCurrency(inventory.unrealizedGainLoss || 0)}
        subtitle={`${inventory.totalItems || 0} total items`}
        info="Difference between the current estimated inventory value and the invested capital."
        icon={<TrendingUpOutlinedIcon sx={{ color: "#5fd38d" }} />}
      />

      <SummaryCard
        title="Wishlist target"
        value={formatCurrency(wishlist.totalTargetValue || 0)}
        subtitle={`${wishlist.totalItems || 0} tracked items`}
        info="Total target price of all items currently tracked in your wishlist."
        icon={<FavoriteBorderOutlinedIcon sx={{ color: "#f59e0b" }} />}
      />
    </Box>
  );
};

export default AnalyticsSummaryCards;