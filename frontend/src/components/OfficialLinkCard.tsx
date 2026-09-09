'use client';

import React from 'react';
import { ExternalLink, ShieldCheck, AlertTriangle } from 'lucide-react';
import { Language, i18n } from '@/lib/i18n';

interface OfficialLinkCardProps {
  url: string;
  lang: Language;
}

export function OfficialLinkCard({ url, lang }: OfficialLinkCardProps) {
  const t = i18n[lang];

  return (
    <div className="rounded-3xl border border-[rgba(26,35,43,0.08)] bg-white p-6 sm:p-8 shadow-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="size-8 rounded-2xl bg-[#BADFDB]/35 border border-[#BADFDB] flex items-center justify-center text-[#1D6B63] shrink-0">
              <ShieldCheck className="size-4.5 shrink-0" />
            </div>
            <h2 className="font-display text-lg font-black text-[#1A232B] tracking-tight">
              {t.officialPortalTitle}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#4A5866] max-w-xl leading-relaxed font-normal">
            {t.officialPortalDesc}
          </p>
        </div>

        {/* CTA Launch Button */}
        <a
          href={url || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#1A232B] hover:bg-[#2A3742] text-white font-bold text-sm shadow-md shadow-[#1A232B]/10 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] shrink-0"
        >
          <span>{t.openPortalBtn}</span>
          <ExternalLink className="size-4 text-white shrink-0" />
        </a>
      </div>

      {/* Advisory Alert Box */}
      <div className="mt-5 p-4 rounded-2xl bg-[#FFBDBD]/30 border border-[#FFA4A4] flex items-start gap-3 text-xs text-[#8A2B2B]">
        <AlertTriangle className="size-4.5 text-[#BA3F3F] shrink-0 mt-0.5" />
        <p className="leading-relaxed font-normal">{t.officialWarning}</p>
      </div>
    </div>
  );
}
