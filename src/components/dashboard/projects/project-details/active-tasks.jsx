function ActiveTasks() {
  const tasks = [
    {
      icon: "draw",
      title: "Architectural Blueprint Audit",
      assignee: "Marcus Aurelius",
      status: "In Review",
      priority: "High",
    },
    {
      icon: "precision_manufacturing",
      title: "System Integration Testing",
      assignee: "Sarah Jenkins",
      status: "Ongoing",
      priority: "Medium",
    },
    {
      icon: "verified_user",
      title: "Final Compliance Check",
      assignee: "David Chen",
      status: "Pending",
      priority: "Critical",
    },
  ];

  return (
    <div className="lg:col-span-2 space-y-6">
      <div className="flex justify-between items-end px-2">
        <div>
          <h4 className="text-2xl font-bold text-blue-900 tracking-tight">
            Active Tasks
          </h4>
          <p className="text-sm text-slate-500">
            Managing 12 interconnected deliverables
          </p>
        </div>

        <button className="text-primary font-bold text-sm flex items-center gap-1 hover:underline">
          <span className="material-symbols-outlined text-sm">filter_list</span>
          Filter
        </button>
      </div>

      <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
        {tasks.map((task) => (
          <TaskItem key={task.title} {...task} />
        ))}
      </div>
    </div>
  );
}

function TaskItem({ icon, title, assignee, status, priority }) {
  return (
    <div className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors border-t first:border-t-0 border-slate-50">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
          <span className="material-symbols-outlined text-blue-900">
            {icon}
          </span>
        </div>

        <div>
          <h5 className="font-bold text-on-surface">{title}</h5>
          <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
            Assigned to: {assignee}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div className="hidden sm:flex flex-col items-end">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
            Status
          </p>
          <span className="px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-[10px] font-bold uppercase tracking-widest">
            {status}
          </span>
        </div>

        <div className="hidden sm:flex flex-col items-end">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
            Priority
          </p>
          <span className="text-sm font-bold text-blue-900">{priority}</span>
        </div>

        <button className="text-slate-300 hover:text-primary">
          <span className="material-symbols-outlined">more_vert</span>
        </button>
      </div>
    </div>
  );
}

export default ActiveTasks;