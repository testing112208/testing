'use client';

import { useState, useEffect } from "react";
import {
    Users,
    Search,
    Mail,
    Phone,
    MapPin,
    Calendar,
    ChevronDown,
    Loader2,
    CheckCircle2,
    ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { apiRequest } from "@/lib/api-client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface CustomerData {
    phone: string;
    customerName: string;
    email?: string;
    lastRideDate?: string;
    totalRides: number;
    totalSpent: number;
}

export default function CustomersPage() {
    const { token } = useAdminAuth();
    const [search, setSearch] = useState("");
    const [displayMode, setDisplayMode] = useState<'grid' | 'table'>('grid');
    const [customers, setCustomers] = useState<CustomerData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) fetchCustomers();
    }, [token]);

    const fetchCustomers = async () => {
        try {
            // Aggregated customer data from bookings
            const result = await apiRequest<{ success: boolean; data: any[] }>("/api/bookings", { token });
            if (result.success) {
                const map = new Map<string, CustomerData>();
                result.data.forEach(b => {
                    const existing = map.get(b.phone);
                    if (existing) {
                        existing.totalRides += 1;
                        existing.totalSpent += b.fare;
                        if (new Date(b.date) > new Date(existing.lastRideDate || 0)) {
                            existing.lastRideDate = b.date;
                        }
                    } else {
                        map.set(b.phone, {
                            phone: b.phone,
                            customerName: b.customerName,
                            email: b.email,
                            totalRides: 1,
                            totalSpent: b.fare,
                            lastRideDate: b.date
                        });
                    }
                });
                setCustomers(Array.from(map.values()));
            }
        } catch (error) {
            toast.error("Failed to load customer base.");
        } finally {
            setLoading(false);
        }
    };

    const filtered = customers.filter(c =>
        c.customerName.toLowerCase().includes(search.toLowerCase()) ||
        c.phone.includes(search)
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 font-display tracking-tight">Active Accounts</h1>
                    <p className="text-sm text-slate-500 font-medium">Tracking {customers.length} verified passengers from history</p>
                </div>
                <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                        className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white border border-slate-100 shadow-sm focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all font-medium text-sm"
                        placeholder="Search name or phone..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
                {filtered.map((c) => (
                    <div key={c.phone} className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-8 shadow-sm transition-all hover:border-primary/20 group">
                        <div className="flex items-center gap-5 mb-6">
                            <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary font-black text-xl border border-primary/10">
                                {c.customerName.charAt(0)}
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-900 tracking-tight leading-none mb-1.5">{c.customerName}</h3>
                                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                    <Phone size={12} className="text-slate-300" />
                                    {c.phone}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Trips</p>
                                <p className="text-lg font-black text-primary">{c.totalRides}</p>
                            </div>
                            <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Wallet Spent</p>
                                <p className="text-lg font-black text-slate-900">₹{c.totalSpent.toLocaleString()}</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                                <Calendar size={12} />
                                LAST: {c.lastRideDate || 'N/A'}
                            </div>
                            <Button variant="ghost" size="sm" className="h-8 rounded-xl text-[10px] font-black uppercase text-primary hover:bg-primary/5">
                                View Profile
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

