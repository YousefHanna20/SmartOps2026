import AppShell from "../components/layout/app-shell";
import ProjectRequestContent from "../components/project-request/project-request-content";

function ProjectRequest() {
  return (
    <AppShell activePage="Requests">
      <ProjectRequestContent />
    </AppShell>
  );
}

export default ProjectRequest;