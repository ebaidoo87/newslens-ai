import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  useAuth,
} from "../hooks/useAuth";

import {
  deleteAllNotifications as deleteAllNotificationsRequest,
  deleteNotification as deleteNotificationRequest,
  deleteReadNotifications as deleteReadNotificationsRequest,
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  type Notification,
} from "../services/notificationApi";

import {
  NotificationContext,
} from "./NotificationContext";


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
    useCallback(
      async (): Promise<void> => {
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
          // Preserve existing alerts during
          // temporary API failures.
        } finally {
          setIsLoading(false);
        }
      },
      [isAuthenticated],
    );


  async function markAsRead(
    notificationId: number,
  ): Promise<void> {
    const existing =
      notifications.find(
        (notification) =>
          notification.id
          === notificationId,
      );

    if (
      !existing
      || existing.is_read
    ) {
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
            notification.id
            !== notificationId,
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


  async function deleteReadNotifications():
  Promise<number> {
    const previousNotifications =
      notifications;

    setNotifications(
      (currentNotifications) =>
        currentNotifications.filter(
          (notification) =>
            !notification.is_read,
        ),
    );

    try {
      const response =
        await deleteReadNotificationsRequest();

      return response.deleted_count;
    } catch (error) {
      setNotifications(
        previousNotifications,
      );

      throw error;
    }
  }


  async function deleteAllNotifications():
  Promise<number> {
    const previousNotifications =
      notifications;

    setNotifications([]);

    try {
      const response =
        await deleteAllNotificationsRequest();

      return response.deleted_count;
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

    void refreshNotifications();
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
          void refreshNotifications();
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
        deleteReadNotifications,
        deleteAllNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}