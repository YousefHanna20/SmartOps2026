import AuthLayout from "../components/auth/auth-layout";
import RegisterForm from "../components/auth/register/register-form";

function Register() {
  return (
    <AuthLayout showBrandPanel={true}>
      <RegisterForm />
    </AuthLayout>
  );
}

export default Register;