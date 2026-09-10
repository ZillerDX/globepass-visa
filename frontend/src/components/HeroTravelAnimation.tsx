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

      // Precise pivot at airplane center (23px, 21px)
      const transformValue = `translate(calc(-23px + ${planeX}px), calc(-21px + ${planeY}px)) scale(${scale}) rotate(${headingDeg}deg) rotateZ(${bankDeg * 0.3}deg)`;

      // Direct DOM transformation for silky-smooth 60fps without React re-renders
      if (isFront) {
        if (airplaneFrontRef.current) {
          airplaneFrontRef.current.style.transform = transformValue;
          airplaneFrontRef.current.style.opacity = `${opacity}`;
          airplaneFrontRef.current.style.display = 'flex';
        }
        if (airplaneBackRef.current) {
          airplaneBackRef.current.style.display = 'none';
        }
      } else {
        if (airplaneBackRef.current) {
          airplaneBackRef.current.style.transform = transformValue;
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
          <path
            d="M30 52H105C115 52 122 45 122 36C122 27.5 115 21 106 20.5C103.5 12 95 6 85 6C73 6 63 15 62 26C58 24 53 24 48 27C39 27 32 33 32 42C24 42 18 47 18 52Z"
            fill="url(#cloud-white-grad)"
          />
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
        style={{ transformOrigin: '23px 21px' }}
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
        style={{ transformOrigin: '23px 21px' }}
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

// High-Fidelity 3D Jetliner with Perfectly Symmetrical Dual Wing Jet Streams
function HighFidelityJet({ isFront }: { isFront: boolean }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 46, height: 110 }}>
      <svg
        width="46"
        height="110"
        viewBox="0 0 46 110"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={isFront ? 'drop-shadow-lg' : 'drop-shadow-2xs'}
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* Symmetrical Twin Jet Contrail Gradients */}
          <linearGradient id="jet-stream-left" x1="16" y1="31" x2="16" y2="105" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFA4A4" stopOpacity={isFront ? "0.95" : "0.55"} />
            <stop offset="15%" stopColor="#FFBDBD" stopOpacity={isFront ? "0.85" : "0.45"} />
            <stop offset="45%" stopColor="#BADFDB" stopOpacity={isFront ? "0.55" : "0.3"} />
            <stop offset="100%" stopColor="#BADFDB" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="jet-stream-right" x1="30" y1="31" x2="30" y2="105" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFA4A4" stopOpacity={isFront ? "0.95" : "0.55"} />
            <stop offset="15%" stopColor="#FFBDBD" stopOpacity={isFront ? "0.85" : "0.45"} />
            <stop offset="45%" stopColor="#BADFDB" stopOpacity={isFront ? "0.55" : "0.3"} />
            <stop offset="100%" stopColor="#BADFDB" stopOpacity="0" />
          </linearGradient>

          {/* Aircraft Materials */}
          <linearGradient id="jet-wing" x1="3" y1="13" x2="43" y2="33" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#FCF9EA" />
            <stop offset="100%" stopColor="#FFA4A4" />
          </linearGradient>
          <linearGradient id="jet-body" x1="23" y1="3" x2="23" y2="39" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="40%" stopColor="#E6F4F1" />
            <stop offset="75%" stopColor="#BADFDB" />
            <stop offset="100%" stopColor="#1D6B63" />
          </linearGradient>
          <filter id="jet-stream-blur" x="-30%" y="-10%" width="160%" height="130%">
            <feGaussianBlur stdDeviation="1.2" />
          </filter>
        </defs>

        {/* --- JET ENGINE EXHAUST STREAMS (Symmetrical on both wings) --- */}
        <g filter="url(#jet-stream-blur)">
          {/* Left Wing Engine Stream (Center X = 16) */}
          <path
            d="M 14.5 31 Q 13 65 11 105 Q 16 105 17.5 31 Z"
            fill="url(#jet-stream-left)"
          />
          {/* Right Wing Engine Stream (Center X = 30) */}
          <path
            d="M 28.5 31 Q 30 65 35 105 Q 33 105 31.5 31 Z"
            fill="url(#jet-stream-right)"
          />
        </g>

        {/* Dual Afterburner Flame Cores */}
        <circle cx="16" cy="32" r="2.2" fill="#FFA4A4" opacity={isFront ? "0.95" : "0.6"} />
        <circle cx="16" cy="31" r="1.3" fill="#FFFFFF" />
        <circle cx="30" cy="32" r="2.2" fill="#FFA4A4" opacity={isFront ? "0.95" : "0.6"} />
        <circle cx="30" cy="31" r="1.3" fill="#FFFFFF" />

        {/* --- AIRFRAME --- */}
        {/* Swept Delta Wings */}
        <path
          d="M23 13L43 28L33 29L23 22L13 29L3 28L23 13Z"
          fill="url(#jet-wing)"
          stroke="#1A232B"
          strokeWidth="0.8"
          strokeLinejoin="round"
        />

        {/* Left Engine Pod (Nacelle) */}
        <rect x="14" y="22" width="4" height="9" rx="2" fill="#1D6B63" stroke="#1A232B" strokeWidth="0.6" />
        
        {/* Right Engine Pod (Nacelle) */}
        <rect x="28" y="22" width="4" height="9" rx="2" fill="#1D6B63" stroke="#1A232B" strokeWidth="0.6" />

        {/* Twin Tail Stabilizers */}
        <path
          d="M23 27L30 37L26.5 38L23 32L19.5 38L16 37L23 27Z"
          fill="#FFA4A4"
          stroke="#1A232B"
          strokeWidth="0.6"
          strokeLinejoin="round"
        />

        {/* Fuselage Needle */}
        <path
          d="M23 3C21.5 7 20.5 16 20.5 35C20.5 37.5 21.5 39 23 39C24.5 39 25.5 37.5 25.5 35C25.5 16 24.5 7 23 3Z"
          fill="url(#jet-body)"
          stroke="#1A232B"
          strokeWidth="0.9"
        />

        {/* Cockpit Canopy */}
        <ellipse cx="23" cy="9.5" rx="1.5" ry="3" fill="#1A232B" />

        {/* Cabin Portholes */}
        <circle cx="23" cy="16" r="0.6" fill="#1D6B63" />
        <circle cx="23" cy="19" r="0.6" fill="#1D6B63" />
        <circle cx="23" cy="22" r="0.6" fill="#1D6B63" />
        <circle cx="23" cy="25" r="0.6" fill="#1D6B63" />

        {/* Wingtip Navigation Beacons */}
        <circle cx="42.5" cy="28" r="1.3" fill="#22C55E" />
        <circle cx="3.5" cy="28" r="1.3" fill="#EF4444" />
      </svg>
    </div>
  );
}
