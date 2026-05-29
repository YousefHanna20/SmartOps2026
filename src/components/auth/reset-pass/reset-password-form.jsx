import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { resetPassword } from "../../../services/user-service";

function ResetPasswordForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState("");

  const email = localStorage.getItem("resetEmail");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setErrors([]);
    setSuccess("");

    if (!email) {
      setErrors(["Email not found. Please request a new OTP."]);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setErrors(["Passwords do not match"]);
      return;
    }

    setLoading(true);

    try {
      const data = await resetPassword({
        email,
        newPassword: formData.newPassword,
      });

      setSuccess(data.message || "Password reset successfully");

      localStorage.removeItem("resetEmail");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      const responseData = error.response?.data;

      if (responseData?.errors) {
        setErrors(responseData.errors.map((err) => err.message));
      } else {
        setErrors([
          responseData?.message || "Password reset failed. Please try again.",
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-slate-900 text-center">
        Set New Password
      </h2>

      <p className="text-sm text-slate-500 text-center mt-2">
        Your new password must be different from previous used passwords.
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

        {email && (
          <p className="text-xs text-slate-500 text-center">
            Resetting password for {email}
          </p>
        )}

        <div>
          <label className="text-xs font-semibold text-slate-600">
            New Password
          </label>

          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="********"
            required
            className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-600"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600">
            Confirm Password
          </label>

          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="********"
            required
            className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-600"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#0b2a4a] text-white py-3 rounded-lg text-sm font-semibold hover:bg-[#123b66] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Resetting..." : "Reset Password"}
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