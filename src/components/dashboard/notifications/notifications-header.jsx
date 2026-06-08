function NotificationsHeader({
  unreadCount = 0,
  totalCount = 0,
  markingAll = false,
  onMarkAllAsRead,
  onRefresh,
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
      <div>
        <span className="uppercase tracking-[0.2em] text-[11px] text-primary/60 font-bold mb-3 block">
          Communications Center
        </span>

        <h2 className="text-4xl md:text-5xl font-black text-primary tracking-tight">
          Notifications
        </h2>

        <p className="text-slate-500 mt-3 text-base leading-7">
          You have{" "}
          <span className="font-black text-[#082b4f]">{unreadCount}</span>{" "}
          unread notifications out of{" "}
          <span className="font-black text-[#082b4f]">{totalCount}</span>.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onMarkAllAsRead}
          disabled={markingAll || unreadCount === 0}
          className="px-6 py-3 rounded-xl text-sm font-black text-primary bg-secondary-container hover:opacity-80 transition-all flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-[20px]">
            done_all
          </span>
          {markingAll ? "Updating..." : "Mark all as read"}
        </button>

        <button
          type="button"
          onClick={onRefresh}
          className="px-6 py-3 rounded-xl text-sm font-black text-white bg-gradient-to-br from-primary to-primary-container shadow-lg shadow-primary/10 hover:opacity-90 transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[20px]">
            refresh
          </span>
          Refresh
        </button>
      </div>
    </div>
  );
}

export default NotificationsHeader;