import RegisterHero from "../components/auth/register/register-hero";
import RegisterForm from "../components/auth/register/register-form";
import RegisterFooter from "../components/auth//register/register-footer.jsx";

function Register() {
  return (
    <div className="bg-background font-body text-on-surface antialiased min-h-screen flex flex-col">
      <div className="flex-grow flex items-stretch min-h-screen overflow-hidden">
        <RegisterHero />
        <RegisterForm />
      </div>

      <RegisterFooter />
    </div>
  );
}

export default Register;