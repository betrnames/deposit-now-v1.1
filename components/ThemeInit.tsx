'use client';

import { useLayoutEffect } from 'react';
import { applyTheme, getStoredTheme } from '@/lib/theme';

/** Re-applies stored theme after React hydrates (server html must not pin data-theme). */
export function ThemeInit() {
  useLayoutEffect(() => {
    applyTheme(getStoredTheme());
  }, []);

  return null;
}