import logo from "../../assets/auth-logo.svg";
function AuthLogo() {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      <img src={logo} alt="SmartOps Logo" className="w-10 h-10 mt-3" />
      <h1 className="text-xl font-bold text-[#0b2a4a]">SmartOps</h1>
    </div>
  );
}

export default AuthLogo;