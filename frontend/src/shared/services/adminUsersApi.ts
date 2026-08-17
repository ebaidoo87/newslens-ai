import { api } from "./api";

export interface AdminUser {
  id: number;

  username: string;

  email: string;

  role: string;

  token_version: number;

  created_at: string;

  updated_at: string;
}

export async function getUsers():
Promise<AdminUser[]> {

  const response =
    await api.get<AdminUser[]>(
      "/admin/users",
    );

  return response.data;
}