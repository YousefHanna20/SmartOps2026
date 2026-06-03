function ProjectSummary({
  project,
  canEdit = false,
  isUpdating = false,
  onProjectUpdate,
}) {
  const status = project?.status || "pending";
  const priority = project?.priority || "medium";

  const formatStatus = (value) => {
    return String(value || "pending")
      .replaceAll("_", " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const formatPriority = (value) => {
    return String(value || "medium").toUpperCase();
  };

  const getStatusSelectClass = (value) => {
    const normalizedStatus = String(value).toLowerCase();

    if (normalizedStatus === "completed") {
      return "bg-green-100 text-green-700 border-green-200";
    }

    if (normalizedStatus === "cancelled") {
      return "bg-red-100 text-red-700 border-red-200";
    }

    if (normalizedStatus === "in_progress") {
      return "bg-blue-100 text-blue-700 border-blue-200";
    }

    return "bg-yellow-100 text-yellow-700 border-yellow-200";
  };

  const getPrioritySelectClass = (value) => {
    const normalizedPriority = String(value).toLowerCase();

    if (normalizedPriority === "high") {
      return "bg-red-100 text-red-700 border-red-200";
    }

    if (normalizedPriority === "medium") {
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    }

    return "bg-green-100 text-green-700 border-green-200";
  };

  const getStatusDescription = () => {
    if (status === "completed") {
      return "This project is completed. New task assignment is locked.";
    }

    if (status === "cancelled") {
      return "This project is cancelled. New task assignment is locked.";
    }

    if (status === "in_progress") {
      return "This project is active and currently being worked on.";
    }

    return "This project is pending and waiting to move forward.";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="md:col-span-2 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
        <p className="text-xs uppercase tracking-widest text-slate-400 font-black">
          Project Control
        </p>

        <h3 className="text-2xl font-black text-[#0b2a4a] mt-3">
          Status & Priority
        </h3>

        <p className="text-base text-slate-500 mt-3 leading-7">
          {getStatusDescription()}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-7">
          <div>
            <label
              htmlFor="project-status"
              className="block text-xs uppercase tracking-widest text-slate-400 font-black mb-2"
            >
              Project Status
            </label>

            {canEdit ? (
              <select
                id="project-status"
                value={status}
                disabled={isUpdating}
                onChange={(event) =>
                  onProjectUpdate("status", event.target.value)
                }
                className={`w-full px-4 py-3 rounded-xl text-sm font-black uppercase outline-none border disabled:opacity-60 disabled:cursor-not-allowed ${getStatusSelectClass(
                  status
                )}`}
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            ) : (
              <span
                className={`inline-flex px-4 py-3 rounded-xl text-sm font-black uppercase border ${getStatusSelectClass(
                  status
                )}`}
              >
                {formatStatus(status)}
              </span>
            )}
          </div>

          <div>
            <label
              htmlFor="project-priority"
              className="block text-xs uppercase tracking-widest text-slate-400 font-black mb-2"
            >
              Project Priority
            </label>

            {canEdit ? (
              <select
                id="project-priority"
                value={priority}
                disabled={isUpdating}
                onChange={(event) =>
                  onProjectUpdate("priority", event.target.value)
                }
                className={`w-full px-4 py-3 rounded-xl text-sm font-black uppercase outline-none border disabled:opacity-60 disabled:cursor-not-allowed ${getPrioritySelectClass(
                  priority
                )}`}
              >
                <option value="low">LOW</option>
                <option value="medium">MEDIUM</option>
                <option value="high">HIGH</option>
              </select>
            ) : (
              <span
                className={`inline-flex px-4 py-3 rounded-xl text-sm font-black uppercase border ${getPrioritySelectClass(
                  priority
                )}`}
              >
                {formatPriority(priority)}
              </span>
            )}
          </div>
        </div>

        {isUpdating && (
          <p className="text-sm text-slate-400 font-bold mt-5">
            Saving project changes...
          </p>
        )}
      </div>

      <SummaryCard
        icon="person"
        label="Client"
        value={project.client_name || "No client"}
        note="Project owner"
      />

      <SummaryCard
        icon="category"
        label="Category"
        value={project.category || "Uncategorized"}
        note="Project type"
      />

      <SummaryCard
        icon="event"
        label="Deadline"
        value={project.deadline || "Not set"}
        note="Target delivery"
      />

      <SummaryCard
        icon="layers"
        label="Template"
        value={project.template_name || "No template"}
        note="Source template"
      />
    </div>
  );
}

function SummaryCard({ icon, label, value, note }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
      <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-[#082b4f]">
        <span className="material-symbols-outlined">{icon}</span>
      </div>

      <p className="text-xs uppercase tracking-widest text-slate-400 font-black mt-5">
        {label}
      </p>

      <h4 className="text-lg font-black text-[#0b2a4a] mt-2 leading-6">
        {value}
      </h4>

      <p className="text-xs text-slate-400 mt-2">{note}</p>
    </div>
  );
}

export default ProjectSummary;