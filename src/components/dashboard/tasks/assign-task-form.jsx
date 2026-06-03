import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAuth } from "../../../context/auth-context";
import { createTask, getTasks } from "../../../services/task-service";
import { getProjects } from "../../../services/project-service";
import { getUsers } from "../../../services/user-service";
import Toast from "../../common/toast";
import useToast from "../../../hooks/use-toast";
import ErrorState from "../../common/error-state";
import LoadingState from "../../common/loading-state";
import SearchPicker from "../../common/search-picker";

const isTodayOrFutureDate = (value) => {
  const selectedDate = new Date(value);
  const today = new Date();

  if (Number.isNaN(selectedDate.getTime())) {
    return false;
  }

  today.setHours(0, 0, 0, 0);
  selectedDate.setHours(0, 0, 0, 0);

  return selectedDate >= today;
};

const getTodayDate = () => {
  return new Date().toISOString().split("T")[0];
};

const assignTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Task title is required")
    .min(2, "Task title must be at least 2 characters")
    .max(255, "Task title must be less than 255 characters"),

  description: z
   .string()
   .trim()
   .min(1, "Description is required")
   .min(5, "Description must be at least 5 characters")
   .max(1000, "Description must be less than 1000 characters"),

  assigned_user: z.coerce
    .number({
      invalid_type_error: "Assigned employee is required",
    })
    .int("Assigned employee is invalid")
    .positive("Assigned employee is required"),

  project_id: z.coerce
    .number({
      invalid_type_error: "Project is required",
    })
    .int("Project is invalid")
    .positive("Project is required"),

  deadline: z
    .string()
    .min(1, "Deadline is required")
    .refine(isTodayOrFutureDate, "Deadline cannot be in the past"),

  priority: z.enum(["low", "medium", "high"], {
    required_error: "Priority is required",
  }),
});

function AssignTaskForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const preselectedProjectId = searchParams.get("projectId");
  const isProjectLocked = Boolean(preselectedProjectId);
  const isAdmin = user?.role === "admin";

  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [employeeSearch, setEmployeeSearch] = useState("");
  const [projectSearch, setProjectSearch] = useState("");

  const [loadingData, setLoadingData] = useState(true);
  const [dataError, setDataError] = useState("");

  const { toast, showToast, hideToast } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(assignTaskSchema),
    mode: "onBlur",
    defaultValues: {
      title: "",
      description: "",
      assigned_user: "",
      project_id: "",
      deadline: "",
      priority: "medium",
    },
  });

  const selectedPriority = watch("priority");
  const selectedProjectId = watch("project_id");
  const selectedEmployeeId = watch("assigned_user");

  useEffect(() => {
    const loadData = async () => {
      setLoadingData(true);
      setDataError("");

      try {
        const [usersData, projectsData, tasksData] = await Promise.all([
          getUsers(),
          getProjects(),
          getTasks(),
        ]);

        const usersList = usersData.users || usersData.data || [];
        const employeesOnly = usersList.filter(
          (item) => item.role === "employee"
        );

        const projectsList = projectsData.projects || [];

        setEmployees(employeesOnly);
        setProjects(projectsList);
        setTasks(tasksData.tasks || []);

        if (preselectedProjectId) {
          const selectedProjectFromUrl = projectsList.find(
            (project) =>
              Number(project.project_id) === Number(preselectedProjectId)
          );

          if (selectedProjectFromUrl) {
            setValue("project_id", preselectedProjectId, {
              shouldValidate: true,
              shouldDirty: true,
            });

            setProjectSearch(
              `${selectedProjectFromUrl.name || selectedProjectFromUrl.project_name} - ID: ${
                selectedProjectFromUrl.project_id
              }`
            );
          }
        }
      } catch (error) {
        setDataError(
          error.response?.data?.message || "Failed to load form data."
        );
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, [preselectedProjectId, setValue]);

  const selectedProject = useMemo(() => {
    if (!selectedProjectId) return null;

    return projects.find(
      (project) => Number(project.project_id) === Number(selectedProjectId)
    );
  }, [projects, selectedProjectId]);

  const selectedEmployee = useMemo(() => {
    if (!selectedEmployeeId) return null;

    return employees.find(
      (employee) => Number(employee.user_id) === Number(selectedEmployeeId)
    );
  }, [employees, selectedEmployeeId]);

  const searchableProjects = useMemo(() => {
    return projects.filter(
      (project) =>
        project.status !== "completed" && project.status !== "cancelled"
    );
  }, [projects]);

  const filteredEmployees = useMemo(() => {
    const query = employeeSearch.trim().toLowerCase();

    if (!query) return [];

    return employees.filter((employee) => {
      const searchableText = [
        employee.name,
        employee.email,
        employee.user_id,
        employee.role,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [employees, employeeSearch]);

  const filteredProjects = useMemo(() => {
    const query = projectSearch.trim().toLowerCase();

    if (!query) return [];

    return searchableProjects.filter((project) => {
      const searchableText = [
        project.project_id,
        project.name,
        project.project_name,
        project.client_name,
        project.category,
        project.status,
        project.priority,
        project.template_name,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [searchableProjects, projectSearch]);

  const isSelectedProjectClosed =
    selectedProject?.status === "completed" ||
    selectedProject?.status === "cancelled";

  const stats = useMemo(() => {
    const totalActiveTasks = tasks.filter(
      (task) => task.status !== "completed"
    ).length;

    const highPriorityTasks = tasks.filter(
      (task) => task.priority === "high"
    ).length;

    return {
      totalActiveTasks,
      employeesAvailable: employees.length,
      highPriorityTasks,
    };
  }, [tasks, employees]);

  const getProjectLabel = (project) => {
    const projectId = project.project_id || project.id;
    const name = project.name || project.project_name || "Untitled Project";
    const client = project.client_name || "No client";
    const category = project.category || "Uncategorized";
    const status = project.status || "pending";

    return `ID: ${projectId} · ${name} · Client: ${client} · ${category} · ${status}`;
  };

  const getEmployeeLabel = (employee) => {
    const name = employee.name || "Unnamed Employee";
    const email = employee.email || "No email";
    const userId = employee.user_id || employee.id;

    return `${email} · ${name} · ID: ${userId}`;
  };

  const handleSelectEmployee = (employee) => {
    setValue("assigned_user", employee.user_id, {
      shouldValidate: true,
      shouldDirty: true,
    });

    setEmployeeSearch(employee.email || employee.name || "");
  };

  const handleSelectProject = (project) => {
    setValue("project_id", project.project_id, {
      shouldValidate: true,
      shouldDirty: true,
    });

    setProjectSearch(
      `${project.name || project.project_name} - ID: ${project.project_id}`
    );
  };

  const onSubmit = async (formData) => {
    if (isSelectedProjectClosed) {
      showToast(
        "warning",
        "You cannot assign tasks to a completed or cancelled project."
      );
      return;
    }

    try {
      await createTask({
        title: formData.title.trim(),
        description: formData.description?.trim(),
        assigned_user: Number(formData.assigned_user),
        project_id: Number(formData.project_id),
        deadline: formData.deadline,
        priority: formData.priority,
        status: "pending",
      });

      reset({
        title: "",
        description: "",
        assigned_user: "",
        project_id: preselectedProjectId || "",
        deadline: "",
        priority: "medium",
      });

      setEmployeeSearch("");

      if (!preselectedProjectId) {
        setProjectSearch("");
      }

      showToast("success", "Task assigned successfully.");

      setTimeout(() => {
        if (preselectedProjectId) {
          navigate(`/projects/${preselectedProjectId}`);
        } else {
          navigate("/tasks");
        }
      }, 900);
    } catch (error) {
      const responseData = error.response?.data;

      if (responseData?.errors) {
        responseData.errors.forEach((err) => {
          setError(err.field || "root", {
            type: "server",
            message: err.message,
          });
        });

        showToast("error", "Please check the form and try again.");
      } else {
        setError("root", {
          type: "server",
          message: responseData?.message || "Failed to assign task.",
        });

        showToast(
          "error",
          responseData?.message || "Failed to assign task. Please try again."
        );
      }
    }
  };

  if (!isAdmin) {
    return (
      <ErrorState
        icon="lock"
        title="Access restricted"
        message="Only administrators can assign tasks to employees."
        actionLabel="Back to Dashboard"
        onAction={() => navigate("/dashboard")}
      />
    );
  }

  if (loadingData) {
    return <LoadingState type="form" />;
  }

  if (dataError) {
    return (
      <ErrorState
        title="Failed to load assign task form"
        message={dataError}
        actionLabel="Back to Tasks"
        onAction={() => navigate("/tasks")}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Toast type={toast.type} message={toast.message} onClose={hideToast} />

      <div className="text-sm text-slate-400 flex items-center gap-2">
        <span>Dashboard</span>
        <span>/</span>
        <span>Tasks</span>
        <span>/</span>
        <span className="text-[#0b2a4a] font-semibold">Assign Task</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-[#082b4f] flex items-center justify-center text-white">
          <span className="material-symbols-outlined">assignment</span>
        </div>

        <div>
          <h1 className="text-3xl font-black text-[#0b2a4a]">
            Assign New Task
          </h1>

          <p className="text-slate-500 mt-1">
            Create and assign a project task using clear employee and project
            identifiers.
          </p>
        </div>
      </div>

      {selectedProject && (
        <div
          className={`rounded-2xl p-5 flex items-start justify-between gap-4 border ${
            isSelectedProjectClosed
              ? "bg-red-50 border-red-100"
              : "bg-blue-50 border-blue-100"
          }`}
        >
          <div>
            <p
              className={`text-xs uppercase tracking-widest font-bold ${
                isSelectedProjectClosed ? "text-red-500" : "text-blue-500"
              }`}
            >
              Selected Project
            </p>

            <h3 className="text-lg font-black text-[#0b2a4a] mt-1">
              {selectedProject.name || selectedProject.project_name}
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              ID: {selectedProject.project_id} ·{" "}
              {selectedProject.category || "Uncategorized"} ·{" "}
              {selectedProject.client_name || "No client"}
            </p>

            <p className="text-xs text-slate-400 mt-1">
              Status:{" "}
              <span className="font-bold">
                {selectedProject.status || "pending"}
              </span>{" "}
              · Priority:{" "}
              <span className="font-bold">
                {selectedProject.priority || "medium"}
              </span>
            </p>

            {isProjectLocked && (
              <p className="text-xs text-blue-500 font-semibold mt-2">
                This project was selected from Project Details and cannot be
                changed here.
              </p>
            )}

            {isSelectedProjectClosed && (
              <p className="text-xs text-red-600 font-semibold mt-2">
                This project is {selectedProject.status}. Task assignment is
                locked.
              </p>
            )}
          </div>

          {preselectedProjectId && (
            <button
              type="button"
              onClick={() => navigate(`/projects/${preselectedProjectId}`)}
              className="px-4 py-2 rounded-xl bg-white text-[#082b4f] text-xs font-bold hover:bg-slate-100 transition"
            >
              Back to Project
            </button>
          )}
        </div>
      )}

      {selectedEmployee && (
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">
            Selected Employee
          </p>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-2">
            <div>
              <h3 className="text-lg font-black text-[#0b2a4a]">
                {selectedEmployee.email || "No email"}
              </h3>

              <p className="text-sm text-slate-500">
                {selectedEmployee.name || "Unnamed Employee"} · ID:{" "}
                {selectedEmployee.user_id}
              </p>
            </div>

            <span className="px-4 py-2 rounded-xl bg-green-50 text-green-700 text-xs font-bold uppercase tracking-widest w-fit">
              Employee
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {errors.root && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                {errors.root.message}
              </div>
            )}

            <div>
              <label
                htmlFor="title"
                className="block text-sm font-semibold text-[#0b2a4a] mb-2"
              >
                Task Title
              </label>

              <input
                id="title"
                type="text"
                placeholder="Enter task title"
                autoComplete="off"
                disabled={isSelectedProjectClosed}
                className="w-full bg-slate-100 rounded-xl px-4 py-3 outline-none border border-transparent focus:border-[#082b4f] disabled:opacity-60 disabled:cursor-not-allowed"
                {...register("title")}
              />

              {errors.title && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-semibold text-[#0b2a4a] mb-2"
              >
                Description
              </label>

              <textarea
                id="description"
                rows="5"
                placeholder="Describe the task requirements, deliverables, and objectives..."
                disabled={isSelectedProjectClosed}
                className="w-full bg-slate-100 rounded-xl px-4 py-3 outline-none resize-none border border-transparent focus:border-[#082b4f] disabled:opacity-60 disabled:cursor-not-allowed"
                {...register("description")}
              />

              {errors.description && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <SearchPicker
                  label="Assigned Employee"
                  placeholder="Search employee by email, name, or ID..."
                  value={employeeSearch}
                  selectedLabel={
                    selectedEmployee ? getEmployeeLabel(selectedEmployee) : ""
                  }
                  results={filteredEmployees.map((employee) => ({
                    key: employee.user_id,
                    raw: employee,
                  }))}
                  disabled={isSelectedProjectClosed}
                  emptyMessage="No employees match your search"
                  helperText="Type to search. Employees are not shown until you search."
                  onSearchChange={setEmployeeSearch}
                  onSelect={handleSelectEmployee}
                  renderItem={(employee) => (
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-black text-[#0b2a4a]">
                          {employee.email || "No email"}
                        </p>

                        <p className="text-sm text-slate-500 mt-1">
                          {employee.name || "Unnamed Employee"}
                        </p>

                        <p className="text-xs text-slate-400 mt-1">
                          User ID: {employee.user_id}
                        </p>
                      </div>

                      <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-[10px] font-black uppercase">
                        Employee
                      </span>
                    </div>
                  )}
                />

                <input type="hidden" {...register("assigned_user")} />

                {errors.assigned_user && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.assigned_user.message}
                  </p>
                )}
              </div>

              <div>
                <SearchPicker
                  label="Project"
                  placeholder="Search project by ID, name, client, or category..."
                  value={projectSearch}
                  selectedLabel={
                    selectedProject ? getProjectLabel(selectedProject) : ""
                  }
                  results={filteredProjects.map((project) => ({
                    key: project.project_id,
                    raw: project,
                  }))}
                  disabled={isProjectLocked || isSelectedProjectClosed}
                  emptyMessage="No active projects match your search"
                  helperText={
                    isProjectLocked
                      ? "Project is locked because you selected it from Project Details."
                      : "Only active projects are searchable. Completed and cancelled projects are hidden."
                  }
                  onSearchChange={setProjectSearch}
                  onSelect={handleSelectProject}
                  renderItem={(project) => (
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-black text-[#0b2a4a]">
                          {project.name ||
                            project.project_name ||
                            "Untitled Project"}
                        </p>

                        <p className="text-sm text-slate-500 mt-1">
                          Client: {project.client_name || "No client"}
                        </p>

                        <p className="text-xs text-slate-400 mt-1">
                          ID: {project.project_id} ·{" "}
                          {project.category || "Uncategorized"} ·{" "}
                          {project.status || "pending"}
                        </p>
                      </div>

                      <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-black uppercase">
                        {project.priority || "medium"}
                      </span>
                    </div>
                  )}
                />

                <input type="hidden" {...register("project_id")} />

                {errors.project_id && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.project_id.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="deadline"
                  className="block text-sm font-semibold text-[#0b2a4a] mb-2"
                >
                  Deadline
                </label>

                <div className="relative">
                  <input
                    id="deadline"
                    type="date"
                    min={getTodayDate()}
                    disabled={isSelectedProjectClosed}
                    className="w-full bg-slate-100 rounded-xl px-4 py-3 outline-none border border-transparent focus:border-[#082b4f] disabled:opacity-60 disabled:cursor-not-allowed"
                    {...register("deadline")}
                  />

                  <span className="pointer-events-none material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                    calendar_month
                  </span>
                </div>

                {errors.deadline && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.deadline.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#0b2a4a] mb-2">
                  Priority
                </label>

                <div className="flex gap-3 flex-wrap">
                  {["low", "medium", "high"].map((item) => (
                    <button
                      key={item}
                      type="button"
                      disabled={isSelectedProjectClosed}
                      onClick={() =>
                        setValue("priority", item, {
                          shouldValidate: true,
                          shouldDirty: true,
                        })
                      }
                      className={`px-5 py-3 rounded-xl font-semibold text-sm capitalize transition disabled:opacity-60 disabled:cursor-not-allowed ${
                        selectedPriority === item
                          ? item === "low"
                            ? "bg-slate-700 text-white"
                            : item === "medium"
                            ? "bg-yellow-500 text-white"
                            : "bg-red-600 text-white"
                          : item === "low"
                          ? "bg-slate-200 text-slate-700"
                          : item === "medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>

                {errors.priority && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.priority.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#0b2a4a] mb-2">
                Current Status
              </label>

              <div className="inline-flex items-center px-5 py-2 rounded-full bg-yellow-100 text-yellow-700 font-semibold text-sm">
                Pending
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() =>
                  preselectedProjectId
                    ? navigate(`/projects/${preselectedProjectId}`)
                    : navigate("/tasks")
                }
                className="px-6 py-3 rounded-xl border border-slate-200 text-slate-500 font-semibold hover:bg-slate-50 transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting || isSelectedProjectClosed}
                className="px-7 py-3 rounded-xl bg-[#082b4f] text-white font-semibold hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting
                  ? "Assigning..."
                  : isSelectedProjectClosed
                  ? "Project Locked"
                  : "Assign Task"}
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-5">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
            <h3 className="font-black text-[#0b2a4a] mb-5">Team Capacity</h3>

            <div className="space-y-5">
              <StatItem
                label="Total Active Tasks"
                value={stats.totalActiveTasks}
                className="text-[#0b2a4a]"
              />

              <StatItem
                label="Employees Available"
                value={stats.employeesAvailable}
                className="text-green-600"
              />

              <StatItem
                label="High Priority Tasks"
                value={stats.highPriorityTasks}
                className="text-red-600"
              />
            </div>
          </div>

          <div className="bg-[#082b4f] rounded-3xl p-6 text-white">
            <p className="text-xs uppercase tracking-widest text-blue-200">
              Pro Tip
            </p>

            <h3 className="text-xl font-black mt-3">
              Use email and IDs to avoid assignment mistakes.
            </h3>

            <p className="text-blue-100 mt-3 leading-7 text-sm">
              Names can repeat, so always confirm the employee email and project
              ID before assigning tasks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatItem({ label, value, className }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-slate-400">
        {label}
      </p>

      <h2 className={`text-3xl font-black mt-1 ${className}`}>{value}</h2>
    </div>
  );
}

export default AssignTaskForm;