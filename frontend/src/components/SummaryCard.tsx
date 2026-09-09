'use client';

import React from 'react';
import { FileText } from 'lucide-react';
import { Language, i18n } from '@/lib/i18n';

interface SummaryCardProps {
  summary: string;
  lang: Language;
}

export function SummaryCard({ summary, lang }: SummaryCardProps) {
  const t = i18n[lang];

  return (
    <div className="rounded-3xl border border-[rgba(26,35,43,0.08)] bg-white p-6 sm:p-8 shadow-card">
      <div className="flex items-center gap-3 mb-4">
        <div className="size-9 rounded-2xl bg-[#BADFDB]/35 border border-[#BADFDB] flex items-center justify-center text-[#1D6B63] shrink-0">
          <FileText className="size-4.5 shrink-0" />
        </div>
        <div>
          <h2 className="font-display text-lg font-black text-[#1A232B] tracking-tight">
            {t.summaryTitle}
          </h2>
          <p className="text-xs text-[#4A5866]">
            {t.summaryNotice}
          </p>
        </div>
      </div>

      <div className="relative rounded-2xl bg-[#FCF9EA]/55 border border-[#BADFDB]/50 p-5 sm:p-6 shadow-2xs">
        <p className="text-sm sm:text-base leading-relaxed text-[#1A232B] font-normal">
          {summary}
        </p>
      </div>
    </div>
  );
}
