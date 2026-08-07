import {
  Bell,
  Check,
  ExternalLink,
  Trash2,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import {
  getRelativeTime,
} from "../../../shared/utils/articleMeta";

import type {
  Notification,
} from "../../../shared/services/notificationApi";


interface NotificationItemProps {
  notification: Notification;

  onMarkRead: (
    notificationId: number,
  ) => Promise<void>;

  onDelete: (
    notificationId: number,
  ) => Promise<void>;

  isUpdating: boolean;
}


export default function NotificationItem({
  notification,
  onMarkRead,
  onDelete,
  isUpdating,
}: NotificationItemProps) {
  return (
    <article
      className={`
        rounded-2xl
        border
        p-5
        transition
        ${
          notification.is_read
            ? "border-gray-800 bg-gray-900"
            : "border-blue-800 bg-blue-950/25"
        }
      `}
    >
      <div className="flex gap-4">
        <div
          className={`
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            rounded-full
            ${
              notification.is_read
                ? "bg-gray-800 text-gray-400"
                : "bg-blue-900 text-blue-300"
            }
          `}
        >
          <Bell size={20} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-white">
                  {notification.title}
                </h2>

                {!notification.is_read && (
                  <span className="h-2 w-2 rounded-full bg-blue-500" />
                )}
              </div>

              <p className="mt-2 leading-relaxed text-gray-400">
                {notification.message}
              </p>

              <p className="mt-3 text-xs text-gray-600">
                {getRelativeTime(
                  notification.created_at,
                )}
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              to={
                `/articles/${notification.article.id}`
              }
              onClick={() => {
                if (
                  !notification.is_read
                ) {
                  void onMarkRead(
                    notification.id,
                  );
                }
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              View article

              <ExternalLink size={16} />
            </Link>

            {!notification.is_read && (
              <button
                type="button"
                onClick={() =>
                  onMarkRead(
                    notification.id,
                  )
                }
                disabled={isUpdating}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-700 px-4 py-2 text-sm font-medium text-gray-300 transition hover:border-green-700 hover:text-green-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Check size={16} />

                Mark read
              </button>
            )}

            <button
              type="button"
              onClick={() =>
                onDelete(
                  notification.id,
                )
              }
              disabled={isUpdating}
              className="inline-flex items-center gap-2 rounded-lg border border-red-900 px-4 py-2 text-sm font-medium text-red-300 transition hover:bg-red-950 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Trash2 size={16} />

              Delete
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}