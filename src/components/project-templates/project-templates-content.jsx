function ProjectTemplatesContent() {
  const templates = [
    {
      name: "Commercial High-Rise V2",
      category: "Architecture",
      duration: "180 Days",
      status: "Verified",
    },
    {
      name: "Industrial Retrofit",
      category: "Renovation",
      duration: "90 Days",
      status: "Verified",
    },
    {
      name: "Urban Green Belt",
      category: "Urban Planning",
      duration: "320 Days",
      status: "Draft",
    },
  ];

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">
            Administration Cell
          </p>
          <h2 className="text-4xl font-black text-[#0b2a4a] mt-2">
            Project Templates
          </h2>
          <p className="text-slate-500 max-w-2xl mt-3">
            System-wide architectural blueprints for automated operational
            scaling. Define structure, duration, and core metrics.
          </p>
        </div>

        <button className="bg-[#082b4f] text-white rounded-lg px-6 py-3 font-bold text-sm h-fit">
          + Create Template
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
        {[
          ["Active Blueprints", "24", "+12%"],
          ["Avg Execution", "14 Days", "System optimized"],
          ["Global Utilization", "82%", "Capacity reached"],
        ].map(([label, value, note]) => (
          <div key={label} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <p className="text-xs uppercase tracking-widest text-slate-400">
              {label}
            </p>
            <h3 className="text-3xl font-black text-[#0b2a4a] mt-3">{value}</h3>
            <p className="text-xs text-slate-400 mt-2">{note}</p>
          </div>
        ))}
      </div>

      <section className="bg-white rounded-2xl shadow-sm border border-slate-100 mt-8 overflow-hidden">
        <div className="flex justify-between items-center px-6 py-5 border-b">
          <h3 className="font-black text-[#0b2a4a]">Template Registry</h3>
          <div className="flex gap-3 text-slate-400">
            <span className="material-symbols-outlined">filter_list</span>
            <span className="material-symbols-outlined">sort</span>
          </div>
        </div>

        <div className="hidden md:grid grid-cols-[1fr_150px_130px_120px_80px] px-6 py-4 text-[11px] uppercase tracking-widest text-slate-400 border-b">
          <p>Name</p>
          <p>Category</p>
          <p>Duration</p>
          <p>Status</p>
          <p>Actions</p>
        </div>

        {templates.map((template, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-[1fr_150px_130px_120px_80px] gap-3 items-center px-6 py-5 border-b last:border-b-0"
          >
            <div>
              <p className="font-bold text-[#0b2a4a]">{template.name}</p>
              <p className="text-xs text-slate-400">
                Framework template ready for client modification.
              </p>
            </div>

            <span className="text-xs bg-slate-100 rounded-full px-3 py-1 w-fit">
              {template.category}
            </span>

            <p className="text-sm font-bold">{template.duration}</p>

            <span className="text-xs font-bold text-green-700">
              ● {template.status}
            </span>

            <div className="flex gap-2 text-slate-400">
              <span className="material-symbols-outlined">edit</span>
              <span className="material-symbols-outlined">more_vert</span>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default ProjectTemplatesContent;