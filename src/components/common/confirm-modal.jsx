function ConfirmModal({
  isOpen,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  type = "danger",
  loading = false,
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  const typeStyles = {
    danger: {
      icon: "delete",
      iconBox: "bg-red-50 text-red-600",
      button: "bg-red-600 text-white hover:bg-red-700",
    },
    warning: {
      icon: "warning",
      iconBox: "bg-yellow-50 text-yellow-600",
      button: "bg-yellow-500 text-white hover:bg-yellow-600",
    },
    info: {
      icon: "info",
      iconBox: "bg-blue-50 text-blue-600",
      button: "bg-[#082b4f] text-white hover:opacity-90",
    },
  };

  const selectedStyle = typeStyles[type] || typeStyles.danger;

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="Close confirmation modal"
        onClick={loading ? undefined : onCancel}
        className="absolute inset-0 bg-black/40"
      />

      <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-7">
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${selectedStyle.iconBox}`}
        >
          <span className="material-symbols-outlined text-3xl">
            {selectedStyle.icon}
          </span>
        </div>

        <h3 className="text-2xl font-black text-[#0b2a4a]">{title}</h3>

        <p className="text-sm text-slate-500 leading-7 mt-3">
          {description}
        </p>

        <div className="flex justify-end gap-3 mt-8">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-5 py-3 rounded-xl border border-slate-200 text-slate-500 font-bold hover:bg-slate-50 transition disabled:opacity-60"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`px-5 py-3 rounded-xl font-bold transition disabled:opacity-60 disabled:cursor-not-allowed ${selectedStyle.button}`}
          >
            {loading ? "Processing..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;