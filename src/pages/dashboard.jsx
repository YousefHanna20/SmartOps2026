import AppShell from "../components/layout/app-shell";
import WelcomeSection from "../components/dashboard/dashboard-contant/welcome-section";
import StatsGrid from "../components/dashboard/dashboard-contant/stats-grid";
import AiInsights from "../components/dashboard/dashboard-contant/ai-insights";
import RecentActivity from "../components/dashboard/dashboard-contant/recent-activity";
import ProjectSpotlight from "../components/dashboard/dashboard-contant/project-spotlight";
import UpcomingDeadlines from "../components/dashboard/dashboard-contant/upcoming-deadlines";

function Dashboard() {
  return (
    <AppShell activePage="Dashboard">
      <div className="space-y-8">
        <WelcomeSection />
        <StatsGrid />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <AiInsights />
            <RecentActivity />
          </div>

          <div className="space-y-8">
            <ProjectSpotlight />
            <UpcomingDeadlines />
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export default Dashboard;