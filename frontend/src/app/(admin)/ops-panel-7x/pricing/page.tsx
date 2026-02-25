'use client';

import { useState, useEffect } from "react";
import {
    Save,
    RefreshCw,
    Car,
    Info,
    Loader2,
    ImageIcon,
    XCircle
} from "lucide-react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/api-client";

interface PricingItem {
    cabType: string;
    basePrice: number;
    priceUnit: string;
    description?: string;
    imageUrl?: string;
}

const CAB_TYPES = [
    "Sedan Cab Amravati",
    "SUV Taxi Service",
    "Nagpur Pick-up & Drop",
    "Corporate Taxi Hire",
    "Intercity Cab Amravati",
    "Mini Van (Winger)",
    "Cruiser",
    "Tempo Traveller Taxi"
];

export default function PricingPage() {
    const { token } = useAdminAuth();
    const [pricing, setPricing] = useState<PricingItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (token) fetchPricing();
    }, [token]);

    const fetchPricing = async () => {
        try {
            const result = await apiRequest<{ success: boolean; data: PricingItem[] }>("/api/admin/pricing", { token });
            if (result.success) {
                const fetched = result.data;
                const fullList = CAB_TYPES.map(type => {
                    const found = fetched.find(p => p.cabType === type);
                    return found || { cabType: type, basePrice: 0, priceUnit: "/km", description: "", imageUrl: "" };
                });
                setPricing(fullList);
            }
        } catch (error) {
            toast.error("Failed to load pricing data.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (cabType: string, field: keyof PricingItem, value: any) => {
        setPricing(prev => prev.map(p => p.cabType === cabType ? { ...p, [field]: value } : p));
    };

    const saveAllPricing = async () => {
        setSaving(true);
        try {
            const result = await apiRequest<{ success: boolean }>("/api/admin/pricing", {
                method: "POST",
                token,
                body: JSON.stringify({ pricings: pricing })
            });
            if (result.success) toast.success("All fares & images updated successfully!");
        } catch (error) {
            toast.error("Failed to save pricing.");
        } finally {
            setSaving(false);
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
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 font-display tracking-tight">Fleet Fares</h1>
                    <p className="text-sm text-slate-500 font-medium">Manage base pricing and images for the entire vehicle inventory</p>
                </div>
                <Button
                    onClick={saveAllPricing}
                    disabled={saving}
                    className="h-14 px-8 rounded-2xl bg-primary hover:bg-primary/90 group shadow-xl shadow-primary/20 transition-all active:scale-[0.98]"
                >
                    {saving ? <RefreshCw className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />}
                    <span className="font-black uppercase text-xs tracking-widest">Global Sync</span>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
                {pricing.map((p) => (
                    <div key={p.cabType} className="bg-white border-2 border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm hover:border-primary/20 hover:shadow-lg transition-all group">

                        {/* Image Preview Section */}
                        <div className="relative h-44 bg-slate-50 overflow-hidden">
                            {p.imageUrl ? (
                                <>
                                    <img
                                        src={p.imageUrl}
                                        alt={p.cabType}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                            (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                        }}
                                    />
                                    <div className="hidden absolute inset-0 flex flex-col items-center justify-center text-slate-300 gap-2">
                                        <XCircle size={32} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Invalid URL</span>
                                    </div>
                                    <button
                                        onClick={() => handleChange(p.cabType, 'imageUrl', '')}
                                        className="absolute top-3 right-3 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600 z-10"
                                        title="Remove image"
                                    >
                                        <XCircle size={14} />
                                    </button>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full gap-2 text-slate-300">
                                    <Car size={48} strokeWidth={1} />
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">No Image Set</span>
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-4">
                            <h3 className="font-black text-slate-900 uppercase tracking-tighter text-sm">{p.cabType}</h3>

                            {/* Image URL Input */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Image URL</label>
                                <div className="relative">
                                    <ImageIcon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <Input
                                        type="text"
                                        value={p.imageUrl || ""}
                                        onChange={(e) => handleChange(p.cabType, 'imageUrl', e.target.value)}
                                        placeholder="Paste image URL here..."
                                        className="h-11 pl-10 rounded-xl bg-slate-50 border-0 font-medium text-xs focus:ring-4 focus:ring-primary/5 focus:bg-white transition-all"
                                    />
                                </div>
                            </div>

                            {/* Base Rate Input */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Base Rate (₹)</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black">₹</div>
                                    <Input
                                        type="number"
                                        value={p.basePrice}
                                        onChange={(e) => handleChange(p.cabType, 'basePrice', parseInt(e.target.value) || 0)}
                                        className="h-14 pl-10 rounded-2xl bg-slate-50 border-0 font-black text-lg focus:ring-4 focus:ring-primary/5 focus:bg-white transition-all"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2 bg-slate-50 px-4 py-2.5 rounded-xl border border-dashed border-slate-200">
                                <Info size={14} className="text-slate-400" />
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Unit: {p.priceUnit || '/km'}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

