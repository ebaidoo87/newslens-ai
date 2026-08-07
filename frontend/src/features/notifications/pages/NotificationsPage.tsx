import {
  useMemo,
  useState,
} from "react";

import {
  Bell,
  CheckCheck,
  RefreshCw,
} from "lucide-react";

import NotificationItem from "../components/NotificationItem";

import {
  useNotifications,
} from "../../../shared/context/NotificationContext";

import {
  useToast,
} from "../../../shared/context/ToastContext";


type NotificationFilter =
  | "all"
  | "unread"
  | "read";


const FILTERS: {
  label: string;
  value: NotificationFilter;
}[] = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Unread",
    value: "unread",
  },
  {
    label: "Read",
    value: "read",
  },
];


export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    isLoading,
    refreshNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();

  const {
    showToast,
  } = useToast();

  const [
    filter,
    setFilter,
  ] = useState<NotificationFilter>(
    "all",
  );

  const [
    updatingIds,
    setUpdatingIds,
  ] = useState<Set<number>>(
    new Set(),
  );

  const [
    isMarkingAll,
    setIsMarkingAll,
  ] = useState(false);

  const [
    isRefreshing,
    setIsRefreshing,
  ] = useState(false);


  const filteredNotifications =
    useMemo(() => {
      if (filter === "unread") {
        return notifications.filter(
          (notification) =>
            !notification.is_read,
        );
      }

      if (filter === "read") {
        return notifications.filter(
          (notification) =>
            notification.is_read,
        );
      }

      return notifications;
    }, [
      notifications,
      filter,
    ]);


  function setNotificationUpdating(
    notificationId: number,
    updating: boolean,
  ) {
    setUpdatingIds(
      (currentIds) => {
        const nextIds =
          new Set(currentIds);

        if (updating) {
          nextIds.add(
            notificationId,
          );
        } else {
          nextIds.delete(
            notificationId,
          );
        }

        return nextIds;
      },
    );
  }


  async function handleMarkRead(
    notificationId: number,
  ): Promise<void> {
    setNotificationUpdating(
      notificationId,
      true,
    );

    try {
      await markAsRead(
        notificationId,
      );

      showToast(
        "Notification marked as read.",
        "success",
      );
    } catch {
      showToast(
        "Unable to update notification.",
        "error",
      );
    } finally {
      setNotificationUpdating(
        notificationId,
        false,
      );
    }
  }


  async function handleDelete(
    notificationId: number,
  ): Promise<void> {
    setNotificationUpdating(
      notificationId,
      true,
    );

    try {
      await deleteNotification(
        notificationId,
      );

      showToast(
        "Notification deleted.",
        "success",
      );
    } catch {
      showToast(
        "Unable to delete notification.",
        "error",
      );

      setNotificationUpdating(
        notificationId,
        false,
      );
    }
  }


  async function handleMarkAllRead() {
    if (unreadCount === 0) {
      return;
    }

    setIsMarkingAll(true);

    try {
      await markAllAsRead();

      showToast(
        "All notifications marked as read.",
        "success",
      );
    } catch {
      showToast(
        "Unable to update notifications.",
        "error",
      );
    } finally {
      setIsMarkingAll(false);
    }
  }


  async function handleRefresh() {
    setIsRefreshing(true);

    try {
      await refreshNotifications();

      showToast(
        "Notifications refreshed.",
        "success",
      );
    } catch {
      showToast(
        "Unable to refresh notifications.",
        "error",
      );
    } finally {
      setIsRefreshing(false);
    }
  }


  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <Bell className="text-blue-400" />

            <h1 className="text-4xl font-bold">
              Notifications
            </h1>
          </div>

          <p className="mt-2 text-gray-400">
            {unreadCount === 1
              ? "You have 1 unread notification."
              : `You have ${unreadCount} unread notifications.`}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-700 px-4 py-2 text-sm font-medium text-gray-300 transition hover:border-gray-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={17}
              className={
                isRefreshing
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh
          </button>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={
                handleMarkAllRead
              }
              disabled={isMarkingAll}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <CheckCheck size={17} />

              {isMarkingAll
                ? "Updating..."
                : "Mark all read"}
            </button>
          )}
        </div>
      </div>


      <div className="flex flex-wrap gap-3">
        {FILTERS.map(
          (filterOption) => {
            const active =
              filterOption.value
              === filter;

            let count =
              notifications.length;

            if (
              filterOption.value
              === "unread"
            ) {
              count = unreadCount;
            }

            if (
              filterOption.value
              === "read"
            ) {
              count =
                notifications.length
                - unreadCount;
            }

            return (
              <button
                key={
                  filterOption.value
                }
                type="button"
                onClick={() =>
                  setFilter(
                    filterOption.value,
                  )
                }
                className={`
                  rounded-full
                  border
                  px-4
                  py-2
                  text-sm
                  font-medium
                  transition
                  ${
                    active
                      ? "border-blue-500 bg-blue-600 text-white"
                      : "border-gray-700 bg-gray-900 text-gray-300 hover:border-gray-500"
                  }
                `}
              >
                {filterOption.label}{" "}
                ({count})
              </button>
            );
          },
        )}
      </div>


      {isLoading
      && notifications.length === 0 ? (
        <div className="space-y-4">
          {Array.from({
            length: 5,
          }).map((_, index) => (
            <div
              key={index}
              className="h-40 animate-pulse rounded-2xl border border-gray-800 bg-gray-900"
            />
          ))}
        </div>
      ) : filteredNotifications.length
          === 0 ? (
        <div className="rounded-2xl border border-gray-800 bg-gray-900 px-6 py-16 text-center">
          <Bell
            size={48}
            className="mx-auto text-gray-600"
          />

          <h2 className="mt-5 text-2xl font-semibold">
            {filter === "all"
              ? "No notifications yet"
              : filter === "unread"
                ? "No unread notifications"
                : "No read notifications"}
          </h2>

          <p className="mx-auto mt-3 max-w-md text-gray-400">
            {filter === "all"
              ? "New articles matching your saved preferences will appear here."
              : "Choose another filter to see more notifications."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map(
            (notification) => (
              <NotificationItem
                key={
                  notification.id
                }
                notification={
                  notification
                }
                isUpdating={
                  updatingIds.has(
                    notification.id,
                  )
                }
                onMarkRead={
                  handleMarkRead
                }
                onDelete={
                  handleDelete
                }
              />
            ),
          )}
        </div>
      )}
    </div>
  );
}