function ErrorState({
  icon = "error",
  title = "Something went wrong",
  message = "We could not load this data right now.",
  actionLabel = "Try Again",
  onAction,
}) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-red-100">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-5 text-center md:text-left">
        <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-red-600 text-3xl">
            {icon}
          </span>
        </div>

        <div className="flex-1">
          <h3 className="text-xl font-black text-[#0b2a4a]">{title}</h3>

          <p className="text-sm text-slate-500 leading-7 mt-2">{message}</p>

          {onAction && (
            <button
              type="button"
              onClick={onAction}
              className="mt-5 px-5 py-3 rounded-xl bg-[#082b4f] text-white text-sm font-bold hover:opacity-90 transition"
            >
              {actionLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ErrorState;