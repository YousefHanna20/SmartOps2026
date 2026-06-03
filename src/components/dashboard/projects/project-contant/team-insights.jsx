import { useEffect, useMemo, useState } from "react";
import SprintCard from "./sprint-card";
import { getProjects } from "../../../../services/project-service";
import LoadingState from "../../../common/loading-state";

function TeamInsights() {
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data.projects || []);
      } catch (error) {
        console.error("Failed to load project insights:", error);
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

  const stats = useMemo(() => {
    const total = projects.length;

    const inProgress = projects.filter(
      (project) => project.status === "in_progress"
    ).length;

    const completed = projects.filter(
      (project) => project.status === "completed"
    ).length;

    const highPriority = projects.filter(
      (project) => project.priority === "high"
    ).length;

    const inProgressPercent =
      total > 0 ? `${Math.round((inProgress / total) * 100)}%` : "0%";

    const completedPercent =
      total > 0 ? `${Math.round((completed / total) * 100)}%` : "0%";

    return {
      total,
      inProgress,
      completed,
      highPriority,
      inProgressPercent,
      completedPercent,
    };
  }, [projects]);

  if (loadingProjects) {
  return (
     <div className="lg:col-span-2">
       <LoadingState type="card" title="Loading project insights..." />
     </div>
     );
  }

  return (
    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
      <SprintCard
        title="Projects In Progress"
        description={`${stats.inProgress} out of ${stats.total} projects are currently active and being worked on.`}
        progress={stats.inProgressPercent}
        tag="Active Work"
        icon="analytics"
      />

      <SprintCard
        title="Completed Projects"
        description={`${stats.completed} projects have been completed. ${stats.highPriority} projects are marked as high priority.`}
        progress={stats.completedPercent}
        tag="Delivery Status"
        icon="task_alt"
      />
    </div>
  );
}

export default TeamInsights;