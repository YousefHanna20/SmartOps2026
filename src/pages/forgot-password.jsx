import AuthLayout from "../components/auth/auth-layout";
import ForgotPasswordForm from "../components/auth/forget-pass/forgot-password-form";

function ForgotPassword() {
  return (
    <AuthLayout showBrandPanel={true}>
      <ForgotPasswordForm />
    </AuthLayout>
  );
}

export default ForgotPassword;