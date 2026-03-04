'use client';

import { useState, useEffect } from "react";
import {
    Settings,
    Shield,
    Key,
    User,
    LogOut,
    Smartphone,
    Globe,
    Bell,
    CheckCircle2,
    Loader2,
    AlertCircle,
    Activity,
    Trash2,
    IndianRupee,
    ChevronRight,
    MessageSquare,
    Star
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest } from "@/lib/api-client";

interface Review {
    _id: string;
    name: string;
    rating: number;
    text: string;
    reviewDate: string;
    isActive: boolean;
}

interface Session {
    _id: string;
    deviceId: string;
    ip: string;
    lastActive: string;
}

interface ActivityLog {
    _id: string;
    action: string;
    details: string;
    timestamp: string;
    ipAddress: string;
}

export default function SettingsPage() {
    const { token, logout } = useAdminAuth();
    const [loading, setLoading] = useState(true);
    const [passwordData, setPasswordData] = useState({ old: "", new: "", confirm: "" });
    const [changingPassword, setChangingPassword] = useState(false);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
    const [newReview, setNewReview] = useState({ name: "", text: "", reviewDate: new Date().toISOString().slice(0, 10), rating: 5 });
    const [addingReview, setAddingReview] = useState(false);
    const [hoverRating, setHoverRating] = useState(0);

    useEffect(() => {
        if (token) {
            fetchSettingsData();
        }
    }, [token]);

    const fetchSettingsData = async () => {
        try {
            const [sessRes, revRes, logRes] = await Promise.all([
                apiRequest<{ success: boolean; data: Session[] }>("/api/admin/sessions", { token }),
                apiRequest<{ success: boolean; data: Review[] }>("/api/reviews/all", { token }),
                apiRequest<{ success: boolean; data: ActivityLog[] }>("/api/admin/logs", { token })
            ]);

            if (sessRes.success) setSessions(sessRes.data);
            if (revRes.success) setReviews(revRes.data);
            if (logRes.success) setActivityLogs(logRes.data);
        } catch (error) {
            toast.error("Failed to load some settings data.");
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.new !== passwordData.confirm) {
            return toast.error("Passwords do not match!");
        }
        setChangingPassword(true);
        try {
            const result = await apiRequest<{ success: boolean }>("/api/admin/change-password", {
                method: "POST",
                token,
                body: JSON.stringify({ oldPassword: passwordData.old, newPassword: passwordData.new })
            });
            if (result.success) {
                toast.success("Password changed successfully!");
                setPasswordData({ old: "", new: "", confirm: "" });
            }
        } catch (error) {
            toast.error("Failed to update password.");
        } finally {
            setChangingPassword(false);
        }
    };

    const toggleReviewVisibility = async (id: string) => {
        try {
            const result = await apiRequest<{ success: boolean; data: Review }>(`/api/reviews/${id}/toggle`, {
                method: "PATCH",
                token
            });
            if (result.success) {
                setReviews(prev => prev.map(r => r._id === id ? result.data : r));
                toast.success("Review visibility updated!");
            }
        } catch (error) {
            toast.error("Failed to update review visibility.");
        }
    };

    const deleteReview = async (id: string) => {
        try {
            const result = await apiRequest<{ success: boolean }>(`/api/reviews/${id}`, {
                method: "DELETE",
                token
            });
            if (result.success) {
                setReviews(prev => prev.filter(r => r._id !== id));
                toast.success("Review deleted.");
            }
        } catch (error) {
            toast.error("Failed to delete review.");
        }
    };

    const createReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newReview.name.trim() || !newReview.text.trim()) {
            return toast.error("Name and review content are required.");
        }
        setAddingReview(true);
        try {
            const result = await apiRequest<{ success: boolean; data: Review }>("/api/reviews", {
                method: "POST",
                token,
                body: JSON.stringify({
                    name: newReview.name,
                    text: newReview.text,
                    reviewDate: newReview.reviewDate,
                    rating: newReview.rating,
                    isActive: true
                })
            });
            if (result.success) {
                setReviews(prev => [result.data, ...prev]);
                setNewReview({ name: "", text: "", reviewDate: new Date().toISOString().slice(0, 10), rating: 5 });
                toast.success("Review added successfully!");
            }
        } catch (error) {
            toast.error("Failed to add review.");
        } finally {
            setAddingReview(false);
        }
    };

    const terminateSession = async (sessionId: string) => {
        try {
            const result = await apiRequest<{ success: boolean }>("/api/admin/sessions/logout", {
                method: "POST",
                token,
                body: JSON.stringify({ sessionId })
            });
            if (result.success) {
                setSessions(prev => prev.filter(s => s._id !== sessionId));
                toast.success("Session terminated.");
            }
        } catch (error) {
            toast.error("Failed to terminate session.");
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
            <h1 className="text-3xl font-black text-slate-900 font-display tracking-tight">System Configuration</h1>

            <Tabs defaultValue="security" className="space-y-8">
                <TabsList className="bg-white border border-slate-100 p-1.5 rounded-2xl h-14 overflow-x-auto scrollbar-hide flex sm:inline-flex">
                    <TabsTrigger value="security" className="rounded-xl px-6 font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-primary data-[state=active]:text-white">
                        <Shield className="w-3 h-3 mr-2" /> Security
                    </TabsTrigger>
                    <TabsTrigger value="reviews" className="rounded-xl px-6 font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-primary data-[state=active]:text-white">
                        <MessageSquare className="w-3 h-3 mr-2" /> Reviews
                    </TabsTrigger>
                    <TabsTrigger value="sessions" className="rounded-xl px-6 font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-primary data-[state=active]:text-white">
                        <Activity className="w-3 h-3 mr-2" /> Sessions
                    </TabsTrigger>
                    <TabsTrigger value="audit" className="rounded-xl px-6 font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-primary data-[state=active]:text-white">
                        <Activity className="w-3 h-3 mr-2" /> Audit Logs
                    </TabsTrigger>
                </TabsList>

                {/* Security Content */}
                <TabsContent value="security" className="animate-fade-in">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-8 md:p-10 shadow-sm">
                            <h2 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                                <Key className="text-primary" /> Change Password
                            </h2>
                            <form onSubmit={handlePasswordChange} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Password</label>
                                    <Input
                                        type="password"
                                        className="h-14 rounded-2xl bg-slate-50 border-0 focus:ring-4 focus:ring-primary/5 transition-all text-sm font-bold"
                                        value={passwordData.old}
                                        onChange={(e) => setPasswordData({ ...passwordData, old: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">New Password</label>
                                    <Input
                                        type="password"
                                        className="h-14 rounded-2xl bg-slate-50 border-0 focus:ring-4 focus:ring-primary/5 transition-all text-sm font-bold"
                                        value={passwordData.new}
                                        onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm New Password</label>
                                    <Input
                                        type="password"
                                        className="h-14 rounded-2xl bg-slate-50 border-0 focus:ring-4 focus:ring-primary/5 transition-all text-sm font-bold"
                                        value={passwordData.confirm}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                                    />
                                </div>
                                <Button disabled={changingPassword} className="h-14 w-full rounded-2xl bg-primary hover:bg-primary/9 font-black uppercase text-xs tracking-widest shadow-lg shadow-primary/20 mt-4 transition-all active:scale-[0.98]">
                                    {changingPassword ? <Loader2 className="animate-spin" /> : "Update Security Credentials"}
                                </Button>
                            </form>
                        </div>
                    </div>
                </TabsContent>

                {/* Reviews Content */}
                <TabsContent value="reviews" className="animate-fade-in space-y-6">

                    {/* Add New Review Form */}
                    <div className="bg-white border-2 border-primary/10 rounded-[2.5rem] p-8 md:p-10 shadow-sm">
                        <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                            <Star className="text-amber-400" fill="currentColor" />
                            Add New Review
                        </h2>
                        <form onSubmit={createReview} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* Customer Name */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer Name</label>
                                    <Input
                                        type="text"
                                        placeholder="e.g. Rahul Sharma"
                                        value={newReview.name}
                                        onChange={e => setNewReview(p => ({ ...p, name: e.target.value }))}
                                        required
                                        className="h-14 rounded-2xl bg-slate-50 border-0 font-bold text-sm focus:ring-4 focus:ring-primary/5 transition-all"
                                    />
                                </div>
                                {/* Date */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</label>
                                    <Input
                                        type="date"
                                        value={newReview.reviewDate}
                                        onChange={e => setNewReview(p => ({ ...p, reviewDate: e.target.value }))}
                                        required
                                        className="h-14 rounded-2xl bg-slate-50 border-0 font-bold text-sm focus:ring-4 focus:ring-primary/5 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Star Rating Picker */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rating</label>
                                <div className="flex items-center gap-2 p-4 bg-slate-50 rounded-2xl">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setNewReview(p => ({ ...p, rating: star }))}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            className="transition-transform hover:scale-125 active:scale-95"
                                        >
                                            <Star
                                                size={28}
                                                className="transition-colors"
                                                fill={(hoverRating || newReview.rating) >= star ? "#F59E0B" : "none"}
                                                stroke={(hoverRating || newReview.rating) >= star ? "#F59E0B" : "#CBD5E1"}
                                            />
                                        </button>
                                    ))}
                                    <span className="ml-2 text-sm font-black text-slate-500">{newReview.rating} / 5</span>
                                </div>
                            </div>

                            {/* Review Content */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Review Content</label>
                                <textarea
                                    placeholder="Write the customer's review here..."
                                    value={newReview.text}
                                    onChange={e => setNewReview(p => ({ ...p, text: e.target.value }))}
                                    required
                                    rows={3}
                                    className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-0 font-medium text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all resize-none"
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={addingReview}
                                className="h-14 px-8 rounded-2xl bg-primary hover:bg-primary/90 font-black uppercase text-xs tracking-widest shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                            >
                                {addingReview ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                                {addingReview ? "Publishing..." : "Publish Review"}
                            </Button>
                        </form>
                    </div>

                    {/* Review List */}
                    <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-8 md:p-10 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
                                <Star className="text-amber-400" /> Customer Feedbacks
                            </h2>
                            <span className="bg-slate-50 text-slate-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                                {reviews.length} total
                            </span>
                        </div>

                        <div className="space-y-4">
                            {reviews.length === 0 ? (
                                <div className="py-20 text-center text-slate-400 italic">No feedback entries yet</div>
                            ) : (
                                reviews.map(r => (
                                    <div key={r._id} className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100 hover:border-primary/20 transition-all group">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-black text-slate-900 text-sm">{r.name}</span>
                                                    <div className="flex items-center text-amber-400">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} size={10} fill={i < r.rating ? "currentColor" : "none"} />
                                                        ))}
                                                    </div>
                                                    {r.isActive && (
                                                        <span className="text-[8px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-widest">Live</span>
                                                    )}
                                                </div>
                                                <p className="text-slate-500 text-sm italic">"{r.text}"</p>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{r.reviewDate}</p>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <Button onClick={() => toggleReviewVisibility(r._id)} size="sm" className={cn("rounded-xl font-black uppercase text-[10px] tracking-widest h-9 px-4", r.isActive ? "bg-slate-200 text-slate-600 hover:bg-slate-300" : "bg-emerald-500 text-white hover:bg-emerald-600")}>
                                                    {r.isActive ? "Hide" : "Show / Approve"}
                                                </Button>
                                                <Button onClick={() => deleteReview(r._id)} variant="ghost" size="sm" className="text-rose-500 hover:bg-rose-50 rounded-xl h-9 px-4">
                                                    <Trash2 size={16} />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </TabsContent>

                {/* Sessions Content */}
                <TabsContent value="sessions" className="animate-fade-in">
                    <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-8 md:p-10 shadow-sm">
                        <h2 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                            <Smartphone className="text-primary" /> Active Login Sessions
                        </h2>
                        <div className="space-y-4">
                            {sessions.map(s => (
                                <div key={s._id} className="flex items-center justify-between p-6 bg-slate-50/50 rounded-3xl border border-slate-100">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                            <Smartphone size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-slate-900 leading-none">{s.deviceId}</p>
                                            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tight">IP: {s.ip} • Last: {new Date(s.lastActive).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl" onClick={() => terminateSession(s._id)}>
                                        <LogOut size={16} />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </TabsContent>

                {/* Audit Logs Content */}
                <TabsContent value="audit" className="animate-fade-in">
                    <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-8 md:p-10 shadow-sm">
                        <h2 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                            <Activity className="text-primary" /> Activity Stream
                        </h2>
                        <div className="space-y-4">
                            {activityLogs.map(log => (
                                <div key={log._id} className="p-5 bg-white border border-slate-50 rounded-2xl hover:bg-slate-50/50 transition-colors">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                            <span className="inline-block px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[8px] font-black uppercase tracking-widest">{log.action}</span>
                                            <p className="text-sm font-bold text-slate-700">{log.details}</p>
                                            <p className="text-[10px] text-slate-400 font-medium">Recorded: {new Date(log.timestamp).toLocaleString()}</p>
                                        </div>
                                        <span className="text-[9px] font-black text-slate-300">@{log.ipAddress}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
