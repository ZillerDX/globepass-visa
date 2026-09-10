'use client';

import React, { useState } from 'react';
import { Language } from '@/lib/i18n';

interface WorldCitySkylineProps {
  lang?: Language;
}

export function WorldCitySkyline({ lang = 'th' }: WorldCitySkylineProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative w-full sm:w-[420px] h-[92px] rounded-2xl bg-gradient-to-b from-white/90 via-[#BADFDB]/20 to-[#FCF9EA]/50 border border-[#BADFDB]/80 p-1.5 shadow-xs overflow-hidden transition-all duration-300 hover:shadow-md hover:border-[#FFA4A4]/80 select-none"
      title={lang === 'th' ? 'สถาปัตยกรรมมหานครระดับโลก (โตเกียว, ลอนดอน, สิงคโปร์, นิวยอร์ก, กรุงเทพฯ, ปารีส)' : 'World Architectural Landmarks (Tokyo, London, Singapore, New York, Bangkok, Paris)'}
    >
      {/* Sky Backdrop & Atmospheric Ambient Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#BADFDB]/20 via-[#FFBDBD]/15 to-[#FFA4A4]/15 pointer-events-none" />

      {/* Embedded CSS for Spring Popup Keyframes & Ambient Motion */}
      <style jsx>{`
        @keyframes cityPopSpring {
          0% {
            transform: translateY(110%) scaleY(0.3);
            opacity: 0;
          }
          65% {
            transform: translateY(-7px) scaleY(1.06);
            opacity: 1;
          }
          85% {
            transform: translateY(2px) scaleY(0.98);
          }
          100% {
            transform: translateY(0) scaleY(1);
            opacity: 1;
          }
        }

        @keyframes treePopSpring {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          70% {
            transform: scale(1.22);
            opacity: 1;
          }
          90% {
            transform: scale(0.95);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes cloudDriftSlow {
          0% {
            transform: translateX(-40px);
          }
          100% {
            transform: translateX(450px);
          }
        }

        @keyframes cloudDriftFast {
          0% {
            transform: translateX(-60px);
          }
          100% {
            transform: translateX(460px);
          }
        }

        @keyframes miniJetFlight {
          0% {
            transform: translate(-30px, 26px) rotate(-6deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          85% {
            opacity: 1;
          }
          100% {
            transform: translate(450px, -15px) rotate(-6deg);
            opacity: 0;
          }
        }

        @keyframes sunPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.85;
          }
          50% {
            transform: scale(1.1);
            opacity: 1;
          }
        }

        @keyframes treeGentleSway {
          0%, 100% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(2.5deg);
          }
        }

        @keyframes windowTwinkle {
          0%, 100% {
            opacity: 0.8;
          }
          50% {
            opacity: 1;
            fill: #FFA4A4;
          }
        }

        .pop-japan {
          animation: cityPopSpring 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.05s backwards;
          transform-origin: bottom center;
        }

        .pop-uk {
          animation: cityPopSpring 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.18s backwards;
          transform-origin: bottom center;
        }

        .pop-singapore {
          animation: cityPopSpring 0.85s cubic-bezier(0.34, 1.56, 0.64, 1) 0.32s backwards;
          transform-origin: bottom center;
        }

        .pop-us {
          animation: cityPopSpring 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.45s backwards;
          transform-origin: bottom center;
        }

        .pop-thai {
          animation: cityPopSpring 0.85s cubic-bezier(0.34, 1.56, 0.64, 1) 0.58s backwards;
          transform-origin: bottom center;
        }

        .pop-paris {
          animation: cityPopSpring 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.72s backwards;
          transform-origin: bottom center;
        }

        .pop-tree-1 {
          animation: treePopSpring 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.85s backwards;
          transform-origin: 22px 86px;
        }

        .pop-tree-2 {
          animation: treePopSpring 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.95s backwards;
          transform-origin: 118px 86px;
        }

        .pop-tree-3 {
          animation: treePopSpring 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 1.05s backwards;
          transform-origin: 338px 86px;
        }

        .pop-tree-4 {
          animation: treePopSpring 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 1.15s backwards;
          transform-origin: 418px 86px;
        }

        .cloud-slow {
          animation: cloudDriftSlow 24s linear infinite;
        }

        .cloud-fast {
          animation: cloudDriftFast 17s linear infinite 3s;
        }

        .jet-flight {
          animation: miniJetFlight 12s linear infinite 1.5s;
        }

        .sun-aura {
          animation: sunPulse 6s ease-in-out infinite;
          transform-origin: 388px 22px;
        }

        .tree-sway-node {
          animation: treeGentleSway 4s ease-in-out infinite;
          transform-origin: bottom center;
        }

        .window-sparkle {
          animation: windowTwinkle 3s ease-in-out infinite alternate;
        }
      `}</style>

      {/* Master Vector City Canvas */}
      <svg
        viewBox="0 0 440 92"
        className="w-full h-full block"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="92" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#BADFDB" stopOpacity="0.25" />
            <stop offset="55%" stopColor="#FFBDBD" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#FCF9EA" stopOpacity="0.05" />
          </linearGradient>

          <linearGradient id="sunGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFA4A4" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#FFBDBD" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#BADFDB" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="glassTowerGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#BADFDB" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#BADFDB" stopOpacity="0.75" />
          </linearGradient>

          <linearGradient id="thaiSpireGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFA4A4" />
            <stop offset="40%" stopColor="#FFBDBD" />
            <stop offset="100%" stopColor="#1D6B63" />
          </linearGradient>

          <linearGradient id="mbsGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1D6B63" />
            <stop offset="60%" stopColor="#254336" />
            <stop offset="100%" stopColor="#1A232B" />
          </linearGradient>

          <linearGradient id="nyGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2C3A47" />
            <stop offset="50%" stopColor="#435565" />
            <stop offset="100%" stopColor="#1A232B" />
          </linearGradient>

          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Sky Atmosphere & Sun */}
        <rect width="440" height="92" fill="url(#skyGrad)" />
        <g className="sun-aura">
          <circle cx="388" cy="22" r="14" fill="url(#sunGrad)" />
          <circle cx="388" cy="22" r="7" fill="#FFA4A4" fillOpacity="0.85" />
          {/* Subtle sun rays */}
          <line x1="388" y1="4" x2="388" y2="7" stroke="#FFA4A4" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="388" y1="37" x2="388" y2="40" stroke="#FFA4A4" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="370" y1="22" x2="373" y2="22" stroke="#FFA4A4" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="403" y1="22" x2="406" y2="22" stroke="#FFA4A4" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* 2. Drifting Soft Clouds */}
        <g className="cloud-slow" opacity="0.75">
          <path
            d="M 20 18 Q 23 12, 30 14 Q 37 10, 44 14 Q 50 13, 53 18 Q 57 20, 54 24 Q 48 27, 24 27 Q 16 25, 20 18 Z"
            fill="white"
            fillOpacity="0.8"
          />
        </g>
        <g className="cloud-fast" opacity="0.65">
          <path
            d="M 170 26 Q 174 20, 182 22 Q 188 18, 195 21 Q 200 20, 204 25 Q 207 27, 203 30 Q 196 32, 175 32 Q 166 31, 170 26 Z"
            fill="#BADFDB"
            fillOpacity="0.45"
          />
        </g>

        {/* 3. Mini Supersonic Jet Climbing across the sky */}
        <g className="jet-flight">
          {/* Contrail trails */}
          <line x1="-24" y1="1" x2="0" y2="0" stroke="#BADFDB" strokeWidth="1.2" strokeOpacity="0.7" strokeDasharray="3 2" />
          <line x1="-20" y1="2" x2="0" y2="1.5" stroke="#FFA4A4" strokeWidth="1" strokeOpacity="0.8" />
          {/* Miniature Airplane */}
          <path d="M 0 0 L 10 -2 L 13 -1 L 8 2 L 6 7 L 4 7 L 5 2 L -2 1.5 L -4 4 L -5 4 L -4 1 L -5 0 Z" fill="#1D6B63" />
        </g>

        {/* ========================================================
            4. ARCHITECTURAL BUILDINGS (Popup Animated Layer)
            ======================================================== */}

        {/* LANDMARK 1: JAPAN - 5-TIER PAGODA (x: 30-68) */}
        <g className="pop-japan">
          {/* Pagoda Foundation */}
          <rect x="34" y="74" width="28" height="12" rx="1.5" fill="#1A232B" />
          {/* Tier 1 */}
          <rect x="38" y="66" width="20" height="8" fill="#2C3A47" />
          <path d="M 28 66 Q 48 69, 68 66 L 66 63 Q 48 65, 30 63 Z" fill="#FFA4A4" />
          {/* Tier 2 */}
          <rect x="40" y="56" width="16" height="8" fill="#2C3A47" />
          <path d="M 31 56 Q 48 59, 65 56 L 63 53 Q 48 55, 33 53 Z" fill="#FFBDBD" />
          {/* Tier 3 */}
          <rect x="42" y="46" width="12" height="8" fill="#2C3A47" />
          <path d="M 34 46 Q 48 49, 62 46 L 60 43 Q 48 45, 36 43 Z" fill="#FFA4A4" />
          {/* Tier 4 */}
          <rect x="44" y="37" width="8" height="7" fill="#2C3A47" />
          <path d="M 37 37 Q 48 40, 59 37 L 57 34 Q 48 36, 39 34 Z" fill="#FFBDBD" />
          {/* Tier 5 Roof */}
          <path d="M 40 28 Q 48 31, 56 28 L 54 25 Q 48 27, 42 25 Z" fill="#FFA4A4" />
          {/* Sorin / Bronze Spire */}
          <line x1="48" y1="25" x2="48" y2="12" stroke="#1D6B63" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="48" cy="12" r="1.5" fill="#FFA4A4" />
          {/* Tiny Pagoda Windows / Lattice */}
          <rect x="46" y="68" width="4" height="4" fill="#FCF9EA" fillOpacity="0.8" />
          <rect x="46" y="58" width="4" height="4" fill="#FCF9EA" fillOpacity="0.8" />
        </g>

        {/* JAPAN SAKURA TREE (x: 14-32) */}
        <g className="pop-tree-1 tree-sway-node">
          {/* Tree Trunk */}
          <path d="M 22 86 Q 24 76, 21 70 Q 20 66, 22 62" stroke="#5A3825" strokeWidth="2.5" strokeLinecap="round" />
          {/* Sakura Blossom Clouds */}
          <circle cx="16" cy="62" r="7" fill="#FFA4A4" fillOpacity="0.9" />
          <circle cx="26" cy="58" r="8" fill="#FFBDBD" fillOpacity="0.95" />
          <circle cx="20" cy="52" r="6.5" fill="#FFA4A4" fillOpacity="0.85" />
          <circle cx="23" cy="57" r="2.5" fill="#FFFFFF" fillOpacity="0.9" />
        </g>

        {/* LANDMARK 2: LONDON / UK - ELIZABETH TOWER & BIG BEN (x: 75-110) */}
        <g className="pop-uk">
          {/* Tower Base & Shaft */}
          <rect x="80" y="44" width="22" height="42" fill="#1D6B63" />
          {/* Neo-Gothic Stone Ribs */}
          <line x1="84" y1="46" x2="84" y2="86" stroke="#BADFDB" strokeWidth="1" strokeOpacity="0.6" />
          <line x1="91" y1="46" x2="91" y2="86" stroke="#BADFDB" strokeWidth="1" strokeOpacity="0.6" />
          <line x1="98" y1="46" x2="98" y2="86" stroke="#BADFDB" strokeWidth="1" strokeOpacity="0.6" />
          {/* Clock Chamber */}
          <rect x="78" y="30" width="26" height="14" rx="1" fill="#144A44" stroke="#BADFDB" strokeWidth="1" />
          {/* Clock Face with Golden Rim */}
          <circle cx="91" cy="37" r="5" fill="#FCF9EA" stroke="#BADFDB" strokeWidth="1.2" />
          {/* Clock Hands at 10:10 */}
          <line x1="91" y1="37" x2="89" y2="34" stroke="#1A232B" strokeWidth="1" strokeLinecap="round" />
          <line x1="91" y1="37" x2="94" y2="35" stroke="#1A232B" strokeWidth="1" strokeLinecap="round" />
          {/* Gothic Spire Pyramid */}
          <polygon points="79,30 103,30 91,10" fill="#1A232B" />
          <line x1="91" y1="10" x2="91" y2="5" stroke="#FFA4A4" strokeWidth="1.5" strokeLinecap="round" />
          {/* Corner Pinnacles */}
          <polygon points="77,30 80,30 78.5,24" fill="#BADFDB" />
          <polygon points="102,30 105,30 103.5,24" fill="#BADFDB" />
        </g>

        {/* MEDITERRANEAN / ENGLISH CYPRESS TREE (x: 110-125) */}
        <g className="pop-tree-2 tree-sway-node">
          <rect x="117" y="74" width="2" height="12" fill="#5A3825" />
          <ellipse cx="118" cy="67" rx="6" ry="12" fill="#1D6B63" />
          <ellipse cx="118" cy="65" rx="4" ry="8" fill="#BADFDB" fillOpacity="0.6" />
        </g>

        {/* LANDMARK 3: SINGAPORE - MARINA BAY SANDS & SKYPARK (x: 130-205) */}
        <g className="pop-singapore">
          {/* Tower 1 (Canted Inward Left) */}
          <path d="M 136 86 L 140 34 L 151 34 L 147 86 Z" fill="url(#mbsGrad)" />
          {/* Tower 2 (Center Vertical) */}
          <rect x="156" y="34" width="13" height="52" fill="url(#mbsGrad)" />
          {/* Tower 3 (Canted Inward Right) */}
          <path d="M 178 86 L 174 34 L 185 34 L 189 86 Z" fill="url(#mbsGrad)" />

          {/* Window Glass Bands (Futuristic Shimmer) */}
          <g opacity="0.65" stroke="#BADFDB" strokeWidth="0.8">
            <line x1="139" y1="44" x2="149" y2="44" />
            <line x1="138" y1="56" x2="148" y2="56" />
            <line x1="137" y1="68" x2="147" y2="68" />
            <line x1="157" y1="44" x2="168" y2="44" />
            <line x1="157" y1="56" x2="168" y2="56" />
            <line x1="157" y1="68" x2="168" y2="68" />
            <line x1="175" y1="44" x2="185" y2="44" />
            <line x1="176" y1="56" x2="186" y2="56" />
            <line x1="177" y1="68" x2="187" y2="68" />
          </g>

          {/* The Iconic SkyPark Boat Cantilever Roof */}
          <path
            d="M 126 31 Q 163 26, 198 32 L 196 36 Q 163 32, 132 36 Z"
            fill="#BADFDB"
            stroke="#1D6B63"
            strokeWidth="1"
          />
          {/* Infinity Pool Rim */}
          <line x1="133" y1="31" x2="188" y2="29" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
          {/* Observation Cantilever Tip */}
          <path d="M 126 31 Q 123 33, 129 34 Z" fill="#FFA4A4" />
          {/* Tiny SkyPark Palm Trees */}
          <circle cx="145" cy="27" r="2" fill="#1D6B63" />
          <circle cx="162" cy="26" r="2.2" fill="#1D6B63" />
          <circle cx="178" cy="27" r="2" fill="#1D6B63" />
        </g>

        {/* LANDMARK 4: UNITED STATES - ART DECO SKYSCRAPER (x: 215-265) */}
        <g className="pop-us">
          {/* Base Tier */}
          <rect x="222" y="66" width="36" height="20" fill="url(#nyGrad)" />
          {/* Tier 2 (Setback) */}
          <rect x="228" y="46" width="24" height="20" fill="url(#nyGrad)" />
          {/* Tier 3 (Upper Setback) */}
          <rect x="233" y="28" width="14" height="18" fill="url(#nyGrad)" />
          {/* Needle Spire / Mast */}
          <polygon points="237,28 243,28 240,10" fill="#BADFDB" />
          <line x1="240" y1="10" x2="240" y2="4" stroke="#FFA4A4" strokeWidth="1.5" strokeLinecap="round" />
          {/* Red Aircraft Warning Beacon Light */}
          <circle cx="240" cy="4" r="1.5" fill="#FFA4A4" className="window-sparkle" />

          {/* Lit Windows Pattern (New York City Skyline at Dusk) */}
          <g fill="#FCF9EA" opacity="0.85" className="window-sparkle">
            <rect x="226" y="70" width="3" height="4" rx="0.5" />
            <rect x="232" y="70" width="3" height="4" rx="0.5" />
            <rect x="238" y="70" width="3" height="4" rx="0.5" />
            <rect x="244" y="70" width="3" height="4" rx="0.5" />
            <rect x="250" y="70" width="3" height="4" rx="0.5" />
            <rect x="231" y="50" width="3" height="3" rx="0.5" />
            <rect x="238" y="50" width="3" height="3" rx="0.5" />
            <rect x="245" y="50" width="3" height="3" rx="0.5" />
            <rect x="236" y="32" width="2.5" height="2.5" rx="0.5" />
            <rect x="241" y="32" width="2.5" height="2.5" rx="0.5" />
          </g>
        </g>

        {/* LANDMARK 5: THAILAND - WAT PHRA KAEW PRASAT / TEMPLE SPIRE (x: 275-330) */}
        <g className="pop-thai">
          {/* Marble Platform */}
          <rect x="282" y="76" width="44" height="10" rx="1" fill="#FCF9EA" stroke="#BADFDB" strokeWidth="1" />
          {/* Temple Hall Columns */}
          <rect x="287" y="64" width="34" height="12" fill="#1A232B" />
          <line x1="292" y1="64" x2="292" y2="76" stroke="#FFA4A4" strokeWidth="1.2" />
          <line x1="304" y1="64" x2="304" y2="76" stroke="#FFA4A4" strokeWidth="1.2" />
          <line x1="316" y1="64" x2="316" y2="76" stroke="#FFA4A4" strokeWidth="1.2" />

          {/* Lower Tier Roof with Chofa Curves */}
          <path d="M 276 64 Q 304 60, 332 64 L 328 60 Q 304 57, 280 60 Z" fill="#1D6B63" />
          {/* Middle Tier Roof */}
          <path d="M 283 54 Q 304 50, 325 54 L 321 50 Q 304 47, 287 50 Z" fill="#FFA4A4" />
          {/* Upper Tier Roof */}
          <path d="M 290 44 Q 304 41, 318 44 L 315 40 Q 304 38, 293 40 Z" fill="#1D6B63" />

          {/* Golden Prasat Mondop Spire */}
          <polygon points="298,40 310,40 304,14" fill="url(#thaiSpireGrad)" />
          {/* Traditional Tiered Spire Rings & Tip */}
          <line x1="300" y1="34" x2="308" y2="34" stroke="#FCF9EA" strokeWidth="1" />
          <line x1="301" y1="28" x2="307" y2="28" stroke="#FCF9EA" strokeWidth="1" />
          <line x1="302" y1="22" x2="306" y2="22" stroke="#FCF9EA" strokeWidth="1" />
          <circle cx="304" cy="12" r="1.8" fill="#FFA4A4" />
        </g>

        {/* TROPICAL THAI PALM TREE (x: 334-348) */}
        <g className="pop-tree-3 tree-sway-node">
          {/* Slender Curved Trunk */}
          <path d="M 338 86 Q 343 74, 340 64" stroke="#5A3825" strokeWidth="2" strokeLinecap="round" />
          {/* Palm Fronds */}
          <path d="M 340 64 Q 330 60, 326 66" stroke="#1D6B63" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M 340 64 Q 334 54, 333 50" stroke="#BADFDB" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M 340 64 Q 345 52, 348 50" stroke="#1D6B63" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M 340 64 Q 352 58, 354 65" stroke="#BADFDB" strokeWidth="1.8" strokeLinecap="round" />
        </g>

        {/* LANDMARK 6: PARIS / EUROPE - EIFFEL TOWER & MODERN GLASS TOWER (x: 350-420) */}
        <g className="pop-paris">
          {/* Modern Curvilinear Glass High-Rise */}
          <path d="M 354 86 L 354 40 Q 366 32, 376 44 L 376 86 Z" fill="url(#glassTowerGrad)" stroke="#BADFDB" strokeWidth="1" />
          <line x1="365" y1="36" x2="365" y2="86" stroke="#1D6B63" strokeWidth="0.8" strokeOpacity="0.4" />
          <line x1="354" y1="52" x2="376" y2="52" stroke="#1D6B63" strokeWidth="0.8" strokeOpacity="0.3" />
          <line x1="354" y1="68" x2="376" y2="68" stroke="#1D6B63" strokeWidth="0.8" strokeOpacity="0.3" />

          {/* Eiffel Tower Iron Lattice Silhouette */}
          {/* Base Arch Legs */}
          <path d="M 388 86 Q 401 64, 414 86" stroke="#1A232B" strokeWidth="2.5" fill="none" />
          <line x1="387" y1="86" x2="397" y2="64" stroke="#1A232B" strokeWidth="2" />
          <line x1="415" y1="86" x2="405" y2="64" stroke="#1A232B" strokeWidth="2" />
          {/* First Platform */}
          <rect x="393" y="62" width="16" height="3" fill="#1A232B" />
          {/* Second Platform */}
          <rect x="396" y="48" width="10" height="2.5" fill="#1A232B" />
          {/* Spire Section to Dome */}
          <polygon points="398,48 404,48 401.5,20" fill="#1A232B" />
          {/* Summit Beacon */}
          <line x1="401" y1="20" x2="401" y2="15" stroke="#FFA4A4" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="401" cy="15" r="1.5" fill="#FFA4A4" className="window-sparkle" />
        </g>

        {/* BOULEVARD GREEN TREE (x: 418-435) */}
        <g className="pop-tree-4 tree-sway-node">
          <rect x="426" y="76" width="2" height="10" fill="#5A3825" />
          <circle cx="427" cy="70" r="7" fill="#1D6B63" />
          <circle cx="429" cy="67" r="4.5" fill="#BADFDB" fillOpacity="0.75" />
        </g>

        {/* ========================================================
            5. GROUND BOULEVARD & PROMENADE (Bottom 6px)
            ======================================================== */}
        <rect x="0" y="86" width="440" height="6" fill="#1A232B" />
        {/* Pavement Curb Line */}
        <line x1="0" y1="86" x2="440" y2="86" stroke="#BADFDB" strokeWidth="1.5" />
        <line x1="0" y1="89" x2="440" y2="89" stroke="#FFA4A4" strokeWidth="0.7" strokeDasharray="6 4" strokeOpacity="0.6" />
      </svg>

      {/* Floating Micro-Badge on Hover: Quiet domain authenticity */}
      <div className={`absolute bottom-2.5 right-3 px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-md border border-[#BADFDB] shadow-xs text-[9px] font-bold text-[#1D6B63] transition-all duration-300 pointer-events-none flex items-center gap-1 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-80 translate-y-0.5'}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-[#1D6B63] animate-ping" />
        <span>{lang === 'th' ? 'มหานครยอดนิยมระดับโลก' : 'GLOBAL DESTINATIONS'}</span>
      </div>
    </div>
  );
}
