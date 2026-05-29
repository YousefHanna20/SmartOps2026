import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/auth-context";

function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

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
    setLoading(true);

    try {
      await login(formData);

      navigate("/dashboard");
    } catch (error) {
      const responseData = error.response?.data;

      if (responseData?.errors) {
        setErrors(responseData.errors.map((err) => err.message));
      } else {
        setErrors([
          responseData?.message || "Login failed. Please try again.",
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm">
      <h2 className="text-2xl font-bold text-slate-900 text-center">
        Welcome Back
      </h2>

      <p className="text-sm text-slate-500 mt-1 text-center">
        Access your architectural dashboard.
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

        <div>
          <label className="text-xs font-semibold text-slate-600">
            Email Address
          </label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="name@company.com"
            required
            className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-600"
          />
        </div>

        <div>
          <div className="flex justify-between">
            <label className="text-xs font-semibold text-slate-600">
              Password
            </label>

            <Link
              to="/forgot-password"
              className="text-xs text-blue-700 font-semibold"
            >
              Forgot?
            </Link>
          </div>

          <input
            type="password"
            name="password"
            value={formData.password}
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
          {loading ? "Signing in..." : "Sign Into Dashboard"}
        </button>
      </form>

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