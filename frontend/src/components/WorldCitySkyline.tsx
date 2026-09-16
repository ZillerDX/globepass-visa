'use client';

import React from 'react';
import { Language } from '@/lib/i18n';

interface WorldCitySkylineProps {
  lang?: Language;
}

export function WorldCitySkyline({ lang = 'th' }: WorldCitySkylineProps) {
  return (
    <div
      className="group relative w-full sm:w-[490px] h-[105px] overflow-visible select-none pointer-events-auto transition-transform duration-300 hover:scale-[1.01]"
      title={lang === 'th' ? 'สถาปัตยกรรมแลนด์มาร์กระดับโลกหลากหลายระดับ (โตเกียว, ลอนดอน, สิงคโปร์, นิวยอร์ก, กรุงเทพฯ, ปารีส)' : 'World Architectural Landmarks (Tokyo, London, Singapore, New York, Bangkok, Paris)'}
    >
      {/* Embedded CSS for Spring Popups, Staggered Elevations & Ambient Drift */}
      <style jsx>{`
        @keyframes cityPopTier1 {
          0% {
            transform: translateY(120%) scaleY(0.2);
            opacity: 0;
          }
          60% {
            transform: translateY(-8px) scaleY(1.08);
            opacity: 1;
          }
          82% {
            transform: translateY(2px) scaleY(0.98);
          }
          100% {
            transform: translateY(0) scaleY(1);
            opacity: 1;
          }
        }

        @keyframes cityPopTier2 {
          0% {
            transform: translateY(110%) scaleY(0.3);
            opacity: 0;
          }
          65% {
            transform: translateY(-6px) scaleY(1.05);
            opacity: 1;
          }
          85% {
            transform: translateY(2px) scaleY(0.99);
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
            transform: scale(1.25);
            opacity: 1;
          }
          90% {
            transform: scale(0.94);
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
            transform: translateX(520px);
          }
        }

        @keyframes cloudDriftFast {
          0% {
            transform: translateX(-60px);
          }
          100% {
            transform: translateX(530px);
          }
        }

        @keyframes miniJetFlight {
          0% {
            transform: translate(-30px, 32px) rotate(-7deg);
            opacity: 0;
          }
          8% {
            opacity: 1;
          }
          88% {
            opacity: 1;
          }
          100% {
            transform: translate(520px, -15px) rotate(-7deg);
            opacity: 0;
          }
        }

        @keyframes petalDrift1 {
          0% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 0;
          }
          20% {
            opacity: 0.85;
          }
          80% {
            opacity: 0.85;
          }
          100% {
            transform: translate(75px, 32px) rotate(260deg);
            opacity: 0;
          }
        }

        @keyframes petalDrift2 {
          0% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 0;
          }
          25% {
            opacity: 0.9;
          }
          75% {
            opacity: 0.9;
          }
          100% {
            transform: translate(95px, 40px) rotate(380deg);
            opacity: 0;
          }
        }

        @keyframes treeGentleSway {
          0%, 100% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(2.8deg);
          }
        }

        @keyframes beaconPulse {
          0%, 100% {
            opacity: 0.4;
            transform: scale(0.85);
          }
          50% {
            opacity: 1;
            transform: scale(1.25);
          }
        }

        @keyframes windowTwinkle {
          0%, 100% {
            opacity: 0.75;
          }
          50% {
            opacity: 1;
            fill: #FFA4A4;
          }
        }

        /* Staggered Popups with varied elevations */
        .pop-fuji {
          animation: cityPopTier2 0.75s cubic-bezier(0.34, 1.56, 0.64, 1) 0.05s backwards;
          transform-origin: bottom center;
        }

        .pop-pagoda {
          animation: cityPopTier1 0.82s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s backwards;
          transform-origin: 58px 76px;
        }

        .pop-torii {
          animation: cityPopTier1 0.65s cubic-bezier(0.34, 1.56, 0.64, 1) 0.28s backwards;
          transform-origin: 26px 94px;
        }

        .pop-bigben {
          animation: cityPopTier1 0.82s cubic-bezier(0.34, 1.56, 0.64, 1) 0.22s backwards;
          transform-origin: 128px 84px;
        }

        .pop-mbs {
          animation: cityPopTier2 0.85s cubic-bezier(0.34, 1.56, 0.64, 1) 0.38s backwards;
          transform-origin: 194px 92px;
        }

        .pop-skyscraper {
          animation: cityPopTier1 0.88s cubic-bezier(0.34, 1.56, 0.64, 1) 0.48s backwards;
          transform-origin: 262px 98px;
        }

        .pop-thai {
          animation: cityPopTier2 0.85s cubic-bezier(0.34, 1.56, 0.64, 1) 0.60s backwards;
          transform-origin: 320px 84px;
        }

        .pop-paris {
          animation: cityPopTier1 0.82s cubic-bezier(0.34, 1.56, 0.64, 1) 0.72s backwards;
          transform-origin: 426px 88px;
        }

        .pop-tree-sakura {
          animation: treePopSpring 0.65s cubic-bezier(0.34, 1.56, 0.64, 1) 0.85s backwards;
          transform-origin: 92px 90px;
        }

        .pop-tree-cypress {
          animation: treePopSpring 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.95s backwards;
          transform-origin: 148px 88px;
        }

        .pop-tree-palm {
          animation: treePopSpring 0.65s cubic-bezier(0.34, 1.56, 0.64, 1) 1.05s backwards;
          transform-origin: 356px 88px;
        }

        .pop-tree-boulevard {
          animation: treePopSpring 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 1.15s backwards;
          transform-origin: 462px 94px;
        }

        .cloud-slow {
          animation: cloudDriftSlow 28s linear infinite;
        }

        .cloud-fast {
          animation: cloudDriftFast 20s linear infinite 4s;
        }

        .jet-flight {
          animation: miniJetFlight 14s linear infinite 2s;
        }

        .petal-drift-1 {
          animation: petalDrift1 5.5s ease-in-out infinite 1s;
        }

        .petal-drift-2 {
          animation: petalDrift2 6.5s ease-in-out infinite 3.5s;
        }

        .tree-sway-node {
          animation: treeGentleSway 4.5s ease-in-out infinite;
          transform-origin: bottom center;
        }

        .beacon-light {
          animation: beaconPulse 1.8s ease-in-out infinite;
          transform-origin: center;
        }

        .window-sparkle {
          animation: windowTwinkle 3.2s ease-in-out infinite alternate;
        }
      `}</style>

      {/* Pure Vector SVG Canvas without rectangular card box */}
      <svg
        viewBox="0 0 490 105"
        className="w-full h-full overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="sunAuraGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFA4A4" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#FFBDBD" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#BADFDB" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="fujiGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="35%" stopColor="#BADFDB" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#BADFDB" stopOpacity="0.15" />
          </linearGradient>

          <linearGradient id="mbsGrad2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1D6B63" />
            <stop offset="65%" stopColor="#254336" />
            <stop offset="100%" stopColor="#1A232B" />
          </linearGradient>

          <linearGradient id="nyGrad2" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2C3A47" />
            <stop offset="50%" stopColor="#435565" />
            <stop offset="100%" stopColor="#1A232B" />
          </linearGradient>

          <linearGradient id="thaiSpireGrad2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFA4A4" />
            <stop offset="45%" stopColor="#FFBDBD" />
            <stop offset="100%" stopColor="#1D6B63" />
          </linearGradient>

          <linearGradient id="glassTowerGrad2" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#BADFDB" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#BADFDB" stopOpacity="0.75" />
          </linearGradient>
        </defs>

        {/* 1. Open Atmosphere: Soft Sun & Drifting Clouds (Zero hard borders) */}
        <g opacity="0.85">
          <circle cx="410" cy="18" r="14" fill="url(#sunAuraGrad)" />
          <circle cx="410" cy="18" r="6" fill="#FFA4A4" fillOpacity="0.75" />
        </g>

        {/* Soft Drifting Clouds across open canvas */}
        <g className="cloud-slow" opacity="0.7">
          <path
            d="M 10 14 Q 14 8, 22 10 Q 28 6, 36 10 Q 42 9, 45 14 Q 49 16, 46 20 Q 40 23, 14 23 Q 6 21, 10 14 Z"
            fill="white"
            fillOpacity="0.85"
          />
        </g>
        <g className="cloud-fast" opacity="0.6">
          <path
            d="M 190 20 Q 194 14, 202 16 Q 208 12, 215 15 Q 220 14, 224 19 Q 227 21, 223 24 Q 216 26, 195 26 Q 186 25, 190 20 Z"
            fill="#BADFDB"
            fillOpacity="0.5"
          />
        </g>

        {/* High Altitude Supersonic Jet */}
        <g className="jet-flight">
          <line x1="-24" y1="1" x2="0" y2="0" stroke="#BADFDB" strokeWidth="1.2" strokeOpacity="0.7" strokeDasharray="3 2" />
          <line x1="-20" y1="2" x2="0" y2="1.5" stroke="#FFA4A4" strokeWidth="1" strokeOpacity="0.8" />
          <path d="M 0 0 L 10 -2 L 13 -1 L 8 2 L 6 7 L 4 7 L 5 2 L -2 1.5 L -4 4 L -5 4 L -4 1 L -5 0 Z" fill="#1D6B63" />
        </g>

        {/* =========================================================================
            2. LAYER 1 (DEEP BACKGROUND - High Elevation & Distant Horizons)
            ========================================================================= */}
        {/* Distant Mount Fuji Silhouette (Behind Japan) */}
        <g className="pop-fuji">
          <polygon points="25,78 60,42 95,78" fill="url(#fujiGrad)" />
          {/* Snow Cap */}
          <polygon points="52,52 60,42 68,52 64,55 60,53 56,55" fill="white" fillOpacity="0.95" />
        </g>

        {/* Distant modern communication spire (Behind Singapore/UK) */}
        <g opacity="0.45" stroke="#BADFDB" strokeWidth="1">
          <line x1="165" y1="78" x2="165" y2="18" />
          <line x1="161" y1="35" x2="169" y2="35" />
          <circle cx="165" cy="18" r="1.5" fill="#BADFDB" />
        </g>

        {/* =========================================================================
            3. LAYER 2 (MIDGROUND - Staggered Elevated Terraces)
            ========================================================================= */}

        {/* LANDMARK 1: JAPAN - 5-TIER PAGODA ON ELEVATED HILLOCK (Baseline y=76) */}
        <g className="pop-pagoda">
          {/* Elevated Stone Plinth */}
          <rect x="44" y="66" width="28" height="10" rx="1.5" fill="#1A232B" />
          {/* Tier 1 */}
          <rect x="48" y="58" width="20" height="8" fill="#2C3A47" />
          <path d="M 38 58 Q 58 61, 78 58 L 76 55 Q 58 57, 40 55 Z" fill="#FFA4A4" />
          {/* Tier 2 */}
          <rect x="50" y="48" width="16" height="8" fill="#2C3A47" />
          <path d="M 41 48 Q 58 51, 75 48 L 73 45 Q 58 47, 43 45 Z" fill="#FFBDBD" />
          {/* Tier 3 */}
          <rect x="52" y="39" width="12" height="8" fill="#2C3A47" />
          <path d="M 44 39 Q 58 42, 72 39 L 70 36 Q 58 38, 46 36 Z" fill="#FFA4A4" />
          {/* Tier 4 */}
          <rect x="54" y="31" width="8" height="7" fill="#2C3A47" />
          <path d="M 47 31 Q 58 34, 69 31 L 67 28 Q 58 30, 49 28 Z" fill="#FFBDBD" />
          {/* Tier 5 Roof */}
          <path d="M 50 22 Q 58 25, 66 22 L 64 19 Q 58 21, 52 19 Z" fill="#FFA4A4" />
          {/* Sorin Spire */}
          <line x1="58" y1="19" x2="58" y2="7" stroke="#1D6B63" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="58" cy="7" r="1.5" fill="#FFA4A4" />
          {/* Little glowing windows */}
          <rect x="56" y="60" width="4" height="4" fill="#FCF9EA" fillOpacity="0.85" />
          <rect x="56" y="50" width="4" height="4" fill="#FCF9EA" fillOpacity="0.85" />
        </g>

        {/* LANDMARK 2: UK / LONDON - ELIZABETH TOWER & BIG BEN (Baseline y=84) */}
        <g className="pop-bigben">
          {/* Tower Shaft */}
          <rect x="118" y="42" width="22" height="42" fill="#1D6B63" />
          <line x1="122" y1="44" x2="122" y2="84" stroke="#BADFDB" strokeWidth="0.8" strokeOpacity="0.6" />
          <line x1="129" y1="44" x2="129" y2="84" stroke="#BADFDB" strokeWidth="0.8" strokeOpacity="0.6" />
          <line x1="136" y1="44" x2="136" y2="84" stroke="#BADFDB" strokeWidth="0.8" strokeOpacity="0.6" />
          {/* Clock Chamber */}
          <rect x="116" y="28" width="26" height="14" rx="1" fill="#144A44" stroke="#BADFDB" strokeWidth="1" />
          {/* Golden Clock Face */}
          <circle cx="129" cy="35" r="5" fill="#FCF9EA" stroke="#BADFDB" strokeWidth="1.2" />
          <line x1="129" y1="35" x2="127" y2="32" stroke="#1A232B" strokeWidth="1" strokeLinecap="round" />
          <line x1="129" y1="35" x2="132" y2="33" stroke="#1A232B" strokeWidth="1" strokeLinecap="round" />
          {/* Gothic Spire */}
          <polygon points="117,28 141,28 129,9" fill="#1A232B" />
          <line x1="129" y1="9" x2="129" y2="4" stroke="#FFA4A4" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* Cypress Tree beside Big Ben */}
        <g className="pop-tree-cypress tree-sway-node">
          <rect x="147" y="74" width="2" height="14" fill="#5A3825" />
          <ellipse cx="148" cy="66" rx="5.5" ry="12" fill="#1D6B63" />
          <ellipse cx="148" cy="64" rx="3.5" ry="8" fill="#BADFDB" fillOpacity="0.55" />
        </g>

        {/* LANDMARK 3: SINGAPORE - MARINA BAY SANDS (Baseline y=92 - Lower Waterfront) */}
        <g className="pop-mbs">
          <path d="M 174 92 L 178 38 L 189 38 L 185 92 Z" fill="url(#mbsGrad2)" />
          <rect x="194" y="38" width="13" height="54" fill="url(#mbsGrad2)" />
          <path d="M 216 92 L 212 38 L 223 38 L 227 92 Z" fill="url(#mbsGrad2)" />
          {/* Shimmering glass bands */}
          <g opacity="0.6" stroke="#BADFDB" strokeWidth="0.8">
            <line x1="177" y1="48" x2="187" y2="48" />
            <line x1="176" y1="62" x2="186" y2="62" />
            <line x1="175" y1="76" x2="185" y2="76" />
            <line x1="195" y1="48" x2="206" y2="48" />
            <line x1="195" y1="62" x2="206" y2="62" />
            <line x1="195" y1="76" x2="206" y2="76" />
            <line x1="213" y1="48" x2="223" y2="48" />
            <line x1="214" y1="62" x2="224" y2="62" />
            <line x1="215" y1="76" x2="225" y2="76" />
          </g>
          {/* Cantilever SkyPark Deck */}
          <path d="M 164 35 Q 201 30, 236 36 L 234 40 Q 201 36, 170 40 Z" fill="#BADFDB" stroke="#1D6B63" strokeWidth="1" />
          <line x1="171" y1="35" x2="226" y2="33" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M 164 35 Q 161 37, 167 38 Z" fill="#FFA4A4" />
          {/* Rooftop palm dots */}
          <circle cx="183" cy="31" r="1.8" fill="#1D6B63" />
          <circle cx="200" cy="30" r="2" fill="#1D6B63" />
          <circle cx="216" cy="31" r="1.8" fill="#1D6B63" />
        </g>

        {/* LANDMARK 5: THAILAND - WAT PHRA KAEW PRASAT (Baseline y=84) */}
        <g className="pop-thai">
          {/* Base Hall on Elevated Terrace */}
          <rect x="296" y="70" width="40" height="14" rx="1" fill="#1A232B" />
          <line x1="302" y1="70" x2="302" y2="84" stroke="#FFA4A4" strokeWidth="1.2" />
          <line x1="316" y1="70" x2="316" y2="84" stroke="#FFA4A4" strokeWidth="1.2" />
          <line x1="330" y1="70" x2="330" y2="84" stroke="#FFA4A4" strokeWidth="1.2" />
          {/* Multi-tier Roofs */}
          <path d="M 290 70 Q 316 66, 342 70 L 338 66 Q 316 63, 294 66 Z" fill="#1D6B63" />
          <path d="M 296 60 Q 316 56, 336 60 L 332 56 Q 316 53, 300 56 Z" fill="#FFA4A4" />
          <path d="M 302 50 Q 316 47, 330 50 L 327 46 Q 316 44, 305 46 Z" fill="#1D6B63" />
          {/* Golden Mondop Spire */}
          <polygon points="310,46 322,46 316,16" fill="url(#thaiSpireGrad2)" />
          <line x1="312" y1="38" x2="320" y2="38" stroke="#FCF9EA" strokeWidth="1" />
          <line x1="313" y1="32" x2="319" y2="32" stroke="#FCF9EA" strokeWidth="1" />
          <line x1="314" y1="24" x2="318" y2="24" stroke="#FCF9EA" strokeWidth="1" />
          <circle cx="316" cy="14" r="1.8" fill="#FFA4A4" />
        </g>

        {/* Tropical Palm Tree beside Temple */}
        <g className="pop-tree-palm tree-sway-node">
          <path d="M 356 88 Q 361 76, 358 66" stroke="#5A3825" strokeWidth="2" strokeLinecap="round" />
          <path d="M 358 66 Q 348 62, 344 68" stroke="#1D6B63" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M 358 66 Q 352 56, 351 52" stroke="#BADFDB" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M 358 66 Q 363 54, 366 52" stroke="#1D6B63" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M 358 66 Q 370 60, 372 67" stroke="#BADFDB" strokeWidth="1.8" strokeLinecap="round" />
        </g>

        {/* LANDMARK 6: PARIS / EUROPE - EIFFEL TOWER & MODERN GLASS HIGH-RISE (Baseline y=88) */}
        <g className="pop-paris">
          {/* Curved Glass High-Rise (Midground) */}
          <path d="M 382 88 L 382 42 Q 394 34, 404 46 L 404 88 Z" fill="url(#glassTowerGrad2)" stroke="#BADFDB" strokeWidth="1" />
          <line x1="393" y1="38" x2="393" y2="88" stroke="#1D6B63" strokeWidth="0.8" strokeOpacity="0.4" />
          <line x1="382" y1="54" x2="404" y2="54" stroke="#1D6B63" strokeWidth="0.8" strokeOpacity="0.3" />
          <line x1="382" y1="70" x2="404" y2="70" stroke="#1D6B63" strokeWidth="0.8" strokeOpacity="0.3" />

          {/* Eiffel Tower Iron Lattice */}
          <path d="M 416 88 Q 429 66, 442 88" stroke="#1A232B" strokeWidth="2.5" fill="none" />
          <line x1="415" y1="88" x2="425" y2="66" stroke="#1A232B" strokeWidth="2" />
          <line x1="443" y1="88" x2="433" y2="66" stroke="#1A232B" strokeWidth="2" />
          <rect x="421" y="64" width="16" height="3" fill="#1A232B" />
          <rect x="424" y="50" width="10" height="2.5" fill="#1A232B" />
          <polygon points="426,50 432,50 429.5,20" fill="#1A232B" />
          <line x1="429.5" y1="20" x2="429.5" y2="15" stroke="#FFA4A4" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="429.5" cy="15" r="1.5" fill="#FFA4A4" className="beacon-light" />
        </g>

        {/* Boulevard Tree on Far Right */}
        <g className="pop-tree-boulevard tree-sway-node">
          <rect x="461" y="78" width="2" height="16" fill="#5A3825" />
          <circle cx="462" cy="72" r="7" fill="#1D6B63" />
          <circle cx="464" cy="69" r="4.5" fill="#BADFDB" fillOpacity="0.75" />
        </g>

        {/* =========================================================================
            4. LAYER 3 (FOREGROUND - Stepped Lowest Baseline & Overlapping Front)
            ========================================================================= */}

        {/* JAPANESE VERMILION TORII GATE (Foreground Left, Baseline y=94) */}
        <g className="pop-torii">
          {/* Main Pillars */}
          <line x1="22" y1="78" x2="22" y2="94" stroke="#FFA4A4" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="34" y1="78" x2="34" y2="94" stroke="#FFA4A4" strokeWidth="2.5" strokeLinecap="round" />
          {/* Top Curved Kasagi Lintels */}
          <path d="M 17 76 Q 28 73, 39 76 L 38 73 Q 28 70, 18 73 Z" fill="#FFA4A4" />
          <rect x="20" y="79" width="16" height="2" fill="#1A232B" />
        </g>

        {/* BLOOMING SAKURA CHERRY BLOSSOM TREE (Foreground Left-Center, Baseline y=90) */}
        <g className="pop-tree-sakura tree-sway-node">
          <path d="M 92 90 Q 94 80, 91 74 Q 90 70, 92 64" stroke="#5A3825" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="85" cy="64" r="7.5" fill="#FFA4A4" fillOpacity="0.95" />
          <circle cx="96" cy="60" r="8.5" fill="#FFBDBD" fillOpacity="0.95" />
          <circle cx="90" cy="54" r="7" fill="#FFA4A4" fillOpacity="0.85" />
          <circle cx="93" cy="59" r="3" fill="#FFFFFF" fillOpacity="0.95" />
        </g>

        {/* Drifting Sakura Petals in the Wind */}
        <g className="petal-drift-1">
          <ellipse cx="98" cy="62" rx="1.8" ry="1" fill="#FFA4A4" />
        </g>
        <g className="petal-drift-2">
          <ellipse cx="102" cy="58" rx="1.5" ry="0.9" fill="#FFBDBD" />
        </g>

        {/* LANDMARK 4: UNITED STATES - ART DECO SKYSCRAPER (Foreground Center-Right, Baseline y=98) */}
        <g className="pop-skyscraper">
          {/* Deepest Stepped Foreground Skyscraper */}
          <rect x="248" y="72" width="34" height="26" fill="url(#nyGrad2)" />
          <rect x="253" y="52" width="24" height="20" fill="url(#nyGrad2)" />
          <rect x="258" y="32" width="14" height="20" fill="url(#nyGrad2)" />
          {/* Spire Mast */}
          <polygon points="262,32 268,32 265,12" fill="#BADFDB" />
          <line x1="265" y1="12" x2="265" y2="5" stroke="#FFA4A4" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="265" cy="5" r="1.5" fill="#FFA4A4" className="beacon-light" />

          {/* Glowing Windows at Dusk */}
          <g fill="#FCF9EA" opacity="0.9" className="window-sparkle">
            <rect x="252" y="76" width="3" height="4" rx="0.5" />
            <rect x="258" y="76" width="3" height="4" rx="0.5" />
            <rect x="264" y="76" width="3" height="4" rx="0.5" />
            <rect x="270" y="76" width="3" height="4" rx="0.5" />
            <rect x="276" y="76" width="3" height="4" rx="0.5" />
            <rect x="256" y="56" width="3" height="3" rx="0.5" />
            <rect x="263" y="56" width="3" height="3" rx="0.5" />
            <rect x="270" y="56" width="3" height="3" rx="0.5" />
            <rect x="261" y="36" width="2.5" height="2.5" rx="0.5" />
            <rect x="266" y="36" width="2.5" height="2.5" rx="0.5" />
          </g>
        </g>

        {/* =========================================================================
            5. STEPPED ORGANIC TERRAIN & PROMENADE (Multi-Level Contour Lines)
            ========================================================================= */}
        {/* Tier 1 Ground Path (Background/Midground Hills) */}
        <path
          d="M 0 80 Q 55 76, 110 80 T 160 84 Q 280 84, 340 84 T 490 88"
          stroke="#BADFDB"
          strokeWidth="1.2"
          strokeOpacity="0.45"
          fill="none"
        />

        {/* Main Foreground Waterfront / Boulevard Line with Steps */}
        <path
          d="M 0 94 Q 60 94, 115 88 Q 165 92, 235 92 Q 248 98, 290 98 Q 360 88, 490 94"
          stroke="#1D6B63"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />

        {/* Dashed Transit Waypoint Accents (Subtle and stylish) */}
        <path
          d="M 10 97 Q 120 92, 240 95 Q 360 92, 480 97"
          stroke="#FFA4A4"
          strokeWidth="1"
          strokeDasharray="4 4"
          strokeOpacity="0.75"
          fill="none"
        />
      </svg>
    </div>
  );
}
