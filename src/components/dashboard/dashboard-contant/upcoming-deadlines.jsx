function UpcomingDeadlines({ deadlines = [], loading = false }) {
  return (
    <div className="bg-surface-container-low p-6 rounded-3xl border border-slate-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h4 className="uppercase tracking-widest text-[11px] text-slate-500 font-black">
            Deadlines & Overdue
          </h4>

          <p className="text-sm text-slate-500 mt-1">
            Closest deadlines and overdue project work.
          </p>
        </div>

        <span className="material-symbols-outlined text-primary">
          event_upcoming
        </span>
      </div>

      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-16 bg-white rounded-2xl animate-pulse"
            />
          ))}
        </div>
      )}

      {!loading && deadlines.length === 0 && (
        <div className="rounded-2xl bg-white p-6 text-center">
          <span className="material-symbols-outlined text-4xl text-slate-300">
            event_available
          </span>

          <h5 className="font-black text-primary mt-2">No deadlines</h5>

          <p className="text-sm text-slate-500 mt-1">
            Deadlines and overdue items will appear here.
          </p>
        </div>
      )}

      {!loading && deadlines.length > 0 && (
        <div className="space-y-4">
          {deadlines.map((deadline) => (
            <Deadline key={deadline.id} deadline={deadline} />
          ))}
        </div>
      )}
    </div>
  );
}

function Deadline({ deadline }) {
  const date = new Date(deadline.date);

  const day = Number.isNaN(date.getTime()) ? "--" : date.getDate();

  const month = Number.isNaN(date.getTime())
    ? "N/A"
    : date.toLocaleDateString("en-US", { month: "short" });

  const daysLeft = getDaysLeft(deadline.date);
  const overdue = Boolean(deadline.isOverdue);
  const urgent = !overdue && daysLeft <= 3;

  return (
    <div className="flex gap-4 rounded-2xl bg-white p-4 shadow-sm shadow-blue-900/5 hover:shadow-md transition-shadow">
      <div
        className={`w-14 h-14 shrink-0 rounded-2xl flex flex-col items-center justify-center ${
          overdue
            ? "bg-red-100 text-red-700"
            : urgent
            ? "bg-amber-50 text-amber-700"
            : "bg-blue-50 text-primary"
        }`}
      >
        <span className="font-black leading-none text-lg">{day}</span>

        <span className="text-[9px] uppercase font-black opacity-70">
          {month}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
            {deadline.type}
          </span>

          {deadline.priority && (
            <span className="text-[9px] font-black uppercase text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
              {deadline.priority}
            </span>
          )}

          {overdue && (
            <span className="text-[9px] font-black uppercase text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
              Overdue
            </span>
          )}

          {!overdue && urgent && (
            <span className="text-[9px] font-black uppercase text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full">
              Urgent
            </span>
          )}
        </div>

        <p className="text-sm font-black text-primary truncate">
          {deadline.title}
        </p>

        <p className="text-xs text-slate-500 truncate">{deadline.subtitle}</p>

        <p
          className={`text-[10px] font-black mt-1 ${
            overdue ? "text-red-600" : "text-slate-400"
          }`}
        >
          {getDeadlineLabel(deadline.date)}
        </p>
      </div>
    </div>
  );
}

function getDeadlineLabel(value) {
  const daysLeft = getDaysLeft(value);

  if (daysLeft < 0) {
    return `${Math.abs(daysLeft)} day${
      Math.abs(daysLeft) === 1 ? "" : "s"
    } overdue`;
  }

  if (daysLeft === 0) {
    return "Due today";
  }

  if (daysLeft === 1) {
    return "Due tomorrow";
  }

  return `${daysLeft} days left`;
}

function getDaysLeft(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return 999;

  const today = new Date();

  date.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diff = date.getTime() - today.getTime();

  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default UpcomingDeadlines;