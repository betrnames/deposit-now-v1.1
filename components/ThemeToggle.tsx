'use client';

import { useEffect, useState } from 'react';
import {
  applyTheme,
  getStoredTheme,
  THEMES,
  type SiteTheme,
} from '@/lib/theme';

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const [theme, setTheme] = useState<SiteTheme>('cloudflare');

  useEffect(() => {
    setTheme(getStoredTheme());
  }, []);

  const selectTheme = (next: SiteTheme) => {
    setTheme(next);
    applyTheme(next);
  };

  return (
    <div
      role="group"
      aria-label="Color theme"
      className={`inline-flex items-center rounded-lg border border-border/60 bg-muted/40 p-0.5 ${
        compact ? 'w-full' : ''
      }`}
    >
      {THEMES.map((option) => {
        const active = theme === option.id;
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={active}
            title={option.description}
            onClick={() => selectTheme(option.id)}
            className={`inline-flex items-center justify-center gap-1.5 rounded-md px-2.5 py-1.5 text-[10px] font-black uppercase tracking-wider transition-colors ${
              compact ? 'flex-1' : 'min-w-[4.5rem]'
            } ${
              active
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
            }`}
          >
            <span
              aria-hidden
              className={`h-2 w-2 rounded-full shrink-0 ${
                option.id === 'cloudflare' ? 'bg-[oklch(0.7235_0.1724_53.7949)]' : 'bg-[oklch(0.546_0.245_262.881)]'
              } ${active ? 'ring-1 ring-primary-foreground/40' : ''}`}
            />
            {compact ? option.shortLabel : option.label}
          </button>
        );
      })}
    </div>
  );
}