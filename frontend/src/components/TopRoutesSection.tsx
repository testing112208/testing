import { MapPin, Navigation, ArrowRight } from "lucide-react";

const routes = [
    { from: "Amravati", to: "Nagpur", distance: "155 km", price: "Starting ₹2,499" },
    { from: "Amravati", to: "Pune", distance: "560 km", price: "Starting ₹8,999" },
    { from: "Amravati", to: "Mumbai", distance: "660 km", price: "Starting ₹10,499" },
    { from: "Amravati", to: "Chikhaldara", distance: "85 km", price: "Starting ₹1,999" },
    { from: "Amravati", to: "Akola", distance: "95 km", price: "Starting ₹1,800" },
    { from: "Amravati", to: "Yavatmal", distance: "90 km", price: "Starting ₹1,700" },
];

const TopRoutesSection = () => {
    return (
        <section className="py-20 bg-slate-50 overflow-hidden font-sans">
            <div className="container">
                <div className="text-center max-w-2xl mx-auto mb-16 animate-fade-in-up">
                    <span className="section-badge">Popular Outstation Routes</span>
                    <h2 className="section-title text-4xl font-black text-slate-900 tracking-tight">Best Outstation Taxi from Amravati</h2>
                    <p className="section-subtitle">
                        Reliable one way taxi from Amravati and round trip cab service for popular destinations. Safe and affordable intercity cab Amravati.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {routes.map((route, idx) => (
                        <div
                            key={`${route.from}-${route.to}`}
                            className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-primary/20 hover:shadow-xl transition-all duration-300 group animate-fade-in-up"
                            style={{ animationDelay: `${(idx + 1) * 0.1}s` }}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                        <Navigation size={18} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 leading-none">
                                            {route.from} to {route.to} Cab
                                        </h3>
                                        <p className="text-xs text-slate-400 mt-1 font-semibold uppercase tracking-widest">{route.distance}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                <p className="text-primary font-black text-sm">{route.price}</p>
                                <div className="flex items-center gap-2 text-xs font-black text-slate-400 group-hover:text-primary transition-colors">
                                    Book Now <ArrowRight size={14} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 p-8 bg-white/50 border border-slate-100 rounded-[2.5rem] backdrop-blur-sm animate-fade-in">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Need a customized trip?</h3>
                            <p className="text-slate-500 text-sm leading-relaxed mb-6 font-medium">
                                Whether it's a 24/7 taxi service in Amravati for local use or a long outstation taxi Amravati to Melghat, Wardha or even Amarnath temple, we've got you covered with specialized tour packages and online taxi booking Amravati.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">Amravati Travel Guide</span>
                                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">Trustworthy Service</span>
                                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">24/7 Support</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                                <p className="text-primary font-black text-center text-sm">Amravati to Pune Taxi</p>
                            </div>
                            <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                                <p className="text-primary font-black text-center text-sm">Amravati to Mumbai Cab</p>
                            </div>
                            <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                                <p className="text-primary font-black text-center text-sm">Best rated taxi in Amravati</p>
                            </div>
                            <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                                <p className="text-primary font-black text-center text-sm">Cheap taxi service Amravati</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TopRoutesSection;
