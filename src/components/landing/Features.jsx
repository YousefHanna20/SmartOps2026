function Features() {
  return (
    <section className="max-w-7xl mx-auto px-8 mb-32">
      <div className="mb-16">
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">
          Our Capabilities
        </h2>
        <h3 className="text-4xl font-black text-primary tracking-tighter">
          Precision Built Tools
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div className="md:col-span-2 lg:col-span-2 bg-surface-container-low p-10 rounded-xl flex flex-col justify-between group transition-all hover:bg-surface-container-lowest hover:shadow-xl hover:shadow-blue-900/5">
          <div>
            <div className="h-14 w-14 bg-primary text-on-primary rounded-md flex items-center justify-center mb-8">
              <span className="material-symbols-outlined text-3xl">
                account_tree
              </span>
            </div>

            <h4 className="text-2xl font-bold text-primary mb-4">
              Project Management
            </h4>

            <p className="text-on-surface-variant leading-relaxed">
              Centralize architectural complexity. Our hierarchical system
              allows for multi-layered task dependencies and resource allocation
              with zero friction.
            </p>
          </div>

          <div className="mt-8 flex items-center text-primary font-bold text-sm tracking-widest uppercase">
            Explore System
            <span className="material-symbols-outlined ml-2 text-sm">
              trending_flat
            </span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-8 rounded-xl flex flex-col shadow-sm border border-slate-100 hover:border-transparent transition-all hover:shadow-xl hover:shadow-blue-900/5">
          <div className="h-12 w-12 bg-on-tertiary-container/10 text-on-tertiary-container rounded-md flex items-center justify-center mb-6">
            <span className="material-symbols-outlined">
              assignment_turned_in
            </span>
          </div>

          <h4 className="text-lg font-bold text-primary mb-2">
            Task Tracking
          </h4>

          <p className="text-sm text-on-surface-variant leading-relaxed">
            Real-time status updates with integrated progress metrics and
            priority handling.
          </p>
        </div>

        <div className="bg-surface-container-lowest p-8 rounded-xl flex flex-col shadow-sm border border-slate-100 hover:border-transparent transition-all hover:shadow-xl hover:shadow-blue-900/5">
          <div className="h-12 w-12 bg-secondary-container text-on-secondary-container rounded-md flex items-center justify-center mb-6">
            <span className="material-symbols-outlined">hail</span>
          </div>

          <h4 className="text-lg font-bold text-primary mb-2">
            Client Requests
          </h4>

          <p className="text-sm text-on-surface-variant leading-relaxed">
            Streamline intake flows with custom portals and automated request
            triaging.
          </p>
        </div>

        <div className="lg:col-span-2 bg-primary p-10 rounded-xl relative overflow-hidden group">
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <div className="h-14 w-14 bg-on-primary text-primary rounded-md flex items-center justify-center mb-8">
                <span className="material-symbols-outlined text-3xl">
                  layers
                </span>
              </div>

              <h4 className="text-3xl font-bold text-on-primary mb-4 tracking-tight">
                AI Insights
              </h4>

              <p className="text-on-primary-container leading-relaxed max-w-md">
                Predictive analytics engine that forecasts bottlenecks before
                they occur. SmartOps learns your rhythm to optimize every
                project phase.
              </p>
            </div>
          </div>

          <div className="absolute top-0 right-0 h-full w-1/2 opacity-20 pointer-events-none">
            <img
              alt="AI visualization"
              className="h-full w-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9kDhf9ET92tYXUBPPDsWWDR2deQrpB0D7HGYLYldo-KRZMHsV9sMFizqEBOHH3qg1bzJZT688sro_My2enixRtxFcC5Ur1ZWRHTmzsSr8DMOxfHrOGIuh_52U6KWCpMBHtAGjiTGURslhJJ5AHKdq-dImpnCsJ8ZsUEqKEjUFhGfKZND9YUj2zzr8c_C66XqYgdMeIqVjEC2eBbLKAb2Mc1J--cTAfB5Vf0TmlZC9s26uXmT986uFX2-BIhiJQ4_4G5i35qAy3KY"
            />
          </div>
        </div>

        <div className="md:col-span-2 lg:col-span-2 bg-on-tertiary-container/5 p-10 rounded-xl flex items-center justify-between border border-on-tertiary-container/10">
          <div className="space-y-2">
            <span className="text-4xl font-black text-on-tertiary-container tracking-tighter">
              98%
            </span>
            <p className="text-sm font-bold uppercase tracking-widest text-on-tertiary-container/70">
              Efficiency Gain
            </p>
          </div>

          <div className="space-y-2 text-right">
            <span className="text-4xl font-black text-on-tertiary-container tracking-tighter">
              14k+
            </span>
            <p className="text-sm font-bold uppercase tracking-widest text-on-tertiary-container/70">
              Teams Optimized
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features;