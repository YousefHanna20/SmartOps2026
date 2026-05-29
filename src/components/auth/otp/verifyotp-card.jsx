import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyOtp, forgotPassword } from "../../../services/user-service";

function VerifyOtpCard() {
  const navigate = useNavigate();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState("");

  const email = localStorage.getItem("resetEmail");

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      const previousInput = document.getElementById(`otp-${index - 1}`);
      previousInput?.focus();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setErrors([]);
    setSuccess("");

    if (!email) {
      setErrors(["Email not found. Please request a new OTP."]);
      return;
    }

    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      setErrors(["OTP must be 6 digits"]);
      return;
    }

    setLoading(true);

    try {
      const data = await verifyOtp({
        email,
        otp: otpCode,
      });

      setSuccess(data.message || "OTP verified successfully");

      setTimeout(() => {
        navigate("/reset-password");
      }, 1000);
    } catch (error) {
      const responseData = error.response?.data;

      if (responseData?.errors) {
        setErrors(responseData.errors.map((err) => err.message));
      } else {
        setErrors([
          responseData?.message || "OTP verification failed. Please try again.",
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setErrors([]);
    setSuccess("");

    if (!email) {
      setErrors(["Email not found. Please request a new OTP."]);
      return;
    }

    setResendLoading(true);

    try {
      const data = await forgotPassword(email);
      setSuccess(data.message || "OTP sent to your email successfully");
      setOtp(["", "", "", "", "", ""]);
    } catch (error) {
      const responseData = error.response?.data;

      if (responseData?.errors) {
        setErrors(responseData.errors.map((err) => err.message));
      } else {
        setErrors([
          responseData?.message || "Failed to resend OTP. Please try again.",
        ]);
      }
    } finally {
      setResendLoading(false);
    }
  };

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

          <form onSubmit={handleSubmit} className="w-full space-y-10">
            {errors.length > 0 && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 text-left">
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

            <div className="flex justify-between gap-3 sm:gap-4">
              {otp.map((digit, index) => (
                <input
                  id={`otp-${index}`}
                  key={index}
                  aria-label={`Digit ${index + 1}`}
                  className="otp-field w-full h-14 sm:h-16 text-center text-2xl font-bold rounded-md bg-surface-container-high border-none transition-all duration-200 text-primary focus:outline-none focus:bg-white focus:shadow-[0_0_0_1px_#03244833]"
                  maxLength="1"
                  type="text"
                  inputMode="numeric"
                  value={digit}
                  onChange={(event) => handleChange(index, event.target.value)}
                  onKeyDown={(event) => handleKeyDown(index, event)}
                />
              ))}
            </div>

            <div className="space-y-6">
              <button
                className="w-full h-12 bg-gradient-to-br from-primary to-primary-container text-on-primary font-semibold rounded-md shadow-lg shadow-primary/10 hover:opacity-90 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                type="submit"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify"}
              </button>

              <div className="flex flex-col items-center gap-4">
                <button
                  onClick={handleResendOtp}
                  className="text-sm font-medium text-primary hover:underline underline-offset-4 decoration-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  type="button"
                  disabled={resendLoading}
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
        <div className="flex gap-4">
          <div className="w-24 h-16 rounded-md bg-surface-container-low flex items-center justify-center p-3">
            <img
              alt="ISO Certification"
              className="opacity-50 mix-blend-multiply"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBq_6ysQBQGkK7dSlsC60qKFlxtEuXivRd12Bf--schTNLX4OU3caG0df6UE6qC2wnsslSXBHOnRszoJe7pilLno-QRuKf_KGnN3eC--Jta8ktsLmBTRkOnu1pnVjARsgU_EDGaXKIB7JaJYd82_pS52ILRrWqonU1Bp_hFdZ2pcMoyrKa7SRjk5MgvKpJVaLfPcsV-Z2RmgherHNvuPYJhKUbw2ntJEFSi28ABiMWPz1B-l3H01pdIu74fY2NCNmN47Cq1k-K6LRM"
            />
          </div>

          <div className="w-24 h-16 rounded-md bg-surface-container-low flex items-center justify-center p-3">
            <img
              alt="Data Protection"
              className="opacity-50 mix-blend-multiply"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB87UDKTxF0Xvh2zopgvrnefe_Pd5tTl2iPGk9gKb-ux0MWoXN85uoYLUMzvv4gzOnNPcO0ycQBGbni_TG3WnM-copRKdmj1AbUPH20a4kbIZyzT1wF7RbFpSziDnzHQkv25fMAAGYcO2553OLSREkfzJ8m6b2jIJRSUhUspVH_eSQ4GCHkuwEu6h112e43xZ58ITVMMKSTyhV9TXqPXeBEbppk_PPFb0nzJtqTXIc6sciQbsJBNXmLFlpriyEurCEsc2_9Zc5jNgA"
            />
          </div>
        </div>

        <p className="text-[10px] text-on-surface-variant font-medium uppercase tracking-[0.2em]">
          Enterprise Grade Meridian Security
        </p>
      </div>
    </div>
  );
}

export default VerifyOtpCard;