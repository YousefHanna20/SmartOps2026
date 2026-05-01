function Navbar() {
  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg shadow-sm shadow-blue-900/5 fixed top-0 z-40 w-full px-8 py-3 flex justify-between items-center glass-header">
      <div className="flex items-center gap-8">
        <span className="text-xl font-black text-blue-900 dark:text-white tracking-tighter">
          SmartOps
        </span>

        <div className="hidden md:flex items-center gap-6">
          <nav className="flex gap-8 text-[11px] uppercase tracking-widest text-slate-500 font-semibold">
            <a className="text-blue-600 dark:text-blue-400 font-bold border-b-2 border-blue-600 py-1" href="#">
              Home
            </a>
            <a className="text-slate-500 dark:text-slate-400 hover:text-blue-800 transition-colors py-1" href="#">
              Solutions
            </a>
            <a className="text-slate-500 dark:text-slate-400 hover:text-blue-800 transition-colors py-1" href="#">
              Enterprise
            </a>
            <a className="text-slate-500 dark:text-slate-400 hover:text-blue-800 transition-colors py-1" href="#">
              Pricing
            </a>
          </nav>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden lg:flex items-center bg-slate-100/50 dark:bg-slate-800/50 px-4 py-1.5 rounded-full">
          <span className="material-symbols-outlined text-[20px] text-slate-400 mr-2">
            search
          </span>
          <input
            className="bg-transparent border-none focus:ring-0 text-sm w-48 placeholder-slate-400"
            placeholder="Search operations..."
            type="text"
          />
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors rounded-full text-slate-500">
            <span className="material-symbols-outlined">notifications</span>
          </button>

          <button className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors rounded-full text-slate-500">
            <span className="material-symbols-outlined">settings</span>
          </button>

          <div className="ml-2 h-8 w-8 rounded-full overflow-hidden bg-slate-200">
            <img
              alt="User profile"
              className="h-full w-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBy2PFDbpp85k9dTp8uuN0ukSIGTx6DP5yQTDF5hntZN8G4UguNVC_B7-QvS5MO6i7JHZzGaGYbtb8g73azsb9NMalyavNSJdpXf02kcq5WCLjllOgbERyMC3BVRLvjCznXat-Ch8l1_sKRJDURZuX0mam4wU98kan6jgUHser11foNVjCQ51eQG4mGNkzUMBiuQLsrcLM52MrXCrNqjaVlXOzj4plqaoETV98uXrIGEezJ9YUps0vL3ZHjlwzG7SyYEUzm6C25ZaI"
            />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;