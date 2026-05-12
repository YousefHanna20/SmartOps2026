import ResetPasswordForm from "../components/auth/reset-pass/reset-password-form";
import AuthLogo from "../components/auth/auth-logo";
import AuthPageFooter from "../components/auth/auth-page-footer";

function ResetPassword() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-6 py-10">
      <main className="flex-1 w-full flex flex-col items-center justify-center">
        <AuthLogo />
        <ResetPasswordForm />
      </main>

      <AuthPageFooter />
    </div>
  );
}

export default ResetPassword;