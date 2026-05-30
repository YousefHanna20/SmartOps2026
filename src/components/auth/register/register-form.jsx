import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerUser } from "../../../services/user-service";

const registerSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),

  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),

  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

function RegisterForm() {
  const navigate = useNavigate();
  const [success, setSuccess] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(registerSchema),
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
            responseData?.message || "Register failed. Please try again.",
        });
      }
    }
  };

  return (
    <div className="w-full md:w-7/12 flex items-center justify-center p-8 md:p-16 lg:p-24 bg-surface">
      <div className="w-full max-w-md">
        <div className="mb-12">
          <h2 className="text-4xl lg:text-5xl text-on-surface font-black tracking-tight mb-2">
            Create Account
          </h2>

          <p className="text-on-surface-variant">
            Join the architectural editorial ecosystem.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

          <div className="grid grid-cols-1 gap-6">
            <FormInput
              label="Full Name"
              type="text"
              placeholder="Johnathan Sterling"
              error={errors.name?.message}
              registerProps={register("name")}
            />

            <FormInput
              label="Email Address"
              type="email"
              placeholder="j.sterling@firm.com"
              error={errors.email?.message}
              registerProps={register("email")}
            />

            <FormInput
              label="Password"
              type="password"
              placeholder="••••••••••••"
              error={errors.password?.message}
              registerProps={register("password")}
            />
          </div>

          <div className="pt-4">
            <button
              className="w-full bg-primary text-on-primary font-bold py-4 rounded-lg shadow-lg shadow-primary/10 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating Account..." : "Initialize Account"}

              <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </button>
          </div>

          <p className="text-center text-sm text-on-surface-variant pt-4">
            Already part of SmartOps?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-primary font-bold hover:underline"
            >
              Sign In
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

function FormInput({ label, type, placeholder, registerProps, error }) {
  return (
    <div className="space-y-2">
      <label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant block">
        {label}
      </label>

      <input
        className="w-full bg-surface-container-high border-none rounded-lg px-4 py-3.5 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all duration-300 text-on-surface placeholder:text-outline"
        placeholder={placeholder}
        type={type}
        {...registerProps}
      />

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

export default RegisterForm;