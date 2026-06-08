import { useCallback, useEffect, useMemo, useState } from "react";

import AppShell from "../components/layout/app-shell";
import WelcomeSection from "../components/dashboard/dashboard-contant/welcome-section";
import StatsGrid from "../components/dashboard/dashboard-contant/stats-grid";
import AiInsights from "../components/dashboard/dashboard-contant/ai-insights";
import RecentActivity from "../components/dashboard/dashboard-contant/recent-activity";
import ProjectSpotlight from "../components/dashboard/dashboard-contant/project-spotlight";
import UpcomingDeadlines from "../components/dashboard/dashboard-contant/upcoming-deadlines";
import TeamSignature from "../components/dashboard/dashboard-contant/team-signature";
import { useNotifications } from "../context/notifications-context";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function getStoredToken() {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("accessToken")
  );
}

async function apiGet(path) {
  const token = getStoredToken();

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Failed to load dashboard data.");
  }

  return data;
}

function getArray(data, key) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.[key])) return data[key];
  return [];
}

function Dashboard() {
  const { notifications: liveNotifications, unreadCount } = useNotifications();

  const [dashboardData, setDashboardData] = useState({
    user: null,
    projects: [],
    tasks: [],
    requests: [],
    notifications: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [meData, projectsData, tasksData, requestsData, notificationsData] =
        await Promise.all([
          apiGet("/auth/me").catch(() => null),
          apiGet("/projects"),
          apiGet("/tasks").catch(() => ({ tasks: [] })),
          apiGet("/project-requests").catch(() => ({ requests: [] })),
          apiGet("/notifications").catch(() => ({ notifications: [] })),
        ]);

      setDashboardData({
        user: meData?.user || meData?.data || meData || null,
        projects: getArray(projectsData, "projects"),
        tasks: getArray(tasksData, "tasks"),
        requests: getArray(requestsData, "requests"),
        notifications: getArray(notificationsData, "notifications"),
      });
    } catch (err) {
      setError(err.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const computed = useMemo(() => {
    const { projects, tasks, requests } = dashboardData;

    const notifications =
      liveNotifications.length > 0
        ? liveNotifications
        : dashboardData.notifications;

    const activeProjects = projects.filter((project) =>
      ["pending", "in_progress"].includes(project.status)
    );

    const completedProjects = projects.filter(
      (project) => project.status === "completed"
    );

    const pendingRequests = requests.filter(
      (request) => request.status === "pending"
    );

    const completedTasks = tasks.filter((task) => task.status === "completed");

    const inProgressTasks = tasks.filter(
      (task) => task.status === "in_progress"
    );

    const unreadNotifications = notifications.filter(
      (notification) => !notification.is_read
    );

    const overdueTasks = tasks.filter((task) => {
      if (!task.deadline || task.status === "completed") return false;

      const deadlineDate = new Date(task.deadline);
      if (Number.isNaN(deadlineDate.getTime())) return false;

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      deadlineDate.setHours(0, 0, 0, 0);

      return deadlineDate < today;
    });

    const highPriorityTasks = tasks.filter((task) => task.priority === "high");

    const completionRate =
      tasks.length > 0
        ? Math.round((completedTasks.length / tasks.length) * 100)
        : 0;

    const recentActivity = buildRecentActivity({
      projects,
      tasks,
      requests,
      notifications,
    });

    const deadlines = buildDeadlinesAndOverdue({ projects, tasks });

    const spotlightProject = getSpotlightProject(projects);

    const insights = buildInsights({
      activeProjects,
      pendingRequests,
      overdueTasks,
      highPriorityTasks,
      completionRate,
      unreadNotifications,
    });

    return {
      stats: {
        totalProjects: projects.length,
        activeProjects: activeProjects.length,
        completedProjects: completedProjects.length,
        totalTasks: tasks.length,
        completedTasks: completedTasks.length,
        inProgressTasks: inProgressTasks.length,
        pendingRequests: pendingRequests.length,
        unreadNotifications:
          typeof unreadCount === "number"
            ? unreadCount
            : unreadNotifications.length,
        completionRate,
      },
      recentActivity,
      deadlines,
      spotlightProject,
      insights,
    };
  }, [dashboardData, liveNotifications, unreadCount]);

  return (
    <AppShell activePage="Dashboard">
      <div className="space-y-8">
        <WelcomeSection
          user={dashboardData.user}
          loading={loading}
          error={error}
          onRefresh={loadDashboard}
          stats={computed.stats}
        />

        <StatsGrid stats={computed.stats} loading={loading} />

        {error && (
          <div className="rounded-2xl border border-red-100 bg-red-50 px-6 py-4 text-sm font-bold text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          <div className="xl:col-span-8 space-y-8">
            <AiInsights insights={computed.insights} loading={loading} />

            <RecentActivity
              activities={computed.recentActivity}
              loading={loading}
            />
          </div>

          <div className="xl:col-span-4 space-y-8">
            <ProjectSpotlight
              project={computed.spotlightProject}
              loading={loading}
            />

            <UpcomingDeadlines
              deadlines={computed.deadlines}
              loading={loading}
            />
          </div>
        </div>

        {/* <TeamSignature /> */}
      </div>
    </AppShell>
  );
}

function buildRecentActivity({ projects, tasks, requests, notifications }) {
  const projectRows = projects.map((project) => ({
    id: `project-${project.project_id || project.id}`,
    type: "Project",
    title: project.name || project.project_name || "Untitled Project",
    description: `Status is ${formatStatus(project.status)}`,
    status: project.status,
    created_at: project.updated_at || project.created_at,
    icon: "account_tree",
  }));

  const taskRows = tasks.map((task) => ({
    id: `task-${task.task_id || task.id}`,
    type: "Task",
    title: task.title || "Untitled Task",
    description: task.project_name
      ? `Assigned under ${task.project_name}`
      : task.description || "Task activity",
    status: task.status,
    created_at: task.updated_at || task.created_at,
    icon: "assignment",
  }));

  const requestRows = requests.map((request) => ({
    id: `request-${request.request_id || request.id}`,
    type: "Request",
    title:
      request.project_name ||
      request.name ||
      request.projectName ||
      "Project Request",
    description: request.template_name
      ? `Based on ${request.template_name}`
      : request.description || "Custom project request",
    status: request.status,
    created_at: request.updated_at || request.created_at,
    icon: "approval",
  }));

  const notificationRows = notifications.map((notification) => ({
    id: `notification-${notification.notification_id || notification.id}`,
    type: "Notification",
    title: formatType(notification.type),
    description: notification.message || "Notification update",
    status: notification.is_read ? "read" : "unread",
    created_at: notification.created_at,
    icon: "notifications",
  }));

  return [...notificationRows, ...requestRows, ...taskRows, ...projectRows]
    .filter((item) => item.created_at)
    .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
    .slice(0, 8);
}

function buildDeadlinesAndOverdue({ projects, tasks }) {
  const taskDeadlines = tasks
    .filter((task) => task.deadline && task.status !== "completed")
    .map((task) => ({
      id: `task-${task.task_id || task.id}`,
      title: task.title || "Untitled Task",
      subtitle: task.project_name || "Task deadline",
      date: task.deadline,
      priority: task.priority,
      type: "Task",
      status: task.status,
      isOverdue: isDateOverdue(task.deadline),
    }));

  const projectDeadlines = projects
    .filter((project) => project.deadline && project.status !== "completed")
    .map((project) => ({
      id: `project-${project.project_id || project.id}`,
      title: project.name || project.project_name || "Untitled Project",
      subtitle: "Project deadline",
      date: project.deadline,
      priority: project.priority,
      type: "Project",
      status: project.status,
      isOverdue: isDateOverdue(project.deadline),
    }));

  return [...taskDeadlines, ...projectDeadlines]
    .sort((firstItem, secondItem) => {
      if (firstItem.isOverdue && !secondItem.isOverdue) return -1;
      if (!firstItem.isOverdue && secondItem.isOverdue) return 1;

      return new Date(firstItem.date) - new Date(secondItem.date);
    })
    .slice(0, 5);
}

function isDateOverdue(value) {
  if (!value) return false;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;

  const today = new Date();

  date.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  return date < today;
}

function getSpotlightProject(projects) {
  if (projects.length === 0) return null;

  const activeHighPriority = projects.find(
    (project) => project.status === "in_progress" && project.priority === "high"
  );

  if (activeHighPriority) return activeHighPriority;

  const activeProject = projects.find((project) =>
    ["pending", "in_progress"].includes(project.status)
  );

  return activeProject || projects[0];
}

function buildInsights({
  activeProjects,
  pendingRequests,
  overdueTasks,
  highPriorityTasks,
  completionRate,
  unreadNotifications,
}) {
  return [
    {
      title: "Operational Focus",
      value:
        highPriorityTasks.length > 0
          ? `${highPriorityTasks.length} high priority tasks`
          : "No high priority blockers",
      description:
        highPriorityTasks.length > 0
          ? "Review high priority tasks first to keep project delivery on track."
          : "Your current workload has no high priority task blockers.",
      icon: "priority_high",
      tone: highPriorityTasks.length > 0 ? "warning" : "success",
    },
    {
      title: "Request Queue",
      value: `${pendingRequests.length} pending requests`,
      description:
        pendingRequests.length > 0
          ? "Client requests are waiting for admin review."
          : "No pending client project requests right now.",
      icon: "approval",
      tone: pendingRequests.length > 0 ? "info" : "success",
    },
    {
      title: "Delivery Health",
      value: `${completionRate}% task completion`,
      description:
        overdueTasks.length > 0
          ? `${overdueTasks.length} overdue tasks need immediate attention.`
          : "No overdue tasks detected in your current scope.",
      icon: overdueTasks.length > 0 ? "warning" : "verified",
      tone: overdueTasks.length > 0 ? "danger" : "success",
    },
    {
      title: "Live Notifications",
      value: `${unreadNotifications.length} unread`,
      description:
        unreadNotifications.length > 0
          ? "Check new updates from requests, tasks, and projects."
          : "All updates are read. You are fully caught up.",
      icon: "notifications_active",
      tone: unreadNotifications.length > 0 ? "info" : "success",
    },
    {
      title: "Active Workload",
      value: `${activeProjects.length} active projects`,
      description:
        activeProjects.length > 0
          ? "Track progress and deadlines for active projects."
          : "There are no active projects at the moment.",
      icon: "rocket_launch",
      tone: "primary",
    },
  ];
}

function formatStatus(status) {
  return String(status || "unknown")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatType(type) {
  return String(type || "general")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default Dashboard;