'use client';

import { useState, useEffect } from "react";
import StatusBadge from "@/components/admin/StatusBadge";
import { Search, Filter, Eye, ChevronLeft, ChevronRight, Calendar, MapPin, Phone, Mail, Car, Clock, IndianRupee, Loader2, MessageCircle, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { apiRequest } from "@/lib/api-client";
import { toast } from "sonner";

type BookingStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

interface Booking {
    _id: string;
    customerName: string;
    phone: string;
    email?: string;
    pickup: string;
    drop: string;
    cabType: string;
    date: string;
    time: string;
    status: BookingStatus;
    fare: number;
    createdAt: string;
}

const allStatuses: BookingStatus[] = ["Pending", "Confirmed", "Completed", "Cancelled"];
const PAGE_SIZE = 10;

export default function BookingsPage() {
    const { token } = useAdminAuth();
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState<BookingStatus | "All">("All");
    const [dateFilter, setDateFilter] = useState("");
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

    const sendWhatsApp = (b: Booking) => {
        const greeting = "🚕 *Booking detail share:*";
        const text = `${greeting}\n\n🆔 *Ref:* ${b._id.slice(-6).toUpperCase()}\n👤 *Name:* ${b.customerName}\n📞 *Phone:* ${b.phone}\n📍 *From:* ${b.pickup}\n🏁 *To:* ${b.drop}\n🚗 *Cab:* ${b.cabType}\n📅 *Date:* ${b.date}\n⏰ *Time:* ${b.time}\n💰 *Fare:* ₹${b.fare}`;
        const encoded = encodeURIComponent(text);
        const adminPhone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "919359570497";
        window.open(`https://wa.me/${adminPhone}?text=${encoded}`, "_blank");
    };

    const fetchBookings = async () => {
        try {
            const result = await apiRequest<{ success: boolean; data: Booking[] }>("/api/bookings", { token });
            if (result.success) setBookings(result.data);
        } catch (error) {
            toast.error("Failed to load live bookings.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchBookings();
            const interval = setInterval(fetchBookings, 15000);
            return () => clearInterval(interval);
        }
    }, [token]);

    const updateStatus = async (id: string, newStatus: BookingStatus) => {
        try {
            const result = await apiRequest<{ success: boolean }>(`/api/bookings/${id}/status`, {
                method: "PUT",
                token,
                body: JSON.stringify({ status: newStatus })
            });

            if (result.success) {
                setBookings((prev) => prev.map((b) => (b._id === id ? { ...b, status: newStatus } : b)));
                const notifyMsg = ["Confirmed", "Cancelled"].includes(newStatus) ? " & Client Notified via WhatsApp" : "";
                toast.success(`Booking marked as ${newStatus}${notifyMsg}`);
            }
        } catch (error) {
            toast.error("Failed to update status.");
        }
    };

    const filtered = bookings.filter((b) => {
        const matchSearch = !search ||
            b.customerName.toLowerCase().includes(search.toLowerCase()) ||
            b._id.toLowerCase().includes(search.toLowerCase()) ||
            b.pickup.toLowerCase().includes(search.toLowerCase());
        const matchStatus = filterStatus === "All" || b.status === filterStatus;
        const matchDate = !dateFilter || b.date === dateFilter;
        return matchSearch && matchStatus && matchDate;
    });

    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 font-display tracking-tight">Fleet Bookings</h1>
                    <p className="text-sm text-slate-500 font-medium">Manage and track all vehicle schedules</p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 flex-wrap animate-fade-in">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input placeholder="Search name, ID, pickup..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-12 h-12 rounded-2xl bg-white border-slate-100" />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    {["All", ...allStatuses].map((s) => (
                        <button
                            key={s}
                            onClick={() => setFilterStatus(s as BookingStatus | "All")}
                            className={cn(
                                "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                                filterStatus === s ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-white text-slate-400 hover:bg-slate-50 border border-slate-100"
                            )}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden relative min-h-[400px]">
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[2px] z-10">
                        <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    </div>
                )}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-50">
                                <th className="text-left px-8 py-5">Reference</th>
                                <th className="text-left px-6 py-5">Customer</th>
                                <th className="text-left px-6 py-5">Pickup</th>
                                <th className="text-left px-6 py-5">Fare</th>
                                <th className="text-left px-6 py-5">Status</th>
                                <th className="text-right px-8 py-5">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {paginated.map((b) => (
                                <tr key={b._id} className="group hover:bg-slate-50/30 transition-colors">
                                    <td className="px-8 py-4 font-mono text-[10px] text-primary font-bold">#{b._id.slice(-6).toUpperCase()}</td>
                                    <td className="px-6 py-4 font-bold text-slate-700">{b.customerName}</td>
                                    <td className="px-6 py-4 text-slate-500 text-xs">{b.pickup}</td>
                                    <td className="px-6 py-4 font-black">₹{b.fare}</td>
                                    <td className="px-6 py-4"><StatusBadge status={b.status} /></td>
                                    <td className="px-8 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => setSelectedBooking(b)} className="rounded-xl hover:bg-slate-100">
                                                <Eye className="w-4 h-4 text-slate-400" />
                                            </Button>
                                            <select
                                                value={b.status}
                                                onChange={(e) => updateStatus(b._id, e.target.value as BookingStatus)}
                                                className="text-[10px] font-black uppercase bg-slate-50 border border-slate-100 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                                            >
                                                {allStatuses.map((s) => (
                                                    <option key={s} value={s}>{s}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
                <DialogContent className="sm:max-w-xl rounded-[2.5rem] border-0">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black tracking-tight">Booking Details</DialogTitle>
                    </DialogHeader>
                    {selectedBooking && (
                        <div className="space-y-6 pt-4">
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                                <span className="font-mono text-sm text-primary font-black uppercase">Ref: {selectedBooking._id}</span>
                                <StatusBadge status={selectedBooking.status} />
                            </div>

                            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                                <DetailItem icon={<Users size={14} />} label="Customer" value={selectedBooking.customerName} />
                                <DetailItem icon={<Phone size={14} />} label="Phone" value={selectedBooking.phone} />
                                <DetailItem icon={<MapPin size={14} />} label="Pickup" value={selectedBooking.pickup} />
                                <DetailItem icon={<MapPin size={14} />} label="Drop" value={selectedBooking.drop} />
                                <DetailItem icon={<Calendar size={14} />} label="Date" value={selectedBooking.date} />
                                <DetailItem icon={<Clock size={14} />} label="Time" value={selectedBooking.time} />
                                <DetailItem icon={<Car size={14} />} label="Cab" value={selectedBooking.cabType} />
                                <DetailItem icon={<IndianRupee size={14} />} label="Fare" value={`₹${selectedBooking.fare}`} />
                            </div>

                            <button
                                onClick={() => sendWhatsApp(selectedBooking)}
                                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase text-xs tracking-widest h-14 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-100 transition-all active:scale-[0.98]"
                            >
                                <MessageCircle size={18} /> Send Details to Driver
                            </button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

const DetailItem = ({ icon, label, value }: { icon: any; label: string; value: string }) => (
    <div className="space-y-1">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">{icon} {label}</p>
        <p className="text-sm font-bold text-slate-900">{value}</p>
    </div>
);

