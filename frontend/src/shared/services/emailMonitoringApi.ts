import { api } from "./api";


export interface EmailStats {
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


export interface RecentEmail {
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


export async function getEmailStats():
Promise<EmailStats> {
  const response =
    await api.get<EmailStats>(
      "/admin/email/stats",
    );

  return response.data;
}


export async function getRecentEmails(
  limit = 25,
): Promise<RecentEmail[]> {
  const response =
    await api.get<RecentEmail[]>(
      "/admin/email/recent",
      {
        params: {
          limit,
        },
      },
    );

  return response.data;
}