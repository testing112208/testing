import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReviewsSection from "@/components/ReviewsSection";

export default function ReviewsPage() {
    return (
        <main className="min-h-screen">
            <Navbar />
            <div className="pt-24 pb-12">
                <ReviewsSection />
            </div>
            <Footer />
        </main>
    );
}
