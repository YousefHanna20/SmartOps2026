import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifyOtp, forgotPassword } from "../../../services/user-service";

const otpSchema = z.object({
  otp1: z.string().regex(/^\d$/, "OTP must be 6 digits"),
  otp2: z.string().regex(/^\d$/, "OTP must be 6 digits"),
  otp3: z.string().regex(/^\d$/, "OTP must be 6 digits"),
  otp4: z.string().regex(/^\d$/, "OTP must be 6 digits"),
  otp5: z.string().regex(/^\d$/, "OTP must be 6 digits"),
  otp6: z.string().regex(/^\d$/, "OTP must be 6 digits"),
});

function VerifyOtpCard() {
  const navigate = useNavigate();

  const [success, setSuccess] = useState("");
  const [resendLoading, setResendLoading] = useState(false);

  const email = localStorage.getItem("resetEmail");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp1: "",
      otp2: "",
      otp3: "",
      otp4: "",
      otp5: "",
      otp6: "",
    },
  });

  const otpValues = watch();

  const getOtpCode = (data) => {
    return `${data.otp1}${data.otp2}${data.otp3}${data.otp4}${data.otp5}${data.otp6}`;
  };

  const handleOtpChange = (event, index) => {
    const value = event.target.value.replace(/\D/g, "").slice(0, 1);

    setValue(`otp${index}`, value, {
      shouldValidate: true,
      shouldDirty: true,
    });

    clearErrors("root");

    if (value && index < 6) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (event, index) => {
    if (event.key === "Backspace" && !watch(`otp${index}`) && index > 1) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const onSubmit = async (formData) => {
    setSuccess("");

    if (!email) {
      setError("root", {
        type: "manual",
        message: "Email not found. Please request a new OTP.",
      });
      return;
    }

    const otp = getOtpCode(formData);

    try {
      const data = await verifyOtp({
        email,
        otp,
      });

      setSuccess(data.message || "OTP verified successfully");

      setTimeout(() => {
        navigate("/reset-password");
      }, 1000);
    } catch (error) {
      const responseData = error.response?.data;

      if (responseData?.errors) {
        responseData.errors.forEach((err) => {
          setError("root", {
            type: "server",
            message: err.message,
          });
        });
      } else {
        setError("root", {
          type: "server",
          message:
            responseData?.message || "OTP verification failed. Please try again.",
        });
      }
    }
  };

  const handleResendOtp = async () => {
    setSuccess("");
    clearErrors();

    if (!email) {
      setError("root", {
        type: "manual",
        message: "Email not found. Please request a new OTP.",
      });
      return;
    }

    setResendLoading(true);

    try {
      const data = await forgotPassword(email);

      setSuccess(data.message || "OTP sent to your email successfully");

      for (let i = 1; i <= 6; i++) {
        setValue(`otp${i}`, "");
      }

      document.getElementById("otp-1")?.focus();
    } catch (error) {
      const responseData = error.response?.data;

      if (responseData?.errors) {
        responseData.errors.forEach((err) => {
          setError("root", {
            type: "server",
            message: err.message,
          });
        });
      } else {
        setError("root", {
          type: "server",
          message:
            responseData?.message || "Failed to resend OTP. Please try again.",
        });
      }
    } finally {
      setResendLoading(false);
    }
  };

  const otpError =
    errors.root?.message ||
    errors.otp1?.message ||
    errors.otp2?.message ||
    errors.otp3?.message ||
    errors.otp4?.message ||
    errors.otp5?.message ||
    errors.otp6?.message;

  return (
    <div className="w-full max-w-[480px]">
      <div className="bg-surface-container-lowest rounded-md shadow-[0_8px_32px_rgba(25,28,30,0.04)] overflow-hidden">
        <div className="p-8 sm:p-12 flex flex-col items-center text-center">
          <div className="mb-10">
            <div className="flex items-center justify-center gap-2 mb-8">
              <div className="w-10 h-10 bg-primary rounded-md flex items-center justify-center">
                <span
                  className="material-symbols-outlined text-white"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  security
                </span>
              </div>

              <span className="text-xl font-bold tracking-tighter text-primary">
                SmartOps
              </span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-on-surface mb-3">
              Verify OTP
            </h1>

            <p className="text-on-surface-variant text-sm tracking-wide leading-relaxed">
              Check your email for the code
            </p>

            {email && (
              <p className="text-xs text-slate-500 mt-2">
                Code sent to {email}
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-10">
            {otpError && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 text-left">
                {otpError}
              </div>
            )}

            {success && (
              <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
                {success}
              </div>
            )}

            <div className="flex justify-between gap-3 sm:gap-4">
              {[1, 2, 3, 4, 5, 6].map((index) => (
                <input
                  id={`otp-${index}`}
                  key={index}
                  aria-label={`Digit ${index}`}
                  className="otp-field w-full h-14 sm:h-16 text-center text-2xl font-bold rounded-md bg-surface-container-high border-none transition-all duration-200 text-primary focus:outline-none focus:bg-white focus:shadow-[0_0_0_1px_#03244833]"
                  maxLength="1"
                  type="text"
                  inputMode="numeric"
                  value={otpValues[`otp${index}`] || ""}
                  {...register(`otp${index}`)}
                  onChange={(event) => handleOtpChange(event, index)}
                  onKeyDown={(event) => handleKeyDown(event, index)}
                />
              ))}
            </div>

            <div className="space-y-6">
              <button
                className="w-full h-12 bg-gradient-to-br from-primary to-primary-container text-on-primary font-semibold rounded-md shadow-lg shadow-primary/10 hover:opacity-90 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Verifying..." : "Verify"}
              </button>

              <div className="flex flex-col items-center gap-4">
                <button
                  onClick={handleResendOtp}
                  className="text-sm font-medium text-primary hover:underline underline-offset-4 decoration-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  type="button"
                  disabled={resendLoading || isSubmitting}
                >
                  {resendLoading ? "Sending..." : "Resend OTP"}
                </button>

                <div className="w-12 h-[2px] bg-surface-container-highest rounded-full" />

                <button
                  onClick={() => navigate("/login")}
                  className="flex items-center gap-2 text-xs font-bold text-on-surface-variant uppercase tracking-widest hover:text-primary transition-colors"
                  type="button"
                >
                  <span className="material-symbols-outlined text-sm">
                    arrow_back
                  </span>
                  Back to Login
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center gap-6 opacity-60">
        <p className="text-[10px] text-on-surface-variant font-medium uppercase tracking-[0.2em]">
          Enterprise Grade Meridian Security
        </p>
      </div>
    </div>
  );
}

export default VerifyOtpCard;