import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  useAuth,
} from "./AuthContext";

import {
  deleteNotification as deleteNotificationRequest,
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  type Notification,
} from "../services/notificationApi";

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;

  refreshNotifications:
    () => Promise<void>;

  markAsRead:
    (
      notificationId: number,
    ) => Promise<void>;

  markAllAsRead:
    () => Promise<void>;

  deleteNotification: (
    notificationId: number,
    ) => Promise<void>;

}


const NotificationContext =
  createContext<
    NotificationContextType
    | undefined
  >(undefined);


export function NotificationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const {
    isAuthenticated,
    isLoading: isAuthLoading,
  } = useAuth();

  const [
    notifications,
    setNotifications,
  ] = useState<Notification[]>([]);

  const [
    isLoading,
    setIsLoading,
  ] = useState(false);


  const unreadCount = useMemo(
    () =>
      notifications.filter(
        (notification) =>
          !notification.is_read,
      ).length,
    [notifications],
  );


  const refreshNotifications =
    useCallback(async (): Promise<void> => {
      if (!isAuthenticated) {
        setNotifications([]);
        return;
      }

      setIsLoading(true);

      try {
        const data =
          await getNotifications();

        setNotifications(data);
      } catch {
        // Do not remove existing alerts
        // because of a temporary API failure.
      } finally {
        setIsLoading(false);
      }
    }, [isAuthenticated]);


  async function markAsRead(
    notificationId: number,
  ): Promise<void> {
    const existing =
      notifications.find(
        (notification) =>
          notification.id
          === notificationId,
      );

    if (!existing || existing.is_read) {
      return;
    }

    setNotifications(
      (currentNotifications) =>
        currentNotifications.map(
          (notification) =>
            notification.id
            === notificationId
              ? {
                  ...notification,
                  is_read: true,
                }
              : notification,
        ),
    );

    try {
      await markNotificationRead(
        notificationId,
      );
    } catch (error) {
      setNotifications(
        (currentNotifications) =>
          currentNotifications.map(
            (notification) =>
              notification.id
              === notificationId
                ? {
                    ...notification,
                    is_read: false,
                  }
                : notification,
          ),
      );

      throw error;
    }
  }


  async function markAllAsRead():
  Promise<void> {
    const previousNotifications =
      notifications;

    setNotifications(
      (currentNotifications) =>
        currentNotifications.map(
          (notification) => ({
            ...notification,
            is_read: true,
          }),
        ),
    );

    try {
      await markAllNotificationsRead();
    } catch (error) {
      setNotifications(
        previousNotifications,
      );

      throw error;
    }
  }

  async function deleteNotification(
  notificationId: number,
    ): Promise<void> {
    const previousNotifications =
        notifications;

    setNotifications(
        (currentNotifications) =>
            currentNotifications.filter(
                (notification) =>
                    notification.id !== notificationId,
        ),
    );

    try {
        await deleteNotificationRequest(
            notificationId,
    );
  } catch (error) {
    setNotifications(
      previousNotifications,
    );

    throw error;
  }
}


  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    if (!isAuthenticated) {
      setNotifications([]);
      return;
    }

    refreshNotifications();
  }, [
    isAuthenticated,
    isAuthLoading,
    refreshNotifications,
  ]);


  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const intervalId =
      window.setInterval(
        () => {
          refreshNotifications();
        },
        60_000,
      );

    return () => {
      window.clearInterval(
        intervalId,
      );
    };
  }, [
    isAuthenticated,
    refreshNotifications,
  ]);


  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isLoading,
        refreshNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}


export function useNotifications():
NotificationContextType {
  const context =
    useContext(
      NotificationContext,
    );

  if (!context) {
    throw new Error(
      "useNotifications must be used within NotificationProvider",
    );
  }

  return context;
}