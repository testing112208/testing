"use client";

import { useState, useEffect } from "react";
import { MapPin, Calendar, Clock, Car, ChevronDown, User, Phone as PhoneIcon, CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import heroBg from "@/assets/hero-bg.webp";
import { toast } from "sonner";
import { usePricing } from "@/hooks/usePricing";
import { apiRequest } from "@/lib/api-client";
import { cn } from "@/lib/utils";

/* ─── Animated Counter (unchanged logic, new presentation) ─── */
const Counter = ({ end, decimals = 0, duration = 2000, suffix = "" }: {
  end: number; decimals?: number; duration?: number; suffix?: string;
}) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(progress * end);
      if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);
  return <span>{count.toFixed(decimals)}{suffix}</span>;
};

/* ─── Stat Block ─── */
const StatBlock = ({ value, suffix, decimals, label }: {
  value: number; suffix: string; decimals?: number; label: string;
}) => (
  <div className="group text-center lg:text-left cursor-default">
    <p className="font-mono text-2xl md:text-3xl font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
      <Counter end={value} decimals={decimals} suffix={suffix} />
    </p>
    <p className="text-[9px] md:text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mt-1">
      {label}
    </p>
  </div>
);

/* ─── Form Input (reusable, token-driven) ─── */
const FormField = ({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) => (
  <div className="relative group/field">
    <Icon
      size={16}
      className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within/field:text-primary transition-colors duration-200 pointer-events-none"
    />
    {children}
  </div>
);

const inputCls = cn(
  "w-full h-14 pl-11 pr-4",
  "bg-muted border border-border rounded-[var(--radius)]",
  "text-sm font-medium text-foreground placeholder:text-muted-foreground",
  "focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary/40 focus:bg-card",
  "transition-all duration-200 appearance-none"
);

/* ─── Main Component ─── */
const HeroSection = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "", phone: "", pickup: "", drop: "",
    date: "", time: "", cabType: "Sedan Cab Amravati"
  });

  useEffect(() => {
    const handleSelectCab = (e: CustomEvent<{ type: string }>) => {
      setFormData(prev => ({ ...prev, cabType: e.detail.type }));
      document.getElementById("booking-section")?.scrollIntoView({ behavior: "smooth" });
    };
    window.addEventListener("select-cab" as any, handleSelectCab as any);
    return () => window.removeEventListener("select-cab" as any, handleSelectCab as any);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const sanitized = value.replace(/\D/g, "");
      if (sanitized.length <= 10) setFormData({ ...formData, [name]: sanitized });
      return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const { data: pricingData } = usePricing();
  const prices = pricingData || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(formData.phone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }
    setLoading(true);
    try {
      const priceConfig = prices.find(p => p.cabType === formData.cabType);
      const estimatedFare = priceConfig?.basePrice || 1800;
      const result = await apiRequest<{ success: boolean; errors?: string[]; message?: string }>("/api/bookings", {
        method: "POST",
        headers: { "x-idempotency-key": `${formData.phone}-${Date.now()}` },
        body: JSON.stringify({ ...formData, fare: estimatedFare })
      });
      if (result.success) {
        setSuccess(true);
        toast.success("Booking Request Sent Successfully!");
        setFormData({ customerName: "", phone: "", pickup: "", drop: "", date: "", time: "", cabType: "Sedan Cab Amravati" });
      } else {
        toast.error(result.errors?.join(", ") || result.message || "Booking failed");
      }
    } catch (error: any) {
      toast.error(error.message || "Server connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ─── Success State ─── */
  if (success) {
    return (
      <section id="booking-section" className="relative min-h-[80vh] flex items-center justify-center pt-24 bg-background">
        <div className="absolute inset-0 z-0">
          <img src={typeof heroBg === "string" ? heroBg : (heroBg as any).src} alt="" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-background/90" />
        </div>
        <div className="relative z-10 card-base p-10 md:p-14 text-center max-w-md mx-auto animate-enter">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          </div>
          <p className="section-label mx-auto">Confirmation</p>
          <h2 className="heading-2 text-foreground mt-2">Booking Received</h2>
          <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
            Your request is confirmed. Our team will call{" "}
            <span className="font-semibold text-foreground font-mono">{formData.phone}</span>{" "}
            shortly to finalise your ride.
          </p>
          <button onClick={() => setSuccess(false)} className="btn-primary mt-8 w-full">
            Book Another Ride <ArrowRight size={16} />
          </button>
        </div>
      </section>
    );
  }

  /* ─── Main Hero ─── */
  return (
    <section id="booking-section" className="relative min-h-screen flex items-center overflow-hidden bg-background">

      {/* Obsidian background with restrained image */}
      <div className="absolute inset-0 z-0">
        <img
          src={typeof heroBg === "string" ? heroBg : (heroBg as any).src}
          alt="Trimurti Tours and Travels — Best Cab Service Amravati"
          className="w-full h-full object-cover opacity-[0.08] scale-105"
          loading="eager"
        />
        {/* Directional gradient — draws eye to form */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background" />
      </div>

      {/* Ambient gold glow — used sparingly */}
      <div className="absolute top-1/3 right-1/3 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container-fluid relative z-10 pt-32 pb-16 md:pt-44 md:pb-24">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* ── Left: Copy ── */}
          <div className="space-y-8 text-center lg:text-left">

            {/* Label */}
            <div className="animate-enter" style={{ animationDelay: "0s" }}>
              <span className="section-label">
                #1 Cab Service · Amravati
              </span>
            </div>

            {/* H1 */}
            <h1
              className="heading-display text-foreground animate-enter"
              style={{ animationDelay: "0.08s" }}
            >
              Your Ride,{" "}
              <span className="text-gold-gradient">On Time.</span>
              <br />Every Time.
            </h1>

            {/* Sub-copy */}
            <p
              className="section-subtitle mx-auto lg:mx-0 animate-enter"
              style={{ animationDelay: "0.16s" }}
            >
              Professional cab service in Amravati — local, outstation, and corporate transfers.
              GPS tracked, fixed rates, 24/7.
            </p>

            {/* Trust signals */}
            <div
              className="flex flex-wrap gap-x-6 gap-y-2 justify-center lg:justify-start animate-enter"
              style={{ animationDelay: "0.22s" }}
            >
              {["24/7 Available", "GPS Tracked", "Fixed Rates", "No Advance"].map(tag => (
                <span key={tag} className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <span className="w-1 h-1 rounded-full bg-primary" />
                  {tag}
                </span>
              ))}
            </div>

            {/* Stats */}
            <div
              className="flex items-center justify-center lg:justify-start gap-8 md:gap-12 pt-8 border-t border-border animate-enter"
              style={{ animationDelay: "0.3s" }}
            >
              <StatBlock value={100} suffix="K+" label="Happy Rides" />
              <div className="w-px h-8 bg-border" />
              <StatBlock value={4.8} suffix="★" decimals={1} label="User Rating" />
              <div className="w-px h-8 bg-border" />
              <StatBlock value={500} suffix="+" label="Active Cabs" />
            </div>
          </div>

          {/* ── Right: Booking Form (Obsidian Card) ── */}
          <div className="animate-enter w-full max-w-lg mx-auto lg:max-w-none" style={{ animationDelay: "0.18s" }}>
            <form
              onSubmit={handleSubmit}
              className="card-base p-7 md:p-9 space-y-4"
              aria-label="Cab booking form"
            >
              {/* Form header */}
              <div className="mb-6">
                <p className="section-label">Instant Booking</p>
                <h2 className="heading-2 text-foreground mt-1">Reserve Your Cab</h2>
                <p className="text-xs text-muted-foreground mt-1 font-mono">No advance payment required</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField icon={User}>
                  <input
                    id="customerName" type="text" name="customerName" autoComplete="name"
                    required value={formData.customerName} onChange={handleInputChange}
                    aria-label="Your Name" placeholder="Your Name"
                    suppressHydrationWarning className={inputCls}
                  />
                </FormField>
                <FormField icon={PhoneIcon}>
                  <input
                    id="phone" type="tel" name="phone" autoComplete="tel"
                    required value={formData.phone} onChange={handleInputChange}
                    aria-label="Phone Number" placeholder="Phone Number"
                    suppressHydrationWarning className={inputCls}
                    pattern="^\d{10}$" title="10-digit number" inputMode="numeric"
                  />
                </FormField>
              </div>

              <FormField icon={MapPin}>
                <input
                  id="pickup" type="text" name="pickup" required
                  value={formData.pickup} onChange={handleInputChange}
                  aria-label="Pickup Location" placeholder="Pickup Location"
                  suppressHydrationWarning className={inputCls}
                />
              </FormField>

              <FormField icon={MapPin}>
                <input
                  id="drop" type="text" name="drop" required
                  value={formData.drop} onChange={handleInputChange}
                  aria-label="Drop Location" placeholder="Drop Location"
                  suppressHydrationWarning className={cn(inputCls, "focus:ring-amber-400/25 focus:border-amber-400/40")}
                />
              </FormField>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField icon={Calendar}>
                  <input
                    id="date" type="date" name="date" required
                    value={formData.date} onChange={handleInputChange}
                    suppressHydrationWarning className={inputCls}
                  />
                </FormField>
                <FormField icon={Clock}>
                  <input
                    id="time" type="time" name="time" required
                    value={formData.time} onChange={handleInputChange}
                    suppressHydrationWarning className={inputCls}
                  />
                </FormField>
              </div>

              <FormField icon={Car}>
                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <select
                  id="cabType" name="cabType" value={formData.cabType}
                  onChange={handleInputChange} suppressHydrationWarning
                  className={cn(inputCls, "pr-9 cursor-pointer")}
                >
                  {[
                    "Sedan Cab Amravati", "SUV Taxi Service", "Nagpur Pick-up & Drop",
                    "Corporate Taxi Hire", "Intercity Cab Amravati",
                    "Mini Van (Winger)", "Cruiser", "Tempo Traveller Taxi"
                  ].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </FormField>

              {/* CTA */}
              <button
                type="submit" disabled={loading}
                suppressHydrationWarning
                className="btn-primary w-full h-14 text-base mt-2"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>Book Ride <ArrowRight size={18} /></>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom fade to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
    </section>
  );
};

export default HeroSection;
