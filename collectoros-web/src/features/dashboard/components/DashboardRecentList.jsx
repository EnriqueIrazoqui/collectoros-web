import { Card, CardContent, Stack, Typography } from "@mui/material";
import DashboardRecentRow from "./DashboardRecentRow";

const DashboardRecentList = ({
  title,
  items = [],
  valueKey = "currentEstimatedValue",
}) => {
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
              No recent items yet
            </Typography>
          ) : (
            items.map((item) => (
              <DashboardRecentRow
                key={item.id}
                name={item.name}
                category={item.category}
                value={item[valueKey] ?? 0}
                date={new Date(item.createdAt).toLocaleDateString("en-US")}
              />
            ))
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default DashboardRecentList;
