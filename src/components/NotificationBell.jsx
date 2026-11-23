import { useEffect, useRef, useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead
} from "../services/api";

function NotificationBell({ variant = "default" }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const response = await getNotifications();

      const list =
        response?.notifications ||
        response?.data ||
        (Array.isArray(response) ? response : []);

      setNotifications(Array.isArray(list) ? list : []);

      const unread =
        response?.unreadCount ??
        list.filter((notification) => !notification.read).length;

      setUnreadCount(unread);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleRead = async (notification) => {
    try {
      if (!notification.read) {
        await markNotificationRead(notification._id);
      }
      await fetchNotifications();
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleReadAll = async () => {
    try {
      await markAllNotificationsRead();
      await fetchNotifications();
    } catch (error) {
      console.error("Failed to mark notifications as read:", error);
    }
  };

  return (
    <div
      className={`notification-wrapper ${variant === "navbar" ? "variant-navbar" : "variant-sidebar"}`}
      ref={dropdownRef}
    >
      <button
        type="button"
        className={`notification-button ${unreadCount > 0 ? "has-unread" : ""}`}
        onClick={() => setOpen(!open)}
        aria-label="Notifications"
        title="Notifications"
      >
        <span className="notification-icon-wrap">
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="notification-badge">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </span>
        <span className="notification-label">Notifications</span>
      </button>

      {open && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <div className="notification-header-title">
              <strong>Notifications</strong>
              {unreadCount > 0 && (
                <span className="notification-count-tag">{unreadCount} new</span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                className="mark-all-read-btn"
                onClick={handleReadAll}
                title="Mark all notifications as read"
              >
                <CheckCheck size={13} />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="no-notifications">
                <Bell size={24} className="no-notif-icon" />
                <p>No new notifications</p>
                <small>You're all caught up with campus updates!</small>
              </div>
            ) : (
              notifications.map((notification) => (
                <button
                  type="button"
                  key={notification._id}
                  className={`notification-item ${notification.read ? "read" : "unread"}`}
                  onClick={() => handleRead(notification)}
                >
                  <span className={`notification-item-dot ${notification.read ? "is-read" : ""}`} />
                  <div className="notification-item-content">
                    <strong>{notification.title || "Campus Notification"}</strong>
                    <p>{notification.message || "You have a new update."}</p>
                    {notification.createdAt && (
                      <small>
                        {new Date(notification.createdAt).toLocaleDateString([], {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </small>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;