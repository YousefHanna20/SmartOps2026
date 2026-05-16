function StatsGrid() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <StatCard title="Total Projects" value="24" icon="account_tree" />
      <StatCard title="Tasks" value="142" icon="assignment_turned_in" />
      <StatCard title="Requests" value="12" icon="hail" />

      <div className="bg-gradient-to-br from-primary to-primary-container p-6 rounded-xl shadow-lg shadow-blue-900/10 text-white">
        <p className="uppercase tracking-widest text-[11px] mb-4 opacity-80">
          AI Efficiency
        </p>

        <div className="flex items-end justify-between">
          <span className="text-4xl font-black tracking-tighter">94%</span>
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            bolt
          </span>
        </div>
      </div>
    </section>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm shadow-blue-900/5 group hover:bg-primary hover:text-white transition-all duration-300">
      <p className="uppercase tracking-widest text-[11px] mb-4 opacity-70">
        {title}
      </p>

      <div className="flex items-end justify-between">
        <span className="text-4xl font-black tracking-tighter">{value}</span>
        <span className="material-symbols-outlined opacity-40 group-hover:opacity-100">
          {icon}
        </span>
      </div>
    </div>
  );
}

export default StatsGrid;