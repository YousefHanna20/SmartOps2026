import { Link } from "react-router-dom";

function ProjectsTable() {
  const projects = [
    {
      name: "Cloud Scale Infrastructure",
      template: "Standard Blueprint v4",
      client: "Global Stream Inc.",
      priority: "CRITICAL",
      status: "In Progress",
      date: "Oct 24, 2024",
      colorClasses: "bg-blue-50 text-blue-600",
      icon: "cloud_done",
    },
    {
      name: "Sustainable Data Hub",
      template: "Green Ops Template",
      client: "Eco-Dynamics",
      priority: "MEDIUM",
      status: "Stable",
      date: "Nov 12, 2024",
      colorClasses: "bg-emerald-50 text-emerald-600",
      icon: "eco",
    },
    {
      name: "Security Audit Alpha",
      template: "Compliance Framework",
      client: "Shield Group",
      priority: "HIGH",
      status: "Review Required",
      date: "Dec 02, 2024",
      colorClasses: "bg-orange-50 text-orange-600",
      icon: "security",
    },
  ];

  return (
    <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm ring-1 ring-black/5">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              {[
                "Project Name",
                "Client",
                "Priority",
                "Status",
                "Deadline",
                "Actions",
              ].map((item) => (
                <th
                  key={item}
                  className="px-6 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-400"
                >
                  {item}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50">
            {projects.map((project) => (
              <tr
                key={project.name}
                className="hover:bg-slate-50/50 transition-colors"
              >
                {/* Project Name */}
                <td className="px-6 py-6">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${project.colorClasses}`}
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        {project.icon}
                      </span>
                    </div>

                    <div>
                      <Link
                        to={`/projects/${project.name
                          .toLowerCase()
                          .replaceAll(" ", "-")}`}
                        className="font-bold text-on-surface hover:text-primary hover:underline"
                      >
                        {project.name}
                      </Link>

                      <p className="text-xs text-slate-400">
                        {project.template}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Client */}
                <td className="px-6 py-6 text-sm font-medium text-slate-600">
                  {project.client}
                </td>

                {/* Priority */}
                <td className="px-6 py-6">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-secondary-container text-on-secondary-container">
                    {project.priority}
                  </span>
                </td>

                {/* Status */}
                <td className="px-6 py-6 text-sm text-blue-700 font-medium">
                  {project.status}
                </td>

                {/* Deadline */}
                <td className="px-6 py-6 text-sm text-slate-500">
                  {project.date}
                </td>

                {/* Actions */}
                <td className="px-6 py-6 text-right">
                  <button className="text-slate-400 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">
                      more_horiz
                    </span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-slate-100">
        {projects.map((project) => (
          <div key={project.name} className="p-5">
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${project.colorClasses}`}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {project.icon}
                </span>
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <Link
                  to={`/projects/${project.name
                    .toLowerCase()
                    .replaceAll(" ", "-")}`}
                  className="block font-black text-[#0b2a4a] text-lg leading-tight"
                >
                  {project.name}
                </Link>

                <p className="text-sm text-slate-400 mt-1 leading-6">
                  {project.template}
                </p>

                <span className="inline-flex mt-3 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700">
                  {project.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProjectsTable;