import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function ForgotPasswordForm() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  // ✅ this is the NEW function (add it)
  const handleSubmit = (e) => {
    e.preventDefault();

    // simple validation (optional but good)
    if (!email) {
      alert("Please enter your email");
      return;
    }

    // simulate sending OTP
    console.log("Sending OTP to:", email);

    // navigate to reset password page
    navigate("/reset-password");
  };

  return (
    <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-slate-900 text-center">
        Forgot Password
      </h2>

      <p className="text-sm text-slate-500 text-center mt-2">
        Enter your email to receive a password reset code.
      </p>

      {/* ✅ attach the function here */}
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-600">
            Email Address
          </label>

          <input
            type="email"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-600"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#0b2a4a] text-white py-3 rounded-lg text-sm font-semibold hover:bg-[#123b66]"
        >
          Send OTP →
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

export default ForgotPasswordForm;