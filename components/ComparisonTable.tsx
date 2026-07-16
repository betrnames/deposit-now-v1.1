import type { ReactNode } from 'react';
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
        <span className="text-[10px] sm:text-xs font-mono text-muted-foreground/70 truncate">
          {title}
        </span>
      </div>
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

function CellValue({ value, emphasize }: { value: string; emphasize?: boolean }) {
  return (
    <span
      className={
        emphasize
          ? 'text-emerald-400/90 font-medium leading-snug'
          : 'text-foreground/80 leading-snug'
      }
    >
      {value}
    </span>
  );
}

/** Two-column table used inside the browser mockup */
function TwoColumnTable({ compact }: { compact?: boolean }) {
  const cellPad = compact ? 'px-4 py-3.5 sm:px-5 sm:py-4' : 'p-4 sm:p-5';

  return (
    <table className={`w-full ${compact ? 'text-xs sm:text-sm' : 'text-sm sm:text-base'}`}>
      <thead>
        <tr className="border-b border-border/60">
          <th
            className={`text-left ${cellPad} text-muted-foreground font-semibold uppercase tracking-wider text-[10px] sm:text-xs w-[38%]`}
          >
            Feature
          </th>
          <th
            className={`text-left ${cellPad} text-primary font-bold uppercase tracking-wider text-[10px] sm:text-xs bg-primary/5`}
          >
            deposit.now
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
            <td className={`${cellPad} text-white font-medium leading-snug align-top`}>
              {row.feature}
            </td>
            <td className={`${cellPad} bg-primary/[0.03] align-top`}>
              <CellValue value={row.depositNow} emphasize />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** Full honest compare: Direct · CDP Fund · deposit.now (e.g. litepaper) */
function FullCompareTable() {
  const cellPad = 'p-4 sm:p-5';

  return (
    <table className="w-full text-sm sm:text-base min-w-[720px]">
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
            Direct transfer
          </th>
          <th
            className={`text-left ${cellPad} text-sky-400/90 font-semibold uppercase tracking-wider text-[10px] sm:text-xs`}
          >
            Coinbase CDP Fund
          </th>
          <th
            className={`text-left ${cellPad} text-primary font-bold uppercase tracking-wider text-[10px] sm:text-xs bg-primary/5`}
          >
            deposit.now
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
              <CellValue value={row.direct} />
            </td>
            <td className={cellPad}>
              <CellValue value={row.cdpFund} />
            </td>
            <td className={`${cellPad} bg-primary/[0.03]`}>
              <CellValue value={row.depositNow} emphasize />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
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
  // Browser mockup + compact homepage: always 2 columns
  if (browserChrome || compact || variant === 'sidebar') {
    const table = (
      <div className="bg-black/20 px-1 py-1 sm:px-2 sm:py-2">
        <TwoColumnTable compact />
      </div>
    );
    return browserChrome || variant === 'sidebar' ? (
      <BrowserChrome title="compare — feature · deposit.now">{table}</BrowserChrome>
    ) : (
      <div className="overflow-x-auto rounded-2xl border border-border/60 bg-card/60 backdrop-blur">
        {table}
      </div>
    );
  }

  // Full multi-column (litepaper)
  const table = <FullCompareTable />;

  return (
    <div className="overflow-x-auto rounded-2xl border border-border/60 bg-card/60 backdrop-blur">
      <div className="px-3 py-2 sm:px-4 sm:py-3">{table}</div>
    </div>
  );
}
