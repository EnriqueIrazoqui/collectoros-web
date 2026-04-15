import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import { useWhatsNewList } from "../hooks/useWhatsNewList";
import WhatsNewCard from "../components/WhatsNewCard";
import WhatsNewMarkdownContent from "../components/WhatsNewMarkdownContent";
import getWhatsNewTypeConfig from "../utils/getWhatsNewTypeConfig";
import { useMarkWhatsNewAsViewed } from "../hooks/useMarkWhatsNewAsViewed";

const WhatsNewPage = () => {
  const [selectedItem, setSelectedItem] = useState(null);

  const { data, isLoading, isError, error } = useWhatsNewList();
  const markViewedMutation = useMarkWhatsNewAsViewed();

  const items = data?.data || [];

  const handleOpenDetails = async (item) => {
    setSelectedItem(item);

    if (!item.isViewed) {
      try {
        await markViewedMutation.mutateAsync(item.id);
      } catch (error) {
        console.error("Mark as viewed error:", error);
      }
    }
  };

  const handleCloseDetails = () => {
    setSelectedItem(null);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" py={6}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error">
        {error?.response?.data?.message || "Could not load what's new entries."}
      </Alert>
    );
  }

  const selectedTypeConfig = selectedItem
    ? getWhatsNewTypeConfig(selectedItem.type)
    : null;

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={1}>
        What&apos;s New
      </Typography>

      <Typography variant="body1" color="text.secondary" mb={3}>
        Stay up to date with the latest CollectorOS improvements, features, and
        fixes.
      </Typography>

      {items.length === 0 ? (
        <Alert severity="info">No published updates yet.</Alert>
      ) : (
        <Stack spacing={2}>
          {items.map((item) => (
            <WhatsNewCard
              key={item.id}
              item={item}
              onOpen={handleOpenDetails}
            />
          ))}
        </Stack>
      )}

      <Dialog
        open={Boolean(selectedItem)}
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
      >
        {selectedItem ? (
          <>
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
                    {selectedItem.title}
                  </Typography>

                  {!selectedItem.isViewed ? (
                    <Chip label="New" color="primary" size="small" />
                  ) : null}

                  <Chip
                    label={selectedTypeConfig.label}
                    color={selectedTypeConfig.color}
                    size="small"
                    variant="outlined"
                  />

                  <Chip
                    label={selectedItem.version}
                    size="small"
                    variant="outlined"
                  />
                </Stack>

                <Typography variant="body1" color="text.secondary">
                  {selectedItem.summary}
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
                  <WhatsNewMarkdownContent content={selectedItem.content} />
                </Box>

                <Typography variant="caption" color="text.secondary">
                  {selectedItem.publishedAt
                    ? new Date(selectedItem.publishedAt).toLocaleString()
                    : "Draft"}
                </Typography>
              </Stack>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3 }}>
              <Button onClick={handleCloseDetails} variant="contained">
                Close
              </Button>
            </DialogActions>
          </>
        ) : null}
      </Dialog>
    </Box>
  );
};

export default WhatsNewPage;
