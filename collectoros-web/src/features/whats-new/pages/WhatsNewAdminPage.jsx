import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useWhatsNewAdminList } from "../hooks/useWhatsNewAdminList";
import { useCreateWhatsNew } from "../hooks/useCreateWhatsNew";
import { useUpdateWhatsNew } from "../hooks/useUpdateWhatsNew";
import { usePublishWhatsNew } from "../hooks/usePublishWhatsNew";
import { useDeleteWhatsNew } from "../hooks/useDeleteWhatsNew";
import WhatsNewFormDialog from "../components/WhatsNewFormDialog";
import DeleteWhatsNewDialog from "../components/DeleteWhatsNewDialog";
import getWhatsNewTypeConfig from "../utils/getWhatsNewTypeConfig";
import AppFeedbackSnackbar from "../../../components/feedback/AppFeedbackSnackbar";

import {
  buildErrorFeedback,
  buildFeedback,
} from "../../../utils/feedbackHelpers";

const WhatsNewAdminPage = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);

  const { data, isLoading, isError, error } = useWhatsNewAdminList();
  const createMutation = useCreateWhatsNew();
  const updateMutation = useUpdateWhatsNew();
  const publishMutation = usePublishWhatsNew();
  const deleteMutation = useDeleteWhatsNew();

  const items = data?.data || [];

  const [feedback, setFeedback] = useState({
    open: false,
    severity: "success",
    title: "",
    message: "",
  });

  const handleCloseFeedback = () => {
    setFeedback((prev) => ({
      ...prev,
      open: false,
    }));
  };

  const handleCreate = async (payload) => {
    try {
      await createMutation.mutateAsync(payload);
      setIsCreateOpen(false);

      setFeedback(
        buildFeedback({
          severity: "success",
          title: "What's new entry created",
          message: "The entry was created successfully.",
        }),
      );
    } catch (error) {
      const backendMessage = error?.response?.data?.message || error?.message;

      setFeedback(
        buildErrorFeedback(
          {
            severity: "error",
            title: "Could not create what's new entry",
            message: "Could not create what's new entry.",
          },
          backendMessage,
        ),
      );
    }
  };

  const handleUpdate = async (payload) => {
    try {
      await updateMutation.mutateAsync({
        whatsNewId: editingItem.id,
        payload,
      });
      setEditingItem(null);

      setFeedback(
        buildFeedback({
          severity: "success",
          title: "What's new entry update",
          message: "The entry was update successfully.",
        }),
      );
    } catch (error) {
      const backendMessage = error?.response?.data?.message || error?.message;

      setFeedback(
        buildErrorFeedback(
          {
            severity: "error",
            title: "Could not update what's new entry",
            message: "Could not update what's new entry.",
          },
          backendMessage,
        ),
      );
    }
  };

  const handlePublish = async (itemId) => {
    try {
      await publishMutation.mutateAsync(itemId);
      setFeedback(
        buildFeedback({
          severity: "success",
          title: "What's new entry publish",
          message: "The entry was publish successfully.",
        }),
      );
    } catch (error) {
      const backendMessage = error?.response?.data?.message || error?.message;

      setFeedback(
        buildErrorFeedback(
          {
            severity: "error",
            title: "Could not publish what's new entry",
            message: "Could not publish what's new entry.",
          },
          backendMessage,
        ),
      );
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(deletingItem.id);
      setDeletingItem(null);

      setFeedback(
        buildFeedback({
          severity: "success",
          title: "What's new entry delete",
          message: "The entry was delete successfully.",
        }),
      );
    } catch (error) {
      const backendMessage = error?.response?.data?.message || error?.message;

      setFeedback(
        buildErrorFeedback(
          {
            severity: "error",
            title: "Could not create what's new entry",
            message: "Could not create what's new entry.",
          },
          backendMessage,
        ),
      );
    }
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

  return (
    <Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        mb={3}
        spacing={2}
      >
        <Box>
          <Typography variant="h4" fontWeight={700}>
            What&apos;s New Admin
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Create, edit, publish, and manage release notes.
          </Typography>
        </Box>

        <Button variant="contained" onClick={() => setIsCreateOpen(true)}>
          Create entry
        </Button>
      </Stack>

      <Stack spacing={2}>
        {items.map((item) => {
          const typeConfig = getWhatsNewTypeConfig(item.type);

          return (
            <Paper
              key={item.id}
              sx={{
                p: 3,
                borderRadius: "24px",
                border: "1px solid",
                borderColor: "divider",
                boxShadow: "none",
              }}
            >
              <Stack spacing={1.5}>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={1}
                  alignItems={{ xs: "flex-start", sm: "center" }}
                >
                  <Typography variant="h6" fontWeight={700}>
                    {item.title}
                  </Typography>

                  <Chip label={item.version} size="small" variant="outlined" />
                  <Chip
                    label={typeConfig.label}
                    color={typeConfig.color}
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    label={item.isViewed ? "Viewed" : "Unviewed"}
                    size="small"
                    variant="outlined"
                  />
                </Stack>

                <Typography variant="body2" color="text.secondary">
                  {item.summary}
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  {item.publishedAt
                    ? `Published: ${new Date(item.publishedAt).toLocaleString()}`
                    : "Draft"}
                </Typography>

                <Stack direction="row" spacing={1} flexWrap="wrap">
                  <Button size="small" onClick={() => setEditingItem(item)}>
                    Edit
                  </Button>

                  {!item.isPublished ? (
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handlePublish(item.id)}
                      disabled={publishMutation.isPending}
                    >
                      Publish
                    </Button>
                  ) : null}

                  <Button
                    size="small"
                    color="error"
                    onClick={() => setDeletingItem(item)}
                  >
                    Delete
                  </Button>
                </Stack>
              </Stack>
            </Paper>
          );
        })}
      </Stack>

      <WhatsNewFormDialog
        open={isCreateOpen}
        mode="create"
        isSubmitting={createMutation.isPending}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreate}
      />

      <WhatsNewFormDialog
        open={Boolean(editingItem)}
        mode="edit"
        initialValues={editingItem}
        isSubmitting={updateMutation.isPending}
        onClose={() => setEditingItem(null)}
        onSubmit={handleUpdate}
      />

      <DeleteWhatsNewDialog
        open={Boolean(deletingItem)}
        item={deletingItem}
        isDeleting={deleteMutation.isPending}
        onClose={() => setDeletingItem(null)}
        onConfirm={handleDelete}
      />

      <AppFeedbackSnackbar
        open={feedback.open}
        severity={feedback.severity}
        title={feedback.title}
        message={feedback.message}
        onClose={handleCloseFeedback}
      />
    </Box>
  );
};

export default WhatsNewAdminPage;
