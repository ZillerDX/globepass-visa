'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search,
  ArrowLeftRight,
  Sparkles,
  Check,
  ChevronDown,
  Compass,
  PlaneTakeoff,
  PlaneLanding
} from 'lucide-react';
import { Country } from '@/types/visa';
import { Language, i18n } from '@/lib/i18n';
import { CountryFlag } from './CountryFlag';
import { HeroTravelAnimation } from './HeroTravelAnimation';

interface SearchHeroProps {
  countries: Country[];
  fromCountry: string;
  toCountry: string;
  onFromChange: (code: string) => void;
  onToChange: (code: string) => void;
  onSwap: () => void;
  onSubmit: () => void;
  loading: boolean;
  lang: Language;
}

interface CountrySelectProps {
  label: string;
  icon: React.ElementType;
  selectedCode: string;
  countries: Country[];
  onSelect: (code: string) => void;
  placeholder: string;
  searchPlaceholder: string;
  noFoundText: string;
  lang: Language;
}

function CountrySelect({
  label,
  icon: Icon,
  selectedCode,
  countries,
  onSelect,
  placeholder,
  searchPlaceholder,
  noFoundText,
  lang
}: CountrySelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedCountry = useMemo(() => {
    return countries.find((c) => c.code === selectedCode);
  }, [countries, selectedCode]);

  const filteredCountries = useMemo(() => {
    if (!search.trim()) return countries;
    const q = search.toLowerCase().trim();
    return countries.filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        c.name_en.toLowerCase().includes(q) ||
        c.name_th.includes(q)
    );
  }, [countries, search]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative flex-1 min-w-0" ref={wrapperRef}>
      {/* Eyebrow Micro-label: Clean tracking without truncation */}
      <div className="flex items-center gap-1.5 mb-2">
        <Icon className="size-3.5 text-[#1D6B63] shrink-0" />
        <label className="text-[11px] font-bold uppercase tracking-wider text-[#4A5866] whitespace-nowrap">
          {label}
        </label>
      </div>

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full h-14 px-4 flex items-center justify-between rounded-2xl border transition-all duration-200 shadow-2xs ${
          open
            ? 'border-[#FFA4A4] bg-white ring-2 ring-[#FFA4A4]/30'
            : 'border-[#BADFDB]/70 bg-[#FCF9EA]/60 hover:border-[#BADFDB] hover:bg-white hover:shadow-xs'
        }`}
      >
        <div className="flex items-center gap-3 truncate">
          {selectedCountry ? (
            <>
              <CountryFlag code={selectedCountry.code} size="md" />
              <div className="flex items-baseline gap-2 truncate text-left">
                <span className="font-bold text-[#1A232B] text-sm tracking-tight truncate">
                  {lang === 'th' ? selectedCountry.name_th : selectedCountry.name_en}
                </span>
                <span className="text-xs font-mono font-semibold text-[#7D8D9C]">
                  ({selectedCountry.code})
                </span>
              </div>
            </>
          ) : (
            <span className="text-[#7D8D9C] text-sm">{placeholder}</span>
          )}
        </div>
        <ChevronDown
          className={`size-4 text-[#7D8D9C] shrink-0 transition-transform duration-200 ${
            open ? 'rotate-180 text-[#BA3F3F]' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute z-50 left-0 right-0 mt-2 rounded-2xl border border-[rgba(26,35,43,0.1)] bg-white shadow-xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-100">
          {/* Search Box */}
          <div className="p-3 border-b border-[rgba(26,35,43,0.06)] bg-[#FCF9EA]/50">
            <div className="relative flex items-center">
              <Search className="absolute left-3 size-4 text-[#7D8D9C] pointer-events-none shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={searchPlaceholder}
                autoFocus
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#BADFDB]/80 bg-white text-[#1A232B] placeholder:text-[#7D8D9C] focus:outline-none focus:ring-2 focus:ring-[#FFA4A4]"
              />
            </div>
          </div>

          {/* List */}
          <div className="max-h-64 overflow-y-auto p-1.5 space-y-0.5">
            {filteredCountries.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#7D8D9C]">
                {noFoundText}
              </div>
            ) : (
              filteredCountries.map((c) => {
                const isSelected = c.code === selectedCode;
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => {
                      onSelect(c.code);
                      setOpen(false);
                      setSearch('');
                    }}
                    className={`w-full px-3.5 py-2.5 flex items-center justify-between rounded-xl text-left text-xs transition-colors duration-100 ${
                      isSelected
                        ? 'bg-[#BADFDB]/30 text-[#1A232B] border border-[#BADFDB] font-bold'
                        : 'hover:bg-[#FCF9EA] text-[#4A5866] hover:text-[#1A232B]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <CountryFlag code={c.code} size="sm" />
                      <span className="truncate">
                        {lang === 'th' ? c.name_th : c.name_en}
                      </span>
                      <span className="text-[11px] text-[#7D8D9C] font-mono">
                        ({c.code})
                      </span>
                    </div>
                    {isSelected && <Check className="size-4 text-[#1D6B63] shrink-0 ml-2" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function SearchHero({
  countries,
  fromCountry,
  toCountry,
  onFromChange,
  onToChange,
  onSwap,
  onSubmit,
  loading,
  lang
}: SearchHeroProps) {
  const t = i18n[lang];

  const popularDestinations = [
    { code: 'JP', label: lang === 'th' ? 'ญี่ปุ่น' : 'Japan' },
    { code: 'SG', label: lang === 'th' ? 'สิงคโปร์' : 'Singapore' },
    { code: 'CN', label: lang === 'th' ? 'จีน' : 'China' },
    { code: 'KR', label: lang === 'th' ? 'เกาหลีใต้' : 'South Korea' },
    { code: 'US', label: lang === 'th' ? 'สหรัฐฯ' : 'United States' },
    { code: 'GB', label: lang === 'th' ? 'สหราชอาณาจักร' : 'United Kingdom' }
  ];

  return (
    <section className="relative pt-4 pb-2 w-full">
      {/* 3D Animated Hero Scene (Orbiting Airplane, Floating Clouds & 3D Globe) */}
      <HeroTravelAnimation>
        <div className="text-center mb-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[10px] font-bold tracking-[0.24em] uppercase bg-[#BADFDB]/35 text-[#1D6B63] border border-[#BADFDB] mb-3 shadow-2xs backdrop-blur-xs">
            <Compass className="size-3.5 text-[#1D6B63] shrink-0" />
            <span>GLOBAL VISA AND TRAVEL INTELLIGENCE</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-[#1A232B] tracking-tight leading-[1.2]">
            {t.appSubtitle}
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#4A5866] max-w-2xl mx-auto leading-relaxed font-normal">
            {t.tagline}
          </p>
        </div>
      </HeroTravelAnimation>

      {/* Consular Boarding Terminal Card: Continuous 2.5px gradient frame wrapping all 4 edges */}
      <div className="relative w-full rounded-[28px] p-[2.5px] bg-gradient-to-r from-[#BADFDB] via-[#FFA4A4] via-[#FFBDBD] to-[#BADFDB] shadow-xl shadow-[#FFA4A4]/15 transition-all">
        {/* Inner Card Deck */}
        <div className="relative w-full rounded-[25.5px] bg-gradient-to-b from-white via-white to-[#FCF9EA]/40 p-6 sm:p-8">
          {/* Input Bays Row: Completely Symmetrical with Single-Line Button */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-end gap-3.5">
            {/* Origin Bay */}
            <CountrySelect
              label={t.fromLabel}
              icon={PlaneTakeoff}
              selectedCode={fromCountry}
              countries={countries}
              onSelect={onFromChange}
              placeholder={t.selectFromPlaceholder}
              searchPlaceholder={t.searchCountry}
              noFoundText={t.noCountryFound}
              lang={lang}
            />

            {/* Swap Button (Height 56px matching inputs flush) */}
            <div className="flex justify-center lg:pb-0">
              <button
                type="button"
                onClick={onSwap}
                title={t.swapTooltip}
                className="group size-14 rounded-2xl border border-[#BADFDB] bg-[#BADFDB]/25 hover:bg-[#BADFDB]/50 text-[#1A232B] flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 shadow-2xs shrink-0"
              >
                <ArrowLeftRight className="size-4.5 shrink-0 text-[#1D6B63] transition-transform duration-300 group-hover:rotate-180" />
              </button>
            </div>

            {/* Destination Bay */}
            <CountrySelect
              label={t.toLabel}
              icon={PlaneLanding}
              selectedCode={toCountry}
              countries={countries}
              onSelect={onToChange}
              placeholder={t.selectToPlaceholder}
              searchPlaceholder={t.searchCountry}
              noFoundText={t.noCountryFound}
              lang={lang}
            />

            {/* Action CTA Button: Single-line guarantee with whitespace-nowrap and generous min-width */}
            <div className="flex-shrink-0">
              <label className="hidden lg:block text-[10px] font-bold uppercase tracking-wider text-transparent mb-2 select-none">
                Action
              </label>
              <button
                type="button"
                onClick={onSubmit}
                disabled={loading || !fromCountry || !toCountry}
                className="relative overflow-hidden w-full lg:w-auto min-w-[270px] h-14 px-7 rounded-2xl bg-gradient-to-r from-[#FF9292] via-[#FFA4A4] to-[#FF8585] hover:brightness-105 text-white font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-[#FFA4A4]/40 hover:shadow-xl hover:shadow-[#FFA4A4]/50 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none transition-all duration-200 shrink-0"
              >
                {/* Coral shimmer sweep */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full hover:animate-coral-sweep pointer-events-none" />

                <Sparkles className={`size-4.5 shrink-0 ${loading ? 'animate-spin text-white' : ''}`} />
                <span className="whitespace-nowrap tracking-tight">
                  {loading ? t.checkingBtn : t.checkBtn}
                </span>
              </button>
            </div>
          </div>

          {/* Popular Destinations Shortcuts */}
          <div className="mt-6 pt-4 border-t border-[rgba(26,35,43,0.06)] flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-[#7D8D9C] font-medium">{t.popularDestinations}</span>
            <div className="flex items-center gap-2 flex-wrap">
              {popularDestinations.map((p) => {
                const isSelected = toCountry === p.code;
                return (
                  <button
                    key={p.code}
                    type="button"
                    onClick={() => onToChange(p.code)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-all duration-150 active:scale-95 ${
                      isSelected
                        ? 'border-[#FFA4A4] bg-[#FFA4A4]/25 text-[#BA3F3F] font-bold shadow-xs'
                        : 'border-[#BADFDB]/70 bg-[#FCF9EA]/70 hover:border-[#FFA4A4] hover:bg-white hover:-translate-y-0.5 hover:shadow-2xs text-[#4A5866] hover:text-[#1A232B]'
                    }`}
                  >
                    <CountryFlag code={p.code} size="sm" />
                    <span>{p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
