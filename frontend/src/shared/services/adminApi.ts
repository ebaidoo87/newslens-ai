import { api } from "./api";


export interface AdminEmailStats {
  total: number;

  pending: number;
  processing: number;
  sent: number;
  failed: number;

  accepted: number;
  delivered: number;
  bounced: number;
  complained: number;
  delivery_delayed: number;

  retrying: number;
  suppressed: number;
}


export interface AdminDashboardSummary {
  users: number;
  articles: number;
  notifications: number;
  email: AdminEmailStats;
}


export interface AdminUserStats {
  total: number;
  admins: number;
  users: number;
}


export interface AdminSystemHealth {
  status: string;
  database: string;
}


export interface AdminRecentEmail {
  id: number;
  recipient: string;
  subject: string;

  email_type: string;
  status: string;

  provider: string;

  provider_status:
    string | null;

  retry_count: number;

  provider_message_id:
    string | null;

  created_at: string;

  sent_at:
    string | null;

  last_error:
    string | null;
}


export async function getAdminDashboard():
Promise<AdminDashboardSummary> {
  const response =
    await api.get<AdminDashboardSummary>(
      "/admin/dashboard",
    );

  return response.data;
}


export async function getAdminUserStats():
Promise<AdminUserStats> {
  const response =
    await api.get<AdminUserStats>(
      "/admin/users/stats",
    );

  return response.data;
}


export async function getAdminSystemHealth():
Promise<AdminSystemHealth> {
  const response =
    await api.get<AdminSystemHealth>(
      "/admin/system/health",
    );

  return response.data;
}


export async function getAdminEmailStats():
Promise<AdminEmailStats> {
  const response =
    await api.get<AdminEmailStats>(
      "/admin/email/stats",
    );

  return response.data;
}


export async function getAdminRecentEmails(
  limit = 10,
): Promise<AdminRecentEmail[]> {
  const response =
    await api.get<AdminRecentEmail[]>(
      "/admin/email/recent",
      {
        params: {
          limit,
        },
      },
    );

  return response.data;
}