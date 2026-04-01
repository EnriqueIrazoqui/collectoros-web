export const feedbackMessages = {
  createSuccess: {
    severity: "success",
    title: "Item created",
    message: "The inventory item was created successfully.",
  },

  createWarning: {
    severity: "warning",
    title: "Item created with warnings",
    message:
      "The inventory item was created, but one or more images could not be uploaded.",
  },

  updateSuccess: {
    severity: "info",
    title: "Item updated",
    message: "The inventory item was updated successfully.",
  },

  updateWarning: {
    severity: "warning",
    title: "Item updated with warnings",
    message:
      "The inventory item was updated, but one or more images could not be uploaded.",
  },

  deleteSuccess: {
    severity: "warning",
    title: "Item deleted",
    message: "The inventory item was removed from your collection.",
  },

  noChanges: {
    severity: "info",
    title: "No changes detected",
    message: "Make a change before saving the item.",
  },

  createError: {
    severity: "error",
    title: "Could not create item",
    message: "Could not create inventory item.",
  },

  updateError: {
    severity: "error",
    title: "Could not update item",
    message: "Could not update inventory item.",
  },

  deleteError: {
    severity: "error",
    title: "Could not delete item",
    message: "Could not delete inventory item.",
  },
};

export const buildFeedback = (config) => ({
  open: true,
  severity: config.severity,
  title: config.title,
  message: config.message,
});

export const buildErrorFeedback = (fallbackConfig, backendMessage) => ({
  open: true,
  severity: "error",
  title: fallbackConfig.title,
  message: backendMessage || fallbackConfig.message,
});