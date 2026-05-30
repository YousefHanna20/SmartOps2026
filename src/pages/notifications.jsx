import AppShell from "../components/layout/app-shell";
import NotificationsHeader from "../components/dashboard/notifications/notifications-header";
import NotificationsFeed from "../components/dashboard/notifications/notifications-feed";
import NotificationsOverview from "../components/dashboard/notifications/notifications-overview";
import PinnedThreads from "../components/dashboard/notifications/pinned-threads";
import IntegratedChannels from "../components/dashboard/notifications/integrated-channels";

function Notifications() {
  return (
    <AppShell activePage="Notifications">
      <section className="max-w-6xl mx-auto w-full">
        <NotificationsHeader />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <NotificationsFeed />

          <div className="lg:col-span-4 flex flex-col gap-8">
            <NotificationsOverview />
            <PinnedThreads />
            <IntegratedChannels />
          </div>
        </div>
      </section>
    </AppShell>
  );
}

export default Notifications;