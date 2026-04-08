import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Alert, Box, CircularProgress } from "@mui/material";
import WishlistToolbar from "../components/WishlistToolbar";
import WishlistTable from "../components/WishlistTable";
import WishlistEmptyState from "../components/WishlistEmptyState";
import WishlistFilteredEmptyState from "../components/WishlistFilteredEmptyState";
import WishlistFormDialog from "../components/WishlistFormDialog";
import { useWishlistList } from "../hooks/useWishlistList";
import { useCreateWishlistItem } from "../hooks/useCreateWishlistItem";
import AppFeedbackSnackbar from "../../../components/feedback/AppFeedbackSnackbar";
import {
  buildErrorFeedback,
  buildFeedback,
  feedbackMessages,
} from "../../../utils/feedbackHelpers";
import { useUpdateWishlistItem } from "../hooks/useUpdateWishlistItem";
import DeleteWishlistDialog from "../components/DeleteWishlistDialog";
import { useDeleteWishlistItem } from "../hooks/useDeleteWishlistItem";
import WishlistDetailsDialog from "../components/WishlistDetailsDialog";
import { useWishlistItem } from "../hooks/useWishlistItem";
import { useWishlistAlerts } from "../../alerts/hooks/useWishlistAlerts";
import WishlistStatusSummary from "../components/WishlistStatusSummary";
import { useQueryClient } from "@tanstack/react-query";

const WishlistPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [viewingItemId, setViewingItemId] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [feedback, setFeedback] = useState({
    open: false,
    severity: "success",
    title: "",
    message: "",
  });

  const queryClient = useQueryClient();

  const [searchParams, setSearchParams] = useSearchParams();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [isTemporaryPollingActive, setIsTemporaryPollingActive] =
    useState(false);

  const wishlistAlertsQuery = useWishlistAlerts({
    pollingEnabled: isTemporaryPollingActive,
  });
  const wishlistAlerts = wishlistAlertsQuery.data?.data || [];

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [sortBy, setSortBy] = useState("name-asc");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const [trackingItemIds, setTrackingItemIds] = useState([]);
  const pollingTimeoutRef = useRef(null);

  const { data, isLoading, isFetching, isError, error } = useWishlistList({
    page: page + 1,
    limit: rowsPerPage,
    search: searchTerm,
    category: selectedCategory,
    priority: selectedPriority,
    status: selectedStatus,
    sortBy,
    pollingEnabled: isTemporaryPollingActive,
  });

  const items = data?.data || [];
  const pagination = data?.pagination || {};
  const createWishlistMutation = useCreateWishlistItem();
  const updateWishlistMutation = useUpdateWishlistItem();
  const deleteWishlistMutation = useDeleteWishlistItem();
  const wishlistItemQuery = useWishlistItem(
    viewingItemId,
    isViewDialogOpen,
    isViewDialogOpen && isTemporaryPollingActive,
  );

  const wishlistCategories = [
    { value: "card", label: "Card" },
    { value: "statue", label: "Statue" },
    { value: "figure", label: "Figure" },
    { value: "comic", label: "Comic" },
    { value: "manga", label: "Manga" },
    { value: "game", label: "Game" },
    { value: "console", label: "Console" },
    { value: "artbook", label: "Artbook" },
    { value: "merch", label: "Merch" },
    { value: "watch", label: "Watch" },
    { value: "other", label: "Other" },
  ];

const startTemporaryPolling = (itemId = null) => {
  setIsTemporaryPollingActive(true);

  if (itemId) {
    setTrackingItemIds((prev) =>
      prev.includes(itemId) ? prev : [...prev, itemId],
    );
  }

  if (pollingTimeoutRef.current) {
    clearTimeout(pollingTimeoutRef.current);
  }

  pollingTimeoutRef.current = setTimeout(async () => {
    setIsTemporaryPollingActive(false);
    setTrackingItemIds([]);

    await queryClient.invalidateQueries({ queryKey: ["wishlist-list"] });
    await queryClient.invalidateQueries({ queryKey: ["wishlist-alerts"] });
    await queryClient.invalidateQueries({
      queryKey: ["wishlist-alerts-unread-count"],
    });

    if (itemId) {
      await queryClient.invalidateQueries({
        queryKey: ["wishlist-item", itemId],
      });
    }
  }, 20000);
};

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setPage(0);
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setPage(0);
  };

  const handlePriorityChange = (value) => {
    setSelectedPriority(value);
    setPage(0);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    setPage(0);
  };

  const handleStatusChange = (value) => {
    setSelectedStatus(value);
    setPage(0);
  };

  const handleOpenCreateDialog = () => {
    setIsCreateDialogOpen(true);
  };

  const handleCloseCreateDialog = () => {
    if (!createWishlistMutation.isPending) {
      setIsCreateDialogOpen(false);
    }
  };

  const handleCloseFeedback = () => {
    setFeedback((prev) => ({
      ...prev,
      open: false,
    }));
  };

  const handleCreateWishlistItem = async (formValues) => {
    try {
      const response = await createWishlistMutation.mutateAsync(formValues);
      const createdItemId =
        response?.data?.id || response?.data?.item?.id || null;

      setIsCreateDialogOpen(false);
      startTemporaryPolling(createdItemId);

      setFeedback(
        buildFeedback({
          severity: "success",
          title: "Wishlist item created",
          message:
            "The item was created. Price tracking may take a few seconds to finish.",
        }),
      );
    } catch (mutationError) {
      console.error("Create wishlist item error:", mutationError);

      const backendMessage =
        mutationError?.response?.data?.message || mutationError?.message;

      setFeedback(
        buildErrorFeedback(
          {
            severity: "error",
            title: "Could not create wishlist item",
            message: "Could not create wishlist item.",
          },
          backendMessage,
        ),
      );

      throw mutationError;
    }
  };

  const handleOpenViewDialog = (item) => {
    setViewingItemId(item.id);
    setIsViewDialogOpen(true);

    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("viewItem", String(item.id));
    setSearchParams(nextParams, { replace: true });
  };

  const handleCloseViewDialog = () => {
    setIsViewDialogOpen(false);
    setViewingItemId(null);

    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("viewItem");
    setSearchParams(nextParams, { replace: true });
  };

  const handleViewItem = (item) => {
    handleOpenViewDialog(item);
  };

  const handleOpenEditDialog = (item) => {
    setEditingItem(item);
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    if (!updateWishlistMutation.isPending) {
      setIsEditDialogOpen(false);
      setEditingItem(null);
    }
  };

  const handleEditItemSubmit = async (payload) => {
    if (!payload || Object.keys(payload).length === 0) {
      setFeedback(
        buildFeedback({
          severity: "info",
          title: "No changes detected",
          message: "Make a change before saving the item.",
        }),
      );
      return;
    }

    try {
      await updateWishlistMutation.mutateAsync({
        id: editingItem.id,
        payload,
      });

      const shouldTriggerTrackingPolling =
        Object.prototype.hasOwnProperty.call(payload, "purchaseUrl") ||
        Object.prototype.hasOwnProperty.call(payload, "isTrackingEnabled") ||
        Object.prototype.hasOwnProperty.call(payload, "trackingFrequencyHours");

      if (shouldTriggerTrackingPolling) {
        startTemporaryPolling(editingItem.id);
      }

      setIsEditDialogOpen(false);
      setEditingItem(null);

      setFeedback(
        buildFeedback({
          severity: "info",
          title: "Wishlist item updated",
          message: shouldTriggerTrackingPolling
            ? "The item was updated. Price tracking may take a few seconds to refresh."
            : "The wishlist item was updated successfully.",
        }),
      );
    } catch (mutationError) {
      console.error("Update wishlist item error:", mutationError);

      const backendMessage =
        mutationError?.response?.data?.message || mutationError?.message;

      setFeedback(
        buildErrorFeedback(
          {
            severity: "error",
            title: "Could not update wishlist item",
            message: "Could not update wishlist item.",
          },
          backendMessage,
        ),
      );
    }
  };

  const handleEditItem = (item) => {
    handleOpenEditDialog(item);
  };

  const handleOpenDeleteDialog = (item) => {
    setDeletingItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    if (!deleteWishlistMutation.isPending) {
      setIsDeleteDialogOpen(false);
      setDeletingItem(null);
    }
  };

  const handleConfirmDeleteItem = async () => {
    if (!deletingItem) return;

    try {
      await deleteWishlistMutation.mutateAsync(deletingItem.id);

      setIsDeleteDialogOpen(false);
      setDeletingItem(null);

      setFeedback(
        buildFeedback({
          severity: "warning",
          title: "Wishlist item deleted",
          message: "The wishlist item was removed successfully.",
        }),
      );
    } catch (mutationError) {
      console.error("Delete wishlist item error:", mutationError);

      const backendMessage =
        mutationError?.response?.data?.message || mutationError?.message;

      setFeedback(
        buildErrorFeedback(
          {
            severity: "error",
            title: "Could not delete wishlist item",
            message: "Could not delete wishlist item.",
          },
          backendMessage,
        ),
      );
    }
  };

  const handleDeleteItem = (item) => {
    handleOpenDeleteDialog(item);
  };

  useEffect(() => {
    return () => {
      if (pollingTimeoutRef.current) {
        clearTimeout(pollingTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const viewItemParam = searchParams.get("viewItem");

    if (!viewItemParam) {
      return;
    }

    const parsedId = Number(viewItemParam);

    if (!Number.isNaN(parsedId) && parsedId > 0) {
      setViewingItemId(parsedId);
      setIsViewDialogOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!items.length || trackingItemIds.length === 0) {
      return;
    }

    setTrackingItemIds((prev) =>
      prev.filter((trackingId) => {
        const currentItem = items.find((item) => item.id === trackingId);

        if (!currentItem) {
          return false;
        }

        const lastCheckStatus = String(
          currentItem.lastCheckStatus || "",
        ).toLowerCase();

        const hasFinishedSuccessfully =
          currentItem.currentObservedPrice != null;
        const hasFinishedWithTerminalStatus =
          lastCheckStatus === "success" ||
          lastCheckStatus === "error" ||
          lastCheckStatus === "not_found" ||
          lastCheckStatus === "rate_limited";

        return !(hasFinishedSuccessfully || hasFinishedWithTerminalStatus);
      }),
    );
  }, [items, trackingItemIds]);

useEffect(() => {
  if (!items.length || trackingItemIds.length === 0) {
    return;
  }

  const finishedIds = trackingItemIds.filter((trackingId) => {
    const currentItem = items.find((item) => item.id === trackingId);

    if (!currentItem) {
      return true;
    }

    const lastCheckStatus = String(currentItem.lastCheckStatus || "").toLowerCase();

    return (
      currentItem.currentObservedPrice != null ||
      lastCheckStatus === "success" ||
      lastCheckStatus === "error" ||
      lastCheckStatus === "not_found" ||
      lastCheckStatus === "rate_limited"
    );
  });

  if (finishedIds.length > 0) {
    finishedIds.forEach((finishedId) => {
      queryClient.invalidateQueries({
        queryKey: ["wishlist-item", finishedId],
      });
    });
  }

  setTrackingItemIds((prev) =>
    prev.filter((trackingId) => !finishedIds.includes(trackingId)),
  );
}, [items, trackingItemIds, queryClient]);

  if (isLoading && !data) {
    return (
      <Box display="flex" justifyContent="center" py={6}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error">
        {error?.response?.data?.message || "Could not load wishlist."}
      </Alert>
    );
  }

  const createErrorMessage =
    createWishlistMutation.error?.response?.data?.message ||
    "Could not create wishlist item.";

  const hasActiveFilters =
    Boolean(searchTerm.trim()) ||
    selectedCategory !== "all" ||
    selectedPriority !== "all" ||
    selectedStatus !== "all";

  return (
    <Box>
      <WishlistToolbar
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        selectedPriority={selectedPriority}
        onPriorityChange={handlePriorityChange}
        selectedStatus={selectedStatus}
        onStatusChange={handleStatusChange}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        categories={wishlistCategories}
        onAddItem={handleOpenCreateDialog}
      />

      <WishlistStatusSummary items={items} alerts={wishlistAlerts} />

      {items.length === 0 ? (
        hasActiveFilters ? (
          <WishlistFilteredEmptyState />
        ) : (
          <WishlistEmptyState onAddItem={handleOpenCreateDialog} />
        )
      ) : (
        <WishlistTable
          items={items}
          alerts={wishlistAlerts}
          total={pagination?.total || 0}
          page={page}
          rowsPerPage={rowsPerPage}
          trackingItemIds={trackingItemIds}
          isPollingActive={isTemporaryPollingActive}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(Number(event.target.value));
            setPage(0);
          }}
          onViewItem={handleViewItem}
          onEditItem={handleEditItem}
          onDeleteItem={handleDeleteItem}
        />
      )}

      <WishlistFormDialog
        open={isCreateDialogOpen}
        mode="create"
        isSubmitting={createWishlistMutation.isPending}
        errorMessage={createWishlistMutation.isError ? createErrorMessage : ""}
        onClose={handleCloseCreateDialog}
        onSubmit={handleCreateWishlistItem}
      />

      <WishlistFormDialog
        open={isEditDialogOpen}
        mode="edit"
        initialValues={editingItem}
        isSubmitting={updateWishlistMutation.isPending}
        errorMessage={
          updateWishlistMutation.isError
            ? updateWishlistMutation.error?.response?.data?.message ||
              "Could not update wishlist item."
            : ""
        }
        onClose={handleCloseEditDialog}
        onSubmit={handleEditItemSubmit}
      />

      <DeleteWishlistDialog
        open={isDeleteDialogOpen}
        item={deletingItem}
        isDeleting={deleteWishlistMutation.isPending}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDeleteItem}
      />

      <WishlistDetailsDialog
        open={isViewDialogOpen}
        item={wishlistItemQuery.data?.data || null}
        isLoading={wishlistItemQuery.isLoading}
        isError={wishlistItemQuery.isError}
        errorMessage={
          wishlistItemQuery.error?.response?.data?.message ||
          "Could not load wishlist item."
        }
        onClose={handleCloseViewDialog}
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

export default WishlistPage;
