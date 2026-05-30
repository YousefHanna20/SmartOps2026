import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../../context/auth-context";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),

  password: z
    .string()
    .min(1, "Password is required"),
});

function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (formData) => {
    try {
      await login(formData);
      navigate("/dashboard");
    } catch (error) {
      const responseData = error.response?.data;

      if (responseData?.errors) {
        responseData.errors.forEach((err) => {
          setError(err.field || "root", {
            type: "server",
            message: err.message,
          });
        });
      } else {
        setError("root", {
          type: "server",
          message: responseData?.message || "Login failed. Please try again.",
        });
      }
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

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
        {errors.root && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
            {errors.root.message}
          </div>
        )}

        <div>
          <label className="text-xs font-semibold text-slate-600">
            Email Address
          </label>

          <input
            type="email"
            placeholder="name@company.com"
            className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-600"
            {...register("email")}
          />

          {errors.email && (
            <p className="text-xs text-red-600 mt-1">
              {errors.email.message}
            </p>
          )}
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
            placeholder="********"
            className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-600"
            {...register("password")}
          />

          {errors.password && (
            <p className="text-xs text-red-600 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#0b2a4a] text-white py-3 rounded-lg text-sm font-semibold hover:bg-[#123b66] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Signing in..." : "Sign Into Dashboard"}
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