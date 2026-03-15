import { Card, CardContent, Stack, Typography } from "@mui/material";
import DashboardItemRow from "./DashboardItemRow";
import { formatCurrency } from "../../../utils/formatCurrency";

const DashboardItemsList = ({ title, items = [] }) => {
  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 4,
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: 6,
        },
      }}
    >
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h6" fontWeight={700}>
            {title}
          </Typography>

          {items.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No items yet
            </Typography>
          ) : (
            items.map((item) => (
              <DashboardItemRow
                key={item.id}
                name={item.name}
                category={item.category}
                value={formatCurrency(item.totalCurrentValue)}
                gain={item.gain}
              />
            ))
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default DashboardItemsList;
