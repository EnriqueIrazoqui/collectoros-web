import { useEffect } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import { useLatestWhatsNew } from "../hooks/useLatestWhatsNew";
import { useMarkWhatsNewAsViewed } from "../hooks/useMarkWhatsNewAsViewed";
import getWhatsNewTypeConfig from "../utils/getWhatsNewTypeConfig";
import WhatsNewMarkdownContent from "./WhatsNewMarkdownContent";

const WhatsNewLatestDialog = ({ open, onOpen, onClose }) => {
  const latestQuery = useLatestWhatsNew();
  const markViewedMutation = useMarkWhatsNewAsViewed();

  const item = latestQuery.data?.data || null;

  useEffect(() => {
    if (!item) {
      return;
    }

    if (item.isViewed) {
      return;
    }

    const sessionKey = `whats-new-seen-this-session-${item.id}`;
    const alreadyShownThisSession = sessionStorage.getItem(sessionKey) === "true";

    if (!alreadyShownThisSession) {
      sessionStorage.setItem(sessionKey, "true");
      onOpen();
    }
  }, [item, onOpen]);

  if (!open) {
    return null;
  }

  if (latestQuery.isLoading) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogContent
          sx={{
            py: 6,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </DialogContent>
      </Dialog>
    );
  }

  if (!item || item.isViewed) {
    return null;
  }

  const typeConfig = getWhatsNewTypeConfig(item.type);

  const handleClose = async () => {
    try {
      await markViewedMutation.mutateAsync(item.id);
    } catch (error) {
      console.error("Mark what's new as viewed error:", error);
    }

    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>What&apos;s New</DialogTitle>

      <DialogContent>
        <Stack spacing={2}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            flexWrap="wrap"
          >
            <Typography variant="h5" fontWeight={700}>
              {item.title}
            </Typography>

            <Chip label="New" color="primary" size="small" />
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

          <Box
            sx={{
              p: 2,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              backgroundColor: "rgba(255,255,255,0.02)",
            }}
          >
            <WhatsNewMarkdownContent content={item.content} />
          </Box>

          <Typography variant="caption" color="text.secondary">
            {item.publishedAt
              ? new Date(item.publishedAt).toLocaleString()
              : ""}
          </Typography>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={handleClose}
          variant="contained"
          disabled={markViewedMutation.isPending}
        >
          Got it
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WhatsNewLatestDialog;
