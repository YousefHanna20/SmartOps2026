function SprintCard({
  title,
  description,
  progress,
  tag,
  icon,
}) {
  return (
    <div className="group bg-surface-container-lowest p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 border border-transparent hover:border-primary/10">
      <div className="flex justify-between items-start mb-12">
        <div className="p-3 bg-primary-fixed text-primary rounded-xl">
          <span className="material-symbols-outlined">
            {icon}
          </span>
        </div>

        <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
          {tag}
        </span>
      </div>

      <h3 className="text-xl font-bold mb-2">{title}</h3>

      <p className="text-sm text-slate-500 mb-8 leading-relaxed">
        {description}
      </p>

      <div className="space-y-4">
        <div className="flex justify-between items-center text-xs font-bold">
          <span className="text-slate-400">COMPLETION</span>

          <span className="text-primary">{progress}</span>
        </div>

        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full"
            style={{ width: progress }}
          />
        </div>
      </div>
    </div>
  );
}

export default SprintCard;