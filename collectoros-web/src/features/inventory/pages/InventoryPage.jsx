import { useMemo, useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Alert,
  Box,
  CircularProgress,
  Button,
  Typography,
  Stack,
} from "@mui/material";
import InventoryToolbar from "../components/InventoryToolbar";
import InventoryTable from "../components/InventoryTable";
import InventoryEmptyState from "../components/InventoryEmptyState";
import InventoryFormDialog from "../components/InventoryFormDialog";
import { useInventoryList } from "../hooks/useInventoryList";
import { useCreateInventoryItem } from "../hooks/useCreateInventoryItem";
import AppFeedbackSnackbar from "../../../components/feedback/AppFeedbackSnackbar";
import { useUpdateInventoryItem } from "../hooks/useUpdateInventoryItem";
import {
  buildErrorFeedback,
  buildFeedback,
  feedbackMessages,
} from "../../../utils/feedbackHelpers";
import DeleteInventoryDialog from "../components/DeleteInventoryDialog";
import { useDeleteInventoryItem } from "../hooks/useDeleteInventoryItem";
import InventoryDetailsDialog from "../components/InventoryDetailsDialog";
import { useInventoryItem } from "../hooks/useInventoryItem";
import InventoryFilteredEmptyState from "../components/InventoryEmptyState";
import PriceHistoryDialog from "../../price-history/components/PriceHistoryDialog";
import { useConnectMicrosoft } from "../../auth/hooks/useConnectMicrosoft";
import { useAuth } from "../../auth/hooks/useAuth";
import { useInventoryItemImages } from "../hooks/useInventoryItemImages";

const InventoryPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [viewingItemId, setViewingItemId] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name-asc");
  const [priceHistoryOpen, setPriceHistoryOpen] = useState(false);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const hasActiveFilters = Boolean(searchTerm) || selectedCategory !== "all";
  const [isTemporaryPollingActive, setIsTemporaryPollingActive] =
    useState(false);
  const pollingTimeoutRef = useRef(null);

  const { data, isLoading, isError, error, isFetching } = useInventoryList(
    {
      page: page + 1,
      limit: rowsPerPage,
      search: searchTerm,
      category: selectedCategory,
      sortBy,
    },
    {
      refetchInterval: isTemporaryPollingActive ? 3000 : false,
    },
  );

  const categories = [
    { value: "figure", label: "Figure" },
    { value: "statue", label: "Statue" },
    { value: "card", label: "Card" },
    { value: "comic", label: "Comic" },
    { value: "manga", label: "Manga" },
    { value: "game", label: "Game" },
    { value: "console", label: "Console" },
    { value: "artbook", label: "Artbook" },
    { value: "merch", label: "Merch" },
    { value: "watch", label: "Watch" },
    { value: "other", label: "Other" },
  ];

  const createInventoryMutation = useCreateInventoryItem();
  const updateInventoryMutation = useUpdateInventoryItem();
  const deleteInventoryMutation = useDeleteInventoryItem();
  const { data: editingImagesResponse, isLoading: isLoadingEditingImages } =
    useInventoryItemImages(
      editingItem?.id,
      isEditDialogOpen && !!editingItem?.id,
    );
  const editingItemImages = editingImagesResponse?.data || [];
  const inventoryItemQuery = useInventoryItem(viewingItemId, isViewDialogOpen);
  const connectMicrosoftMutation = useConnectMicrosoft();
  const { user } = useAuth();
  const isMicrosoftConnected =
    !!user?.microsoftAccountId || !!user?.microsoftConnected;

  const [feedback, setFeedback] = useState({
    open: false,
    severity: "success",
    title: "",
    message: "",
  });

  const items = data?.data || [];
  const pagination = data?.pagination;

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setPage(0);
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setPage(0);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    setPage(0);
  };

  const handleOpenPriceHistory = (item) => {
    setSelectedHistoryItem(item);
    setPriceHistoryOpen(true);
  };

  const handleClosePriceHistory = () => {
    setPriceHistoryOpen(false);
    setSelectedHistoryItem(null);
  };

  const handleCloseFeedback = () => {
    setFeedback((prev) => ({
      ...prev,
      open: false,
    }));
  };

  const handleOpenCreateDialog = () => {
    setIsCreateDialogOpen(true);
  };

  const handleCloseCreateDialog = () => {
    if (!createInventoryMutation.isPending) {
      setIsCreateDialogOpen(false);
    }
  };

  const handleCreateItem = async (payload) => {
    try {
      const response = await createInventoryMutation.mutateAsync(payload);

      setIsCreateDialogOpen(false);

      const isTrackingEnabled = payload.get("isTrackingEnabled") === "true";
      const trackingUrl = payload.get("trackingUrl");

      if (isTrackingEnabled && trackingUrl) {
        startTemporaryPolling();
      }

      if (response?.warnings?.length) {
        const backendWarningMessage = response.warnings
          .map((warning) => warning.message)
          .join(" ");

        setFeedback(
          buildFeedback({
            ...feedbackMessages.createWarning,
            message:
              backendWarningMessage || feedbackMessages.createWarning.message,
          }),
        );

        return;
      }

      setFeedback(buildFeedback(feedbackMessages.createSuccess));
    } catch (mutationError) {
      console.error("Create inventory item error:", mutationError);

      const backendMessage =
        mutationError?.response?.data?.message || mutationError?.message;

      setFeedback(
        buildErrorFeedback(feedbackMessages.createError, backendMessage),
      );
    }
  };

  const handleViewItem = (item) => {
    setViewingItemId(item.id);
    setIsViewDialogOpen(true);
  };

  const handleCloseViewDialog = () => {
    setIsViewDialogOpen(false);
    setViewingItemId(null);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    if (!updateInventoryMutation.isPending) {
      setIsEditDialogOpen(false);
      setEditingItem(null);
    }
  };

  const handleEditItemSubmit = async (payload) => {
    const hasChanges =
      payload instanceof FormData
        ? payload.get("hasChanges") === "true"
        : payload && Object.keys(payload).length > 0;

    if (!hasChanges) {
      setFeedback(buildFeedback(feedbackMessages.noChanges));
      return;
    }

    try {
      const response = await updateInventoryMutation.mutateAsync({
        id: editingItem.id,
        payload,
      });

      const isTrackingEnabled =
        payload instanceof FormData
          ? (payload.get("isTrackingEnabled") ??
              String(Boolean(editingItem?.isTrackingEnabled))) === "true"
          : Boolean(
              payload?.isTrackingEnabled ?? editingItem?.isTrackingEnabled,
            );

      const trackingUrl =
        payload instanceof FormData
          ? (payload.get("trackingUrl") ?? editingItem?.trackingUrl)
          : (payload?.trackingUrl ?? editingItem?.trackingUrl);

      const shouldTriggerPolling = Boolean(isTrackingEnabled && trackingUrl);

      setIsEditDialogOpen(false);
      setEditingItem(null);

      if (shouldTriggerPolling) {
        startTemporaryPolling();
      }

      if (response?.warnings?.length) {
        const backendWarningMessage = response.warnings
          .map((warning) => warning.message)
          .join(" ");

        setFeedback(
          buildFeedback({
            ...feedbackMessages.updateWarning,
            message:
              backendWarningMessage || feedbackMessages.updateWarning.message,
          }),
        );

        return;
      }

      setFeedback(buildFeedback(feedbackMessages.updateSuccess));
    } catch (mutationError) {
      console.error("Update inventory item error:", mutationError);

      const backendMessage =
        mutationError?.response?.data?.message || mutationError?.message;

      setFeedback(
        buildErrorFeedback(feedbackMessages.updateError, backendMessage),
      );
    }
  };

  const handleDeleteItem = (item) => {
    setDeletingItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    if (!deleteInventoryMutation.isPending) {
      setIsDeleteDialogOpen(false);
      setDeletingItem(null);
    }
  };

  const handleConfirmDeleteItem = async () => {
    if (!deletingItem) return;

    try {
      await deleteInventoryMutation.mutateAsync(deletingItem.id);

      setIsDeleteDialogOpen(false);
      setDeletingItem(null);

      setFeedback(buildFeedback(feedbackMessages.deleteSuccess));
    } catch (mutationError) {
      console.error("Delete inventory item error:", mutationError);

      const backendMessage =
        mutationError?.response?.data?.message || mutationError?.message;

      setFeedback(
        buildErrorFeedback(feedbackMessages.deleteError, backendMessage),
      );
    }
  };

  const handleConnectMicrosoft = async () => {
    try {
      const response = await connectMicrosoftMutation.mutateAsync();
      const authUrl = response?.data?.authUrl;

      if (!authUrl) {
        throw new Error(
          "No se pudo obtener la URL de autorización de Microsoft.",
        );
      }

      window.location.href = authUrl;
    } catch (error) {
      console.error("Connect Microsoft error:", error);

      const backendMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Could not connect Microsoft.";

      setFeedback(
        buildErrorFeedback("Microsoft connection error", backendMessage),
      );
    }
  };

  useEffect(() => {
    const isMicrosoftConnected = searchParams.get("microsoft_connected");

    if (isMicrosoftConnected === "1") {
      setFeedback(
        buildFeedback({
          title: "Microsoft connected",
          message: "Your Microsoft account was connected successfully.",
        }),
      );

      searchParams.delete("microsoft_connected");
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const startTemporaryPolling = () => {
    setIsTemporaryPollingActive(true);

    if (pollingTimeoutRef.current) {
      clearTimeout(pollingTimeoutRef.current);
    }

    pollingTimeoutRef.current = setTimeout(() => {
      setIsTemporaryPollingActive(false);
    }, 20000);
  };

  useEffect(() => {
    return () => {
      if (pollingTimeoutRef.current) {
        clearTimeout(pollingTimeoutRef.current);
      }
    };
  }, []);

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
        {error?.response?.data?.message || "Could not load inventory."}
      </Alert>
    );
  }

  const createErrorMessage =
    createInventoryMutation.error?.response?.data?.message ||
    "Could not create inventory item.";

  return (
    <Box>
      <Box mb={3}>
        {!isMicrosoftConnected ? (
          <Alert
            severity="info"
            sx={{
              borderRadius: 3,
              alignItems: "center",
            }}
            action={
              <Button
                variant="contained"
                size="small"
                onClick={handleConnectMicrosoft}
              >
                Connect
              </Button>
            }
          >
            <Stack spacing={0.5}>
              <Typography fontWeight={600}>
                Connect Microsoft to enable image uploads
              </Typography>

              <Typography variant="body2">
                Images are stored in your Microsoft account. Connect it to
                upload and manage item photos.
              </Typography>
            </Stack>
          </Alert>
        ) : (
          <Alert
            severity="success"
            sx={{
              borderRadius: 3,
              alignItems: "center",
            }}
          >
            <Typography fontWeight={600}>
              Microsoft connected — image uploads are enabled
            </Typography>
          </Alert>
        )}
      </Box>

      <InventoryToolbar
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        categories={categories}
        onAddItem={handleOpenCreateDialog}
      />

      {items.length === 0 ? (
        hasActiveFilters ? (
          <InventoryFilteredEmptyState />
        ) : (
          <InventoryEmptyState onAddItem={handleOpenCreateDialog} />
        )
      ) : (
        <InventoryTable
          items={items}
          total={pagination?.total || 0}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(Number(event.target.value));
            setPage(0);
          }}
          onViewItem={handleViewItem}
          onEditItem={handleEditItem}
          onDeleteItem={handleDeleteItem}
          onOpenPriceHistory={handleOpenPriceHistory}
        />
      )}

      <InventoryFormDialog
        open={isCreateDialogOpen}
        mode="create"
        isSubmitting={createInventoryMutation.isPending}
        errorMessage={createInventoryMutation.isError ? createErrorMessage : ""}
        isMicrosoftConnected={isMicrosoftConnected}
        onClose={handleCloseCreateDialog}
        onSubmit={handleCreateItem}
      />

      <InventoryFormDialog
        open={isEditDialogOpen}
        mode="edit"
        initialValues={editingItem}
        existingImages={editingItemImages}
        isSubmitting={updateInventoryMutation.isPending}
        errorMessage={
          updateInventoryMutation.isError
            ? updateInventoryMutation.error?.response?.data?.message ||
              "Could not update inventory item."
            : ""
        }
        isMicrosoftConnected={isMicrosoftConnected}
        onClose={handleCloseEditDialog}
        onSubmit={handleEditItemSubmit}
      />

      <InventoryDetailsDialog
        open={isViewDialogOpen}
        item={inventoryItemQuery.data?.data || null}
        isLoading={inventoryItemQuery.isLoading}
        isError={inventoryItemQuery.isError}
        errorMessage={
          inventoryItemQuery.error?.response?.data?.message ||
          "Could not load inventory item."
        }
        onClose={handleCloseViewDialog}
      />

      <DeleteInventoryDialog
        open={isDeleteDialogOpen}
        item={deletingItem}
        isDeleting={deleteInventoryMutation.isPending}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDeleteItem}
      />

      <PriceHistoryDialog
        open={priceHistoryOpen}
        onClose={handleClosePriceHistory}
        item={selectedHistoryItem}
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

export default InventoryPage;
