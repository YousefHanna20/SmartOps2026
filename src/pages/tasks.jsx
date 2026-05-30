import AppShell from "../components/layout/app-shell";
import TasksPageContent from "../components/dashboard/tasks/tasks-page-content";

function Tasks() {
  return (
    <AppShell activePage="Tasks">
      <TasksPageContent />
    </AppShell>
  );
}

export default Tasks;