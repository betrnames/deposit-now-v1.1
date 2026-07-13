'use client';

import { Activity, Shield, Coins, Globe, TrendingUp, GitBranch } from 'lucide-react';
import type { Facilitator } from '@/lib/facilitators';
import { facilitators as allFacilitators } from '@/lib/facilitators';

function computeStats(items: Facilitator[]) {
  const total = items.length;
  const production = items.filter((f) => f.status === 'production').length;
  const free = items.filter((f) => f.fees === 'Free').length;
  const variable = items.filter((f) => f.fees === 'Variable').length;

  const chainMap = new Map<string, number>();
  for (const f of items) {
    for (const c of f.chains) {
      chainMap.set(c, (chainMap.get(c) || 0) + 1);
    }
  }
  const chains = Array.from(chainMap.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }));

  const schemeMap = new Map<string, number>();
  for (const f of items) {
    for (const s of f.schemes) {
      schemeMap.set(s, (schemeMap.get(s) || 0) + 1);
    }
  }
  const schemes = Array.from(schemeMap.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }));

  const openSource = items.filter((f) => f.openSource).length;
  const selfHostable = items.filter((f) => f.selfHostable).length;
  const testnet = items.filter((f) => f.status === 'testnet').length;

  const tokenMap = new Map<string, number>();
  for (const f of items) {
    for (const t of f.tokens) {
      tokenMap.set(t, (tokenMap.get(t) || 0) + 1);
    }
  }
  const tokens = Array.from(tokenMap.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }));

  return { total, production, free, variable, chains, schemes, openSource, selfHostable, testnet, tokens };
}

function DonutChart({
  segments,
  size = 120,
  strokeWidth = 18,
  centerLabel,
}: {
  segments: { value: number; color: string; label: string }[];
  size?: number;
  strokeWidth?: number;
  centerLabel?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  let offset = 0;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-muted/30"
      />
      {segments.map((seg) => {
        const segLen = total > 0 ? (seg.value / total) * circumference : 0;
        const gap = 3;
        const d = (
          <circle
            key={seg.label}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={seg.color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${Math.max(0, segLen - gap)} ${circumference - segLen + gap}`}
            strokeDashoffset={-offset}
            strokeLinecap="round"
            className="transition-all duration-500"
            style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
          />
        );
        offset += segLen;
        return d;
      })}
      <text
        x={size / 2}
        y={size / 2 - 6}
        textAnchor="middle"
        className="fill-white text-2xl font-black"
        style={{ fontSize: '24px' }}
      >
        {total}
      </text>
      <text
        x={size / 2}
        y={size / 2 + 12}
        textAnchor="middle"
        className="fill-muted-foreground"
        style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
      >
        {centerLabel || 'Total'}
      </text>
    </svg>
  );
}

function BarRow({
  label,
  count,
  max,
  color,
}: {
  label: string;
  count: number;
  max: number;
  color: string;
}) {
  const pct = max > 0 ? Math.round((count / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-foreground/80 w-28 shrink-0 truncate">{label}</span>
      <div className="flex-1 h-7 rounded-md bg-muted/30 overflow-hidden relative">
        <div
          className="h-full rounded-md transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-sm font-semibold text-white w-6 text-right">{count}</span>
    </div>
  );
}

interface LineChartPoint {
  label: string;
  value: number;
}

function LineChart({
  data,
  color,
  gradientId,
}: {
  data: LineChartPoint[];
  color: string;
  gradientId: string;
}) {
  if (data.length < 2) {
    return (
      <div className="flex items-center justify-center text-muted-foreground text-sm h-40">
        Not enough data
      </div>
    );
  }

  const padTop = 12;
  const padBottom = 20;
  const padLeft = 4;
  const padRight = 4;
  const w = 200;
  const h = 100;
  const chartW = w - padLeft - padRight;
  const chartH = h - padTop - padBottom;

  const maxVal = Math.max(...data.map((d) => d.value));
  const minVal = Math.min(...data.map((d) => d.value));
  const range = maxVal - minVal || 1;

  const points = data.map((d, i) => ({
    x: padLeft + (i / (data.length - 1)) * chartW,
    y: padTop + chartH - ((d.value - minVal) / range) * chartH,
    ...d,
  }));

  const linePoints = points.map((p) => `${p.x},${p.y}`).join(' ');
  const areaPoints = `${points[0].x},${padTop + chartH} ${linePoints} ${points[points.length - 1].x},${padTop + chartH}`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
        const y = padTop + chartH * (1 - pct);
        return (
          <line
            key={pct}
            x1={padLeft}
            y1={y}
            x2={w - padRight}
            y2={y}
            stroke="currentColor"
            strokeWidth="0.4"
            className="text-white/10"
          />
        );
      })}

      <polygon points={areaPoints} fill={`url(#${gradientId})`} />

      <polyline
        points={linePoints}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="2.5" fill={color} stroke="#0f172a" strokeWidth="1" />
      ))}

      {points.map((p, i) => (
        <text
          key={`l${i}`}
          x={p.x}
          y={h - 3}
          textAnchor="middle"
          fill="currentColor"
          className="text-muted-foreground"
          style={{ fontSize: '7px' }}
        >
          {p.label}
        </text>
      ))}
    </svg>
  );
}

const CHAIN_COLORS: Record<string, string> = {
  Base: '#3b82f6',
  'Multi-network': '#a855f7',
  'Base Sepolia': '#60a5fa',
  Omnichain: '#06b6d4',
  Avalanche: '#ef4444',
  Polygon: '#8b5cf6',
  Solana: '#14b8a6',
};

const GROWTH_DATA: LineChartPoint[] = [
  { label: 'Jan', value: 2 },
  { label: 'Feb', value: 3 },
  { label: 'Mar', value: 5 },
  { label: 'Apr', value: 7 },
  { label: 'May', value: 9 },
  { label: 'Jun', value: 14 },
  { label: 'Jul', value: 20 },
];

const CHAIN_GROWTH_DATA: LineChartPoint[] = [
  { label: 'Jan', value: 1 },
  { label: 'Feb', value: 2 },
  { label: 'Mar', value: 2 },
  { label: 'Apr', value: 3 },
  { label: 'May', value: 4 },
  { label: 'Jun', value: 5 },
  { label: 'Jul', value: 7 },
];

interface DashboardStatsProps {
  items: Facilitator[];
}

export function DashboardStats({ items }: DashboardStatsProps) {
  const stats = computeStats(items);
  const maxChainCount = Math.max(...stats.chains.map((c) => c.count), 1);
  const isFiltered = items.length !== allFacilitators.length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">

      {/* Row 1: 3 KPI cards */}
      <div className="rounded-xl border border-border/60 bg-card/60 backdrop-blur p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-primary/15 text-primary">
            <Activity className="h-4 w-4" />
          </div>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
            {isFiltered ? 'Matched' : 'Facilitators'}
          </span>
        </div>
        <div className="text-3xl font-black text-white leading-none mb-1">{stats.total}</div>
        <div className="text-xs text-muted-foreground">
          {isFiltered ? `of ${allFacilitators.length} total` : 'Indexed in directory'}
        </div>
      </div>

      <div className="rounded-xl border border-border/60 bg-card/60 backdrop-blur p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-emerald-500/15 text-emerald-400">
            <Shield className="h-4 w-4" />
          </div>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
            Production
          </span>
        </div>
        <div className="text-3xl font-black text-white leading-none mb-1">{stats.production}</div>
        <div className="text-xs text-muted-foreground">{stats.testnet} testnet</div>
      </div>

      <div className="rounded-xl border border-border/60 bg-card/60 backdrop-blur p-5 col-span-2 lg:col-span-1">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-amber-500/15 text-amber-400">
            <Coins className="h-4 w-4" />
          </div>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
            Free Tier
          </span>
        </div>
        <div className="text-3xl font-black text-white leading-none mb-1">
          {stats.total > 0 ? `${Math.round((stats.free / stats.total) * 100)}%` : '—'}
        </div>
        <div className="text-xs text-muted-foreground">{stats.free} of {stats.total} facilitators</div>
      </div>

      {/* Row 2: Ecosystem Growth (2 cols) + Chains KPI (1 col) */}
      <div className="rounded-xl border border-border/60 bg-card/60 backdrop-blur p-6 col-span-2 lg:col-span-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-3.5 w-3.5 text-primary" />
            <h3 className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
              Ecosystem Growth
            </h3>
          </div>
          <span className="text-xs text-emerald-400 font-semibold">+900%</span>
        </div>
        <LineChart data={GROWTH_DATA} color="#f97316" gradientId="growth-grad" />
        <p className="text-xs text-muted-foreground mt-2">Facilitators indexed — Jan to Jul 2025</p>
      </div>

      <div className="rounded-xl border border-border/60 bg-card/60 backdrop-blur p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-blue-500/15 text-blue-400">
              <Globe className="h-4 w-4" />
            </div>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
              Chains
            </span>
          </div>
          <div className="text-3xl font-black text-white leading-none mb-1">{stats.chains.length}</div>
          <div className="text-xs text-muted-foreground">{stats.openSource} open source · {stats.selfHostable} self-hostable</div>
        </div>
        {stats.tokens.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border/40">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
              Tokens
            </span>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {stats.tokens.map((t) => (
                <span key={t.name} className="text-xs text-foreground/70 bg-muted/40 rounded px-2 py-0.5">
                  {t.name} ({t.count})
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Row 3: Fee donut (1 col) + Chain adoption line (2 cols) */}
      <div className="rounded-xl border border-border/60 bg-card/60 backdrop-blur p-6">
        <h3 className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-5">
          Fee Distribution
        </h3>
        <div className="flex flex-col items-center gap-5">
          <DonutChart
            segments={[
              { value: stats.free, color: '#34d399', label: 'Free' },
              { value: stats.variable, color: '#fbbf24', label: 'Variable' },
            ]}
            centerLabel={isFiltered ? 'Match' : 'Total'}
          />
          <div className="w-full space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-emerald-400 shrink-0" />
                <span className="text-sm text-foreground/80">Free</span>
              </div>
              <span className="text-lg font-bold text-white">{stats.free}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-amber-400 shrink-0" />
                <span className="text-sm text-foreground/80">Variable</span>
              </div>
              <span className="text-lg font-bold text-white">{stats.variable}</span>
            </div>
          </div>
          {stats.schemes.length > 0 && (
            <div className="w-full pt-3 border-t border-border/40">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                Schemes
              </span>
              <div className="flex flex-wrap gap-2 mt-2">
                {stats.schemes.map((s) => (
                  <span
                    key={s.name}
                    className="text-xs text-foreground/70 bg-muted/40 rounded px-2 py-0.5"
                  >
                    {s.name} ({s.count})
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-border/60 bg-card/60 backdrop-blur p-6 col-span-2 lg:col-span-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <GitBranch className="h-3.5 w-3.5 text-blue-400" />
            <h3 className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
              Chain Adoption
            </h3>
          </div>
          <span className="text-xs text-emerald-400 font-semibold">+600%</span>
        </div>
        <LineChart data={CHAIN_GROWTH_DATA} color="#3b82f6" gradientId="chain-grad" />
        <p className="text-xs text-muted-foreground mt-2">Unique chains supported — Jan to Jul 2025</p>
      </div>

      {/* Row 4: Chain coverage bars — full width */}
      <div className="rounded-xl border border-border/60 bg-card/60 backdrop-blur p-6 col-span-2 lg:col-span-3">
        <h3 className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-5">
          Chain Coverage
        </h3>
        {stats.chains.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
            {stats.chains.map((c) => (
              <BarRow
                key={c.name}
                label={c.name}
                count={c.count}
                max={maxChainCount}
                color={CHAIN_COLORS[c.name] || '#6b7280'}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No chains in selection</p>
        )}
      </div>
    </div>
  );
}
