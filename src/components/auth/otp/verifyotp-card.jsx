import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { verifyOtp, forgotPassword } from "../../../services/user-service";
import { handleApiError } from "../../../utils/handle-api-error";

const digitSchema = z.string().regex(/^\d$/, "Please enter a valid digit");

const otpSchema = z.object({
  otp1: digitSchema,
  otp2: digitSchema,
  otp3: digitSchema,
  otp4: digitSchema,
  otp5: digitSchema,
  otp6: digitSchema,
});

function VerifyOtpCard() {
  const navigate = useNavigate();

  const [success, setSuccess] = useState("");
  const [resendLoading, setResendLoading] = useState(false);

  const inputRefs = useRef([]);

  const email = sessionStorage.getItem("resetEmail");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(otpSchema),
    mode: "onChange",
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

  const focusInput = (index) => {
    inputRefs.current[index]?.focus();
  };

  const setOtpDigit = (index, value) => {
    setValue(`otp${index + 1}`, value, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleOtpChange = (event, index) => {
    const value = event.target.value.replace(/\D/g, "").slice(0, 1);

    setOtpDigit(index, value);
    clearErrors("root");

    if (value && index < 5) {
      focusInput(index + 1);
    }
  };

  const handleKeyDown = (event, index) => {
    if (event.key === "Backspace" && !watch(`otp${index + 1}`) && index > 0) {
      focusInput(index - 1);
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();

    const pastedValue = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pastedValue) return;

    pastedValue.split("").forEach((digit, index) => {
      setOtpDigit(index, digit);
    });

    const nextIndex = Math.min(pastedValue.length, 6) - 1;
    focusInput(nextIndex);

    clearErrors("root");
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
      }, 1800);
    } catch (error) {
      handleApiError(
        error,
        setError,
        "OTP verification failed. Please try again."
      );
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

      reset();
      focusInput(0);
    } catch (error) {
      handleApiError(error, setError, "Failed to resend OTP. Please try again.");
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
    <div className="w-full max-w-sm">
      <h2 className="text-2xl font-bold text-slate-900 text-center">
        Verify OTP
      </h2>

      <p className="text-sm text-slate-500 text-center mt-2">
        Enter the 6-digit code sent to your email.
      </p>

      {email && (
        <p className="text-xs text-slate-500 mt-2 text-center">
          Code sent to {email}
        </p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        {otpError && (
          <div
            id="otp-error"
            className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 text-left"
          >
            {otpError}
          </div>
        )}

        {success && (
          <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        <div className="flex justify-between gap-3">
          {[1, 2, 3, 4, 5, 6].map((number, index) => {
            const fieldName = `otp${number}`;

            return (
              <input
                key={fieldName}
                id={`otp-${number}`}
                aria-label={`OTP digit ${number}`}
                aria-invalid={!!errors[fieldName]}
                aria-describedby={otpError ? "otp-error" : undefined}
                className="w-full h-14 text-center text-2xl font-bold rounded-lg bg-slate-100 border border-transparent transition-all duration-200 text-[#0b2a4a] focus:outline-none focus:border-blue-600 focus:bg-white"
                maxLength="1"
                type="text"
                inputMode="numeric"
                autoComplete={number === 1 ? "one-time-code" : "off"}
                value={otpValues[fieldName] || ""}
                {...register(fieldName)}
                ref={(element) => {
                  register(fieldName).ref(element);
                  inputRefs.current[index] = element;
                }}
                onChange={(event) => handleOtpChange(event, index)}
                onKeyDown={(event) => handleKeyDown(event, index)}
                onPaste={handlePaste}
              />
            );
          })}
        </div>

        <button
          className="w-full bg-[#0b2a4a] text-white py-3 rounded-lg text-sm font-semibold hover:bg-[#123b66] disabled:opacity-60 disabled:cursor-not-allowed"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Verifying..." : "Verify"}
        </button>

        <div className="flex flex-col items-center gap-4">
          <button
            onClick={handleResendOtp}
            className="text-sm font-medium text-blue-700 hover:underline disabled:opacity-60 disabled:cursor-not-allowed"
            type="button"
            disabled={resendLoading || isSubmitting}
          >
            {resendLoading ? "Sending..." : "Resend OTP"}
          </button>

          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest hover:text-blue-700 transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-sm">
              arrow_back
            </span>
            Back to Login
          </button>
        </div>
      </form>
    </div>
  );
}

export default VerifyOtpCard;