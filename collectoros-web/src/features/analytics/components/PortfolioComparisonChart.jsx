import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { formatCurrency } from "../../../utils/formatCurrency";
import InfoTooltip from "../../../components/common/InfoTooltip";

const PortfolioComparisonChart = ({ data }) => {
  const chartData = [
    {
      name: "Invested",
      value: Number(data?.investedAmount || 0),
    },
    {
      name: "Portfolio",
      value: Number(data?.portfolioValue || 0),
    },
    {
      name: "Profit",
      value: Number(data?.profit || 0),
    },
  ];

  const colors = ["#4da3ff", "#7c6cff", "#5fd38d"];

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
        <Box display="flex" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight={700}>
            Portfolio comparison
          </Typography>

          <InfoTooltip title="Compares how much you invested, what your portfolio is worth now, and the current unrealized profit." />
        </Box>

        <Box sx={{ width: "100%", height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid stroke="#334155" strokeDasharray="4 4" />

              <XAxis
                dataKey="name"
                stroke="#9aa4b2"
                tick={{ fill: "#cbd5e1", fontSize: 13 }}
              />

              <YAxis
                stroke="#9aa4b2"
                tick={{ fill: "#cbd5e1", fontSize: 12 }}
              />

              <Tooltip
                formatter={(value) => formatCurrency(value)}
                contentStyle={{
                  background: "#1f2a3f",
                  border: "1px solid #334155",
                  borderRadius: "10px",
                  color: "#fff",
                }}
                labelStyle={{
                  color: "#cbd5e1",
                }}
              />

              <Bar
                dataKey="value"
                radius={[8, 8, 0, 0]}
                animationDuration={1200}
              >
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={colors[index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PortfolioComparisonChart;
