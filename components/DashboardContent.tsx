'use client';

import { useState } from 'react';
import { Search, LayoutGrid, Table2, Check, Minus, Globe, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { DashboardStats } from '@/components/DashboardStats';
import { FacilitatorCard } from '@/components/FacilitatorCard';
import { Badge } from '@/components/ui/badge';
import {
  facilitators,
  filterFacilitators,
  defaultFilters,
  type FacilitatorFilters,
  type Facilitator,
} from '@/lib/facilitators';

const chainFilters = ['all', 'Base', 'Solana', 'multi-chain'] as const;
const feeFilters = ['all', 'Free', 'Variable'] as const;
const statusFilters = ['all', 'production', 'testnet'] as const;

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
        active
          ? 'bg-primary text-white'
          : 'bg-muted/50 text-muted-foreground hover:text-white hover:bg-muted'
      }`}
    >
      {label}
    </button>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="flex-1 min-w-0">
      <label className="text-[10px] text-muted-foreground/50 uppercase tracking-wider font-bold block mb-1">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-9 rounded-lg border border-border/60 bg-muted/40 text-white text-sm px-2 appearance-none focus:outline-none focus:ring-1 focus:ring-primary"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-card text-white">
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function FeeBadgeInline({ fees }: { fees: Facilitator['fees'] }) {
  if (fees === 'Free') {
    return (
      <span className="inline-flex items-center text-emerald-400 font-semibold text-sm">
        Free
      </span>
    );
  }
  return (
    <span className="inline-flex items-center text-amber-300 font-semibold text-sm">
      {fees}
    </span>
  );
}

function StatusDot({ status }: { status: Facilitator['status'] }) {
  const color =
    status === 'production'
      ? 'bg-emerald-500'
      : status === 'testnet'
        ? 'bg-blue-500'
        : 'bg-purple-500';
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-foreground/80">
      <span className={`w-2 h-2 rounded-full ${color}`} />
      {status === 'production' ? 'Prod' : status === 'testnet' ? 'Testnet' : 'Beta'}
    </span>
  );
}

function TableView({ items }: { items: Facilitator[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border/60 bg-card/60 backdrop-blur">
      <table className="w-full text-sm min-w-[700px]">
        <thead>
          <tr className="border-b border-border/60">
            <th className="text-left px-5 py-3.5 text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">
              Facilitator
            </th>
            <th className="text-left px-5 py-3.5 text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">
              Fees
            </th>
            <th className="text-left px-5 py-3.5 text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">
              Chains
            </th>
            <th className="text-left px-5 py-3.5 text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">
              Tokens
            </th>
            <th className="text-left px-5 py-3.5 text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">
              Schemes
            </th>
            <th className="text-left px-5 py-3.5 text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">
              Status
            </th>
            <th className="text-left px-5 py-3.5 text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">
              OSS
            </th>
            <th className="text-left px-5 py-3.5 text-muted-foreground font-semibold uppercase tracking-wider text-[10px] w-10">
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((f) => (
            <tr
              key={f.slug}
              className="border-b border-white/5 last:border-0 hover:bg-primary/[0.03] transition-colors"
            >
              <td className="px-5 py-4 text-white font-medium">{f.name}</td>
              <td className="px-5 py-4">
                <FeeBadgeInline fees={f.fees} />
              </td>
              <td className="px-5 py-4">
                <div className="flex flex-wrap gap-1">
                  {f.chains.map((c) => (
                    <span
                      key={c}
                      className="inline-flex items-center gap-1 text-xs text-foreground/70 bg-muted/40 rounded px-1.5 py-0.5"
                    >
                      <Globe className="h-2.5 w-2.5" />
                      {c}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-5 py-4">
                <div className="flex flex-wrap gap-1">
                  {f.tokens.map((t) => (
                    <Badge
                      key={t}
                      variant="outline"
                      className="text-[10px] text-foreground/70 border-border/60 bg-muted/30"
                    >
                      {t}
                    </Badge>
                  ))}
                </div>
              </td>
              <td className="px-5 py-4 text-foreground/70 text-xs">
                {f.schemes.join(', ')}
              </td>
              <td className="px-5 py-4">
                <StatusDot status={f.status} />
              </td>
              <td className="px-5 py-4">
                {f.openSource ? (
                  <Check className="h-4 w-4 text-emerald-500" />
                ) : (
                  <Minus className="h-4 w-4 text-muted-foreground/40" />
                )}
              </td>
              <td className="px-5 py-4">
                <a
                  href={f.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground/50 hover:text-primary transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CardGrid({ items }: { items: Facilitator[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((f) => (
        <FacilitatorCard key={f.slug} facilitator={f} />
      ))}
    </div>
  );
}

export function DashboardContent() {
  const [filters, setFilters] = useState<FacilitatorFilters>(defaultFilters);
  const [view, setView] = useState<'table' | 'cards'>('table');
  const [tableSearch, setTableSearch] = useState('');

  const filtered = filterFacilitators(filters);

  const tableFiltered = tableSearch
    ? filtered.filter((f) => {
        const q = tableSearch.toLowerCase();
        return (
          f.name.toLowerCase().includes(q) ||
          f.description.toLowerCase().includes(q) ||
          f.chains.some((c) => c.toLowerCase().includes(q)) ||
          f.tokens.some((t) => t.toLowerCase().includes(q))
        );
      })
    : filtered;

  const updateFilter = (key: keyof FacilitatorFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const hasDashboardFilter =
    filters.chain !== 'all' || filters.fee !== 'all' || filters.status !== 'all';

  return (
    <div>
      {/* ── Dashboard filters: chain / fee / status ── */}
      <div className="mb-6">
        {/* Mobile: select dropdowns */}
        <div className="flex gap-3 md:hidden">
          <FilterSelect
            label="Chain"
            value={filters.chain}
            onChange={(v) => updateFilter('chain', v)}
            options={[
              { value: 'all', label: 'All Chains' },
              { value: 'Base', label: 'Base' },
              { value: 'Solana', label: 'Solana' },
              { value: 'multi-chain', label: 'Multi-chain' },
            ]}
          />
          <FilterSelect
            label="Fee"
            value={filters.fee}
            onChange={(v) => updateFilter('fee', v)}
            options={[
              { value: 'all', label: 'All Fees' },
              { value: 'Free', label: 'Free' },
              { value: 'Variable', label: 'Variable' },
            ]}
          />
          <FilterSelect
            label="Status"
            value={filters.status}
            onChange={(v) => updateFilter('status', v)}
            options={[
              { value: 'all', label: 'All' },
              { value: 'production', label: 'Prod' },
              { value: 'testnet', label: 'Testnet' },
            ]}
          />
        </div>

        {/* Desktop: pill buttons */}
        <div className="hidden md:flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-muted-foreground/50 uppercase tracking-wider font-bold mr-1">
              Chain
            </span>
            {chainFilters.map((c) => (
              <FilterPill
                key={c}
                label={c === 'all' ? 'All' : c === 'multi-chain' ? 'Multi-chain' : c}
                active={filters.chain === c}
                onClick={() => updateFilter('chain', c)}
              />
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-muted-foreground/50 uppercase tracking-wider font-bold mr-1">
              Fee
            </span>
            {feeFilters.map((f) => (
              <FilterPill
                key={f}
                label={f === 'all' ? 'All' : f}
                active={filters.fee === f}
                onClick={() => updateFilter('fee', f)}
              />
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-muted-foreground/50 uppercase tracking-wider font-bold mr-1">
              Status
            </span>
            {statusFilters.map((s) => (
              <FilterPill
                key={s}
                label={s === 'all' ? 'All' : s === 'production' ? 'Prod' : 'Testnet'}
                active={filters.status === s}
                onClick={() => updateFilter('status', s)}
              />
            ))}
          </div>

          {hasDashboardFilter && (
            <button
              onClick={() =>
                setFilters((prev) => ({ ...prev, chain: 'all', fee: 'all', status: 'all' }))
              }
              className="text-xs text-muted-foreground hover:text-white transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* ── Charts and stats ── */}
      <DashboardStats items={filtered} />

      {/* ── Table section ── */}
      <div className="mt-10">
        {/* Title row: heading + search + view toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
          <div className="shrink-0">
            <h3 className="text-lg font-bold text-white">All Facilitators</h3>
            <p className="text-sm text-muted-foreground">
              {tableSearch || hasDashboardFilter
                ? `${tableFiltered.length} of ${facilitators.length} match`
                : `${facilitators.length} indexed`}
            </p>
          </div>

          <div className="flex items-center gap-2 sm:ml-auto flex-1 sm:flex-initial sm:max-w-xs">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50" />
              <Input
                type="text"
                placeholder="Search..."
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                className="pl-9 bg-muted/40 border-border/60 text-white placeholder:text-muted-foreground/50 h-9 text-sm"
              />
            </div>
            <div className="flex items-center gap-1 bg-muted/30 rounded-lg p-0.5 shrink-0">
              <button
                onClick={() => setView('table')}
                className={`p-1.5 rounded-md transition-colors ${
                  view === 'table'
                    ? 'bg-primary text-white'
                    : 'text-muted-foreground hover:text-white'
                }`}
                aria-label="Table view"
              >
                <Table2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setView('cards')}
                className={`p-1.5 rounded-md transition-colors ${
                  view === 'cards'
                    ? 'bg-primary text-white'
                    : 'text-muted-foreground hover:text-white'
                }`}
                aria-label="Card view"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {tableFiltered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg font-medium mb-2">No facilitators match your filters</p>
            <p className="text-sm">Try adjusting your search or filter criteria.</p>
          </div>
        ) : view === 'table' ? (
          <TableView items={tableFiltered} />
        ) : (
          <CardGrid items={tableFiltered} />
        )}
      </div>
    </div>
  );
}
