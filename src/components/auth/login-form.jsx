import { Link } from "react-router-dom";


function LoginForm() {
  return (
    <div className="w-full max-w-sm">
      <h2 className="text-2xl font-bold text-slate-900">Welcome Back</h2>
      <p className="text-sm text-slate-500 mt-1">
        Access your architectural dashboard.
      </p>

      <form className="mt-8 space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-600">
            Email Address
          </label>
          <input
            type="email"
            placeholder="name@company.com"
            className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-600"
          />
        </div>

        <div>
          <div className="flex justify-between">
            <label className="text-xs font-semibold text-slate-600">
              Password
            </label>
            <Link to="/forgot-password" className="text-xs text-blue-700 font-semibold">
              Forgot?
            </Link>
          </div>

          <input
            type="password"
            placeholder="********"
            className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-600"
          />
        </div>

        <label className="flex items-center gap-2 text-xs text-slate-500">
          <input type="checkbox" />
          Keep me signed in for 30 days
        </label>

        <button className="w-full bg-[#0b2a4a] text-white py-3 rounded-lg text-sm font-semibold hover:bg-[#123b66]">
          Sign Into Dashboard
        </button>
      </form>

      <div className="my-6 text-center text-xs text-slate-400">
        Enterprise SSO
      </div>

      <button className="w-full border border-slate-200 py-3 rounded-lg text-sm font-semibold">
        Continue with Google
      </button>

      <p className="text-center text-sm text-slate-500 mt-6">
        New to SmartOps?{" "}
        <Link to="/register" className="text-blue-700 font-semibold">
          Create an account
        </Link>
      </p>
    </div>
  );
}

export default LoginForm;