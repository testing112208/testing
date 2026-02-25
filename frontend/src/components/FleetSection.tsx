"use client";

import { useState, useEffect } from "react";

import { Users, Fuel, Star, Check, RefreshCw, ArrowRight, Car } from "lucide-react";
import { usePricing } from "@/hooks/usePricing";

const initialFleet = [
  {
    name: "Sedan Cab Amravati",
    desc: "Swift Dzire, Toyota Etios & more",
    image: "",
    capacity: "4 Passengers",
    rate: "₹13",
    unit: "/km",
    features: ["AC", "Comfortable", "Fuel-efficient"],
    popular: false,
  },
  {
    name: "SUV Taxi Service",
    desc: "Toyota Innova, Ertiga & more",
    image: "",
    capacity: "6–7 Passengers",
    rate: "₹20",
    unit: "/km",
    features: ["Spacious", "Family-friendly", "Luggage space"],
    popular: true,
  },
  {
    name: "Nagpur Pick-up & Drop",
    desc: "Full service for airport/city pick-up and drop",
    image: "",
    capacity: "4-7 Passengers",
    rate: "Fixed",
    unit: " Rates",
    features: ["On-time", "Doorstep Pickup", "Nagpur & Amravati"],
    popular: false,
  },
  {
    name: "Corporate Taxi Hire",
    desc: "Professional chauffeur driven cars",
    image: "",
    capacity: "Business Class",
    rate: "Daily",
    unit: " Packages",
    features: ["Verified Drivers", "Clean Cabs", "Billed Monthly"],
    popular: false,
  },
  {
    name: "Intercity Cab Amravati",
    desc: "Safe highway travel for long distances",
    image: "",
    capacity: "Intercity",
    rate: "₹9",
    unit: "/km",
    features: ["Safe Highway Travel", "24/7 Support", "Verified"],
    popular: false,
  },
  {
    name: "Mini Van (Winger)",
    desc: "Comfortable Tata Winger for group travel",
    image: "",
    capacity: "12-15 Passengers",
    rate: "₹25",
    unit: "/km",
    features: ["AC Van", "Large Group", "Spacious"],
    popular: false,
  },
  {
    name: "Cruiser",
    desc: "Force Cruiser",
    image: "",
    capacity: "6-7 Passengers",
    rate: "₹24",
    unit: "/km",
    features: ["Luxury Interior", "High Comfort", "Climate Control"],
    popular: false,
  },
  {
    name: "Tempo Traveller Taxi",
    desc: "Perfect for family and tourist groups",
    image: "",
    capacity: "8–12 Passengers",
    rate: "Bulk",
    unit: " Booking",
    features: ["Family Trips", "Spacious", "Economical"],
    popular: false,
  },
];

const FleetSection = () => {
  const { data: pricingData, isLoading, isFetching } = usePricing();

  // DERIVE fleet directly from pricingData to avoid useEffect lag
  const fleet = (pricingData && pricingData.length > 0)
    ? initialFleet.map(v => {
      const price = pricingData.find((p: any) => p.cabType === v.name);
      if (price) {
        return {
          ...v,
          rate: `₹${price.basePrice}`,
          unit: price.priceUnit,
          image: price.imageUrl || v.image
        };
      }
      return v;
    })
    : initialFleet;

  const handleSelectCab = (type: string) => {
    window.dispatchEvent(new CustomEvent("select-cab", {
      detail: { type }
    }));
  };

  return (
    <section id="fleet" className="py-20 md:py-28 bg-secondary/30 overflow-hidden">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-16 animate-fade-in relative">
          {isFetching && !isLoading && (
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-bold border border-emerald-100 animate-fade-in">
              <RefreshCw size={10} className="animate-spin" />
              Live Rates Synced
            </div>
          )}
          <span className="section-badge">Our Wide Range of Vehicles</span>
          <h2 className="section-title">Best Taxi Service in Amravati - Our Fleet</h2>
          <p className="section-subtitle">
            Reliable sedan taxi in Amravati, spacious SUV taxi, and luxury Innova cabs for city travel and outstation cab booking. Experience the best taxi service in Amravati.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 items-stretch">
          {fleet.map((v, idx) => (
            <div
              key={idx}
              className="card-elevated group relative flex flex-col bg-white rounded-[2rem] overflow-hidden border border-slate-100 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 animate-zoom-in"
              style={{ animationDelay: `${(idx + 1) * 0.1}s` }}
            >
              {v.popular && (
                <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-widest z-20 shadow-lg">
                  Most Popular
                </div>
              )}

              {/* Image Section */}
              <div className="relative h-48 overflow-hidden bg-slate-100 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent z-10" />
                {isLoading ? (
                  <div className="w-full h-full bg-slate-100 animate-pulse flex items-center justify-center">
                    <Car size={48} className="text-slate-200" />
                  </div>
                ) : v.image ? (
                  <img
                    src={v.image}
                    alt={v.name}
                    className="w-full h-full object-cover transition-opacity duration-700 hover:scale-110"
                    loading="eager"
                    onLoad={(e) => (e.currentTarget.style.opacity = "1")}
                    style={{ opacity: 0 }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-300 gap-2">
                    <Car size={48} strokeWidth={1} />
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-50">No Image Set</span>
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="mb-4">
                  <h3 className="text-xl font-black text-foreground font-display group-hover:text-primary transition-colors leading-tight">{v.name}</h3>
                  <p className="text-muted-foreground text-[11px] font-medium mt-1 leading-relaxed line-clamp-1">{v.desc}</p>
                </div>

                <div className="mb-6 p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Starting From</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-black text-primary">{v.rate}</span>
                      <span className="text-[10px] font-bold text-slate-400">{v.unit}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Capacity</span>
                    <span className="text-xs font-bold text-foreground">{v.capacity}</span>
                  </div>
                </div>

                <div className="space-y-2 mb-6 flex-1">
                  {v.features.map((f, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2 text-[11px] font-bold text-slate-600">
                      <Check size={12} className="text-emerald-500 shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleSelectCab(v.name)}
                  suppressHydrationWarning
                  className="w-full py-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-300 bg-slate-900 text-white hover:bg-primary shadow-lg shadow-slate-900/10 active:scale-95 flex items-center justify-center gap-2"
                >
                  Book Ride Now
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FleetSection;
