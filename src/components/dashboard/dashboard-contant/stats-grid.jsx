function StatsGrid({ stats, loading = false }) {
  const cards = [
    {
      title: "Total Projects",
      value: stats?.totalProjects ?? 0,
      icon: "account_tree",
      helper: `${stats?.activeProjects ?? 0} active`,
      tone: "blue",
    },
    {
      title: "Tasks",
      value: stats?.totalTasks ?? 0,
      icon: "assignment_turned_in",
      helper: `${stats?.completedTasks ?? 0} completed`,
      tone: "purple",
    },
    {
      title: "Requests",
      value: stats?.pendingRequests ?? 0,
      icon: "approval",
      helper: "Pending review",
      tone: "amber",
    },
    {
      title: "Completion",
      value: `${stats?.completionRate ?? 0}%`,
      icon: "bolt",
      helper: `${stats?.inProgressTasks ?? 0} in progress`,
      tone: "green",
      featured: true,
    },
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {cards.map((card) => (
        <StatCard key={card.title} card={card} loading={loading} />
      ))}
    </section>
  );
}

function StatCard({ card, loading }) {
  const toneClasses = {
    blue: "from-blue-50 to-white text-blue-700 border-blue-100",
    purple: "from-purple-50 to-white text-purple-700 border-purple-100",
    amber: "from-amber-50 to-white text-amber-700 border-amber-100",
    green: "from-emerald-500 to-teal-600 text-white border-emerald-300",
  };

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border bg-gradient-to-br p-6 shadow-sm shadow-blue-900/5 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 ${
        toneClasses[card.tone]
      }`}
    >
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-current opacity-10 blur-2xl" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <p className="uppercase tracking-[0.18em] text-[10px] font-black opacity-70">
            {card.title}
          </p>

          <span
            className={`material-symbols-outlined ${
              card.featured ? "text-white/80" : "text-current/60"
            }`}
          >
            {card.icon}
          </span>
        </div>

        <div className="flex items-end justify-between gap-4">
          <span className="text-4xl md:text-5xl font-black tracking-tight">
            {loading ? "..." : card.value}
          </span>

          <span className="text-xs font-bold opacity-70 text-right">
            {loading ? "Loading" : card.helper}
          </span>
        </div>
      </div>
    </div>
  );
}

export default StatsGrid;