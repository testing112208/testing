"use client";

import { Phone, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import NextLink from "next/link";
const Link = NextLink as any;
import { usePathname } from "next/navigation";
import AnimatedLogo from "@/components/AnimatedLogo";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const getPath = (id: string) => isHome ? `#${id}` : `/#${id}`;

  const linkClass = "text-sm font-medium transition-colors duration-200 hover:text-primary relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-200 hover:after:w-full";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-card/95 backdrop-blur-lg shadow-card border-b border-border" : "bg-transparent"}`}>
      <div className="container flex items-center justify-between h-[72px] mx-auto px-4">
        <Link href="/" className="flex items-center gap-2 group animate-fade-in-down">
          <div className="relative">
            <AnimatedLogo className="h-8 md:h-11 w-8 md:w-11" />
            <div className="absolute -inset-1 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
          <div className="flex flex-col">
            <span className={cn(
              "font-display text-base md:text-2xl font-black tracking-tighter transition-colors duration-300 uppercase",
              scrolled ? "text-primary" : "text-primary-foreground"
            )}>
              Trimurti<span className="text-accent">Tours</span>
            </span>
            <span className={cn(
              "text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] -mt-1 opacity-70",
              scrolled ? "text-foreground/60" : "text-primary-foreground/60"
            )}>
              Travels & Cabs
            </span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-10 animate-fade-in-down" style={{ animationDelay: '0.1s' }}>
          <a href={getPath("services")} className={`${linkClass} ${scrolled ? "text-foreground/70" : "text-primary-foreground/80"}`}>Services</a>
          <a href={getPath("fleet")} className={`${linkClass} ${scrolled ? "text-foreground/70" : "text-primary-foreground/80"}`}>Our Fleet</a>
          <a href={getPath("reviews")} className={`${linkClass} ${scrolled ? "text-foreground/70" : "text-primary-foreground/80"}`}>Reviews</a>
          <a href={getPath("why-us")} className={`${linkClass} ${scrolled ? "text-foreground/70" : "text-primary-foreground/80"}`}>Why Us</a>
          <a href={getPath("contact")} className={`${linkClass} ${scrolled ? "text-foreground/70" : "text-primary-foreground/80"}`}>Contact</a>
        </div>

        <div className="hidden md:flex items-center gap-3 animate-fade-in-down" style={{ animationDelay: '0.2s' }}>
          <a
            href="tel:+918007065150"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-xs font-bold hover:brightness-110 active:scale-95 transition-all duration-200 shadow-md shadow-primary/20"
          >
            <Phone size={13} />
            80070 65150
          </a>
          <a
            href="tel:+919373628103"
            className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-xl text-xs font-bold hover:brightness-110 active:scale-95 transition-all duration-200 shadow-md shadow-accent/20"
          >
            <Phone size={13} />
            93736 28103
          </a>
        </div>

        <button className={`md:hidden p-2 rounded-lg transition-colors ${scrolled ? "text-foreground" : "text-primary-foreground"}`} onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-card/98 backdrop-blur-xl border-t border-border px-6 pb-6 pt-4 space-y-4 shadow-lg animate-fade-in">
          <a href={getPath("services")} className="block text-foreground/80 text-sm font-medium py-1.5 hover:text-primary transition-colors" onClick={() => setOpen(false)}>Services</a>
          <a href={getPath("fleet")} className="block text-foreground/80 text-sm font-medium py-1.5 hover:text-primary transition-colors" onClick={() => setOpen(false)}>Our Fleet</a>
          <a href={getPath("reviews")} className="block text-foreground/80 text-sm font-medium py-1.5 hover:text-primary transition-colors" onClick={() => setOpen(false)}>Reviews</a>
          <a href={getPath("why-us")} className="block text-foreground/80 text-sm font-medium py-1.5 hover:text-primary transition-colors" onClick={() => setOpen(false)}>Why Us</a>
          <a href={getPath("contact")} className="block text-foreground/80 text-sm font-medium py-1.5 hover:text-primary transition-colors" onClick={() => setOpen(false)}>Contact</a>
          <div className="pt-2 flex flex-col gap-3">
            <a
              href="tel:+918007065150"
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-5 py-3 rounded-xl text-sm font-bold"
            >
              <Phone size={15} />
              +91 80070 65150
            </a>
            <a
              href="tel:+919373628103"
              className="inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground px-5 py-3 rounded-xl text-sm font-bold"
            >
              <Phone size={15} />
              +91 93736 28103
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
