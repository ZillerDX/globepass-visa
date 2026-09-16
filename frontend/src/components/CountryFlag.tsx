'use client';

import React, { useState } from 'react';

interface CountryFlagProps {
  code: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function CountryFlag({ code, size = 'md', className = '' }: CountryFlagProps) {
  const [hasError, setHasError] = useState(false);
  const normalizedCode = code.toLowerCase().trim();

  // Explicit dimensions to guarantee no layout shifts
  const sizeClasses = {
    sm: 'w-4 h-3 text-[9px]',
    md: 'w-5 h-3.5 text-[10px]',
    lg: 'w-7 h-5 text-xs'
  }[size];

  if (hasError || !normalizedCode || normalizedCode.length !== 2) {
    return (
      <span
        className={`inline-flex items-center justify-center rounded-[3px] bg-zinc-800 border border-zinc-700 font-mono font-bold text-zinc-300 uppercase shrink-0 ${sizeClasses} ${className}`}
      >
        {code.slice(0, 2).toUpperCase()}
      </span>
    );
  }

  return (
    <span
      className={`relative inline-flex items-center justify-center rounded-[3px] overflow-hidden shadow-xs border border-white/15 shrink-0 bg-zinc-800 ${sizeClasses} ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://flagcdn.com/w40/${normalizedCode}.png`}
        srcSet={`https://flagcdn.com/w80/${normalizedCode}.png 2x`}
        alt={`${code} flag`}
        loading="lazy"
        onError={() => setHasError(true)}
        className="w-full h-full object-cover shrink-0"
      />
    </span>
  );
}
