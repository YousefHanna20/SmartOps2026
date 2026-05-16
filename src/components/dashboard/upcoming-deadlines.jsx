function UpcomingDeadlines() {
  return (
    <div className="bg-surface-container-low p-6 rounded-xl">
      <h4 className="uppercase tracking-widest text-[11px] text-slate-500 font-bold mb-6">
        Upcoming Deadlines
      </h4>

      <div className="space-y-6">
        <Deadline day="12" month="Oct" title="Permit Approval Subm." project="Metropolis Center" />
        <Deadline day="18" month="Oct" title="Final Design Lock-in" project="Harbor Heights Phase 1" />
      </div>
    </div>
  );
}

function Deadline({ day, month, title, project }) {
  return (
    <div className="flex gap-4">
      <div className="w-12 h-12 shrink-0 rounded-lg bg-white flex flex-col items-center justify-center shadow-sm">
        <span className="text-primary font-black leading-none">{day}</span>
        <span className="text-[9px] uppercase font-bold text-slate-400">
          {month}
        </span>
      </div>

      <div>
        <p className="text-sm font-bold text-primary">{title}</p>
        <p className="text-xs text-slate-500">{project}</p>
      </div>
    </div>
  );
}

export default UpcomingDeadlines;