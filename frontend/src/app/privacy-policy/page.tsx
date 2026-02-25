import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield, Lock, Eye, FileText, Bell, Globe } from "lucide-react";

export const metadata = {
    title: "Privacy Policy - Trimurti Tours & Travels",
    description: "Learn how Trimurti Tours & Travels collects, uses, and protects your personal data.",
};

export default function PrivacyPolicy() {
    return (
        <main className="min-h-screen bg-slate-50">
            <Navbar />

            <div className="pt-32 pb-24">
                <div className="container max-w-4xl mx-auto px-4">
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                        <div className="bg-slate-900 px-8 py-12 text-center text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -mr-32 -mt-32" />
                            <div className="relative z-10">
                                <Shield className="w-16 h-16 text-primary mx-auto mb-6" />
                                <h1 className="text-4xl md:text-5xl font-black font-display mb-4 italic">Privacy Policy</h1>
                                <p className="text-slate-400 font-medium">Last updated: February 25, 2026</p>
                            </div>
                        </div>

                        <div className="p-8 md:p-12 space-y-12 text-slate-600 leading-relaxed font-medium">
                            <section className="space-y-4">
                                <div className="flex items-center gap-3 text-slate-900 mb-6">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-primary">
                                        <Globe size={20} />
                                    </div>
                                    <h2 className="text-2xl font-black uppercase tracking-tight">Introduction</h2>
                                </div>
                                <p>
                                    At Trimurti Tours & Travels ("we," "our," or "us"), we prioritize the privacy and security of our customers.
                                    This Privacy Policy describes how we collect, use, and share your personal information when you use our website
                                    and cab services in Amravati and surrounding regions.
                                </p>
                            </section>

                            <section className="space-y-4">
                                <div className="flex items-center gap-3 text-slate-900 mb-6">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-primary">
                                        <Eye size={20} />
                                    </div>
                                    <h2 className="text-2xl font-black uppercase tracking-tight">Information We Collect</h2>
                                </div>
                                <p>When you book a ride or interact with our platform, we may collect the following information:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li><b>Identification Data:</b> Name, phone number, and email address.</li>
                                    <li><b>Trip Details:</b> Pickup location, drop-off location, date, and time.</li>
                                    <li><b>Device Information:</b> IP address, browser type, and operating system for security purposes.</li>
                                    <li><b>Communication Logs:</b> Records of your WhatsApp chats or calls regarding bookings.</li>
                                </ul>
                            </section>

                            <section className="space-y-4">
                                <div className="flex items-center gap-3 text-slate-900 mb-6">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-primary">
                                        <Lock size={20} />
                                    </div>
                                    <h2 className="text-2xl font-black uppercase tracking-tight">How We Use Your Data</h2>
                                </div>
                                <p>We use the collected information for various purposes, including:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>To provide and manage your cab bookings effectively.</li>
                                    <li>To send booking confirmations and status updates via WhatsApp and Telegram.</li>
                                    <li>To improve our services and customer experience.</li>
                                    <li>To prevent fraudulent bookings and ensure the safety of our drivers and passengers.</li>
                                    <li>To comply with legal obligations and government regulations.</li>
                                </ul>
                            </section>

                            <section className="space-y-4">
                                <div className="flex items-center gap-3 text-slate-900 mb-6">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-primary">
                                        <Bell size={20} />
                                    </div>
                                    <h2 className="text-2xl font-black uppercase tracking-tight">Data Retention</h2>
                                </div>
                                <p>
                                    We retain your personal data only as long as necessary for the purposes set out in this policy.
                                    Booking records are maintained for professional auditing and to facilitate faster future bookings for returning customers.
                                </p>
                            </section>

                            <div className="pt-10 border-t border-slate-100">
                                <div className="bg-slate-50 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="space-y-1 text-center md:text-left">
                                        <p className="text-slate-900 font-bold">Have questions about your data?</p>
                                        <p className="text-sm">Contact our security team for any privacy-related concerns.</p>
                                    </div>
                                    <a
                                        href="mailto:trimurtitoursandtravel@gmail.com"
                                        className="px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-primary transition-all active:scale-95"
                                    >
                                        Contact Us
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
