import NotificationCard from "./notification-card";

function NotificationsFeed() {
  const notifications = [
    {
      title: "New Project Proposal: SkyGarden Phase II",
      time: "12 mins ago",
      message:
        'Sarah Jenkins mentioned you in the structural review comments. "The elevation on the north facade needs readjustment for wind load."',
      icon: "assignment",
      unread: true,
      color: "blue",
      tags: ["High Priority", "Structural"],
    },
    {
      title: "Task Completed",
      time: "2 hours ago",
      message:
        "The 'Site Topography Scan' for Project Aurora has been successfully processed and added to the document library.",
      icon: "check_circle",
      unread: true,
      color: "green",
      tags: [],
    },
    {
      title: "Meeting Reminder",
      time: "Yesterday",
      message:
        "Quarterly Architectural Review with stakeholders starts in 30 minutes in Meeting Room 4A.",
      icon: "schedule",
      unread: false,
      color: "slate",
      tags: [],
    },
    {
      title: "System Update",
      time: "Oct 24, 2024",
      message:
        "SmartOps v2.4 is now live. Explore the new Gantt chart visualizations and AI-assisted budgeting tools.",
      icon: "person",
      unread: false,
      color: "slate",
      tags: [],
    },
  ];

  return (
    <div className="lg:col-span-8 flex flex-col gap-4">
      {notifications.map((item) => (
        <NotificationCard key={item.title} {...item} />
      ))}

      <button className="mt-4 py-4 w-full border-2 border-dashed border-slate-200 rounded-xl text-slate-400 font-bold text-sm uppercase tracking-widest hover:border-blue-200 hover:text-blue-500 transition-all">
        Load Older Notifications
      </button>
    </div>
  );
}

export default NotificationsFeed;