import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AppShell from "../components/layout/app-shell";
import ProjectSummary from "../components/dashboard/projects/project-details/project-summary";
import ActiveTasks from "../components/dashboard/projects/project-details/active-tasks";
import ProjectSideInfo from "../components/dashboard/projects/project-details/project-side-info";

import { getProjectById, updateProject } from "../services/project-service";
import { useAuth } from "../context/auth-context";
import ErrorState from "../components/common/error-state";
import LoadingState from "../components/common/loading-state";
import Toast from "../components/common/toast";
import useToast from "../hooks/use-toast";

function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const isAdmin = user?.role === "admin";

  const [project, setProject] = useState(null);
  const [loadingProject, setLoadingProject] = useState(true);
  const [projectError, setProjectError] = useState("");
  const [updatingProject, setUpdatingProject] = useState(false);

  const { toast, showToast, hideToast } = useToast();

  useEffect(() => {
    const loadProject = async () => {
      setLoadingProject(true);
      setProjectError("");

      try {
        const data = await getProjectById(id);
        setProject(data.project);
      } catch (error) {
        setProjectError(
          error.response?.data?.message || "Failed to load project details."
        );
      } finally {
        setLoadingProject(false);
      }
    };

    loadProject();
  }, [id]);

  const formatStatus = (status) => {
    return String(status || "")
      .replaceAll("_", " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const formatPriority = (priority) => {
    return String(priority || "").toUpperCase();
  };

  const handleProjectUpdate = async (field, value) => {
    if (!project) return;

    setUpdatingProject(true);

    try {
      await updateProject(project.project_id, {
        [field]: value,
      });

      setProject((prevProject) => ({
        ...prevProject,
        [field]: value,
      }));

      window.dispatchEvent(new Event("projects-updated"));

      showToast(
        "success",
        field === "status"
          ? `Project status updated to ${formatStatus(value)}.`
          : `Project priority updated to ${formatPriority(value)}.`
      );
    } catch (error) {
      showToast(
        "error",
        error.response?.data?.message || `Failed to update ${field}.`
      );
    } finally {
      setUpdatingProject(false);
    }
  };

  if (loadingProject) {
    return (
      <AppShell activePage="Projects">
        <LoadingState type="details" />
      </AppShell>
    );
  }

  if (projectError) {
    return (
      <AppShell activePage="Projects">
        <ErrorState
          title="Failed to load project details"
          message={projectError}
          actionLabel="Back to Projects"
          onAction={() => navigate("/projects")}
        />
      </AppShell>
    );
  }

  if (!project) {
    return (
      <AppShell activePage="Projects">
        <ErrorState
          icon="search_off"
          title="Project not found"
          message="We could not find this project. It may have been removed or you may not have access to it."
          actionLabel="Back to Projects"
          onAction={() => navigate("/projects")}
        />
      </AppShell>
    );
  }

  const canAssignTask =
    isAdmin &&
    project.status !== "completed" &&
    project.status !== "cancelled";

  return (
    <AppShell activePage="Projects">
      <Toast type={toast.type} message={toast.message} onClose={hideToast} />

      <div className="space-y-8">
        <section>
          <div className="mb-8">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
              Project ID: {project.project_id}
            </p>

            <h2 className="text-4xl font-black text-blue-900 tracking-tight mt-2">
              {project.name}
            </h2>

            <p className="text-base text-slate-500 mt-4 max-w-4xl leading-7">
              {project.description || "No project description available."}
            </p>

            {isAdmin && (
              <div className="flex flex-wrap gap-3 mt-6">
                {canAssignTask ? (
                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/tasks/assign?projectId=${project.project_id}`)
                    }
                    className="px-5 py-3 rounded-xl bg-[#082b4f] text-white text-sm font-black hover:opacity-90 transition flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      add_task
                    </span>
                    Assign Task
                  </button>
                ) : (
                  <div className="px-5 py-3 rounded-xl bg-slate-100 text-slate-500 text-sm font-black flex items-center gap-2 cursor-not-allowed">
                    <span className="material-symbols-outlined text-[18px]">
                      lock
                    </span>
                    Task assignment locked
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => navigate("/projects")}
                  className="px-5 py-3 rounded-xl bg-slate-100 text-[#082b4f] text-sm font-black hover:bg-slate-200 transition flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    arrow_back
                  </span>
                  Back to Projects
                </button>
              </div>
            )}
          </div>

          <ProjectSummary
            project={project}
            canEdit={isAdmin}
            isUpdating={updatingProject}
            onProjectUpdate={handleProjectUpdate}
          />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <ActiveTasks projectId={project.project_id} />
          <ProjectSideInfo project={project} />
        </section>
      </div>
    </AppShell>
  );
}

export default ProjectDetails;