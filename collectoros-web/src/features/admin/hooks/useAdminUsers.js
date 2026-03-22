import { useCallback, useEffect, useState } from "react";
import {
  createAdminUserRequest,
  getAdminUsersRequest,
  updateAdminUserRoleRequest,
  updateAdminUserStatusRequest,
} from "../api/adminApi";

export const useAdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getAdminUsersRequest();
      setUsers(response.data || []);
    } catch (error) {
      console.error("Error fetching admin users:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createUser = async (payload) => {
    try {
      setIsSubmitting(true);
      const response = await createAdminUserRequest(payload);
      await fetchUsers();
      return response;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateUserRole = async (userId, role) => {
    try {
      setIsSubmitting(true);
      const response = await updateAdminUserRoleRequest(userId, { role });
      await fetchUsers();
      return response;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateUserStatus = async (userId, isActive) => {
    try {
      setIsSubmitting(true);
      const response = await updateAdminUserStatusRequest(userId, { isActive });
      await fetchUsers();
      return response;
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    isLoading,
    isSubmitting,
    fetchUsers,
    createUser,
    updateUserRole,
    updateUserStatus,
  };
};