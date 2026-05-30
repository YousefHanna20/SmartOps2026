function RecentActivity() {
  const rows = [
    {
      project: "Skyline Atrium",
      task: "Material Selection - Glass",
      owner: "Elena V.",
      status: "Complete",
    },
    {
      project: "Park Avenue Loft",
      task: "Initial Load Calculations",
      owner: "Marcus K.",
      status: "In Progress",
    },
    {
      project: "Urban Library",
      task: "Acoustical Panel Design",
      owner: "Sarah J.",
      status: "Delayed",
    },
  ];

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm shadow-blue-900/5">
      <div className="px-6 py-6">
        <h3 className="text-xl font-black text-blue-900 tracking-tight">
          Recent Activity
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50">
            <tr>
              {["Project", "Task", "Owner", "Status"].map((item) => (
                <th
                  key={item}
                  className="px-6 py-4 uppercase tracking-widest text-[10px] text-slate-500"
                >
                  {item}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr key={row.project} className="hover:bg-slate-50/50">
                <td className="px-6 py-5 font-bold text-primary">
                  {row.project}
                </td>
                <td className="px-6 py-5 text-sm text-slate-600">
                  {row.task}
                </td>
                <td className="px-6 py-5 text-sm">{row.owner}</td>
                <td className="px-6 py-5">
                  <span className="px-3 py-1 bg-secondary-container text-on-secondary-container text-[10px] font-bold uppercase tracking-wider rounded-full">
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RecentActivity;