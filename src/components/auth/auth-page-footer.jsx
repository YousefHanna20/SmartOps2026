function AuthPageFooter() {
  return (
    <footer className="w-full max-w-5xl flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] tracking-widest uppercase text-slate-400 mt-16">
      <p>© 2026 SmartOps Meridian. All rights reserved.</p>

      <div className="flex gap-8">
        <a href="#" className="hover:text-slate-600">Privacy Policy</a>
        <a href="#" className="hover:text-slate-600">Terms of Service</a>
        <a href="#" className="hover:text-slate-600">Support</a>
      </div>
    </footer>
  );
}

export default AuthPageFooter;