function VerifyOtpFooter() {
  return (
    <footer className="w-full py-8 mt-auto flex flex-col md:flex-row justify-between items-center px-12 border-t border-slate-100 dark:border-slate-900 bg-white dark:bg-slate-950">
      <span className="text-xs uppercase tracking-widest text-slate-400 dark:text-slate-600">
        © 2026 SmartOps Meridian. All rights reserved.
      </span>

      <div className="flex gap-6 mt-4 md:mt-0">
        <a
          className="text-xs uppercase tracking-widest text-slate-400 hover:text-blue-500 hover:underline underline-offset-4 transition-opacity duration-200"
          href="#"
        >
          Privacy Policy
        </a>

        <a
          className="text-xs uppercase tracking-widest text-slate-400 hover:text-blue-500 hover:underline underline-offset-4 transition-opacity duration-200"
          href="#"
        >
          Terms of Service
        </a>

        <a
          className="text-xs uppercase tracking-widest text-slate-400 hover:text-blue-500 hover:underline underline-offset-4 transition-opacity duration-200"
          href="#"
        >
          Support
        </a>
      </div>
    </footer>
  );
}

export default VerifyOtpFooter;