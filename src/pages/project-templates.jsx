import AppShell from "../components/layout/app-shell";
import ProjectTemplatesContent from "../components/dashboard/project-templates/project-templates-content";

function ProjectTemplates() {
  return (
    <AppShell activePage="Templates">
      <ProjectTemplatesContent />
    </AppShell>
  );
}

export default ProjectTemplates;