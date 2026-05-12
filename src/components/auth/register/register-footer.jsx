function RegisterFooter() {
  return (
    <footer className="bg-slate-50 dark:bg-slate-950 w-full py-12 px-8">
      <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto text-sm text-slate-900 dark:text-slate-100">
        <div className="flex items-center gap-2 mb-6 md:mb-0">
          <span className="font-bold text-blue-900 uppercase tracking-widest">
            SmartOps
          </span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-400">
            © 2026 SmartOps Architectural Systems
          </span>
        </div>

        <div className="flex gap-8">
          <a className="text-slate-400 hover:text-blue-500 transition-colors opacity-100 hover:opacity-80" href="#">
            Privacy
          </a>
          <a className="text-slate-400 hover:text-blue-500 transition-colors opacity-100 hover:opacity-80" href="#">
            Terms
          </a>
          <a className="text-slate-400 hover:text-blue-500 transition-colors opacity-100 hover:opacity-80" href="#">
            API Docs
          </a>
          <a className="text-slate-400 hover:text-blue-500 transition-colors opacity-100 hover:opacity-80" href="#">
            Support
          </a>
        </div>
      </div>
    </footer>
  );
}

export default RegisterFooter;