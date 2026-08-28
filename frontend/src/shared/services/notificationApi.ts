import {
  apiClient,
} from "../api/client";

import {
  endpoints,
} from "../api/endpoints";

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


export interface NotificationDeleteResponse {
  success: boolean;
  deleted_count: number;
  message: string;
}


export async function getNotifications():
Promise<Notification[]> {
  const response =
    await apiClient.get<
      Notification[]
    >(
      endpoints.notifications.list,
    );

  return response.data;
}


export async function getUnreadCount():
Promise<number> {
  const response =
    await apiClient.get<
      NotificationCountResponse
    >(
      endpoints.notifications.count,
    );

  return response.data.unread_count;
}


export async function markNotificationRead(
  notificationId: number,
): Promise<Notification> {
  const response =
    await apiClient.patch<
      Notification
    >(
      endpoints.notifications.markRead(
        notificationId,
      ),
    );

  return response.data;
}


export async function markAllNotificationsRead():
Promise<NotificationActionResponse> {
  const response =
    await apiClient.patch<
      NotificationActionResponse
    >(
      endpoints.notifications.readAll,
    );

  return response.data;
}


export async function deleteNotification(
  notificationId: number,
): Promise<NotificationActionResponse> {
  const response =
    await apiClient.delete<
      NotificationActionResponse
    >(
      endpoints.notifications.deleteOne(
        notificationId,
      ),
    );

  return response.data;
}


export async function deleteReadNotifications():
Promise<NotificationDeleteResponse> {
  const response =
    await apiClient.delete<
      NotificationDeleteResponse
    >(
      endpoints.notifications.deleteRead,
    );

  return response.data;
}


export async function deleteAllNotifications():
Promise<NotificationDeleteResponse> {
  const response =
    await apiClient.delete<
      NotificationDeleteResponse
    >(
      endpoints.notifications.list,
    );

  return response.data;
}