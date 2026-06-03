import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { resetPassword } from "../../../services/user-service";
import { handleApiError } from "../../../utils/handle-api-error";

const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .trim()
      .min(1, "New password is required")
      .min(8, "New password must be at least 8 characters"),

    confirmPassword: z
      .string()
      .trim()
      .min(1, "Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

function ResetPasswordForm() {
  const navigate = useNavigate();

  const [success, setSuccess] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const email = sessionStorage.getItem("resetEmail");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onBlur",
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
        newPassword: formData.newPassword.trim(),
      });

      setSuccess(data.message || "Password reset successfully");

      sessionStorage.removeItem("resetEmail");

      setTimeout(() => {
        navigate("/login");
      }, 1800);
    } catch (error) {
      handleApiError(
        error,
        setError,
        "Password reset failed. Please try again."
      );
    }
  };

  return (
    <div className="w-full max-w-sm">
      <h2 className="text-2xl font-bold text-slate-900 text-center">
        Set New Password
      </h2>

      <p className="text-sm text-slate-500 text-center mt-2">
        Your new password must be at least 8 characters.
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

        <PasswordInput
          id="newPassword"
          label="New Password"
          placeholder="********"
          autoComplete="new-password"
          showPassword={showNewPassword}
          onTogglePassword={() => setShowNewPassword((current) => !current)}
          error={errors.newPassword?.message}
          registerProps={register("newPassword")}
        />

        <PasswordInput
          id="confirmPassword"
          label="Confirm Password"
          placeholder="********"
          autoComplete="new-password"
          showPassword={showConfirmPassword}
          onTogglePassword={() =>
            setShowConfirmPassword((current) => !current)
          }
          error={errors.confirmPassword?.message}
          registerProps={register("confirmPassword")}
        />

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

function PasswordInput({
  id,
  label,
  placeholder,
  autoComplete,
  showPassword,
  onTogglePassword,
  registerProps,
  error,
}) {
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className="text-xs font-semibold text-slate-600">
        {label}
      </label>

      <div className="relative mt-2">
        <input
          id={id}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className="w-full rounded-lg border border-slate-200 px-4 py-3 pr-12 text-sm outline-none focus:border-blue-600"
          {...registerProps}
        />

        <button
          type="button"
          onClick={onTogglePassword}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0b2a4a]"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          <span className="material-symbols-outlined text-[20px]">
            {showPassword ? "visibility_off" : "visibility"}
          </span>
        </button>
      </div>

      {error && (
        <p id={errorId} className="text-xs text-red-600 mt-1">
          {error}
        </p>
      )}
    </div>
  );
}

export default ResetPasswordForm;