import type { ReactNode } from 'react';
import { Check, Minus } from 'lucide-react';
import { comparisonRows } from '@/lib/pricing';

function BrowserChrome({ children, title = 'compare' }: { children: ReactNode; title?: string }) {
  return (
    <div className="bg-card/80 border border-border/60 rounded-2xl overflow-hidden backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.02]">
      <div className="bg-muted/80 px-4 sm:px-6 py-3 sm:py-4 border-b border-border/60 flex items-center gap-3">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <span className="text-[10px] sm:text-xs font-mono text-muted-foreground/70 truncate">{title}</span>
      </div>
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

function CellValue({ value, positive }: { value: string; positive?: boolean }) {
  const isNone = value === 'None' || value === '—' || value.startsWith('You build');
  return (
    <span
      className={
        positive
          ? 'text-emerald-400 font-medium'
          : isNone
            ? 'text-muted-foreground/70'
            : 'text-foreground/80'
      }
    >
      {value}
    </span>
  );
}

function SidebarComparison() {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur divide-y divide-white/5">
      <div className="px-3 py-2.5 border-b border-border/60">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">vs direct transfer</p>
      </div>
      {comparisonRows.map((row) => (
        <div
          key={row.feature}
          className={`px-3 py-3 ${row.highlight ? 'bg-primary/[0.04]' : ''}`}
        >
          <p className="text-xs font-bold text-white mb-2 leading-snug">{row.feature}</p>
          <div className="flex items-start gap-1.5 mb-1.5">
            <Minus className="h-3 w-3 text-muted-foreground/60 shrink-0 mt-0.5" />
            <span className="text-[11px] text-muted-foreground/70 leading-snug">{row.direct}</span>
          </div>
          <div className="flex items-start gap-1.5">
            <Check className="h-3 w-3 text-emerald-500 shrink-0 mt-0.5" />
            <span className="text-[11px] text-emerald-400/90 leading-snug font-medium">{row.depositNow}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ComparisonTable({
  compact = false,
  variant = 'table',
  browserChrome = false,
}: {
  compact?: boolean;
  variant?: 'table' | 'sidebar';
  browserChrome?: boolean;
}) {
  if (variant === 'sidebar') {
    const sidebar = <SidebarComparison />;
    return browserChrome ? (
      <BrowserChrome title="compare — direct vs deposit.now">{sidebar}</BrowserChrome>
    ) : (
      sidebar
    );
  }

  const cellPad = compact ? 'px-4 py-3.5 sm:px-5 sm:py-4' : 'p-4 sm:p-5';

  const table = (
      <table
        className={`w-full ${compact ? 'text-xs sm:text-sm' : 'text-sm sm:text-base min-w-[640px]'}`}
      >
        <thead>
          <tr className="border-b border-border/60">
            <th
              className={`text-left ${cellPad} text-muted-foreground font-semibold uppercase tracking-wider text-[10px] sm:text-xs`}
            >
              Feature
            </th>
            <th
              className={`text-left ${cellPad} text-muted-foreground font-semibold uppercase tracking-wider text-[10px] sm:text-xs`}
            >
              {compact ? 'Direct transfer' : 'Direct On-Chain Transfer'}
            </th>
            <th
              className={`text-left ${cellPad} text-primary font-bold uppercase tracking-wider text-[10px] sm:text-xs bg-primary/5`}
            >
              deposit.now + x402
            </th>
          </tr>
        </thead>
        <tbody>
          {comparisonRows.map((row) => (
            <tr
              key={row.feature}
              className={`border-b border-white/5 last:border-0 ${
                row.highlight ? 'bg-primary/[0.03]' : ''
              }`}
            >
              <td className={`${cellPad} text-white font-medium leading-snug`}>{row.feature}</td>
              <td className={cellPad}>
                <div className="flex items-start gap-2">
                  <Minus className="h-4 w-4 text-muted-foreground/60 shrink-0 mt-0.5" />
                  <CellValue value={row.direct} />
                </div>
              </td>
              <td className={`${cellPad} bg-primary/[0.03]`}>
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <CellValue value={row.depositNow} positive />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
  );

  if (browserChrome) {
    return (
      <BrowserChrome title="compare — direct vs deposit.now">
        <div className="bg-black/20 px-3 py-2 sm:px-4 sm:py-3">{table}</div>
      </BrowserChrome>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-border/60 bg-card/60 backdrop-blur">
      <div className="px-3 py-2 sm:px-4 sm:py-3">{table}</div>
    </div>
  );
}