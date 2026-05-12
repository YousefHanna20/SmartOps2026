function RegisterHero() {
  return (
    <div className="hidden md:flex md:w-5/12 bg-gradient-to-br from-primary to-primary-container relative p-16 flex-col justify-between overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="white"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <span
              className="material-symbols-outlined text-primary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              architecture
            </span>
          </div>

          <span className="text-white text-2xl font-black tracking-tighter uppercase">
            SmartOps
          </span>
        </div>
      </div>

      <div className="z-10">
        <h1 className="text-6xl lg:text-7xl text-white font-black tracking-tight leading-none mb-6">
          PRECISION
          <br />
          MANAGEMENT.
        </h1>

        <p className="text-primary-fixed text-lg leading-relaxed max-w-sm">
          Enter the next generation of architectural operations. Scalable,
          AI-driven, and designed for high-performance teams.
        </p>
      </div>

      <div className="z-10 flex flex-col gap-6">
        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20">
            <img
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCK0vruR4AC4yKdcUnsdfcxItLZqrbd1xNDFMKXfcXjrNyR3mMR_ECXGjW-qtqiflndqS3TQZq3P8kCncJicNJttctafWVS_YiK4gZNbUfazUgai1bQj-rsd8CwNci7qvr1WSAvy8e9Jof61mqwVavlBRq9YoVAmumERvQu_KOoZk9CDiBDMFxBEm9X-vM4E7imE2qBDpqubkcgAIn8uabMEg5cg87ZxaYAq4qxVbVFYsmyzyVrIW2GVfQSkNFRh5X5568_XKjkNgE"
              alt="Architect"
            />
          </div>

          <div>
            <p className="text-white font-semibold text-sm italic">
              "The editorial clarity of SmartOps transformed our workflow in
              weeks."
            </p>
            <p className="text-primary-fixed text-xs uppercase tracking-widest mt-1">
              — Lead Architect, Studio Prism
            </p>
          </div>
        </div>

        <p className="text-primary-fixed-dim text-[11px] uppercase tracking-[0.2em]">
          © 2024 SmartOps Architectural Systems
        </p>
      </div>
    </div>
  );
}

export default RegisterHero;