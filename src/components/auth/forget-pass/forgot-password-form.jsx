import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { forgotPassword } from "../../../services/user-service";

function ForgotPasswordForm() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setErrors([]);
    setSuccess("");
    setLoading(true);

    try {
      const data = await forgotPassword(email);

      setSuccess(data.message || "OTP sent to your email successfully");

      localStorage.setItem("resetEmail", email);

      setTimeout(() => {
        navigate("/otp");
      }, 1000);
    } catch (error) {
      const responseData = error.response?.data;

      if (responseData?.errors) {
        setErrors(responseData.errors.map((err) => err.message));
      } else {
        setErrors([
          responseData?.message || "Failed to send OTP. Please try again.",
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-slate-900 text-center">
        Forgot Password
      </h2>

      <p className="text-sm text-slate-500 text-center mt-2">
        Enter your email to receive a password reset code.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {errors.length > 0 && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
            <ul className="list-disc list-inside space-y-1">
              {errors.map((errorMessage, index) => (
                <li key={index}>{errorMessage}</li>
              ))}
            </ul>
          </div>
        )}

        {success && (
          <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        <div>
          <label className="text-xs font-semibold text-slate-600">
            Email Address
          </label>

          <input
            type="email"
            placeholder="name@company.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-600"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#0b2a4a] text-white py-3 rounded-lg text-sm font-semibold hover:bg-[#123b66] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Sending OTP..." : "Send OTP →"}
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