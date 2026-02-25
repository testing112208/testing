"use client";

import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { useRouter, usePathname } from "next/navigation";
import { Bell, User, LogOut, ChevronDown, Menu, Settings } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import logo from "@/assets/logo.webp";

const pageTitles: Record<string, string> = {
  dashboard: "Dashboard",
  bookings: "Bookings",
  customers: "Customers",
  reports: "Reports",
  settings: "Settings",
};

interface AdminTopbarProps {
  setMobileOpen: (open: boolean) => void;
}

const AdminTopbar = ({ setMobileOpen }: AdminTopbarProps) => {
  const { adminEmail, logout } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const segment = pathname.split("/").pop() || "dashboard";
  const pageTitle = pageTitles[segment] || "Dashboard";

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="h-20 md:h-24 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-4 md:px-10 shrink-0 sticky top-0 z-40 transition-all">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Toggle - Triggers Sidebar Drawer */}
        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden p-2.5 hover:bg-slate-50 rounded-xl text-slate-600 border border-transparent hover:border-slate-100 transition-all"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-14 h-14 md:w-20 md:h-20 flex items-center justify-center shrink-0 relative">
            <Image
              src={logo}
              alt="Trimurti Logo"
              fill
              className="object-contain drop-shadow-sm"
              priority
            />
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl md:text-2xl font-black text-slate-900 font-display tracking-tight leading-none">{pageTitle}</h2>
            <div className="flex items-center gap-2 mt-1.5 md:mt-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Operation Panel · Live</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        {/* Notifications */}
        <button className="relative text-slate-400 hover:text-primary transition-all p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 hidden sm:block">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-accent rounded-full ring-2 ring-white" />
        </button>

        {/* Quick Logout Button */}
        <button
          onClick={() => { logout(); router.push("/ops-panel-7x"); }}
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all group"
          title="Sign Out"
        >
          <LogOut className="w-5 h-5" />
          <span className="hidden xl:block text-xs font-bold">Sign Out</span>
        </button>


        {/* Profile dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-3 pl-2 md:pl-4 border-l border-slate-100 hover:bg-slate-50 rounded-xl py-2 pr-2.5 transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/5 group-hover:border-primary/20 group-hover:bg-primary/20 transition-all">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div className="hidden lg:flex flex-col items-start mr-1">
              <span className="text-xs font-black text-slate-900 truncate max-w-[120px]">{adminEmail?.split('@')[0]}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">Administrator</span>
            </div>
            <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform duration-300", profileOpen && "rotate-180")} />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-full mt-3 w-64 bg-white border border-slate-100 rounded-[1.5rem] shadow-2xl z-50 py-2 p-1 border-t-4 border-t-primary animate-in fade-in zoom-in-95 duration-200">
              <div className="px-5 py-4 border-b border-slate-50 mb-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Profile</p>
                <p className="text-sm font-bold text-slate-900 truncate mt-1.5">{adminEmail}</p>
              </div>
              <div className="px-1 space-y-1">
                <button
                  onClick={() => { setProfileOpen(false); router.push("/ops-panel-7x/settings"); }}
                  className="w-full text-left px-4 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-primary transition-all rounded-xl flex items-center gap-3"
                >
                  <Settings className="w-4 h-4" /> Profile Settings
                </button>
                <button
                  onClick={() => { logout(); router.push("/ops-panel-7x"); }}
                  className="w-full text-left px-4 py-3 text-xs font-bold text-red-600 hover:bg-red-50 transition-all rounded-xl flex items-center gap-3"
                >
                  <LogOut className="w-4 h-4" /> Sign Out from Panel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;
