import { MapPin, ArrowRight } from "lucide-react";

const allRoutes = [
    { city: "Nagpur", variants: ["Amravati to Nagpur taxi", "Amravati to Nagpur cab"] },
    { city: "Pune", variants: ["Amravati to Pune taxi", "Amravati to Pune cab"] },
    { city: "Mumbai", variants: ["Amravati to Mumbai taxi", "Amravati to Mumbai cab"] },
    { city: "Akola", variants: ["Amravati to Akola taxi", "Amravati to Akola cab"] },
    { city: "Yavatmal", variants: ["Amravati to Yavatmal taxi", "Amravati to Yavatmal cab"] },
    { city: "Wardha", variants: ["Amravati to Wardha taxi", "Amravati to Wardha cab"] },
    { city: "Chandrapur", variants: ["Amravati to Chandrapur taxi", "Amravati to Chandrapur cab"] },
    { city: "Washim", variants: ["Amravati to Washim taxi", "Amravati to Washim cab"] },
    { city: "Buldhana", variants: ["Amravati to Buldhana taxi", "Amravati to Buldhana cab"] },
    { city: "Jalgaon", variants: ["Amravati to Jalgaon taxi", "Amravati to Jalgaon cab"] },
    { city: "Aurangabad", variants: ["Amravati to Aurangabad taxi", "Amravati to Aurangabad cab"] },
    { city: "Nanded", variants: ["Amravati to Nanded taxi", "Amravati to Nanded cab"] },
    { city: "Parbhani", variants: ["Amravati to Parbhani taxi", "Amravati to Parbhani cab"] },
    { city: "Hingoli", variants: ["Amravati to Hingoli taxi", "Amravati to Hingoli cab"] },
    { city: "Latur", variants: ["Amravati to Latur taxi", "Amravati to Latur cab"] },
    { city: "Solapur", variants: ["Amravati to Solapur taxi", "Amravati to Solapur cab"] },
    { city: "Kolhapur", variants: ["Amravati to Kolhapur taxi", "Amravati to Kolhapur cab"] },
    { city: "Nashik", variants: ["Amravati to Nashik taxi", "Amravati to Nashik cab"] },
    { city: "Shirdi", variants: ["Amravati to Shirdi taxi", "Amravati to Shirdi cab"] },
    { city: "Ahmednagar", variants: ["Amravati to Ahmednagar taxi", "Amravati to Ahmednagar cab"] },
    { city: "Satara", variants: ["Amravati to Satara taxi", "Amravati to Satara cab"] },
    { city: "Sangli", variants: ["Amravati to Sangli taxi", "Amravati to Sangli cab"] },
    { city: "Dhule", variants: ["Amravati to Dhule taxi", "Amravati to Dhule cab"] },
    { city: "Bhusawal", variants: ["Amravati to Bhusawal taxi", "Amravati to Bhusawal cab"] },
    { city: "Khamgaon", variants: ["Amravati to Khamgaon taxi", "Amravati to Khamgaon cab"] },
    { city: "Morshi", variants: ["Amravati to Morshi taxi", "Amravati to Morshi cab"] },
    { city: "Achalpur", variants: ["Amravati to Achalpur taxi", "Amravati to Achalpur cab"] },
    { city: "Daryapur", variants: ["Amravati to Daryapur taxi", "Amravati to Daryapur cab"] },
    { city: "Anjangaon", variants: ["Amravati to Anjangaon taxi", "Amravati to Anjangaon cab"] },
    { city: "Chikhaldara", variants: ["Amravati to Chikhaldara taxi", "Amravati to Chikhaldara cab"] },
    { city: "Melghat", variants: ["Amravati to Melghat taxi", "Amravati to Melghat cab"] },
    { city: "Shegaon", variants: ["Amravati to Shegaon taxi", "Amravati to Shegaon cab"] },
    { city: "Indore", variants: ["Amravati to Indore taxi", "Amravati to Indore cab"] },
    { city: "Bhopal", variants: ["Amravati to Bhopal taxi", "Amravati to Bhopal cab"] },
    { city: "Raipur", variants: ["Amravati to Raipur taxi", "Amravati to Raipur cab"] },
    { city: "Goa", variants: ["Amravati to Goa taxi", "Amravati to Goa cab"] },
    { city: "Hyderabad", variants: ["Amravati to Hyderabad taxi", "Amravati to Hyderabad cab"] },
    { city: "Bangalore", variants: ["Amravati to Bangalore taxi", "Amravati to Bangalore cab"] },
    { city: "Surat", variants: ["Amravati to Surat taxi", "Amravati to Surat cab"] },
    { city: "Vadodara", variants: ["Amravati to Vadodara taxi", "Amravati to Vadodara cab"] },
    { city: "Ujjain", variants: ["Amravati to Ujjain taxi", "Amravati to Ujjain cab"] },
    { city: "Omkareshwar", variants: ["Amravati to Omkareshwar taxi", "Amravati to Omkareshwar cab"] },
    { city: "Mahabaleshwar", variants: ["Amravati to Mahabaleshwar taxi", "Amravati to Mahabaleshwar cab"] },
    { city: "Alibaug", variants: ["Amravati to Alibaug taxi", "Amravati to Alibaug cab"] },
    { city: "Lonavala", variants: ["Amravati to Lonavala taxi", "Amravati to Lonavala cab"] },
    { city: "Igatpuri", variants: ["Amravati to Igatpuri taxi", "Amravati to Igatpuri cab"] },
    { city: "Ajanta", variants: ["Amravati to Ajanta taxi", "Amravati to Ajanta cab"] },
    { city: "Ellora", variants: ["Amravati to Ellora taxi", "Amravati to Ellora cab"] },
    { city: "Manali", variants: ["Amravati to Manali taxi", "Amravati to Manali cab"] },
    { city: "Delhi", variants: ["Amravati to Delhi taxi", "Amravati to Delhi cab"] },
    { city: "Jaipur", variants: ["Amravati to Jaipur taxi", "Amravati to Jaipur cab"] },
    { city: "Gawilgarh Fort", variants: ["Amravati to Gawilgarh Fort taxi"] },
    { city: "Narnala Fort", variants: ["Amravati to Narnala Fort cab"] },
    { city: "Upper Wardha Dam", variants: ["Amravati to Upper Wardha Dam taxi"] },
    { city: "Tirupati", variants: ["Amravati to Tirupati taxi", "Amravati to Tirupati cab"] },
];

const RouteCatalog = () => {
    return (
        <section className="py-24 bg-white font-sans overflow-hidden">
            <div className="container">
                <div className="max-w-3xl mb-16 animate-fade-in">
                    <span className="section-badge !ml-0">Full Route Catalog</span>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none mb-6">
                        Explore All Cab Routes <br /> from <span className="text-primary">Amravati</span>
                    </h2>
                    <p className="text-slate-500 text-lg font-medium leading-relaxed">
                        We provide reliable outstation taxi services from Amravati to all major cities, tourist spots, and pilgrimage centers across India.
                        Book your taxi online for safe and comfortable intercity travel.
                    </p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 border-t border-slate-100 pt-16">
                    {allRoutes.map((route, idx) => (
                        <div
                            key={route.city}
                            className="space-y-4 animate-fade-in-up"
                            style={{ animationDelay: `${(idx % 10) * 0.05}s` }}
                        >
                            <div className="flex items-center gap-2 text-primary">
                                <MapPin size={16} className="shrink-0" />
                                <h3 className="font-black text-slate-900 text-lg tracking-tight">{route.city}</h3>
                            </div>
                            <ul className="space-y-2">
                                {route.variants.map(variant => (
                                    <li key={variant}>
                                        <a
                                            href="#booking-section"
                                            className="text-slate-400 hover:text-primary transition-colors text-sm font-bold flex items-center gap-1.5 group"
                                        >
                                            <span className="w-1 h-1 rounded-full bg-slate-200 group-hover:bg-primary transition-colors" />
                                            {variant}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* SEO Trust Block */}
                <div className="mt-24 p-12 bg-slate-900 rounded-[3rem] text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                    <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h3 className="text-3xl font-black mb-4 leading-tight tracking-tight">Looking for the <span className="text-primary">Best Taxi Service</span> in Amravati?</h3>
                            <p className="text-slate-400 text-sm leading-relaxed font-medium">
                                Trimurti Tours and Travels offers 24/7 online taxi booking in Amravati with GPS-tracked vehicles and verified professional drivers.
                                Whether you need a local cab in Amravati or an outstation taxi to any intercity destination, we guarantee fixed rates and on-time service.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl backdrop-blur-sm">
                                <p className="text-primary font-black text-2xl">4.8★</p>
                                <p className="text-[10px] uppercase font-black tracking-widest text-slate-500">Google Rating</p>
                            </div>
                            <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl backdrop-blur-sm">
                                <p className="text-primary font-black text-2xl">100%</p>
                                <p className="text-[10px] uppercase font-black tracking-widest text-slate-500">Safe Travel</p>
                            </div>
                            <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl backdrop-blur-sm">
                                <p className="text-primary font-black text-2xl">24/7</p>
                                <p className="text-[10px] uppercase font-black tracking-widest text-slate-500">Live Support</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Internal Linking Quick Links */}
                <div className="mt-16 pt-8 border-t border-slate-50">
                    <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] mb-4">Also Check:</p>
                    <div className="flex flex-wrap gap-x-8 gap-y-3">
                        <a href="#booking-section" className="text-sm font-bold text-slate-600 hover:text-primary transition-colors flex items-center gap-2 group">
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            Amravati to Pune Taxi
                        </a>
                        <a href="#booking-section" className="text-sm font-bold text-slate-600 hover:text-primary transition-colors flex items-center gap-2 group">
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            Amravati to Mumbai Cab
                        </a>
                        <a href="#services" className="text-sm font-bold text-slate-600 hover:text-primary transition-colors flex items-center gap-2 group">
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            Airport Taxi Service in Amravati
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RouteCatalog;
