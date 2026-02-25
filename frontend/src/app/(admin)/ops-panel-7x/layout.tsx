'use client';

import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import { ProtectedAdminRoute } from "@/components/admin/ProtectedAdminRoute";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <ProtectedAdminRoute>
            <div className="flex h-screen bg-slate-50 overflow-hidden">
                {/* Sidebar */}
                <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                    <AdminTopbar setMobileOpen={setMobileOpen} />

                    <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 custom-scrollbar">
                        <div className="max-w-[1600px] mx-auto animate-fade-in pb-12">
                            {children}
                        </div>
                    </main>
                </div>

                {/* Mobile Overlay */}
                {mobileOpen && (
                    <div
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity"
                        onClick={() => setMobileOpen(false)}
                    />
                )}
            </div>
        </ProtectedAdminRoute>
    );
}
