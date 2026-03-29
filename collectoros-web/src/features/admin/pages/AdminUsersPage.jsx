import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import { useAuth } from "../../auth/hooks/useAuth";
import { useAdminUsers } from "../hooks/useAdminUsers";
import AdminUsersTable from "../components/AdminUsersTable";
import CreateUserDialog from "../components/CreateUserDialog";
import AppFeedbackSnackbar from "../../../components/feedback/AppFeedbackSnackbar";
import ConfirmActionDialog from "../../../components/feedback/ConfirmActionDialog";

const initialConfirmState = {
  open: false,
  type: "",
  userId: null,
  userName: "",
  currentRole: "",
  currentStatus: false,
};

const AdminUsersPage = () => {
  const { user: currentUser } = useAuth();

  const {
    users,
    isLoading,
    isSubmitting,
    createUser,
    updateUserRole,
    updateUserStatus,
  } = useAdminUsers();

  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  const [feedback, setFeedback] = useState({
    open: false,
    severity: "success",
    title: "",
    message: "",
  });

  const [confirmDialog, setConfirmDialog] = useState(initialConfirmState);

  const showFeedback = ({ severity = "success", title = "", message = "" }) => {
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

  const handleCreateUser = async (payload) => {
    try {
      await createUser(payload);

      showFeedback({
        severity: "success",
        title: "User created",
        message: "The user was created successfully.",
      });

      setOpenCreateDialog(false);
    } catch (error) {
      console.error(error);

      showFeedback({
        severity: "error",
        title: "Error creating user",
        message:
          error?.response?.data?.message || "An unexpected error occurred.",
      });

      throw error;
    }
  };

  const handleOpenRoleConfirm = (targetUser) => {
    setConfirmDialog({
      open: true,
      type: "role",
      userId: targetUser.id,
      userName: targetUser.displayName,
      currentRole: targetUser.role,
      currentStatus: targetUser.isActive,
    });
  };

  const handleOpenStatusConfirm = (targetUser) => {
    setConfirmDialog({
      open: true,
      type: "status",
      userId: targetUser.id,
      userName: targetUser.displayName,
      currentRole: targetUser.role,
      currentStatus: targetUser.isActive,
    });
  };

  const handleCloseConfirm = () => {
    if (isSubmitting) return;
    setConfirmDialog(initialConfirmState);
  };

  const handleConfirmAction = async () => {
    try {
      if (confirmDialog.type === "role") {
        const nextRole =
          confirmDialog.currentRole === "admin" ? "user" : "admin";

        await updateUserRole(confirmDialog.userId, nextRole);

        showFeedback({
          severity: "success",
          title: "Role updated",
          message: `${confirmDialog.userName} is now ${nextRole}.`,
        });
      }

      if (confirmDialog.type === "status") {
        const nextStatus = !confirmDialog.currentStatus;

        await updateUserStatus(confirmDialog.userId, nextStatus);

        showFeedback({
          severity: "success",
          title: "Status updated",
          message: `${confirmDialog.userName} was ${
            nextStatus ? "activated" : "deactivated"
          } successfully.`,
        });
      }

      setConfirmDialog(initialConfirmState);
    } catch (error) {
      console.error(error);

      showFeedback({
        severity: "error",
        title: "Action failed",
        message:
          error?.response?.data?.message || "An unexpected error occurred.",
      });
    }
  };

  const confirmTitle =
    confirmDialog.type === "role"
      ? "Change user role"
      : confirmDialog.currentStatus
        ? "Deactivate user"
        : "Activate user";

  const confirmMessage =
    confirmDialog.type === "role"
      ? `Are you sure you want to change ${confirmDialog.userName} to ${
          confirmDialog.currentRole === "admin" ? "user" : "admin"
        }?`
      : `Are you sure you want to ${
          confirmDialog.currentStatus ? "deactivate" : "activate"
        } ${confirmDialog.userName}?`;

  const confirmText =
    confirmDialog.type === "role"
      ? confirmDialog.currentRole === "admin"
        ? "Make User"
        : "Make Admin"
      : confirmDialog.currentStatus
        ? "Deactivate"
        : "Activate";

  const confirmColor =
    confirmDialog.type === "status"
      ? confirmDialog.currentStatus
        ? "warning"
        : "success"
      : "primary";

  return (
    <Box sx={{ p: 3 }}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", md: "center" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h3" fontWeight={700}>
            Admin Users
          </Typography>

          <Typography variant="body1" color="text.secondary">
            Manage CollectorOS users, roles and account status.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenCreateDialog(true)}
        >
          Create User
        </Button>
      </Stack>

      <Card>
        <CardContent>
          {isLoading ? (
            <Typography color="text.secondary">Loading users...</Typography>
          ) : (
            <AdminUsersTable
              users={users}
              isSubmitting={isSubmitting}
              currentUserId={currentUser?.id}
              onToggleRole={handleOpenRoleConfirm}
              onToggleStatus={handleOpenStatusConfirm}
            />
          )}
        </CardContent>
      </Card>

      <CreateUserDialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        onSubmit={handleCreateUser}
        isSubmitting={isSubmitting}
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

export default AdminUsersPage;
