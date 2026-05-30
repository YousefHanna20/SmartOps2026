import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPassword } from "../../../services/user-service";

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

function ForgotPasswordForm() {
  const navigate = useNavigate();
  const [success, setSuccess] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (formData) => {
    setSuccess("");

    try {
      const data = await forgotPassword(formData.email);

      setSuccess(data.message || "OTP sent to your email successfully");

      localStorage.setItem("resetEmail", formData.email);

      setTimeout(() => {
        navigate("/otp");
      }, 1000);
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
          message:
            responseData?.message || "Failed to send OTP. Please try again.",
        });
      }
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

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
        {errors.root && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
            {errors.root.message}
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
            className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-600"
            {...register("email")}
          />

          {errors.email && (
            <p className="text-xs text-red-600 mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#0b2a4a] text-white py-3 rounded-lg text-sm font-semibold hover:bg-[#123b66] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Sending OTP..." : "Send OTP →"}
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