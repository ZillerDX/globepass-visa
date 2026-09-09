'use client';

import React from 'react';
import { Milestone } from 'lucide-react';
import { StepItem } from '@/types/visa';
import { Language, i18n } from '@/lib/i18n';

interface TimelineStepsProps {
  steps: StepItem[];
  lang: Language;
}

export function TimelineSteps({ steps, lang }: TimelineStepsProps) {
  const t = i18n[lang];

  return (
    <div className="rounded-3xl border border-[rgba(26,35,43,0.08)] bg-white p-6 sm:p-8 shadow-card">
      {/* Header */}
      <div className="flex items-center gap-3 mb-7">
        <div className="size-9 rounded-2xl bg-[#FFA4A4]/25 border border-[#FFA4A4] flex items-center justify-center text-[#BA3F3F] shrink-0">
          <Milestone className="size-4.5 shrink-0" />
        </div>
        <div>
          <h2 className="font-display text-lg font-black text-[#1A232B] tracking-tight">
            {t.timelineTitle}
          </h2>
          <p className="text-xs text-[#4A5866]">
            {t.timelineSubtitle}
          </p>
        </div>
      </div>

      {/* Timeline Steps Path */}
      <div className="relative pl-7 sm:pl-9 space-y-6 before:absolute before:left-3.5 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-[#BADFDB] before:via-[#FFA4A4] before:to-[#BADFDB]/40">
        {steps.map((step, idx) => {
          return (
            <div key={idx} className="relative group">
              {/* Numbered Milestone Node */}
              <div className="absolute -left-7 sm:-left-9 top-0 size-7 sm:size-8 rounded-full bg-gradient-to-br from-[#FFA4A4] to-[#FF8585] text-white font-extrabold text-xs flex items-center justify-center shadow-xs ring-4 ring-white z-10 shrink-0">
                {step.step_number || idx + 1}
              </div>

              {/* Step Detail Card */}
              <div className="rounded-2xl border border-[rgba(26,35,43,0.07)] bg-[#FCF9EA]/40 p-5 hover:border-[#FFA4A4] transition-all duration-200 hover:-translate-y-0.5 shadow-2xs">
                <h3 className="text-sm sm:text-base font-bold text-[#1A232B] tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-[#4A5866] leading-relaxed font-normal">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
