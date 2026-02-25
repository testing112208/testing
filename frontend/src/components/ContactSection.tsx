"use client";

import { Phone, MessageCircle, Mail, MapPin } from "lucide-react";

const ContactSection = () => {
  return (
    <section id="contact" className="relative py-20 md:py-28 bg-primary overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-foreground/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-foreground/5 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="container relative z-10">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-7 animate-fade-in-left">
            <span className="inline-block text-primary-foreground/60 font-semibold text-xs tracking-[0.15em] uppercase">
              Get in Touch
            </span>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-primary-foreground leading-tight">
              Ready to Book Your Next Ride?
            </h2>
            <p className="text-primary-foreground/70 text-lg leading-relaxed max-w-md">
              Call us or send a WhatsApp message to book instantly. Our team is available 24/7 to help you plan your journey.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3.5 text-primary-foreground/70">
                <div className="w-10 h-10 rounded-xl bg-primary-foreground/10 flex items-center justify-center shrink-0">
                  <Phone size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold uppercase tracking-wider text-accent drop-shadow-sm">Primary Contact</span>
                  <span className="text-sm font-bold text-white">+91 80070 65150</span>
                </div>
              </div>
              <div className="flex items-start gap-3.5 text-primary-foreground/70">
                <div className="w-10 h-10 rounded-xl bg-primary-foreground/10 flex items-center justify-center shrink-0">
                  <Phone size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary-foreground/40">Office Support</span>
                  <span className="text-sm font-bold text-white">+91 93736 28103</span>
                </div>
              </div>
              <div className="flex items-center gap-3.5 text-primary-foreground/70">
                <div className="w-10 h-10 rounded-xl bg-primary-foreground/10 flex items-center justify-center shrink-0">
                  <Mail size={18} />
                </div>
                <span className="text-sm">trimurtitoursandtravel@gmail.com</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-end w-full max-w-lg mx-auto lg:mx-0">
            <a
              href="tel:+918007065150"
              className="flex-1 inline-flex items-center justify-center gap-3 bg-white text-primary px-8 py-4 md:py-5 rounded-2xl font-black text-base md:text-lg hover:brightness-95 active:scale-95 transition-all shadow-xl animate-fade-in-right"
              style={{ animationDelay: '0.2s' }}
            >
              <Phone size={22} />
              Call
            </a>
            <a
              href="https://wa.me/918007065150?text=Hi!%20I%20want%20to%20book%20a%20cab%20with%20Trimurti%20Tours"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-3 bg-emerald-500 text-white px-8 py-4 md:py-5 rounded-2xl font-black text-base md:text-lg hover:brightness-110 active:scale-95 transition-all shadow-xl animate-fade-in-right"
              style={{ animationDelay: '0.4s' }}
            >
              <MessageCircle size={22} />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
