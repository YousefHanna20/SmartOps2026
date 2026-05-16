function AuthLayout({ children, showBrandPanel = false }) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-[920px] min-h-[620px] bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-[1.15fr_1fr]">

        {showBrandPanel && (
          <div className="hidden md:flex flex-col justify-center bg-[#0b2a4a] text-white px-12 py-25">
            <div>
              <p className="text-xs tracking-[0.35em] uppercase text-blue-200">
                Architectural Integrity
              </p>

              <h1 className="text-4xl font-bold mt-6 leading-tight">
                SmartOps <br /> Systems
              </h1>

              <p className="text-sm text-blue-100 mt-8 leading-7 max-w-md">
                The next evolution of operational precision. Unified data,
                architectural workflows, and AI-driven management in one
                seamless canvas.
              </p>
            </div>

            <div>
              <div className="flex gap-16 text-sm mb-10">
                <div>
                  <p className="font-bold text-lg">99.9%</p>
                  <p className="text-blue-200 uppercase text-xs">
                    Operational Uptime
                  </p>
                </div>

                <div>
                  <p className="font-bold text-lg">Real-time</p>
                  <p className="text-blue-200 uppercase text-xs">
                    Project Syncing
                  </p>
                </div>
              </div>

              <p className="text-xs text-blue-200">
                © 2026 SmartOps Architectural Systems
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-center px-10 py-12">
          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;