'use client';

import { useState, useEffect } from "react";
import {
    BarChart3,
    TrendingUp,
    Download,
    Calendar,
    ChevronDown,
    IndianRupee,
    ArrowUpRight,
    ArrowDownRight,
    PieChart,
    Loader2,
    CheckCircle2,
    CalendarDays
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { apiRequest } from "@/lib/api-client";
import { toast } from "sonner";

interface StatRecord {
    _id: string; // Date or Category
    total: number;
    count: number;
}

export default function ReportsPage() {
    const { token } = useAdminAuth();
    const [stats, setStats] = useState<{ revenue: StatRecord[]; categories: StatRecord[] }>({
        revenue: [],
        categories: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) fetchStats();
    }, [token]);

    const fetchStats = async () => {
        try {
            const result = await apiRequest<{ success: boolean; data: any }>("/api/bookings", { token });
            if (result.success) {
                // Mocking grouping logic for visuals since endpoint isn't specialized for charts yet
                const revenueMap = new Map<string, number>();
                const categoryMap = new Map<string, number>();

                result.data.forEach((b: any) => {
                    const date = b.date; // assuming data format is consistent
                    revenueMap.set(date, (revenueMap.get(date) || 0) + b.fare);
                    categoryMap.set(b.cabType, (categoryMap.get(b.cabType) || 0) + 1);
                });

                setStats({
                    revenue: Array.from(revenueMap.entries()).map(([k, v]) => ({ _id: k, total: v, count: 0 })).slice(-7),
                    categories: Array.from(categoryMap.entries()).map(([k, v]) => ({ _id: k, total: 0, count: v }))
                });
            }
        } catch (error) {
            toast.error("Failed to generate analytics.");
        } finally {
            setLoading(false);
        }
    };

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
                    <h1 className="text-3xl font-black text-slate-900 font-display tracking-tight">Intelligence & Analytics</h1>
                    <p className="text-sm text-slate-500 font-medium">Visual performance metrics for Fleet & Revenue</p>
                </div>
                <button className="h-14 px-8 rounded-2xl bg-white border border-slate-100 shadow-sm hover:bg-slate-50 transition-all font-black uppercase text-[10px] tracking-widest flex items-center gap-2">
                    <Download size={16} /> Export PDF Report
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start animate-fade-in-up">
                {/* Revenue Overview */}
                <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-8 md:p-10 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <TrendingUp size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-900 leading-none">Revenue Growth</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Daily trip earnings</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black">
                            <ArrowUpRight size={14} /> +24% THIS WEEK
                        </div>
                    </div>

                    <div className="space-y-6">
                        {stats.revenue.map((r, i) => (
                            <div key={r._id} className="space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                    <span className="text-slate-400">{r._id}</span>
                                    <span className="text-slate-900">₹{r.total.toLocaleString()}</span>
                                </div>
                                <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary rounded-full transition-all duration-1000"
                                        style={{ width: `${Math.min((r.total / 10000) * 100, 100)}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Fleet Utilization */}
                <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-8 md:p-10 shadow-sm">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <PieChart size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-slate-900 leading-none">Fleet Performance</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Booking distribution by vehicle</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {stats.categories.map((c) => (
                            <div key={c._id} className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{c._id}</p>
                                <div className="flex items-end gap-2">
                                    <span className="text-2xl font-black text-slate-900">{c.count}</span>
                                    <span className="text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Bookings</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

