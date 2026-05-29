import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import compassLogo from "../../assets/compass-logo.svg";
import { useAuth } from "../../context/auth-context";

function AppShell({ children, activePage }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const links = [
    { label: "Dashboard", path: "/dashboard", icon: "dashboard" },
    { label: "Projects", path: "/projects", icon: "account_tree" },
    { label: "Tasks", path: "/tasks", icon: "check_box" },
    { label: "Requests", path: "/requests", icon: "approval" },
    { label: "Templates", path: "/templates", icon: "layers" },
    { label: "Notifications", path: "/notifications", icon: "notifications" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  const SidebarContent = () => (
    <>
      <div className="mb-10 flex items-center gap-3">
        <img
          src={compassLogo}
          alt="SmartOps Logo"
          className="w-10 h-10 object-contain"
        />

        <div className="flex flex-col leading-none">
          <h1 className="text-xl font-black text-[#0b2a9a]">SmartOps</h1>

          <p className="text-[11px] tracking-[0.25em] text-slate-400 uppercase mt-1">
            Management AI
          </p>
        </div>
      </div>

      <nav className="flex flex-col gap-2">
        {links.map((item) => {
          const isActive =
            activePage === item.label || location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold tracking-widest uppercase transition ${
                isActive
                  ? "bg-slate-50 text-blue-700"
                  : "text-slate-400 hover:bg-slate-50 hover:text-[#0b2a4a]"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="mt-auto border border-red-100 text-red-600 bg-red-50 rounded-xl px-5 py-3 text-sm font-bold hover:bg-red-100 transition"
        type="button"
      >
        Logout
      </button>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      <aside className="w-64 bg-white border-r border-slate-100 px-6 py-6 hidden lg:flex flex-col">
        <SidebarContent />
      </aside>

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-white z-50 px-6 py-6 flex flex-col transform transition-transform duration-300 lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 text-slate-500"
          type="button"
        >
          ✕
        </button>

        <SidebarContent />
      </aside>

      <div className="flex-1 min-w-0">
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-4 lg:px-10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#0b2a4a]"
            type="button"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>

          <div className="hidden md:flex w-full max-w-md bg-slate-50 rounded-lg px-4 py-2 items-center gap-2">
            <span className="material-symbols-outlined text-slate-400 text-[18px]">
              search
            </span>
            <input
              className="bg-transparent outline-none w-full text-sm placeholder:text-slate-400"
              placeholder="Search systems..."
            />
          </div>

          <div className="flex items-center gap-4 text-slate-500 ml-auto">
            <span className="material-symbols-outlined">notifications</span>
            <span className="material-symbols-outlined">settings</span>

            <div className="hidden sm:flex flex-col text-right leading-tight">
              <span className="text-xs font-bold text-slate-700">
                {user?.name || "User"}
              </span>
              <span className="text-[10px] uppercase text-slate-400">
                {user?.role || "member"}
              </span>
            </div>

            <div className="w-9 h-9 rounded-full bg-[#0b2a4a] text-white flex items-center justify-center text-sm font-bold">
              {userInitial}
            </div>

            <button
              onClick={handleLogout}
              className="hidden sm:flex items-center gap-1 text-xs font-bold text-red-500 hover:text-red-700"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">
                logout
              </span>
              Logout
            </button>
          </div>
        </header>

        <main className="p-4 lg:p-10">{children}</main>

        <footer className="px-4 lg:px-10 py-8 text-xs text-slate-400 flex flex-col md:flex-row justify-between gap-4">
          <p>
            <span className="font-bold text-[#0b2a4a]">SmartOps</span> <br />
            © 2024 SmartOps Architectural Systems
          </p>

          <div className="flex gap-6">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">API Docs</a>
            <a href="#">Support</a>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default AppShell;