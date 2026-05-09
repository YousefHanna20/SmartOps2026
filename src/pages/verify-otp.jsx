import VerifyOtpCard from "../components/auth/verifyotp-card";
import VerifyOtpFooter from "../components/auth/verifyotp-footer";

function VerifyOtp() {
  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col selection:bg-primary-fixed-dim selection:text-on-primary-fixed">
      <main className="flex-grow flex items-center justify-center p-6 sm:p-12">
        <VerifyOtpCard />
      </main>

      <VerifyOtpFooter />
    </div>
  );
}

export default VerifyOtp;