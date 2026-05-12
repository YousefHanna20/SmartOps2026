import ForgotPasswordForm from "../components/auth/forget-pass/forgot-password-form";
import AuthLogo from "../components/auth/auth-logo";
import AuthPageFooter from "../components/auth/auth-page-footer";

function ForgotPassword() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-6 py-10">
      <main className="flex-1 w-full flex flex-col items-center justify-center">
        <AuthLogo />
        <ForgotPasswordForm />
      </main>

      <AuthPageFooter />
    </div>
  );
}

export default ForgotPassword;