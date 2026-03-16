import { Box, Card, CardContent, Stack, Typography } from "@mui/material";
import { formatCurrency } from "../../../utils/formatCurrency";

const OverviewCard = ({ title, value, subtitle, color = "text.primary" }) => {
  return (
    <Card
      sx={{
        borderRadius: 4,
        height: "100%",
        minHeight: 140,
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: 6,
        },
      }}
    >
      <CardContent>
        <Stack spacing={1}>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>

          <Typography variant="h4" fontWeight={700} color={color}>
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

const PortfolioOverviewCards = ({ data }) => {
  const portfolio = data || {};

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          xl: "repeat(5, 1fr)",
        },
        gap: 2,
      }}
    >
      <OverviewCard title="Items count" value={portfolio.itemsCount || 0} />

      <OverviewCard
        title="Total quantity"
        value={portfolio.totalQuantity || 0}
      />

      <OverviewCard
        title="Invested amount"
        value={formatCurrency(portfolio.investedAmount || 0)}
      />

      <OverviewCard
        title="Portfolio value"
        value={formatCurrency(portfolio.portfolioValue || 0)}
      />

      <OverviewCard
        title="Profit"
        value={formatCurrency(portfolio.profit || 0)}
        subtitle={`${portfolio.profitPercent || 0}% return`}
        color={
          Number(portfolio.profit || 0) >= 0 ? "success.main" : "error.main"
        }
      />
    </Box>
  );
};

export default PortfolioOverviewCards;
