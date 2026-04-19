import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";

const defaultValues = {
  version: "",
  title: "",
  summary: "",
  content: "",
  type: "improvement",
  isPublished: false,
};

const WhatsNewFormDialog = ({
  open,
  mode = "create",
  initialValues = null,
  isSubmitting = false,
  onClose,
  onSubmit,
}) => {
  const [formValues, setFormValues] = useState(defaultValues);

  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && initialValues) {
      setFormValues({
        version: initialValues.version || "",
        title: initialValues.title || "",
        summary: initialValues.summary || "",
        content: initialValues.content || "",
        type: initialValues.type || "improvement",
        isPublished: Boolean(initialValues.isPublished),
      });
      return;
    }

    setFormValues(defaultValues);
  }, [open, mode, initialValues]);

  const handleChange = (field) => (event) => {
    const value =
      field === "isPublished" ? event.target.value === "true" : event.target.value;

    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    await onSubmit?.(formValues);
  };

  return (
    <Dialog open={open} onClose={isSubmitting ? undefined : onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {mode === "edit" ? "Edit What's New Entry" : "Create What's New Entry"}
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <TextField
            label="Version"
            value={formValues.version}
            onChange={handleChange("version")}
            fullWidth
          />

          <TextField
            label="Title"
            value={formValues.title}
            onChange={handleChange("title")}
            fullWidth
          />

          <TextField
            label="Summary"
            value={formValues.summary}
            onChange={handleChange("summary")}
            fullWidth
          />

          <TextField
            label="Content (Markdown)"
            value={formValues.content}
            onChange={handleChange("content")}
            fullWidth
            multiline
            minRows={10}
          />

          <TextField
            select
            label="Type"
            value={formValues.type}
            onChange={handleChange("type")}
            fullWidth
          >
            <MenuItem value="feature">Feature</MenuItem>
            <MenuItem value="improvement">Improvement</MenuItem>
            <MenuItem value="fix">Fix</MenuItem>
            <MenuItem value="announcement">Announcement</MenuItem>
          </TextField>

          <TextField
            select
            label="Published"
            value={String(formValues.isPublished)}
            onChange={handleChange("isPublished")}
            fullWidth
          >
            <MenuItem value="false">Draft</MenuItem>
            <MenuItem value="true">Published</MenuItem>
          </TextField>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>

        <Button onClick={handleSubmit} variant="contained" disabled={isSubmitting}>
          {mode === "edit" ? "Save changes" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WhatsNewFormDialog;