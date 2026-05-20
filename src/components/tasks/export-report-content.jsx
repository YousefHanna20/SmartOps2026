import { useState } from "react";

function ExportReportContent() {
  const [format, setFormat] = useState("pdf");

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-slate-400 flex items-center gap-2">
        <span>Dashboard</span>
        <span>/</span>
        <span>Tasks</span>
        <span>/</span>
        <span className="font-semibold text-[#082b4f]">
          Export Report
        </span>
      </div>

      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-[#082b4f] flex items-center justify-center text-white">
          <span className="material-symbols-outlined">
            description
          </span>
        </div>

        <div>
          <h1 className="text-3xl font-black text-[#082b4f]">
            Export Reports
          </h1>

          <p className="text-slate-500 mt-1">
            Generate and export project and task performance reports.
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
        {/* Left Card */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
          <div className="space-y-7">
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Report Type */}
              <div>
                <label className="block text-sm font-semibold text-[#082b4f] mb-2">
                  Report Type
                </label>

                <select className="w-full bg-slate-100 rounded-xl px-4 py-3 outline-none">
                  <option>Task Report</option>
                  <option>Project Report</option>
                  <option>Full System Report</option>
                </select>
              </div>

              {/* Project */}
              <div>
                <label className="block text-sm font-semibold text-[#082b4f] mb-2">
                  Project Selection
                </label>

                <select className="w-full bg-slate-100 rounded-xl px-4 py-3 outline-none">
                  <option>All Projects</option>
                  <option>SmartOps Mobile App</option>
                  <option>AI Dashboard</option>
                </select>
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Start Date */}
              <div>
                <label className="block text-sm font-semibold text-[#082b4f] mb-2">
                  Start Date
                </label>

                <input
                  type="date"
                  className="w-full bg-slate-100 rounded-xl px-4 py-3 outline-none"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-semibold text-[#082b4f] mb-2">
                  End Date
                </label>

                <input
                  type="date"
                  className="w-full bg-slate-100 rounded-xl px-4 py-3 outline-none"
                />
              </div>
            </div>

            {/* Format */}
            <div>
              <label className="block text-sm font-semibold text-[#082b4f] mb-4">
                Report Format
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* PDF */}
                <button
                  type="button"
                  onClick={() => setFormat("pdf")}
                  className={`rounded-2xl border p-5 text-left transition ${
                    format === "pdf"
                      ? "border-[#082b4f] bg-red-100"
                      : "border-slate-200"
                  }`}
                >
                  <h3 className="font-bold text-[#082b4f]">
                    Adobe PDF
                  </h3>

                  <p className="text-sm text-slate-500 mt-1">
                    Best for presentations
                  </p>
                </button>

                {/* Excel */}
                <button
                  type="button"
                  onClick={() => setFormat("excel")}
                  className={`rounded-2xl border p-5 text-left transition ${
                    format === "excel"
                      ? "border-green-600 bg-green-50"
                      : "border-slate-200"
                  }`}
                >
                  <h3 className="font-bold text-[#082b4f]">
                    Excel Spreadsheet
                  </h3>

                  <p className="text-sm text-slate-500 mt-1">
                    Best for data analysis
                  </p>
                </button>
              </div>
            </div>

            {/* Statistics */}
            <div>
              <label className="block text-sm font-semibold text-[#082b4f] mb-4">
                Included Statistics
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Completed Tasks",
                  "Pending Tasks",
                  "In Progress Tasks",
                  "Employee Performance",
                  "Project Deadlines",
                  "Priority Distribution",
                ].map((item) => (
                  <label
                    key={item}
                    className="flex items-center gap-3 text-slate-600"
                  >
                    <input type="checkbox" defaultChecked />
                    {item}
                  </label>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="rounded-3xl bg-slate-100 p-6">
              <h3 className="font-black text-[#082b4f] mb-5">
                Live Export Preview
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                <div>
                  <p className="text-xs uppercase text-slate-400">
                    Tasks
                  </p>

                  <h2 className="text-2xl font-black text-[#082b4f]">
                    1248
                  </h2>
                </div>

                <div>
                  <p className="text-xs uppercase text-slate-400">
                    Completion
                  </p>

                  <h2 className="text-2xl font-black text-green-600">
                    94%
                  </h2>
                </div>

                <div>
                  <p className="text-xs uppercase text-slate-400">
                    Projects
                  </p>

                  <h2 className="text-2xl font-black text-[#082b4f]">
                    12
                  </h2>
                </div>

                <div>
                  <p className="text-xs uppercase text-slate-400">
                    High Priority
                  </p>

                  <h2 className="text-2xl font-black text-red-600">
                    82
                  </h2>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 pt-2">
              <button className="px-6 py-3 rounded-xl border border-slate-200 text-slate-500 font-semibold">
                Cancel
              </button>

              <button className="px-7 py-3 rounded-xl bg-[#082b4f] text-white font-semibold hover:opacity-90 transition">
                Generate Report
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="space-y-5">
          {/* Stats Card */}
          <div className="bg-[#082b4f] rounded-3xl p-6 text-white">
            <h3 className="font-black text-xl mb-6">
              Historical Data
            </h3>

            <div className="space-y-5">
              <div>
                <p className="text-xs uppercase text-blue-200">
                  Reports Generated
                </p>

                <h2 className="text-3xl font-black mt-1">
                  156
                </h2>
              </div>

              <div>
                <p className="text-xs uppercase text-blue-200">
                  Active Projects
                </p>

                <h2 className="text-3xl font-black mt-1">
                  24
                </h2>
              </div>

              <div>
                <p className="text-xs uppercase text-blue-200">
                  Completion Rate
                </p>

                <h2 className="text-3xl font-black mt-1">
                  88.4%
                </h2>
              </div>
            </div>
          </div>

          {/* Tip Card */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
            <h3 className="font-black text-[#082b4f]">
              Quick Tip
            </h3>

            <p className="text-slate-500 mt-3 leading-7 text-sm">
              Schedule automated weekly reports in the settings tab
              to keep stakeholders informed without manual exporting.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExportReportContent;