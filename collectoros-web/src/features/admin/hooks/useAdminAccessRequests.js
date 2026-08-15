import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getAdminAccessRequestsRequest,
  updateAccessRequestStatusRequest,
} from "../api/adminAccessRequestsApi";

const ADMIN_ACCESS_REQUESTS_QUERY_KEY = [
  "admin",
  "access-requests",
];

const useAdminAccessRequests = () => {
  const queryClient = useQueryClient();

  const accessRequestsQuery = useQuery({
    queryKey: ADMIN_ACCESS_REQUESTS_QUERY_KEY,
    queryFn: getAdminAccessRequestsRequest,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ requestId, status }) =>
      updateAccessRequestStatusRequest(requestId, status),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_ACCESS_REQUESTS_QUERY_KEY,
      });
    },
  });

  const updateRequestStatus = async (requestId, status) => {
    return updateStatusMutation.mutateAsync({
      requestId,
      status,
    });
  };

  return {
    accessRequests: accessRequestsQuery.data?.data ?? [],

    isLoading: accessRequestsQuery.isLoading,
    isError: accessRequestsQuery.isError,
    error: accessRequestsQuery.error,

    updateRequestStatus,

    isSubmitting: updateStatusMutation.isPending,
  };
};

export {
  useAdminAccessRequests,
};