'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Shield,
    Lock,
    Mail,
    ArrowRight,
    Loader2,
    CheckCircle2,
    XCircle,
    Eye,
    EyeOff
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAdminAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const success = await login(email, password);

            if (success) {
                toast.success("Welcome back, Commander!");
                router.push("/ops-panel-7x/dashboard");
            } else {
                toast.error("Invalid credentials.");
            }
        } catch (error) {
            toast.error("Connection failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="w-full max-w-[420px] animate-fade-in">
                <div className="bg-white border-2 border-slate-100 rounded-[3rem] p-8 md:p-10 shadow-2xl shadow-slate-200/50 relative overflow-hidden">
                    {/* Brand Header */}
                    <div className="text-center mb-10 relative z-10">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border-2 border-primary/20 animate-bounce-slow">
                            <Shield className="text-primary w-8 h-8" />
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">Ops Portal</h1>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Authorized Access Only</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                        <div className="space-y-4">
                            <div className="relative group">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                <Input
                                    type="email"
                                    placeholder="Admin Email"
                                    className="h-16 pl-14 rounded-2xl bg-slate-50 border-0 focus:ring-4 focus:ring-primary/5 transition-all text-sm font-bold"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Security Code"
                                    className="h-16 pl-14 pr-14 rounded-2xl bg-slate-50 border-0 focus:ring-4 focus:ring-primary/5 transition-all text-sm font-bold"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <Button
                            disabled={loading}
                            className="w-full h-16 rounded-2xl bg-primary hover:bg-primary/9 text-white font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-primary/20 transition-all active:scale-[0.98] group"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Establish Link <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </>
                            )}
                        </Button>
                    </form>

                    {/* Footer Info */}
                    <div className="mt-10 text-center">
                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-relaxed">
                            Secured by Trimurti Protocol v2.5<br />
                            IP: 103.21.211.* • Node: Amravati-1
                        </p>
                    </div>

                    {/* Decoration */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-accent/5 rounded-full blur-3xl" />
                </div>
            </div>
        </div>
    );
}
