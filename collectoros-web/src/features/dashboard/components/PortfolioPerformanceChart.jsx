import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import { Card, CardContent, Typography, Box } from "@mui/material";
import InfoTooltip from "../../../components/common/InfoTooltip";

const PortfolioPerformanceChart = ({ data = [] }) => {
  return (
    <Card
      sx={{
        borderRadius: 4,
        height: "100%",
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight={700}>
            Portfolio performance
          </Typography>

          <InfoTooltip title="Shows the estimated value trend of your portfolio over time." />
        </Box>

        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />

            <XAxis dataKey="date" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="value"
              stroke="#60a5fa"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default PortfolioPerformanceChart;
