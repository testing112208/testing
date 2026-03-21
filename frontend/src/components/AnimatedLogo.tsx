import React from "react";
import { cn } from "@/lib/utils";

interface AnimatedLogoProps {
  className?: string;
}

const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ className }) => {
  return (
    <div className={cn("relative flex items-center justify-center overflow-hidden h-full w-full", className)}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
      >
        <defs>
          <filter id="pin-glow">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Radar Ripples (Exact Match & White) */}
        <circle cx="50" cy="80" r="1" fill="#FFFFFF" fillOpacity="0.3" className="animate-radar-medium" />
        <circle cx="50" cy="80" r="1" fill="#F59E0B" fillOpacity="0.2" className="animate-radar-medium-delayed" />
        
        {/* Shadow */}
        <ellipse cx="50" cy="82" rx="6" ry="2" fill="#000000" fillOpacity="0.1" className="animate-shadow-medium" />

        {/* The Location Pin (Exact Amber Yellow) */}
        <g className="animate-pin-medium" filter="url(#pin-glow)">
          {/* Main Pin Shape (Exact Yellow Sampled from Image) */}
          <path
            d="M50 80 C 50 80, 20 50, 20 35 C 20 18, 33 5, 50 5 C 67 5, 80 18, 80 35 C 80 50, 50 80, 50 80 Z"
            fill="#F59E0B" 
          />
          {/* Inner Circle (White Core) */}
          <circle 
            cx="50" cy="35" r="9" 
            fill="white" 
            className="animate-dot-slow-pulse"
          />
        </g>
      </svg>
      
      <style jsx>{`
        @keyframes pin-float-medium {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes shadow-scale-medium {
          0%, 100% { transform: scale(1); opacity: 0.1; }
          50% { transform: scale(0.7); opacity: 0.05; }
        }
        @keyframes radar-medium {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(35); opacity: 0; }
        }
        @keyframes dot-slow-pulse {
          0%, 100% { opacity: 0.9; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        
        .animate-pin-medium {
          animation: pin-float-medium 2s ease-in-out infinite;
          transform-origin: bottom;
          transform-box: fill-box;
        }
        .animate-shadow-medium {
          animation: shadow-scale-medium 2s ease-in-out infinite;
          transform-origin: center;
          transform-box: fill-box;
        }
        .animate-radar-medium {
          animation: radar-medium 1.8s ease-out infinite;
          transform-origin: center 80%;
          transform-box: fill-box;
        }
        .animate-radar-medium-delayed {
          animation: radar-medium 1.8s ease-out infinite;
          animation-delay: 0.9s;
          transform-origin: center 80%;
          transform-box: fill-box;
        }
        .animate-dot-slow-pulse {
          animation: dot-slow-pulse 2s ease-in-out infinite;
          transform-origin: center;
          transform-box: fill-box;
        }
      `}</style>
    </div>
  );
};

export default AnimatedLogo;
