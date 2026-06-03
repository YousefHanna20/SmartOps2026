import AuthLayout from "../components/auth/auth-layout";
import VerifyOtpCard from "../components/auth/otp/verifyotp-card";

function VerifyOtp() {
  return (
    <AuthLayout showBrandPanel={true}>
      <VerifyOtpCard />
    </AuthLayout>
  );
}

export default VerifyOtp;