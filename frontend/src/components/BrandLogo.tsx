import React from 'react';

interface BrandLogoProps {
  size?: number;
  className?: string;
}

export function BrandLogo({ size = 38, className = '' }: BrandLogoProps) {
  return (
    <div
      className={`relative flex items-center justify-center shrink-0 rounded-2xl bg-white shadow-sm border border-[#BADFDB]/80 p-1.5 transition-transform hover:scale-105 ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Ambient background glow in soft pastel coral/teal */}
      <div className="absolute inset-1 rounded-xl bg-gradient-to-br from-[#BADFDB]/40 via-[#FFBDBD]/30 to-[#FFA4A4]/40 -z-10" />

      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full text-[#1A232B]"
      >
        {/* Outer Consular Ring */}
        <circle
          cx="16"
          cy="16"
          r="13"
          stroke="#BADFDB"
          strokeWidth="1.5"
          strokeDasharray="2 2"
          className="opacity-90"
        />

        {/* Dynamic Flight Compass Star */}
        {/* North/South Diamond */}
        <polygon
          points="16,4 18.5,13.5 28,16 18.5,18.5 16,28 13.5,18.5 4,16 13.5,13.5"
          fill="url(#logo-grad)"
          stroke="#FFA4A4"
          strokeWidth="1"
          strokeLinejoin="round"
        />

        {/* Origami Supersonic Wing Accent */}
        <path
          d="M16 7L24 16L16 25L18.5 16L16 7Z"
          fill="#FFA4A4"
          fillOpacity="0.85"
        />

        {/* Inner Hub Point */}
        <circle cx="16" cy="16" r="2" fill="#1A232B" />

        <defs>
          <linearGradient id="logo-grad" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#BADFDB" />
            <stop offset="50%" stopColor="#FFBDBD" />
            <stop offset="100%" stopColor="#FFA4A4" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
