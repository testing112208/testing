"use client";

import { useState, useEffect } from "react";
import { MapPin, Calendar, Clock, Car, ChevronDown, User, Phone as PhoneIcon, CheckCircle2, Loader2 } from "lucide-react";
import heroBg from "@/assets/hero-bg.webp";
import { toast } from "sonner";
import { usePricing } from "@/hooks/usePricing";
import { apiRequest } from "@/lib/api-client";

const Counter = ({ end, decimals = 0, duration = 2000, suffix = "" }: { end: number, decimals?: number, duration?: number, suffix?: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
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

  return <span>{count.toFixed(decimals)}{suffix}</span>;
};

const HeroSection = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    pickup: "",
    drop: "",
    date: "",
    time: "",
    cabType: "Sedan Cab Amravati"
  });

  // Listener for cross-component booking triggers
  useEffect(() => {
    const handleSelectCab = (e: CustomEvent<{ type: string }>) => {
      setFormData(prev => ({ ...prev, cabType: e.detail.type }));
      document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' });
    };

    window.addEventListener('select-cab' as any, handleSelectCab as any);
    return () => window.removeEventListener('select-cab' as any, handleSelectCab as any);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const sanitized = value.replace(/\D/g, ""); // Only digits
      if (sanitized.length <= 10) {
        setFormData({ ...formData, [name]: sanitized });
      }
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const validatePhone = (phone: string) => {
    const regex = /^\d{10}$/;
    return regex.test(phone);
  };

  const { data: pricingData } = usePricing();
  const prices = pricingData || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePhone(formData.phone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    setLoading(true);

    try {
      const priceConfig = prices.find(p => p.cabType === formData.cabType);
      const estimatedFare = priceConfig?.basePrice || 1800;

      const idempotencyKey = `${formData.phone}-${Date.now()}`;

      const result = await apiRequest<{ success: boolean; errors?: string[]; message?: string }>("/api/bookings", {
        method: "POST",
        headers: {
          "x-idempotency-key": idempotencyKey,
        },
        body: JSON.stringify({
          ...formData,
          fare: estimatedFare
        })
      });

      if (result.success) {
        setSuccess(true);
        toast.success("Booking Request Sent Successfully!");
        setFormData({
          customerName: "",
          phone: "",
          pickup: "",
          drop: "",
          date: "",
          time: "",
          cabType: "Sedan Cab Amravati"
        });
      } else {
        const errorMsg = result.errors ? result.errors.join(", ") : (result.message || "Booking failed");
        toast.error(`Booking failed: ${errorMsg}`);
      }
    } catch (error: any) {
      console.error("Booking Error:", error);
      toast.error(error.message || "Server connection error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <section id="booking-section" className="relative min-h-[80vh] flex items-center justify-center pt-24">
        {/* Background - Same as original */}
        <div className="absolute inset-0 z-0">
          <img src={typeof heroBg === 'string' ? heroBg : (heroBg as any).src} alt="Success" className="w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-teal-900/90" />
        </div>
        <div className="relative z-10 bg-white p-12 rounded-[3rem] shadow-2xl text-center max-w-lg mx-auto animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 font-display">Booking Received!</h2>
          <p className="text-slate-500 mt-4 leading-relaxed font-medium">
            Thank you! Your booking request has been sent for processing.
            Our representative will call you on <span className="font-bold">{formData.phone}</span> shortly to confirm your ride.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="mt-8 px-8 py-4 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-transform"
          >
            Book Another Ride
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="booking-section" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background with ken-burns */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={typeof heroBg === 'string' ? heroBg : (heroBg as any).src}
          alt="Best Cab Service in Amravati - Trimurti Tours and Travels"
          className="w-full h-full object-cover animate-ken-burns scale-110"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--teal-dark)/0.85)] via-[hsl(var(--teal-dark)/0.7)] to-[hsl(var(--teal-dark)/0.95)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--foreground)/0.3)] to-transparent" />
      </div>

      {/* Decorative Blobs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="container relative z-10 pt-28 pb-12 md:pt-40 md:pb-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text */}
          <div className="space-y-8 md:space-y-10 text-center lg:text-left">
            <div className="animate-fade-in-up">
              <span className="inline-flex items-center gap-2.5 bg-accent/20 text-accent border border-accent/30 px-5 py-2.5 rounded-full text-[11px] md:text-sm font-black tracking-wider backdrop-blur-md shadow-xl shadow-accent/5 animate-float">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent"></span>
                </span>
                #1 Reliable Cab Service in Amravati
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[4rem] font-black text-primary-foreground leading-[1.05] tracking-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Best Cab Service & <br className="hidden md:block" />
              <span className="text-accent drop-shadow-xl relative">
                Taxi in Amravati
              </span>
            </h1>

            <p className="text-primary-foreground/75 text-base md:text-xl max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Book affordable taxi in Amravati for local rides, outstation cab booking, and airport transfers. Professional drivers and safe taxi service in Amravati 24/7.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-3 text-primary-foreground/70 text-[10px] md:text-sm font-bold animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <span className="flex items-center gap-2.5 group">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-[9px] group-hover:scale-110 transition-transform">✓</span>
                24/7 Available
              </span>
              <span className="flex items-center gap-2.5 group">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-[9px] group-hover:scale-110 transition-transform">✓</span>
                GPS Tracked
              </span>
              <span className="flex items-center gap-2.5 group">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-[9px] group-hover:scale-110 transition-transform">✓</span>
                Fixed Rates
              </span>
            </div>

            {/* Trust stats */}
            <div className="flex items-center justify-center lg:justify-start gap-6 md:gap-14 pt-8 border-t border-primary-foreground/10 max-w-lg mx-auto lg:mx-0 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="hover:scale-105 transition-transform cursor-default group text-center lg:text-left">
                <p className="text-xl md:text-3xl font-black text-primary-foreground group-hover:text-accent transition-colors">
                  <Counter end={100} duration={2500} suffix="K+" />
                </p>
                <p className="text-primary-foreground/40 text-[8px] md:text-xs font-black uppercase tracking-widest mt-1">Happy Rides</p>
              </div>
              <div className="w-px h-10 bg-primary-foreground/15" />
              <div className="hover:scale-105 transition-transform cursor-default group text-center lg:text-left">
                <p className="text-xl md:text-3xl font-black text-primary-foreground group-hover:text-accent transition-colors">
                  <Counter end={4.8} decimals={1} duration={2000} suffix="★" />
                </p>
                <p className="text-primary-foreground/40 text-[8px] md:text-xs font-black uppercase tracking-widest mt-1">User Rating</p>
              </div>
              <div className="w-px h-10 bg-primary-foreground/15" />
              <div className="hover:scale-105 transition-transform cursor-default group text-center lg:text-left">
                <p className="text-xl md:text-3xl font-black text-primary-foreground group-hover:text-accent transition-colors">
                  <Counter end={500} duration={2000} suffix="+" />
                </p>
                <p className="text-primary-foreground/40 text-[8px] md:text-xs font-black uppercase tracking-widest mt-1">Active Cabs</p>
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="animate-fade-in-up w-full max-w-xl mx-auto lg:max-w-none" style={{ animationDelay: "0.2s" }}>
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-[2rem] sm:rounded-[3rem] shadow-[0_30px_80px_rgba(0,0,0,0.25)] p-6 sm:p-10 md:p-12 space-y-5 border border-slate-100 relative group/form"
            >
              <div className="text-center sm:text-left mb-2 md:mb-6">
                <h2 className="text-2xl md:text-4xl font-black text-slate-900 font-display tracking-tight leading-tight">Book Your Ride</h2>
                <p className="text-slate-500 text-[9px] md:text-xs mt-2 font-black uppercase tracking-[0.2em]">Instant confirmation online</p>
              </div>

              <div className="grid gap-5">
                {/* Name & Phone Group */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="relative group">
                    <User size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-primary transition-transform group-focus-within:scale-110" />
                    <input
                      id="customerName"
                      type="text"
                      name="customerName"
                      autoComplete="name"
                      required
                      value={formData.customerName}
                      onChange={handleInputChange}
                      aria-label="Your Name"
                      placeholder="Your Name"
                      suppressHydrationWarning
                      className="w-full h-16 pl-16 pr-5 bg-slate-50 border border-slate-100 rounded-2xl text-base font-bold focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all text-slate-900 placeholder:text-slate-400 focus:bg-white"
                    />
                  </div>
                  <div className="relative group">
                    <PhoneIcon size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-primary transition-transform group-focus-within:scale-110" />
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      autoComplete="tel"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      aria-label="Phone Number"
                      placeholder="Phone Number"
                      suppressHydrationWarning
                      className="w-full h-16 pl-16 pr-5 bg-slate-50 border border-slate-100 rounded-2xl text-base font-bold focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all text-slate-900 placeholder:text-slate-400 focus:bg-white"
                      pattern="^\d{10}$"
                      title="Please enter a valid 10-digit phone number"
                      inputMode="numeric"
                    />
                  </div>
                </div>

                <div className="relative group">
                  <MapPin size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/60 outline-none transition-transform group-focus-within:scale-110" />
                  <input
                    id="pickup"
                    type="text"
                    name="pickup"
                    required
                    value={formData.pickup}
                    onChange={handleInputChange}
                    aria-label="Pickup Location"
                    placeholder="Pickup Location"
                    suppressHydrationWarning
                    className="w-full h-16 pl-16 pr-5 bg-slate-50 border border-slate-100 rounded-2xl text-base font-bold focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all text-slate-900 placeholder:text-slate-400 focus:bg-white"
                  />
                </div>
                <div className="relative group">
                  <MapPin size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-accent transition-transform group-focus-within:scale-110" />
                  <input
                    id="drop"
                    type="text"
                    name="drop"
                    required
                    value={formData.drop}
                    onChange={handleInputChange}
                    aria-label="Drop Location"
                    placeholder="Drop Location"
                    suppressHydrationWarning
                    className="w-full h-16 pl-16 pr-5 bg-slate-50 border border-slate-100 rounded-2xl text-base font-bold focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all text-slate-900 placeholder:text-slate-400 focus:bg-white"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="relative group">
                    <Calendar size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <input
                      id="date"
                      type="date"
                      name="date"
                      required
                      value={formData.date}
                      onChange={handleInputChange}
                      suppressHydrationWarning
                      className="w-full h-16 pl-16 pr-5 bg-slate-50 border border-slate-100 rounded-2xl text-base font-bold focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all text-slate-900 focus:bg-white"
                    />
                  </div>
                  <div className="relative group">
                    <Clock size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <input
                      id="time"
                      type="time"
                      name="time"
                      required
                      value={formData.time}
                      onChange={handleInputChange}
                      suppressHydrationWarning
                      className="w-full h-16 pl-16 pr-5 bg-slate-50 border border-slate-100 rounded-2xl text-base font-bold focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all text-slate-900 focus:bg-white"
                    />
                  </div>
                </div>
                <div className="relative group">
                  <Car size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <ChevronDown size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <select
                    id="cabType"
                    name="cabType"
                    value={formData.cabType}
                    onChange={handleInputChange}
                    suppressHydrationWarning
                    className="w-full h-16 pl-16 pr-10 bg-slate-50 border border-slate-100 rounded-2xl text-base font-bold focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all text-slate-900 appearance-none cursor-pointer focus:bg-white"
                  >
                    <option value="Sedan Cab Amravati">Sedan Cab Amravati</option>
                    <option value="SUV Taxi Service">SUV Taxi Service</option>
                    <option value="Nagpur Pick-up & Drop">Nagpur Pick-up & Drop</option>
                    <option value="Corporate Taxi Hire">Corporate Taxi Hire</option>
                    <option value="Intercity Cab Amravati">Intercity Cab Amravati</option>
                    <option value="Mini Van (Winger)">Mini Van (Winger)</option>
                    <option value="Cruiser">Cruiser</option>
                    <option value="Tempo Traveller Taxi">Tempo Traveller Taxi</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                suppressHydrationWarning
                className="group relative w-full h-16 bg-primary text-white rounded-[1.25rem] font-black text-lg shadow-[0_15px_30px_rgba(var(--primary),0.3)] hover:scale-[1.02] transition-all active:scale-95 flex items-center justify-center gap-3 overflow-hidden"
              >
                {/* Shimmer Effect overlay */}
                <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />

                {loading ? (
                  <Loader2 className="w-7 h-7 animate-spin" />
                ) : (
                  <>
                    Reserve Your Cab
                    <CheckCircle2 className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-4 text-[10px] md:text-xs text-slate-400 font-black uppercase tracking-widest text-center">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                No advance payment Required
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/40 to-transparent z-10" />
    </section>
  );
};

export default HeroSection;
