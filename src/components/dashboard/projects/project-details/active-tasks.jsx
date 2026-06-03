import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../context/auth-context";
import { getTasks, updateTaskStatus } from "../../../../services/task-service";
import EmptyState from "../../../common/empty-state";
import ErrorState from "../../../common/error-state";
import Toast from "../../../common/toast";
import LoadingState from "../../../common/loading-state";
import useToast from "../../../../hooks/use-toast";

function ActiveTasks({ projectId }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const isAdmin = user?.role === "admin";
  const isEmployee = user?.role === "employee";
  const isClient = user?.role === "client";

  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [tasksError, setTasksError] = useState("");
  const [updatingTaskId, setUpdatingTaskId] = useState(null);

  const { toast, showToast, hideToast } = useToast();

  const loadTasks = async () => {
    if (isClient) {
      setLoadingTasks(false);
      return;
    }

    setLoadingTasks(true);
    setTasksError("");

    try {
      const data = await getTasks();
      setTasks(data.tasks || []);
    } catch (error) {
      setTasksError(
        error.response?.data?.message || "Failed to load project tasks."
      );
    } finally {
      setLoadingTasks(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [isClient]);

  const projectTasks = useMemo(() => {
    return tasks.filter((task) => Number(task.project_id) === Number(projectId));
  }, [tasks, projectId]);

  const getTaskId = (task) => task.task_id || task.id;

  const getTaskTitle = (task) => task.title || "Untitled Task";

  const getTaskDescription = (task) =>
    task.description || "No task description available.";

  const getAssigneeName = (task) =>
    task.assigned_user_name || task.employee_name || "Unassigned";

  const getStatus = (task) => task.status || "pending";

  const getPriority = (task) => task.priority || "medium";

  const getDeadline = (task) => task.deadline || "Not set";

  const getTaskIcon = (priority) => {
    if (priority === "high") return "priority_high";
    if (priority === "medium") return "pending_actions";

    return "task_alt";
  };

  const formatStatus = (status) => {
    return String(status || "pending")
      .replaceAll("_", " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const formatPriority = (priority) => {
    return String(priority || "medium").toUpperCase();
  };

  const getPriorityClass = (priority) => {
    if (priority === "high") return "bg-red-100 text-red-700";
    if (priority === "medium") return "bg-yellow-100 text-yellow-700";

    return "bg-green-100 text-green-700";
  };

  const getStatusClass = (status) => {
    if (status === "completed") {
      return "bg-green-100 text-green-700";
    }

    if (status === "in_progress") {
      return "bg-blue-100 text-blue-700";
    }

    return "bg-yellow-100 text-yellow-700";
  };

  const handleStatusChange = async (taskId, status) => {
    setUpdatingTaskId(taskId);

    try {
      await updateTaskStatus(taskId, status);

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          getTaskId(task) === taskId ? { ...task, status } : task
        )
      );

      window.dispatchEvent(new Event("tasks-updated"));

      showToast("success", `Task status updated to ${formatStatus(status)}.`);
    } catch (error) {
      showToast(
        "error",
        error.response?.data?.message || "Failed to update task status."
      );
    } finally {
      setUpdatingTaskId(null);
    }
  };

  if (isClient) {
    return (
      <div className="lg:col-span-2 space-y-6">
        <div className="flex justify-between items-end px-2">
          <div>
            <h4 className="text-3xl font-black text-blue-900 tracking-tight">
              Project Progress
            </h4>

            <p className="text-base text-slate-500 mt-2 leading-7">
              Follow your project updates and delivery progress.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[#082b4f] text-4xl">
                insights
              </span>
            </div>

            <div>
              <h3 className="text-2xl font-black text-[#0b2a4a]">
                Your project is being handled by the SmartOps team
              </h3>

              <p className="text-base text-slate-500 mt-3 leading-7">
                Internal tasks are managed by admins and employees. You can
                track the project status, priority, deadline, and updates from
                this page without seeing internal task operations.
              </p>

              <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-5">
                <span className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-black uppercase tracking-widest">
                  Secure Client View
                </span>

                <span className="px-4 py-2 rounded-xl bg-blue-50 text-blue-700 text-xs font-black uppercase tracking-widest">
                  Progress Tracking
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loadingTasks) {
    return (
      <div className="lg:col-span-2">
        <LoadingState type="card" title="Loading project tasks..." />
      </div>
    );
  }

  if (tasksError) {
    return (
      <div className="lg:col-span-2">
        <ErrorState
          icon="error"
          title="Failed to load project tasks"
          message={tasksError}
          actionLabel="Try Again"
          onAction={loadTasks}
        />
      </div>
    );
  }

  return (
    <div className="lg:col-span-2 space-y-6">
      <Toast type={toast.type} message={toast.message} onClose={hideToast} />

      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 px-2">
        <div>
          <h4 className="text-3xl font-black text-blue-900 tracking-tight">
            Active Tasks
          </h4>

          <p className="text-base text-slate-500 mt-2 leading-7">
            Managing{" "}
            <span className="font-black text-[#0b2a4a]">
              {projectTasks.length}
            </span>{" "}
            project {projectTasks.length === 1 ? "deliverable" : "deliverables"}.
          </p>
        </div>

        <button
          type="button"
          onClick={loadTasks}
          className="w-fit px-5 py-3 rounded-xl bg-slate-100 text-[#082b4f] font-black text-sm flex items-center gap-2 hover:bg-slate-200 transition"
        >
          <span className="material-symbols-outlined text-[18px]">refresh</span>
          Refresh
        </button>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
        {projectTasks.length === 0 && (
          <EmptyState
            icon="assignment"
            title="No tasks for this project"
            description={
              isAdmin
                ? "Assign tasks to employees so this project can start moving forward."
                : "Tasks assigned to this project will appear here."
            }
            actionLabel={isAdmin ? "Assign Task" : undefined}
            onAction={
              isAdmin
                ? () => navigate(`/tasks/assign?projectId=${projectId}`)
                : undefined
            }
          />
        )}

        {projectTasks.map((task) => (
          <TaskItem
            key={getTaskId(task)}
            taskId={getTaskId(task)}
            title={getTaskTitle(task)}
            description={getTaskDescription(task)}
            assignee={getAssigneeName(task)}
            status={getStatus(task)}
            priority={getPriority(task)}
            deadline={getDeadline(task)}
            icon={getTaskIcon(getPriority(task))}
            isAdmin={isAdmin}
            isEmployee={isEmployee}
            isUpdating={updatingTaskId === getTaskId(task)}
            onStatusChange={handleStatusChange}
            formatStatus={formatStatus}
            formatPriority={formatPriority}
            getStatusClass={getStatusClass}
            getPriorityClass={getPriorityClass}
          />
        ))}
      </div>
    </div>
  );
}

function TaskItem({
  taskId,
  title,
  description,
  assignee,
  status,
  priority,
  deadline,
  icon,
  isAdmin,
  isEmployee,
  isUpdating,
  onStatusChange,
  formatStatus,
  formatPriority,
  getStatusClass,
  getPriorityClass,
}) {
  const canUpdateStatus = isAdmin || isEmployee;

  return (
    <div className="p-6 hover:bg-slate-50/80 transition-colors border-t first:border-t-0 border-slate-100">
      <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-5">
        <div className="flex items-start gap-5 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-blue-900 text-[26px]">
              {icon}
            </span>
          </div>

          <div className="min-w-0">
            <h5 className="font-black text-[#0b2a4a] text-xl leading-7">
              {title}
            </h5>

            <p className="text-base text-slate-500 mt-3 leading-8 max-w-4xl">
              {description}
            </p>

            <div className="flex flex-wrap gap-3 mt-5">
              <InfoPill
                icon="person"
                label="Assigned"
                value={assignee}
              />

              <InfoPill
                icon="event"
                label="Deadline"
                value={deadline}
              />

              <span
                className={`inline-flex items-center px-4 py-2 rounded-xl text-xs font-black uppercase ${getPriorityClass(
                  priority
                )}`}
              >
                {formatPriority(priority)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start xl:items-end gap-3 shrink-0">
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
            Status
          </p>

          {canUpdateStatus ? (
            <select
              value={status}
              disabled={isUpdating}
              onChange={(event) => onStatusChange(taskId, event.target.value)}
              className={`px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest outline-none disabled:opacity-60 border border-transparent ${getStatusClass(
                status
              )}`}
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          ) : (
            <span
              className={`px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest ${getStatusClass(
                status
              )}`}
            >
              {formatStatus(status)}
            </span>
          )}

          {isUpdating && (
            <span className="text-sm text-slate-400 font-bold">Saving...</span>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoPill({ icon, label, value }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-xs font-black text-slate-600">
      <span className="material-symbols-outlined text-[16px] text-slate-400">
        {icon}
      </span>

      <span className="uppercase tracking-widest text-slate-400">{label}:</span>

      <span>{value}</span>
    </span>
  );
}

export default ActiveTasks;