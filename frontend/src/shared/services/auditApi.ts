import { api } from "./api";


export interface AuditLog {
  id: number;

  admin_user_id:
    number | null;

  target_user_id:
    number | null;

  action: string;

  details:
    string | null;

  created_at: string;
}


export interface AuditLogResponse {
  items: AuditLog[];

  total: number;

  skip: number;

  limit: number;
}


export interface AuditFilters {
  skip?: number;
  limit?: number;

  action?: string;

  admin_user_id?: number;

  target_user_id?: number;

  date_from?: string;

  date_to?: string;

  search?: string;
}


export interface AuditStats {
  total: number;
}


export async function getAuditLogs(
  filters: AuditFilters,
): Promise<AuditLogResponse> {

  const response =
    await api.get<AuditLogResponse>(
      "/admin/audit",
      {
        params: filters,
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

export async function getRecentAuditLogs(
  limit = 8,
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