import { api } from "./api";

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
}

export async function loginUser(
  credentials: LoginCredentials,
): Promise<AuthToken> {
  const response = await api.post<AuthToken>(
    "/auth/login",
    credentials,
  );

  return response.data;
}

export async function registerUser(
  credentials: RegisterCredentials,
): Promise<AuthUser> {
  const response = await api.post<AuthUser>(
    "/auth/register",
    credentials,
  );

  return response.data;
}

export async function getCurrentUser():
Promise<AuthUser> {
  const response =
    await api.get<AuthUser>("/auth/me");

  return response.data;
}

