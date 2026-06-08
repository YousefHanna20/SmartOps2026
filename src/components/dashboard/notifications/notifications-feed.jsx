import NotificationCard from "./notification-card";
import EmptyState from "../../common/empty-state";
import ErrorState from "../../common/error-state";
import LoadingState from "../../common/loading-state";

function NotificationsFeed({
  notifications = [],
  loading = false,
  error = "",
  actionLoadingId = null,
  onRetry,
  onMarkAsRead,
  onDelete,
}) {
  if (loading) {
    return (
      <div className="lg:col-span-8">
        <LoadingState type="table" rows={4} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="lg:col-span-8">
        <ErrorState
          title="Failed to load notifications"
          message={error}
          actionLabel="Try Again"
          onAction={onRetry}
        />
      </div>
    );
  }

  return (
    <div className="lg:col-span-8 flex flex-col gap-4">
      {notifications.length === 0 && (
        <EmptyState
          icon="notifications_off"
          title="No notifications yet"
          description="Your realtime updates, task alerts, and project request notifications will appear here."
        />
      )}

      {notifications.map((notification) => (
        <NotificationCard
          key={notification.notification_id || notification.id}
          notification={notification}
          actionLoadingId={actionLoadingId}
          onMarkAsRead={onMarkAsRead}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default NotificationsFeed;