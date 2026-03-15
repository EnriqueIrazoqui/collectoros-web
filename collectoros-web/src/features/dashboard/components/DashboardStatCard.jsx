import { Card, CardContent, Typography, Stack, Box } from "@mui/material";
import InfoTooltip from "../../../components/common/InfoTooltip";

const DashboardStatCard = ({ title, value, subtitle, info }) => {
  return (
    <Card
      sx={{
        height: "100%",
        minHeight: 160,
        borderRadius: 4,
      }}
    >
      <CardContent sx={{ height: "100%", p: 3 }}>
        <Stack justifyContent="space-between" sx={{ height: "100%" }}>
          <Stack spacing={1}>
            <Box display="flex" alignItems="center">
              <Typography variant="body2" color="text.secondary">
                {title}
              </Typography>

              {info ? <InfoTooltip title={info} /> : null}
            </Box>

            <Typography
              variant="h4"
              fontWeight={700}
              sx={{ wordBreak: "break-word" }}
            >
              {value}
            </Typography>
          </Stack>

          {subtitle ? (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          ) : (
            <span />
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default DashboardStatCard;
