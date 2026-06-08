import AppShell from "../components/layout/app-shell";
import NotificationsHeader from "../components/dashboard/notifications/notifications-header";
import NotificationsFeed from "../components/dashboard/notifications/notifications-feed";
import NotificationsOverview from "../components/dashboard/notifications/notifications-overview";

import { useNotifications } from "../context/notifications-context";
import Toast from "../components/common/toast";
import useToast from "../hooks/use-toast";

function Notifications() {
  const {
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
  } = useNotifications();

  const { toast, showToast, hideToast } = useToast();

  const handleMarkAsRead = async (notification) => {
    try {
      await markAsRead(notification);
      showToast("success", "Notification marked as read.");
    } catch (error) {
      showToast(
        "error",
        error.response?.data?.message || "Failed to mark notification as read."
      );
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      if (unreadCount === 0) {
        showToast("info", "All notifications are already read.");
        return;
      }

      await markAllAsRead();
      showToast("success", "All notifications marked as read.");
    } catch (error) {
      showToast(
        "error",
        error.response?.data?.message || "Failed to mark all as read."
      );
    }
  };

  const handleDeleteNotification = async (notification) => {
    try {
      await removeNotification(notification);
      showToast("success", "Notification deleted successfully.");
    } catch (error) {
      showToast(
        "error",
        error.response?.data?.message || "Failed to delete notification."
      );
    }
  };

  return (
    <AppShell activePage="Notifications">
      <Toast type={toast.type} message={toast.message} onClose={hideToast} />

      <section className="max-w-6xl mx-auto w-full">
        <NotificationsHeader
          unreadCount={unreadCount}
          totalCount={notifications.length}
          markingAll={markingAll}
          onMarkAllAsRead={handleMarkAllAsRead}
          onRefresh={loadNotifications}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <NotificationsFeed
            notifications={notifications}
            loading={loadingNotifications}
            error={notificationsError}
            actionLoadingId={actionLoadingId}
            onRetry={loadNotifications}
            onMarkAsRead={handleMarkAsRead}
            onDelete={handleDeleteNotification}
          />

          <div className="lg:col-span-4">
            <NotificationsOverview
              totalCount={notifications.length}
              unreadCount={unreadCount}
              criticalCount={criticalCount}
            />
          </div>
        </div>
      </section>
    </AppShell>
  );
}

export default Notifications;