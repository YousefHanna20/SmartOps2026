import AppShell from "../components/layout/app-shell";
import ProjectSummary from "../components/project-details/project-summary";
import ActiveTasks from "../components/project-details/active-tasks";
import ProjectSideInfo from "../components/project-details/project-side-info";
import ProjectFab from "../components/project-details/project-fab";

function ProjectDetails() {
  return (
    <AppShell activePage="Projects">
      <div className="space-y-8">
        <section>
          <div className="mb-8">
            <h2 className="text-3xl font-black text-blue-900 tracking-tighter">
              Project Alpha Zenith
            </h2>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
              Project ID: SO-2024-082
            </p>
          </div>

          <ProjectSummary />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <ActiveTasks />
          <ProjectSideInfo />
        </section>
      </div>

      <ProjectFab />
    </AppShell>
  );
}

export default ProjectDetails;