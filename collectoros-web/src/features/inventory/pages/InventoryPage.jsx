import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Alert,
  Box,
  CircularProgress,
  Button,
  Typography,
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

  const { data, isLoading, isError, error } = useInventoryList();
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

  const inventoryItems = data?.data || [];

  const [feedback, setFeedback] = useState({
    open: false,
    severity: "success",
    title: "",
    message: "",
  });

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(inventoryItems.map((item) => item.category).filter(Boolean)),
    );

    return uniqueCategories.sort((a, b) => a.localeCompare(b));
  }, [inventoryItems]);

  const filteredItems = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    let result = [...inventoryItems];

    if (normalizedSearch) {
      result = result.filter((item) => {
        const name = item.name?.toLowerCase() || "";
        const category = item.category?.toLowerCase() || "";

        return (
          name.includes(normalizedSearch) || category.includes(normalizedSearch)
        );
      });
    }

    if (selectedCategory !== "all") {
      result = result.filter((item) => item.category === selectedCategory);
    }

    result.sort((a, b) => {
      const gainA =
        Number(a.currentEstimatedValue || 0) - Number(a.purchasePrice || 0);
      const gainB =
        Number(b.currentEstimatedValue || 0) - Number(b.purchasePrice || 0);

      switch (sortBy) {
        case "name-asc":
          return (a.name || "").localeCompare(b.name || "");
        case "name-desc":
          return (b.name || "").localeCompare(a.name || "");
        case "purchasePrice-desc":
          return Number(b.purchasePrice || 0) - Number(a.purchasePrice || 0);
        case "purchasePrice-asc":
          return Number(a.purchasePrice || 0) - Number(b.purchasePrice || 0);
        case "estimatedValue-desc":
          return (
            Number(b.currentEstimatedValue || 0) -
            Number(a.currentEstimatedValue || 0)
          );
        case "estimatedValue-asc":
          return (
            Number(a.currentEstimatedValue || 0) -
            Number(b.currentEstimatedValue || 0)
          );
        case "gain-desc":
          return gainB - gainA;
        case "gain-asc":
          return gainA - gainB;
        case "purchaseDate-desc":
          return new Date(b.purchaseDate) - new Date(a.purchaseDate);
        case "purchaseDate-asc":
          return new Date(a.purchaseDate) - new Date(b.purchaseDate);
        default:
          return 0;
      }
    });

    return result;
  }, [inventoryItems, searchTerm, selectedCategory, sortBy]);

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
      await createInventoryMutation.mutateAsync(payload);

      setIsCreateDialogOpen(false);
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
      await updateInventoryMutation.mutateAsync({
        id: editingItem.id,
        payload,
      });

      setIsEditDialogOpen(false);
      setEditingItem(null);

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
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        sortBy={sortBy}
        onSortChange={setSortBy}
        categories={categories}
        onAddItem={handleOpenCreateDialog}
      />

      {inventoryItems.length === 0 ? (
        <InventoryEmptyState onAddItem={handleOpenCreateDialog} />
      ) : filteredItems.length === 0 ? (
        <InventoryFilteredEmptyState />
      ) : (
        <InventoryTable
          items={filteredItems}
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
