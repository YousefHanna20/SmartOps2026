import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/auth-context";
import {
  getTasks,
  updateTaskStatus,
  deleteTask,
} from "../../../services/task-service";
import EmptyState from "../../common/empty-state";
import Toast from "../../common/toast";
import ConfirmModal from "../../common/confirm-modal";
import ErrorState from "../../common/error-state";
import LoadingState from "../../common/loading-state";
import useToast from "../../../hooks/use-toast";

function TasksPageContent() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const role = user?.role;
  const isAdmin = role === "admin";
  const isEmployee = role === "employee";

  const [viewMode, setViewMode] = useState("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPriorities, setSelectedPriorities] = useState([
    "high",
    "medium",
    "low",
  ]);

  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [tasksError, setTasksError] = useState("");
  const [updatingTaskId, setUpdatingTaskId] = useState(null);
  const [deletingTaskId, setDeletingTaskId] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const { toast, showToast, hideToast } = useToast();

  const loadTasks = async () => {
    setLoadingTasks(true);
    setTasksError("");

    try {
      const data = await getTasks();
      setTasks(data.tasks || []);
    } catch (error) {
      setTasksError(error.response?.data?.message || "Failed to load tasks.");
    } finally {
      setLoadingTasks(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const getTaskId = (task) => task.task_id || task.id;

  const getTaskTitle = (task) => task.title || "Untitled Task";

  const getTaskDescription = (task) =>
    task.description || "No task description available.";

  const getProjectName = (task) =>
    task.project_name || task.project || "No project";

  const getAssigneeName = (task) =>
    task.assigned_user_name || task.employee_name || "Unassigned";

  const getPriority = (task) => task.priority || "medium";

  const getStatus = (task) => task.status || "pending";

  const formatStatus = (status) => {
    return String(status)
      .replaceAll("_", " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const formatPriority = (priority) => {
    return String(priority).toUpperCase();
  };

  const priorityStyles = {
    high: "bg-red-100 text-red-700",
    medium: "bg-yellow-100 text-yellow-700",
    low: "bg-green-100 text-green-700",
  };

  const statusStyles = {
    pending: "bg-slate-100 text-slate-600",
    in_progress: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
  };

  const columns = [
    { key: "pending", label: "Pending" },
    { key: "in_progress", label: "In Progress" },
    { key: "completed", label: "Completed" },
  ];

  const filteredTasks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return tasks.filter((task) => {
      const status = getStatus(task);
      const priority = getPriority(task);

      const matchesSearch =
        !query ||
        [
          getTaskId(task),
          getTaskTitle(task),
          getTaskDescription(task),
          getProjectName(task),
          getAssigneeName(task),
          status,
          priority,
          task.deadline,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(query);

      const matchesStatus = statusFilter === "all" || status === statusFilter;

      const matchesPriority = selectedPriorities.includes(priority);

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, searchQuery, statusFilter, selectedPriorities]);

  const stats = useMemo(() => {
    const total = tasks.length;

    const completed = tasks.filter(
      (task) => getStatus(task) === "completed"
    ).length;

    const pending = tasks.filter(
      (task) => getStatus(task) === "pending"
    ).length;

    const inProgress = tasks.filter(
      (task) => getStatus(task) === "in_progress"
    ).length;

    const highPriority = tasks.filter(
      (task) => getPriority(task) === "high"
    ).length;

    const completionRate =
      total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      pending,
      inProgress,
      highPriority,
      completionRate,
    };
  }, [tasks]);

  const handlePriorityFilter = (priority) => {
    if (selectedPriorities.includes(priority)) {
      setSelectedPriorities(
        selectedPriorities.filter((item) => item !== priority)
      );
    } else {
      setSelectedPriorities([...selectedPriorities, priority]);
    }
  };

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setSelectedPriorities(["high", "medium", "low"]);
  };

  const hasActiveFilters =
    searchQuery ||
    statusFilter !== "all" ||
    selectedPriorities.length !== 3;

  const handleStatusChange = async (taskId, newStatus) => {
    setUpdatingTaskId(taskId);

    try {
      await updateTaskStatus(taskId, newStatus);

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          getTaskId(task) === taskId ? { ...task, status: newStatus } : task
        )
      );

      window.dispatchEvent(new Event("tasks-updated"));

      showToast("success", `Task status updated to ${formatStatus(newStatus)}.`);
    } catch (error) {
      showToast(
        "error",
        error.response?.data?.message || "Failed to update task status."
      );
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const openDeleteTaskModal = (task) => {
    setTaskToDelete(task);
  };

  const closeDeleteTaskModal = () => {
    if (deletingTaskId) return;
    setTaskToDelete(null);
  };

  const confirmDeleteTask = async () => {
    if (!taskToDelete) return;

    const taskId = getTaskId(taskToDelete);

    setDeletingTaskId(taskId);

    try {
      await deleteTask(taskId);

      setTasks((prevTasks) =>
        prevTasks.filter((item) => getTaskId(item) !== taskId)
      );

      window.dispatchEvent(new Event("tasks-updated"));

      showToast("success", "Task deleted successfully.");
      setTaskToDelete(null);
    } catch (error) {
      showToast(
        "error",
        error.response?.data?.message || "Failed to delete task."
      );
    } finally {
      setDeletingTaskId(null);
    }
  };

  const canUpdateStatus = isAdmin || isEmployee;

  if (loadingTasks) {
    return <LoadingState type="table" rows={5} />;
  }

  if (tasksError) {
    return (
      <ErrorState
        title="Failed to load tasks"
        message={tasksError}
        actionLabel="Try Again"
        onAction={loadTasks}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6">
      <Toast type={toast.type} message={toast.message} onClose={hideToast} />

      <ConfirmModal
        isOpen={!!taskToDelete}
        title="Delete task?"
        description={
          taskToDelete
            ? `Are you sure you want to delete "${getTaskTitle(
                taskToDelete
              )}"? This action cannot be undone.`
            : ""
        }
        confirmLabel="Delete Task"
        cancelLabel="Cancel"
        type="danger"
        loading={!!deletingTaskId}
        onConfirm={confirmDeleteTask}
        onCancel={closeDeleteTaskModal}
      />

      <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
        <h2 className="text-4xl font-black text-[#0b2a4a] tracking-tight">
          Tasks Overview
        </h2>

        <p className="text-base text-slate-500 mt-3 leading-7">
          Showing{" "}
          <span className="font-black text-[#0b2a4a]">
            {filteredTasks.length}
          </span>{" "}
          of{" "}
          <span className="font-black text-[#0b2a4a]">{stats.total}</span>{" "}
          tasks.
          <span className="text-[#0b2a4a] font-black">
            {" "}
            {stats.highPriority} high priority.
          </span>
        </p>

        <div className="flex flex-wrap gap-4 mt-7">
          {isAdmin && (
            <button
              type="button"
              onClick={() => navigate("/tasks/assign")}
              className="hover:opacity-90 transition bg-[#082b4f] text-white px-6 py-3 rounded-xl text-sm font-black shadow flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">
                add_task
              </span>
              Assign Task
            </button>
          )}

          {isAdmin && (
            <button
              type="button"
              onClick={() => navigate("/tasks/export-report")}
              className="hover:opacity-80 transition bg-slate-200 text-slate-700 px-6 py-3 rounded-xl text-sm font-black flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">
                description
              </span>
              Export Report
            </button>
          )}

          <button
            type="button"
            onClick={loadTasks}
            className="hover:opacity-80 transition bg-slate-100 text-[#082b4f] px-6 py-3 rounded-xl text-sm font-black flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">
              refresh
            </span>
            Refresh
          </button>
        </div>
      </section>

      <section className="bg-[#082b4f] text-white rounded-2xl p-8 shadow-sm">
        <p className="text-xs tracking-widest uppercase text-blue-200 font-black">
          Completion Rate
        </p>

        <h2 className="text-5xl font-black mt-4">{stats.completionRate}%</h2>

        <div className="w-full h-3 bg-white/20 rounded-full mt-5">
          <div
            className="h-full bg-green-400 rounded-full"
            style={{ width: `${stats.completionRate}%` }}
          />
        </div>

        <p className="text-sm text-blue-100 mt-4 leading-6">
          {stats.completed} completed out of {stats.total} tasks
        </p>
      </section>

      <section className="xl:col-span-2 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
        <aside className="space-y-6">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <p className="text-xs uppercase tracking-widest text-slate-400 font-black mb-4">
              View Mode
            </p>

            <div className="bg-slate-100 rounded-xl p-1 grid grid-cols-2 text-xs font-black">
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`rounded-lg py-3 transition ${
                  viewMode === "list"
                    ? "bg-white text-[#0b2a4a] shadow-sm"
                    : "text-slate-500"
                }`}
              >
                List
              </button>

              <button
                type="button"
                onClick={() => setViewMode("kanban")}
                className={`rounded-lg py-3 transition ${
                  viewMode === "kanban"
                    ? "bg-white text-[#0b2a4a] shadow-sm"
                    : "text-slate-500"
                }`}
              >
                Kanban
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <p className="text-xs uppercase tracking-widest text-slate-400 font-black mb-4">
              Search & Status
            </p>

            <label
              htmlFor="task-search"
              className="block text-xs uppercase tracking-widest text-slate-400 font-black mb-2"
            >
              Search Tasks
            </label>

            <div className="relative">
              <input
                id="task-search"
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Title, project, employee..."
                className="w-full bg-slate-100 rounded-xl px-4 py-3 pl-10 text-sm outline-none border border-transparent focus:border-[#082b4f]"
              />

              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
                search
              </span>

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500"
                >
                  ✕
                </button>
              )}
            </div>

            <label
              htmlFor="task-status-filter"
              className="block text-xs uppercase tracking-widest text-slate-400 font-black mt-4 mb-2"
            >
              Status
            </label>

            <select
              id="task-status-filter"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="w-full bg-slate-100 rounded-xl px-4 py-3 text-sm font-bold outline-none border border-transparent focus:border-[#082b4f]"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="mt-4 w-full px-4 py-3 rounded-xl bg-slate-100 text-[#082b4f] text-sm font-black hover:bg-slate-200 transition flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">
                  restart_alt
                </span>
                Reset Filters
              </button>
            )}
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <p className="text-xs uppercase tracking-widest text-slate-400 font-black mb-4">
              Priority Filter
            </p>

            {["high", "medium", "low"].map((priority) => (
              <label
                key={priority}
                className="flex items-center gap-3 mb-4 text-sm cursor-pointer last:mb-0"
              >
                <input
                  type="checkbox"
                  checked={selectedPriorities.includes(priority)}
                  onChange={() => handlePriorityFilter(priority)}
                  className="w-4 h-4"
                />

                <span
                  className={`px-3 py-1 rounded-full text-xs font-black ${
                    priorityStyles[priority]
                  }`}
                >
                  {formatPriority(priority)}
                </span>
              </label>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <p className="font-black text-base text-[#0b2a4a]">
              Task Activity
            </p>

            <p className="text-sm text-slate-500 mt-3 leading-6">
              {stats.inProgress} in progress, {stats.pending} pending
            </p>
          </div>
        </aside>

        {viewMode === "list" ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="hidden md:grid grid-cols-[1fr_170px_130px_160px_90px] px-6 py-5 text-[12px] uppercase tracking-widest text-slate-400 font-black border-b">
              <p>Task Title</p>
              <p>Assigned To</p>
              <p>Priority</p>
              <p>Status</p>
              <p></p>
            </div>

            {filteredTasks.length === 0 && (
              <EmptyState
                icon="task_alt"
                title="No matching tasks found"
                description={
                  hasActiveFilters
                    ? "Try changing the search text or resetting the filters."
                    : isAdmin
                    ? "Once you assign tasks to employees, they will appear here."
                    : "Your assigned tasks will appear here once an admin assigns them."
                }
                actionLabel={isAdmin ? "Assign First Task" : undefined}
                onAction={isAdmin ? () => navigate("/tasks/assign") : undefined}
              />
            )}

            {filteredTasks.map((task) => {
              const taskId = getTaskId(task);
              const priority = getPriority(task);
              const status = getStatus(task);
              const isUpdating = updatingTaskId === taskId;
              const isDeleting = deletingTaskId === taskId;

              return (
                <div
                  key={taskId}
                  className="grid grid-cols-1 md:grid-cols-[1fr_170px_130px_160px_90px] gap-4 md:gap-0 items-center px-6 py-6 border-b last:border-b-0 hover:bg-slate-50/70 transition"
                >
                  <div>
                    <p className="font-black text-[#0b2a4a] text-lg leading-6">
                      {getTaskTitle(task)}
                    </p>

                    <p className="text-sm text-slate-500 mt-2 leading-6">
                      Project:{" "}
                      <span className="font-bold">
                        {getProjectName(task)}
                      </span>
                    </p>

                    <p className="text-sm text-slate-400 mt-2 leading-6 line-clamp-2 max-w-2xl">
                      {getTaskDescription(task)}
                    </p>
                  </div>

                  <p className="text-sm text-slate-600 font-black">
                    {getAssigneeName(task)}
                  </p>

                  <span
                    className={`text-xs font-black uppercase px-4 py-2 rounded-full w-fit ${
                      priorityStyles[priority]
                    }`}
                  >
                    {formatPriority(priority)}
                  </span>

                  {canUpdateStatus ? (
                    <select
                      value={status}
                      disabled={isUpdating || isDeleting}
                      onChange={(event) =>
                        handleStatusChange(taskId, event.target.value)
                      }
                      className={`text-xs font-black px-4 py-2 rounded-xl outline-none disabled:opacity-60 border border-transparent ${
                        statusStyles[status]
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  ) : (
                    <span
                      className={`text-xs font-black px-4 py-2 rounded-full w-fit ${
                        statusStyles[status]
                      }`}
                    >
                      {formatStatus(status)}
                    </span>
                  )}

                  <div className="flex justify-end">
                    {isAdmin ? (
                      <button
                        type="button"
                        onClick={() => openDeleteTaskModal(task)}
                        disabled={isDeleting || isUpdating}
                        className="w-10 h-10 rounded-xl bg-red-50 text-red-400 hover:text-red-600 hover:bg-red-100 disabled:opacity-60 flex items-center justify-center transition"
                      >
                        <span className="material-symbols-outlined">
                          delete
                        </span>
                      </button>
                    ) : (
                      <span className="material-symbols-outlined text-slate-300">
                        more_vert
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {columns.map((column) => {
              const columnTasks = filteredTasks.filter(
                (task) => getStatus(task) === column.key
              );

              return (
                <div
                  key={column.key}
                  className="bg-slate-100 rounded-2xl p-4 min-h-[380px]"
                >
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-black text-[#0b2a4a] text-xl">
                      {column.label}
                    </h3>

                    <span className="text-xs bg-white px-3 py-1 rounded-full text-slate-500 font-black">
                      {columnTasks.length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {columnTasks.length === 0 && (
                      <div className="bg-white/70 rounded-xl p-6 text-center border border-slate-100">
                        <span className="material-symbols-outlined text-slate-300 text-4xl">
                          inbox
                        </span>

                        <p className="text-sm text-slate-400 mt-3">
                          No tasks in this column.
                        </p>
                      </div>
                    )}

                    {columnTasks.map((task) => {
                      const taskId = getTaskId(task);
                      const priority = getPriority(task);
                      const status = getStatus(task);
                      const isUpdating = updatingTaskId === taskId;

                      return (
                        <div
                          key={taskId}
                          className="bg-white rounded-xl p-5 shadow-sm border border-slate-100"
                        >
                          <span
                            className={`text-xs font-black uppercase px-4 py-2 rounded-full ${
                              priorityStyles[priority]
                            }`}
                          >
                            {formatPriority(priority)}
                          </span>

                          <h4 className="font-black text-[#0b2a4a] text-lg mt-4 leading-6">
                            {getTaskTitle(task)}
                          </h4>

                          <p className="text-sm text-slate-500 mt-3 leading-6">
                            Project:{" "}
                            <span className="font-bold">
                              {getProjectName(task)}
                            </span>
                          </p>

                          <p className="text-sm text-slate-400 mt-1 leading-6">
                            Assigned: {getAssigneeName(task)}
                          </p>

                          <p className="text-sm text-slate-400 mt-3 leading-6 line-clamp-3">
                            {getTaskDescription(task)}
                          </p>

                          {canUpdateStatus && (
                            <select
                              value={status}
                              disabled={isUpdating}
                              onChange={(event) =>
                                handleStatusChange(taskId, event.target.value)
                              }
                              className={`mt-5 w-full text-xs font-black px-4 py-3 rounded-xl outline-none disabled:opacity-60 ${
                                statusStyles[status]
                              }`}
                            >
                              <option value="pending">Pending</option>
                              <option value="in_progress">In Progress</option>
                              <option value="completed">Completed</option>
                            </select>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default TasksPageContent;