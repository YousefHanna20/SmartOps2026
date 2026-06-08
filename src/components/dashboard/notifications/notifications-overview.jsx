function NotificationsOverview({
  totalCount = 0,
  unreadCount = 0,
  criticalCount = 0,
}) {
  const unreadWidth =
    totalCount > 0 ? Math.min((unreadCount / totalCount) * 100, 100) : 0;

  const criticalWidth =
    totalCount > 0 ? Math.min((criticalCount / totalCount) * 100, 100) : 0;

  return (
    <div className="p-8 bg-primary rounded-xl text-white relative overflow-hidden">
      <div className="relative z-10">
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] opacity-60 block mb-2">
          Overview
        </span>

        <div className="flex items-baseline gap-2 mb-6">
          <span className="text-5xl font-black">{unreadCount}</span>

          <span className="text-sm font-medium opacity-80">
            Unread notifications
          </span>
        </div>

        <div className="space-y-4">
          <Progress
            label="Unread Messages"
            value={String(unreadCount).padStart(2, "0")}
            width={`${unreadWidth}%`}
          />

          <Progress
            label="Critical Alerts"
            value={String(criticalCount).padStart(2, "0")}
            width={`${criticalWidth}%`}
            color="bg-error"
          />
        </div>
      </div>

      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-400/10 rounded-full blur-3xl" />
    </div>
  );
}

function Progress({ label, value, width, color = "bg-tertiary-fixed-dim" }) {
  return (
    <>
      <div className="flex justify-between items-center text-xs">
        <span className="opacity-70">{label}</span>
        <span className="font-bold">{value}</span>
      </div>

      <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
        <div className={`${color} h-full`} style={{ width }} />
      </div>
    </>
  );
}

export default NotificationsOverview;