import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import compassLogo from "../../assets/compass-logo.svg";
import { useAuth } from "../../context/auth-context";
import { useNotifications } from "../../context/notifications-context";

function AppShell({ children, activePage }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const settingsRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setSettingsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const links = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: "dashboard",
      roles: ["admin", "employee", "client"],
    },
    {
      label: "Projects",
      path: "/projects",
      icon: "account_tree",
      roles: ["admin", "employee", "client"],
    },
    {
      label: "Tasks",
      path: "/tasks",
      icon: "check_box",
      roles: ["admin", "employee"],
    },
    {
      label: "Requests",
      path: "/requests",
      icon: "approval",
      roles: ["admin", "client"],
    },
    {
      label: "Templates",
      path: "/templates",
      icon: "layers",
      roles: ["admin", "client"],
    },
    {
      label: "Notifications",
      path: "/notifications",
      icon: "notifications",
      roles: ["admin", "employee", "client"],
    },
    {
     label: "Users",
     path: "/users",
     icon: "groups",
     roles: ["admin"],
   },


  ];

  const visibleLinks = links.filter((item) => item.roles.includes(user?.role));

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  const formatRole = (role) => {
    return String(role || "member")
      .replaceAll("_", " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const NotificationBadge = () => {
    if (unreadCount <= 0) return null;

    return (
      <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center justify-center ring-2 ring-white">
        {unreadCount > 99 ? "99+" : unreadCount}
      </span>
    );
  };

  const TeamMember = ({ name, email }) => (
    <a
      href={`mailto:${email}`}
      className="group flex items-center gap-3 text-xs text-slate-500 hover:text-[#0b2a4a] transition-colors"
    >
      <span className="w-8 h-8 rounded-xl bg-slate-100 text-[#0b2a4a] flex items-center justify-center group-hover:bg-[#0b2a4a] group-hover:text-white transition-colors">
        <span className="material-symbols-outlined text-[17px]">person</span>
      </span>

      <span className="font-bold">{name}</span>
    </a>
  );

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
        {visibleLinks.map((item) => {
          const isActive =
            activePage === item.label || location.pathname === item.path;

          const isNotificationsLink = item.label === "Notifications";

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold tracking-widest uppercase transition ${
                isActive
                  ? "bg-slate-50 text-blue-700"
                  : "text-slate-400 hover:bg-slate-50 hover:text-[#0b2a4a]"
              }`}
            >
              <span className="relative material-symbols-outlined text-[20px]">
                {item.icon}

                {isNotificationsLink && unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-2.5 h-2.5 rounded-full bg-red-600 ring-2 ring-white" />
                )}
              </span>

              <span className="flex-1">{item.label}</span>

              {isNotificationsLink && unreadCount > 0 && (
                <span className="min-w-[22px] h-5 px-1 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center justify-center">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
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

          <div className="hidden md:flex w-full max-w-md items-center">
            <div className="flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-100 px-4 py-2.5 text-[#082b4f]">
              <span className="material-symbols-outlined text-[18px]">
                dashboard_customize
              </span>

              <span className="text-xs font-black uppercase tracking-widest">
                SmartOps Workspace
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-slate-500 ml-auto">
            <Link
              to="/notifications"
              className="relative w-11 h-11 rounded-xl bg-slate-100 text-[#082b4f] hover:bg-slate-200 transition flex items-center justify-center"
              title="Notifications"
            >
              <span
                className="material-symbols-outlined text-[24px]"
                style={
                  unreadCount > 0
                    ? { fontVariationSettings: "'FILL' 1" }
                    : undefined
                }
              >
                notifications
              </span>

              <NotificationBadge />
            </Link>

            <div ref={settingsRef} className="relative">
              <button
                type="button"
                onClick={() => setSettingsOpen((prev) => !prev)}
                className="w-11 h-11 rounded-xl bg-slate-100 text-[#082b4f] hover:bg-slate-200 transition flex items-center justify-center"
                title="Account settings"
              >
                <span className="material-symbols-outlined text-[24px]">
                  settings
                </span>
              </button>

              {settingsOpen && (
                <div className="absolute right-0 top-14 w-80 bg-white rounded-2xl border border-slate-100 shadow-2xl z-50 overflow-hidden">
                  <div className="p-5 border-b border-slate-100 bg-slate-50/60">
                    <p className="text-xs uppercase tracking-widest text-slate-400 font-black">
                      My Account
                    </p>

                    <div className="flex items-center gap-4 mt-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#082b4f] text-white flex items-center justify-center text-lg font-black shrink-0">
                        {userInitial}
                      </div>

                      <div className="min-w-0">
                        <h3 className="text-lg font-black text-[#0b2a4a] truncate">
                          {user?.name || "User"}
                        </h3>

                        <p className="text-sm text-slate-500 truncate">
                          {user?.email || "No email"}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                      <span className="inline-flex px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-widest">
                        {formatRole(user?.role)}
                      </span>

                      <span className="inline-flex px-3 py-1 rounded-full bg-green-50 text-green-700 text-[10px] font-black uppercase tracking-widest">
                        Active
                      </span>
                    </div>
                  </div>

                  <div className="p-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSettingsOpen(false);
                        navigate("/profile");
                      }}
                      className="w-full px-4 py-3 rounded-xl text-left text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-[#082b4f] transition flex items-center gap-3"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        person
                      </span>
                      Profile Settings
                    </button>

                    <div className="h-px bg-slate-100 my-2" />

                    <button
                      type="button"
                      onClick={() => {
                        setSettingsOpen(false);
                        handleLogout();
                      }}
                      className="w-full px-4 py-3 rounded-xl text-left text-sm font-black text-red-600 hover:bg-red-50 transition flex items-center gap-3"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        logout
                      </span>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="hidden sm:flex flex-col text-right leading-tight">
              <span className="text-xs font-bold text-slate-700">
                {user?.name || "User"}
              </span>

              <span className="text-[10px] uppercase text-slate-400">
                {formatRole(user?.role)}
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

        <footer className="px-4 lg:px-10 py-8 border-t border-slate-100 bg-white/70">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
            <div className="flex items-start gap-4 max-w-xl">
              <div className="w-12 h-12 rounded-2xl bg-[#0b2a4a] text-white flex items-center justify-center shadow-lg shadow-blue-900/10 shrink-0">
                <span className="material-symbols-outlined text-[22px]">
                  architecture
                </span>
              </div>

              <div>
                <h3 className="text-base font-black text-[#0b2a4a] tracking-tight">
                  SmartOps
                </h3>

                <p className="text-xs text-slate-400 mt-1">
                  © 2026 SmartOps Architectural Systems
                </p>

                <p className="text-xs text-slate-500 mt-2 leading-5">
                  Full-stack project management platform for projects, tasks,
                  requests, and real-time notifications.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 xl:gap-14">
              <div>
                <p className="text-[10px] font-black text-[#0b2a4a] uppercase tracking-[0.2em] mb-3">
                  Development Team
                </p>

                <div className="space-y-2">
                  <TeamMember
                    name="Mahmoud Asmar"
                    email="asmr7572@gmail.com"
                  />
                  <TeamMember name="Yousef Hanaa" email="yousef@example.com" />
                </div>
              </div>

              <div>
                <p className="text-[10px] font-black text-[#0b2a4a] uppercase tracking-[0.2em] mb-3">
                  Quick Links
                </p>

                <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-bold text-slate-400">
                  <span className="hover:text-[#0b2a4a] transition-colors cursor-pointer">
                    Privacy
                  </span>
                  <span className="hover:text-[#0b2a4a] transition-colors cursor-pointer">
                    Terms
                  </span>
                  <span className="hover:text-[#0b2a4a] transition-colors cursor-pointer">
                    API Docs
                  </span>
                  <span className="hover:text-[#0b2a4a] transition-colors cursor-pointer">
                    Support
                  </span>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default AppShell;