import AppShell from "../components/layout/app-shell";

import ProjectsHeader from "../components/projects/projects-header";
import ProjectsTable from "../components/projects/projects-table";
import TeamInsights from "../components/projects/team-insights";
import SystemHealth from "../components/projects/system-health";

function Projects() {
  return (
    <AppShell activePage="Projects">
      <div className="space-y-12">
        <section>
          <ProjectsHeader />
          <ProjectsTable />
        </section>

        <section className="space-y-8">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-primary">
              Team Insights
            </h2>

            <p className="text-slate-500">
              Detailed overview for employees & stakeholders
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <TeamInsights />
            <SystemHealth />
          </div>
        </section>
      </div>
    </AppShell>
  );
}

export default Projects;