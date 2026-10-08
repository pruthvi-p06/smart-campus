import { useEffect, useState } from "react";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead
} from "../services/api";

function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

  const fetchNotifications = async () => {
    try {
      const response = await getNotifications();

      const list =
        response?.notifications ||
        response?.data ||
        (Array.isArray(response) ? response : []);

      setNotifications(
        Array.isArray(list) ? list : []
      );

      const unread =
        response?.unreadCount ??
        list.filter(
          (notification) => !notification.read
        ).length;

      setUnreadCount(unread);

    } catch (error) {
      console.error(
        "Failed to load notifications:",
        error
      );
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleRead = async (notification) => {
    try {
      if (!notification.read) {
        await markNotificationRead(
          notification._id
        );
      }

      await fetchNotifications();

    } catch (error) {
      console.error(
        "Failed to mark notification as read:",
        error
      );
    }
  };

  const handleReadAll = async () => {
    try {
      await markAllNotificationsRead();
      await fetchNotifications();

    } catch (error) {
      console.error(
        "Failed to mark notifications as read:",
        error
      );
    }
  };

  return (
    <div className="notification-wrapper">

      <button
        type="button"
        className="notification-button"
        onClick={() => setOpen(!open)}
        aria-label="Notifications"
      >
        🔔

        {unreadCount > 0 && (
          <span className="notification-badge">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="notification-dropdown">

          <div className="notification-header">

            <strong>
              Notifications
            </strong>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleReadAll}
              >
                Mark all read
              </button>
            )}

          </div>

          {notifications.length === 0 ? (

            <div className="no-notifications">
              No notifications
            </div>

          ) : (

            notifications.map((notification) => (

              <button
                type="button"
                key={notification._id}
                className={`notification-item ${
                  notification.read
                    ? ""
                    : "unread"
                }`}
                onClick={() =>
                  handleRead(notification)
                }
              >

                <strong>
                  {notification.title ||
                    "Notification"}
                </strong>

                <p>
                  {notification.message ||
                    "You have a new notification."}
                </p>

                {notification.createdAt && (
                  <small>
                    {new Date(
                      notification.createdAt
                    ).toLocaleString()}
                  </small>
                )}

              </button>

            ))

          )}

        </div>
      )}

    </div>
  );
}

export default NotificationBell;