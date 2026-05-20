import AppShell from "../components/layout/app-shell";
import ExportReportContent from "../components/tasks/export-report-content";

function ExportReport() {
  return (
    <AppShell activePage="Tasks">
      <ExportReportContent />
    </AppShell>
  );
}

export default ExportReport;