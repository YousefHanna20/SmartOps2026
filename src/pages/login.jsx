import AuthLayout from "../components/auth/auth-layout";
import LoginForm from "../components/auth/login-form";


function Login() {
  return (
    <AuthLayout showBrandPanel={true}>
      <LoginForm />
    </AuthLayout>
  );
}

export default Login;