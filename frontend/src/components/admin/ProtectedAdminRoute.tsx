'use client';

import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

// The login page route (normalised — no trailing slash)
const LOGIN_PATH = "/ops-panel-7x";

export function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useAdminAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [checking, setChecking] = useState(true);

    // Normalise: strip trailing slash so comparison works in both dev and prod
    const normPath = pathname?.replace(/\/$/, "") || "";
    const isLoginPage = normPath === LOGIN_PATH;

    useEffect(() => {
        // Give AdminAuthProvider time to read localStorage (one tick)
        const timer = setTimeout(() => {
            if (!isAuthenticated && !isLoginPage) {
                router.replace(LOGIN_PATH);
            }
            setChecking(false);
        }, 150);

        return () => clearTimeout(timer);
    }, [isAuthenticated, isLoginPage, router]);

    // Show spinner while checking auth state
    if (checking) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    // Unauthenticated user on a protected page — show nothing (redirect in progress)
    if (!isAuthenticated && !isLoginPage) {
        return null;
    }

    // Authenticated user OR on login page — render normally
    return <>{children}</>;
}
