import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Bell,
  CheckCheck,
  LoaderCircle,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useNotifications,
} from "../../../shared/hooks/useNotifications";

import {
  useToast,
} from "../../../shared/hooks/useToast";

import {
  getRelativeTime,
} from "../../../shared/utils/articleMeta";


export default function NotificationBell() {
  const [
    isOpen,
    setIsOpen,
  ] = useState(false);

  const dropdownRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  const triggerRef =
    useRef<HTMLButtonElement | null>(
      null,
    );

  const navigate = useNavigate();

  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  const {
    showToast,
  } = useToast();


  useEffect(() => {
    function handleOutsideClick(
      event: MouseEvent,
    ) {
      if (
        dropdownRef.current
        && !dropdownRef.current.contains(
          event.target as Node,
        )
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (
        event.key === "Escape"
        && isOpen
      ) {
        setIsOpen(false);

        triggerRef.current?.focus();
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutsideClick,
    );

    document.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );

      document.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [isOpen]);


  async function handleNotificationClick(
    notificationId: number,
    articleId: number,
  ) {
    try {
      await markAsRead(
        notificationId,
      );
    } catch {
      showToast(
        "Unable to mark notification as read.",
        "error",
      );
    }

    setIsOpen(false);

    navigate(
      `/articles/${articleId}`,
    );
  }


  async function handleMarkAllRead() {
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
    }
  }


  const previewNotifications =
    notifications.slice(0, 6);


  return (
    <div
      ref={dropdownRef}
      className="relative"
    >
      <button
        ref={triggerRef}
        type="button"
        onClick={() =>
          setIsOpen(
            (current) => !current,
          )
        }
        aria-label={
          unreadCount > 0
            ? `Notifications, ${unreadCount} unread`
            : "Notifications"
        }
        aria-expanded={isOpen}
        aria-controls="notification-dropdown"
        aria-haspopup="true"
        className="
          relative
          rounded-lg
          p-2
          text-gray-300
          transition
          hover:bg-gray-800
          hover:text-white
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-blue-500
          focus-visible:ring-offset-2
          focus-visible:ring-offset-gray-900
        "
      >
        <Bell
          size={21}
          aria-hidden="true"
        />

        {unreadCount > 0 && (
          <span
            className="
              absolute
              -right-1
              -top-1
              flex
              min-h-5
              min-w-5
              items-center
              justify-center
              rounded-full
              bg-red-600
              px-1
              text-xs
              font-bold
              text-white
            "
            aria-hidden="true"
          >
            {unreadCount > 99
              ? "99+"
              : unreadCount}
          </span>
        )}
      </button>


      {isOpen && (
        <div
          id="notification-dropdown"
          aria-label="Notifications"
          className="
            absolute
            right-0
            top-full
            z-50
            mt-3
            w-[min(24rem,calc(100vw-2rem))]
            overflow-hidden
            rounded-2xl
            border
            border-gray-800
            bg-gray-900
            shadow-2xl
          "
        >
          <div className="flex items-center justify-between border-b border-gray-800 px-4 py-4">
            <div>
              <h2 className="font-semibold">
                Notifications
              </h2>

              <p
                className="mt-1 text-xs text-gray-500"
                aria-live="polite"
              >
                {unreadCount === 1
                  ? "1 unread notification"
                  : `${unreadCount} unread notifications`}
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={
                  handleMarkAllRead
                }
                className="
                  inline-flex
                  items-center
                  gap-1
                  rounded
                  text-xs
                  font-medium
                  text-blue-400
                  transition
                  hover:text-blue-300
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-blue-500
                "
              >
                <CheckCheck
                  size={15}
                  aria-hidden="true"
                />

                Mark all read
              </button>
            )}
          </div>


          <div className="max-h-96 overflow-y-auto">
            {isLoading
              && notifications.length
                === 0 ? (
              <div
                className="flex items-center justify-center gap-3 px-4 py-10 text-sm text-gray-400"
                role="status"
                aria-live="polite"
              >
                <LoaderCircle
                  size={18}
                  className="animate-spin"
                  aria-hidden="true"
                />

                Loading notifications...
              </div>
            ) : previewNotifications.length
                === 0 ? (
              <div className="px-6 py-12 text-center">
                <Bell
                  size={36}
                  className="mx-auto text-gray-600"
                  aria-hidden="true"
                />

                <p className="mt-4 font-medium">
                  No notifications yet
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  Matching news alerts
                  will appear here.
                </p>
              </div>
            ) : (
              previewNotifications.map(
                (notification) => (
                  <button
                    key={
                      notification.id
                    }
                    type="button"
                    onClick={() =>
                      handleNotificationClick(
                        notification.id,
                        notification.article.id,
                      )
                    }
                    className={`
                      block
                      w-full
                      border-b
                      border-gray-800
                      px-4
                      py-4
                      text-left
                      transition
                      last:border-b-0
                      hover:bg-gray-800
                      focus-visible:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-inset
                      focus-visible:ring-blue-500
                      ${
                        notification.is_read
                          ? "bg-gray-900"
                          : "bg-blue-950/30"
                      }
                    `}
                  >
                    <div className="flex gap-3">
                      <span
                        aria-hidden="true"
                        className={`
                          mt-2
                          h-2
                          w-2
                          shrink-0
                          rounded-full
                          ${
                            notification.is_read
                              ? "bg-transparent"
                              : "bg-blue-500"
                          }
                        `}
                      />

                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-100">
                          {
                            notification.title
                          }
                        </p>

                        <p className="mt-1 line-clamp-2 text-sm text-gray-400">
                          {
                            notification.message
                          }
                        </p>

                        <p className="mt-2 text-xs text-gray-600">
                          {getRelativeTime(
                            notification.created_at,
                          )}
                        </p>
                      </div>
                    </div>
                  </button>
                ),
              )
            )}
          </div>


          <div className="border-t border-gray-800 p-3">
            <Link
              to="/notifications"
              onClick={() =>
                setIsOpen(false)
              }
              className="
                block
                rounded-lg
                px-4
                py-2
                text-center
                text-sm
                font-semibold
                text-blue-400
                transition
                hover:bg-gray-800
                hover:text-blue-300
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-blue-500
              "
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}