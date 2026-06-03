function ProductPreview() {
  return (
    <section id="preview" className="max-w-7xl mx-auto px-8 mb-32">
      <div className="flex flex-col lg:flex-row-reverse items-center gap-20">
        <div className="lg:w-2/5 space-y-6">
          <h2 className="text-4xl lg:text-5xl font-black text-primary tracking-tighter leading-tight">
            Architectural Control Over Every Detail
          </h2>

          <p className="text-lg text-on-surface-variant leading-relaxed">
            Stop managing in the dark. SmartOps provides a single pane of glass
            for your entire operational lifecycle, from the first request to
            final delivery.
          </p>

          <ul className="space-y-4 pt-4">
            <li className="flex items-center gap-3 font-semibold text-primary">
              <span
                className="material-symbols-outlined text-on-tertiary-container"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
              Automated resource leveling
            </li>

            <li className="flex items-center gap-3 font-semibold text-primary">
              <span
                className="material-symbols-outlined text-on-tertiary-container"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
              Dynamic request prioritization
            </li>

            <li className="flex items-center gap-3 font-semibold text-primary">
              <span
                className="material-symbols-outlined text-on-tertiary-container"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
              Integrated time-cost analysis
            </li>
          </ul>
        </div>

        <div className="lg:w-3/5 bg-surface-container-low rounded-xl p-4 lg:p-12 relative">
          <div className="absolute -top-10 -left-10 hidden lg:block">
            <div className="bg-white p-6 rounded-lg shadow-xl shadow-blue-900/5 max-w-[200px]">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                Live Efficiency
              </p>

              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-on-tertiary-container w-[82%] rounded-full" />
              </div>

              <p className="mt-2 text-xl font-black text-primary">82.4%</p>
            </div>
          </div>

          <img
            alt="Detailed Analytics View"
            className="rounded-lg shadow-2xl"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3opPS1gEyy6ZFZJdATN1LvnrEr3xNpKOnFWUKpK0U0LXvB8vjzX2EgIHVP9PKIOqacnASfMkj-sc9HBdLCBQEMNzAGwqDkXPJ3EIlZ2C_WHJyih5FnlUe_ChnitVQvKwo0dakEqqf1BoHotjOl0EDnKHSfRFB7-TjfLEBBrkxVMprri0fQLxvK_ww_WcdF7ng9_4UmcIDnU_J5veainAIcAI-aft8ygtjnyIvLdKYVCmVbz0Tr8TY4n1OsiWjFUwLll4nS53UT4o"
          />
        </div>
      </div>
    </section>
  );
}

export default ProductPreview;