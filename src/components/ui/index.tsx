import { type ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

// ── Stat Card ──────────────────────────────────────────────────────────────
interface StatCardProps {
  label: string; value: string | number; sub?: string;
  icon: ReactNode; color?: 'blue'|'cyan'|'green'|'amber'|'rose'|'purple';
  trend?: number; loading?: boolean;
}
const colorMap = {
  blue:   { border:'border-primary/20',   bg:'bg-primary/5',   text:'text-primary-light',   icon:'bg-primary/10'   },
  cyan:   { border:'border-cyan/20',      bg:'bg-cyan/5',      text:'text-cyan-light',      icon:'bg-cyan/10'      },
  green:  { border:'border-green/20',     bg:'bg-green/5',     text:'text-green-light',     icon:'bg-green/10'     },
  amber:  { border:'border-amber/20',     bg:'bg-amber/5',     text:'text-amber-light',     icon:'bg-amber/10'     },
  rose:   { border:'border-rose/20',      bg:'bg-rose/5',      text:'text-rose-light',      icon:'bg-rose/10'      },
  purple: { border:'border-purple/20',    bg:'bg-purple/5',    text:'text-purple-light',    icon:'bg-purple/10'    },
};

export function StatCard({ label, value, sub, icon, color='blue', trend, loading }: StatCardProps) {
  const c = colorMap[color];
  if (loading) return (
    <div className="stat-card"><div className="skeleton h-4 w-24 mb-3"/><div className="skeleton h-8 w-20 mb-2"/><div className="skeleton h-3 w-32"/></div>
  );
  return (
    <div className={`stat-card border ${c.border} hover:shadow-glow transition-all`}>
      <div className="flex items-center justify-between">
        <span className="label">{label}</span>
        <div className={`w-9 h-9 ${c.icon} rounded-xl flex items-center justify-center ${c.text}`}>{icon}</div>
      </div>
      <div className={`text-3xl font-bold font-mono ${c.text} tabular-nums`}>{value}</div>
      <div className="flex items-center justify-between">
        {sub && <span className="text-n-500 text-xs">{sub}</span>}
        {trend !== undefined && (
          <span className={`flex items-center gap-1 text-xs font-semibold ${trend>0?'text-green-light':trend<0?'text-rose-light':'text-n-500'}`}>
            {trend>0?<TrendingUp size={11}/>:trend<0?<TrendingDown size={11}/>:<Minus size={11}/>}
            {trend>0?'+':''}{trend}
          </span>
        )}
      </div>
    </div>
  );
}

// ── Section Header ──────────────────────────────────────────────────────────
export function SectionHeader({ title, sub, action }: { title: string; sub?: string; action?: ReactNode }) {
  return (
    <div className="flex items-start justify-between mb-5">
      <div>
        <h2 className="section-title">{title}</h2>
        {sub && <p className="text-n-500 text-sm mt-0.5">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

// ── Progress Bar ────────────────────────────────────────────────────────────
export function Progress({ value, max, color='bg-primary' }: { value: number; max: number; color?: string }) {
  const pct = Math.min(100, Math.round((value/max)*100));
  return (
    <div className="progress-bar">
      <div className={`progress-fill ${color}`} style={{ width:`${pct}%` }}/>
    </div>
  );
}

// ── Badge ───────────────────────────────────────────────────────────────────
export function PlatformBadge({ p }: { p: string }) {
  if (p==='CF') return <span className="badge-blue">CF</span>;
  if (p==='LC') return <span className="badge-amber">LC</span>;
  return <span className="badge badge-purple">{p}</span>;
}

export function DiffBadge({ d }: { d: string|number }) {
  const s = String(d);
  if (s==='Easy') return <span className="badge-green">Easy</span>;
  if (s==='Medium') return <span className="badge-amber">Medium</span>;
  if (s==='Hard') return <span className="badge-rose">Hard</span>;
  const n = parseInt(s);
  if (n>=2600) return <span className="badge-rose">{s}</span>;
  if (n>=2100) return <span className="badge-amber">{s}</span>;
  if (n>=1700) return <span className="badge badge-cyan">{s}</span>;
  return <span className="badge badge-green">{s}</span>;
}

// ── Card wrapper ─────────────────────────────────────────────────────────────
export function Card({ children, className='' }: { children: ReactNode; className?: string }) {
  return <div className={`card-p ${className}`}>{children}</div>;
}

// ── Page Header ──────────────────────────────────────────────────────────────
export function PageHeader({ title, sub, icon, badge }: { title: string; sub: string; icon: ReactNode; badge?: string }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center text-primary-light">
          {icon}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-n-900">{title}</h1>
            {badge && <span className="badge-blue">{badge}</span>}
          </div>
          <p className="text-n-500 text-sm">{sub}</p>
        </div>
      </div>
    </div>
  );
}

// ── Empty State ───────────────────────────────────────────────────────────────
export function Empty({ icon, title, desc }: { icon: ReactNode; title: string; desc: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-14 h-14 bg-bg-hover border border-bg-border rounded-2xl flex items-center justify-center text-n-500 mb-4">{icon}</div>
      <h3 className="text-n-900 font-semibold mb-1">{title}</h3>
      <p className="text-n-500 text-sm max-w-xs">{desc}</p>
    </div>
  );
}

// ── Tooltip ───────────────────────────────────────────────────────────────────
export function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{color:string;name:string;value:number}>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="tooltip-box">
      <p className="text-n-500 mb-2 font-mono">{label}</p>
      {payload.map(p => (
        <p key={p.name} className="font-semibold font-mono" style={{ color:p.color }}>
          {p.name}: {p.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
}
