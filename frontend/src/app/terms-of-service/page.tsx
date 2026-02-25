import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FileText, Car, CreditCard, ShieldAlert, Clock, UserCheck } from "lucide-react";

export const metadata = {
    title: "Terms of Service - Trimurti Tours & Travels",
    description: "Read the terms and conditions for using Trimurti Tours & Travels services.",
};

export default function TermsOfService() {
    return (
        <main className="min-h-screen bg-slate-50">
            <Navbar />

            <div className="pt-32 pb-24">
                <div className="container max-w-4xl mx-auto px-4">
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                        <div className="bg-slate-900 px-8 py-12 text-center text-white relative overflow-hidden">
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/20 rounded-full blur-[80px] -ml-32 -mb-32" />
                            <div className="relative z-10">
                                <FileText className="w-16 h-16 text-primary mx-auto mb-6" />
                                <h1 className="text-4xl md:text-5xl font-black font-display mb-4 italic">Terms of Service</h1>
                                <p className="text-slate-400 font-medium">Last updated: February 25, 2026</p>
                            </div>
                        </div>

                        <div className="p-8 md:p-12 space-y-12 text-slate-600 leading-relaxed font-medium">
                            <section className="space-y-4">
                                <div className="flex items-center gap-3 text-slate-900 mb-6">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-primary">
                                        <UserCheck size={20} />
                                    </div>
                                    <h2 className="text-2xl font-black uppercase tracking-tight">Agreement to Terms</h2>
                                </div>
                                <p>
                                    By accessing our website and booking a ride with Trimurti Tours & Travels, you agree to be bound by these
                                    Terms of Service. If you do not agree with any part of these terms, you may not use our services.
                                </p>
                            </section>

                            <section className="space-y-4">
                                <div className="flex items-center gap-3 text-slate-900 mb-6">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-primary">
                                        <Car size={20} />
                                    </div>
                                    <h2 className="text-2xl font-black uppercase tracking-tight">Booking Policy</h2>
                                </div>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li><b>Advanced Booking:</b> While we accept last-minute bookings, it is recommended to book at least 2 hours in advance for local trips and 12 hours for outstation trips.</li>
                                    <li><b>Accurate Information:</b> Customers must provide accurate pickup and drop-off points to ensure correct fare calculation and driver arrival.</li>
                                    <li><b>Cab Availability:</b> Booking is subject to vehicle availability. In case of unavailability, we will notify you immediately.</li>
                                </ul>
                            </section>

                            <section className="space-y-4">
                                <div className="flex items-center gap-3 text-slate-900 mb-6">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-primary">
                                        <CreditCard size={20} />
                                    </div>
                                    <h2 className="text-2xl font-black uppercase tracking-tight">Fare and Payment</h2>
                                </div>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li><b>Estimated Fare:</b> The fare shown on the website is an estimate based on distance. Final fare may vary due to tolls, parking, or night charges.</li>
                                    <li><b>Tolls and Parking:</b> All bridge tolls, highway tolls, and parking charges are to be paid by the customer unless otherwise included in a package.</li>
                                    <li><b>Payment Methods:</b> We accept cash, UPI, and bank transfers at the end of the trip.</li>
                                </ul>
                            </section>

                            <section className="space-y-4">
                                <div className="flex items-center gap-3 text-slate-900 mb-6">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-primary">
                                        <Clock size={20} />
                                    </div>
                                    <h2 className="text-2xl font-black uppercase tracking-tight">Cancellation Policy</h2>
                                </div>
                                <p>
                                    Cancellations made within 30 minutes of the scheduled pickup time may incur a cancellation fee.
                                    If the driver arrives at the location and the customer is not present after 15 minutes of the scheduled time, the trip may be marked as "No-Show" and charges may apply.
                                </p>
                            </section>

                            <section className="space-y-4">
                                <div className="flex items-center gap-3 text-slate-900 mb-6">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-primary">
                                        <ShieldAlert size={20} />
                                    </div>
                                    <h2 className="text-2xl font-black uppercase tracking-tight">Liability</h2>
                                </div>
                                <p>
                                    While we strive for 100% punctuality, Trimurti Tours & Travels is not liable for delays caused by traffic,
                                    vehicle breakdowns, or extreme weather conditions beyond our control. Users are responsible for their
                                    personal belongings during the trip.
                                </p>
                            </section>

                            <div className="pt-10 border-t border-slate-100">
                                <div className="bg-slate-50 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="space-y-1 text-center md:text-left">
                                        <p className="text-slate-900 font-bold">Unsure about a policy?</p>
                                        <p className="text-sm">Call us for immediate clarification on our terms.</p>
                                    </div>
                                    <a
                                        href="tel:+918007065150"
                                        className="px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-primary transition-all active:scale-95"
                                    >
                                        Call Now
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
