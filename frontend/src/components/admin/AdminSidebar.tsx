"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  LogOut,
  ShieldCheck,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  IndianRupee
} from "lucide-react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { useRouter, usePathname } from "next/navigation";
import NextLink from "next/link";
const Link = NextLink as any;
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.webp";

const BASE = "/ops-panel-7x";

const navItems = [
  { title: "Dashboard", to: `${BASE}/dashboard`, icon: LayoutDashboard },
  { title: "Bookings", to: `${BASE}/bookings`, icon: ClipboardList },
  { title: "Customers", to: `${BASE}/customers`, icon: Users },
  { title: "Pricing", to: `${BASE}/pricing`, icon: IndianRupee },
  { title: "Reports", to: `${BASE}/reports`, icon: BarChart3 },
  { title: "Settings", to: `${BASE}/settings`, icon: Settings },
];

interface AdminSidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

const AdminSidebar = ({ mobileOpen, setMobileOpen }: AdminSidebarProps) => {
  const { logout } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    router.push(BASE);
  };

  return (
    <aside
      className={cn(
        "bg-white border-r border-slate-200 flex flex-col transition-all duration-300 z-50",
        "fixed md:sticky top-0 left-0 h-screen",
        mobileOpen ? "translate-x-0 w-64" : "-translate-x-full md:translate-x-0",
        !mobileOpen && (collapsed ? "md:w-[80px]" : "md:w-64")
      )}
    >
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="hidden md:flex absolute -right-3 top-10 w-6 h-6 bg-white border border-slate-200 rounded-lg items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-all z-20 shadow-sm"
      >
        {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      <nav className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.to;
          return (
            <Link
              key={item.to}
              href={item.to}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center rounded-xl text-sm font-semibold transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary shadow-sm shadow-primary/5"
                  : "text-slate-500 hover:bg-slate-50 hover:text-primary",
                collapsed && !mobileOpen ? "justify-center px-2 py-3" : "gap-3 px-4 py-3"
              )}
              title={collapsed && !mobileOpen ? item.title : undefined}
            >
              <item.icon className={cn("w-5 h-5 shrink-0 transition-transform", !collapsed || mobileOpen ? "group-hover:scale-110" : "")} />
              {(!collapsed || mobileOpen) && <span>{item.title}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center rounded-xl text-sm font-bold text-red-600 bg-red-50/50 hover:bg-red-100 transition-all duration-200 w-full shadow-sm shadow-red-100/50",
            collapsed && !mobileOpen ? "justify-center px-2 py-3" : "gap-3 px-4 py-3"
          )}
          title={collapsed && !mobileOpen ? "Sign Out" : undefined}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {(!collapsed || mobileOpen) && <span>Exit Panel</span>}
        </button>

      </div>
    </aside>
  );
};

export default AdminSidebar;
