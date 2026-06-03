import { useNavigate } from "react-router-dom";

function Hero() {

   const navigate = useNavigate();
  return (
    <section id="home" className="max-w-7xl mx-auto px-8 mb-24">
      <div className="flex flex-col lg:flex-row gap-16 items-center pt-16">
        <div className="flex-1 space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-tertiary-container/10 text-on-tertiary-container font-semibold text-xs tracking-widest uppercase">
            <span
              className="material-symbols-outlined text-[14px] mr-2"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              bolt
            </span>
            Next-Gen Automation
          </div>

          <h1 className="text-6xl lg:text-8xl font-black text-primary tracking-tighter leading-[0.9]">
            Smart Project Management <br />
            <span className="bg-gradient-to-r from-primary via-on-primary-container to-primary bg-clip-text text-transparent">
              Made Simple
            </span>
          </h1>

          <p className="text-xl text-on-surface-variant max-w-2xl leading-relaxed">
            Elevate your operational intelligence with an architectural approach
            to workflow design. Scale faster, track deeper, and automate the
            mundane.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
            <button
             onClick={() => navigate("/register")}
             className="px-8 py-4 bg-primary text-on-primary rounded-md font-bold tracking-tight shadow-lg shadow-primary/20 hover:scale-[0.98] transition-all flex items-center justify-center"
             >
               Start Free Trial
              <span className="material-symbols-outlined ml-2">
                       arrow_forward
             </span>
            </button>

           
              <button
               type="button"
                 onClick={() => {
                 document.getElementById("footer")?.scrollIntoView({
                  behavior: "smooth",
                    });
                 }}
                 className="px-8 py-4 bg-secondary-container text-on-secondary-container rounded-md font-bold tracking-tight hover:bg-slate-200 transition-colors flex items-center justify-center"
                  >
                    Request Demo
                </button>
            
          </div>
        </div>

        <div className="flex-1 w-full relative">
          <div className="relative z-10 bg-surface-container-lowest rounded-xl shadow-2xl overflow-hidden shadow-blue-900/10 border border-white/20">
            <img
              alt="Dashboard Preview"
              className="w-full h-auto"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBvt5iIqYS5Y4hpOM4jhWGUeYbt84iL-gOERy0zyErVLRYvhQQQShpmV5Do6fTXnZdFI9ro5laC_AK1DmgzFq5Da4ibZWtktIP9bN8WwA7Vb6K0qNi1pUcf6bKjjWDz2EjCt0-JmDimYDp6dW4uTt5zzMCu6-x7isKd6JVDpZLMWjuJMFI8LLs288ExUf-c-HsT350EYzs2D4wE-ThGZpSiI8dzT6A1rUbapeTAVPEVjpTpLtG3p5w7iQaIqhPHzrpVx6RBk12F9Cg"
            />
          </div>

          <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary-fixed opacity-20 blur-3xl rounded-full -z-0" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-on-tertiary-container opacity-10 blur-3xl rounded-full -z-0" />
        </div>
      </div>
    </section>
  );
}

export default Hero;