import { useState } from "react";
import requestStatsImg from "../../assets/nexus-wing.png";

function ProjectRequestContent() {
  const [rejectingRequestId, setRejectingRequestId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const requests = [
    {
      id: 1,
      name: "Solaris Atrium Expansion",
      status: "New",
      type: "Standard",
      client: "Client A",
    },
    {
      id: 2,
      name: "Grid Integration v2",
      status: "Urgent",
      type: "Urgent",
      client: "Client B",
    },
    {
      id: 3,
      name: "Hydro-Tower Cooling",
      status: "Reviewing",
      type: "Research",
      client: "Client C",
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
        specifications, while administrators oversee approvals and allocation.
      </p>

      <div className="grid grid-cols-1 xl:grid-cols-[360px_1fr] gap-6 mt-10">
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="font-black text-[#0b2a4a]">Request Project</h3>

          <p className="text-xs text-slate-400 uppercase tracking-widest mb-6">
            Initiate New Specification
          </p>

          <form className="space-y-4">
            <input
              className="w-full bg-slate-100 rounded-lg px-4 py-3 text-sm outline-none"
              placeholder="Project identity"
            />

            <div className="grid grid-cols-2 gap-3">
              <select className="bg-slate-100 rounded-lg px-4 py-3 text-sm outline-none">
                <option>Structural</option>
                <option>Software</option>
                <option>AI</option>
              </select>

              <select className="bg-slate-100 rounded-lg px-4 py-3 text-sm outline-none">
                <option>Standard</option>
                <option>High</option>
                <option>Urgent</option>
              </select>
            </div>

            <textarea
              className="w-full h-32 bg-slate-100 rounded-lg px-4 py-3 text-sm outline-none resize-none"
              placeholder="Detail the scope and architectural constraints..."
            ></textarea>

            <button className="w-full bg-[#082b4f] text-white rounded-lg py-3 font-bold text-sm">
              Submit Request →
            </button>
          </form>
        </section>

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
              <div
                key={req.id}
                className="border border-slate-100 rounded-xl p-4"
              >
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <p className="font-bold text-[#0b2a4a]">{req.name}</p>
                    <p className="text-xs text-slate-400">
                      {req.client} • {req.type}
                    </p>
                  </div>

                  <div className="flex gap-2 h-fit">
                    <button
                      type="button"
                      onClick={() => handleRejectClick(req.id)}
                      className="px-4 py-2 rounded-lg text-xs font-bold text-[#0b2a4a] bg-slate-100"
                    >
                      Reject
                    </button>

                    <button
                      type="button"
                      className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#082b4f]"
                    >
                      Approve
                    </button>
                  </div>
                </div>

                {rejectingRequestId === req.id && (
                  <div className="mt-4 bg-slate-50 border border-slate-100 rounded-xl p-4">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400">
                      Rejection Reason
                    </label>

                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      className="mt-3 w-full h-24 bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm outline-none resize-none focus:border-[#082b4f]"
                      placeholder="Write why this project request is rejected..."
                    ></textarea>

                    <div className="flex justify-end gap-2 mt-3">
                      <button
                        type="button"
                        onClick={handleCancelReject}
                        className="px-4 py-2 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-500"
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        onClick={() => handleConfirmReject(req.id)}
                        className="px-4 py-2 rounded-lg text-xs font-bold bg-red-600 text-white"
                      >
                        Confirm Reject
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>

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
            alt="Project request statistics"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}

export default ProjectRequestContent;