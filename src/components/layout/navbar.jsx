import { Link } from "react-router-dom";

function Navbar() {
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg shadow-sm shadow-blue-900/5 fixed top-0 z-40 w-full px-8 py-3 flex justify-between items-center glass-header">
      <div className="flex items-center gap-8">
        <Link
          to="/"
          className="text-xl font-black text-blue-900 dark:text-white tracking-tighter"
        >
          SmartOps
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <nav className="flex gap-8 text-[11px] uppercase tracking-widest text-slate-500 font-semibold">
            <button
              type="button"
              onClick={() => scrollToSection("home")}
              className="text-blue-600 dark:text-blue-400 font-bold border-b-2 border-blue-600 py-1"
            >
              Home
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("features")}
              className="text-slate-500 dark:text-slate-400 hover:text-blue-800 transition-colors py-1"
            >
              Features
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("preview")}
              className="text-slate-500 dark:text-slate-400 hover:text-blue-800 transition-colors py-1"
            >
              Product
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("footer")}
              className="text-slate-500 dark:text-slate-400 hover:text-blue-800 transition-colors py-1"
            >
              Contact
            </button>
          </nav>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link
          to="/login"
          className="hidden sm:inline-flex px-5 py-2.5 rounded-lg text-sm font-bold text-[#082b4f] hover:bg-slate-100 transition"
        >
          Login
        </Link>

        <Link
          to="/register"
          className="inline-flex px-5 py-2.5 rounded-lg text-sm font-bold bg-[#082b4f] text-white hover:opacity-90 transition"
        >
          Get Started
        </Link>
      </div>
    </header>
  );
}

export default Navbar;