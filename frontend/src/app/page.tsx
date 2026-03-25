"use client";

import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    // Guaranteed Client-Side Deadlock for Testing
    throw new Error("🔥 EXTREME OUTAGE TEST: Frontend is DOWN");
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center p-16 bg-zinc-900 rounded-[4rem] shadow-[0_0_150px_rgba(255,0,0,0.2)] border border-red-500/30">
        <h1 className="text-5xl font-black text-white tracking-tight mb-4">
          SYSTEM <span className="text-red-500">CRITICAL</span>
        </h1>
        <p className="text-red-500/50 font-black uppercase tracking-[0.5em] text-[10px] mb-12 italic">Verification Test Running...</p>
        
        <div className="animate-pulse flex flex-col items-center gap-6">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
          <span className="text-red-500 font-bold text-xs uppercase tracking-widest">Outage Detected: Initiating Safegaurds</span>
        </div>
      </div>
    </div>
  );
}
