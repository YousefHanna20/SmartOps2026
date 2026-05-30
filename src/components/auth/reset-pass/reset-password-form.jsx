import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPassword } from "../../../services/user-service";

const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(1, "New password is required")
      .min(6, "New password must be at least 6 characters"),

    confirmPassword: z
      .string()
      .min(1, "Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

function ResetPasswordForm() {
  const navigate = useNavigate();
  const [success, setSuccess] = useState("");

  const email = localStorage.getItem("resetEmail");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (formData) => {
    setSuccess("");

    if (!email) {
      setError("root", {
        type: "manual",
        message: "Email not found. Please request a new OTP.",
      });
      return;
    }

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
            responseData?.message || "Password reset failed. Please try again.",
        });
      }
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
            placeholder="********"
            className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-600"
            {...register("newPassword")}
          />

          {errors.newPassword && (
            <p className="text-xs text-red-600 mt-1">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600">
            Confirm Password
          </label>

          <input
            type="password"
            placeholder="********"
            className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-600"
            {...register("confirmPassword")}
          />

          {errors.confirmPassword && (
            <p className="text-xs text-red-600 mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#0b2a4a] text-white py-3 rounded-lg text-sm font-semibold hover:bg-[#123b66] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Resetting..." : "Reset Password"}
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