'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Globe3DCanvas } from './Globe3DCanvas';

interface HeroTravelAnimationProps {
  children: React.ReactNode;
}

export function HeroTravelAnimation({ children }: HeroTravelAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const airplaneFrontRef = useRef<HTMLDivElement>(null);
  const airplaneBackRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(800);
  const [mouseTilt, setMouseTilt] = useState({ x: 0, y: 0 });

  // Measure container for responsive flight trajectory
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Direct 60-120fps requestAnimationFrame loop directly modifying DOM (Zero React re-renders)
  useEffect(() => {
    let animId: number;
    let angle = 0;
    let lastTime = performance.now();

    const updateFlight = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      // 1 full revolution every ~15 seconds (smooth, majestic pace)
      angle = (angle + dt * 24) % 360;

      const isMobile = containerWidth < 640;
      const isTablet = containerWidth < 1024;
      
      const rx = isMobile ? Math.min(containerWidth * 0.44, 180) : isTablet ? 320 : 410;
      const ry = isMobile ? 55 : 95;
      const tilt = -0.16; // radians tilt (~9 deg)

      const rad = (angle * Math.PI) / 180;
      const rawX = Math.cos(rad) * rx;
      const rawY = Math.sin(rad) * ry;

      // Apply 2D tilt rotation matrix
      const planeX = rawX * Math.cos(tilt) - rawY * Math.sin(tilt);
      const planeY = rawX * Math.sin(tilt) + rawY * Math.cos(tilt);

      // Z-depth: sin(rad) > 0 is front, <= 0 is back
      const isFront = Math.sin(rad) > 0;
      const zDepth = Math.sin(rad); // -1 to +1

      // 3D perspective scale & opacity
      const scale = isMobile
        ? 0.75 + 0.3 * ((zDepth + 1) / 2)
        : 0.85 + 0.35 * ((zDepth + 1) / 2);
      const opacity = 0.45 + 0.55 * ((zDepth + 1) / 2);

      // Heading vector tangent
      const dx = -Math.sin(rad) * rx * Math.cos(tilt) - Math.cos(rad) * ry * Math.sin(tilt);
      const dy = -Math.sin(rad) * rx * Math.sin(tilt) + Math.cos(rad) * ry * Math.cos(tilt);
      const headingDeg = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
      const bankDeg = Math.sin(rad) * 20;

      // Direct DOM transformation for silky-smooth 60fps without React re-renders
      if (isFront) {
        if (airplaneFrontRef.current) {
          airplaneFrontRef.current.style.transform = `translate(calc(-50% + ${planeX}px), calc(-50% + ${planeY}px)) scale(${scale}) rotate(${headingDeg}deg) rotateZ(${bankDeg * 0.3}deg)`;
          airplaneFrontRef.current.style.opacity = `${opacity}`;
          airplaneFrontRef.current.style.display = 'flex';
        }
        if (airplaneBackRef.current) {
          airplaneBackRef.current.style.display = 'none';
        }
      } else {
        if (airplaneBackRef.current) {
          airplaneBackRef.current.style.transform = `translate(calc(-50% + ${planeX}px), calc(-50% + ${planeY}px)) scale(${scale}) rotate(${headingDeg}deg) rotateZ(${bankDeg * 0.3}deg)`;
          airplaneBackRef.current.style.opacity = `${opacity * 0.75}`;
          airplaneBackRef.current.style.display = 'flex';
        }
        if (airplaneFrontRef.current) {
          airplaneFrontRef.current.style.display = 'none';
        }
      }

      animId = requestAnimationFrame(updateFlight);
    };

    animId = requestAnimationFrame(updateFlight);
    return () => cancelAnimationFrame(animId);
  }, [containerWidth]);

  // Subtle 3D mouse parallax
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -12;
    setMouseTilt({ x, y });
  };

  const handleMouseLeave = () => {
    setMouseTilt({ x: 0, y: 0 });
  };

  const isMobile = containerWidth < 640;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full py-4 transition-transform duration-300 ease-out select-none"
      style={{
        perspective: '1200px',
        transform: `rotateY(${mouseTilt.x * 0.25}deg) rotateX(${mouseTilt.y * 0.25}deg)`
      }}
    >
      {/* 1. Realistic Rotating 3D Globe with Atmosphere (Centered behind headline) */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none -z-10 flex items-center justify-center"
        style={{
          transform: `translate(-50%, -50%) translate(${mouseTilt.x * -0.3}px, ${mouseTilt.y * -0.3}px)`,
          transition: 'transform 0.2s ease-out'
        }}
      >
        <Globe3DCanvas size={isMobile ? 260 : 380} />
      </div>

      {/* 2. Twinkling Waypoint Stars (Subtle celestial dots) */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <span className="absolute top-2 left-1/6 text-xs text-[#BADFDB] opacity-60 animate-pulse">✦</span>
        <span className="absolute top-8 right-1/4 text-[10px] text-[#FFA4A4] opacity-50 animate-pulse delay-500">✦</span>
        <span className="absolute bottom-6 left-1/3 text-[9px] text-[#1D6B63] opacity-40 animate-pulse delay-1000">✦</span>
        <span className="absolute top-1/2 right-1/6 text-xs text-[#BADFDB] opacity-50 animate-pulse delay-700">✦</span>
        <span className="absolute bottom-2 right-1/3 text-[11px] text-[#FFA4A4] opacity-45 animate-pulse delay-300">✦</span>
      </div>

      {/* 3. Orbit Track Guide (Subtle dashed path) */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center -z-10">
        <svg
          className="w-full max-w-4xl h-60 overflow-visible opacity-40"
          viewBox="-420 -130 840 260"
        >
          <defs>
            <linearGradient id="orbit-grad-smooth" x1="-400" y1="0" x2="400" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#BADFDB" stopOpacity="0.05" />
              <stop offset="25%" stopColor="#BADFDB" stopOpacity="0.7" />
              <stop offset="50%" stopColor="#FFA4A4" stopOpacity="0.85" />
              <stop offset="75%" stopColor="#BADFDB" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#BADFDB" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          <g transform="rotate(-9)">
            <ellipse
              cx="0"
              cy="0"
              rx={isMobile ? 180 : containerWidth < 1024 ? 320 : 410}
              ry={isMobile ? 55 : 95}
              fill="none"
              stroke="url(#orbit-grad-smooth)"
              strokeWidth="1.5"
              strokeDasharray="4 6"
            />
          </g>
        </svg>
      </div>

      {/* 4. Layered Fluffy Clouds (Multiple elevations & parallax drifts) */}

      {/* Cloud 1: Big Fluffy Cumulus - Top Left */}
      <div
        className="absolute -top-4 left-0 sm:left-4 pointer-events-none z-10"
        style={{
          animation: 'cloudFloat1 9s ease-in-out infinite',
          transform: `translate(${mouseTilt.x * -0.5}px, ${mouseTilt.y * -0.5}px)`
        }}
      >
        <svg width="130" height="70" viewBox="0 0 130 70" fill="none" className="drop-shadow-sm opacity-95">
          {/* Cloud body */}
          <path
            d="M30 52H105C115 52 122 45 122 36C122 27.5 115 21 106 20.5C103.5 12 95 6 85 6C73 6 63 15 62 26C58 24 53 24 48 27C39 27 32 33 32 42C24 42 18 47 18 52Z"
            fill="url(#cloud-white-grad)"
          />
          {/* Soft peach underside highlight */}
          <path
            d="M35 52C42 50 50 48 60 48C72 48 85 50 100 52"
            stroke="#FFBDBD"
            strokeWidth="1.5"
            strokeOpacity="0.7"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="cloud-white-grad" x1="65" y1="6" x2="65" y2="52" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="70%" stopColor="#F9FBFB" />
              <stop offset="100%" stopColor="#E6F4F1" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Cloud 2: Multi-lobed Sunset Cloud - Top Right */}
      <div
        className="absolute -top-2 right-1 sm:right-6 pointer-events-none z-10"
        style={{
          animation: 'cloudFloat2 11s ease-in-out infinite',
          transform: `translate(${mouseTilt.x * 0.6}px, ${mouseTilt.y * 0.4}px)`
        }}
      >
        <svg width="140" height="75" viewBox="0 0 140 75" fill="none" className="drop-shadow-sm opacity-90">
          <path
            d="M25 56H115C124 56 131 49 131 40C131 32 124 25 115 25C112 15 103 8 92 8C80 8 71 16 68 25C63 23 58 24 53 28C47 22 38 22 31 28C23 30 17 37 17 45C17 52 23 56 30 56"
            fill="url(#cloud-peach-grad)"
          />
          <path
            d="M40 56C50 53 65 52 80 52C95 52 110 54 118 56"
            stroke="#BADFDB"
            strokeWidth="1.5"
            strokeOpacity="0.8"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="cloud-peach-grad" x1="70" y1="8" x2="70" y2="56" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="60%" stopColor="#FFF9F7" />
              <stop offset="100%" stopColor="#FFEAEA" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Cloud 3: Low Altitude Wisp - Mid Left */}
      <div
        className="hidden sm:block absolute top-24 -left-4 pointer-events-none z-10 opacity-75"
        style={{
          animation: 'cloudFloat3 13s ease-in-out infinite',
          transform: `translate(${mouseTilt.x * -0.2}px, ${mouseTilt.y * -0.2}px)`
        }}
      >
        <svg width="95" height="48" viewBox="0 0 95 48" fill="none" className="drop-shadow-2xs">
          <path
            d="M18 38H80C86 38 91 33 91 27C91 21 86 16 80 16C78 9 71 5 63 5C54 5 47 11 45 17C42 16 38 17 35 19C30 15 23 16 19 20C13 22 9 27 9 32C9 37 14 38 18 38Z"
            fill="white"
            fillOpacity="0.85"
          />
        </svg>
      </div>

      {/* Cloud 4: Low Altitude Drift - Mid Right */}
      <div
        className="hidden sm:block absolute top-24 -right-2 pointer-events-none z-10 opacity-75"
        style={{
          animation: 'cloudFloat4 10s ease-in-out infinite',
          transform: `translate(${mouseTilt.x * 0.3}px, ${mouseTilt.y * 0.3}px)`
        }}
      >
        <svg width="90" height="45" viewBox="0 0 90 45" fill="none" className="drop-shadow-2xs">
          <path
            d="M15 36H75C81 36 86 31 86 25C86 19 81 14 75 14C73 8 66 4 58 4C50 4 43 10 41 16C38 15 34 16 31 18C26 14 20 15 16 19C11 21 7 26 7 31C7 35 11 36 15 36Z"
            fill="white"
            fillOpacity="0.85"
          />
        </svg>
      </div>

      {/* Cloud 5: Bottom Center Mist (Soft ground cloud) */}
      <div
        className="hidden md:block absolute -bottom-3 left-1/4 pointer-events-none z-10 opacity-60"
        style={{
          animation: 'cloudFloat5 14s ease-in-out infinite'
        }}
      >
        <svg width="120" height="40" viewBox="0 0 120 40" fill="none">
          <path
            d="M10 32H110C116 32 120 28 120 22C120 16 115 12 109 12C106 6 100 2 92 2C84 2 77 7 74 13C71 11 67 12 64 14C59 10 52 11 48 15C42 16 38 21 38 26C38 31 34 32 28 32C22 32 17 28 17 23C17 20 15 18 12 18C6 18 2 22 2 28C2 31 6 32 10 32Z"
            fill="white"
            fillOpacity="0.75"
          />
        </svg>
      </div>

      {/* 5. Airplane Layer - BEHIND text */}
      <div
        ref={airplaneBackRef}
        className="absolute left-1/2 top-1/2 pointer-events-none -z-10 hidden items-center justify-center will-change-transform"
      >
        <HighFidelityJet isFront={false} />
      </div>

      {/* 6. Center Hero Content (Headline + Tagline) - Clean Z-index */}
      <div className="relative z-10 mx-auto">
        {children}
      </div>

      {/* 7. Airplane Layer - IN FRONT of text */}
      <div
        ref={airplaneFrontRef}
        className="absolute left-1/2 top-1/2 pointer-events-none z-20 hidden items-center justify-center will-change-transform"
      >
        <HighFidelityJet isFront={true} />
      </div>

      {/* Inline styles for organic cloud floating keyframes */}
      <style jsx>{`
        @keyframes cloudFloat1 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-7px) translateX(6px); }
        }
        @keyframes cloudFloat2 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-9px) translateX(-8px); }
        }
        @keyframes cloudFloat3 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-5px) translateX(4px); }
        }
        @keyframes cloudFloat4 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-6px) translateX(-5px); }
        }
        @keyframes cloudFloat5 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-4px) translateX(7px); }
        }
      `}</style>
    </div>
  );
}

// High-Fidelity 3D Jetliner with Dual Jet Contrail
function HighFidelityJet({ isFront }: { isFront: boolean }) {
  return (
    <div className="relative flex items-center justify-center">
      {/* Jet Exhaust Ribbon (Luminous Twin Contrails) */}
      <div
        className="absolute top-8 -left-2 w-1 h-16 rounded-full pointer-events-none"
        style={{
          background: isFront
            ? 'linear-gradient(to bottom, rgba(255, 164, 164, 0.95), rgba(186, 223, 219, 0.6), transparent)'
            : 'linear-gradient(to bottom, rgba(186, 223, 219, 0.4), transparent)',
          filter: 'blur(0.8px)'
        }}
      />
      <div
        className="absolute top-8 left-2 w-1 h-16 rounded-full pointer-events-none"
        style={{
          background: isFront
            ? 'linear-gradient(to bottom, rgba(255, 164, 164, 0.95), rgba(186, 223, 219, 0.6), transparent)'
            : 'linear-gradient(to bottom, rgba(186, 223, 219, 0.4), transparent)',
          filter: 'blur(0.8px)'
        }}
      />

      {/* Vector Supersonic Jet */}
      <svg
        width="42"
        height="42"
        viewBox="0 0 42 42"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={isFront ? 'drop-shadow-lg' : 'drop-shadow-2xs'}
      >
        <defs>
          <linearGradient id="jet-wing" x1="0" y1="0" x2="42" y2="42" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#FCF9EA" />
            <stop offset="100%" stopColor="#FFA4A4" />
          </linearGradient>
          <linearGradient id="jet-body" x1="21" y1="2" x2="21" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="40%" stopColor="#E6F4F1" />
            <stop offset="75%" stopColor="#BADFDB" />
            <stop offset="100%" stopColor="#1D6B63" />
          </linearGradient>
        </defs>

        {/* Delta Wings */}
        <path
          d="M21 12L39 27L30 28L21 21L12 28L3 27L21 12Z"
          fill="url(#jet-wing)"
          stroke="#1A232B"
          strokeWidth="0.8"
          strokeLinejoin="round"
        />

        {/* Twin Jet Engines under Wings */}
        <rect x="14" y="22" width="3" height="7" rx="1.5" fill="#1D6B63" stroke="#1A232B" strokeWidth="0.5" />
        <rect x="25" y="22" width="3" height="7" rx="1.5" fill="#1D6B63" stroke="#1A232B" strokeWidth="0.5" />
        <circle cx="15.5" cy="29" r="1" fill="#FFA4A4" />
        <circle cx="26.5" cy="29" r="1" fill="#FFA4A4" />

        {/* Twin Tail Stabilizers */}
        <path
          d="M21 26L28 36L24.5 37L21 31L17.5 37L14 36L21 26Z"
          fill="#FFA4A4"
          stroke="#1A232B"
          strokeWidth="0.6"
          strokeLinejoin="round"
        />

        {/* Aerodynamic Fuselage Needle */}
        <path
          d="M21 2C19.5 6 18.5 15 18.5 34C18.5 36.5 19.5 38 21 38C22.5 38 23.5 36.5 23.5 34C23.5 15 22.5 6 21 2Z"
          fill="url(#jet-body)"
          stroke="#1A232B"
          strokeWidth="0.9"
        />

        {/* Tinted Cockpit Glass */}
        <ellipse cx="21" cy="9" rx="1.5" ry="3" fill="#1A232B" />

        {/* Cabin Window Portholes */}
        <circle cx="21" cy="15" r="0.6" fill="#1D6B63" />
        <circle cx="21" cy="18" r="0.6" fill="#1D6B63" />
        <circle cx="21" cy="21" r="0.6" fill="#1D6B63" />
        <circle cx="21" cy="24" r="0.6" fill="#1D6B63" />

        {/* Wingtip Navigation Lights */}
        <circle cx="38.5" cy="27" r="1.3" fill="#22C55E" />
        <circle cx="3.5" cy="27" r="1.3" fill="#EF4444" />
      </svg>
    </div>
  );
}
