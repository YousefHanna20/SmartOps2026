import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAuth } from "../../../context/auth-context";
import { getTasks } from "../../../services/task-service";
import { getProjects } from "../../../services/project-service";
import ErrorState from "../../common/error-state";
import Toast from "../../common/toast";
import useToast from "../../../hooks/use-toast";
import LoadingState from "../../common/loading-state";
import SearchPicker from "../../common/search-picker";

const exportReportSchema = z
  .object({
    report_title: z
      .string()
      .trim()
      .min(1, "Report title is required")
      .max(100, "Report title must be less than 100 characters"),

    report_type: z.enum(["tasks", "projects", "full"]),

    project_id: z.string().optional(),

    start_date: z.string().optional(),

    end_date: z.string().optional(),

    format: z.enum(["pdf", "excel"]),
  })
  .refine(
    (data) => {
      if (!data.start_date || !data.end_date) return true;

      const startDate = new Date(data.start_date);
      const endDate = new Date(data.end_date);

      return endDate >= startDate;
    },
    {
      message: "End date must be after start date",
      path: ["end_date"],
    }
  );

function ExportReportContent() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [dataError, setDataError] = useState("");
  const [projectSearch, setProjectSearch] = useState("");

  const { toast, showToast, hideToast } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(exportReportSchema),
    mode: "onBlur",
    defaultValues: {
      report_title: "SmartOps Performance Report",
      report_type: "tasks",
      project_id: "all",
      start_date: "",
      end_date: "",
      format: "pdf",
    },
  });

  const selectedFormat = watch("format");
  const selectedProjectId = watch("project_id");
  const selectedStartDate = watch("start_date");
  const selectedEndDate = watch("end_date");

  useEffect(() => {
    const loadData = async () => {
      setLoadingData(true);
      setDataError("");

      try {
        const [tasksData, projectsData] = await Promise.all([
          getTasks(),
          getProjects(),
        ]);

        setTasks(tasksData.tasks || []);
        setProjects(projectsData.projects || []);
      } catch (error) {
        setDataError(
          error.response?.data?.message || "Failed to load report data."
        );
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, []);

  const selectedProject = useMemo(() => {
    if (!selectedProjectId || selectedProjectId === "all") return null;

    return projects.find(
      (project) => Number(project.project_id) === Number(selectedProjectId)
    );
  }, [projects, selectedProjectId]);

  const searchedProjects = useMemo(() => {
    const query = projectSearch.trim().toLowerCase();

    if (!query) return [];

    return projects.filter((project) => {
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
  }, [projects, projectSearch]);

  const getTaskProjectId = (task) => {
    return task.project_id || task.projectId;
  };

  const getProjectLabel = (project) => {
    const projectId = project.project_id || project.id;
    const name = project.name || project.project_name || "Untitled Project";
    const client = project.client_name || "No client";
    const category = project.category || "Uncategorized";
    const status = project.status || "pending";

    return `ID: ${projectId} · ${name} · Client: ${client} · ${category} · ${status}`;
  };

  const handleSelectProject = (project) => {
    setValue("project_id", String(project.project_id), {
      shouldValidate: true,
      shouldDirty: true,
    });

    setProjectSearch(
      `${project.name || project.project_name} - ID: ${project.project_id}`
    );
  };

  const handleSelectAllProjects = () => {
    setValue("project_id", "all", {
      shouldValidate: true,
      shouldDirty: true,
    });

    setProjectSearch("");
  };

  const getSelectedProjectName = () => {
    if (selectedProjectId === "all") return "All Projects";

    return selectedProject?.name || selectedProject?.project_name || "Selected Project";
  };

  const getDateRangeText = () => {
    return `${selectedStartDate || "Any"} to ${selectedEndDate || "Any"}`;
  };

  const isInsideDateRange = (dateValue, startDate, endDate) => {
    if (!dateValue) return true;

    const currentDate = new Date(dateValue);

    if (Number.isNaN(currentDate.getTime())) return true;

    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);

      if (currentDate < start) return false;
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      if (currentDate > end) return false;
    }

    return true;
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesProject =
        selectedProjectId === "all" ||
        Number(getTaskProjectId(task)) === Number(selectedProjectId);

      const matchesDate = isInsideDateRange(
        task.deadline || task.created_at,
        selectedStartDate,
        selectedEndDate
      );

      return matchesProject && matchesDate;
    });
  }, [tasks, selectedProjectId, selectedStartDate, selectedEndDate]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesProject =
        selectedProjectId === "all" ||
        Number(project.project_id) === Number(selectedProjectId);

      const matchesDate = isInsideDateRange(
        project.deadline || project.created_at,
        selectedStartDate,
        selectedEndDate
      );

      return matchesProject && matchesDate;
    });
  }, [projects, selectedProjectId, selectedStartDate, selectedEndDate]);

  const reportStats = useMemo(() => {
    const completedTasks = filteredTasks.filter(
      (task) => task.status === "completed"
    ).length;

    const pendingTasks = filteredTasks.filter(
      (task) => task.status === "pending"
    ).length;

    const inProgressTasks = filteredTasks.filter(
      (task) => task.status === "in_progress"
    ).length;

    const highPriorityTasks = filteredTasks.filter(
      (task) => task.priority === "high"
    ).length;

    const completedProjects = filteredProjects.filter(
      (project) => project.status === "completed"
    ).length;

    const activeProjects = filteredProjects.filter(
      (project) => project.status === "in_progress"
    ).length;

    const taskCompletionRate =
      filteredTasks.length > 0
        ? Math.round((completedTasks / filteredTasks.length) * 100)
        : 0;

    const projectCompletionRate =
      filteredProjects.length > 0
        ? Math.round((completedProjects / filteredProjects.length) * 100)
        : 0;

    return {
      totalTasks: filteredTasks.length,
      totalProjects: filteredProjects.length,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      highPriorityTasks,
      activeProjects,
      completedProjects,
      taskCompletionRate,
      projectCompletionRate,
    };
  }, [filteredTasks, filteredProjects]);

  const formatStatus = (status) => {
    return String(status || "pending")
      .replaceAll("_", " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const formatPriority = (priority) => {
    return String(priority || "medium").toUpperCase();
  };

  const escapeCsvValue = (value) => {
    const safeValue = value ?? "";
    return `"${String(safeValue).replaceAll('"', '""')}"`;
  };

  const downloadCsv = (filename, rows) => {
    const csvContent = rows
      .map((row) => row.map(escapeCsvValue).join(","))
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url);
  };

  const buildCsvRows = (formData) => {
    const rows = [];

    rows.push([formData.report_title]);
    rows.push(["Generated By", user?.name || "SmartOps User"]);
    rows.push(["Report Type", formData.report_type]);
    rows.push(["Selected Project", getSelectedProjectName()]);
    rows.push(["Date Range", getDateRangeText()]);
    rows.push(["Generated At", new Date().toLocaleString()]);
    rows.push([]);

    rows.push(["Summary"]);
    rows.push(["Total Tasks", reportStats.totalTasks]);
    rows.push(["Completed Tasks", reportStats.completedTasks]);
    rows.push(["Pending Tasks", reportStats.pendingTasks]);
    rows.push(["In Progress Tasks", reportStats.inProgressTasks]);
    rows.push(["High Priority Tasks", reportStats.highPriorityTasks]);
    rows.push(["Task Completion Rate", `${reportStats.taskCompletionRate}%`]);
    rows.push(["Total Projects", reportStats.totalProjects]);
    rows.push(["Completed Projects", reportStats.completedProjects]);
    rows.push([
      "Project Completion Rate",
      `${reportStats.projectCompletionRate}%`,
    ]);
    rows.push([]);

    if (formData.report_type === "tasks" || formData.report_type === "full") {
      rows.push(["Tasks"]);
      rows.push([
        "Title",
        "Project",
        "Assigned User",
        "Priority",
        "Status",
        "Deadline",
      ]);

      filteredTasks.forEach((task) => {
        rows.push([
          task.title || "Untitled Task",
          task.project_name || "No project",
          task.assigned_user_name || "Unassigned",
          formatPriority(task.priority),
          formatStatus(task.status),
          task.deadline || "Not set",
        ]);
      });

      rows.push([]);
    }

    if (
      formData.report_type === "projects" ||
      formData.report_type === "full"
    ) {
      rows.push(["Projects"]);
      rows.push([
        "Name",
        "Client",
        "Category",
        "Priority",
        "Status",
        "Deadline",
      ]);

      filteredProjects.forEach((project) => {
        rows.push([
          project.name || "Untitled Project",
          project.client_name || "No client",
          project.category || "Uncategorized",
          formatPriority(project.priority),
          formatStatus(project.status),
          project.deadline || "Not set",
        ]);
      });
    }

    return rows;
  };

  const generatePdfReport = (formData) => {
    const reportWindow = window.open("", "_blank");

    if (!reportWindow) {
      showToast("warning", "Please allow popups to generate the PDF report.");
      return;
    }

    const tasksSection =
      formData.report_type === "tasks" || formData.report_type === "full"
        ? `
          <h2>Tasks</h2>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Project</th>
                <th>Assigned To</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Deadline</th>
              </tr>
            </thead>
            <tbody>
              ${
                filteredTasks.length === 0
                  ? `<tr><td colspan="6">No tasks found.</td></tr>`
                  : filteredTasks
                      .map(
                        (task) => `
                          <tr>
                            <td>${task.title || "Untitled Task"}</td>
                            <td>${task.project_name || "No project"}</td>
                            <td>${task.assigned_user_name || "Unassigned"}</td>
                            <td>${formatPriority(task.priority)}</td>
                            <td>${formatStatus(task.status)}</td>
                            <td>${task.deadline || "Not set"}</td>
                          </tr>
                        `
                      )
                      .join("")
              }
            </tbody>
          </table>
        `
        : "";

    const projectsSection =
      formData.report_type === "projects" || formData.report_type === "full"
        ? `
          <h2>Projects</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Client</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Deadline</th>
              </tr>
            </thead>
            <tbody>
              ${
                filteredProjects.length === 0
                  ? `<tr><td colspan="6">No projects found.</td></tr>`
                  : filteredProjects
                      .map(
                        (project) => `
                          <tr>
                            <td>${project.name || "Untitled Project"}</td>
                            <td>${project.client_name || "No client"}</td>
                            <td>${project.category || "Uncategorized"}</td>
                            <td>${formatPriority(project.priority)}</td>
                            <td>${formatStatus(project.status)}</td>
                            <td>${project.deadline || "Not set"}</td>
                          </tr>
                        `
                      )
                      .join("")
              }
            </tbody>
          </table>
        `
        : "";

    reportWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${formData.report_title}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 32px;
              color: #0b2a4a;
            }

            .header {
              border-bottom: 3px solid #082b4f;
              padding-bottom: 16px;
              margin-bottom: 24px;
            }

            h1 {
              margin: 0;
              font-size: 30px;
            }

            h2 {
              margin-top: 32px;
              font-size: 22px;
            }

            .muted {
              color: #64748b;
              font-size: 13px;
              margin-top: 8px;
            }

            .meta {
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 14px;
              padding: 16px;
              margin: 20px 0;
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 10px;
              font-size: 13px;
            }

            .meta strong {
              color: #082b4f;
            }

            .stats {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 12px;
              margin: 24px 0;
            }

            .card {
              background: #f1f5f9;
              border-radius: 14px;
              padding: 16px;
            }

            .card p {
              margin: 0;
              color: #64748b;
              font-size: 11px;
              text-transform: uppercase;
              letter-spacing: 1px;
            }

            .card h3 {
              margin: 8px 0 0;
              font-size: 24px;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 12px;
              font-size: 12px;
            }

            th {
              background: #082b4f;
              color: white;
              text-align: left;
              padding: 10px;
            }

            td {
              border-bottom: 1px solid #e2e8f0;
              padding: 10px;
            }

            .footer {
              margin-top: 32px;
              padding-top: 16px;
              border-top: 1px solid #e2e8f0;
              color: #64748b;
              font-size: 11px;
            }

            @media print {
              button {
                display: none;
              }

              body {
                padding: 20px;
              }
            }
          </style>
        </head>

        <body>
          <div class="header">
            <h1>${formData.report_title}</h1>
            <p class="muted">
              SmartOps project and task performance report.
            </p>
          </div>

          <div class="meta">
            <div><strong>Generated By:</strong> ${
              user?.name || "SmartOps User"
            }</div>
            <div><strong>Generated At:</strong> ${new Date().toLocaleString()}</div>
            <div><strong>Report Type:</strong> ${formData.report_type.toUpperCase()}</div>
            <div><strong>Selected Project:</strong> ${getSelectedProjectName()}</div>
            <div><strong>Date Range:</strong> ${getDateRangeText()}</div>
            <div><strong>Format:</strong> PDF</div>
          </div>

          <div class="stats">
            <div class="card">
              <p>Total Tasks</p>
              <h3>${reportStats.totalTasks}</h3>
            </div>

            <div class="card">
              <p>Completed Tasks</p>
              <h3>${reportStats.completedTasks}</h3>
            </div>

            <div class="card">
              <p>Total Projects</p>
              <h3>${reportStats.totalProjects}</h3>
            </div>

            <div class="card">
              <p>Task Completion</p>
              <h3>${reportStats.taskCompletionRate}%</h3>
            </div>
          </div>

          ${tasksSection}
          ${projectsSection}

          <div class="footer">
            Generated by SmartOps Architectural Systems.
          </div>

          <script>
            window.onload = function () {
              window.print();
            };
          </script>
        </body>
      </html>
    `);

    reportWindow.document.close();
  };

  const onSubmit = async (formData) => {
    if (formData.format === "excel") {
      const rows = buildCsvRows(formData);
      downloadCsv("smartops-report.csv", rows);
      showToast("success", "CSV report downloaded successfully.");
      return;
    }

    generatePdfReport(formData);
  };

  if (loadingData) {
    return <LoadingState type="form" />;
  }

  if (dataError) {
    return (
      <ErrorState
        title="Failed to load report data"
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
        <span className="font-semibold text-[#082b4f]">Export Report</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-[#082b4f] flex items-center justify-center text-white">
          <span className="material-symbols-outlined">description</span>
        </div>

        <div>
          <h1 className="text-3xl font-black text-[#082b4f]">
            Export Reports
          </h1>

          <p className="text-slate-500 mt-1">
            Generate project and task performance reports from live system data.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6"
      >
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
          <div className="space-y-7">
            <div>
              <label
                htmlFor="report-title"
                className="block text-sm font-semibold text-[#082b4f] mb-2"
              >
                Report Title
              </label>

              <input
                id="report-title"
                type="text"
                placeholder="SmartOps Performance Report"
                className="w-full bg-slate-100 rounded-xl px-4 py-3 outline-none"
                {...register("report_title")}
              />

              {errors.report_title && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.report_title.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="report-type"
                  className="block text-sm font-semibold text-[#082b4f] mb-2"
                >
                  Report Type
                </label>

                <select
                  id="report-type"
                  className="w-full bg-slate-100 rounded-xl px-4 py-3 outline-none"
                  {...register("report_type")}
                >
                  <option value="tasks">Task Report</option>
                  <option value="projects">Project Report</option>
                  <option value="full">Full System Report</option>
                </select>

                {errors.report_type && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.report_type.message}
                  </p>
                )}
              </div>

              <div>
                <SearchPicker
                  label="Project Selection"
                  placeholder="Search project by ID, name, client, category, or status..."
                  value={projectSearch}
                  selectedLabel={
                    selectedProjectId === "all"
                      ? "All Projects"
                      : selectedProject
                      ? getProjectLabel(selectedProject)
                      : ""
                  }
                  results={searchedProjects.map((project) => ({
                    key: project.project_id,
                    raw: project,
                  }))}
                  emptyMessage="No projects match your search"
                  helperText="Type to search. Projects are not shown until you search. You can also keep All Projects selected."
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

                <button
                  type="button"
                  onClick={handleSelectAllProjects}
                  className="mt-3 px-4 py-2 rounded-xl bg-slate-100 text-[#082b4f] text-xs font-bold hover:bg-slate-200 transition"
                >
                  Use All Projects
                </button>

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
                  htmlFor="start-date"
                  className="block text-sm font-semibold text-[#082b4f] mb-2"
                >
                  Start Date
                </label>

                <input
                  id="start-date"
                  type="date"
                  className="w-full bg-slate-100 rounded-xl px-4 py-3 outline-none"
                  {...register("start_date")}
                />

                {errors.start_date && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.start_date.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="end-date"
                  className="block text-sm font-semibold text-[#082b4f] mb-2"
                >
                  End Date
                </label>

                <input
                  id="end-date"
                  type="date"
                  className="w-full bg-slate-100 rounded-xl px-4 py-3 outline-none"
                  {...register("end_date")}
                />

                {errors.end_date && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.end_date.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#082b4f] mb-4">
                Report Format
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() =>
                    setValue("format", "pdf", {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                  className={`rounded-2xl border p-5 text-left transition ${
                    selectedFormat === "pdf"
                      ? "border-[#082b4f] bg-red-100"
                      : "border-slate-200"
                  }`}
                >
                  <h3 className="font-bold text-[#082b4f]">Adobe PDF</h3>

                  <p className="text-sm text-slate-500 mt-1">
                    Opens a printable report
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setValue("format", "excel", {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                  className={`rounded-2xl border p-5 text-left transition ${
                    selectedFormat === "excel"
                      ? "border-green-600 bg-green-50"
                      : "border-slate-200"
                  }`}
                >
                  <h3 className="font-bold text-[#082b4f]">
                    Excel Spreadsheet
                  </h3>

                  <p className="text-sm text-slate-500 mt-1">
                    Downloads a CSV file
                  </p>
                </button>
              </div>

              {errors.format && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.format.message}
                </p>
              )}
            </div>

            <div className="rounded-3xl bg-slate-100 p-6">
              <h3 className="font-black text-[#082b4f] mb-5">
                Live Export Preview
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                <PreviewStat label="Tasks" value={reportStats.totalTasks} />

                <PreviewStat
                  label="Task Completion"
                  value={`${reportStats.taskCompletionRate}%`}
                  className="text-green-600"
                />

                <PreviewStat
                  label="Projects"
                  value={reportStats.totalProjects}
                />

                <PreviewStat
                  label="High Priority"
                  value={reportStats.highPriorityTasks}
                  className="text-red-600"
                />
              </div>

              <div className="mt-5 text-xs text-slate-500 space-y-1">
                <p>
                  <span className="font-bold">Project:</span>{" "}
                  {getSelectedProjectName()}
                </p>

                <p>
                  <span className="font-bold">Date Range:</span>{" "}
                  {getDateRangeText()}
                </p>

                <p>
                  Preview changes automatically based on selected project and
                  date range.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-2">
              <button
                type="button"
                onClick={() => navigate("/tasks")}
                className="px-6 py-3 rounded-xl border border-slate-200 text-slate-500 font-semibold"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-7 py-3 rounded-xl bg-[#082b4f] text-white font-semibold hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Generating..." : "Generate Report"}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-[#082b4f] rounded-3xl p-6 text-white">
            <h3 className="font-black text-xl mb-6">Report Summary</h3>

            <div className="space-y-5">
              <SideStat label="Visible Tasks" value={filteredTasks.length} />

              <SideStat
                label="Visible Projects"
                value={filteredProjects.length}
              />

              <SideStat
                label="Completion Rate"
                value={`${reportStats.taskCompletionRate}%`}
              />

              <SideStat
                label="Generated By"
                value={user?.name || "SmartOps User"}
                small
              />
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
            <h3 className="font-black text-[#082b4f]">Quick Tip</h3>

            <p className="text-slate-500 mt-3 leading-7 text-sm">
              Use PDF for presentation-ready summaries and Excel/CSV for
              filtering, analysis, and spreadsheet calculations.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}

function PreviewStat({ label, value, className = "text-[#082b4f]" }) {
  return (
    <div>
      <p className="text-xs uppercase text-slate-400">{label}</p>

      <h2 className={`text-2xl font-black ${className}`}>{value}</h2>
    </div>
  );
}

function SideStat({ label, value, small = false }) {
  return (
    <div>
      <p className="text-xs uppercase text-blue-200">{label}</p>

      <h2 className={`${small ? "text-lg" : "text-3xl"} font-black mt-1`}>
        {value}
      </h2>
    </div>
  );
}

export default ExportReportContent;