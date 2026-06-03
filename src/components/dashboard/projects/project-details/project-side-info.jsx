function ProjectSideInfo({ project }) {
  const status = project.status || "pending";
  const priority = project.priority || "medium";

  const formatText = (value) => {
    return String(value || "")
      .replaceAll("_", " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const getStatusBadgeClass = (value) => {
    if (value === "completed") return "bg-green-100 text-green-700";
    if (value === "cancelled") return "bg-red-100 text-red-700";
    if (value === "in_progress") return "bg-blue-100 text-blue-700";

    return "bg-yellow-100 text-yellow-700";
  };

  const getPriorityBadgeClass = (value) => {
    if (value === "high") return "bg-red-100 text-red-700";
    if (value === "medium") return "bg-yellow-100 text-yellow-700";

    return "bg-green-100 text-green-700";
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#082b4f] text-white p-8 rounded-2xl relative overflow-hidden shadow-xl">
        <div className="relative z-10">
          <p className="uppercase tracking-widest text-[11px] text-blue-200 font-black mb-2">
            Project Overview
          </p>

          <h4 className="text-2xl font-black mb-4 leading-8">
            {project.name || "Untitled Project"}
          </h4>

          <p className="text-base text-blue-100 leading-7 opacity-90 mb-6">
            {project.description ||
              "This project was created without a detailed description."}
          </p>

          <div className="flex flex-wrap gap-2">
            <span className="bg-white/10 text-white border border-white/20 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest">
              {project.category || "Uncategorized"}
            </span>

            <span className="bg-white/10 text-white border border-white/20 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest">
              ID: {project.project_id}
            </span>
          </div>
        </div>

        <div className="absolute -right-4 -bottom-4 opacity-10">
          <span className="material-symbols-outlined text-[130px]">
            account_tree
          </span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-5">
        <div>
          <h4 className="uppercase tracking-widest text-[11px] text-slate-400 font-black">
            Project Status
          </h4>

          <p className="text-sm text-slate-500 mt-2 leading-6">
            Current operational state and priority level.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <InfoBadge
            label="Status"
            value={formatText(status)}
            className={getStatusBadgeClass(status)}
          />

          <InfoBadge
            label="Priority"
            value={formatText(priority)}
            className={getPriorityBadgeClass(priority)}
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <h4 className="uppercase tracking-widest text-[11px] text-slate-400 font-black">
          Project Source
        </h4>

        <div className="rounded-2xl bg-slate-50 border border-slate-100 p-5">
          <p className="text-xs uppercase tracking-widest text-slate-400 font-black">
            Based On
          </p>

          <h5 className="text-lg font-black text-[#0b2a4a] mt-2">
            {project.template_name || "Custom Project"}
          </h5>

          <p className="text-sm text-slate-500 mt-2 leading-6">
            {project.template_name
              ? "This project was created from a reusable project template."
              : "This project was created as a custom client request."}
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <h4 className="uppercase tracking-widest text-[11px] text-slate-400 font-black">
          Project Stakeholders
        </h4>

        <div className="space-y-3">
          <InfoRow label="Client" value={project.client_name || "No client"} />
          <InfoRow
            label="Created By"
            value={project.created_by_name || "Unknown"}
          />
          <InfoRow
            label="Start Date"
            value={project.start_date || "Not set"}
          />
          <InfoRow label="Deadline" value={project.deadline || "Not set"} />
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between gap-4 mb-5">
          <div>
            <h4 className="uppercase tracking-widest text-[11px] text-slate-400 font-black">
              Timeline Track
            </h4>

            <p className="text-sm text-slate-500 mt-2">
              Estimated based on project status.
            </p>
          </div>

          <span className="material-symbols-outlined text-[#082b4f]">
            monitoring
          </span>
        </div>

        <div className="space-y-3">
          <Bar width={getTimelineWidth(status)} color={getTimelineColor(status)} />
        </div>

        <div className="flex justify-between text-xs text-slate-400 font-bold mt-3">
          <span>Pending</span>
          <span>In Progress</span>
          <span>Completed</span>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between gap-4 border-b border-slate-200/70 pb-3 last:border-b-0 last:pb-0">
      <span className="text-xs uppercase tracking-widest text-slate-400 font-black">
        {label}
      </span>

      <span className="text-sm font-black text-[#0b2a4a] text-right">
        {value}
      </span>
    </div>
  );
}

function InfoBadge({ label, value, className }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 border border-slate-100 p-4">
      <span className="text-xs uppercase tracking-widest text-slate-400 font-black">
        {label}
      </span>

      <span className={`px-4 py-2 rounded-full text-xs font-black ${className}`}>
        {value}
      </span>
    </div>
  );
}

function getTimelineWidth(status) {
  if (status === "completed") return "w-full";
  if (status === "in_progress") return "w-2/3";
  if (status === "cancelled") return "w-1/6";

  return "w-1/3";
}

function getTimelineColor(status) {
  if (status === "completed") return "bg-green-500";
  if (status === "cancelled") return "bg-red-500";
  if (status === "in_progress") return "bg-blue-500";

  return "bg-yellow-500";
}

function Bar({ width, color }) {
  return (
    <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
      <div className={`h-full ${color} rounded-full ${width}`} />
    </div>
  );
}

export default ProjectSideInfo;