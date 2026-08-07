import { api } from "./api";

import type {
  Article,
} from "../../features/news/types/article";


export interface Notification {
  id: number;
  notification_type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  article: Article;
}


export interface NotificationCountResponse {
  unread_count: number;
}


export interface NotificationActionResponse {
  success: boolean;
  message: string;
}


export async function getNotifications():
Promise<Notification[]> {
  const response =
    await api.get<Notification[]>(
      "/notifications",
    );

  return response.data;
}


export async function getUnreadCount():
Promise<number> {
  const response =
    await api.get<NotificationCountResponse>(
      "/notifications/count",
    );

  return response.data.unread_count;
}


export async function markNotificationRead(
  notificationId: number,
): Promise<Notification> {
  const response =
    await api.patch<Notification>(
      `/notifications/${notificationId}/read`,
    );

  return response.data;
}


export async function markAllNotificationsRead():
Promise<NotificationActionResponse> {
  const response =
    await api.patch<NotificationActionResponse>(
      "/notifications/read-all",
    );

  return response.data;
}


export async function deleteNotification(
  notificationId: number,
): Promise<NotificationActionResponse> {
  const response =
    await api.delete<NotificationActionResponse>(
      `/notifications/${notificationId}`,
    );

  return response.data;
}