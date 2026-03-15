import { Card, CardContent, Stack, Typography, Box } from "@mui/material";
import InfoTooltip from "../../../components/common/InfoTooltip";

const DashboardSummaryPanel = ({ title, children, info }) => {
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
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Box display="flex" alignItems="center">
            <Typography variant="h6" fontWeight={700}>
              {title}
            </Typography>

            {info ? <InfoTooltip title={info} /> : null}
          </Box>

          {children}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default DashboardSummaryPanel;
