import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import ServicesSection from "@/components/ServicesSection";
import FleetSection from "@/components/FleetSection";
import ReviewsSection from "@/components/ReviewsSection";
import WhyUsSection from "@/components/WhyUsSection";
import ContactSection from "@/components/ContactSection";

export default function Home() {
    // Forced crash for testing
    throw new Error("Forced crash for testing: Best Frontend Bad Commit Method");

    return (
        <main className="min-h-screen">
            <Navbar />
            <HeroSection />
            <section id="services">
                <ServicesSection />
            </section>
            <section id="fleet">
                <FleetSection />
            </section>
            <section id="reviews">
                <ReviewsSection />
            </section>
            <section id="why-us">
                <WhyUsSection />
            </section>
            <section id="contact">
                <ContactSection />
            </section>
            <Footer />
        </main>
    );
}
