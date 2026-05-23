import { useState } from "react";
import { useNavigate } from "react-router-dom";

function TasksPageContent() {
  
  // Change this later from AuthContext/backend
  const user = {
    role: "employee", // "admin" or "employee"
  };

  const [viewMode, setViewMode] = useState("list");
  const [selectedPriorities, setSelectedPriorities] = useState([
    "Critical",
    "High",
    "Medium",
    "Low",
  ]);
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Review architectural load-bearing calculations",
      project: "SkyTower Neo-Bridge",
      priority: "Critical",
      status: "In Progress",
    },
    {
      id: 2,
      title: "Finalize material procurement specs",
      project: "SmartOps HQ",
      priority: "High",
      status: "Review",
    },
    {
      id: 3,
      title: "Draft site elevation drawings",
      project: "GreenDistrict Phase 2",
      priority: "Medium",
      status: "Completed",
    },
    {
      id: 4,
      title: "Environmental impact assessment update",
      project: "SkyTower Neo-Bridge",
      priority: "Low",
      status: "Pending",
    },
  ]);

  const priorityStyles = {
    Critical: "bg-red-100 text-red-700",
    High: "bg-orange-100 text-orange-700",
    Medium: "bg-yellow-100 text-yellow-700",
    Low: "bg-green-100 text-green-700",
  };

  const statusStyles = {
    Pending: "bg-slate-100 text-slate-600",
    "In Progress": "bg-blue-100 text-blue-700",
    Review: "bg-purple-100 text-purple-700",
    Completed: "bg-green-100 text-green-700",
  };

  const columns = ["Pending", "In Progress", "Review", "Completed"];

  const filteredTasks = tasks.filter((task) =>
    selectedPriorities.includes(task.priority)
  );

  const handlePriorityFilter = (priority) => {
    if (selectedPriorities.includes(priority)) {
      setSelectedPriorities(
        selectedPriorities.filter((item) => item !== priority)
      );
    } else {
      setSelectedPriorities([...selectedPriorities, priority]);
    }
  };

  const handleStatusChange = (taskId, newStatus) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
    
  };
  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-6">
      <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
        <h2 className="text-3xl font-black text-[#0b2a4a]">
          Tasks Overview
        </h2>

        <p className="text-slate-500 mt-2">
          You have 12 tasks pending for this week. Priority focus:
          <span className="text-[#0b2a4a] font-semibold">
            {" "}
            Structural Optimization.
          </span>
        </p>

        <div className="flex gap-4 mt-6">
          
            <button onClick={() => navigate("/tasks/assign")} className=" hover:opacity-90 transition bg-[#082b4f] text-white px-6 py-3 rounded-lg text-sm font-bold shadow">
              Assign Task
            </button>
          

          <button onClick={() => navigate("/tasks/export-report")} className=" hover:opacity-80 transition bg-slate-200 text-slate-600 px-6 py-3 rounded-lg text-sm font-bold hover:navy-blue transition">
            Export Report
          </button>
        </div>
      </section>

      <section className="bg-[#082b4f] text-white rounded-2xl p-8 shadow-sm">
        <p className="text-xs tracking-widest uppercase text-blue-200">
          Completion Rate
        </p>

        <h2 className="text-4xl font-black mt-3">84%</h2>

        <div className="w-full h-2 bg-white/20 rounded-full mt-4">
          <div className="w-[84%] h-full bg-green-400 rounded-full"></div>
        </div>

        <p className="text-xs text-blue-100 mt-3">
          4% increase from last week
        </p>
      </section>

      <section className="xl:col-span-2 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">
        <aside className="space-y-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-400 mb-3">
              View Mode
            </p>

            <div className="bg-slate-100 rounded-lg p-1 grid grid-cols-2 text-xs font-bold">
              <button
                onClick={() => setViewMode("list")}
                className={`rounded-md py-2 ${
                  viewMode === "list"
                    ? "bg-white text-[#0b2a4a]"
                    : "text-slate-500"
                }`}
              >
                List
              </button>

              <button
                onClick={() => setViewMode("kanban")}
                className={`rounded-md py-2 ${
                  viewMode === "kanban"
                    ? "bg-white text-[#0b2a4a]"
                    : "text-slate-500"
                }`}
              >
                Kanban
              </button>
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-slate-400 mb-3">
              Priority Filter
            </p>

            {["Critical", "High", "Medium", "Low"].map((priority) => (
              <label
                key={priority}
                className="flex items-center gap-3 mb-4 text-sm cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedPriorities.includes(priority)}
                  onChange={() => handlePriorityFilter(priority)}
                />

                <span
                  className={`px-2 py-1 rounded-full text-xs font-bold ${priorityStyles[priority]}`}
                >
                  {priority}
                </span>
              </label>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <p className="font-bold text-sm text-[#0b2a4a]">
              Team Activity
            </p>

            <p className="text-xs text-slate-400 mt-2">
              5 members active today
            </p>
          </div>
        </aside>

        {viewMode === "list" ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="grid grid-cols-[1fr_120px_140px_40px] px-6 py-4 text-[11px] uppercase tracking-widest text-slate-400 border-b">
              <p>Task Title</p>
              <p>Priority</p>
              <p>Status</p>
              <p></p>
            </div>

            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="grid grid-cols-[1fr_120px_140px_40px] items-center px-6 py-5 border-b last:border-b-0"
              >
                <div>
                  <p className="font-bold text-[#0b2a4a] text-sm">
                    {task.title}
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    Project: {task.project}
                  </p>
                </div>

                <span
                  className={`text-[10px] font-black uppercase px-3 py-1 rounded-full w-fit ${
                    priorityStyles[task.priority]
                  }`}
                >
                  {task.priority}
                </span>

                {user.role === "employee" ? (
                  <select
                    value={task.status}
                    onChange={(e) =>
                      handleStatusChange(task.id, e.target.value)
                    }
                    className={`text-xs font-bold px-3 py-2 rounded-full outline-none ${
                      statusStyles[task.status]
                    }`}
                  >
                    <option>Pending</option>
                    <option>In Progress</option>
                    <option>Review</option>
                    <option>Completed</option>
                  </select>
                ) : (
                  <span
                    className={`text-xs font-bold px-3 py-2 rounded-full w-fit ${
                      statusStyles[task.status]
                    }`}
                  >
                    {task.status}
                  </span>
                )}

                <span className="material-symbols-outlined text-slate-300">
                  more_vert
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {columns.map((column) => (
              <div
                key={column}
                className="bg-slate-100 rounded-2xl p-4 min-h-[360px]"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-black text-[#0b2a4a]">{column}</h3>

                  <span className="text-xs bg-white px-2 py-1 rounded-full text-slate-500 font-bold">
                    {
                      filteredTasks.filter((task) => task.status === column)
                        .length
                    }
                  </span>
                </div>

                <div className="space-y-3">
                  {filteredTasks
                    .filter((task) => task.status === column)
                    .map((task) => (
                      <div
                        key={task.id}
                        className="bg-white rounded-xl p-4 shadow-sm border border-slate-100"
                      >
                        <span
                          className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${
                            priorityStyles[task.priority]
                          }`}
                        >
                          {task.priority}
                        </span>

                        <h4 className="font-bold text-[#0b2a4a] text-sm mt-3">
                          {task.title}
                        </h4>

                        <p className="text-xs text-slate-400 mt-2">
                          Project: {task.project}
                        </p>

                        {user.role === "employee" && (
                          <select
                            value={task.status}
                            onChange={(e) =>
                              handleStatusChange(task.id, e.target.value)
                            }
                            className={`mt-4 w-full text-xs font-bold px-3 py-2 rounded-lg outline-none ${
                              statusStyles[task.status]
                            }`}
                          >
                            <option>Pending</option>
                            <option>In Progress</option>
                            <option>Review</option>
                            <option>Completed</option>
                          </select>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default TasksPageContent;