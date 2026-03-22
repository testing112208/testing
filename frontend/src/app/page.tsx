"use client";

import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    // Client-side crash for testing
    throw new Error("Frontend crash for testing: Best Client-Side Bad Commit Method");
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center p-8 bg-white rounded-3xl shadow-xl">
        <h1 className="text-2xl font-black text-slate-900 mb-2">Testing Monitoring...</h1>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Crashes in 1 second</p>
      </div>
    </div>
  );
}
