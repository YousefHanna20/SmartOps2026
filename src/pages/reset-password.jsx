import AuthLayout from "../components/auth/auth-layout";
import ResetPasswordForm from "../components/auth/reset-pass/reset-password-form";

function ResetPassword() {
  return (
    <AuthLayout showBrandPanel={true}>
      <ResetPasswordForm />
    </AuthLayout>
  );
}

export default ResetPassword;