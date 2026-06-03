import { useEffect, useState } from "react";
import { useAuth } from "../../../context/auth-context";
import {
  getTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate,
} from "../../../services/template-service";
import { createProjectRequest } from "../../../services/project-request-service";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import Toast from "../../common/toast";
import useToast from "../../../hooks/use-toast";
import ConfirmModal from "../../common/confirm-modal";
import EmptyState from "../../common/empty-state";
import ErrorState from "../../common/error-state";
import LoadingState from "../../common/loading-state";

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

const templateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Template name is required")
    .min(2, "Template name must be at least 2 characters")
    .max(255, "Template name must be less than 255 characters"),

  category: z
    .string()
    .trim()
    .min(1, "Category is required")
    .max(255, "Category must be less than 255 characters"),

  estimated_duration: z.coerce
    .number({
      invalid_type_error: "Estimated duration must be a number",
    })
    .int("Estimated duration must be an integer")
    .positive("Estimated duration must be greater than 0"),

  description: z.string().trim().optional(),
});

const customRequestSchema = z.object({
  projectName: z
    .string()
    .trim()
    .min(1, "Project name is required")
    .min(2, "Project name must be at least 2 characters"),

  category: z
    .string()
    .trim()
    .min(1, "Project category is required")
    .max(255, "Category must be less than 255 characters"),

  deadline: z
    .string()
    .min(1, "Deadline is required")
    .refine(isTodayOrFutureDate, "Deadline cannot be in the past"),

  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .min(5, "Description must be at least 5 characters"),
});

function ProjectTemplatesContent() {
  const { user } = useAuth();

  const role = user?.role;
  const isAdmin = role === "admin";
  const isClient = role === "client";

  const [templates, setTemplates] = useState([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [templatesError, setTemplatesError] = useState("");

  const [showCreateBox, setShowCreateBox] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [deletingTemplate, setDeletingTemplate] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [showRequestBox, setShowRequestBox] = useState(false);

  const [confirmingTemplate, setConfirmingTemplate] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const { toast, showToast, hideToast } = useToast();

  const loadTemplates = async () => {
    setLoadingTemplates(true);
    setTemplatesError("");

    try {
      const data = await getTemplates();
      setTemplates(data.templates || []);
    } catch (error) {
      setTemplatesError(
        error.response?.data?.message || "Failed to load project templates."
      );
    } finally {
      setLoadingTemplates(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const openCreateBox = () => {
    setShowCreateBox(true);
  };

  const closeCreateBox = () => {
    setShowCreateBox(false);
  };

  const openEditBox = (template) => {
    setEditingTemplate(template);
  };

  const closeEditBox = () => {
    setEditingTemplate(null);
  };

  const openDeleteBox = (template) => {
    setDeletingTemplate(template);
  };

  const closeDeleteBox = () => {
    if (deleteLoading) return;
    setDeletingTemplate(null);
  };

  const openRequestBox = () => {
    setShowRequestBox(true);
  };

  const closeRequestBox = () => {
    setShowRequestBox(false);
  };

  const getDeadlineFromDuration = (duration) => {
    const days = Number(duration) || 30;
    const date = new Date();

    date.setDate(date.getDate() + days);

    return date.toISOString().split("T")[0];
  };

  const openUseTemplateConfirm = (template) => {
    setConfirmingTemplate(template);
  };

  const closeUseTemplateConfirm = () => {
    if (confirmLoading) return;
    setConfirmingTemplate(null);
  };

  const handleConfirmUseTemplate = async () => {
    if (!confirmingTemplate) return;

    setConfirmLoading(true);

    try {
      await createProjectRequest({
        project_name: confirmingTemplate.name,
        category: confirmingTemplate.category || "Other",
        description:
          confirmingTemplate.description ||
          `Project request based on ${confirmingTemplate.name}`,
        deadline: getDeadlineFromDuration(confirmingTemplate.estimated_duration),
        template_id: confirmingTemplate.template_id,
      });

      closeUseTemplateConfirm();
      showToast("success", "Project request submitted successfully.");
    } catch (error) {
      showToast(
        "error",
        error.response?.data?.message || "Failed to submit project request."
      );
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleDeleteTemplate = async () => {
    if (!deletingTemplate) return;

    setDeleteLoading(true);

    try {
      await deleteTemplate(deletingTemplate.template_id);

      setTemplates((prevTemplates) =>
        prevTemplates.filter(
          (template) => template.template_id !== deletingTemplate.template_id
        )
      );

      showToast("success", "Project template deleted successfully.");
      setDeletingTemplate(null);
    } catch (error) {
      showToast(
        "error",
        error.response?.data?.message || "Failed to delete project template."
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const TemplateFormModal = ({ mode, template, onClose }) => {
    const isEditMode = mode === "edit";

    const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
      setError,
    } = useForm({
      resolver: zodResolver(templateSchema),
      mode: "onBlur",
      defaultValues: {
        name: template?.name || "",
        category: template?.category || "",
        estimated_duration: template?.estimated_duration || "",
        description: template?.description || "",
      },
    });

    const onSubmit = async (formData) => {
      try {
        const payload = {
          name: formData.name.trim(),
          category: formData.category.trim(),
          estimated_duration: Number(formData.estimated_duration),
          description: formData.description?.trim() || "",
        };

        if (isEditMode) {
          await updateTemplate(template.template_id, payload);
          showToast("success", "Template updated successfully.");
        } else {
          await createTemplate(payload);
          showToast("success", "Template created successfully.");
        }

        onClose();
        await loadTemplates();
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
          const message =
            responseData?.message ||
            `Failed to ${isEditMode ? "update" : "create"} template.`;

          setError("root", {
            type: "server",
            message,
          });

          showToast("error", message);
        }
      }
    };

    return (
      <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
        <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
          <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100">
            <div>
              <h3 className="text-2xl font-black text-[#0b2a4a]">
                {isEditMode ? "Edit Template" : "Create Template"}
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                {isEditMode
                  ? "Update template information and availability."
                  : "Add a reusable project template for future client requests."}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-9 h-9 rounded-full bg-slate-100 text-slate-500 hover:bg-red-100 hover:text-red-600 transition flex items-center justify-center disabled:opacity-60"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-5">
            {errors.root && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                {errors.root.message}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="template-name"
                  className="text-xs font-bold uppercase tracking-widest text-slate-400"
                >
                  Template Name
                </label>

                <input
                  id="template-name"
                  type="text"
                  placeholder="Enter template name"
                  className="mt-2 w-full bg-slate-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#082b4f]"
                  {...register("name")}
                />

                {errors.name && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="template-category"
                  className="text-xs font-bold uppercase tracking-widest text-slate-400"
                >
                  Category
                </label>

                <select
                  id="template-category"
                  className="mt-2 w-full bg-slate-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#082b4f]"
                  {...register("category")}
                >
                  <option value="">Select category</option>
                  <option value="Architecture">Architecture</option>
                  <option value="Renovation">Renovation</option>
                  <option value="Urban Planning">Urban Planning</option>
                  <option value="Software">Software</option>
                  <option value="AI">AI</option>
                  <option value="Web App">Web App</option>
                  <option value="Mobile App">Mobile App</option>
                  <option value="Dashboard">Dashboard</option>
                  <option value="Other">Other</option>
                </select>

                {errors.category && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.category.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="estimated-duration"
                className="text-xs font-bold uppercase tracking-widest text-slate-400"
              >
                Estimated Duration
              </label>

              <input
                id="estimated-duration"
                type="number"
                min="1"
                placeholder="e.g. 90"
                className="mt-2 w-full bg-slate-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#082b4f]"
                {...register("estimated_duration")}
              />

              <p className="text-xs text-slate-400 mt-2">
                Duration is stored in days.
              </p>

              {errors.estimated_duration && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.estimated_duration.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="template-description"
                className="text-xs font-bold uppercase tracking-widest text-slate-400"
              >
                Description
              </label>

              <textarea
                id="template-description"
                placeholder="Describe the template purpose, workflow, and expected use..."
                className="mt-2 w-full h-32 bg-slate-100 rounded-xl px-4 py-3 text-sm outline-none resize-none focus:ring-2 focus:ring-[#082b4f]"
                {...register("description")}
              />

              {errors.description && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-6 py-3 rounded-xl bg-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-200 transition disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 rounded-xl bg-[#082b4f] text-white font-bold text-sm hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting
                  ? isEditMode
                    ? "Saving..."
                    : "Creating..."
                  : isEditMode
                  ? "Save Changes"
                  : "Create Template"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const CustomRequestModal = () => {
    const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
      reset,
      setError,
    } = useForm({
      resolver: zodResolver(customRequestSchema),
      mode: "onBlur",
      defaultValues: {
        projectName: "",
        category: "",
        deadline: "",
        description: "",
      },
    });

    const onSubmit = async (formData) => {
      try {
        await createProjectRequest({
          project_name: formData.projectName.trim(),
          category: formData.category.trim(),
          deadline: formData.deadline,
          description: formData.description.trim(),
          template_id: null,
        });

        reset();
        closeRequestBox();

        showToast("success", "Custom project request submitted successfully.");
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
          const message =
            responseData?.message || "Failed to submit project request.";

          setError("root", {
            type: "server",
            message,
          });

          showToast("error", message);
        }
      }
    };

    return (
      <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
        <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
          <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100">
            <div>
              <h3 className="text-2xl font-black text-[#0b2a4a]">
                Request Custom Project
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Submit a project request without using a template.
              </p>
            </div>

            <button
              type="button"
              onClick={closeRequestBox}
              disabled={isSubmitting}
              className="w-9 h-9 rounded-full bg-slate-100 text-slate-500 hover:bg-red-100 hover:text-red-600 transition flex items-center justify-center disabled:opacity-60"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-5">
            {errors.root && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                {errors.root.message}
              </div>
            )}

            <div>
              <label
                htmlFor="custom-project-name"
                className="text-xs font-bold uppercase tracking-widest text-slate-400"
              >
                Project Name
              </label>

              <input
                id="custom-project-name"
                type="text"
                placeholder="Enter project name"
                className="mt-2 w-full bg-slate-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#082b4f]"
                {...register("projectName")}
              />

              {errors.projectName && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.projectName.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="custom-category"
                className="text-xs font-bold uppercase tracking-widest text-slate-400"
              >
                Project Category
              </label>

              <select
                id="custom-category"
                className="mt-2 w-full bg-slate-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#082b4f]"
                {...register("category")}
              >
                <option value="">Select category</option>
                <option value="Software">Software</option>
                <option value="AI">AI</option>
                <option value="Web App">Web App</option>
                <option value="Mobile App">Mobile App</option>
                <option value="Dashboard">Dashboard</option>
                <option value="Architecture">Architecture</option>
                <option value="Renovation">Renovation</option>
                <option value="Urban Planning">Urban Planning</option>
                <option value="Other">Other</option>
              </select>

              {errors.category && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.category.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="custom-deadline"
                className="text-xs font-bold uppercase tracking-widest text-slate-400"
              >
                Deadline
              </label>

              <input
                id="custom-deadline"
                type="date"
                min={getTodayDate()}
                className="mt-2 w-full bg-slate-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#082b4f]"
                {...register("deadline")}
              />

              {errors.deadline && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.deadline.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="custom-description"
                className="text-xs font-bold uppercase tracking-widest text-slate-400"
              >
                Description
              </label>

              <textarea
                id="custom-description"
                placeholder="Describe the project requirements, goals, and constraints..."
                className="mt-2 w-full h-32 bg-slate-100 rounded-xl px-4 py-3 text-sm outline-none resize-none focus:ring-2 focus:ring-[#082b4f]"
                {...register("description")}
              />

              {errors.description && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Status
              </span>

              <span className="ml-3 inline-flex px-4 py-2 rounded-full bg-yellow-100 text-yellow-700 text-xs font-bold">
                Pending
              </span>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={closeRequestBox}
                disabled={isSubmitting}
                className="px-6 py-3 rounded-xl bg-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-200 transition disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 rounded-xl bg-[#082b4f] text-white font-bold text-sm hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div>
      <Toast type={toast.type} message={toast.message} onClose={hideToast} />

      <ConfirmModal
        isOpen={!!confirmingTemplate}
        title="Use this template?"
        description={
          confirmingTemplate
            ? `Are you sure you want to request a project using "${confirmingTemplate.name}"?`
            : ""
        }
        confirmLabel="Use Template"
        cancelLabel="Cancel"
        type="info"
        loading={confirmLoading}
        onConfirm={handleConfirmUseTemplate}
        onCancel={closeUseTemplateConfirm}
      />

      <ConfirmModal
        isOpen={!!deletingTemplate}
        title="Delete template?"
        description={
          deletingTemplate
            ? `Are you sure you want to delete "${deletingTemplate.name}"? This action cannot be undone.`
            : ""
        }
        confirmLabel="Delete Template"
        cancelLabel="Cancel"
        type="danger"
        loading={deleteLoading}
        onConfirm={handleDeleteTemplate}
        onCancel={closeDeleteBox}
      />

      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">
            {isAdmin
              ? "Administration Cell"
              : isClient
              ? "Client Templates"
              : "Templates"}
          </p>

          <h2 className="text-4xl font-black text-[#0b2a4a] mt-2">
            Project Templates
          </h2>

          <p className="text-slate-500 max-w-2xl mt-3">
            {isAdmin
              ? "System-wide reusable templates. Create, edit, and manage templates for client project requests."
              : "Browse available project templates or request a custom project without using a template."}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {isClient && (
            <button
              type="button"
              onClick={openRequestBox}
              className="bg-slate-100 text-[#082b4f] rounded-lg px-6 py-3 font-bold text-sm h-fit hover:bg-slate-200 transition"
            >
              + Request Custom Project
            </button>
          )}

          {isAdmin && (
            <button
              type="button"
              onClick={openCreateBox}
              className="bg-[#082b4f] text-white rounded-lg px-6 py-3 font-bold text-sm h-fit hover:opacity-90 transition"
            >
              + Create Template
            </button>
          )}
        </div>
      </div>

      {showCreateBox && (
        <TemplateFormModal mode="create" onClose={closeCreateBox} />
      )}

      {editingTemplate && (
        <TemplateFormModal
          mode="edit"
          template={editingTemplate}
          onClose={closeEditBox}
        />
      )}

      {showRequestBox && <CustomRequestModal />}

      {isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
          {[
            ["Active Templates", templates.length, "From database"],
            ["Managed By", user?.name || "Admin", "Current admin"],
            ["Access Level", "Admin", "Full control"],
          ].map(([label, value, note]) => (
            <div
              key={label}
              className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm"
            >
              <p className="text-xs uppercase tracking-widest text-slate-400">
                {label}
              </p>

              <h3 className="text-3xl font-black text-[#0b2a4a] mt-3">
                {value}
              </h3>

              <p className="text-xs text-slate-400 mt-2">{note}</p>
            </div>
          ))}
        </div>
      )}

      {loadingTemplates && (
        <div className="mt-8">
          <LoadingState type="table" rows={4} />
        </div>
      )}

      {templatesError && !loadingTemplates && (
        <div className="mt-8">
          <ErrorState
            title="Failed to load templates"
            message={templatesError}
            actionLabel="Try Again"
            onAction={loadTemplates}
          />
        </div>
      )}

      {!loadingTemplates && !templatesError && (
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 mt-8 overflow-hidden">
          <div className="flex justify-between items-center px-6 py-5 border-b">
            <h3 className="font-black text-[#0b2a4a]">Project Templates</h3>

            <button
              type="button"
              onClick={loadTemplates}
              className="text-xs font-bold text-slate-400 hover:text-[#082b4f]"
            >
              Refresh
            </button>
          </div>

          <div className="hidden md:grid grid-cols-[1fr_150px_130px_120px_190px] px-6 py-4 text-[11px] uppercase tracking-widest text-slate-400 border-b">
            <p>Name</p>
            <p>Category</p>
            <p>Duration</p>
            <p>Status</p>
            <p>Actions</p>
          </div>

          {templates.length === 0 && (
            <EmptyState
              icon="layers"
              title="No project templates found"
              description={
                isAdmin
                  ? "Create your first project template so clients can request projects faster."
                  : "Templates will appear here once the admin adds them."
              }
              actionLabel={isAdmin ? "Create First Template" : undefined}
              onAction={isAdmin ? openCreateBox : undefined}
            />
          )}

          {templates.map((template) => (
            <div
              key={template.template_id}
              className="grid grid-cols-1 md:grid-cols-[1fr_150px_130px_120px_190px] gap-3 items-center px-6 py-5 border-b last:border-b-0"
            >
              <div>
                <p className="font-bold text-[#0b2a4a]">{template.name}</p>

                <p className="text-xs text-slate-400">
                  {template.description || "No description"}
                </p>

                {template.created_by_name && (
                  <p className="text-[11px] text-slate-300 mt-1">
                    Created by {template.created_by_name}
                  </p>
                )}
              </div>

              <span className="text-xs bg-slate-100 rounded-full px-3 py-1 w-fit">
                {template.category || "Uncategorized"}
              </span>

              <p className="text-sm font-bold">
                {template.estimated_duration
                  ? `${template.estimated_duration} Days`
                  : "Not set"}
              </p>

              <span className="text-xs font-bold text-green-700">
                ● Available
              </span>

              <div className="flex gap-2 items-center">
                {isClient && (
                  <button
                    type="button"
                    onClick={() => openUseTemplateConfirm(template)}
                    className="px-4 py-2 rounded-lg text-xs font-bold bg-[#082b4f] text-white hover:opacity-90 transition"
                  >
                    Use Template
                  </button>
                )}

                {isAdmin && (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => openEditBox(template)}
                      className="px-3 py-2 rounded-lg text-xs font-bold bg-slate-100 text-[#0b2a4a] hover:bg-slate-200 transition"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => openDeleteBox(template)}
                      className="px-3 py-2 rounded-lg text-xs font-bold bg-red-100 text-red-600 hover:bg-red-200 transition"
                    >
                      Delete
                    </button>
                  </div>
                )}

                {!isAdmin && !isClient && (
                  <span className="text-xs text-slate-400 font-bold">
                    View Only
                  </span>
                )}
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

export default ProjectTemplatesContent;