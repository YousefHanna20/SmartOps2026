function NotificationCard({
  notification,
  actionLoadingId,
  onMarkAsRead,
  onDelete,
}) {
  const notificationId = notification.notification_id || notification.id;
  const unread = !notification.is_read;
  const isLoading = actionLoadingId === notificationId;

  const meta = getNotificationMeta(notification.type);

  const formatTime = (dateValue) => {
    if (!dateValue) return "Just now";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return "Just now";

    const diffMs = Date.now() - date.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes} min ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString();
  };

  return (
    <div
      className={`group relative flex items-start gap-5 p-6 rounded-2xl transition-all duration-300 border ${
        unread
          ? "bg-surface-container-lowest hover:shadow-xl hover:shadow-blue-900/5 border-l-4 border-blue-600"
          : "bg-surface-container-low/40 border-slate-100"
      }`}
    >
      <div
        className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${meta.iconClass}`}
      >
        <span
          className="material-symbols-outlined"
          style={unread ? { fontVariationSettings: "'FILL' 1" } : undefined}
        >
          {meta.icon}
        </span>
      </div>

      <div className={`flex-1 ${!unread ? "opacity-75" : ""}`}>
        <div className="flex justify-between items-start mb-2 gap-4">
          <div>
            <h4 className="font-black text-primary text-lg leading-6">
              {meta.title}
            </h4>

            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
              {formatType(notification.type)}
            </p>
          </div>

          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 whitespace-nowrap">
            {formatTime(notification.created_at)}
          </span>
        </div>

        <p className="text-on-surface-variant text-base leading-7 mb-4">
          {notification.message || "No notification message available."}
        </p>

        <div className="flex flex-wrap gap-2">
          <span
            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight ${meta.tagClass}`}
          >
            {meta.tag}
          </span>

          {unread && (
            <span className="px-3 py-1 rounded-full bg-blue-100 text-[10px] font-black text-blue-700 uppercase tracking-tight">
              Unread
            </span>
          )}
        </div>
      </div>

      <div className="flex-shrink-0 flex gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
        {unread && (
          <button
            type="button"
            onClick={() => onMarkAsRead(notification)}
            disabled={isLoading}
            title="Mark as read"
            className="p-2 hover:bg-blue-50 rounded-full text-slate-400 hover:text-blue-600 disabled:opacity-60"
          >
            <span className="material-symbols-outlined">done</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => onDelete(notification)}
          disabled={isLoading}
          title="Delete notification"
          className="p-2 hover:bg-red-50 rounded-full text-slate-400 hover:text-red-600 disabled:opacity-60"
        >
          <span className="material-symbols-outlined">delete</span>
        </button>
      </div>
    </div>
  );
}

function getNotificationMeta(type) {
  const metaMap = {
    project_request_created: {
      title: "New Project Request",
      icon: "approval",
      tag: "Request",
      iconClass: "bg-blue-50 text-blue-600",
      tagClass: "bg-blue-100 text-blue-700",
    },
    project_request_approved: {
      title: "Project Request Approved",
      icon: "check_circle",
      tag: "Approved",
      iconClass: "bg-green-50 text-green-600",
      tagClass: "bg-green-100 text-green-700",
    },
    project_request_rejected: {
      title: "Project Request Rejected",
      icon: "cancel",
      tag: "Rejected",
      iconClass: "bg-red-50 text-red-600",
      tagClass: "bg-red-100 text-red-700",
    },
    task_assigned: {
      title: "New Task Assigned",
      icon: "assignment",
      tag: "Task",
      iconClass: "bg-purple-50 text-purple-600",
      tagClass: "bg-purple-100 text-purple-700",
    },
    task_status_updated: {
      title: "Task Status Updated",
      icon: "published_with_changes",
      tag: "Update",
      iconClass: "bg-yellow-50 text-yellow-700",
      tagClass: "bg-yellow-100 text-yellow-700",
    },
    project_completed: {
      title: "Project Completed",
      icon: "workspace_premium",
      tag: "Completed",
      iconClass: "bg-green-50 text-green-600",
      tagClass: "bg-green-100 text-green-700",
    },

    ai_risk_detected: {
      title: "AI Risk Detected",
      icon: "psychology",
      tag: "AI Alert",
      iconClass: "bg-red-50 text-red-700",
      tagClass: "bg-red-100 text-red-700",
    },
  };

  return (
    metaMap[type] || {
      title: "Notification",
      icon: "notifications",
      tag: "General",
      iconClass: "bg-slate-100 text-slate-500",
      tagClass: "bg-slate-100 text-slate-600",
    }
  );
}

function formatType(type) {
  return String(type || "general")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default NotificationCard;