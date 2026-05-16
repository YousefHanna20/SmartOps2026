function SystemHealth() {
  return (
    <div className="bg-primary p-10 rounded-2xl text-white relative overflow-hidden flex flex-col justify-between">
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl" />

      <div className="relative z-10">
        <span className="text-[11px] font-bold uppercase tracking-widest opacity-60">
          System Health
        </span>

        <div className="mt-8 space-y-6">
          <div className="flex items-center gap-4">
            <div className="text-4xl font-black tabular-nums">
              98.4%
            </div>

            <span className="material-symbols-outlined text-emerald-400">
              trending_up
            </span>
          </div>

          <p className="text-blue-100 text-sm leading-relaxed">
            Across all active projects, efficiency is up by 12%
            compared to last quarter's baseline metrics.
          </p>
        </div>
      </div>

      <div className="relative z-10 pt-8 mt-8 border-t border-white/10">
        <button className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
          View Analytics

          <span className="material-symbols-outlined text-sm">
            arrow_forward
          </span>
        </button>
      </div>
    </div>
  );
}

export default SystemHealth;