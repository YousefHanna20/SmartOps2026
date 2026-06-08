function WelcomeSection({ user, loading = false, error = "", onRefresh, stats }) {
  const displayName = user?.name || "SmartOps User";
  const role = user?.role || "user";

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#071f3a] via-[#0b3763] to-[#105c91] p-8 md:p-10 text-white shadow-2xl shadow-blue-950/20">
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-blue-300/20 blur-3xl" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className="rounded-full bg-white/15 px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] backdrop-blur">
              {today}
            </span>

            <span className="rounded-full bg-emerald-400/15 px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-emerald-100">
              {role}
            </span>
          </div>

          <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
            Welcome back, {loading ? "..." : displayName}.
          </h2>

          <p className="mt-5 max-w-2xl text-base md:text-lg leading-8 text-blue-50/85">
            Here is your live SmartOps overview. Track projects, tasks, requests,
            deadlines, and real-time notifications from one professional command
            center.
          </p>

          <div className="mt-6 inline-flex flex-wrap items-center gap-3 rounded-2xl bg-white/10 border border-white/10 px-5 py-4 backdrop-blur">
            <div className="w-10 h-10 rounded-xl bg-white text-primary flex items-center justify-center">
              <span className="material-symbols-outlined">code</span>
            </div>

            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-100/70">
                SmartOps Development Team
              </p>

              <p className="text-sm md:text-base font-bold text-white">
                Developed by Mahmoud Asmar & Yousef Hanaa
              </p>

              <p className="text-xs text-blue-50/70 mt-1">
                React · Node.js · MySQL · Socket.IO
              </p>
            </div>
          </div>

          {error && (
            <div className="mt-5 rounded-2xl bg-red-500/15 border border-red-200/20 px-4 py-3 text-sm font-bold text-red-50">
              {error}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 min-w-[280px]">
          <MiniMetric
            label="Active Projects"
            value={loading ? "..." : stats?.activeProjects ?? 0}
            icon="rocket_launch"
          />

          <MiniMetric
            label="Unread Alerts"
            value={loading ? "..." : stats?.unreadNotifications ?? 0}
            icon="notifications"
          />

          <button
            type="button"
            onClick={onRefresh}
            className="col-span-2 rounded-2xl bg-white text-primary px-5 py-4 text-sm font-black shadow-xl shadow-blue-950/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">refresh</span>
            Refresh Dashboard
          </button>
        </div>
      </div>
    </section>
  );
}

function MiniMetric({ label, value, icon }) {
  return (
    <div className="rounded-2xl bg-white/10 border border-white/10 p-5 backdrop-blur">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-black uppercase tracking-widest text-blue-100/80">
          {label}
        </span>

        <span className="material-symbols-outlined text-blue-100">{icon}</span>
      </div>

      <span className="text-4xl font-black tracking-tight">{value}</span>
    </div>
  );
}

export default WelcomeSection;