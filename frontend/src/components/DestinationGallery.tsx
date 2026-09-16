'use client';

import React, { useRef, useState, useEffect } from 'react';
import { CountryFlag } from './CountryFlag';
import { Language, i18n } from '@/lib/i18n';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { getQuickBaseline } from '@/lib/api';
import { Country } from '@/types/visa';
import { WorldCitySkyline } from './WorldCitySkyline';

interface DestinationCard {
  code: string;
  name_en: string;
  name_th: string;
  city_en: string;
  city_th: string;
  image: string;
}

const DESTINATIONS: DestinationCard[] = [
  {
    code: 'JP',
    name_en: 'Japan',
    name_th: 'ญี่ปุ่น',
    city_en: 'Tokyo & Kyoto',
    city_th: 'โตเกียวและเกียวโต',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=700&auto=format&fit=crop&q=80',
  },
  {
    code: 'SG',
    name_en: 'Singapore',
    name_th: 'สิงคโปร์',
    city_en: 'Marina Bay & Sentosa',
    city_th: 'มารีนาเบย์และเซนโตซา',
    image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=700&auto=format&fit=crop&q=80',
  },
  {
    code: 'CN',
    name_en: 'China',
    name_th: 'จีน',
    city_en: 'Beijing & Shanghai',
    city_th: 'ปักกิ่งและเซี่ยงไฮ้',
    image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=700&auto=format&fit=crop&q=80',
  },
  {
    code: 'KR',
    name_en: 'South Korea',
    name_th: 'เกาหลีใต้',
    city_en: 'Seoul & Busan',
    city_th: 'โซลและปูซาน',
    image: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=700&auto=format&fit=crop&q=80',
  },
  {
    code: 'US',
    name_en: 'United States',
    name_th: 'สหรัฐอเมริกา',
    city_en: 'New York & San Francisco',
    city_th: 'นิวยอร์กและซานฟรานซิสโก',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=700&auto=format&fit=crop&q=80',
  },
  {
    code: 'GB',
    name_en: 'United Kingdom',
    name_th: 'สหราชอาณาจักร',
    city_en: 'London & Edinburgh',
    city_th: 'ลอนดอนและเอดินบะระ',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=700&auto=format&fit=crop&q=80',
  },
  {
    code: 'FR',
    name_en: 'France',
    name_th: 'ฝรั่งเศส',
    city_en: 'Paris & Nice',
    city_th: 'ปารีสและนีซ',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=700&auto=format&fit=crop&q=80',
  },
  {
    code: 'CH',
    name_en: 'Switzerland',
    name_th: 'สวิตเซอร์แลนด์',
    city_en: 'Zurich & Geneva',
    city_th: 'ซูริกและเจนีวา',
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=700&auto=format&fit=crop&q=80',
  },
  {
    code: 'DE',
    name_en: 'Germany',
    name_th: 'เยอรมนี',
    city_en: 'Berlin & Munich',
    city_th: 'เบอร์ลินและมิวนิก',
    image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=700&auto=format&fit=crop&q=80',
  },
  {
    code: 'AU',
    name_en: 'Australia',
    name_th: 'ออสเตรเลีย',
    city_en: 'Sydney & Melbourne',
    city_th: 'ซิดนีย์และเมลเบิร์น',
    image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=700&auto=format&fit=crop&q=80',
  },
  {
    code: 'TW',
    name_en: 'Taiwan',
    name_th: 'ไต้หวัน',
    city_en: 'Taipei & Kaohsiung',
    city_th: 'ไทเปและเกาสง',
    image: 'https://images.unsplash.com/photo-1508248467877-aec1b08de376?w=700&auto=format&fit=crop&q=80',
  },
  {
    code: 'HK',
    name_en: 'Hong Kong',
    name_th: 'ฮ่องกง',
    city_en: 'Victoria Harbour',
    city_th: 'อ่าววิกตอเรีย',
    image: 'https://images.unsplash.com/photo-1506970845246-18f21d533b20?w=700&auto=format&fit=crop&q=80',
  },
];

function formatCardStatus(fromCode: string, toCode: string, lang: Language): string {
  if (fromCode.toUpperCase() === toCode.toUpperCase()) {
    return lang === 'th' ? 'เดินทางภายในประเทศ' : 'Domestic Passage';
  }

  const baseline = getQuickBaseline(fromCode, toCode);
  const isTh = lang === 'th';

  switch (baseline.visa_type) {
    case 'visa_free':
      if (baseline.days) {
        return isTh ? `ไม่ต้องขอวีซ่า (${baseline.days} วัน)` : `Visa Free (${baseline.days} days)`;
      }
      return isTh ? 'ไม่ต้องขอวีซ่า (Visa Free)' : 'Visa Free Access';
    case 'visa_on_arrival':
      if (baseline.days) {
        return isTh ? `ขอ Visa on Arrival (${baseline.days} วัน)` : `Visa on Arrival (${baseline.days} days)`;
      }
      return isTh ? 'ขอ Visa on Arrival ณ ด่านฯ' : 'Visa on Arrival (VoA)';
    case 'evisa':
      if (toCode === 'KR') {
        return isTh ? 'ลงทะเบียน K-ETA ล่วงหน้า' : 'K-ETA Registration';
      }
      if (toCode === 'US') {
        return isTh ? 'ลงทะเบียน ESTA ล่วงหน้า' : 'ESTA / Visa Waiver';
      }
      if (toCode === 'GB') {
        return isTh ? 'ลงทะเบียน UK ETA ล่วงหน้า' : 'UK ETA Electronic Visa';
      }
      if (baseline.days) {
        return isTh ? `ยื่นขอ eVisa / ETA (${baseline.days} วัน)` : `Electronic Visa (${baseline.days} days)`;
      }
      return isTh ? 'ยื่นขอวีซ่าอิเล็กทรอนิกส์ (eVisa)' : 'Electronic Visa (eVisa)';
    case 'embassy_visa':
      return isTh ? 'ต้องยื่นขอวีซ่าผ่านสถานทูต' : 'Embassy Visa Required';
    case 'no_admission':
      return isTh ? 'ไม่อนุญาตให้เดินทางเข้า' : 'No Entry Permitted';
    default:
      return baseline.label || (isTh ? 'ต้องยื่นขอวีซ่า' : 'Visa Required');
  }
}

interface DestinationGalleryProps {
  onSelect: (code: string) => void;
  fromCountry: string;
  countries?: Country[];
  lang: Language;
}

export function DestinationGallery({ onSelect, fromCountry, lang }: DestinationGalleryProps) {
  const t = i18n[lang];


  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 15);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 15);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollContainerRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll, { passive: true });
      window.addEventListener('resize', checkScroll);
      const timer = setTimeout(checkScroll, 150);
      return () => {
        el.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
        clearTimeout(timer);
      };
    }
  }, []);

  const handleScroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollAmount = direction === 'left' ? -340 : 340;
    el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <div className="w-full mt-4 sm:mt-5 mb-12">
      {/* Section Header with Animated World City Skyline */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-3 px-1">
        <div>
          <h2 className="font-display text-lg sm:text-xl md:text-2xl font-black text-[#1D6B63] tracking-tight leading-none whitespace-nowrap">
            {t.popularSectionTitle}
          </h2>
        </div>

        {/* Animated City Skyline Popup with Multi-Country Architecture, Trees & Sky */}
        <div className="w-full md:w-auto flex justify-start md:justify-end">
          <WorldCitySkyline lang={lang} />
        </div>
      </div>

      {/* Horizontal Rail with Navigation Buttons */}
      <div className="relative group">
        {/* Left Scroll Button */}
        <button
          type="button"
          onClick={() => handleScroll('left')}
          disabled={!canScrollLeft}
          aria-label="Previous Destinations"
          className={`absolute -left-2 sm:-left-4 top-[42%] -translate-y-1/2 z-20 size-10 sm:size-11 rounded-full bg-white/95 backdrop-blur-md border border-[#BADFDB] shadow-md text-[#1D6B63] flex items-center justify-center transition-all duration-200 hover:bg-[#FFA4A4] hover:border-[#FFA4A4] hover:text-white hover:scale-110 active:scale-95 ${
            canScrollLeft ? 'opacity-100 cursor-pointer shadow-md' : 'opacity-0 pointer-events-none'
          }`}
        >
          <ChevronLeft className="size-5 shrink-0" />
        </button>

        {/* Right Scroll Button */}
        <button
          type="button"
          onClick={() => handleScroll('right')}
          disabled={!canScrollRight}
          aria-label="Next Destinations"
          className={`absolute -right-2 sm:-right-4 top-[42%] -translate-y-1/2 z-20 size-10 sm:size-11 rounded-full bg-white/95 backdrop-blur-md border border-[#BADFDB] shadow-md text-[#1D6B63] flex items-center justify-center transition-all duration-200 hover:bg-[#FFA4A4] hover:border-[#FFA4A4] hover:text-white hover:scale-110 active:scale-95 ${
            canScrollRight ? 'opacity-100 cursor-pointer shadow-md' : 'opacity-0 pointer-events-none'
          }`}
        >
          <ChevronRight className="size-5 shrink-0" />
        </button>

        <div
          ref={scrollContainerRef}
          className="flex gap-5 overflow-x-auto pt-3 pb-8 px-2 -mx-2 snap-x scrollbar-none scroll-smooth"
        >
          {DESTINATIONS.map((dest) => {
            const policyText = formatCardStatus(fromCountry, dest.code, lang);

            return (
              <button
                key={dest.code}
                type="button"
                onClick={() => onSelect(dest.code)}
                className="group relative flex-shrink-0 w-72 sm:w-80 rounded-3xl overflow-hidden text-left snap-start flex flex-col justify-between border-2 border-[rgba(26,35,43,0.08)] bg-white transition-all duration-200 hover:border-[#FFA4A4] hover:ring-4 hover:ring-[#FFA4A4]/25 hover:shadow-xl hover:shadow-[#FFA4A4]/20 hover:-translate-y-1.5"
              >
                {/* Real Destination Photography with Ratio */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#BADFDB]/30">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={dest.image}
                    alt={dest.name_en}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Legibility Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A232B]/85 via-[#1A232B]/20 to-transparent" />

                  {/* Flag & Destination Code Badge */}
                  <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md shadow-xs text-xs font-bold text-[#1A232B]">
                    <CountryFlag code={dest.code} size="sm" />
                    <span>{dest.code}</span>
                  </div>

                  {/* City Overlay */}
                  <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                    <p className="text-xs font-semibold tracking-wider text-[#BADFDB]">
                      {lang === 'th' ? dest.city_th : dest.city_en}
                    </p>
                    <h3 className="font-display text-lg font-black leading-tight drop-shadow-xs">
                      {lang === 'th' ? dest.name_th : dest.name_en}
                    </h3>
                  </div>
                </div>

                {/* Card Footer: Dynamically bound to Origin Passport */}
                <div className="p-4 bg-white flex items-center justify-between gap-3 border-t border-[rgba(26,35,43,0.06)]">
                  <div className="text-xs min-w-0 flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#7D8D9C] block leading-tight truncate">
                      {lang === 'th' ? 'ข้อกำหนดการเดินทาง' : 'ENTRY REQUIREMENTS'}
                    </span>
                    <span className="font-bold text-[#1A232B] text-xs leading-normal block mt-0.5 truncate">
                      {policyText}
                    </span>
                  </div>

                  {/* Arrow Action Button: Highlights ONLY on Card Hover */}
                  <div className="size-9 rounded-2xl border border-[#BADFDB]/80 bg-[#FCF9EA] text-[#1D6B63] flex items-center justify-center shrink-0 transition-all duration-200 group-hover:scale-105 group-hover:bg-[#FFA4A4] group-hover:border-[#FFA4A4] group-hover:text-white shadow-2xs">
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
