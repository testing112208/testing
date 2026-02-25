"use client";

import { useState, useEffect } from "react";
import { MapPin, Navigation, Plane, ArrowRight } from "lucide-react";
import { usePricing } from "@/hooks/usePricing";

const staticServices = [
  {
    icon: MapPin,
    title: "Local Taxi in Amravati",
    desc: "Affordable city cab service in Amravati. Local taxi booking with hourly packages & point-to-point fares starting at lowest rates.",
    price: "Starting ₹149",
    tag: "Local Cab",
  },
  {
    icon: Navigation,
    title: "Outstation Cab Booking",
    desc: "Safe outstation taxi from Amravati to Nagpur, Pune, Mumbai & Aurangabad. Best one-way and round-trip cab rates for intercity travel.",
    price: "Starting ₹9/km",
    tag: "Outstation",
  },
  {
    icon: Plane,
    title: "Nagpur Pick-up & Drop",
    desc: "Seamless pick-up and drop service between Amravati and Nagpur. 24 hour intercity service with on-time guarantee.",
    price: "Starting ₹2,499",
    tag: "Airport",
  },
];

const ServicesSection = () => {
  const { data: pricingData, isLoading, isFetching } = usePricing();
  const [services, setServices] = useState(staticServices);

  useEffect(() => {
    if (pricingData && pricingData.length > 0) {
      const updatedServices = staticServices.map(s => {
        const found = pricingData.find(p => p.cabType === s.title);
        if (found) {
          return {
            ...s,
            price: found.basePrice > 0
              ? `₹${found.basePrice.toLocaleString("en-IN")}${found.priceUnit ? ' ' + found.priceUnit : ''}`
              : (found.priceUnit || `Starting ₹${found.basePrice.toLocaleString("en-IN")}`),
            desc: found.description || s.desc
          };
        }
        return s;
      });
      setServices(updatedServices);
    }
  }, [pricingData]);

  return (
    <section id="services" className="py-20 md:py-28 bg-background overflow-hidden font-sans">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-16 animate-fade-in-up relative">
          {isFetching && !isLoading && (
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex items-center gap-2 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-primary/5 border border-primary/10 animate-fade-in">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
              Updating Live Rates...
            </div>
          )}
          <span className="section-badge">Professional Cab Services</span>
          <h2 className="section-title text-4xl font-black text-slate-900 tracking-tight">Best Taxi Service in Amravati for Every Journey</h2>
          <p className="section-subtitle">
            Reliable local rides, budget-friendly outstation cab booking, and on-time airport transfers in Amravati Maharashtra.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((s, idx) => (
            <div
              key={s.title}
              onClick={() => {
                window.dispatchEvent(new CustomEvent('select-cab', { detail: { type: s.title } }));
              }}
              className="card-elevated group relative p-8 md:p-10 bg-white border border-slate-100 hover:border-primary/20 hover:-translate-y-2 transition-all duration-300 cursor-pointer animate-fade-in-up"
              style={{ animationDelay: `${(idx + 1) * 0.15}s` }}
            >
              <div className="flex items-start justify-between mb-8">
                <div className="w-16 h-16 rounded-3xl bg-primary/5 flex items-center justify-center group-hover:bg-primary group-hover:rotate-6 group-hover:scale-110 transition-all duration-500">
                  <s.icon size={28} className="text-primary group-hover:text-white transition-colors duration-500" />
                </div>
                <span className="text-[10px] font-black tracking-widest uppercase text-slate-400 bg-slate-50 border border-slate-100 px-4 py-1.5 rounded-xl group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                  {s.tag}
                </span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 font-display tracking-tight leading-none mb-4">{s.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-8">{s.desc}</p>
              <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                <p className="text-primary font-black text-lg tracking-tight">{s.price}</p>
                <span className="text-primary text-sm font-black flex items-center gap-2 group-hover:gap-3 transition-all duration-300">
                  Book now <ArrowRight size={16} />
                </span>
              </div>

              {/* Bottom Glow Effect */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/0 to-transparent group-hover:via-primary/30 transition-all duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
