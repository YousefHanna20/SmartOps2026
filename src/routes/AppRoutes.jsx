import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "../pages/landing";

import Register from "../pages/register";
import Login from "../pages/login";
import Dashboard from "../pages/dashboard";
import Projects from "../pages/projects";
import ProjectDetails from "../pages/project-details";
import Tasks from "../pages/tasks";
import ProjectRequest from "../pages/project-request";
import ProjectTemplates from "../pages/project-templates";
import Notifications from "../pages/notifications";

import ForgotPassword from "../pages/forgot-password";
import ResetPassword from "../pages/reset-password";
import Verifyotp from "../pages/verify-otp";
import AssignTask from "../pages/assign-task";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:id" element={<ProjectDetails />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/requests" element={<ProjectRequest />} />
        <Route path="/templates" element={<ProjectTemplates />} />
        <Route path="/notifications" element={<Notifications />} />

        {/* Your pages */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Partner page */}
        <Route path="/otp" element={<Verifyotp />} />
        <Route path="/tasks/assign" element={<AssignTask />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;