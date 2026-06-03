function EmptyState({
  icon = "inbox",
  title = "No data found",
  description = "There is nothing to show here yet.",
  actionLabel,
  onAction,
}) {
  return (
    <div className="px-6 py-12 text-center flex flex-col items-center justify-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
        <span className="material-symbols-outlined text-[#082b4f] text-3xl">
          {icon}
        </span>
      </div>

      <h3 className="text-lg font-black text-[#0b2a4a]">
        {title}
      </h3>

      <p className="text-sm text-slate-400 mt-2 max-w-sm">
        {description}
      </p>

      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 px-5 py-3 rounded-xl bg-[#082b4f] text-white text-sm font-bold hover:opacity-90 transition"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default EmptyState;