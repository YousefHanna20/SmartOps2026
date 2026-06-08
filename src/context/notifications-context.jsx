import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { useAuth } from "./auth-context";
import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  deleteNotification,
} from "../services/notification-service";
import { connectSocket, disconnectSocket } from "../services/socket-service";

const NotificationsContext = createContext(null);

export function NotificationsProvider({ children }) {
  const { user } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [notificationsError, setNotificationsError] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [markingAll, setMarkingAll] = useState(false);

  const getToken = () => {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("authToken")
    );
  };

  const getNotificationId = (notification) => {
    return notification.notification_id || notification.id;
  };

  const loadNotifications = async () => {
    if (!user) return;

    setLoadingNotifications(true);
    setNotificationsError("");

    try {
      const data = await getNotifications();
      setNotifications(data.notifications || data.data || []);
    } catch (error) {
      setNotificationsError(
        error.response?.data?.message || "Failed to load notifications."
      );
    } finally {
      setLoadingNotifications(false);
    }
  };

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      disconnectSocket();
      return;
    }

    loadNotifications();

    const token = getToken();

    if (!token) return;

    const socket = connectSocket(token);

    if (!socket) return;

    const handleNewNotification = (notification) => {
      setNotifications((prevNotifications) => {
        const notificationId = getNotificationId(notification);

        const alreadyExists = prevNotifications.some(
          (item) => getNotificationId(item) === notificationId
        );

        if (alreadyExists) return prevNotifications;

        return [notification, ...prevNotifications];
      });
    };

    socket.on("new_notification", handleNewNotification);

    return () => {
      socket.off("new_notification", handleNewNotification);
    };
  }, [user?.user_id]);

  const unreadCount = useMemo(() => {
    return notifications.filter((notification) => !notification.is_read).length;
  }, [notifications]);

  const criticalCount = useMemo(() => {
    return notifications.filter((notification) =>
      [
        "project_request_rejected",
        "project_completed",
        "task_status_updated",
      ].includes(notification.type)
    ).length;
  }, [notifications]);

  const markAsRead = async (notification) => {
    const notificationId = getNotificationId(notification);

    if (!notificationId || notification.is_read) return;

    setActionLoadingId(notificationId);

    try {
      await markNotificationAsRead(notificationId);

      setNotifications((prevNotifications) =>
        prevNotifications.map((item) =>
          getNotificationId(item) === notificationId
            ? { ...item, is_read: true }
            : item
        )
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  const markAllAsRead = async () => {
    if (unreadCount === 0) return;

    setMarkingAll(true);

    try {
      await markAllNotificationsAsRead();

      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => ({
          ...notification,
          is_read: true,
        }))
      );
    } finally {
      setMarkingAll(false);
    }
  };

  const removeNotification = async (notification) => {
    const notificationId = getNotificationId(notification);

    if (!notificationId) return;

    setActionLoadingId(notificationId);

    try {
      await deleteNotification(notificationId);

      setNotifications((prevNotifications) =>
        prevNotifications.filter(
          (item) => getNotificationId(item) !== notificationId
        )
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  const value = {
    notifications,
    loadingNotifications,
    notificationsError,
    unreadCount,
    criticalCount,
    actionLoadingId,
    markingAll,
    loadNotifications,
    markAsRead,
    markAllAsRead,
    removeNotification,
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);

  if (!context) {
    throw new Error(
      "useNotifications must be used inside NotificationsProvider"
    );
  }

  return context;
}