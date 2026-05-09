import Navbar from "../components/layout/navbar";
import Hero from "../components/landing/hero";
import Features from "../components/landing/features";
import ProductPreview from "../components/landing/product-preview";
import LandingFooter from "../components/landing/landing-footer";

function Landing() {
  return (
    <div className="bg-background font-body text-on-surface selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen">
      <Navbar />

      <main className="pt-24">
        <Hero />
        <Features />
        <ProductPreview />
      </main>

      <LandingFooter />
    </div>
  );
}

export default Landing;