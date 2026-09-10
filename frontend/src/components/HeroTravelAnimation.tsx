'use client';

import React, { useEffect, useState, useRef } from 'react';

interface HeroTravelAnimationProps {
  children: React.ReactNode;
}

export function HeroTravelAnimation({ children }: HeroTravelAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [orbitAngle, setOrbitAngle] = useState(0);
  const [containerWidth, setContainerWidth] = useState(800);

  // Resize observer to ensure responsive orbit bounds
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

  // Smooth continuous 3D orbital flight path (1 full revolution every ~14s)
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const animate = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;
      setOrbitAngle((prev) => (prev + delta * 26) % 360);
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Subtle 3D perspective mouse tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 14;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -14;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  // Orbital Math: Ellipse adapted to container width
  const isMobile = containerWidth < 640;
  const isTablet = containerWidth < 1024;
  
  // Radius bounds: tightly hugging the headline text without window overflow
  const rx = isMobile ? Math.min(containerWidth * 0.44, 180) : isTablet ? 300 : 380;
  const ry = isMobile ? 55 : 85;
  const tilt = -0.16; // -9.2 degrees tilt

  const rad = (orbitAngle * Math.PI) / 180;
  const rawX = Math.cos(rad) * rx;
  const rawY = Math.sin(rad) * ry;

  // Apply 2D tilt rotation matrix
  const planeX = rawX * Math.cos(tilt) - rawY * Math.sin(tilt);
  const planeY = rawX * Math.sin(tilt) + rawY * Math.cos(tilt);

  // Z-depth: sin(rad) > 0 is in front of text, <= 0 is behind text
  const isFront = Math.sin(rad) > 0;
  const zDepth = Math.sin(rad); // -1 to +1

  // Dynamic 3D perspective scaling & opacity
  const planeScale = isMobile
    ? 0.75 + 0.25 * ((zDepth + 1) / 2)
    : 0.85 + 0.35 * ((zDepth + 1) / 2);
  const planeOpacity = 0.5 + 0.5 * ((zDepth + 1) / 2);

  // Tangent angle along trajectory
  const dx = -Math.sin(rad) * rx * Math.cos(tilt) - Math.cos(rad) * ry * Math.sin(tilt);
  const dy = -Math.sin(rad) * rx * Math.sin(tilt) + Math.cos(rad) * ry * Math.cos(tilt);
  const headingDeg = (Math.atan2(dy, dx) * 180) / Math.PI + 90;

  // Bank angle: aircraft tilts inward during the turn
  const bankDeg = Math.sin(rad) * 18;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full py-4 transition-transform duration-300 ease-out select-none overflow-visible"
      style={{
        perspective: '1200px',
        transform: `rotateY(${mousePos.x * 0.3}deg) rotateX(${mousePos.y * 0.3}deg)`
      }}
    >
      {/* 1. Ambient 3D Globe with Atmospheric Aura */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none -z-10 opacity-30 sm:opacity-40"
        style={{
          width: isMobile ? '280px' : '440px',
          height: isMobile ? '180px' : '260px',
          transform: `translate(-50%, -50%) rotate(${mousePos.x * 0.2}deg)`
        }}
      >
        {/* Soft Radial Planetary Atmosphere */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#BADFDB]/45 via-[#FFBDBD]/30 to-[#FFA4A4]/40 blur-3xl" />

        {/* 3D Wireframe Globe with Meridian Lines */}
        <svg
          viewBox="0 0 240 240"
          className="w-44 sm:w-56 h-44 sm:h-56 mx-auto opacity-75 animate-[spin_50s_linear_infinite]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer Atmosphere Horizon */}
          <circle cx="120" cy="120" r="100" stroke="#BADFDB" strokeWidth="1.5" strokeDasharray="3 3" />
          
          {/* Parallels of Latitude */}
          <ellipse cx="120" cy="120" rx="98" ry="38" stroke="#BADFDB" strokeWidth="1" strokeDasharray="3 4" />
          <ellipse cx="120" cy="120" rx="98" ry="72" stroke="#BADFDB" strokeWidth="1" strokeDasharray="3 4" />
          
          {/* Meridians of Longitude */}
          <ellipse cx="120" cy="120" rx="38" ry="98" stroke="#FFA4A4" strokeWidth="1" opacity="0.6" />
          <ellipse cx="120" cy="120" rx="72" ry="98" stroke="#BADFDB" strokeWidth="1" opacity="0.5" />
          <line x1="20" y1="120" x2="220" y2="120" stroke="#BADFDB" strokeWidth="1.5" opacity="0.7" />
          <line x1="120" y1="20" x2="120" y2="220" stroke="#FFA4A4" strokeWidth="1.5" opacity="0.6" />

          {/* Golden/Coral Consular Hub Beacons */}
          <circle cx="120" cy="78" r="3.5" fill="#1D6B63" />
          <circle cx="152" cy="132" r="3" fill="#FFA4A4" />
          <circle cx="82" cy="142" r="2.5" fill="#1D6B63" />
          <circle cx="168" cy="98" r="2.5" fill="#FFA4A4" />
        </svg>
      </div>

      {/* 2. Orbit Flight Path (Dashed Elliptical Vector Track) */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center -z-10">
        <svg
          className="w-full max-w-4xl h-56 overflow-visible opacity-50"
          viewBox="-400 -120 800 240"
        >
          <defs>
            <linearGradient id="orbit-grad" x1="-380" y1="0" x2="380" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#BADFDB" stopOpacity="0.1" />
              <stop offset="25%" stopColor="#BADFDB" stopOpacity="0.75" />
              <stop offset="50%" stopColor="#FFA4A4" stopOpacity="0.85" />
              <stop offset="75%" stopColor="#BADFDB" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#BADFDB" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <g transform="rotate(-9)">
            <ellipse
              cx="0"
              cy="0"
              rx={rx}
              ry={ry}
              fill="none"
              stroke="url(#orbit-grad)"
              strokeWidth="1.5"
              strokeDasharray="4 6"
            />
          </g>
        </svg>
      </div>

      {/* 3. Floating Soft Clouds (Left & Right Flanks) */}
      {/* Cloud 1 - Top Left */}
      <div
        className="absolute -top-3 left-1 sm:left-6 pointer-events-none z-10 transition-transform duration-700 opacity-90"
        style={{
          transform: `translate(${mousePos.x * -0.4}px, ${Math.sin(orbitAngle * 0.04) * 6}px)`
        }}
      >
        <svg width="100" height="55" viewBox="0 0 110 60" fill="none" className="drop-shadow-xs">
          <path
            d="M25 45H85C93 45 99 39 99 31C99 23.5 93.5 17.5 86 17C84 10 77 5 68 5C57.5 5 49 13 48.5 23C45 21 40 21 36 24C28 24 22 30 22 38C15 38 10 42 10 47"
            fill="white"
            fillOpacity="0.9"
          />
          <path
            d="M30 45C30 40 35 36 40 36C42 36 44 37 46 38C48 30 55 24 63 24C71 24 77 29 79 36C83 36 86 39 86 43"
            stroke="#BADFDB"
            strokeWidth="1.2"
            strokeOpacity="0.7"
          />
        </svg>
      </div>

      {/* Cloud 2 - Top Right */}
      <div
        className="absolute -top-1 right-1 sm:right-8 pointer-events-none z-10 transition-transform duration-700 opacity-85"
        style={{
          transform: `translate(${mousePos.x * 0.5}px, ${Math.cos(orbitAngle * 0.035) * 7}px)`
        }}
      >
        <svg width="115" height="60" viewBox="0 0 125 65" fill="none" className="drop-shadow-xs">
          <path
            d="M20 48H100C108 48 114 42 114 34C114 26 108 20 100 20C98 12 90 6 80 6C70 6 62 12 59 20C55 19 50 20 46 23C41 18 33 18 27 23C20 25 15 31 15 38C15 44 20 48 26 48"
            fill="white"
            fillOpacity="0.88"
          />
          <path
            d="M35 48C35 42 41 38 47 38C50 38 53 39 55 41C57 32 65 26 75 26C84 26 91 32 93 40C97 40 101 43 101 48"
            stroke="#FFBDBD"
            strokeWidth="1.2"
            strokeOpacity="0.7"
          />
        </svg>
      </div>

      {/* Cloud 3 - Floating Mid Left */}
      <div
        className="hidden md:block absolute bottom-0 left-12 pointer-events-none z-10 transition-transform duration-700 opacity-70"
        style={{
          transform: `translate(${mousePos.x * -0.2}px, ${Math.sin(orbitAngle * 0.03 + 2) * 5}px)`
        }}
      >
        <svg width="80" height="40" viewBox="0 0 85 42" fill="none">
          <path
            d="M15 35H70C76 35 81 30 81 24C81 18 76 13 70 13C68 7 62 3 55 3C47 3 41 8 39 14C36 13 32 14 29 16C25 12 18 13 14 17C9 19 5 24 5 29C5 34 9 35 15 35Z"
            fill="white"
            fillOpacity="0.8"
          />
        </svg>
      </div>

      {/* 4. Airplane Layer - BEHIND text (when isFront === false) */}
      {!isFront && (
        <div
          className="absolute left-1/2 top-1/2 pointer-events-none -z-10 transition-transform"
          style={{
            transform: `translate(calc(-50% + ${planeX}px), calc(-50% + ${planeY}px)) scale(${planeScale})`,
            opacity: planeOpacity,
            filter: 'blur(0.5px)'
          }}
        >
          <OrbitAirplane headingDeg={headingDeg} bankDeg={bankDeg} isFront={false} />
        </div>
      )}

      {/* 5. Center Core Children (Hero Title + Tagline) */}
      <div className="relative z-10 mx-auto">
        {children}
      </div>

      {/* 6. Airplane Layer - IN FRONT of text (when isFront === true) */}
      {isFront && (
        <div
          className="absolute left-1/2 top-1/2 pointer-events-none z-20 transition-transform"
          style={{
            transform: `translate(calc(-50% + ${planeX}px), calc(-50% + ${planeY}px)) scale(${planeScale})`,
            opacity: planeOpacity
          }}
        >
          <OrbitAirplane headingDeg={headingDeg} bankDeg={bankDeg} isFront={true} />
        </div>
      )}
    </div>
  );
}

// Bespoke 3D Supersonic Airplane Vector with Contrail & Bank Tilt
function OrbitAirplane({
  headingDeg,
  bankDeg,
  isFront
}: {
  headingDeg: number;
  bankDeg: number;
  isFront: boolean;
}) {
  return (
    <div
      className="relative flex items-center justify-center transition-transform"
      style={{
        transform: `rotate(${headingDeg}deg) rotateZ(${bankDeg * 0.4}deg)`
      }}
    >
      {/* Dynamic Engine Contrail Ribbon */}
      <div
        className="absolute top-7 left-1/2 -translate-x-1/2 w-1.5 h-14 rounded-full pointer-events-none"
        style={{
          background: isFront
            ? 'linear-gradient(to bottom, rgba(255, 164, 164, 0.95), rgba(186, 223, 219, 0.6), transparent)'
            : 'linear-gradient(to bottom, rgba(186, 223, 219, 0.45), transparent)',
          filter: 'blur(0.8px)'
        }}
      />

      {/* Supersonic Passenger Airliner Vector */}
      <svg
        width="38"
        height="38"
        viewBox="0 0 38 38"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={isFront ? 'drop-shadow-md' : 'drop-shadow-2xs'}
      >
        <defs>
          <linearGradient id="plane-wing-grad" x1="0" y1="0" x2="38" y2="38" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#FCF9EA" />
            <stop offset="100%" stopColor="#FFA4A4" />
          </linearGradient>
          <linearGradient id="fuselage-grad" x1="19" y1="2" x2="19" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="45%" stopColor="#BADFDB" />
            <stop offset="100%" stopColor="#1D6B63" />
          </linearGradient>
        </defs>

        {/* Swept Delta Wings */}
        <path
          d="M19 12L36 25L28 26L19 20L10 26L2 25L19 12Z"
          fill="url(#plane-wing-grad)"
          stroke="#1A232B"
          strokeWidth="0.8"
          strokeLinejoin="round"
        />

        {/* Twin Tail Stabilizers */}
        <path
          d="M19 24L26 33L23 34L19 29L15 34L12 33L19 24Z"
          fill="#FFA4A4"
          stroke="#1A232B"
          strokeWidth="0.6"
        />

        {/* Sleek Aerodynamic Fuselage */}
        <path
          d="M19 2C17.6 6 16.8 14 16.8 31C16.8 33 17.8 34.5 19 34.5C20.2 34.5 21.2 33 21.2 31C21.2 14 20.4 6 19 2Z"
          fill="url(#fuselage-grad)"
          stroke="#1A232B"
          strokeWidth="0.9"
        />

        {/* Cockpit Canopy */}
        <ellipse cx="19" cy="8.5" rx="1.4" ry="2.8" fill="#1A232B" />

        {/* Navigation Wingtip Lights */}
        <circle cx="35.5" cy="25" r="1.2" fill="#FFA4A4" />
        <circle cx="2.5" cy="25" r="1.2" fill="#1D6B63" />
      </svg>
    </div>
  );
}
