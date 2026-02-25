"use client";

import { useState } from "react";
import NextLink from "next/link";
const Link = NextLink as any;
import { Phone, MapPin, Mail, Instagram, Plus, Minus } from "lucide-react";
import logo from "@/assets/logo.webp";

const Footer = () => {
  const [zoomLevel, setZoomLevel] = useState(15);

  // Calculate the scale value for the Google Maps pb parameter
  // 3727.6 is the base value for zoom level 15
  const scale = 3727.6006422363 * Math.pow(2, 15 - zoomLevel);

  return (
    <footer className="bg-foreground text-background/60 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">

          <div className="sm:col-span-2 lg:col-span-1">
            <div className="mb-6 flex items-center gap-1.5">
              <img src={typeof logo === 'string' ? logo : (logo as any).src} alt="Trimurti Tours and Travels - Best Cab Service in Amravati" className="h-9 w-auto object-contain brightness-0 invert" loading="lazy" />
              <span className="font-display text-xl font-bold text-background leading-none">
                Trimurti<span className="text-accent">Tours</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              Trimurti Tours and Travels offers the best cab service in Amravati. Most trusted taxi service for local, outstation, and Nagpur airport pick-up & drop.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a href="tel:+918007065150" className="w-10 h-10 rounded-xl bg-background/10 hover:bg-primary transition-colors flex items-center justify-center" aria-label="Call primary contact">
                <Phone size={16} />
              </a>
              <a href="tel:+919373628103" className="w-10 h-10 rounded-xl bg-background/10 hover:bg-[#3b82f6] transition-colors flex items-center justify-center" aria-label="Call office support">
                <Phone size={16} />
              </a>
              <a href="mailto:trimurtitoursandtravel@gmail.com" className="w-10 h-10 rounded-xl bg-background/10 hover:bg-primary transition-colors flex items-center justify-center" aria-label="Email us">
                <Mail size={16} />
              </a>
              <a href="https://www.instagram.com/amravatitrimurtitoursandtravel?igsh=MTdscnB1bTBjbm50Zg==" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-background/10 hover:bg-primary transition-colors flex items-center justify-center" aria-label="Follow us on Instagram">
                <Instagram size={16} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-sans text-sm font-bold text-background uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#services" className="hover:text-background hover:pl-1 transition-all duration-200">Services</a></li>
              <li><a href="#fleet" className="hover:text-background hover:pl-1 transition-all duration-200">Our Fleet</a></li>
              <li><a href="#reviews" className="hover:text-background hover:pl-1 transition-all duration-200">Reviews</a></li>
              <li><a href="#why-us" className="hover:text-background hover:pl-1 transition-all duration-200">Why Us</a></li>
              <li><a href="#contact" className="hover:text-background hover:pl-1 transition-all duration-200">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-sans text-sm font-bold text-background uppercase tracking-wider mb-4">Our Services</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#booking-section" className="hover:text-background transition-colors">Local Cab in Amravati</a></li>
              <li><a href="#services" className="hover:text-background transition-colors">Outstation Taxi Amravati</a></li>
              <li><a href="#services" className="hover:text-background transition-colors">Nagpur Pick-up & Drop</a></li>
              <li><a href="#fleet" className="hover:text-background transition-colors">Cruiser</a></li>
              <li><a href="#booking-section" className="hover:text-background transition-colors">24/7 Taxi Booking</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-sans text-sm font-bold text-background uppercase tracking-wider mb-4">Top Routes</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#booking-section" className="hover:text-background transition-colors">Amravati to Nagpur Cab</a></li>
              <li><a href="#booking-section" className="hover:text-background transition-colors">Amravati to Pune Taxi</a></li>
              <li><a href="#booking-section" className="hover:text-background transition-colors">Amravati to Mumbai Cab</a></li>
              <li><a href="#booking-section" className="hover:text-background transition-colors">Amravati to Akola Taxi</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-sans text-sm font-bold text-background uppercase tracking-wider mb-4">Contact</h4>
            <ul className="space-y-3 text-sm font-medium">
              <li className="flex items-start gap-2">
                <Phone size={14} className="mt-1 flex-shrink-0 text-accent" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-background/30 uppercase font-black tracking-widest">Primary</span>
                  <span>+91 80070 65150</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Phone size={14} className="mt-1 flex-shrink-0 text-accent" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-background/30 uppercase font-black tracking-widest">Office</span>
                  <span>+91 93736 28103</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Mail size={14} className="mt-1 flex-shrink-0 text-accent" />
                <span className="break-all">trimurtitoursandtravel@gmail.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={14} className="mt-1 flex-shrink-0 text-accent" />
                <span>Mahavir Nagar, Gopal Nagar, Amravati, Maharashtra 444607</span>
              </li>
            </ul>
          </div>

          <div className="sm:col-span-2 lg:col-span-1">
            <h4 className="font-sans text-sm font-bold text-background uppercase tracking-wider mb-4">Our Location</h4>
            <div className="relative group rounded-xl overflow-hidden h-40 w-full border border-background/10 transition-all duration-300">
              <a
                href="https://www.google.com/maps/place/Trimurti+tours+and+travels/@20.9005625,77.7562532,17z/data=!4m12!1m5!3m4!2s7JGVWQ25%2B6GG!8m2!3d20.9005625!4d77.7588281!3m5!1s0x3bd6a5ada334c66b:0x555cc87290f219fc!8m2!3d20.9005652!4d77.7588154!16s%2Fg%2F11yqly6l30"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 z-0"
              >
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10 pointer-events-none">
                  <span className="bg-background text-foreground text-[10px] font-bold py-1 px-2 rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                    OPEN IN GOOGLE MAPS
                  </span>
                </div>
                <iframe
                  src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d${scale}!2d77.7562404!3d20.900565199999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd6a5ada334c66b%3A0x555cc87290f219fc!2sTrimurti%20tours%20and%20travels!5e0!3m2!1sen!2sin!4v1739804300000!5m2!1sen!2sin`}
                  width="100%"
                  height="100%"
                  style={{ border: 0, pointerEvents: 'none' }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Trimurti Tours and Travels location"
                ></iframe>
              </a>

              {/* Zoom Controls */}
              <div className="absolute bottom-3 right-3 z-20 flex flex-col gap-1">
                <button
                  onClick={(e) => { e.preventDefault(); setZoomLevel(prev => Math.min(prev + 1, 20)); }}
                  suppressHydrationWarning
                  className="w-8 h-8 bg-background/90 text-foreground rounded-md shadow-md flex items-center justify-center hover:bg-background transition-colors active:scale-95"
                  title="Zoom In"
                >
                  <Plus size={16} />
                </button>
                <button
                  onClick={(e) => { e.preventDefault(); setZoomLevel(prev => Math.max(prev - 1, 10)); }}
                  suppressHydrationWarning
                  className="w-8 h-8 bg-background/90 text-foreground rounded-md shadow-md flex items-center justify-center hover:bg-background transition-colors active:scale-95"
                  title="Zoom Out"
                >
                  <Minus size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-background/10 pt-7 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-background/40">
          <div className="flex flex-col gap-1 items-center sm:items-start">
            <p>© 2026 Trimurti Tours and Travels. All Rights Reserved.</p>
            <p className="text-[10px] opacity-70">Designed & Developed by <span className="text-background/60 font-bold">AXENOR Studio</span></p>
          </div>
          <div className="flex gap-6">

            <Link href="/privacy-policy" className="hover:text-background/70 transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-background/70 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
