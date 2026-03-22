import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import ServicesSection from "@/components/ServicesSection";
import FleetSection from "@/components/FleetSection";
import ReviewsSection from "@/components/ReviewsSection";
import WhyUsSection from "@/components/WhyUsSection";
import ContactSection from "@/components/ContactSection";

export default function Home() {
  // This will pass build but CRASH at runtime
  const trigger: any = undefined;
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center p-8 bg-white rounded-3xl shadow-xl">
        <h1 className="text-2xl font-black text-slate-900 mb-4">Testing Monitoring System...</h1>
        {trigger.xyz} {/* 100% Runtime Crash */}
      </div>
    </div>
  );
}
