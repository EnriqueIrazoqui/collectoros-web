import { Box, Button, Card, CardContent, Divider, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const ModuleGuideCard = ({
  title,
  description,
  whenToUse,
  nextStep,
  actionLabel,
  to,
}) => {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent sx={{ height: "100%" }}>
        <Stack spacing={2} sx={{ height: "100%" }}>
          <Typography variant="h6" fontWeight={600}>
            {title}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>

          <Divider />

          <Box>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              When to use it
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {whenToUse}
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Next step
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {nextStep}
            </Typography>
          </Box>

          <Box>
            <Button component={RouterLink} to={to} variant="outlined">
              {actionLabel}
            </Button>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ModuleGuideCard;