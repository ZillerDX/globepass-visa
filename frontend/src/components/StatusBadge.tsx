'use client';

import React from 'react';
import {
  CheckCircle2,
  Clock,
  Calendar,
  CreditCard,
  PlaneTakeoff,
  FileText,
  Landmark,
  Sparkles,
  Database,
  ArrowRight
} from 'lucide-react';
import { VisaType, VisaGuideResponse } from '@/types/visa';
import { Language, i18n } from '@/lib/i18n';
import { CountryFlag } from './CountryFlag';

interface StatusBadgeProps {
  guide: VisaGuideResponse;
  lang: Language;
}

export function StatusBadge({ guide, lang }: StatusBadgeProps) {
  const t = i18n[lang];

  const getStatusConfig = (type: VisaType) => {
    switch (type) {
      case 'visa_free':
        return {
          label: t.visa_free,
          bg: 'bg-[#BADFDB]/35',
          border: 'border-[#BADFDB]',
          text: 'text-[#1D6B63]',
          icon: CheckCircle2,
          iconColor: 'text-[#1D6B63]',
          dot: 'bg-[#1D6B63]'
        };
      case 'visa_on_arrival':
        return {
          label: t.visa_on_arrival,
          bg: 'bg-[#BADFDB]/20',
          border: 'border-[#BADFDB]',
          text: 'text-[#0369A1]',
          icon: PlaneTakeoff,
          iconColor: 'text-[#0369A1]',
          dot: 'bg-[#0369A1]'
        };
      case 'evisa':
        return {
          label: t.evisa,
          bg: 'bg-[#FFBDBD]/40',
          border: 'border-[#FFA4A4]',
          text: 'text-[#BA3F3F]',
          icon: FileText,
          iconColor: 'text-[#BA3F3F]',
          dot: 'bg-[#BA3F3F]'
        };
      case 'embassy_visa':
      default:
        return {
          label: t.embassy_visa,
          bg: 'bg-[#FFA4A4]/25',
          border: 'border-[#FFA4A4]',
          text: 'text-[#BA3F3F]',
          icon: Landmark,
          iconColor: 'text-[#BA3F3F]',
          dot: 'bg-[#BA3F3F]'
        };
    }
  };

  const config = getStatusConfig(guide.visa_type);
  const StatusIcon = config.icon;

  return (
    <div className="relative rounded-3xl border border-[rgba(26,35,43,0.08)] bg-white p-6 sm:p-8 shadow-card">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[rgba(26,35,43,0.06)]">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#1D6B63]">
            {t.resultTitle}
          </span>

          <div className="flex items-center gap-3 mt-2 flex-wrap">
            {/* Main Status Badge */}
            <div
              className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl border font-black text-sm sm:text-base shadow-2xs ${config.bg} ${config.border} ${config.text}`}
            >
              <span className={`size-2 rounded-full ${config.dot} animate-pulse shrink-0`} />
              <StatusIcon className={`size-5 shrink-0 ${config.iconColor}`} />
              <span>{config.label}</span>
            </div>

            {/* Cache / Live indicator */}
            {guide.cached ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#BADFDB]/25 text-[#1D6B63] border border-[#BADFDB]">
                <Database className="size-3.5 shrink-0 text-[#1D6B63]" />
                <span className="text-[11px]">{t.cachedBadge}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#FFA4A4]/20 text-[#BA3F3F] border border-[#FFA4A4]">
                <Sparkles className="size-3.5 shrink-0 text-[#BA3F3F]" />
                <span className="text-[11px]">{t.liveAiBadge}</span>
              </span>
            )}
          </div>
        </div>

        {/* Origin ➔ Destination Route Pill with Retina Flags */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-[#FCF9EA] border border-[#BADFDB]/60 font-mono text-xs font-bold text-[#1A232B] shadow-2xs">
          <div className="flex items-center gap-2">
            <CountryFlag code={guide.from_country} size="sm" />
            <span>{guide.from_country}</span>
          </div>
          <ArrowRight className="size-3.5 text-[#7D8D9C] shrink-0" />
          <div className="flex items-center gap-2">
            <CountryFlag code={guide.to_country} size="sm" />
            <span>{guide.to_country}</span>
          </div>
        </div>
      </div>

      {/* 3 High-density Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
        {/* Stay Duration */}
        <div className="rounded-2xl border border-[rgba(26,35,43,0.07)] bg-[#FCF9EA]/50 p-4.5">
          <div className="flex items-center gap-2 text-[#4A5866] mb-1.5">
            <div className="size-6 rounded-lg bg-[#BADFDB]/50 flex items-center justify-center text-[#1D6B63] shrink-0">
              <Clock className="size-3.5 shrink-0" />
            </div>
            <span className="text-xs font-semibold">{t.stayDurationLabel}</span>
          </div>
          <p className="text-lg font-black text-[#1A232B] tracking-tight pl-1 font-display">
            {guide.stay_duration || 'N/A'}
          </p>
        </div>

        {/* Processing Time */}
        <div className="rounded-2xl border border-[rgba(26,35,43,0.07)] bg-[#FCF9EA]/50 p-4.5">
          <div className="flex items-center gap-2 text-[#4A5866] mb-1.5">
            <div className="size-6 rounded-lg bg-[#BADFDB]/50 flex items-center justify-center text-[#1D6B63] shrink-0">
              <Calendar className="size-3.5 shrink-0" />
            </div>
            <span className="text-xs font-semibold">{t.processingTimeLabel}</span>
          </div>
          <p className="text-lg font-black text-[#1A232B] tracking-tight pl-1 font-display">
            {guide.processing_time || 'N/A'}
          </p>
        </div>

        {/* Estimated Cost */}
        <div className="rounded-2xl border border-[rgba(26,35,43,0.07)] bg-[#FCF9EA]/50 p-4.5">
          <div className="flex items-center gap-2 text-[#4A5866] mb-1.5">
            <div className="size-6 rounded-lg bg-[#FFA4A4]/30 flex items-center justify-center text-[#BA3F3F] shrink-0">
              <CreditCard className="size-3.5 shrink-0" />
            </div>
            <span className="text-xs font-semibold">{t.estimatedCostLabel}</span>
          </div>
          <p className="text-lg font-black text-[#1A232B] tracking-tight tabular pl-1 font-display">
            {guide.estimated_cost || 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
}
