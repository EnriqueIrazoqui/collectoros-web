import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  Typography,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";

import usePriceHistory from "../hooks/usePriceHistory";
import useDeletePriceHistory from "../hooks/useDeletePriceHistory";
import PriceHistoryTable from "./PriceHistoryTable";
import AddPriceHistoryDialog from "./AddPriceHistoryDialog";
import ConfirmDeletePriceHistoryDialog from "./ConfirmDeletePriceHistoryDialog";
import AppFeedbackSnackbar from "../../../components/feedback/AppFeedbackSnackbar";
import {
  formatPriceHistoryCurrency,
  getLatestPriceHistoryRecord,
  sortPriceHistoryDesc,
} from "../utils/formatPriceHistory";

const PriceHistoryDialog = ({ open, onClose, item }) => {
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [feedback, setFeedback] = useState({
    open: false,
    severity: "success",
    title: "",
    message: "",
  });

  const itemId = item?.id;

  const {
    data: response,
    isLoading,
    isError,
    error,
  } = usePriceHistory(itemId, open);

  const deleteMutation = useDeletePriceHistory();

  const historyRows = useMemo(() => {
    const rows = response?.data || [];
    return sortPriceHistoryDesc(rows);
  }, [response]);

  const latestRecord = useMemo(() => {
    return getLatestPriceHistoryRecord(historyRows);
  }, [historyRows]);

  const handleClose = () => {
    setOpenAddDialog(false);
    setDeleteTarget(null);
    setConfirmDeleteOpen(false);
    onClose?.();
  };

  const handleDeleteClick = (row) => {
    setDeleteTarget(row);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget || !itemId) return;

    try {
      await deleteMutation.mutateAsync({
        priceHistoryId: deleteTarget.id,
        itemId,
      });

      setFeedback({
        open: true,
        severity: "success",
        title: "Price history updated",
        message: "Price record deleted successfully.",
      });

      setConfirmDeleteOpen(false);
      setDeleteTarget(null);
    } catch (err) {
      console.error("Error deleting price history entry:", err);

      setFeedback({
        open: true,
        severity: "error",
        title: "Delete failed",
        message:
          err?.response?.data?.message ||
          err?.message ||
          "Could not delete the price record.",
      });
    }
  };

  const handleCloseFeedback = () => {
    setFeedback((prev) => ({
      ...prev,
      open: false,
    }));
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: 4,
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
          >
            <Box>
              <Typography variant="h6" fontWeight={700}>
                Price History
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {item?.name || "Selected item"}
              </Typography>
            </Box>

            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent sx={{ pt: 1 }}>
          <Stack spacing={3}>
            <Box
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
                p: 2,
              }}
            >
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
              >
                <Stack spacing={1}>
                  <Typography variant="subtitle1" fontWeight={700}>
                    {item?.name || "Unnamed item"}
                  </Typography>

                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {item?.category ? (
                      <Chip
                        size="small"
                        label={item.category}
                        variant="outlined"
                      />
                    ) : null}

                    <Chip
                      size="small"
                      icon={<TimelineOutlinedIcon />}
                      label={`${historyRows.length} records`}
                      variant="outlined"
                    />
                  </Stack>
                </Stack>

                <Stack
                  spacing={0.5}
                  alignItems={{ xs: "flex-start", sm: "flex-end" }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Current estimated value
                  </Typography>

                  <Typography variant="h6" fontWeight={700}>
                    {formatPriceHistoryCurrency(
                      item?.currentEstimatedValue || 0,
                    )}
                  </Typography>

                  {latestRecord ? (
                    <Typography variant="caption" color="text.secondary">
                      Last record:{" "}
                      {formatPriceHistoryCurrency(latestRecord.price)}
                    </Typography>
                  ) : null}
                </Stack>
              </Stack>
            </Box>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "stretch", sm: "center" }}
              spacing={2}
            >
              <Box>
                <Typography variant="subtitle1" fontWeight={700}>
                  History records
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  View, manage and track historical prices for this item.
                </Typography>
              </Box>

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenAddDialog(true)}
                disabled={!itemId}
              >
                Add price record
              </Button>
            </Stack>

            <Divider />

            {isLoading ? (
              <Box
                sx={{
                  minHeight: 220,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Stack alignItems="center" spacing={2}>
                  <CircularProgress />
                  <Typography variant="body2" color="text.secondary">
                    Loading price history...
                  </Typography>
                </Stack>
              </Box>
            ) : isError ? (
              <Box
                sx={{
                  minHeight: 160,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px dashed",
                  borderColor: "divider",
                  borderRadius: 3,
                  p: 3,
                }}
              >
                <Stack spacing={1} alignItems="center">
                  <TrendingUpOutlinedIcon color="error" />
                  <Typography variant="subtitle2" color="error">
                    Error loading price history
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {error?.response?.data?.message ||
                      error?.message ||
                      "Something went wrong."}
                  </Typography>
                </Stack>
              </Box>
            ) : (
              <PriceHistoryTable
                rows={historyRows}
                onDelete={handleDeleteClick}
                deletingId={deleteMutation.variables?.priceHistoryId}
              />
            )}
          </Stack>
        </DialogContent>
      </Dialog>

      <AddPriceHistoryDialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        item={item}
        onCreateSuccess={() => {
          setFeedback({
            open: true,
            severity: "success",
            title: "Price history updated",
            message: "Price record created successfully.",
          });
        }}
      />

      <ConfirmDeletePriceHistoryDialog
        open={confirmDeleteOpen}
        onClose={() => {
          setConfirmDeleteOpen(false);
          setDeleteTarget(null);
        }}
        onConfirm={handleConfirmDelete}
        loading={deleteMutation.isPending}
        record={deleteTarget}
      />

      <AppFeedbackSnackbar
        open={feedback.open}
        severity={feedback.severity}
        title={feedback.title}
        message={feedback.message}
        onClose={handleCloseFeedback}
      />
    </>
  );
};

export default PriceHistoryDialog;
