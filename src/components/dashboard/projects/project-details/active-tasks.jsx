import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../context/auth-context";
import {
  getTasks,
  updateTask,
  updateTaskStatus,
  deleteTask,
} from "../../../../services/task-service";
import EmptyState from "../../../common/empty-state";
import ErrorState from "../../../common/error-state";
import Toast from "../../../common/toast";
import LoadingState from "../../../common/loading-state";
import ConfirmModal from "../../../common/confirm-modal";
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

  const [taskToEdit, setTaskToEdit] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null);

  const [taskToDelete, setTaskToDelete] = useState(null);
  const [deletingTaskId, setDeletingTaskId] = useState(null);

  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    deadline: "",
    priority: "medium",
    status: "pending",
  });

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

  const openEditTaskModal = (task) => {
    if (!isAdmin) return;

    setTaskToEdit(task);

    setEditForm({
      title: getTaskTitle(task),
      description: task.description || "",
      deadline: task.deadline ? String(task.deadline).slice(0, 10) : "",
      priority: getPriority(task),
      status: getStatus(task),
    });
  };

  const resetEditForm = () => {
    setEditForm({
      title: "",
      description: "",
      deadline: "",
      priority: "medium",
      status: "pending",
    });
  };

  const closeEditTaskModal = () => {
    if (editingTaskId) return;

    setTaskToEdit(null);
    resetEditForm();
  };

  const handleEditFormChange = (field, value) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const confirmEditTask = async (event) => {
    event.preventDefault();

    if (!taskToEdit) return;

    const taskId = getTaskId(taskToEdit);

    if (!editForm.title.trim()) {
      showToast("error", "Task title is required.");
      return;
    }

    if (!editForm.description.trim()) {
      showToast("error", "Task description is required.");
      return;
    }

    if (!editForm.deadline) {
      showToast("error", "Deadline is required.");
      return;
    }

    setEditingTaskId(taskId);

    try {
      const payload = {
        title: editForm.title.trim(),
        description: editForm.description.trim(),
        deadline: editForm.deadline,
        priority: editForm.priority,
        status: editForm.status,
      };

      await updateTask(taskId, payload);

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          getTaskId(task) === taskId
            ? {
                ...task,
                ...payload,
              }
            : task
        )
      );

      window.dispatchEvent(new Event("tasks-updated"));

      showToast("success", "Task updated successfully.");
      setTaskToEdit(null);
      resetEditForm();
    } catch (error) {
      showToast(
        "error",
        error.response?.data?.message || "Failed to update task."
      );
    } finally {
      setEditingTaskId(null);
    }
  };

  const openDeleteTaskModal = (task) => {
    if (!isAdmin) return;

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
        prevTasks.filter((task) => getTaskId(task) !== taskId)
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

      {taskToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-7 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-black text-[#0b2a4a]">
                  Edit Task
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Update this project task. Only admins can edit task details.
                </p>
              </div>

              <button
                type="button"
                onClick={closeEditTaskModal}
                disabled={!!editingTaskId}
                className="rounded-xl bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 disabled:opacity-60"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={confirmEditTask} className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-400">
                  Task Title
                </label>

                <input
                  type="text"
                  value={editForm.title}
                  onChange={(event) =>
                    handleEditFormChange("title", event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-[#0b2a4a] outline-none focus:border-[#082b4f]"
                  placeholder="Enter task title"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-400">
                  Description
                </label>

                <textarea
                  value={editForm.description}
                  onChange={(event) =>
                    handleEditFormChange("description", event.target.value)
                  }
                  rows={4}
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-[#0b2a4a] outline-none focus:border-[#082b4f]"
                  placeholder="Enter task description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-400">
                    Deadline
                  </label>

                  <input
                    type="date"
                    value={editForm.deadline}
                    onChange={(event) =>
                      handleEditFormChange("deadline", event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-[#0b2a4a] outline-none focus:border-[#082b4f]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-400">
                    Priority
                  </label>

                  <select
                    value={editForm.priority}
                    onChange={(event) =>
                      handleEditFormChange("priority", event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-black text-[#0b2a4a] outline-none focus:border-[#082b4f]"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-400">
                    Status
                  </label>

                  <select
                    value={editForm.status}
                    onChange={(event) =>
                      handleEditFormChange("status", event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-black text-[#0b2a4a] outline-none focus:border-[#082b4f]"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeEditTaskModal}
                  disabled={!!editingTaskId}
                  className="rounded-xl bg-slate-100 px-5 py-3 text-sm font-black text-slate-600 hover:bg-slate-200 disabled:opacity-60"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={!!editingTaskId}
                  className="rounded-xl bg-[#082b4f] px-6 py-3 text-sm font-black text-white hover:opacity-90 disabled:opacity-60"
                >
                  {editingTaskId ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

        {projectTasks.map((task) => {
          const taskId = getTaskId(task);

          return (
            <TaskItem
              key={taskId}
              taskId={taskId}
              title={getTaskTitle(task)}
              description={getTaskDescription(task)}
              assignee={getAssigneeName(task)}
              status={getStatus(task)}
              priority={getPriority(task)}
              deadline={getDeadline(task)}
              icon={getTaskIcon(getPriority(task))}
              isAdmin={isAdmin}
              isEmployee={isEmployee}
              isUpdating={updatingTaskId === taskId}
              isEditing={editingTaskId === taskId}
              isDeleting={deletingTaskId === taskId}
              onStatusChange={handleStatusChange}
              onEdit={() => openEditTaskModal(task)}
              onDelete={() => openDeleteTaskModal(task)}
              formatStatus={formatStatus}
              formatPriority={formatPriority}
              getStatusClass={getStatusClass}
              getPriorityClass={getPriorityClass}
            />
          );
        })}
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
  isEditing,
  isDeleting,
  onStatusChange,
  onEdit,
  onDelete,
  formatStatus,
  formatPriority,
  getStatusClass,
  getPriorityClass,
}) {
  const canUpdateStatus = isAdmin || isEmployee;
  const isBusy = isUpdating || isEditing || isDeleting;

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
              <InfoPill icon="person" label="Assigned" value={assignee} />

              <InfoPill icon="event" label="Deadline" value={deadline} />

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
              disabled={isBusy}
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

          {isAdmin && (
            <div className="flex flex-wrap justify-start xl:justify-end gap-2">
              <button
                type="button"
                onClick={onEdit}
                disabled={isBusy}
                className="px-4 py-3 rounded-xl bg-blue-50 text-blue-700 text-xs font-black uppercase tracking-widest hover:bg-blue-100 disabled:opacity-60 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[17px]">
                  edit
                </span>
                Edit
              </button>

              <button
                type="button"
                onClick={onDelete}
                disabled={isBusy}
                className="px-4 py-3 rounded-xl bg-red-50 text-red-700 text-xs font-black uppercase tracking-widest hover:bg-red-100 disabled:opacity-60 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[17px]">
                  delete
                </span>
                Delete
              </button>
            </div>
          )}

          {isBusy && (
            <span className="text-sm text-slate-400 font-bold">
              {isDeleting
                ? "Deleting..."
                : isEditing
                ? "Saving..."
                : "Saving status..."}
            </span>
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