import { useNavigate } from "react-router-dom";
import AppShell from "../components/layout/app-shell";
import { useAuth } from "../context/auth-context";

function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  const formatRole = (role) => {
    return String(role || "member")
      .replaceAll("_", " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "Not available";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "Not available";
    }

    return date.toLocaleDateString();
  };

  const accountDetails = [
    {
      label: "Full Name",
      value: user?.name || "User",
      icon: "badge",
    },
    {
      label: "Email Address",
      value: user?.email || "No email",
      icon: "alternate_email",
    },
    {
      label: "Role",
      value: formatRole(user?.role),
      icon: "admin_panel_settings",
    },
    {
      label: "Account Status",
      value: "Active",
      icon: "verified_user",
    },
    {
      label: "Created At",
      value: formatDate(user?.created_at || user?.createdAt),
      icon: "event",
    },
    {
      label: "User ID",
      value: user?.user_id || user?.id || "Not available",
      icon: "tag",
    },
  ];

  return (
    <AppShell activePage="Profile">
      <section className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-400 font-black">
              Account Settings
            </p>

            <h1 className="text-4xl md:text-5xl font-black text-[#0b2a4a] tracking-tight mt-2">
              Profile Settings
            </h1>

            <p className="text-base text-slate-500 mt-4 max-w-2xl leading-7">
              Review your account information, access role, and current profile
              details in SmartOps.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-fit px-6 py-3 rounded-xl bg-slate-100 text-[#082b4f] text-sm font-black hover:bg-slate-200 transition flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">
              arrow_back
            </span>
            Back
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[360px_1fr] gap-8">
          <div className="bg-[#082b4f] rounded-3xl p-8 text-white shadow-sm relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-24 h-24 rounded-3xl bg-white/10 border border-white/20 flex items-center justify-center text-4xl font-black">
                {userInitial}
              </div>

              <p className="text-xs uppercase tracking-widest text-blue-200 font-black mt-8">
                My Account
              </p>

              <h2 className="text-3xl font-black mt-3 leading-tight">
                {user?.name || "User"}
              </h2>

              <p className="text-blue-100 mt-3 break-all">
                {user?.email || "No email"}
              </p>

              <div className="flex flex-wrap gap-2 mt-6">
                <span className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-xs font-black uppercase tracking-widest">
                  {formatRole(user?.role)}
                </span>

                <span className="px-4 py-2 rounded-xl bg-green-400/20 border border-green-300/30 text-green-100 text-xs font-black uppercase tracking-widest">
                  Active
                </span>
              </div>
            </div>

            <div className="absolute -right-8 -bottom-8 opacity-10">
              <span className="material-symbols-outlined text-[160px]">
                account_circle
              </span>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
            <div className="flex items-start justify-between gap-4 mb-8">
              <div>
                <h3 className="text-2xl font-black text-[#0b2a4a]">
                  Account Information
                </h3>

                <p className="text-sm text-slate-500 mt-2 leading-6">
                  This information is connected to your authenticated SmartOps
                  account.
                </p>
              </div>

              <span className="material-symbols-outlined text-slate-300 text-4xl">
                manage_accounts
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {accountDetails.map((item) => (
                <ProfileInfoCard
                  key={item.label}
                  icon={item.icon}
                  label={item.label}
                  value={item.value}
                />
              ))}
            </div>

            <div className="mt-8 rounded-2xl bg-blue-50 border border-blue-100 p-5">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-white text-[#082b4f] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined">
                    info
                  </span>
                </div>

                <div>
                  <h4 className="font-black text-[#0b2a4a]">
                    Profile editing is restricted
                  </h4>

                  <p className="text-sm text-slate-500 mt-2 leading-6">
                    Email and role changes should be managed by an administrator
                    to keep the system secure and consistent.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}

function ProfileInfoCard({ icon, label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 border border-slate-100 p-5">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-white text-[#082b4f] flex items-center justify-center shadow-sm shrink-0">
          <span className="material-symbols-outlined text-[22px]">
            {icon}
          </span>
        </div>

        <div className="min-w-0">
          <p className="text-xs uppercase tracking-widest text-slate-400 font-black">
            {label}
          </p>

          <h4 className="text-base font-black text-[#0b2a4a] mt-1 break-words">
            {value}
          </h4>
        </div>
      </div>
    </div>
  );
}

export default Profile;