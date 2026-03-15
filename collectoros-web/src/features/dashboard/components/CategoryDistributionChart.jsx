import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

import { Card, CardContent, Typography, Box } from "@mui/material";
import InfoTooltip from "../../../components/common/InfoTooltip";

const COLORS = ["#60a5fa", "#34d399", "#fbbf24", "#f87171", "#a78bfa"];

const CategoryDistributionChart = ({ data = [] }) => {
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
            Category distribution
          </Typography>

          <InfoTooltip title="Breaks down your portfolio value by item category." />
        </Box>

        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="category"
              outerRadius={90}
              label
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default CategoryDistributionChart;
