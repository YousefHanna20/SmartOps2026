import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/auth-context";
function ProjectTemplatesContent() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const role = user?.role;

  const isAdmin = role === "admin";
  const isClient = role === "client";

  const [showCreateBox, setShowCreateBox] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [deletingTemplate, setDeletingTemplate] = useState(null);

  const [templates, setTemplates] = useState([
    {
      template_id: 1,
      name: "Commercial High-Rise V2",
      category: "Architecture",
      duration: "180 Days",
      status: "Verified",
      description: "Framework template ready for client modification.",
    },
    {
      template_id: 2,
      name: "Industrial Retrofit",
      category: "Renovation",
      duration: "90 Days",
      status: "Verified",
      description: "Framework template ready for client modification.",
    },
    {
      template_id: 3,
      name: "Urban Green Belt",
      category: "Urban Planning",
      duration: "320 Days",
      status: "Draft",
      description: "Framework template ready for client modification.",
    },
  ]);

  const emptyTemplateForm = {
    name: "",
    category: "",
    estimatedDuration: "",
    status: "Draft",
    description: "",
  };

  const [templateForm, setTemplateForm] = useState(emptyTemplateForm);

  const handleUseTemplate = (template) => {
    navigate("/requests", {
      state: {
        templateId: template.template_id,
        templateName: template.name,
      },
    });
  };

  const openCreateBox = () => {
    setTemplateForm(emptyTemplateForm);
    setShowCreateBox(true);
  };

  const closeCreateBox = () => {
    setTemplateForm(emptyTemplateForm);
    setShowCreateBox(false);
  };

  const handleCreateTemplate = (e) => {
    e.preventDefault();

    if (
      !templateForm.name ||
      !templateForm.category ||
      !templateForm.estimatedDuration
    ) {
      alert("Please fill template name, category, and estimated duration.");
      return;
    }

    const createdTemplate = {
      template_id: templates.length + 1,
      name: templateForm.name,
      category: templateForm.category,
      duration: `${templateForm.estimatedDuration} Days`,
      status: templateForm.status,
      description:
        templateForm.description || "Framework template ready for use.",
    };

    setTemplates([createdTemplate, ...templates]);
    closeCreateBox();
  };

  const openEditBox = (template) => {
    setEditingTemplate(template);

    setTemplateForm({
      name: template.name,
      category: template.category,
      estimatedDuration: template.duration.replace(" Days", ""),
      status: template.status,
      description: template.description,
    });
  };

  const closeEditBox = () => {
    setEditingTemplate(null);
    setTemplateForm(emptyTemplateForm);
  };

  const handleUpdateTemplate = (e) => {
    e.preventDefault();

    if (
      !templateForm.name ||
      !templateForm.category ||
      !templateForm.estimatedDuration
    ) {
      alert("Please fill template name, category, and estimated duration.");
      return;
    }

    setTemplates(
      templates.map((template) =>
        template.template_id === editingTemplate.template_id
          ? {
              ...template,
              name: templateForm.name,
              category: templateForm.category,
              duration: `${templateForm.estimatedDuration} Days`,
              status: templateForm.status,
              description:
                templateForm.description || "Framework template ready for use.",
            }
          : template
      )
    );

    closeEditBox();
  };

  const openDeleteBox = (template) => {
    setDeletingTemplate(template);
  };

  const closeDeleteBox = () => {
    setDeletingTemplate(null);
  };

  const handleDeleteTemplate = () => {
    setTemplates(
      templates.filter(
        (template) => template.template_id !== deletingTemplate.template_id
      )
    );

    closeDeleteBox();
  };

  const TemplateFormModal = ({ mode, onClose, onSubmit }) => (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100">
          <div>
            <h3 className="text-2xl font-black text-[#0b2a4a]">
              {mode === "create" ? "Create Template" : "Edit Template"}
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              {mode === "create"
                ? "Add a reusable project template for future client requests."
                : "Update template information and availability."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 text-slate-500 hover:bg-red-100 hover:text-red-600 transition flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-8 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Template Name
              </label>

              <input
                type="text"
                value={templateForm.name}
                onChange={(e) =>
                  setTemplateForm({
                    ...templateForm,
                    name: e.target.value,
                  })
                }
                placeholder="Enter template name"
                className="mt-2 w-full bg-slate-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#082b4f]"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Category
              </label>

              <select
                value={templateForm.category}
                onChange={(e) =>
                  setTemplateForm({
                    ...templateForm,
                    category: e.target.value,
                  })
                }
                className="mt-2 w-full bg-slate-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#082b4f]"
              >
                <option value="">Select category</option>
                <option value="Architecture">Architecture</option>
                <option value="Renovation">Renovation</option>
                <option value="Urban Planning">Urban Planning</option>
                <option value="Software">Software</option>
                <option value="AI">AI</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Estimated Duration
              </label>

              <input
                type="number"
                min="1"
                value={templateForm.estimatedDuration}
                onChange={(e) =>
                  setTemplateForm({
                    ...templateForm,
                    estimatedDuration: e.target.value,
                  })
                }
                placeholder="e.g. 90"
                className="mt-2 w-full bg-slate-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#082b4f]"
              />

              <p className="text-xs text-slate-400 mt-2">
                Duration is stored in days.
              </p>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Status
              </label>

              <select
                value={templateForm.status}
                onChange={(e) =>
                  setTemplateForm({
                    ...templateForm,
                    status: e.target.value,
                  })
                }
                className="mt-2 w-full bg-slate-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#082b4f]"
              >
                <option value="Draft">Draft</option>
                <option value="Verified">Verified</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Description
            </label>

            <textarea
              value={templateForm.description}
              onChange={(e) =>
                setTemplateForm({
                  ...templateForm,
                  description: e.target.value,
                })
              }
              placeholder="Describe the template purpose, workflow, and expected use..."
              className="mt-2 w-full h-32 bg-slate-100 rounded-xl px-4 py-3 text-sm outline-none resize-none focus:ring-2 focus:ring-[#082b4f]"
            ></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl bg-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-200 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#082b4f] text-white font-bold text-sm hover:opacity-90 transition"
            >
              {mode === "create" ? "Create Template" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const DeleteConfirmModal = () => (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 p-7">
        <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-5">
          <span className="material-symbols-outlined">delete</span>
        </div>

        <h3 className="text-2xl font-black text-[#0b2a4a]">
          Confirm Deletion
        </h3>

        <p className="text-slate-500 mt-3 leading-7">
          Are you sure you want to delete{" "}
          <span className="font-bold text-[#0b2a4a]">
            {deletingTemplate?.name}
          </span>
          ? This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3 mt-7">
          <button
            type="button"
            onClick={closeDeleteBox}
            className="px-5 py-3 rounded-xl bg-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-200 transition"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleDeleteTemplate}
            className="px-5 py-3 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition"
          >
            Confirm Deletion
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
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
              ? "System-wide architectural blueprints for automated operational scaling. Define structure, duration, and core metrics."
              : "Browse available project templates and use one to submit a project request."}
          </p>
        </div>

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

      {showCreateBox && (
        <TemplateFormModal
          mode="create"
          onClose={closeCreateBox}
          onSubmit={handleCreateTemplate}
        />
      )}

      {editingTemplate && (
        <TemplateFormModal
          mode="edit"
          onClose={closeEditBox}
          onSubmit={handleUpdateTemplate}
        />
      )}

      {deletingTemplate && <DeleteConfirmModal />}

      {isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
          {[
            ["Active Blueprints", templates.length, "+12%"],
            ["Avg Execution", "14 Days", "System optimized"],
            ["Global Utilization", "82%", "Capacity reached"],
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

      <section className="bg-white rounded-2xl shadow-sm border border-slate-100 mt-8 overflow-hidden">
        <div className="flex justify-between items-center px-6 py-5 border-b">
          <h3 className="font-black text-[#0b2a4a]">Project Templates</h3>

          <div className="flex gap-3 text-slate-400">
            <span className="material-symbols-outlined">filter_list</span>
            <span className="material-symbols-outlined">sort</span>
          </div>
        </div>

        <div className="hidden md:grid grid-cols-[1fr_150px_130px_120px_190px] px-6 py-4 text-[11px] uppercase tracking-widest text-slate-400 border-b">
          <p>Name</p>
          <p>Category</p>
          <p>Duration</p>
          <p>Status</p>
          <p>Actions</p>
        </div>

        {templates.map((template) => (
          <div
            key={template.template_id}
            className="grid grid-cols-1 md:grid-cols-[1fr_150px_130px_120px_190px] gap-3 items-center px-6 py-5 border-b last:border-b-0"
          >
            <div>
              <p className="font-bold text-[#0b2a4a]">{template.name}</p>
              <p className="text-xs text-slate-400">{template.description}</p>
            </div>

            <span className="text-xs bg-slate-100 rounded-full px-3 py-1 w-fit">
              {template.category}
            </span>

            <p className="text-sm font-bold">{template.duration}</p>

            <span
              className={`text-xs font-bold ${
                template.status === "Verified"
                  ? "text-green-700"
                  : "text-yellow-700"
              }`}
            >
              ● {template.status}
            </span>

            <div className="flex gap-2 items-center">
              {isClient && (
                <button
                  type="button"
                  onClick={() => handleUseTemplate(template)}
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
    </div>
  );
}

export default ProjectTemplatesContent;