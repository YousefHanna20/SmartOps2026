import { useEffect, useMemo, useState } from "react";
import { getProjects } from "../../../../services/project-service";

function SystemHealth() {
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [showAnalytics, setShowAnalytics] = useState(false);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data.projects || []);
      } catch (error) {
        console.error("Failed to load system health:", error);
      } finally {
        setLoadingProjects(false);
      }
    };

    loadProjects();

    window.addEventListener("projects-updated", loadProjects);

    return () => {
      window.removeEventListener("projects-updated", loadProjects);
    };
  }, []);

  const analytics = useMemo(() => {
    const total = projects.length;

    const countBy = (field, value) => {
      return projects.filter((project) => project[field] === value).length;
    };

    const completed = countBy("status", "completed");
    const cancelled = countBy("status", "cancelled");
    const inProgress = countBy("status", "in_progress");
    const pending = countBy("status", "pending");

    const highPriority = countBy("priority", "high");
    const mediumPriority = countBy("priority", "medium");
    const lowPriority = countBy("priority", "low");

    const categoryMap = projects.reduce((acc, project) => {
      const category = project.category || "Uncategorized";
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    const categories = Object.entries(categoryMap)
      .map(([name, count]) => ({
        name,
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);

    const upcomingDeadlines = projects
      .filter((project) => project.deadline)
      .map((project) => ({
        ...project,
        deadlineDate: new Date(project.deadline),
      }))
      .filter((project) => !Number.isNaN(project.deadlineDate.getTime()))
      .sort((a, b) => a.deadlineDate - b.deadlineDate)
      .slice(0, 4);

    const healthScore =
      total > 0
        ? Math.round(
            ((completed + inProgress * 0.7 + pending * 0.35 - cancelled * 0.4) /
              total) *
              100
          )
        : 0;

    const safeHealthScore = Math.max(0, Math.min(healthScore, 100));

    const completionRate =
      total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      cancelled,
      inProgress,
      pending,
      highPriority,
      mediumPriority,
      lowPriority,
      categories,
      upcomingDeadlines,
      healthScore: safeHealthScore,
      completionRate,
    };
  }, [projects]);

  const getHealthMessage = () => {
    if (analytics.total === 0) {
      return "No projects are available yet. System activity will appear after projects are approved.";
    }

    return `${analytics.inProgress} projects are in progress, ${analytics.completed} completed, and ${analytics.cancelled} cancelled.`;
  };

  const MetricCard = ({ label, value, note, icon }) => (
    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">
          {label}
        </p>

        <span className="material-symbols-outlined text-slate-400 text-[20px]">
          {icon}
        </span>
      </div>

      <h4 className="text-3xl font-black text-[#0b2a4a] mt-4">{value}</h4>

      <p className="text-xs text-slate-400 mt-2">{note}</p>
    </div>
  );

  const ProgressRow = ({ label, value, total, tone = "bg-[#082b4f]" }) => {
    const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

    return (
      <div>
        <div className="flex justify-between text-xs font-bold mb-2">
          <span className="text-slate-500">{label}</span>
          <span className="text-[#0b2a4a]">
            {value} / {total} · {percentage}%
          </span>
        </div>

        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${tone}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  const AnalyticsModal = () => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl border border-slate-100">
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-8 py-6 border-b border-slate-100">
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">
              Live Analytics
            </p>

            <h3 className="text-3xl font-black text-[#0b2a4a] mt-1">
              Project Performance Dashboard
            </h3>

            <p className="text-sm text-slate-500 mt-2">
              Real-time overview based on current project status, priority, and deadlines.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAnalytics(false)}
            className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 hover:bg-red-100 hover:text-red-600 transition flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <MetricCard
              label="Total Projects"
              value={analytics.total}
              note="Visible projects for this user"
              icon="account_tree"
            />

            <MetricCard
              label="Health Score"
              value={`${analytics.healthScore}%`}
              note="Weighted by active/completed work"
              icon="monitoring"
            />

            <MetricCard
              label="Completion Rate"
              value={`${analytics.completionRate}%`}
              note={`${analytics.completed} completed projects`}
              icon="task_alt"
            />

            <MetricCard
              label="High Priority"
              value={analytics.highPriority}
              note="Projects requiring attention"
              icon="priority_high"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <section className="rounded-3xl border border-slate-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="font-black text-[#0b2a4a]">
                    Status Breakdown
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Current project workflow distribution
                  </p>
                </div>

                <span className="material-symbols-outlined text-blue-500">
                  timeline
                </span>
              </div>

              <div className="space-y-5">
                <ProgressRow
                  label="Pending"
                  value={analytics.pending}
                  total={analytics.total}
                  tone="bg-yellow-500"
                />

                <ProgressRow
                  label="In Progress"
                  value={analytics.inProgress}
                  total={analytics.total}
                  tone="bg-blue-600"
                />

                <ProgressRow
                  label="Completed"
                  value={analytics.completed}
                  total={analytics.total}
                  tone="bg-green-600"
                />

                <ProgressRow
                  label="Cancelled"
                  value={analytics.cancelled}
                  total={analytics.total}
                  tone="bg-red-600"
                />
              </div>
            </section>

            <section className="rounded-3xl border border-slate-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="font-black text-[#0b2a4a]">
                    Priority Breakdown
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Workload urgency overview
                  </p>
                </div>

                <span className="material-symbols-outlined text-red-500">
                  flag
                </span>
              </div>

              <div className="space-y-5">
                <ProgressRow
                  label="High Priority"
                  value={analytics.highPriority}
                  total={analytics.total}
                  tone="bg-red-600"
                />

                <ProgressRow
                  label="Medium Priority"
                  value={analytics.mediumPriority}
                  total={analytics.total}
                  tone="bg-yellow-500"
                />

                <ProgressRow
                  label="Low Priority"
                  value={analytics.lowPriority}
                  total={analytics.total}
                  tone="bg-green-600"
                />
              </div>
            </section>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <section className="rounded-3xl border border-slate-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="font-black text-[#0b2a4a]">
                    Projects by Category
                  </h4>

                  <p className="text-xs text-slate-400 mt-1">
                    Most requested project areas
                  </p>
                </div>

                <span className="material-symbols-outlined text-purple-500">
                  category
                </span>
              </div>

              <div className="space-y-4">
                {analytics.categories.length === 0 && (
                  <p className="text-sm text-slate-400">
                    No category data available.
                  </p>
                )}

                {analytics.categories.map((category) => (
                  <div key={category.name}>
                    <div className="flex justify-between text-xs font-bold mb-2">
                      <span className="text-slate-500">{category.name}</span>
                      <span className="text-[#0b2a4a]">
                        {category.count} · {category.percentage}%
                      </span>
                    </div>

                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-600 rounded-full"
                        style={{ width: `${category.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-slate-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="font-black text-[#0b2a4a]">
                    Upcoming Deadlines
                  </h4>

                  <p className="text-xs text-slate-400 mt-1">
                    Closest project deadlines
                  </p>
                </div>

                <span className="material-symbols-outlined text-orange-500">
                  event_upcoming
                </span>
              </div>

              <div className="space-y-3">
                {analytics.upcomingDeadlines.length === 0 && (
                  <p className="text-sm text-slate-400">
                    No upcoming deadlines available.
                  </p>
                )}

                {analytics.upcomingDeadlines.map((project) => (
                  <div
                    key={project.project_id}
                    className="flex items-center justify-between gap-4 bg-slate-50 rounded-2xl p-4"
                  >
                    <div>
                      <p className="font-bold text-[#0b2a4a] text-sm">
                        {project.name}
                      </p>

                      <p className="text-xs text-slate-400 mt-1">
                        {project.category || "Uncategorized"}
                      </p>
                    </div>

                    <span className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                      {project.deadline}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="bg-primary p-10 rounded-2xl text-white relative overflow-hidden flex flex-col justify-between">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl" />

        <div className="relative z-10">
          <span className="text-[11px] font-bold uppercase tracking-widest opacity-60">
            Project Health
          </span>

          <div className="mt-8 space-y-6">
            <div className="flex items-center gap-4">
              <div className="text-4xl font-black tabular-nums">
                {loadingProjects ? "..." : `${analytics.healthScore}%`}
              </div>

              <span className="material-symbols-outlined text-emerald-400">
                trending_up
              </span>
            </div>

            <p className="text-blue-100 text-sm leading-relaxed">
              {loadingProjects ? "Loading project health..." : getHealthMessage()}
            </p>

            {!loadingProjects && (
              <div className="grid grid-cols-3 gap-3 pt-4">
                <div className="bg-white/10 rounded-xl p-3">
                  <p className="text-[10px] uppercase opacity-60">Active</p>
                  <p className="text-lg font-black">{analytics.inProgress}</p>
                </div>

                <div className="bg-white/10 rounded-xl p-3">
                  <p className="text-[10px] uppercase opacity-60">Done</p>
                  <p className="text-lg font-black">{analytics.completed}</p>
                </div>

                <div className="bg-white/10 rounded-xl p-3">
                  <p className="text-[10px] uppercase opacity-60">High</p>
                  <p className="text-lg font-black">{analytics.highPriority}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="relative z-10 pt-8 mt-8 border-t border-white/10">
          <button
            type="button"
            onClick={() => setShowAnalytics(true)}
            className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
          >
            View Analytics

            <span className="material-symbols-outlined text-sm">
              arrow_forward
            </span>
          </button>
        </div>
      </div>

      {showAnalytics && <AnalyticsModal />}
    </>
  );
}

export default SystemHealth;