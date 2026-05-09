function LandingFooter() {
  return (
    <footer className="bg-slate-50 dark:bg-slate-950 w-full py-12 px-8">
      <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto border-t border-transparent gap-8">
        <div className="flex flex-col items-center md:items-start gap-4">
          <span className="font-bold text-blue-900 text-2xl tracking-tighter">
            SmartOps
          </span>

          <p className="text-slate-400 text-sm max-w-xs text-center md:text-left">
            © 2024 SmartOps Architectural Systems. Built for high-performance
            teams.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
          <a className="text-slate-400 text-sm hover:text-blue-500 transition-colors opacity-100 hover:opacity-80" href="#">
            Privacy
          </a>
          <a className="text-slate-400 text-sm hover:text-blue-500 transition-colors opacity-100 hover:opacity-80" href="#">
            Terms
          </a>
          <a className="text-slate-400 text-sm hover:text-blue-500 transition-colors opacity-100 hover:opacity-80" href="#">
            API Docs
          </a>
          <a className="text-slate-400 text-sm hover:text-blue-500 transition-colors opacity-100 hover:opacity-80" href="#">
            Support
          </a>
        </div>

        <div className="flex gap-4">
          <button className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-200/50 hover:bg-slate-200 transition-all text-blue-900">
            <span className="material-symbols-outlined text-[20px]">hub</span>
          </button>

          <button className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-200/50 hover:bg-slate-200 transition-all text-blue-900">
            <span className="material-symbols-outlined text-[20px]">
              alternate_email
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}

export default LandingFooter;