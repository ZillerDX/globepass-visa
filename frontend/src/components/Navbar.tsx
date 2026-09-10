'use client';

import React from 'react';
import { BrandLogo } from './BrandLogo';
import { Language } from '@/lib/i18n';

interface NavbarProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
}

export function Navbar({ lang, onLanguageChange }: NavbarProps) {


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
