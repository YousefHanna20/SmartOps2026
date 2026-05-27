import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import compassLogo from "../../assets/compass-logo.svg";

function AppShell({ children, activePage }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const links = [
    { label: "Dashboard", path: "/dashboard", icon: "dashboard" },
    { label: "Projects", path: "/projects", icon: "account_tree" },
    { label: "Tasks", path: "/tasks", icon: "check_box" },
    { label: "Requests", path: "/requests", icon: "approval" },
    { label: "Templates", path: "/templates", icon: "layers" },
    { label: "Notifications", path: "/notifications", icon: "notifications" },
  ];

  const SidebarContent = () => (
    <>
      <div className="mb-10 flex items-center gap-3">
        <img
          src={compassLogo}
          alt="SmartOps Logo"
          className="w-10 h-10 object-contain"
        />

        <div className="flex flex-col leading-none">
          <h1 className="text-2xl font-black text-[#0b2a4a]">SmartOps</h1>
          <p className="text-[10px] tracking-[0.25em] text-slate-400 uppercase mt-1">
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

      <button className="mt-auto bg-red-50 text-red-600 rounded-xl px-5 py-3 text-sm font-bold hover:bg-red-100 transition">
        Log Out
      </button>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-100 px-6 py-6 hidden lg:flex flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-white z-50 px-6 py-6 flex flex-col transform transition-transform duration-300 lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 text-slate-500"
        >
          ✕
        </button>

        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-4 lg:px-10">
          {/* Mobile menu button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#0b2a4a]"
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
            <div className="w-9 h-9 rounded-full bg-[#0b2a4a] text-white flex items-center justify-center text-sm font-bold">
              Y
            </div>
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