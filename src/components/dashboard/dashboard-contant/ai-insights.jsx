function AiInsights({ insights = [], loading = false }) {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm shadow-blue-900/5 border border-slate-100">
      <div className="px-7 py-6 bg-gradient-to-r from-slate-50 to-white flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100">
        <div>
          <h3 className="font-black text-blue-900 text-2xl tracking-tight flex items-center gap-2">
            <span
              className="material-symbols-outlined text-primary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              insights
            </span>
            Smart Insights
          </h3>

          <p className="text-sm text-slate-500 mt-1">
            Live operational signals calculated from your current workspace.
          </p>
        </div>

        <span className="text-[10px] font-black uppercase tracking-widest bg-blue-100 text-blue-700 px-3 py-2 rounded-full">
          Live Data
        </span>
      </div>

      <div className="p-7">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-36 rounded-2xl bg-slate-100 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {insights.map((insight) => (
              <InsightCard key={insight.title} insight={insight} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function InsightCard({ insight }) {
  const toneMap = {
    success: "bg-emerald-50 border-emerald-100 text-emerald-700",
    warning: "bg-amber-50 border-amber-100 text-amber-700",
    danger: "bg-red-50 border-red-100 text-red-700",
    info: "bg-blue-50 border-blue-100 text-blue-700",
    primary: "bg-slate-50 border-slate-100 text-primary",
  };

  return (
    <div
      className={`rounded-2xl border p-5 min-h-[150px] flex flex-col justify-between ${
        toneMap[insight.tone] || toneMap.primary
      }`}
    >
      <div>
        <div className="flex items-center justify-between gap-4 mb-4">
          <span className="text-[10px] font-black uppercase tracking-widest opacity-70">
            {insight.title}
          </span>

          <span className="material-symbols-outlined">{insight.icon}</span>
        </div>

        <h4 className="text-2xl font-black tracking-tight">{insight.value}</h4>
      </div>

      <p className="text-sm leading-6 opacity-80 mt-4">{insight.description}</p>
    </div>
  );
}

export default AiInsights;