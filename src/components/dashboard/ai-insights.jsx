function AiInsights() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm shadow-blue-900/5">
      <div className="px-6 py-4 bg-slate-50 flex items-center justify-between">
        <h3 className="font-bold text-blue-900 flex items-center gap-2">
          <span
            className="material-symbols-outlined text-primary"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            insights
          </span>
          AI Predictive Analytics
        </h3>

        <span className="text-[10px] font-bold uppercase tracking-widest bg-blue-100 text-blue-700 px-2 py-1 rounded">
          Live Data
        </span>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 rounded-lg bg-surface-container-low flex flex-col gap-3">
          <span className="uppercase tracking-widest text-[10px] text-slate-500 font-bold">
            Recommended Priority
          </span>

          <h4 className="text-xl font-bold text-primary">
            Structural Review #402
          </h4>

          <p className="text-sm text-slate-600 leading-relaxed">
            3 key stakeholders are awaiting clearance. Delaying this will impact
            4 downstream tasks in "Skyline Phase 2".
          </p>

          <div className="mt-2 flex items-center gap-2 text-on-tertiary-fixed-variant bg-tertiary-container/10 px-3 py-1 rounded-full w-fit">
            <span className="material-symbols-outlined text-sm">
              check_circle
            </span>
            <span className="text-xs font-bold">Priority High</span>
          </div>
        </div>

        <div className="p-5 rounded-lg bg-error-container/20 flex flex-col gap-3 border border-error-container/30">
          <span className="uppercase tracking-widest text-[10px] text-error font-bold">
            Predicted Delay
          </span>

          <h4 className="text-xl font-bold text-on-error-container">
            Permit Acquisition
          </h4>

          <p className="text-sm text-on-error-container opacity-80 leading-relaxed">
            Estimated delay of <strong>4.5 days</strong> due to municipal office
            backlogs. Consider shifting resource allocation.
          </p>

          <div className="mt-2 flex items-center gap-2 text-error font-bold">
            <span className="material-symbols-outlined text-sm">warning</span>
            <span className="text-xs">Action Required</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AiInsights;