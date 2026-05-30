function ProjectSummary() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="md:col-span-2 bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/10">
        <p className="uppercase tracking-widest text-[11px] text-slate-500 mb-2">
          Overall Completion
        </p>

        <h3 className="text-4xl font-black text-blue-900 tracking-tighter mb-6">
          68%
        </h3>

        <div className="space-y-4">
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full w-[68%]" />
          </div>

          <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-slate-400">
            <span>Phases 1-3 Complete</span>
            <span>Phase 4 in Progress</span>
          </div>
        </div>
      </div>

      <InfoCard
        icon="priority_high"
        title="Priority"
        value="Critical Path"
        badge="High Alert"
      />

      <InfoCard
        icon="event"
        title="Deadline"
        value="Dec 12, 2024"
        badge="14 Days Remaining"
      />
    </section>
  );
}

function InfoCard({ icon, title, value, badge }) {
  return (
    <div className="bg-surface-container-low p-6 rounded-xl space-y-4">
      <span className="material-symbols-outlined text-primary">{icon}</span>

      <div>
        <p className="uppercase tracking-widest text-[11px] text-slate-500">
          {title}
        </p>
        <p className="text-lg font-bold text-blue-900">{value}</p>
      </div>

      <div className="inline-flex items-center px-3 py-1 bg-error-container/30 text-error rounded-full text-[10px] font-black uppercase tracking-widest">
        {badge}
      </div>
    </div>
  );
}

export default ProjectSummary;