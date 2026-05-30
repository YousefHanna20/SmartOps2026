import AppShell from "../components/layout/app-shell";
import ExportReportContent from "../components/dashboard/tasks/export-report-content";

function ExportReport() {
  return (
    <AppShell activePage="Tasks">
      <ExportReportContent />
    </AppShell>
  );
}

export default ExportReport;