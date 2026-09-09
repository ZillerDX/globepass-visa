'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Navbar } from '@/components/Navbar';
import { SearchHero } from '@/components/SearchHero';
import { DestinationGallery } from '@/components/DestinationGallery';
import { StatusBadge } from '@/components/StatusBadge';
import { SummaryCard } from '@/components/SummaryCard';
import { DocumentChecklist } from '@/components/DocumentChecklist';
import { TimelineSteps } from '@/components/TimelineSteps';
import { OfficialLinkCard } from '@/components/OfficialLinkCard';
import { BottomTabBar } from '@/components/BottomTabBar';
import { Language, i18n } from '@/lib/i18n';
import { Country, VisaGuideResponse } from '@/types/visa';
import { getCountries, fetchVisaGuide } from '@/lib/api';
import { Compass, ClipboardList, Milestone, ShieldCheck, Shield } from 'lucide-react';

export default function Home() {
  const [lang, setLang] = useState<Language>('th');
  const [countries] = useState<Country[]>(getCountries);
  const [fromCountry, setFromCountry] = useState<string>('TH'); // Default Thailand
  const [toCountry, setToCountry] = useState<string>('JP'); // Default Japan
  const [guide, setGuide] = useState<VisaGuideResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [backendOnline, setBackendOnline] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('all');
  const resultsRef = useRef<HTMLDivElement>(null);

  const t = i18n[lang];

  // Check backend health on mount with 3s timeout (does NOT trigger AI)
  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3000);

    fetch('http://localhost:8000/api/health', { signal: controller.signal })
      .then((res) => {
        clearTimeout(timer);
        if (res.ok) setBackendOnline(true);
      })
      .catch(() => {
        clearTimeout(timer);
        setBackendOnline(false);
      });

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, []);

  // ONLY triggered when user clicks "Check Official Requirements" button
  const handleCheck = useCallback(async () => {
    if (!fromCountry || !toCountry || loading) return;
    setLoading(true);

    try {
      const { data } = await fetchVisaGuide(fromCountry, toCountry, lang);
      setGuide(data);

      // Smooth scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    } catch (err) {
      console.error('Failed to fetch visa guide:', err);
    } finally {
      setLoading(false);
    }
  }, [fromCountry, toCountry, lang, loading]);

  // Selecting a gallery destination ONLY updates the input; NEVER triggers AI
  const handleSelectGalleryDestination = (code: string) => {
    setToCountry(code);
    setGuide(null);
  };

  // Selecting language ONLY switches UI labels; NEVER automatically triggers AI
  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
  };

  // Swap Countries: resets results until button is pressed
  const handleSwap = () => {
    const temp = fromCountry;
    setFromCountry(toCountry);
    setToCountry(temp);
    setGuide(null);
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-[#FCF9EA] text-[#1A232B] selection:bg-[#FFA4A4]/30 selection:text-[#BA3F3F] vanilla-pattern overflow-x-hidden">
      {/* Navigation */}
      <Navbar
        lang={lang}
        onLanguageChange={handleLanguageChange}
        backendOnline={backendOnline}
      />

      {/* Main Content Area: Harmonized max-w-5xl container ensuring 100% symmetry */}
      <main className="flex-1 pb-24 sm:pb-16 max-w-5xl mx-auto w-full px-4 sm:px-6">
        {/* Search Hero Terminal */}
        <SearchHero
          countries={countries}
          fromCountry={fromCountry}
          toCountry={toCountry}
          onFromChange={(code) => {
            setFromCountry(code);
            setGuide(null);
          }}
          onToChange={(code) => {
            setToCountry(code);
            setGuide(null);
          }}
          onSwap={handleSwap}
          onSubmit={handleCheck}
          loading={loading}
          lang={lang}
        />

        {/* Curated Destination Gallery with Real Photography (hidden when results are shown) */}
        {!guide && (
          <div className="w-full">
            <DestinationGallery
              onSelect={handleSelectGalleryDestination}
              fromCountry={fromCountry}
              countries={countries}
              lang={lang}
            />
          </div>
        )}

        {/* Results Section: STRICTLY displayed only after pressing the Check button */}
        {guide && (
          <div
            ref={resultsRef}
            className="w-full mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-300"
          >
            {/* Instrument Segmented Facet Filter */}
            <div className="flex items-center justify-between gap-2 p-1.5 rounded-2xl bg-white border border-[#BADFDB] shadow-xs overflow-x-auto scrollbar-none">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  activeTab === 'all'
                    ? 'bg-[#FFA4A4] text-white shadow-xs'
                    : 'text-[#4A5866] hover:text-[#1A232B] hover:bg-[#BADFDB]/30'
                }`}
              >
                {lang === 'th' ? 'แสดงทั้งหมด (All)' : 'All Sections'}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  activeTab === 'overview'
                    ? 'bg-[#FFA4A4] text-white shadow-xs'
                    : 'text-[#4A5866] hover:text-[#1A232B] hover:bg-[#BADFDB]/30'
                }`}
              >
                <Compass className="size-3.5" />
                <span>{t.tabOverview}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('checklist')}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  activeTab === 'checklist'
                    ? 'bg-[#FFA4A4] text-white shadow-xs'
                    : 'text-[#4A5866] hover:text-[#1A232B] hover:bg-[#BADFDB]/30'
                }`}
              >
                <ClipboardList className="size-3.5" />
                <span>{t.tabChecklist}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('timeline')}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  activeTab === 'timeline'
                    ? 'bg-[#FFA4A4] text-white shadow-xs'
                    : 'text-[#4A5866] hover:text-[#1A232B] hover:bg-[#BADFDB]/30'
                }`}
              >
                <Milestone className="size-3.5" />
                <span>{t.tabTimeline}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('portal')}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  activeTab === 'portal'
                    ? 'bg-[#FFA4A4] text-white shadow-xs'
                    : 'text-[#4A5866] hover:text-[#1A232B] hover:bg-[#BADFDB]/30'
                }`}
              >
                <ShieldCheck className="size-3.5" />
                <span>{t.tabPortal}</span>
              </button>
            </div>

            {/* Content Sections filtered by Facet */}
            {(activeTab === 'all' || activeTab === 'overview') && (
              <>
                <StatusBadge guide={guide} lang={lang} />
                <SummaryCard summary={guide.summary} lang={lang} />
              </>
            )}

            {(activeTab === 'all' || activeTab === 'checklist') && (
              <DocumentChecklist documents={guide.required_documents} lang={lang} />
            )}

            {(activeTab === 'all' || activeTab === 'timeline') && (
              <TimelineSteps steps={guide.steps} lang={lang} />
            )}

            {(activeTab === 'all' || activeTab === 'portal') && (
              <OfficialLinkCard url={guide.official_portal_url} lang={lang} />
            )}
          </div>
        )}

        {/* Proof over promise banner */}
        <div className="w-full mt-12 p-4.5 rounded-2xl bg-white/80 border border-[#BADFDB] text-center text-xs text-[#4A5866] shadow-2xs">
          <p className="leading-relaxed font-medium">
            {t.proofBanner}
          </p>
        </div>
      </main>

      {/* Mobile Bottom Tab Bar for Instant Navigation */}
      <BottomTabBar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }}
        hasResults={!!guide}
        lang={lang}
      />

      {/* Footer: Symmetrical max-w-5xl container with Power By Ai */}
      <footer className="border-t border-[#BADFDB]/70 bg-white/70 py-8 px-4 sm:px-6 text-center text-xs text-[#7D8D9C]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-[#1A232B]">
            <Shield className="size-4 text-[#1D6B63] shrink-0" />
            <span>GlobePass: Global Visa and Consular Intelligence</span>
          </div>
          <p className="text-[11px] text-[#4A5866]">
            {lang === 'th'
              ? 'มาตรฐานสากล ISO 3166-1 alpha-2 | Power By Ai และฐานข้อมูล Passport Index'
              : 'Compliant with ISO 3166-1 alpha-2 standard. Power By Ai and Passport Index dataset.'}
          </p>
        </div>
      </footer>
    </div>
  );
}
