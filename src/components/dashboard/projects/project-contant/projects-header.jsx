import { useAuth } from "../../../../context/auth-context";

function ProjectsHeader() {
  const { user } = useAuth();

  const role = user?.role;

  const getHeaderContent = () => {
    if (role === "admin") {
      return {
        title: "Project Portfolio",
        subtitle: "Managing all company projects and client workspaces",
        badge: "Admin View",
      };
    }

    if (role === "client") {
      return {
        title: "My Projects",
        subtitle: "Track your approved projects, deadlines, and progress",
        badge: "Client View",
      };
    }

    if (role === "employee") {
      return {
        title: "Assigned Projects",
        subtitle: "Projects linked to your assigned tasks and responsibilities",
        badge: "Employee View",
      };
    }

    return {
      title: "Projects",
      subtitle: "Project overview and operational tracking",
      badge: "Member View",
    };
  };

  const header = getHeaderContent();

  return (
    <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-8">
      <div className="space-y-1">
        <h2 className="text-4xl font-extrabold text-primary tracking-tight">
          {header.title}
        </h2>

        <p className="text-slate-500 text-lg">
          {header.subtitle}
        </p>
      </div>

      <div className="flex items-center bg-surface-container-low rounded-xl p-1 w-fit">
        <button
          type="button"
          className="px-4 py-2 bg-white shadow-sm rounded-lg text-sm font-semibold text-primary"
        >
          {header.badge}
        </button>
      </div>
    </div>
  );
}

export default ProjectsHeader;