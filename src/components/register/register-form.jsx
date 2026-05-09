function RegisterForm() {
  return (
    <div className="w-full md:w-7/12 flex items-center justify-center p-8 md:p-16 lg:p-24 bg-surface">
      <div className="w-full max-w-md">
        <div className="mb-12">
          <h2 className="text-4xl lg:text-5xl text-on-surface font-black tracking-tight mb-2">
            Create Account
          </h2>
          <p className="text-on-surface-variant">
            Join the architectural editorial ecosystem.
          </p>
        </div>

        <form className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <FormInput
              label="Full Name"
              type="text"
              placeholder="Johnathan Sterling"
            />

            <FormInput
              label="Email Address"
              type="email"
              placeholder="j.sterling@firm.com"
            />

            <FormInput
              label="Password"
              type="password"
              placeholder="••••••••••••"
            />

            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant block">
                Account Role
              </label>

              <div className="grid grid-cols-3 gap-3">
                <RoleOption
                  value="admin"
                  icon="admin_panel_settings"
                  label="Admin"
                />

                <RoleOption
                  value="employee"
                  icon="badge"
                  label="Employee"
                  defaultChecked
                />

                <RoleOption
                  value="client"
                  icon="person_pin_circle"
                  label="Client"
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              className="w-full bg-primary text-on-primary font-bold py-4 rounded-lg shadow-lg shadow-primary/10 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
              type="submit"
            >
              Initialize Account
              <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </button>
          </div>

          <div className="flex items-center gap-4 py-2">
            <div className="h-[1px] flex-grow bg-outline-variant/30" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-outline">
              Social Registration
            </span>
            <div className="h-[1px] flex-grow bg-outline-variant/30" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              className="flex items-center justify-center gap-2 py-3 rounded-lg bg-surface-container-low border border-outline-variant/15 hover:bg-surface-container-high transition-colors"
              type="button"
            >
              <img
                alt="Google"
                className="w-4 h-4"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFB0ojiuNMuugT1AhpjMEOCFtWRmuSsBLLRCIo0XO1OMcrZNcBZ7dCEEbaTgXUJQohLzN_pSk3A8W6qzfj4rG7q2b2DxAHpx7NsnVwtlW_TKukbnPzFn0Txhg-rsH15Lx5x93C17Csuzl0QP4qp8lFdu_7GJqk46mAjaYpy7A5G9BvN2m5CPgWoDkCwD2egmbImZhsbpTyji39g1CT4nv9Ikq64mC-ZQKw19nOZYVnaYb23QKUVKhGR4TJprXFKkf9-J5fa9xS4tw"
              />
              <span className="text-[11px] font-bold uppercase tracking-widest text-on-surface">
                Google
              </span>
            </button>

            <button
              className="flex items-center justify-center gap-2 py-3 rounded-lg bg-surface-container-low border border-outline-variant/15 hover:bg-surface-container-high transition-colors"
              type="button"
            >
              <svg className="w-4 h-4 fill-on-surface" viewBox="0 0 24 24">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>

              <span className="text-[11px] font-bold uppercase tracking-widest text-on-surface">
                Github
              </span>
            </button>
          </div>

          <p className="text-center text-sm text-on-surface-variant pt-4">
            Already part of SmartOps?{" "}
            <a className="text-primary font-bold hover:underline" href="#">
              Sign In
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

function FormInput({ label, type, placeholder }) {
  return (
    <div className="space-y-2">
      <label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant block">
        {label}
      </label>

      <input
        className="w-full bg-surface-container-high border-none rounded-lg px-4 py-3.5 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all duration-300 text-on-surface placeholder:text-outline"
        placeholder={placeholder}
        type={type}
      />
    </div>
  );
}

function RoleOption({ value, icon, label, defaultChecked = false }) {
  return (
    <label className="cursor-pointer group">
      <input
        className="peer hidden"
        name="role"
        type="radio"
        value={value}
        defaultChecked={defaultChecked}
      />

      <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-surface-container-high text-on-surface-variant border-2 border-transparent peer-checked:bg-primary-container peer-checked:text-on-primary-container peer-checked:border-primary/20 transition-all duration-300 group-hover:bg-surface-container-highest">
        <span
          className="material-symbols-outlined mb-2"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          {icon}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-tighter">
          {label}
        </span>
      </div>
    </label>
  );
}

export default RegisterForm;