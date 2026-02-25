"use client";

import { useState, useEffect } from "react";
import { Shield, IndianRupee, Clock, Headphones, CheckCircle2 } from "lucide-react";

const Counter = ({ end, decimals = 0, duration = 2000, suffix = "" }: { end: number, decimals?: number, duration?: number, suffix?: string }) => {
  const [count, setCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(progress * end);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  if (!mounted) return <span>0{suffix}</span>;

  return (
    <span suppressHydrationWarning>
      {count.toFixed(decimals)}
      {suffix}
    </span>
  );
};

const points = [
  {
    icon: Shield,
    title: "Safe & Verified",
    desc: "All drivers are background-checked, licensed, and trained for passenger safety.",
    statValue: 100,
    statSuffix: "%",
    statLabel: "Verified",
  },
  {
    icon: IndianRupee,
    title: "Transparent Pricing",
    desc: "No surge pricing, no hidden charges. What you see is exactly what you pay.",
    statValue: 0,
    statPrefix: "₹",
    statLabel: "Hidden fees",
  },
  {
    icon: Clock,
    title: "On-Time, Every Time",
    desc: "GPS-tracked cabs ensure punctual pickups for every single booking.",
    statValue: 98,
    statSuffix: "%",
    statLabel: "On-time rate",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    desc: "Round-the-clock customer care via call, WhatsApp, or in-app chat.",
    statValue: 2,
    statPrefix: "< ",
    statSuffix: "min",
    statLabel: "Response time",
  },
];

const WhyUsSection = () => {
  return (
    <section id="why-us" className="py-20 md:py-32 bg-slate-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-[80px] animate-float-soft" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[100px] animate-float-soft" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-24 animate-fade-in-up">
          <span className="section-badge bg-primary/10">Why Choose Us</span>
          <h2 className="section-title text-4xl md:text-5xl">Amravati Trusts Us</h2>
          <p className="section-subtitle">
            1,00,000+ happy rides completed. Our commitment to safety and punctuality makes us the #1 choice in the city.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {points.map((p, idx) => (
            <div
              key={p.title}
              className="card-elevated group relative p-8 md:p-10 text-center bg-white border-white hover:border-primary/20 animate-fade-in-up"
              style={{ animationDelay: `${(idx + 1) * 0.15}s` }}
            >
              {/* Top accent line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent group-hover:via-primary transition-all duration-500" />

              <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center mx-auto mb-8 border border-slate-100 group-hover:bg-primary group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-sm group-hover:shadow-xl group-hover:shadow-primary/20">
                <p.icon size={32} className="text-primary group-hover:text-white transition-colors duration-500" />
              </div>

              <h3 className="text-xl font-bold text-slate-900 font-display mb-4">{p.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-8">
                {p.desc}
              </p>

              <div className="mt-auto pt-6 border-t border-slate-50 flex flex-col items-center">
                <div className="flex items-baseline gap-1">
                  {p.statPrefix && <span className="text-lg font-bold text-primary/60">{p.statPrefix}</span>}
                  <p className="text-3xl font-black text-primary font-display">
                    <Counter end={p.statValue} duration={2500} suffix={p.statSuffix} />
                  </p>
                </div>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1.5">{p.statLabel}</p>
              </div>

              {/* Status decoration */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <CheckCircle2 size={16} className="text-emerald-500" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;
