function ProjectsHeader() {
  return (
    <div className="flex justify-between items-end mb-8">
      <div className="space-y-1">
        <h2 className="text-4xl font-extrabold text-primary tracking-tight">
          Project Portfolio
        </h2>

        <p className="text-slate-500 text-lg">
          Managing 24 active high-performance systems
        </p>
      </div>

      <div className="flex items-center bg-surface-container-low rounded-xl p-1">
        <button className="px-4 py-2 bg-white shadow-sm rounded-lg text-sm font-semibold text-primary">
          Admin View
        </button>

        <button className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-primary transition-all">
          Team View
        </button>
      </div>
    </div>
  );
}

export default ProjectsHeader;