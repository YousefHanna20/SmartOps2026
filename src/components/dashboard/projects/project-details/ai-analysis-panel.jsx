import { useEffect, useMemo, useState } from "react";
import {
  generateProjectAiAnalysis,
  getLatestProjectAiAnalysis,
} from "../../../../services/ai-analysis-service";

function AiAnalysisPanel({ project }) {
  const [analysis, setAnalysis] = useState(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(true);
  const [generatingAnalysis, setGeneratingAnalysis] = useState(false);
  const [analysisError, setAnalysisError] = useState("");
  const [hasNoAnalysis, setHasNoAnalysis] = useState(false);

  const projectId = project?.project_id;

  const loadLatestAnalysis = async () => {
    if (!projectId) return;

    setLoadingAnalysis(true);
    setAnalysisError("");
    setHasNoAnalysis(false);

    try {
      const data = await getLatestProjectAiAnalysis(projectId);
      setAnalysis(data.analysis);
    } catch (error) {
      if (error.response?.status === 404) {
        setHasNoAnalysis(true);
        setAnalysis(null);
        return;
      }

      setAnalysisError(
        error.response?.data?.message || "Failed to load AI analysis."
      );
    } finally {
      setLoadingAnalysis(false);
    }
  };

  useEffect(() => {
    loadLatestAnalysis();
  }, [projectId]);

  const handleGenerateAnalysis = async () => {
    if (!projectId) return;

    setGeneratingAnalysis(true);
    setAnalysisError("");

    try {
      const data = await generateProjectAiAnalysis(projectId);
      setAnalysis(data.analysis);
      setHasNoAnalysis(false);

      window.dispatchEvent(new Event("notifications-updated"));
    } catch (error) {
      setAnalysisError(
        error.response?.data?.message || "Failed to generate AI analysis."
      );
    } finally {
      setGeneratingAnalysis(false);
    }
  };

  const riskLevel = analysis?.risk_level || "medium";
  const healthScore = Number(analysis?.health_score || 0);

  const riskConfig = getRiskConfig(riskLevel);

  const metrics = analysis?.metrics || {};
  const recommendations = Array.isArray(analysis?.recommendations)
    ? analysis.recommendations
    : [];

  const bottlenecks = Array.isArray(analysis?.bottlenecks)
    ? analysis.bottlenecks
    : [];

  const metricCards = useMemo(
    () => [
      {
        icon: "task_alt",
        label: "Completion",
        value:
          metrics.completion_rate !== undefined
            ? `${metrics.completion_rate}%`
            : "0%",
      },
      {
        icon: "pending_actions",
        label: "Pending Tasks",
        value: metrics.pending_tasks ?? 0,
      },
      {
        icon: "warning",
        label: "Overdue Tasks",
        value: metrics.overdue_tasks ?? 0,
      },
      {
        icon: "priority_high",
        label: "High Priority",
        value: metrics.high_priority_pending_tasks ?? 0,
      },
    ],
    [metrics]
  );

  return (
    <section className="bg-[#071f3a] rounded-[2rem] overflow-hidden shadow-xl shadow-blue-950/10 border border-blue-950/10">
      <div className="relative p-6 lg:p-8">
        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/5" />
        <div className="absolute right-16 bottom-8 w-24 h-24 rounded-full bg-blue-400/10" />

        <div className="relative z-10 flex flex-col xl:flex-row xl:items-start xl:justify-between gap-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/10 px-4 py-2">
              <span className="material-symbols-outlined text-blue-200 text-[18px]">
                psychology
              </span>

              <span className="text-[11px] font-black uppercase tracking-[0.22em] text-blue-100">
                SmartOps AI Project Health Engine
              </span>
            </div>

            <h3 className="text-3xl lg:text-4xl font-black text-white mt-5 tracking-tight">
              AI Health Analysis
            </h3>

            <p className="text-blue-100/80 text-base leading-7 mt-3">
              Predictive analysis based on task progress, deadline pressure,
              overdue work, priority risks, and project status.
            </p>

            {analysis?.summary && (
              <div className="mt-6 rounded-2xl bg-white/10 border border-white/10 p-5">
                <p className="text-xs font-black uppercase tracking-widest text-blue-200 mb-2">
                  Smart Summary
                </p>

                <p className="text-white text-base leading-8">
                  {analysis.summary}
                </p>
              </div>
            )}

            {hasNoAnalysis && !loadingAnalysis && (
              <div className="mt-6 rounded-2xl bg-white/10 border border-white/10 p-5">
                <p className="text-white font-black text-lg">
                  No AI analysis generated yet.
                </p>

                <p className="text-blue-100/80 text-sm leading-7 mt-2">
                  Generate the first analysis to calculate project health score,
                  risk level, delay prediction, bottlenecks, and recommended
                  actions.
                </p>
              </div>
            )}

            {analysisError && (
              <div className="mt-6 rounded-2xl bg-red-500/10 border border-red-300/20 p-5">
                <p className="text-red-100 font-bold">{analysisError}</p>
              </div>
            )}

            <div className="flex flex-wrap gap-3 mt-6">
              <button
                type="button"
                onClick={handleGenerateAnalysis}
                disabled={generatingAnalysis || loadingAnalysis}
                className="px-5 py-3 rounded-xl bg-white text-[#071f3a] text-sm font-black hover:bg-blue-50 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[19px]">
                  auto_awesome
                </span>
                {generatingAnalysis ? "Generating..." : "Generate AI Analysis"}
              </button>

              <button
                type="button"
                onClick={loadLatestAnalysis}
                disabled={loadingAnalysis || generatingAnalysis}
                className="px-5 py-3 rounded-xl bg-white/10 text-white border border-white/10 text-sm font-black hover:bg-white/15 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[19px]">
                  refresh
                </span>
                Refresh
              </button>
            </div>
          </div>

          <div className="w-full xl:w-[360px] bg-white rounded-[1.7rem] p-6 shadow-2xl">
            {loadingAnalysis ? (
              <div className="min-h-[270px] flex flex-col items-center justify-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center animate-pulse">
                  <span className="material-symbols-outlined text-[#082b4f]">
                    psychology
                  </span>
                </div>

                <p className="text-sm font-black text-slate-500 mt-4">
                  Loading AI analysis...
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                      Health Score
                    </p>

                    <h4 className="text-4xl font-black text-[#0b2a4a] mt-2">
                      {analysis ? healthScore : "--"}
                      {analysis && (
                        <span className="text-base text-slate-400">/100</span>
                      )}
                    </h4>
                  </div>

                  <div
                    className="w-24 h-24 rounded-full flex items-center justify-center"
                    style={{
                      background: analysis
                        ? `conic-gradient(${riskConfig.chartColor} ${healthScore}%, #e2e8f0 0)`
                        : "conic-gradient(#e2e8f0 100%, #e2e8f0 0)",
                    }}
                  >
                    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#082b4f]">
                        monitoring
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <StatusPill
                    label="Risk Level"
                    value={analysis ? formatText(riskLevel) : "Not Ready"}
                    className={riskConfig.badgeClass}
                  />

                  <StatusPill
                    label="Prediction"
                    value={
                      analysis
                        ? shortPrediction(analysis.delay_prediction)
                        : "Generate"
                    }
                    className="bg-slate-100 text-slate-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 mt-5">
                  {metricCards.map((item) => (
                    <MetricCard
                      key={item.label}
                      icon={item.icon}
                      label={item.label}
                      value={item.value}
                    />
                  ))}
                </div>

                {analysis?.analyzed_at && (
                  <p className="text-xs text-slate-400 font-bold mt-5">
                    Last analyzed: {formatDate(analysis.analyzed_at)}
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {analysis && (
        <div className="relative z-10 grid grid-cols-1 xl:grid-cols-2 gap-5 bg-white p-6 lg:p-8">
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6">
            <div className="flex items-center justify-between gap-4 mb-5">
              <div>
                <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                  Recommended Actions
                </p>

                <h4 className="text-2xl font-black text-[#0b2a4a] mt-2">
                  What should the team do next?
                </h4>
              </div>

              <span className="material-symbols-outlined text-[#082b4f]">
                checklist
              </span>
            </div>

            <div className="space-y-3">
              {recommendations.length === 0 ? (
                <EmptyMini text="No recommendations available." />
              ) : (
                recommendations.map((item, index) => (
                  <ActionItem key={`${item}-${index}`} index={index + 1}>
                    {item}
                  </ActionItem>
                ))
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6">
            <div className="flex items-center justify-between gap-4 mb-5">
              <div>
                <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                  Bottleneck Detection
                </p>

                <h4 className="text-2xl font-black text-[#0b2a4a] mt-2">
                  Tasks slowing the project
                </h4>
              </div>

              <span className="material-symbols-outlined text-[#082b4f]">
                crisis_alert
              </span>
            </div>

            <div className="space-y-3">
              {bottlenecks.length === 0 ? (
                <EmptyMini text="No major bottlenecks detected." />
              ) : (
                bottlenecks.map((task) => (
                  <BottleneckItem key={task.task_id} task={task} />
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function MetricCard({ icon, label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
      <div className="flex items-center gap-2 text-slate-400">
        <span className="material-symbols-outlined text-[18px]">{icon}</span>
        <span className="text-[10px] font-black uppercase tracking-widest">
          {label}
        </span>
      </div>

      <p className="text-xl font-black text-[#0b2a4a] mt-3">{value}</p>
    </div>
  );
}

function StatusPill({ label, value, className }) {
  return (
    <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
        {label}
      </p>

      <span
        className={`inline-flex mt-3 px-3 py-2 rounded-xl text-[11px] font-black uppercase ${className}`}
      >
        {value}
      </span>
    </div>
  );
}

function ActionItem({ index, children }) {
  return (
    <div className="flex items-start gap-4 rounded-2xl bg-white border border-slate-100 p-4">
      <div className="w-8 h-8 rounded-xl bg-[#082b4f] text-white flex items-center justify-center text-xs font-black shrink-0">
        {index}
      </div>

      <p className="text-sm text-slate-600 font-bold leading-6">{children}</p>
    </div>
  );
}

function BottleneckItem({ task }) {
  return (
    <div className="rounded-2xl bg-white border border-slate-100 p-4">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
        <div>
          <h5 className="font-black text-[#0b2a4a] text-base">
            {task.title || "Untitled Task"}
          </h5>

          <p className="text-sm text-slate-500 mt-2 leading-6">
            {task.reason || "Potential project bottleneck detected."}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 shrink-0">
          <span className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-black uppercase">
            {formatText(task.status)}
          </span>

          <span
            className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase ${
              task.priority === "high"
                ? "bg-red-100 text-red-700"
                : task.priority === "medium"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {task.priority || "medium"}
          </span>
        </div>
      </div>

      {task.deadline && (
        <div className="flex items-center gap-2 text-xs text-slate-400 font-bold mt-4">
          <span className="material-symbols-outlined text-[16px]">event</span>
          Deadline: {formatDate(task.deadline)}
        </div>
      )}
    </div>
  );
}

function EmptyMini({ text }) {
  return (
    <div className="rounded-2xl bg-white border border-slate-100 p-6 text-center">
      <span className="material-symbols-outlined text-slate-300 text-4xl">
        verified
      </span>

      <p className="text-sm text-slate-400 font-bold mt-2">{text}</p>
    </div>
  );
}

function getRiskConfig(riskLevel) {
  if (riskLevel === "low") {
    return {
      chartColor: "#16a34a",
      badgeClass: "bg-green-100 text-green-700",
    };
  }

  if (riskLevel === "medium") {
    return {
      chartColor: "#ca8a04",
      badgeClass: "bg-yellow-100 text-yellow-700",
    };
  }

  if (riskLevel === "critical") {
    return {
      chartColor: "#7f1d1d",
      badgeClass: "bg-red-200 text-red-900",
    };
  }

  return {
    chartColor: "#dc2626",
    badgeClass: "bg-red-100 text-red-700",
  };
}

function formatText(value) {
  return String(value || "")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function shortPrediction(value) {
  if (!value) return "No Prediction";

  if (value.length <= 28) return value;

  return `${value.slice(0, 28)}...`;
}

function formatDate(value) {
  if (!value) return "Not set";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default AiAnalysisPanel;