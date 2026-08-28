import {
  apiClient,
} from "../api/client";

import {
  endpoints,
} from "../api/endpoints";


export interface LoginCredentials {
  email: string;
  password: string;
}


export interface RegisterCredentials {
  email: string;
  username: string;
  password: string;
}


export interface AuthToken {
  access_token: string;
  token_type: string;
}


export interface AuthUser {
  id: number;
  email: string;
  username: string;
  role: "user" | "admin";
}


export interface UpdateProfilePayload {
  username?: string;
  email?: string;
  current_password: string;
}


export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
  confirm_new_password: string;
}


export async function loginUser(
  credentials: LoginCredentials,
): Promise<AuthToken> {
  const response =
    await apiClient.post<AuthToken>(
      endpoints.auth.login,
      credentials,
    );

  return response.data;
}


export async function registerUser(
  credentials: RegisterCredentials,
): Promise<AuthUser> {
  const response =
    await apiClient.post<AuthUser>(
      endpoints.auth.register,
      credentials,
    );

  return response.data;
}


export async function getCurrentUser():
Promise<AuthUser> {
  const response =
    await apiClient.get<AuthUser>(
      endpoints.auth.me,
    );

  return response.data;
}


export async function updateCurrentUser(
  payload: UpdateProfilePayload,
): Promise<AuthUser> {
  const response =
    await apiClient.patch<AuthUser>(
      endpoints.auth.me,
      payload,
    );

  return response.data;
}


export async function changePassword(
  payload: ChangePasswordPayload,
): Promise<void> {
  await apiClient.patch(
    endpoints.auth.password,
    payload,
  );
}


export async function logoutAllDevices():
Promise<void> {
  await apiClient.post(
    endpoints.auth.logoutAll,
  );
}