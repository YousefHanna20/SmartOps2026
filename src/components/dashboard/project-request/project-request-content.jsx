import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../../context/auth-context";
import {
  getProjectRequests,
  approveProjectRequest,
  rejectProjectRequest,
  deleteProjectRequest,
} from "../../../services/project-request-service";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import Toast from "../../common/toast";
import useToast from "../../../hooks/use-toast";
import ConfirmModal from "../../common/confirm-modal";
import EmptyState from "../../common/empty-state";
import ErrorState from "../../common/error-state";
import LoadingState from "../../common/loading-state";

const rejectRequestSchema = z.object({
  rejection_reason: z
    .string()
    .trim()
    .min(1, "Rejection reason is required")
    .min(2, "Rejection reason must be at least 2 characters"),
});

function ProjectRequestContent() {
  const { user } = useAuth();

  const role = user?.role;
  const isAdmin = role === "admin";
  const isClient = role === "client";

  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [requestsError, setRequestsError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [rejectingRequest, setRejectingRequest] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [deletingRequest, setDeletingRequest] = useState(null);
  const [approvingRequest, setApprovingRequest] = useState(null);

  const { toast, showToast, hideToast } = useToast();

  const getRequestId = (request) => {
    return request.request_id || request.id;
  };

  const getProjectName = (request) => {
    return request.project_name || request.projectName || "Untitled Request";
  };

  const getClientName = (request) => {
    return (
      request.client_name ||
      request.client ||
      request.clientName ||
      "Client"
    );
  };

  const getTemplateName = (request) => {
    return (
      request.template_name ||
      request.template ||
      request.templateName ||
      "No template"
    );
  };

  const getCategory = (request) => {
    return request.category || "Uncategorized";
  };

  const getStatus = (request) => {
    return request.status || "pending";
  };

  const normalizeStatus = (status) => {
    return String(status || "pending").toLowerCase();
  };

  const getStatusStyle = (status) => {
    const normalizedStatus = normalizeStatus(status);

    if (normalizedStatus === "approved") {
      return "bg-green-100 text-green-700";
    }

    if (normalizedStatus === "rejected") {
      return "bg-red-100 text-red-700";
    }

    return "bg-yellow-100 text-yellow-700";
  };

  const formatStatus = (status) => {
    const normalizedStatus = normalizeStatus(status);

    if (normalizedStatus === "approved") return "Approved";
    if (normalizedStatus === "rejected") return "Rejected";

    return "Pending";
  };

  const loadRequests = async () => {
    setLoadingRequests(true);
    setRequestsError("");

    try {
      const data = await getProjectRequests();
      setRequests(data.requests || data.projectRequests || []);
    } catch (error) {
      setRequestsError(
        error.response?.data?.message || "Failed to load project requests."
      );
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const filteredRequests = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return requests.filter((request) => {
      const status = normalizeStatus(getStatus(request));

      const matchesSearch =
        !query ||
        [
          getRequestId(request),
          getProjectName(request),
          getClientName(request),
          getCategory(request),
          getTemplateName(request),
          request.description,
          request.deadline,
          request.rejection_reason,
          status,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(query);

      const matchesStatus = statusFilter === "all" || status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [requests, searchQuery, statusFilter]);

  const pendingRequests = useMemo(() => {
    return filteredRequests.filter(
      (request) => normalizeStatus(getStatus(request)) === "pending"
    );
  }, [filteredRequests]);

  const approvedRequests = useMemo(() => {
    return filteredRequests.filter(
      (request) => normalizeStatus(getStatus(request)) === "approved"
    );
  }, [filteredRequests]);

  const rejectedRequests = useMemo(() => {
    return filteredRequests.filter(
      (request) => normalizeStatus(getStatus(request)) === "rejected"
    );
  }, [filteredRequests]);

  const reviewedRequests = useMemo(() => {
    return [...approvedRequests, ...rejectedRequests];
  }, [approvedRequests, rejectedRequests]);

  const totalApprovedRequests = useMemo(() => {
    return requests.filter(
      (request) => normalizeStatus(getStatus(request)) === "approved"
    );
  }, [requests]);

  const approvalRate = useMemo(() => {
    if (filteredRequests.length === 0) return "0%";

    const rate = Math.round(
      (approvedRequests.length / filteredRequests.length) * 100
    );

    return `${rate}%`;
  }, [filteredRequests.length, approvedRequests.length]);

  const hasActiveFilters = searchQuery || statusFilter !== "all";

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
  };

  const openApproveRequestModal = (request) => {
    setApprovingRequest(request);
  };

  const closeApproveRequestModal = () => {
    if (actionLoadingId) return;
    setApprovingRequest(null);
  };

  const confirmApproveRequest = async () => {
    if (!approvingRequest) return;

    const requestId = getRequestId(approvingRequest);

    setActionLoadingId(requestId);

    try {
      await approveProjectRequest(requestId);
      await loadRequests();

      setApprovingRequest(null);
      showToast("success", "Project request approved successfully.");
    } catch (error) {
      showToast(
        "error",
        error.response?.data?.message || "Failed to approve request."
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRejectClick = (request) => {
    setRejectingRequest(request);
  };

  const handleCancelReject = () => {
    if (actionLoadingId) return;
    setRejectingRequest(null);
  };

  const openDeleteRequestModal = (request) => {
    setDeletingRequest(request);
  };

  const closeDeleteRequestModal = () => {
    if (actionLoadingId) return;
    setDeletingRequest(null);
  };

  const confirmDeleteRequest = async () => {
    if (!deletingRequest) return;

    const requestId = getRequestId(deletingRequest);

    setActionLoadingId(requestId);

    try {
      await deleteProjectRequest(requestId);

      setRequests((prevRequests) =>
        prevRequests.filter((request) => getRequestId(request) !== requestId)
      );

      setDeletingRequest(null);
      showToast("success", "Project request deleted successfully.");
    } catch (error) {
      showToast(
        "error",
        error.response?.data?.message || "Failed to delete request."
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  const RejectRequestForm = ({ request }) => {
    const requestId = getRequestId(request);
    const isActionLoading = actionLoadingId === requestId;

    const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
      setError,
      reset,
    } = useForm({
      resolver: zodResolver(rejectRequestSchema),
      mode: "onBlur",
      defaultValues: {
        rejection_reason: "",
      },
    });

    const onSubmit = async (formData) => {
      setActionLoadingId(requestId);

      try {
        await rejectProjectRequest(
          requestId,
          formData.rejection_reason.trim()
        );

        reset();
        setRejectingRequest(null);

        await loadRequests();

        showToast("success", "Project request rejected successfully.");
      } catch (error) {
        const responseData = error.response?.data;

        if (responseData?.errors) {
          responseData.errors.forEach((err) => {
            setError(err.field || "root", {
              type: "server",
              message: err.message,
            });
          });

          showToast("error", "Please check the rejection reason.");
        } else {
          const message =
            responseData?.message || "Failed to reject project request.";

          setError("root", {
            type: "server",
            message,
          });

          showToast("error", message);
        }
      } finally {
        setActionLoadingId(null);
      }
    };

    return (
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-5 bg-red-50 border border-red-100 rounded-2xl p-5"
      >
        {errors.root && (
          <div className="rounded-xl bg-white border border-red-200 px-4 py-3 text-sm text-red-600 mb-4">
            {errors.root.message}
          </div>
        )}

        <label
          htmlFor={`rejection-reason-${requestId}`}
          className="text-xs font-black uppercase tracking-widest text-red-400"
        >
          Reason for Rejection
        </label>

        <textarea
          id={`rejection-reason-${requestId}`}
          className="mt-3 w-full h-28 bg-white border border-red-100 rounded-xl px-4 py-3 text-base outline-none resize-none focus:border-red-400"
          placeholder="Provide a clear reason for rejecting this request..."
          {...register("rejection_reason")}
        />

        {errors.rejection_reason && (
          <p className="text-xs text-red-600 mt-2 font-semibold">
            {errors.rejection_reason.message}
          </p>
        )}

        <div className="flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={handleCancelReject}
            disabled={isSubmitting || isActionLoading}
            className="px-5 py-3 rounded-xl text-sm font-black bg-white border border-slate-200 text-slate-500 hover:bg-slate-100 transition disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting || isActionLoading}
            className="px-5 py-3 rounded-xl text-sm font-black bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting || isActionLoading
              ? "Rejecting..."
              : "Confirm Rejection"}
          </button>
        </div>
      </form>
    );
  };

  const RequestCard = ({ request }) => {
    const requestId = getRequestId(request);
    const status = getStatus(request);
    const normalizedStatus = normalizeStatus(status);

    const isRejecting = rejectingRequest
      ? getRequestId(rejectingRequest) === requestId
      : false;

    const isActionLoading = actionLoadingId === requestId;

    return (
      <div className="border border-slate-100 rounded-2xl p-6 hover:bg-slate-50/60 transition">
        <div className="flex flex-col xl:flex-row justify-between gap-5">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <p className="font-black text-[#0b2a4a] text-xl leading-7">
                {getProjectName(request)}
              </p>

              <span
                className={`px-4 py-2 rounded-full text-xs font-black uppercase ${getStatusStyle(
                  status
                )}`}
              >
                {formatStatus(status)}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mt-4">
              <InfoLine label="Client" value={getClientName(request)} />
              <InfoLine label="Category" value={getCategory(request)} />
              <InfoLine label="Template" value={getTemplateName(request)} />
              <InfoLine label="Deadline" value={request.deadline || "Not set"} />
            </div>

            {request.description && (
              <p className="text-base text-slate-500 mt-5 max-w-4xl leading-7">
                {request.description}
              </p>
            )}

            {normalizedStatus === "rejected" && request.rejection_reason && (
              <div className="mt-5 bg-red-50 border border-red-100 rounded-2xl p-4">
                <p className="text-xs font-black uppercase tracking-widest text-red-500">
                  Rejection Reason
                </p>

                <p className="text-sm text-red-600 mt-2 leading-6">
                  {request.rejection_reason}
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-3 h-fit shrink-0">
            {isAdmin && normalizedStatus === "pending" && (
              <>
                <button
                  type="button"
                  onClick={() => handleRejectClick(request)}
                  disabled={isActionLoading}
                  className="px-5 py-3 rounded-xl text-sm font-black text-[#0b2a4a] bg-slate-100 hover:text-red-600 hover:bg-red-50 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Reject
                </button>

                <button
                  type="button"
                  onClick={() => openApproveRequestModal(request)}
                  disabled={isActionLoading}
                  className="px-5 py-3 rounded-xl text-sm font-black text-white bg-[#082b4f] hover:bg-[#061f39] transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isActionLoading ? "Processing..." : "Approve"}
                </button>
              </>
            )}

            {isClient && normalizedStatus === "pending" && (
              <button
                type="button"
                onClick={() => openDeleteRequestModal(request)}
                disabled={isActionLoading}
                className="px-5 py-3 rounded-xl text-sm font-black text-red-600 bg-red-50 hover:bg-red-100 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Delete
              </button>
            )}
          </div>
        </div>

        {isRejecting && <RejectRequestForm request={request} />}
      </div>
    );
  };

  if (loadingRequests) {
    return <LoadingState type="table" rows={4} />;
  }

  if (requestsError) {
    return (
      <ErrorState
        title="Failed to load requests"
        message={requestsError}
        actionLabel="Try Again"
        onAction={loadRequests}
      />
    );
  }

  return (
    <div>
      <Toast type={toast.type} message={toast.message} onClose={hideToast} />

      <ConfirmModal
        isOpen={!!approvingRequest}
        title="Approve request?"
        description={
          approvingRequest
            ? `Are you sure you want to approve "${getProjectName(
                approvingRequest
              )}"? This will convert the request into an active project.`
            : ""
        }
        confirmLabel="Approve Request"
        cancelLabel="Cancel"
        type="info"
        loading={!!actionLoadingId && !!approvingRequest}
        onConfirm={confirmApproveRequest}
        onCancel={closeApproveRequestModal}
      />

      <ConfirmModal
        isOpen={!!deletingRequest}
        title="Delete request?"
        description={
          deletingRequest
            ? `Are you sure you want to delete "${getProjectName(
                deletingRequest
              )}"? This action cannot be undone.`
            : ""
        }
        confirmLabel="Delete Request"
        cancelLabel="Cancel"
        type="danger"
        loading={!!actionLoadingId && !!deletingRequest}
        onConfirm={confirmDeleteRequest}
        onCancel={closeDeleteRequestModal}
      />

      <p className="text-xs uppercase tracking-widest text-slate-400 font-black">
        Strategic Operations
      </p>

      <div className="flex flex-col md:flex-row justify-between gap-4 mt-2">
        <div>
          <h2 className="text-4xl font-black text-[#0b2a4a] tracking-tight">
            Requests
          </h2>

          <p className="text-base text-slate-500 max-w-2xl mt-4 leading-7">
            Showing{" "}
            <span className="font-black text-[#0b2a4a]">
              {filteredRequests.length}
            </span>{" "}
            of{" "}
            <span className="font-black text-[#0b2a4a]">
              {requests.length}
            </span>{" "}
            project requests.
          </p>
        </div>

        <button
          type="button"
          onClick={loadRequests}
          className="bg-slate-100 text-[#082b4f] rounded-xl px-6 py-3 font-black text-sm h-fit hover:bg-slate-200 transition flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">
            refresh
          </span>
          Refresh
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-5 mt-8 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px_auto] gap-4 items-end">
          <div>
            <label
              htmlFor="request-search"
              className="block text-xs uppercase tracking-widest text-slate-400 font-black mb-2"
            >
              Search Requests
            </label>

            <div className="relative">
              <input
                id="request-search"
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by project name, client, category, template, status, or description..."
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
            <label
              htmlFor="request-status-filter"
              className="block text-xs uppercase tracking-widest text-slate-400 font-black mb-2"
            >
              Status
            </label>

            <select
              id="request-status-filter"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="w-full bg-slate-100 rounded-xl px-4 py-3 text-sm font-bold outline-none border border-transparent focus:border-[#082b4f]"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
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
          <div className="flex flex-wrap gap-2 mt-4">
            {searchQuery && (
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-black">
                Search: {searchQuery}
              </span>
            )}

            {statusFilter !== "all" && (
              <span className="px-3 py-1 rounded-full bg-yellow-50 text-yellow-700 text-xs font-black">
                Status: {formatStatus(statusFilter)}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 mt-8">
        <section className="bg-white rounded-2xl p-7 shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-7">
            <div>
              <h3 className="font-black text-[#0b2a4a] text-2xl">
                {isAdmin ? "Pending Approval" : "Pending Requests"}
              </h3>

              <p className="text-sm text-slate-400 uppercase tracking-widest mt-1 font-black">
                {isAdmin ? "Administrator Console" : "Client Console"}
              </p>
            </div>

            <span className="material-symbols-outlined text-slate-400 text-3xl">
              filter_list
            </span>
          </div>

          <div className="space-y-5">
            {pendingRequests.length === 0 && (
              <EmptyState
                icon="pending_actions"
                title="No pending requests"
                description={
                  hasActiveFilters
                    ? "No pending requests match your current search or filters."
                    : isAdmin
                    ? "Client project requests will appear here for approval."
                    : "Your pending project requests will appear here."
                }
              />
            )}

            {pendingRequests.map((request) => (
              <RequestCard key={getRequestId(request)} request={request} />
            ))}
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            ["Visible Requests", filteredRequests.length],
            ["Pending", pendingRequests.length],
            ["Approval Rate", approvalRate],
          ].map(([label, value]) => (
            <div
              key={label}
              className="bg-white rounded-2xl p-7 border border-slate-100 shadow-sm"
            >
              <p className="text-xs uppercase tracking-widest text-slate-400 font-black">
                {label}
              </p>

              <h3 className="text-4xl font-black text-[#0b2a4a] mt-3">
                {value}
              </h3>
            </div>
          ))}
        </div>

        <div className="bg-[#082b4f] rounded-2xl border border-slate-100 shadow-sm p-7 text-white overflow-hidden relative">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />

          <div className="relative z-10">
            <p className="text-xs uppercase tracking-widest text-blue-200 font-black">
              Request Flow
            </p>

            <h3 className="text-3xl font-black mt-4">
              {pendingRequests.length} Pending Review
            </h3>

            <p className="text-base text-blue-100 leading-7 mt-4">
              Project requests are reviewed by admins. Approved requests become
              active projects, while rejected requests remain visible with a
              rejection reason.
            </p>

            <div className="grid grid-cols-3 gap-3 mt-7">
              <RequestFlowStat
                label="Approved"
                value={approvedRequests.length}
              />
              <RequestFlowStat
                label="Rejected"
                value={rejectedRequests.length}
              />
              <RequestFlowStat label="Rate" value={approvalRate} />
            </div>
          </div>
        </div>
      </div>

      {reviewedRequests.length > 0 && (
        <section className="bg-white rounded-2xl p-7 shadow-sm border border-slate-100 mt-6">
          <h3 className="font-black text-[#0b2a4a] text-2xl mb-6">
            Reviewed Requests
          </h3>

          <div className="space-y-5">
            {reviewedRequests.map((request) => (
              <RequestCard key={getRequestId(request)} request={request} />
            ))}
          </div>
        </section>
      )}

      {filteredRequests.length === 0 && (
        <section className="bg-white rounded-2xl p-7 shadow-sm border border-slate-100 mt-6">
          <EmptyState
            icon="approval"
            title="No matching requests found"
            description={
              hasActiveFilters
                ? "Try changing the search text or resetting the filters."
                : isAdmin
                ? "When clients submit project requests, they will appear here."
                : "You can submit a request from the Templates page using a template or custom project request."
            }
          />
        </section>
      )}
    </div>
  );
}

function InfoLine({ label, value }) {
  return (
    <p className="text-sm text-slate-500 leading-6">
      <span className="font-black text-slate-400">{label}:</span>{" "}
      <span className="font-bold text-slate-600">{value}</span>
    </p>
  );
}

function RequestFlowStat({ label, value }) {
  return (
    <div className="bg-white/10 rounded-xl p-3">
      <p className="text-[10px] uppercase text-blue-200 font-black">
        {label}
      </p>

      <h4 className="text-2xl font-black mt-1">{value}</h4>
    </div>
  );
}

export default ProjectRequestContent;