function PinnedThreads() {
  return (
    <div className="bg-surface-container-low rounded-xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <span className="material-symbols-outlined text-primary text-xl">
          push_pin
        </span>
        <h3 className="font-bold text-primary uppercase tracking-wider text-xs">
          Pinned Threads
        </h3>
      </div>

      <div className="space-y-6">
        <Thread initials="SG" title="SkyGarden Phase II Structural" subtitle="4 new updates" />
        <Thread initials="PA" title="Project Aurora Site Audit" subtitle="Last activity 2h ago" green />
      </div>
    </div>
  );
}

function Thread({ initials, title, subtitle, green = false }) {
  return (
    <div className="flex gap-4 items-center">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${
          green
            ? "bg-tertiary-fixed-dim/20 text-on-tertiary-container"
            : "bg-blue-100 text-blue-600"
        }`}
      >
        {initials}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-primary truncate">{title}</p>
        <p className="text-[10px] text-slate-500">{subtitle}</p>
      </div>
    </div>
  );
}

export default PinnedThreads;