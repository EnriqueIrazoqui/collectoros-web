import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";

import { useAdminAccessRequests } from "../hooks/useAdminAccessRequests";
import AdminAccessRequestsTable from "../components/AdminAccessRequestsTable";
import AccessRequestDetailsDialog from "../components/AccessRequestDetailsDialog";

import AppFeedbackSnackbar from "../../../components/feedback/AppFeedbackSnackbar";
import ConfirmActionDialog from "../../../components/feedback/ConfirmActionDialog";

const initialConfirmState = {
  open: false,
  type: "",
  request: null,
};

const AdminAccessRequestsPage = () => {
  const {
    accessRequests,
    isLoading,
    isError,
    error,
    isSubmitting,
    updateRequestStatus,
  } = useAdminAccessRequests();

  const [selectedRequest, setSelectedRequest] = useState(null);

  const [confirmDialog, setConfirmDialog] =
    useState(initialConfirmState);

  const [feedback, setFeedback] = useState({
    open: false,
    severity: "success",
    title: "",
    message: "",
  });

  const showFeedback = ({
    severity = "success",
    title = "",
    message = "",
  }) => {
    setFeedback({
      open: true,
      severity,
      title,
      message,
    });
  };

  const handleCloseFeedback = () => {
    setFeedback((prev) => ({
      ...prev,
      open: false,
    }));
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
  };

  const handleCloseDetails = () => {
    setSelectedRequest(null);
  };

  const handleApprove = (request) => {
    setConfirmDialog({
      open: true,
      type: "approved",
      request,
    });
  };

  const handleReject = (request) => {
    setConfirmDialog({
      open: true,
      type: "rejected",
      request,
    });
  };

  const handleCloseConfirm = () => {
    if (isSubmitting) return;

    setConfirmDialog(initialConfirmState);
  };

  const handleConfirmAction = async () => {
    const request = confirmDialog.request;
    const status = confirmDialog.type;

    if (!request || !status) return;

    try {
      await updateRequestStatus(request.id, status);

      if (status === "approved") {
        showFeedback({
          severity: "success",
          title: "Access request approved",
          message: `An invitation email was sent to ${request.email}.`,
        });
      }

      if (status === "rejected") {
        showFeedback({
          severity: "success",
          title: "Access request rejected",
          message: `${request.name}'s access request was rejected.`,
        });
      }

      setConfirmDialog(initialConfirmState);
    } catch (requestError) {
      console.error(requestError);

      showFeedback({
        severity: "error",
        title: "Action failed",
        message:
          requestError?.response?.data?.message ||
          "An unexpected error occurred.",
      });
    }
  };

  const isApproving = confirmDialog.type === "approved";

  const confirmTitle = isApproving
    ? "Approve access request"
    : "Reject access request";

  const confirmMessage = confirmDialog.request
    ? isApproving
      ? `Approve ${confirmDialog.request.name}? An invitation email will be sent to ${confirmDialog.request.email}.`
      : `Are you sure you want to reject ${confirmDialog.request.name}'s access request?`
    : "";

  const confirmText = isApproving
    ? "Approve & Send Invitation"
    : "Reject";

  const confirmColor = isApproving
    ? "success"
    : "error";

  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={0.5} sx={{ mb: 3 }}>
        <Typography variant="h3" fontWeight={700}>
          Access Requests
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
        >
          Review requests from people who want to join CollectorOS.
        </Typography>
      </Stack>

      <Card>
        <CardContent>
          {isLoading ? (
            <Typography color="text.secondary">
              Loading access requests...
            </Typography>
          ) : isError ? (
            <Stack spacing={0.5}>
              <Typography
                color="error.main"
                fontWeight={700}
              >
                Could not load access requests.
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                {error?.response?.data?.message ||
                  "An unexpected error occurred."}
              </Typography>
            </Stack>
          ) : (
            <AdminAccessRequestsTable
              requests={accessRequests}
              isSubmitting={isSubmitting}
              onViewDetails={handleViewDetails}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          )}
        </CardContent>
      </Card>

      <AccessRequestDetailsDialog
        open={Boolean(selectedRequest)}
        request={selectedRequest}
        onClose={handleCloseDetails}
      />

      <ConfirmActionDialog
        open={confirmDialog.open}
        title={confirmTitle}
        message={confirmMessage}
        confirmText={confirmText}
        confirmColor={confirmColor}
        onClose={handleCloseConfirm}
        onConfirm={handleConfirmAction}
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

export default AdminAccessRequestsPage;