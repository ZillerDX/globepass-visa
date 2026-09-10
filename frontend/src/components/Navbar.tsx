'use client';

import React from 'react';
import { Activity } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { Language, i18n } from '@/lib/i18n';

interface NavbarProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  backendOnline: boolean;
}

export function Navbar({ lang, onLanguageChange, backendOnline }: NavbarProps) {
  const t = i18n[lang];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[rgba(26,35,43,0.07)] bg-[#FCF9EA]/90 backdrop-blur-md transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Group */}
        <div className="flex items-center gap-3">
          <BrandLogo size={36} />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-[#1A232B] tracking-tight text-xl leading-none">
                GlobePass
              </span>
              <span className="px-2 py-0.5 text-[9px] font-bold tracking-[0.16em] uppercase rounded-full bg-[#BADFDB]/50 text-[#1D6B63] border border-[#BADFDB]">
                CONSULAR INTEL
              </span>
            </div>
            <p className="text-[11px] text-[#4A5866] hidden sm:block leading-tight mt-0.5 font-medium">
              Global Visa Protocols and Entry Intelligence
            </p>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {/* Backend Status Indicator */}
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium border border-[#BADFDB] bg-white/80 text-[#1D6B63] shadow-xs">
            <span className="relative flex size-2">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  backendOnline ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
              />
              <span
                className={`relative inline-flex rounded-full size-2 ${
                  backendOnline ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              />
            </span>
            <Activity className="size-3.5 text-[#1D6B63] shrink-0" />
            <span className="tabular text-[11px] font-semibold">
              {backendOnline ? t.backendConnected : t.backendOffline}
            </span>
          </div>

          {/* Bilingual Switcher (TH / EN) */}
          <div className="flex items-center p-0.5 rounded-2xl border border-[#BADFDB]/70 bg-white/70 shadow-inner">
            <button
              type="button"
              onClick={() => onLanguageChange('th')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95 ${
                lang === 'th'
                  ? 'bg-[#FFA4A4] text-white shadow-xs'
                  : 'text-[#4A5866] hover:text-[#1A232B]'
              }`}
            >
              ไทย
            </button>
            <button
              type="button"
              onClick={() => onLanguageChange('en')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95 ${
                lang === 'en'
                  ? 'bg-[#FFA4A4] text-white shadow-xs'
                  : 'text-[#4A5866] hover:text-[#1A232B]'
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
