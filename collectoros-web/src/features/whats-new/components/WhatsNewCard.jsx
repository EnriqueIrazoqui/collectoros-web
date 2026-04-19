import {
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import getWhatsNewTypeConfig from "../utils/getWhatsNewTypeConfig";

const WhatsNewCard = ({ item, onOpen }) => {
  const typeConfig = getWhatsNewTypeConfig(item.type);

  return (
    <Card
      sx={{
        borderRadius: "24px",
        border: "1px solid",
        borderColor: "divider",
        backgroundColor: "background.paper",
        boxShadow: "none",
        transition: "all 0.2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: 3,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={1.5}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            alignItems={{ xs: "flex-start", sm: "center" }}
          >
            <Typography variant="h6" fontWeight={700}>
              {item.title}
            </Typography>

            {!item.isViewed ? (
              <Chip label="New" color="primary" size="small" />
            ) : null}

            <Chip
              label={typeConfig.label}
              color={typeConfig.color}
              size="small"
              variant="outlined"
            />

            <Chip label={item.version} size="small" variant="outlined" />
          </Stack>

          <Typography variant="body1" color="text.secondary">
            {item.summary}
          </Typography>

          <Typography variant="caption" color="text.secondary">
            {item.publishedAt
              ? new Date(item.publishedAt).toLocaleString()
              : "Draft"}
          </Typography>

          <Button
            size="small"
            onClick={() => onOpen(item)}
            sx={{ alignSelf: "flex-start", mt: 1 }}
          >
            {item.isViewed ? "View details" : "View update"}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default WhatsNewCard;
