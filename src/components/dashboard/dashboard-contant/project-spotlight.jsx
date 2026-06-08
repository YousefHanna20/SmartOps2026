function ProjectSpotlight({ project, loading = false }) {
  if (loading) {
    return <div className="h-[420px] rounded-3xl bg-slate-100 animate-pulse" />;
  }

  if (!project) {
    return (
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-700 p-8 text-white min-h-[420px] flex flex-col justify-between">
        <span className="material-symbols-outlined text-5xl opacity-70">
          account_tree
        </span>

        <div>
          <span className="inline-block px-3 py-1 bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-full mb-4">
            Project Spotlight
          </span>

          <h3 className="text-3xl font-black tracking-tight">
            No projects yet
          </h3>

          <p className="text-white/70 text-sm mt-3 leading-6">
            Once projects are created or approved from requests, the most important
            project will appear here.
          </p>
        </div>
      </div>
    );
  }

  const progress = getProgress(project.status);

  return (
    <div className="relative rounded-3xl overflow-hidden min-h-[420px] shadow-xl shadow-blue-950/10 bg-gradient-to-br from-primary via-[#0b3d6e] to-[#0b87c9] text-white">
      <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-cyan-300/20 blur-3xl" />

      <div className="relative z-10 p-8 h-full flex flex-col justify-between min-h-[420px]">
        <div className="flex items-center justify-between gap-4">
          <span className="inline-block px-3 py-1 bg-white/15 backdrop-blur text-white text-[10px] font-black uppercase tracking-widest rounded-full">
            Project Spotlight
          </span>

          <span className="material-symbols-outlined text-white/70">
            auto_awesome
          </span>
        </div>

        <div>
          <h3 className="text-3xl font-black tracking-tight leading-tight">
            {project.name}
          </h3>

          <p className="text-white/75 text-sm mt-3 leading-6 line-clamp-3">
            {project.description || "No project description available."}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Info label="Status" value={formatStatus(project.status)} />
            <Info label="Priority" value={formatStatus(project.priority)} />
            <Info label="Client" value={project.client_name || "Not assigned"} />
            <Info label="Deadline" value={formatDate(project.deadline)} />
          </div>

          <div className="mt-7">
            <div className="flex items-center justify-between mb-2 text-xs font-bold text-white/80">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>

            <div className="w-full h-2 bg-white/15 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-2xl bg-white/10 border border-white/10 p-4 backdrop-blur">
      <p className="text-[9px] font-black uppercase tracking-widest text-white/50">
        {label}
      </p>
      <p className="text-sm font-black mt-1 truncate">{value}</p>
    </div>
  );
}

function getProgress(status) {
  const map = {
    pending: 15,
    in_progress: 62,
    completed: 100,
    cancelled: 0,
  };

  return map[status] ?? 25;
}

function formatStatus(value) {
  return String(value || "N/A")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDate(value) {
  if (!value) return "No deadline";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "No deadline";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default ProjectSpotlight;