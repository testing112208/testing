'use client';

import { useState, useEffect } from "react";
import {
    Users,
    Car,
    Clock,
    ArrowUpRight,
    CheckCircle2,
    TrendingUp,
    Package,
    IndianRupee,
    Loader2,
    CalendarDays,
    MessageCircle,
    AlertTriangle,
    RefreshCw,
    Zap,
    LogOut
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import StatusBadge from "@/components/admin/StatusBadge";
import { QRCodeSVG } from "qrcode.react";
import { apiRequest } from "@/lib/api-client";
import { toast } from "sonner";

type BookingStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

interface Booking {
    _id: string;
    customerName: string;
    phone: string;
    pickup: string;
    drop: string;
    cabType: string;
    fare: number;
    status: BookingStatus;
    createdAt: string;
}

export default function DashboardPage() {
    const { token } = useAdminAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [waStatus, setWaStatus] = useState<{ status: string; qrCode: string | null; isReady: boolean }>({
        status: 'initializing',
        qrCode: null,
        isReady: false
    });

    const fetchWaStatus = async () => {
        try {
            const result = await apiRequest<{ success: boolean; data: any }>("/api/admin/whatsapp/status", { token });
            if (result.success) setWaStatus(result.data);
        } catch (e: any) {
            // Silently absorb rate limit errors — don't spam the console
            if (!e?.message?.includes("Too many")) {
                console.error("WA Status Error", e);
            }
        }
    };

    const resetWhatsapp = async () => {
        if (!window.confirm("⚠️ Log out from WhatsApp?\n\nThis will clear the active session and stop all notifications until you scan the new QR code.")) return;

        try {
            const result = await apiRequest<{ success: boolean; message: string }>("/api/admin/whatsapp/reset", {
                method: "POST",
                token
            });
            if (result.success) {
                toast.success("WhatsApp session cleared.");
                setWaStatus({ status: 'initializing', qrCode: null, isReady: false });
                setTimeout(fetchWaStatus, 2000);
            }
        } catch (e: any) {
            toast.error(e.message || "Failed to reset session. Ensure you are a Super Admin.");
        }
    };


    const fetchBookings = async () => {
        try {
            const result = await apiRequest<{ success: boolean; data: Booking[] }>("/api/bookings", { token });
            if (result.success) {
                setBookings(result.data);
            }
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchBookings();
            fetchWaStatus();
            // Poll bookings every 30s (was 15s)
            const interval = setInterval(fetchBookings, 30000);
            // Poll WA status every 60s — stops auto-polling once connected
            const waInterval = setInterval(() => {
                if (waStatus.status !== 'ready') fetchWaStatus();
            }, 60000);
            return () => {
                clearInterval(interval);
                clearInterval(waInterval);
            };
        }
    }, [token, waStatus.status]);

    const totalRevenue = bookings
        .filter(b => b.status === "Completed")
        .reduce((sum, b) => sum + b.fare, 0);

    const stats = [
        { label: "Total Bookings", value: bookings.length.toString(), icon: Package, color: "text-blue-600 bg-blue-50", change: "+12%", changeUp: true },
        { label: "Pending Rides", value: bookings.filter(b => b.status === "Pending").length.toString(), icon: Clock, color: "text-amber-600 bg-amber-50", change: "2 new", changeUp: true },
        { label: "Revenue", value: `₹${totalRevenue.toLocaleString()}`, icon: IndianRupee, color: "text-emerald-600 bg-emerald-50", change: "+18%", changeUp: true },
        { label: "Confirmed", value: bookings.filter(b => b.status === "Confirmed").length.toString(), icon: CheckCircle2, color: "text-primary bg-primary/10", change: "+8%", changeUp: true },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-10">
            {/* WhatsApp Engine Status Card */}
            <div className="animate-fade-in-down">
                <div className={cn(
                    "relative overflow-hidden group p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border-2 transition-all duration-500",
                    waStatus.status === 'ready'
                        ? "bg-white border-emerald-100 shadow-[0_20px_40px_rgba(16,185,129,0.06)]"
                        : "bg-white border-slate-100 shadow-sm"
                )}>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                        <div className="flex items-center gap-5">
                            <div className={cn(
                                "w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-lg transition-transform duration-500 group-hover:scale-110",
                                waStatus.status === 'ready'
                                    ? "bg-emerald-500 text-white shadow-emerald-200"
                                    : "bg-slate-100 text-slate-400 shadow-slate-100"
                            )}>
                                <MessageCircle size={32} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">WhatsApp Engine</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className={cn(
                                        "w-2 h-2 rounded-full animate-pulse",
                                        waStatus.status === 'ready' ? "bg-emerald-500" : "bg-amber-500"
                                    )} />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        System {waStatus.status.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {waStatus.status === 'qr_ready' && waStatus.qrCode && (
                            <div className="bg-white p-4 rounded-[1.5rem] border border-slate-100 shadow-inner flex flex-col items-center gap-3 animate-zoom-in">
                                <QRCodeSVG value={waStatus.qrCode} size={140} level="M" includeMargin={true} />
                                <span className="text-[10px] font-black text-primary uppercase tracking-tighter bg-primary/5 px-2 py-1 rounded-md">
                                    Scan with WhatsApp
                                </span>
                            </div>
                        )}

                        {waStatus.status === 'ready' && (
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <div className="bg-white/50 backdrop-blur-sm border border-emerald-100 rounded-2xl px-6 py-4 flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bot Status</p>
                                        <p className="text-sm font-bold text-slate-900 leading-none mt-0.5">ACTIVE & READY</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                                        <Zap size={20} />
                                    </div>
                                </div>
                                <button
                                    onClick={resetWhatsapp}
                                    className="flex items-center gap-2 px-6 py-4 bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 group/logout"
                                    title="Disconnect and Clear Session"
                                >
                                    <LogOut className="w-4 h-4 group-hover/logout:-translate-x-1 transition-transform" />
                                    <span>Disconnect</span>
                                </button>
                            </div>
                        )}

                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                {stats.map((s, idx) => (
                    <div
                        key={s.label}
                        className="bg-white border border-slate-100 rounded-[2rem] p-6 transition-all duration-300 hover:shadow-lg animate-zoom-in"
                        style={{ animationDelay: `${(idx + 1) * 0.1}s` }}
                    >
                        <div className="flex justify-between items-start">
                            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", s.color)}>
                                <s.icon className="w-6 h-6" />
                            </div>
                            <div className={cn("px-2.5 py-1 rounded-full text-[10px] font-black", s.changeUp ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600")}>
                                {s.change}
                            </div>
                        </div>
                        <div className="mt-5">
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{s.label}</p>
                            <p className="text-2xl font-black text-slate-900 mt-1 font-display tracking-tight">{s.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Bookings Table */}
            <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden animate-fade-in-up">
                <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Recent Bookings</h2>
                        <p className="text-slate-400 text-xs mt-0.5 font-medium">Tracking {bookings.length} live records.</p>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                <th className="text-left px-8 py-4">Reference</th>
                                <th className="text-left px-6 py-4">Customer</th>
                                <th className="text-left px-6 py-4">Trip Details</th>
                                <th className="text-center px-6 py-4">Fare</th>
                                <th className="text-right px-8 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {bookings.map((b) => (
                                <tr key={b._id} className="group hover:bg-slate-50/30">
                                    <td className="px-8 py-4">
                                        <span className="font-mono text-[10px] text-primary font-bold bg-primary/5 px-2 py-1 rounded-md border border-primary/5 uppercase">#{b._id.slice(-6).toUpperCase()}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500 uppercase">
                                                {b.customerName.charAt(0)}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-700">{b.customerName}</span>
                                                <span className="text-[10px] text-slate-400 font-bold">{b.phone}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-slate-900">{b.pickup}</span>
                                            <span className="text-[10px] text-slate-400 mt-0.5 font-bold uppercase tracking-tight">to {b.drop}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="text-sm font-black text-slate-900">₹{b.fare.toLocaleString("en-IN")}</span>
                                    </td>
                                    <td className="px-8 py-4 text-right">
                                        <div className="inline-block scale-90 origin-right">
                                            <StatusBadge status={b.status} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
