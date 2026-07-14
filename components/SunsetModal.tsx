'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

const DISMISSED_KEY = 'sunset-modal-dismissed';

export function SunsetBanner({ onReopen }: { onReopen: () => void }) {
  return (
    <div className="w-full bg-primary/10 border-b border-primary/30 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-center gap-3 text-xs sm:text-sm">
        <span className="text-muted-foreground">
          deposit.now has sunset.{' '}
          <a
            href="https://x402dir.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 font-bold transition-colors"
          >
            Visit x402dir.com
          </a>
        </span>
        <button
          onClick={onReopen}
          className="text-primary hover:text-primary/80 font-black text-[10px] uppercase tracking-wider border border-primary/30 rounded-md px-3 py-1 hover:bg-primary/10 transition-colors"
        >
          Details
        </button>
      </div>
    </div>
  );
}

export function SunsetModal() {
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const wasDismissed = sessionStorage.getItem(DISMISSED_KEY) === '1';
    if (wasDismissed) {
      setDismissed(true);
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, []);

  function handleClose(value: boolean) {
    if (!value) {
      setOpen(false);
      setDismissed(true);
      sessionStorage.setItem(DISMISSED_KEY, '1');
    }
  }

  function handleReopen() {
    setOpen(true);
    setDismissed(false);
    sessionStorage.removeItem(DISMISSED_KEY);
  }

  if (!mounted) return null;

  return (
    <>
      {dismissed && !open && <SunsetBanner onReopen={handleReopen} />}

      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-md border-border/60 bg-card/95 backdrop-blur gap-3">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-lg font-bold text-white">
              deposit.now has sunset
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
              We&rsquo;ve closed this chapter to focus on what&rsquo;s next.
              The infrastructure and lessons carry forward.
            </DialogDescription>
          </DialogHeader>

          <p className="text-sm text-muted-foreground/80 leading-relaxed">
            Thank you to every developer, agent builder, and early adopter.
            This isn&rsquo;t goodbye&mdash;check out our new project:
          </p>

          <p className="text-xs text-muted-foreground/70">
            The <span className="text-white font-medium">deposit.now</span> domain
            is available for payments, fintech, or web3 projects.
          </p>

          <div className="flex flex-col gap-2">
            <a
              href="https://x402dir.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-full gap-2 bg-primary hover:bg-primary/90 text-white font-black text-[10px] uppercase tracking-wider h-10 rounded-lg transition-colors"
            >
              Visit x402dir.com &rarr;
            </a>
            <a
              href="mailto:support@deposit.now"
              className="flex items-center justify-center w-full bg-primary/10 hover:bg-primary/15 border border-primary/30 text-primary font-black text-[10px] uppercase tracking-wider h-10 rounded-lg transition-colors"
            >
              Contact Us — support@deposit.now
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
