import AppShell from "../components/layout/app-shell";
import ProjectRequestContent from "../components/dashboard/project-request/project-request-content";

function ProjectRequest() {
  return (
    <AppShell activePage="Requests">
      <ProjectRequestContent />
    </AppShell>
  );
}

export default ProjectRequest;