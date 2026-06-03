import AppShell from "../components/layout/app-shell";
import AssignTaskForm from "../components/dashboard/tasks/assign-task-form";

function AssignTask() {
  return (
    <AppShell activePage="Tasks">
      <AssignTaskForm />
    </AppShell>
  );
}

export default AssignTask;