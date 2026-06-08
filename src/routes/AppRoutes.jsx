import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "../pages/landing";
import Register from "../pages/register";
import Login from "../pages/login";

import ForgotPassword from "../pages/forgot-password";
import ResetPassword from "../pages/reset-password";
import Verifyotp from "../pages/verify-otp";

import Dashboard from "../pages/dashboard";
import Projects from "../pages/projects";
import ProjectDetails from "../pages/project-details";
import Tasks from "../pages/tasks";
import ProjectRequest from "../pages/project-request";
import ProjectTemplates from "../pages/project-templates";
import Notifications from "../pages/notifications";
import ExportReport from "../pages/export-report";
import AssignTask from "../pages/assign-task";
import Profile from "../pages/profile";
import Users from "../pages/users";

import ProtectedRoute from "./protected-route";
import RoleRoute from "./role-route";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/otp" element={<Verifyotp />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected pages */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <RoleRoute allowedRoles={["admin"]}>
              <Users />
            </RoleRoute>
          }
        />

        <Route
          path="/projects"
          element={
            <RoleRoute allowedRoles={["admin", "client", "employee"]}>
              <Projects />
            </RoleRoute>
          }
        />

        <Route
          path="/projects/:id"
          element={
            <RoleRoute allowedRoles={["admin", "client", "employee"]}>
              <ProjectDetails />
            </RoleRoute>
          }
        />

        <Route
          path="/tasks"
          element={
            <RoleRoute allowedRoles={["admin", "employee"]}>
              <Tasks />
            </RoleRoute>
          }
        />

        <Route
          path="/tasks/assign"
          element={
            <RoleRoute allowedRoles={["admin"]}>
              <AssignTask />
            </RoleRoute>
          }
        />

        <Route
          path="/tasks/export-report"
          element={
            <RoleRoute allowedRoles={["admin"]}>
              <ExportReport />
            </RoleRoute>
          }
        />

        <Route
          path="/requests"
          element={
            <RoleRoute allowedRoles={["admin", "client"]}>
              <ProjectRequest />
            </RoleRoute>
          }
        />

        <Route
          path="/templates"
          element={
            <RoleRoute allowedRoles={["admin", "client"]}>
              <ProjectTemplates />
            </RoleRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;