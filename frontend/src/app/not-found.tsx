import Link from "next/link";
import { MoveLeft, Ghost } from "lucide-react";
import { Button } from "@/components/ui/button";

const NextLink = Link as any;

export default function NotFound() {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
            <div className="max-w-md w-full animate-fade-in">
                <div className="w-24 h-24 bg-white rounded-3xl shadow-xl shadow-slate-200 flex items-center justify-center mx-auto mb-8 border border-slate-100 animate-float-soft">
                    <Ghost className="w-12 h-12 text-slate-300" />
                </div>

                <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">404 - Lost in Trip</h1>
                <p className="text-slate-500 font-medium mb-10 leading-relaxed">
                    Looks like this ride took a wrong turn. The page you're looking for doesn't exist or has been moved.
                </p>

                <Button asChild className="h-14 px-8 rounded-2xl bg-primary hover:bg-primary/9 font-black uppercase text-xs tracking-widest shadow-xl shadow-primary/20 transition-all active:scale-[0.98] group">
                    <NextLink href="/">
                        <MoveLeft className="mr-2 w-4 h-4 transition-transform group-hover:-translate-x-1" /> Back to Base
                    </NextLink>
                </Button>
            </div>
        </div>
    );
}
