import { Link } from "react-router-dom";

function ResetPasswordForm() {
  return (
    <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-slate-900 text-center">
        Set New Password
      </h2>
      <p className="text-sm text-slate-500 text-center mt-2">
        Your new password must be different from previous used passwords.
      </p>

      <form className="mt-8 space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-600">
            New Password
          </label>
          <input
            type="password"
            placeholder="********"
            className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-600"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600">
            Confirm Password
          </label>
          <input
            type="password"
            placeholder="********"
            className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-600"
          />
        </div>

        <button className="w-full bg-[#0b2a4a] text-white py-3 rounded-lg text-sm font-semibold hover:bg-[#123b66]">
          Reset Password
        </button>
      </form>

      <Link
        to="/login"
        className="block text-center text-sm text-slate-600 mt-6 hover:text-blue-700"
      >
        ← Back to Login
      </Link>
    </div>
  );
}

export default ResetPasswordForm;