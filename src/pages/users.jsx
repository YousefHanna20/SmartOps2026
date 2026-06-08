import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import AppShell from "../components/layout/app-shell";
import { useAuth } from "../context/auth-context";
import { getUsers, createUser, deleteUser } from "../services/user-service";

import Toast from "../components/common/toast";
import useToast from "../hooks/use-toast";
import LoadingState from "../components/common/loading-state";
import ErrorState from "../components/common/error-state";
import EmptyState from "../components/common/empty-state";
import ConfirmModal from "../components/common/confirm-modal";

const createUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),

  email: z.string().trim().email("Please enter a valid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be less than 100 characters"),

  role: z.enum(["admin", "employee", "client"], {
    required_error: "Role is required",
  }),
});

function Users() {
  const { user } = useAuth();

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [usersError, setUsersError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const [userToDelete, setUserToDelete] = useState(null);
  const [deletingUserId, setDeletingUserId] = useState(null);

  const { toast, showToast, hideToast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createUserSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "employee",
    },
  });

  const loadUsers = async () => {
    setLoadingUsers(true);
    setUsersError("");

    try {
      const data = await getUsers();
      setUsers(data.users || data.data || []);
    } catch (error) {
      setUsersError(error.response?.data?.message || "Failed to load users.");
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const getUserId = (item) => item.user_id || item.id;

  const formatRole = (role) => {
    return String(role || "member")
      .replaceAll("_", " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const getRoleClass = (role) => {
    if (role === "admin") return "bg-red-100 text-red-700";
    if (role === "employee") return "bg-blue-100 text-blue-700";
    return "bg-green-100 text-green-700";
  };

  const filteredUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return users.filter((item) => {
      const role = item.role || "client";

      const matchesSearch =
        !query ||
        [
          getUserId(item),
          item.name,
          item.email,
          item.role,
          item.created_at,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(query);

      const matchesRole = roleFilter === "all" || role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

  const stats = useMemo(() => {
    return {
      total: users.length,
      admins: users.filter((item) => item.role === "admin").length,
      employees: users.filter((item) => item.role === "employee").length,
      clients: users.filter((item) => item.role === "client").length,
    };
  }, [users]);

  const hasActiveFilters = searchQuery || roleFilter !== "all";

  const resetFilters = () => {
    setSearchQuery("");
    setRoleFilter("all");
  };

  const openCreateModal = () => {
    reset({
      name: "",
      email: "",
      password: "",
      role: "employee",
    });

    setCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    if (isSubmitting) return;
    setCreateModalOpen(false);
  };

  const handleCreateUser = async (formData) => {
    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
      };

      const data = await createUser(payload);

      const createdUser = data.user || data.data;

      if (createdUser) {
        setUsers((prevUsers) => [createdUser, ...prevUsers]);
      } else {
        await loadUsers();
      }

      setCreateModalOpen(false);
      reset();

      showToast("success", "User created successfully.");
    } catch (error) {
      const responseData = error.response?.data;

      if (responseData?.errors) {
        responseData.errors.forEach((err) => {
          setError(err.field || "root", {
            type: "server",
            message: err.message,
          });
        });
      } else {
        setError("root", {
          type: "server",
          message: responseData?.message || "Failed to create user.",
        });
      }

      showToast(
        "error",
        responseData?.message || "Failed to create user. Please try again."
      );
    }
  };

  const openDeleteModal = (item) => {
    setUserToDelete(item);
  };

  const closeDeleteModal = () => {
    if (deletingUserId) return;
    setUserToDelete(null);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;

    const selectedUserId = getUserId(userToDelete);

    if (Number(selectedUserId) === Number(user?.user_id || user?.id)) {
      showToast("warning", "You cannot delete your own account.");
      setUserToDelete(null);
      return;
    }

    setDeletingUserId(selectedUserId);

    try {
      await deleteUser(selectedUserId);

      setUsers((prevUsers) =>
        prevUsers.filter((item) => Number(getUserId(item)) !== Number(selectedUserId))
      );

      setUserToDelete(null);
      showToast("success", "User deleted successfully.");
    } catch (error) {
      showToast(
        "error",
        error.response?.data?.message || "Failed to delete user."
      );
    } finally {
      setDeletingUserId(null);
    }
  };

  if (loadingUsers) {
    return (
      <AppShell activePage="Users">
        <LoadingState type="table" rows={5} />
      </AppShell>
    );
  }

  if (usersError) {
    return (
      <AppShell activePage="Users">
        <ErrorState
          title="Failed to load users"
          message={usersError}
          actionLabel="Try Again"
          onAction={loadUsers}
        />
      </AppShell>
    );
  }

  return (
    <AppShell activePage="Users">
      <Toast type={toast.type} message={toast.message} onClose={hideToast} />

      <ConfirmModal
        isOpen={!!userToDelete}
        title="Delete user?"
        description={
          userToDelete
            ? `Are you sure you want to delete "${userToDelete.name}"? This action cannot be undone.`
            : ""
        }
        confirmLabel="Delete User"
        cancelLabel="Cancel"
        type="danger"
        loading={!!deletingUserId}
        onConfirm={confirmDeleteUser}
        onCancel={closeDeleteModal}
      />

      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-400 font-black">
                  Admin Console
                </p>

                <h2 className="text-2xl font-black text-[#0b2a4a] mt-2">
                  Create New User
                </h2>

                <p className="text-sm text-slate-500 mt-2">
                  Create employee, client, or admin accounts from a protected admin area.
                </p>
              </div>

              <button
                type="button"
                onClick={closeCreateModal}
                className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit(handleCreateUser)} className="p-6 space-y-5">
              {errors.root && (
                <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600 font-bold">
                  {errors.root.message}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-[#0b2a4a] mb-2">
                    Full Name
                  </label>

                  <input
                    type="text"
                    placeholder="Enter full name"
                    className="w-full bg-slate-100 rounded-xl px-4 py-3 outline-none border border-transparent focus:border-[#082b4f]"
                    {...register("name")}
                  />

                  {errors.name && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#0b2a4a] mb-2">
                    Email Address
                  </label>

                  <input
                    type="email"
                    placeholder="user@example.com"
                    className="w-full bg-slate-100 rounded-xl px-4 py-3 outline-none border border-transparent focus:border-[#082b4f]"
                    {...register("email")}
                  />

                  {errors.email && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-[#0b2a4a] mb-2">
                    Temporary Password
                  </label>

                  <input
                    type="password"
                    placeholder="Minimum 8 characters"
                    className="w-full bg-slate-100 rounded-xl px-4 py-3 outline-none border border-transparent focus:border-[#082b4f]"
                    {...register("password")}
                  />

                  {errors.password && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#0b2a4a] mb-2">
                    Role
                  </label>

                  <select
                    className="w-full bg-slate-100 rounded-xl px-4 py-3 outline-none border border-transparent focus:border-[#082b4f]"
                    {...register("role")}
                  >
                    <option value="employee">Employee</option>
                    <option value="client">Client</option>
                    <option value="admin">Admin</option>
                  </select>

                  {errors.role && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.role.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="rounded-2xl bg-blue-50 border border-blue-100 p-4">
                <p className="text-sm text-slate-600 leading-6">
                  <span className="font-black text-[#0b2a4a]">Security note:</span>{" "}
                  Normal registration should create clients only. Employee and admin accounts should be created here by an admin.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeCreateModal}
                  disabled={isSubmitting}
                  className="px-6 py-3 rounded-xl border border-slate-200 text-slate-500 font-bold hover:bg-slate-50 transition disabled:opacity-60"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-7 py-3 rounded-xl bg-[#082b4f] text-white font-bold hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Creating..." : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <section className="space-y-8">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-400 font-black">
              Administration
            </p>

            <h1 className="text-4xl md:text-5xl font-black text-[#0b2a4a] tracking-tight mt-2">
              Users Management
            </h1>

            <p className="text-base text-slate-500 mt-4 max-w-3xl leading-7">
              Manage system users, roles, employee access, and client accounts from one protected admin workspace.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={loadUsers}
              className="px-6 py-3 rounded-xl bg-slate-100 text-[#082b4f] text-sm font-black hover:bg-slate-200 transition flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">
                refresh
              </span>
              Refresh
            </button>

            <button
              type="button"
              onClick={openCreateModal}
              className="px-6 py-3 rounded-xl bg-[#082b4f] text-white text-sm font-black hover:opacity-90 transition flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">
                person_add
              </span>
              Create User
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <StatCard label="Total Users" value={stats.total} icon="groups" />
          <StatCard label="Admins" value={stats.admins} icon="shield" tone="red" />
          <StatCard label="Employees" value={stats.employees} icon="engineering" tone="blue" />
          <StatCard label="Clients" value={stats.clients} icon="person" tone="green" />
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 space-y-5">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-[#0b2a4a]">
                  System Users
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Showing {filteredUsers.length} of {users.length} users.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px_auto] gap-4 items-end">
              <div>
                <label className="block text-xs uppercase tracking-widest text-slate-400 font-black mb-2">
                  Search Users
                </label>

                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search by name, email, role, or ID..."
                    className="w-full bg-slate-100 rounded-xl px-4 py-3 pl-11 text-sm outline-none border border-transparent focus:border-[#082b4f]"
                  />

                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
                    search
                  </span>

                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 transition"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-slate-400 font-black mb-2">
                  Role
                </label>

                <select
                  value={roleFilter}
                  onChange={(event) => setRoleFilter(event.target.value)}
                  className="w-full bg-slate-100 rounded-xl px-4 py-3 text-sm font-bold outline-none border border-transparent focus:border-[#082b4f]"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admins</option>
                  <option value="employee">Employees</option>
                  <option value="client">Clients</option>
                </select>
              </div>

              <button
                type="button"
                onClick={resetFilters}
                className="px-5 py-3 rounded-xl bg-slate-100 text-[#082b4f] text-sm font-black hover:bg-slate-200 transition flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">
                  restart_alt
                </span>
                Reset
              </button>
            </div>

            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2">
                {searchQuery && (
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-black">
                    Search: {searchQuery}
                  </span>
                )}

                {roleFilter !== "all" && (
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-black">
                    Role: {formatRole(roleFilter)}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {["User", "Email", "Role", "Status", "Created", "Actions"].map(
                    (item) => (
                      <th
                        key={item}
                        className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400"
                      >
                        {item}
                      </th>
                    )
                  )}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50">
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan="6">
                      <EmptyState
                        icon="group_off"
                        title="No matching users found"
                        description={
                          hasActiveFilters
                            ? "Try changing the search text or resetting the filters."
                            : "Users will appear here after accounts are created."
                        }
                      />
                    </td>
                  </tr>
                )}

                {filteredUsers.map((item) => {
                  const itemId = getUserId(item);
                  const isCurrentUser =
                    Number(itemId) === Number(user?.user_id || user?.id);

                  return (
                    <tr key={itemId} className="hover:bg-slate-50/70 transition">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <Avatar name={item.name} />

                          <div>
                            <p className="text-base font-black text-[#0b2a4a]">
                              {item.name || "Unnamed User"}
                            </p>

                            <p className="text-xs text-slate-400 font-bold">
                              ID: {itemId}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5 text-sm font-bold text-slate-600">
                        {item.email || "No email"}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`px-4 py-2 rounded-full text-xs font-black uppercase ${getRoleClass(
                            item.role
                          )}`}
                        >
                          {formatRole(item.role)}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <span className="px-4 py-2 rounded-full text-xs font-black uppercase bg-green-50 text-green-700">
                          Active
                        </span>
                      </td>

                      <td className="px-6 py-5 text-sm font-bold text-slate-500">
                        {formatDate(item.created_at)}
                      </td>

                      <td className="px-6 py-5 text-right">
                        <button
                          type="button"
                          onClick={() => openDeleteModal(item)}
                          disabled={isCurrentUser}
                          className="w-10 h-10 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
                          title={
                            isCurrentUser
                              ? "You cannot delete your own account"
                              : "Delete user"
                          }
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            delete
                          </span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="lg:hidden divide-y divide-slate-100">
            {filteredUsers.length === 0 && (
              <EmptyState
                icon="group_off"
                title="No matching users found"
                description={
                  hasActiveFilters
                    ? "Try changing the search text or resetting the filters."
                    : "Users will appear here after accounts are created."
                }
              />
            )}

            {filteredUsers.map((item) => {
              const itemId = getUserId(item);
              const isCurrentUser =
                Number(itemId) === Number(user?.user_id || user?.id);

              return (
                <div key={itemId} className="p-5">
                  <div className="flex items-start gap-4">
                    <Avatar name={item.name} />

                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-black text-[#0b2a4a] truncate">
                        {item.name || "Unnamed User"}
                      </h3>

                      <p className="text-sm text-slate-500 truncate mt-1">
                        {item.email || "No email"}
                      </p>

                      <div className="flex flex-wrap gap-2 mt-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-black uppercase ${getRoleClass(
                            item.role
                          )}`}
                        >
                          {formatRole(item.role)}
                        </span>

                        <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-green-50 text-green-700">
                          Active
                        </span>
                      </div>

                      <p className="text-xs text-slate-400 mt-4 font-bold">
                        ID: {itemId} · Created: {formatDate(item.created_at)}
                      </p>

                      <button
                        type="button"
                        onClick={() => openDeleteModal(item)}
                        disabled={isCurrentUser}
                        className="mt-4 px-4 py-2 rounded-xl bg-red-50 text-red-600 text-xs font-black hover:bg-red-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Delete User
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </AppShell>
  );
}

function StatCard({ label, value, icon, tone = "slate" }) {
  const toneClasses = {
    slate: "bg-slate-50 text-[#0b2a4a]",
    red: "bg-red-50 text-red-700",
    blue: "bg-blue-50 text-blue-700",
    green: "bg-green-50 text-green-700",
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
          toneClasses[tone] || toneClasses.slate
        }`}
      >
        <span className="material-symbols-outlined">{icon}</span>
      </div>

      <p className="text-xs uppercase tracking-widest text-slate-400 font-black mt-5">
        {label}
      </p>

      <h3 className="text-4xl font-black text-[#0b2a4a] mt-2">{value}</h3>
    </div>
  );
}

function Avatar({ name }) {
  const initial = name ? name.charAt(0).toUpperCase() : "U";

  return (
    <div className="w-12 h-12 rounded-2xl bg-[#082b4f] text-white flex items-center justify-center font-black shrink-0">
      {initial}
    </div>
  );
}

function formatDate(dateValue) {
  if (!dateValue) return "Not available";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) return "Not available";

  return date.toLocaleDateString();
}

export default Users;