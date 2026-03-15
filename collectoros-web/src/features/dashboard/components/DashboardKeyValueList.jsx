import { Stack, Typography, Box } from "@mui/material";

const DashboardKeyValueList = ({ items = [] }) => {
  return (
    <Stack spacing={1.5}>
      {items.map((item) => (
        <Box
          key={item.label}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          gap={2}
        >
          <Typography variant="body2" color="text.secondary">
            {item.label}
          </Typography>

          <Typography variant="body1" fontWeight={600}>
            {item.value}
          </Typography>
        </Box>
      ))}
    </Stack>
  );
};

export default DashboardKeyValueList;