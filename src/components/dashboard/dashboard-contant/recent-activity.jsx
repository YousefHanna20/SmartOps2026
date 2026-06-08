function RecentActivity({ activities = [], loading = false }) {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm shadow-blue-900/5 border border-slate-100">
      <div className="px-7 py-6 flex items-center justify-between border-b border-slate-100">
        <div>
          <h3 className="text-2xl font-black text-blue-900 tracking-tight">
            Recent Activity
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Latest updates from projects, tasks, requests, and notifications.
          </p>
        </div>

        <span className="material-symbols-outlined text-primary">
          timeline
        </span>
      </div>

      <div className="p-4">
        {loading && (
          <div className="space-y-3 p-3">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="h-20 bg-slate-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        )}

        {!loading && activities.length === 0 && (
          <div className="p-8 text-center">
            <span className="material-symbols-outlined text-5xl text-slate-300">
              history
            </span>
            <h4 className="font-black text-primary mt-3">No activity yet</h4>
            <p className="text-sm text-slate-500 mt-2">
              Activity will appear here once projects, requests, or tasks are updated.
            </p>
          </div>
        )}

        {!loading && activities.length > 0 && (
          <div className="divide-y divide-slate-100">
            {activities.map((activity) => (
              <ActivityRow key={activity.id} activity={activity} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ActivityRow({ activity }) {
  const meta = getStatusMeta(activity.status);

  return (
    <div className="flex items-start gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-colors">
      <div className="w-12 h-12 rounded-2xl bg-primary/5 text-primary flex items-center justify-center shrink-0">
        <span className="material-symbols-outlined">{activity.icon}</span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            {activity.type}
          </span>

          <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase ${meta.className}`}>
            {meta.label}
          </span>
        </div>

        <h4 className="font-black text-primary truncate">{activity.title}</h4>
        <p className="text-sm text-slate-500 line-clamp-2">
          {activity.description}
        </p>
      </div>

      <span className="text-[10px] font-bold uppercase text-slate-400 whitespace-nowrap">
        {formatTime(activity.created_at)}
      </span>
    </div>
  );
}

function getStatusMeta(status) {
  const normalized = String(status || "general");

  const map = {
    completed: {
      label: "Completed",
      className: "bg-emerald-100 text-emerald-700",
    },
    in_progress: {
      label: "In Progress",
      className: "bg-blue-100 text-blue-700",
    },
    pending: {
      label: "Pending",
      className: "bg-amber-100 text-amber-700",
    },
    rejected: {
      label: "Rejected",
      className: "bg-red-100 text-red-700",
    },
    approved: {
      label: "Approved",
      className: "bg-emerald-100 text-emerald-700",
    },
    unread: {
      label: "Unread",
      className: "bg-purple-100 text-purple-700",
    },
    read: {
      label: "Read",
      className: "bg-slate-100 text-slate-600",
    },
  };

  return (
    map[normalized] || {
      label: normalized.replaceAll("_", " "),
      className: "bg-slate-100 text-slate-600",
    }
  );
}

function formatTime(dateValue) {
  if (!dateValue) return "Now";

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "Now";

  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return "Now";
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;

  return date.toLocaleDateString();
}

export default RecentActivity;