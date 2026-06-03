import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { registerUser } from "../../../services/user-service";
import { handleApiError } from "../../../utils/handle-api-error";

const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),

  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),

  password: z
    .string()
    .trim()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

function RegisterForm() {
  const navigate = useNavigate();

  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (formData) => {
    setSuccess("");

    try {
      const data = await registerUser(formData);

      setSuccess(data.message || "Account created successfully");

      setTimeout(() => {
        navigate("/login");
      }, 1800);
    } catch (error) {
      handleApiError(error, setError, "Register failed. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-sm">
      <h2 className="text-2xl font-bold text-slate-900 text-center">
        Create Account
      </h2>

      <p className="text-sm text-slate-500 mt-1 text-center">
        Join SmartOps and start managing your projects.
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

        <FormInput
          id="name"
          label="Full Name"
          type="text"
          placeholder="Johnathan Sterling"
          autoComplete="name"
          error={errors.name?.message}
          registerProps={register("name")}
        />

        <FormInput
          id="email"
          label="Email Address"
          type="email"
          placeholder="j.sterling@firm.com"
          autoComplete="email"
          error={errors.email?.message}
          registerProps={register("email")}
        />

        <PasswordInput
          id="password"
          label="Password"
          placeholder="********"
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword((current) => !current)}
          error={errors.password?.message}
          registerProps={register("password")}
        />

        <button
          className="w-full bg-[#0b2a4a] text-white py-3 rounded-lg text-sm font-semibold hover:bg-[#123b66] disabled:opacity-60 disabled:cursor-not-allowed"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <p className="text-center text-sm text-slate-500 mt-6">
        Already part of SmartOps?{" "}
        <Link to="/login" className="text-blue-700 font-semibold">
          Sign in
        </Link>
      </p>
    </div>
  );
}

function FormInput({
  id,
  label,
  type,
  placeholder,
  autoComplete,
  registerProps,
  error,
}) {
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className="text-xs font-semibold text-slate-600">
        {label}
      </label>

      <input
        id={id}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-600"
        {...registerProps}
      />

      {error && (
        <p id={errorId} className="text-xs text-red-600 mt-1">
          {error}
        </p>
      )}
    </div>
  );
}

function PasswordInput({
  id,
  label,
  placeholder,
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
          autoComplete="new-password"
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

export default RegisterForm;