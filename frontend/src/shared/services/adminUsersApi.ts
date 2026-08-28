import {
  apiClient,
} from "../api/client";

import {
  endpoints,
} from "../api/endpoints";


export interface AdminUser {
  id: number;

  username: string;

  email: string;

  role: UserRole;

  token_version: number;

  created_at: string;

  updated_at: string;

  is_active: boolean;
}


export type UserRole =
  | "user"
  | "admin";


export async function getUsers():
Promise<AdminUser[]> {
  const response =
    await apiClient.get<
      AdminUser[]
    >(
      endpoints.admin.users,
    );

  return response.data;
}


export async function updateUserRole(
  userId: number,
  role: UserRole,
): Promise<AdminUser> {
  const response =
    await apiClient.patch<
      AdminUser
    >(
      endpoints.admin.userRole(
        userId,
      ),
      {
        role,
      },
    );

  return response.data;
}


export async function updateUserStatus(
  userId: number,
  isActive: boolean,
): Promise<AdminUser> {
  const response =
    await apiClient.patch<
      AdminUser
    >(
      endpoints.admin.userStatus(
        userId,
      ),
      {
        is_active: isActive,
      },
    );

  return response.data;
}


export interface AdminPasswordResetPayload {
  new_password: string;
  confirm_new_password: string;
}


export interface AdminActionResponse {
  success: boolean;
  message: string;
}


export async function resetUserPassword(
  userId: number,
  payload: AdminPasswordResetPayload,
): Promise<AdminActionResponse> {
  const response =
    await apiClient.patch<
      AdminActionResponse
    >(
      endpoints.admin.userPassword(
        userId,
      ),
      payload,
    );

  return response.data;
}


export async function deleteUser(
  userId: number,
): Promise<AdminActionResponse> {
  const response =
    await apiClient.delete<
      AdminActionResponse
    >(
      endpoints.admin.userDelete(
        userId,
      ),
    );

  return response.data;
}