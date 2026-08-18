import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  deleteUser,
  getUsers,
  resetUserPassword,
  updateUserRole,
  updateUserStatus,
  type AdminPasswordResetPayload,
  type UserRole,
} from "../../../shared/services/adminUsersApi";

export function useUsers() {
  return useQuery({
    queryKey: [
      "admin",
      "users",
    ],

    queryFn: getUsers,
  });
}


export function useUpdateUserRole() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      role,
    }: {
      userId: number;
      role: UserRole;
    }) =>
      updateUserRole(
        userId,
        role,
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "admin",
          "users",
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "admin",
          "users",
          "stats",
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "admin",
          "dashboard",
        ],
      });
    },
  });
}


export function useUpdateUserStatus() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      isActive,
    }: {
      userId: number;
      isActive: boolean;
    }) =>
      updateUserStatus(
        userId,
        isActive,
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "admin",
          "users",
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "admin",
          "users",
          "stats",
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "admin",
          "dashboard",
        ],
      });
    },
  });
}

export function useResetUserPassword() {
  return useMutation({
    mutationFn: ({
      userId,
      payload,
    }: {
      userId: number;
      payload:
        AdminPasswordResetPayload;
    }) =>
      resetUserPassword(
        userId,
        payload,
      ),
  });
}

export function useDeleteUser() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      userId: number,
    ) =>
      deleteUser(
        userId
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "admin",
          "users",
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "admin",
          "users",
          "stats",
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "admin",
          "dashboard",
        ],
      });
    },
  });
}