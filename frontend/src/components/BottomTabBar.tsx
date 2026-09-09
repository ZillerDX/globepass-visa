'use client';

import React from 'react';
import { Compass, ClipboardList, Milestone, ShieldCheck } from 'lucide-react';
import { Language, i18n } from '@/lib/i18n';

interface BottomTabBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  hasResults: boolean;
  lang: Language;
}

export function BottomTabBar({ activeTab, onTabChange, hasResults, lang }: BottomTabBarProps) {
  const t = i18n[lang];

  if (!hasResults) return null;

  const tabs = [
    { id: 'overview', label: t.tabOverview, icon: Compass },
    { id: 'checklist', label: t.tabChecklist, icon: ClipboardList },
    { id: 'timeline', label: t.tabTimeline, icon: Milestone },
    { id: 'portal', label: t.tabPortal, icon: ShieldCheck },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 sm:hidden bg-white/95 backdrop-blur-xl border-t border-[#BADFDB] pb-[env(safe-area-inset-bottom)] shadow-xl">
      <div className="grid grid-cols-4 h-15">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 min-h-[48px] transition-colors ${
                isActive
                  ? 'text-[#BA3F3F] font-bold'
                  : 'text-[#7D8D9C] hover:text-[#1A232B]'
              }`}
            >
              <Icon className={`size-4.5 ${isActive ? 'text-[#FFA4A4]' : 'text-[#7D8D9C]'}`} />
              <span className="text-[10px] tracking-tight leading-none truncate max-w-[72px]">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
