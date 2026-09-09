'use client';

import React, { useState } from 'react';
import { ClipboardList, CheckSquare, Square, CheckCircle2 } from 'lucide-react';
import { Language, i18n } from '@/lib/i18n';

interface DocumentChecklistProps {
  documents: string[];
  lang: Language;
}

export function DocumentChecklist({ documents, lang }: DocumentChecklistProps) {
  const t = i18n[lang];
  const [checkedState, setCheckedState] = useState<Record<number, boolean>>({});

  const toggleCheck = (index: number) => {
    setCheckedState((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const completedCount = Object.values(checkedState).filter(Boolean).length;
  const totalCount = documents.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const isAllCompleted = totalCount > 0 && completedCount === totalCount;

  return (
    <div className="rounded-3xl border border-[rgba(26,35,43,0.08)] bg-white p-6 sm:p-8 shadow-card">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-2xl bg-[#BADFDB]/35 border border-[#BADFDB] flex items-center justify-center text-[#1D6B63] shrink-0">
            <ClipboardList className="size-4.5 shrink-0" />
          </div>
          <div>
            <h2 className="font-display text-lg font-black text-[#1A232B] tracking-tight">
              {t.checklistTitle}
            </h2>
            <p className="text-xs text-[#4A5866]">
              {t.checklistSubtitle}
            </p>
          </div>
        </div>

        {/* Progress Counter Pill */}
        <div className="self-start sm:self-center px-4 py-1.5 rounded-full text-xs font-bold bg-[#FCF9EA] border border-[#BADFDB] text-[#1A232B] tabular shadow-2xs">
          <span>{t.checklistProgress} </span>
          <span className="font-extrabold text-[#1D6B63]">
            {completedCount}
          </span>{' '}
          {t.of} {totalCount} ({progressPercent}%)
        </div>
      </div>

      {/* Progress Track */}
      <div className="w-full h-2.5 bg-[#FCF9EA] rounded-full overflow-hidden mb-6 p-0.5 border border-[#BADFDB]/60">
        <div
          className="h-full bg-gradient-to-r from-[#BADFDB] via-[#FFA4A4] to-[#FF8585] transition-all duration-300 ease-out rounded-full shadow-xs"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Checklist Items */}
      <div className="space-y-2.5">
        {documents.map((doc, idx) => {
          const isChecked = !!checkedState[idx];
          return (
            <button
              key={idx}
              type="button"
              onClick={() => toggleCheck(idx)}
              className={`w-full text-left p-4 rounded-2xl border transition-all duration-150 flex items-start gap-3.5 select-none active:scale-[0.99] ${
                isChecked
                  ? 'border-[#BADFDB] bg-[#BADFDB]/20 shadow-2xs'
                  : 'border-[rgba(26,35,43,0.07)] bg-[#FCF9EA]/40 hover:border-[#FFA4A4] hover:bg-white'
              }`}
            >
              <div className="pt-0.5 shrink-0">
                {isChecked ? (
                  <CheckSquare className="size-5 text-[#1D6B63] shrink-0" />
                ) : (
                  <Square className="size-5 text-[#7D8D9C] hover:text-[#1A232B] shrink-0" />
                )}
              </div>
              <span
                className={`text-sm leading-relaxed transition-colors ${
                  isChecked
                    ? 'text-[#1D6B63] line-through opacity-80'
                    : 'text-[#1A232B]'
                }`}
              >
                {doc}
              </span>
            </button>
          );
        })}
      </div>

      {/* Celebratory Alert */}
      {isAllCompleted && (
        <div className="mt-5 p-4 rounded-2xl border border-[#BADFDB] bg-[#BADFDB]/30 text-[#1D6B63] text-xs font-bold flex items-center gap-2.5 shadow-sm">
          <CheckCircle2 className="size-5 shrink-0 text-[#1D6B63]" />
          <span>{t.allCompleted}</span>
        </div>
      )}
    </div>
  );
}
