import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../../context/auth-context";
import {
  getProjectRequests,
  approveProjectRequest,
  rejectProjectRequest,
  deleteProjectRequest,
} from "../../../services/project-request-service";
import requestStatsImg from "../../../assets/nexus-wing.png";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const rejectRequestSchema = z.object({
  rejection_reason: z
    .string()
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

  const [rejectingRequest, setRejectingRequest] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);

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
    return String(status).toLowerCase();
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

  const pendingRequests = useMemo(() => {
    return requests.filter(
      (request) => normalizeStatus(getStatus(request)) === "pending"
    );
  }, [requests]);

  const approvedRequests = useMemo(() => {
    return requests.filter(
      (request) => normalizeStatus(getStatus(request)) === "approved"
    );
  }, [requests]);

  const rejectedRequests = useMemo(() => {
    return requests.filter(
      (request) => normalizeStatus(getStatus(request)) === "rejected"
    );
  }, [requests]);

  const reviewedRequests = useMemo(() => {
    return [...approvedRequests, ...rejectedRequests];
  }, [approvedRequests, rejectedRequests]);

  const approvalRate = useMemo(() => {
    if (requests.length === 0) return "0%";

    const rate = Math.round((approvedRequests.length / requests.length) * 100);
    return `${rate}%`;
  }, [requests.length, approvedRequests.length]);

  const handleApprove = async (request) => {
    const requestId = getRequestId(request);

    setActionLoadingId(requestId);

    try {
      await approveProjectRequest(requestId);
      await loadRequests();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to approve request.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRejectClick = (request) => {
    setRejectingRequest(request);
  };

  const handleCancelReject = () => {
    setRejectingRequest(null);
  };

  const handleDelete = async (request) => {
    const requestId = getRequestId(request);

    const confirmed = window.confirm(
      `Are you sure you want to delete "${getProjectName(request)}"?`
    );

    if (!confirmed) return;

    setActionLoadingId(requestId);

    try {
      await deleteProjectRequest(requestId);
      await loadRequests();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete request.");
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
            message:
              responseData?.message || "Failed to reject project request.",
          });
        }
      } finally {
        setActionLoadingId(null);
      }
    };

    return (
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-4 bg-red-50 border border-red-100 rounded-xl p-4"
      >
        {errors.root && (
          <div className="rounded-lg bg-white border border-red-200 px-4 py-3 text-sm text-red-600 mb-3">
            {errors.root.message}
          </div>
        )}

        <label className="text-xs font-bold uppercase tracking-widest text-red-400">
          Reason for Rejection
        </label>

        <textarea
          className="mt-3 w-full h-24 bg-white border border-red-100 rounded-lg px-4 py-3 text-sm outline-none resize-none focus:border-red-400"
          placeholder="Provide a clear reason for rejecting this request..."
          {...register("rejection_reason")}
        />

        {errors.rejection_reason && (
          <p className="text-xs text-red-600 mt-1">
            {errors.rejection_reason.message}
          </p>
        )}

        <div className="flex justify-end gap-2 mt-3">
          <button
            type="button"
            onClick={handleCancelReject}
            disabled={isSubmitting || isActionLoading}
            className="px-4 py-2 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-500 hover:bg-slate-100 hover:scale-105 transition duration-200 disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting || isActionLoading}
            className="px-4 py-2 rounded-lg text-xs font-bold bg-red-600 text-white hover:scale-105 transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
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
      <div className="border border-slate-100 rounded-xl p-4">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-bold text-[#0b2a4a]">
                {getProjectName(request)}
              </p>

              <span
                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${getStatusStyle(
                  status
                )}`}
              >
                {formatStatus(status)}
              </span>
            </div>

            <p className="text-xs text-slate-400 mt-1">
              Client:{" "}
              <span className="font-semibold">{getClientName(request)}</span>
            </p>

            <p className="text-xs text-slate-500 mt-2">
              Category:{" "}
              <span className="font-semibold">{getCategory(request)}</span>
            </p>

            <p className="text-xs text-slate-500 mt-1">
              Template:{" "}
              <span className="font-semibold">{getTemplateName(request)}</span>
            </p>

            <p className="text-xs text-slate-500 mt-1">
              Deadline:{" "}
              <span className="font-semibold">
                {request.deadline || "Not set"}
              </span>
            </p>

            {request.description && (
              <p className="text-xs text-slate-400 mt-3 max-w-2xl leading-6">
                {request.description}
              </p>
            )}

            {normalizedStatus === "rejected" && request.rejection_reason && (
              <div className="mt-3 bg-red-50 border border-red-100 rounded-lg p-3">
                <p className="text-xs font-bold text-red-500">
                  Rejection Reason
                </p>

                <p className="text-xs text-red-600 mt-1">
                  {request.rejection_reason}
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 h-fit">
            {isAdmin && normalizedStatus === "pending" && (
              <>
                <button
                  type="button"
                  onClick={() => handleRejectClick(request)}
                  disabled={isActionLoading}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-[#0b2a4a] bg-slate-100 hover:text-red-600 hover:scale-105 transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Reject
                </button>

                <button
                  type="button"
                  onClick={() => handleApprove(request)}
                  disabled={isActionLoading}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#082b4f] hover:bg-[#061f39] hover:scale-105 transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isActionLoading ? "Processing..." : "Approve"}
                </button>
              </>
            )}

            {isClient && normalizedStatus === "pending" && (
              <button
                type="button"
                onClick={() => handleDelete(request)}
                disabled={isActionLoading}
                className="px-4 py-2 rounded-lg text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 hover:scale-105 transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
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

  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">
        Strategic Operations
      </p>

      <div className="flex flex-col md:flex-row justify-between gap-4 mt-2">
        <div>
          <h2 className="text-4xl font-black text-[#0b2a4a]">Requests</h2>

          <p className="text-slate-500 max-w-xl mt-3">
            Manage project intakes and system proposals. Clients can submit
            detailed requests, while administrators review approvals and
            allocation.
          </p>
        </div>

        <button
          type="button"
          onClick={loadRequests}
          className="bg-slate-100 text-[#082b4f] rounded-lg px-6 py-3 font-bold text-sm h-fit hover:bg-slate-200 transition"
        >
          Refresh
        </button>
      </div>

      {loadingRequests && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mt-10 text-slate-500">
          Loading requests...
        </div>
      )}

      {requestsError && (
        <div className="bg-red-50 rounded-2xl p-6 shadow-sm border border-red-200 mt-10 text-red-600">
          {requestsError}
        </div>
      )}

      {!loadingRequests && !requestsError && (
        <div className="grid grid-cols-1 gap-6 mt-10">
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-black text-[#0b2a4a]">
                  {isAdmin ? "Pending Approval" : "Pending Requests"}
                </h3>

                <p className="text-xs text-slate-400 uppercase tracking-widest">
                  {isAdmin ? "Administrator Console" : "Client Console"}
                </p>
              </div>

              <span className="material-symbols-outlined text-slate-400">
                filter_list
              </span>
            </div>

            <div className="space-y-4">
              {pendingRequests.length === 0 && (
                <div className="text-center text-slate-400 py-10">
                  No pending project requests found.
                </div>
              )}

              {pendingRequests.map((request) => (
                <RequestCard key={getRequestId(request)} request={request} />
              ))}
            </div>
          </section>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            ["Total Requests", requests.length],
            ["Pending", pendingRequests.length],
            ["Approval Rate", approvalRate],
          ].map(([label, value]) => (
            <div
              key={label}
              className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm"
            >
              <p className="text-xs uppercase tracking-widest text-slate-400">
                {label}
              </p>

              <h3 className="text-3xl font-black text-[#0b2a4a] mt-2">
                {value}
              </h3>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex items-center justify-center p-4">
          <img
            src={requestStatsImg}
            alt="Project request visual"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {!loadingRequests && !requestsError && reviewedRequests.length > 0 && (
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mt-6">
          <h3 className="font-black text-[#0b2a4a] mb-4">
            Reviewed Requests
          </h3>

          <div className="space-y-4">
            {reviewedRequests.map((request) => (
              <RequestCard key={getRequestId(request)} request={request} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default ProjectRequestContent;