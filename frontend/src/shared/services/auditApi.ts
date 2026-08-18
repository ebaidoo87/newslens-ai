import { api } from "./api";


export interface AuditLog {
  id: number;

  admin_user_id: number | null;

  target_user_id: number | null;

  action: string;

  details: string | null;

  created_at: string;
}


export interface AuditStats {
  total: number;
}


export async function getAuditLogs(
  skip = 0,
  limit = 50,
): Promise<AuditLog[]> {
  const response =
    await api.get<AuditLog[]>(
      "/admin/audit",
      {
        params: {
          skip,
          limit,
        },
      },
    );

  return response.data;
}


export async function getRecentAuditLogs(
  limit = 20,
): Promise<AuditLog[]> {
  const response =
    await api.get<AuditLog[]>(
      "/admin/audit/recent",
      {
        params: {
          limit,
        },
      },
    );

  return response.data;
}


export async function getAuditStats():
Promise<AuditStats> {
  const response =
    await api.get<AuditStats>(
      "/admin/audit/stats",
    );

  return response.data;
}