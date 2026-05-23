import { useState } from "react";

function AssignTaskForm() {
  const [priority, setPriority] = useState("medium");
  const [deadline, setDeadline] = useState("");
  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-slate-400 flex items-center gap-2">
        <span>Dashboard</span>
        <span>/</span>
        <span>Tasks</span>
        <span>/</span>
        <span className="text-[#0b2a4a] font-semibold">Assign Task</span>
      </div>

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-[#082b4f] flex items-center justify-center text-white">
          <span className="material-symbols-outlined">assignment</span>
        </div>

        <div>
          <h1 className="text-3xl font-black text-[#0b2a4a]">
            Assign New Task
          </h1>

          <p className="text-slate-500 mt-1">
            Create and assign a project task to an employee.
          </p>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
          <form className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-[#0b2a4a] mb-2">
                Task Title
              </label>

              <input
                type="text"
                placeholder="Enter task title"
                className="w-full bg-slate-100 rounded-xl px-4 py-3 outline-none border border-transparent focus:border-[#082b4f]"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-[#0b2a4a] mb-2">
                Description
              </label>

              <textarea
                rows="5"
                placeholder="Describe the task requirements, deliverables, and objectives..."
                className="w-full bg-slate-100 rounded-xl px-4 py-3 outline-none resize-none border border-transparent focus:border-[#082b4f]"
              ></textarea>
            </div>

            {/* User + Project */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Assigned User */}
              <div>
                <label className="block text-sm font-semibold text-[#0b2a4a] mb-2">
                  Assigned User
                </label>

                <select className="w-full bg-slate-100 rounded-xl px-4 py-3 outline-none border border-transparent focus:border-[#082b4f]">
                  <option>Select employee</option>
                  <option>Yousef Hanna</option>
                  <option>Mahmood Asmar</option>
                  <option>Ahmad Ali</option>
                </select>
              </div>

              {/* Project */}
              <div>
                <label className="block text-sm font-semibold text-[#0b2a4a] mb-2">
                  Project
                </label>

                <select className="w-full bg-slate-100 rounded-xl px-4 py-3 outline-none border border-transparent focus:border-[#082b4f]">
                  <option>Select project</option>
                  <option>SmartOps Mobile App</option>
                  <option>AI Assistant</option>
                  <option>Inventory Dashboard</option>
                </select>
              </div>
            </div>

            {/* Deadline + Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Deadline */}
              <div>
                <label className="block text-sm font-semibold text-[#0b2a4a] mb-2">
                  Deadline
                </label>

                <div className="relative">
                  <input
                     type="date"
                     value={deadline}
                     onChange={(e) => setDeadline(e.target.value)}
                     className="w-full bg-slate-100 rounded-xl px-4 py-3 outline-none border border-transparent focus:border-[#082b4f]"
                  />

                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                      calendar_month
                  </span>
                </div>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-semibold text-[#0b2a4a] mb-2">
                  Priority
                </label>

                <div className="flex gap-3">
                   {["low", "medium", "high"].map((item) => (
                   <button
                     key={item}
                     type="button"
                     onClick={() => setPriority(item)}
                     className={`px-5 py-3 rounded-xl font-semibold text-sm capitalize transition ${
                    priority === item
                     ? item === "low"
                     ? "bg-slate-700 text-white"
                     : item === "medium"
                     ? "bg-yellow-500 text-white"
                     : "bg-red-600 text-white"
                     : item === "low"
                     ? "bg-slate-200 text-slate-700"
                     : item === "medium"
                     ? "bg-yellow-100 text-yellow-700"
                     : "bg-red-100 text-red-700"
                      }`}
                   >
                   {item}
                   </button>
                ))}
                </div>
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-[#0b2a4a] mb-2">
                Current Status
              </label>

              <div className="inline-flex items-center px-5 py-2 rounded-full bg-yellow-100 text-yellow-700 font-semibold text-sm">
                Pending
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-4 pt-4">
              <button
                type="button"
                className="px-6 py-3 rounded-xl border border-slate-200 text-slate-500 font-semibold hover:bg-slate-50 transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-7 py-3 rounded-xl bg-[#082b4f] text-white font-semibold hover:opacity-90 transition"
              >
                Assign Task
              </button>
            </div>
          </form>
        </div>

        {/* Right Panel */}
        <div className="space-y-5">
          {/* Stats */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
            <h3 className="font-black text-[#0b2a4a] mb-5">
              Team Capacity
            </h3>

            <div className="space-y-5">
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-400">
                  Total Active Tasks
                </p>

                <h2 className="text-3xl font-black text-[#0b2a4a] mt-1">
                  142
                </h2>
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest text-slate-400">
                  Employees Available
                </p>

                <h2 className="text-3xl font-black text-green-600 mt-1">
                  18
                </h2>
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest text-slate-400">
                  High Priority Tasks
                </p>

                <h2 className="text-3xl font-black text-red-600 mt-1">
                  12
                </h2>
              </div>
            </div>
          </div>

          {/* Tip Card */}
          <div className="bg-[#082b4f] rounded-3xl p-6 text-white">
            <p className="text-xs uppercase tracking-widest text-blue-200">
              Pro Tip
            </p>

            <h3 className="text-xl font-black mt-3">
              Assign high-priority tasks carefully.
            </h3>

            <p className="text-blue-100 mt-3 leading-7 text-sm">
              Monitor employee workload and distribute tasks based on
              expertise and availability for maximum productivity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssignTaskForm;