import { api } from "./api";

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
    await api.get<AdminUser[]>(
      "/admin/users",
    );

  return response.data;
}

export async function updateUserRole(
  userId: number,
  role: UserRole,
): Promise<AdminUser> {
  const response =
    await api.patch<AdminUser>(
      `/admin/users/${userId}/role`,
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
    await api.patch<AdminUser>(
      `/admin/users/${userId}/status`,
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
    await api.patch<AdminActionResponse>(
      `/admin/users/${userId}/password`,
      payload,
    );

  return response.data;
}

export async function deleteUser(
  userId: number,
): Promise<AdminActionResponse> {
  const response =
    await api.delete<AdminActionResponse>(
      `/admin/users/${userId}`,
    );

  return response.data;
}