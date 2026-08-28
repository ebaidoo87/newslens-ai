import {
  createContext,
} from "react";

import type {
  Notification,
} from "../services/notificationApi";


export interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;

  refreshNotifications:
    () => Promise<void>;

  markAsRead: (
    notificationId: number,
  ) => Promise<void>;

  markAllAsRead:
    () => Promise<void>;

  deleteNotification: (
    notificationId: number,
  ) => Promise<void>;

  deleteReadNotifications:
    () => Promise<number>;

  deleteAllNotifications:
    () => Promise<number>;
}


export const NotificationContext =
  createContext<
    NotificationContextType
    | undefined
  >(undefined);