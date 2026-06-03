import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../../context/auth-context";
import {
  getProjects,
  updateProject,
} from "../../../../services/project-service";
import EmptyState from "../../../common/empty-state";
import ErrorState from "../../../common/error-state";
import Toast from "../../../common/toast";
import useToast from "../../../../hooks/use-toast";
import LoadingState from "../../../common/loading-state";

function ProjectsTable() {
  const { user } = useAuth();

  const isAdmin = user?.role === "admin";

  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [projectsError, setProjectsError] = useState("");
  const [updatingProjectId, setUpdatingProjectId] = useState(null);

  const [sortBy, setSortBy] = useState("priority");
  const [sortOrder, setSortOrder] = useState("desc");

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const { toast, showToast, hideToast } = useToast();

  const loadProjects = async () => {
    setLoadingProjects(true);
    setProjectsError("");

    try {
      const data = await getProjects();
      setProjects(data.projects || []);
    } catch (error) {
      setProjectsError(
        error.response?.data?.message || "Failed to load projects."
      );
    } finally {
      setLoadingProjects(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const getProjectId = (project) => project.project_id || project.id;

  const getProjectName = (project) =>
    project.name || project.project_name || "Untitled Project";

  const getProjectDescription = (project) =>
    project.description || "No project description available.";

  const getClientName = (project) =>
    project.client_name || project.client || "No client";

  const getTemplateName = (project) =>
    project.template_name || project.template || "No template";

  const getCategory = (project) => project.category || "Uncategorized";

  const getDeadline = (project) => project.deadline || "Not set";

  const getStatus = (project) => project.status || "pending";

  const getPriority = (project) => project.priority || "medium";

  const formatStatus = (status) => {
    return String(status)
      .replaceAll("_", " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const formatPriority = (priority) => {
    return String(priority).toUpperCase();
  };

  const getProjectIcon = (category) => {
    const normalizedCategory = String(category).toLowerCase();

    if (normalizedCategory.includes("ai")) return "smart_toy";
    if (normalizedCategory.includes("software")) return "code";
    if (normalizedCategory.includes("web")) return "language";
    if (normalizedCategory.includes("mobile")) return "phone_android";
    if (normalizedCategory.includes("dashboard")) return "dashboard";
    if (normalizedCategory.includes("architecture")) return "architecture";
    if (normalizedCategory.includes("renovation")) return "construction";
    if (normalizedCategory.includes("urban")) return "location_city";

    return "account_tree";
  };

  const getProjectColorClasses = (category) => {
    const normalizedCategory = String(category).toLowerCase();

    if (normalizedCategory.includes("ai")) {
      return "bg-purple-50 text-purple-600";
    }

    if (normalizedCategory.includes("software")) {
      return "bg-blue-50 text-blue-600";
    }

    if (normalizedCategory.includes("web")) {
      return "bg-cyan-50 text-cyan-600";
    }

    if (normalizedCategory.includes("mobile")) {
      return "bg-emerald-50 text-emerald-600";
    }

    if (normalizedCategory.includes("dashboard")) {
      return "bg-indigo-50 text-indigo-600";
    }

    if (normalizedCategory.includes("architecture")) {
      return "bg-orange-50 text-orange-600";
    }

    return "bg-slate-100 text-slate-600";
  };

  const getStatusClass = (status) => {
    const normalizedStatus = String(status).toLowerCase();

    if (normalizedStatus === "completed") {
      return "bg-green-100 text-green-700";
    }

    if (normalizedStatus === "cancelled") {
      return "bg-red-100 text-red-700";
    }

    if (normalizedStatus === "in_progress") {
      return "bg-blue-100 text-blue-700";
    }

    return "bg-yellow-100 text-yellow-700";
  };

  const getPriorityClass = (priority) => {
    const normalizedPriority = String(priority).toLowerCase();

    if (normalizedPriority === "high") {
      return "bg-red-100 text-red-700";
    }

    if (normalizedPriority === "medium") {
      return "bg-yellow-100 text-yellow-700";
    }

    return "bg-green-100 text-green-700";
  };

  const getPrioritySelectClass = (priority) => {
    const normalizedPriority = String(priority).toLowerCase();

    if (normalizedPriority === "high") {
      return "bg-red-100 text-red-700 border-red-200";
    }

    if (normalizedPriority === "medium") {
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    }

    return "bg-green-100 text-green-700 border-green-200";
  };

  const getStatusSelectClass = (status) => {
    const normalizedStatus = String(status).toLowerCase();

    if (normalizedStatus === "completed") {
      return "bg-green-100 text-green-700 border-green-200";
    }

    if (normalizedStatus === "cancelled") {
      return "bg-red-100 text-red-700 border-red-200";
    }

    if (normalizedStatus === "in_progress") {
      return "bg-blue-100 text-blue-700 border-blue-200";
    }

    return "bg-yellow-100 text-yellow-700 border-yellow-200";
  };

  const getPriorityWeight = (priority) => {
    const normalizedPriority = String(priority).toLowerCase();

    if (normalizedPriority === "high") return 3;
    if (normalizedPriority === "medium") return 2;
    if (normalizedPriority === "low") return 1;

    return 0;
  };

  const getStatusWeight = (status) => {
    const normalizedStatus = String(status).toLowerCase();

    if (normalizedStatus === "pending") return 4;
    if (normalizedStatus === "in_progress") return 3;
    if (normalizedStatus === "completed") return 2;
    if (normalizedStatus === "cancelled") return 1;

    return 0;
  };

  const getDeadlineTime = (deadline) => {
    if (!deadline) return Number.MAX_SAFE_INTEGER;

    const date = new Date(deadline);

    if (Number.isNaN(date.getTime())) {
      return Number.MAX_SAFE_INTEGER;
    }

    return date.getTime();
  };

  const filteredProjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return projects.filter((project) => {
      const projectId = String(getProjectId(project));
      const status = getStatus(project);
      const priority = getPriority(project);

      const matchesSearch =
        !query ||
        [
          projectId,
          getProjectName(project),
          getProjectDescription(project),
          getClientName(project),
          getTemplateName(project),
          getCategory(project),
          status,
          priority,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(query);

      const matchesStatus = statusFilter === "all" || status === statusFilter;

      const matchesPriority =
        priorityFilter === "all" || priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [projects, searchQuery, statusFilter, priorityFilter]);

  const sortedProjects = useMemo(() => {
    const sortedList = [...filteredProjects];

    sortedList.sort((firstProject, secondProject) => {
      let firstValue;
      let secondValue;

      if (sortBy === "priority") {
        firstValue = getPriorityWeight(getPriority(firstProject));
        secondValue = getPriorityWeight(getPriority(secondProject));
      } else if (sortBy === "status") {
        firstValue = getStatusWeight(getStatus(firstProject));
        secondValue = getStatusWeight(getStatus(secondProject));
      } else if (sortBy === "deadline") {
        firstValue = getDeadlineTime(firstProject.deadline);
        secondValue = getDeadlineTime(secondProject.deadline);
      } else {
        firstValue = getProjectName(firstProject).toLowerCase();
        secondValue = getProjectName(secondProject).toLowerCase();
      }

      if (firstValue < secondValue) return sortOrder === "asc" ? -1 : 1;
      if (firstValue > secondValue) return sortOrder === "asc" ? 1 : -1;

      return 0;
    });

    return sortedList;
  }, [filteredProjects, sortBy, sortOrder]);

  const handleProjectUpdate = async (projectId, field, value) => {
    setUpdatingProjectId(projectId);

    try {
      await updateProject(projectId, {
        [field]: value,
      });

      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          getProjectId(project) === projectId
            ? { ...project, [field]: value }
            : project
        )
      );

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
      setUpdatingProjectId(null);
    }
  };

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setPriorityFilter("all");
  };

  const hasActiveFilters =
    searchQuery || statusFilter !== "all" || priorityFilter !== "all";

  const sortOptions = [
    {
      value: "priority",
      label: "Priority",
      icon: "priority_high",
    },
    {
      value: "status",
      label: "Status",
      icon: "fact_check",
    },
    {
      value: "deadline",
      label: "Deadline",
      icon: "event",
    },
    {
      value: "name",
      label: "Name",
      icon: "sort_by_alpha",
    },
  ];

  if (loadingProjects) {
    return <LoadingState type="table" rows={5} />;
  }

  if (projectsError) {
    return (
      <ErrorState
        title="Failed to load projects"
        message={projectsError}
        actionLabel="Try Again"
        onAction={loadProjects}
      />
    );
  }

  return (
    <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm ring-1 ring-black/5">
      <Toast type={toast.type} message={toast.message} onClose={hideToast} />

      <div className="px-6 py-5 border-b border-slate-100 space-y-5">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
          <div>
            <h3 className="font-black text-primary text-2xl">Projects</h3>

            <p className="text-sm text-slate-500 mt-1">
              Showing {sortedProjects.length} of {projects.length} projects.
              Search, filter, sort, and review project status, priority, and
              descriptions.
            </p>
          </div>

          <button
            type="button"
            onClick={loadProjects}
            className="w-fit px-5 py-3 rounded-xl bg-slate-100 text-[#082b4f] text-sm font-black hover:bg-slate-200 transition flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">
              refresh
            </span>
            Refresh
          </button>
        </div>

        <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-400 font-black">
                Sort Projects
              </p>

              <p className="text-sm text-slate-500 mt-1">
                Arrange projects by priority, status, deadline, or name.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex flex-wrap gap-2">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setSortBy(option.value)}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 ${
                      sortBy === option.value
                        ? "bg-[#082b4f] text-white shadow-sm"
                        : "bg-white text-slate-500 hover:text-[#082b4f] border border-slate-100"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[17px]">
                      {option.icon}
                    </span>
                    {option.label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() =>
                  setSortOrder((currentOrder) =>
                    currentOrder === "asc" ? "desc" : "asc"
                  )
                }
                className="px-4 py-2 rounded-xl text-xs font-black bg-white text-[#082b4f] border border-slate-100 hover:bg-slate-100 transition flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[17px]">
                  {sortOrder === "asc" ? "arrow_upward" : "arrow_downward"}
                </span>
                {sortOrder === "asc" ? "Ascending" : "Descending"}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-4">
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_190px_190px_auto] gap-4 items-end">
            <div>
              <label
                htmlFor="project-search"
                className="block text-xs uppercase tracking-widest text-slate-400 font-black mb-2"
              >
                Search Projects
              </label>

              <div className="relative">
                <input
                  id="project-search"
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search by project name, ID, client, category, status, or description..."
                  className="w-full bg-slate-100 rounded-xl px-4 py-3 pl-11 text-sm outline-none border border-transparent focus:border-[#082b4f]"
                />

                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
                  search
                </span>

                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 transition"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="status-filter"
                className="block text-xs uppercase tracking-widest text-slate-400 font-black mb-2"
              >
                Status
              </label>

              <select
                id="status-filter"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="w-full bg-slate-100 rounded-xl px-4 py-3 text-sm font-bold outline-none border border-transparent focus:border-[#082b4f]"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="priority-filter"
                className="block text-xs uppercase tracking-widest text-slate-400 font-black mb-2"
              >
                Priority
              </label>

              <select
                id="priority-filter"
                value={priorityFilter}
                onChange={(event) => setPriorityFilter(event.target.value)}
                className="w-full bg-slate-100 rounded-xl px-4 py-3 text-sm font-bold outline-none border border-transparent focus:border-[#082b4f]"
              >
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <button
              type="button"
              onClick={resetFilters}
              className="px-5 py-3 rounded-xl bg-slate-100 text-[#082b4f] text-sm font-black hover:bg-slate-200 transition flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">
                restart_alt
              </span>
              Reset
            </button>
          </div>

          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mt-4">
              {searchQuery && (
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-black">
                  Search: {searchQuery}
                </span>
              )}

              {statusFilter !== "all" && (
                <span className="px-3 py-1 rounded-full bg-yellow-50 text-yellow-700 text-xs font-black">
                  Status: {formatStatus(statusFilter)}
                </span>
              )}

              {priorityFilter !== "all" && (
                <span className="px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-black">
                  Priority: {formatPriority(priorityFilter)}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              {[
                "Project",
                "Client",
                "Category",
                "Priority",
                "Status",
                "Deadline",
                "Actions",
              ].map((item) => (
                <th
                  key={item}
                  className="px-6 py-5 text-[12px] font-black uppercase tracking-widest text-slate-400"
                >
                  {item}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50">
            {sortedProjects.length === 0 && (
              <tr>
                <td colSpan="7">
                  <EmptyState
                    icon="account_tree"
                    title="No matching projects found"
                    description={
                      hasActiveFilters
                        ? "Try changing the search text or resetting the filters."
                        : isAdmin
                        ? "Approved project requests will appear here as active projects."
                        : "Your projects will appear here after requests are approved."
                    }
                  />
                </td>
              </tr>
            )}

            {sortedProjects.map((project) => {
              const projectId = getProjectId(project);
              const projectName = getProjectName(project);
              const projectDescription = getProjectDescription(project);
              const category = getCategory(project);
              const status = getStatus(project);
              const priority = getPriority(project);
              const isUpdating = updatingProjectId === projectId;

              return (
                <tr
                  key={projectId}
                  className="hover:bg-slate-50/70 transition-colors"
                >
                  <td className="px-6 py-6 min-w-[360px]">
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${getProjectColorClasses(
                          category
                        )}`}
                      >
                        <span
                          className="material-symbols-outlined text-[25px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          {getProjectIcon(category)}
                        </span>
                      </div>

                      <div>
                        <Link
                          to={`/projects/${projectId}`}
                          className="font-black text-[#0b2a4a] hover:text-primary hover:underline text-base leading-6"
                        >
                          {projectName}
                        </Link>

                        <p className="text-xs text-slate-400 font-semibold mt-1">
                          {getTemplateName(project)} · ID: {projectId}
                        </p>

                        <p className="text-sm text-slate-500 mt-2 leading-6 max-w-xl">
                          {projectDescription}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-6 text-base font-bold text-slate-600">
                    {getClientName(project)}
                  </td>

                  <td className="px-6 py-6">
                    <span className="px-4 py-2 rounded-full text-xs font-black bg-slate-100 text-slate-600">
                      {category}
                    </span>
                  </td>

                  <td className="px-6 py-6">
                    {isAdmin ? (
                      <select
                        value={priority}
                        disabled={isUpdating}
                        onChange={(event) =>
                          handleProjectUpdate(
                            projectId,
                            "priority",
                            event.target.value
                          )
                        }
                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase outline-none border disabled:opacity-60 disabled:cursor-not-allowed ${getPrioritySelectClass(
                          priority
                        )}`}
                      >
                        <option value="low">LOW</option>
                        <option value="medium">MEDIUM</option>
                        <option value="high">HIGH</option>
                      </select>
                    ) : (
                      <span
                        className={`px-4 py-2 rounded-full text-xs font-black ${getPriorityClass(
                          priority
                        )}`}
                      >
                        {formatPriority(priority)}
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-6">
                    {isAdmin ? (
                      <select
                        value={status}
                        disabled={isUpdating}
                        onChange={(event) =>
                          handleProjectUpdate(
                            projectId,
                            "status",
                            event.target.value
                          )
                        }
                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase outline-none border disabled:opacity-60 disabled:cursor-not-allowed ${getStatusSelectClass(
                          status
                        )}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    ) : (
                      <span
                        className={`px-4 py-2 rounded-full text-xs font-black ${getStatusClass(
                          status
                        )}`}
                      >
                        {formatStatus(status)}
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-6 text-base font-bold text-slate-500">
                    {getDeadline(project)}
                  </td>

                  <td className="px-6 py-6 text-right">
                    <Link
                      to={`/projects/${projectId}`}
                      className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 hover:text-primary hover:bg-slate-200 transition-colors inline-flex items-center justify-center"
                    >
                      <span className="material-symbols-outlined">
                        more_horiz
                      </span>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="md:hidden divide-y divide-slate-100">
        {sortedProjects.length === 0 && (
          <EmptyState
            icon="account_tree"
            title="No matching projects found"
            description={
              hasActiveFilters
                ? "Try changing the search text or resetting the filters."
                : isAdmin
                ? "Approved project requests will appear here as active projects."
                : "Your projects will appear here after requests are approved."
            }
          />
        )}

        {sortedProjects.map((project) => {
          const projectId = getProjectId(project);
          const projectName = getProjectName(project);
          const projectDescription = getProjectDescription(project);
          const category = getCategory(project);
          const status = getStatus(project);
          const priority = getPriority(project);
          const isUpdating = updatingProjectId === projectId;

          return (
            <div key={projectId} className="p-5">
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${getProjectColorClasses(
                    category
                  )}`}
                >
                  <span
                    className="material-symbols-outlined text-[25px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {getProjectIcon(category)}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <Link
                    to={`/projects/${projectId}`}
                    className="block font-black text-[#0b2a4a] text-xl leading-tight"
                  >
                    {projectName}
                  </Link>

                  <p className="text-sm text-slate-400 mt-1 leading-6">
                    {getTemplateName(project)} · ID: {projectId}
                  </p>

                  <p className="text-sm text-slate-500 mt-3 leading-6">
                    {projectDescription}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="inline-flex px-3 py-1 rounded-full text-xs font-black bg-slate-100 text-slate-600">
                      {category}
                    </span>

                    {!isAdmin && (
                      <>
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-black ${getPriorityClass(
                            priority
                          )}`}
                        >
                          {formatPriority(priority)}
                        </span>

                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-black ${getStatusClass(
                            status
                          )}`}
                        >
                          {formatStatus(status)}
                        </span>
                      </>
                    )}
                  </div>

                  {isAdmin && (
                    <div className="grid grid-cols-1 gap-3 mt-4">
                      <select
                        value={priority}
                        disabled={isUpdating}
                        onChange={(event) =>
                          handleProjectUpdate(
                            projectId,
                            "priority",
                            event.target.value
                          )
                        }
                        className={`w-full px-4 py-3 rounded-xl text-xs font-black uppercase outline-none border disabled:opacity-60 disabled:cursor-not-allowed ${getPrioritySelectClass(
                          priority
                        )}`}
                      >
                        <option value="low">LOW</option>
                        <option value="medium">MEDIUM</option>
                        <option value="high">HIGH</option>
                      </select>

                      <select
                        value={status}
                        disabled={isUpdating}
                        onChange={(event) =>
                          handleProjectUpdate(
                            projectId,
                            "status",
                            event.target.value
                          )
                        }
                        className={`w-full px-4 py-3 rounded-xl text-xs font-black uppercase outline-none border disabled:opacity-60 disabled:cursor-not-allowed ${getStatusSelectClass(
                          status
                        )}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-1 mt-4 text-sm text-slate-500">
                    <p>
                      <span className="font-black text-slate-400">
                        Client:
                      </span>{" "}
                      {getClientName(project)}
                    </p>

                    <p>
                      <span className="font-black text-slate-400">
                        Deadline:
                      </span>{" "}
                      {getDeadline(project)}
                    </p>
                  </div>

                  <Link
                    to={`/projects/${projectId}`}
                    className="inline-flex mt-4 px-4 py-2 rounded-xl bg-slate-100 text-[#082b4f] text-xs font-black hover:bg-slate-200 transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProjectsTable;