function TeamSignature() {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white px-6 py-5 shadow-sm shadow-blue-900/5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined">code</span>
          </div>

          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              SmartOps Development Team
            </p>

            <h4 className="text-lg font-black text-primary tracking-tight">
              Developed by Mahmoud Asmar & Yousef Hanaa
            </h4>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <TechBadge label="React" />
          <TechBadge label="Node.js" />
          <TechBadge label="MySQL" />
          <TechBadge label="Socket.IO" />
        </div>
      </div>
    </div>
  );
}

function TechBadge({ label }) {
  return (
    <span className="rounded-full bg-slate-100 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-600">
      {label}
    </span>
  );
}

export default TeamSignature;