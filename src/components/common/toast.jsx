function Toast({ type = "success", message, onClose }) {
  if (!message) return null;

  const styles = {
    success: {
      icon: "check_circle",
      box: "bg-green-50 border-green-200 text-green-700",
      iconColor: "text-green-600",
    },
    error: {
      icon: "error",
      box: "bg-red-50 border-red-200 text-red-700",
      iconColor: "text-red-600",
    },
    warning: {
      icon: "warning",
      box: "bg-yellow-50 border-yellow-200 text-yellow-700",
      iconColor: "text-yellow-600",
    },
    info: {
      icon: "info",
      box: "bg-blue-50 border-blue-200 text-blue-700",
      iconColor: "text-blue-600",
    },
  };

  const selectedStyle = styles[type] || styles.success;

  return (
    <div className="fixed top-6 right-6 z-[9999] w-[calc(100%-3rem)] max-w-sm">
      <div
        className={`border rounded-2xl shadow-xl px-5 py-4 flex items-start gap-3 ${selectedStyle.box}`}
      >
        <span
          className={`material-symbols-outlined text-[22px] ${selectedStyle.iconColor}`}
        >
          {selectedStyle.icon}
        </span>

        <p className="text-sm font-semibold leading-6 flex-1">{message}</p>

        <button
          type="button"
          onClick={onClose}
          className="text-current opacity-60 hover:opacity-100 transition"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default Toast;