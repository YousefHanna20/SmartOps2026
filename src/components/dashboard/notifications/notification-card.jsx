function NotificationCard({ title, time, message, icon, unread, color, tags }) {
  const iconClass =
    color === "blue"
      ? "bg-blue-50 text-blue-600"
      : color === "green"
      ? "bg-tertiary-fixed-dim/20 text-on-tertiary-container"
      : "bg-slate-100 text-slate-400";

  return (
    <div
      className={`group relative flex items-start gap-5 p-6 rounded-xl transition-all duration-300 ${
        unread
          ? "bg-surface-container-lowest hover:shadow-xl hover:shadow-blue-900/5 border-l-4 border-blue-600"
          : "bg-surface-container-low/40"
      }`}
    >
      <div
        className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${iconClass}`}
      >
        <span
          className="material-symbols-outlined"
          style={unread ? { fontVariationSettings: "'FILL' 1" } : undefined}
        >
          {icon}
        </span>
      </div>

      <div className={`flex-1 ${!unread ? "opacity-70" : ""}`}>
        <div className="flex justify-between items-start mb-1 gap-4">
          <h4 className="font-bold text-primary">{title}</h4>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 whitespace-nowrap">
            {time}
          </span>
        </div>

        <p className="text-on-surface-variant text-sm leading-relaxed mb-4">
          {message}
        </p>

        {tags.length > 0 && (
          <div className="flex gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full bg-blue-100 text-[10px] font-bold text-blue-700 uppercase tracking-tight"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-2 hover:bg-slate-50 rounded-full text-slate-400">
          <span className="material-symbols-outlined">more_vert</span>
        </button>
      </div>
    </div>
  );
}

export default NotificationCard;