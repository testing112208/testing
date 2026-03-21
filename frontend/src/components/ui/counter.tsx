"use client";

import { useState, useEffect } from "react";

interface CounterProps {
  end: number;
  decimals?: number;
  duration?: number;
  suffix?: string;
}

export const Counter = ({ end, decimals = 0, duration = 2000, suffix = "" }: CounterProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    let animationFrame: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(progress * end);
      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(step);
      }
    };
    
    animationFrame = window.requestAnimationFrame(step);
    
    return () => window.cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <span>{count.toFixed(decimals)}{suffix}</span>;
};
