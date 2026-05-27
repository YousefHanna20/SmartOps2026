import { useState } from "react";
import requestStatsImg from "../../assets/nexus-wing.png";

function ProjectRequestContent() {
  const [rejectingRequestId, setRejectingRequestId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const templates = [
    "No template",
    "Commercial High-Rise V2",
    "Industrial Retrofit",
    "Urban Green Belt",
  ];

  const requests = [
    {
      id: 1,
      projectName: "Solaris Atrium Expansion",
      client: "Client A",
      template: "Commercial High-Rise V2",
      deadline: "2026-05-20",
      status: "Pending",
    },
    {
      id: 2,
      projectName: "Grid Integration v2",
      client: "Client B",
      template: "No template",
      deadline: "2026-06-10",
      status: "Pending",
    },
    {
      id: 3,
      projectName: "Hydro-Tower Cooling",
      client: "Client C",
      template: "Industrial Retrofit",
      deadline: "2026-07-01",
      status: "Pending",
    },
  ];

  const handleRejectClick = (requestId) => {
    setRejectingRequestId(requestId);
    setRejectionReason("");
  };

  const handleCancelReject = () => {
    setRejectingRequestId(null);
    setRejectionReason("");
  };

  const handleConfirmReject = (requestId) => {
    if (!rejectionReason.trim()) {
      alert("Please enter a rejection reason.");
      return;
    }

    console.log("Rejected request:", requestId);
    console.log("Reason:", rejectionReason);

    setRejectingRequestId(null);
    setRejectionReason("");
  };

  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">
        Strategic Operations
      </p>

      <h2 className="text-4xl font-black text-[#0b2a4a] mt-2">
        Requests
      </h2>

      <p className="text-slate-500 max-w-xl mt-3">
        Manage project intakes and system proposals. Clients can submit detailed
        requests, while administrators review approvals and allocation.
      </p>

      <div className="grid grid-cols-1 xl:grid-cols-[360px_1fr] gap-6 mt-10">
        {/* Request Form */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="font-black text-[#0b2a4a]">Request Project</h3>

          <p className="text-xs text-slate-400 uppercase tracking-widest mb-6">
            Initiate New Specification
          </p>

          <form className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Project Name
              </label>

              <input
                className="mt-2 w-full bg-slate-100 rounded-lg px-4 py-3 text-sm outline-none"
                placeholder="Enter project name"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Deadline
              </label>

              <input
                type="date"
                className="mt-2 w-full bg-slate-100 rounded-lg px-4 py-3 text-sm outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Project Template Optional
              </label>

              <select className="mt-2 w-full bg-slate-100 rounded-lg px-4 py-3 text-sm outline-none">
                {templates.map((template) => (
                  <option key={template}>{template}</option>
                ))}
              </select>

              <p className="text-xs text-slate-400 mt-2">
                You can request a custom project without selecting a template.
              </p>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Description
              </label>

              <textarea
                className="mt-2 w-full h-32 bg-slate-100 rounded-lg px-4 py-3 text-sm outline-none resize-none"
                placeholder="Describe the project requirements, goals, and constraints..."
              ></textarea>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Status
              </label>

              <div className="mt-2 inline-flex px-4 py-2 rounded-full bg-yellow-100 text-yellow-700 text-xs font-bold">
                Pending
              </div>
            </div>

            <button
              type="button"
              className="w-full bg-[#082b4f] text-white rounded-lg py-3 font-bold text-sm hover:opacity-90 transition"
            >
              Submit Request →
            </button>
          </form>
        </section>

        {/* Pending Approval */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="font-black text-[#0b2a4a]">Pending Approval</h3>
              <p className="text-xs text-slate-400 uppercase tracking-widest">
                Administrator Console
              </p>
            </div>

            <span className="material-symbols-outlined text-slate-400">
              filter_list
            </span>
          </div>

          <div className="space-y-4">
            {requests.map((req) => (
              <div key={req.id} className="border border-slate-100 rounded-xl p-4">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-[#0b2a4a]">
                        {req.projectName}
                      </p>

                      <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-[10px] font-black uppercase">
                        {req.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 mt-1">
                      {req.client}
                    </p>

                    <p className="text-xs text-slate-500 mt-2">
                      Template:{" "}
                      <span className="font-semibold">{req.template}</span>
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      Deadline:{" "}
                      <span className="font-semibold">{req.deadline}</span>
                    </p>
                  </div>

                  <div className="flex gap-2 h-fit">
                    <button
                      type="button"
                      onClick={() => handleRejectClick(req.id)}
                      className="px-4 py-2 rounded-lg text-xs font-bold text-[#0b2a4a] bg-slate-100 hover:text-red-600 hover:scale-105 transition duration-200"
                    >
                      Reject
                    </button>

                    <button
                      type="button"
                      className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#082b4f] hover:bg-[#061f39] hover:scale-105 transition duration-200"
                    >
                      Approve
                    </button>
                  </div>
                </div>

                {rejectingRequestId === req.id && (
                  <div className="mt-4 bg-red-50 border border-red-100 rounded-xl p-4">
                    <label className="text-xs font-bold uppercase tracking-widest text-red-400">
                      Reason for Rejection
                    </label>

                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      className="mt-3 w-full h-24 bg-white border border-red-100 rounded-lg px-4 py-3 text-sm outline-none resize-none focus:border-red-400"
                      placeholder="Provide specific architectural constraints or missing requirements..."
                    ></textarea>

                    <div className="flex justify-end gap-2 mt-3">
                      <button
                        type="button"
                        onClick={handleCancelReject}
                        className="px-4 py-2 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-500 hover:bg-slate-100 hover:scale-105 transition duration-200"
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        onClick={() => handleConfirmReject(req.id)}
                        className="px-4 py-2 rounded-lg text-xs font-bold bg-red-600 text-white  hover:scale-105 transition duration-200"
                      >
                        Confirm Rejection
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Statistics + Image */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            ["Total Requests", "124"],
            ["Approval Rate", "82%"],
            ["Avg. Response", "4.2h"],
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
    </div>
  );
}

export default ProjectRequestContent;