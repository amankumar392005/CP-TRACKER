import { type ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

// ── Stat Card ──────────────────────────────────────────────────────────────
interface StatCardProps {
  label: string; value: string | number; sub?: string;
  icon: ReactNode; color?: 'blue'|'cyan'|'green'|'amber'|'rose'|'purple';
  trend?: number; loading?: boolean;
}
const colorMap = {
  blue:   { badge: 'badge-blue',   accent: '#3b82f6', dimBg: 'rgba(59,130,246,0.09)',  dimBorder: 'rgba(59,130,246,0.2)' },
  cyan:   { badge: 'badge-cyan',   accent: '#06b6d4', dimBg: 'rgba(6,182,212,0.09)',   dimBorder: 'rgba(6,182,212,0.2)' },
  green:  { badge: 'badge-green',  accent: '#10b981', dimBg: 'rgba(16,185,129,0.09)',  dimBorder: 'rgba(16,185,129,0.2)' },
  amber:  { badge: 'badge-amber',  accent: '#f59e0b', dimBg: 'rgba(245,158,11,0.09)',  dimBorder: 'rgba(245,158,11,0.2)' },
  rose:   { badge: 'badge-rose',   accent: '#f43f5e', dimBg: 'rgba(244,63,94,0.09)',   dimBorder: 'rgba(244,63,94,0.2)' },
  purple: { badge: 'badge-purple', accent: '#a855f7', dimBg: 'rgba(168,85,247,0.09)',  dimBorder: 'rgba(168,85,247,0.2)' },
};

export function StatCard({ label, value, sub, icon, color='blue', trend, loading }: StatCardProps) {
  const c = colorMap[color];
  if (loading) return (
    <div className="stat-card">
      <div className="skeleton h-4 w-24 mb-3"/>
      <div className="skeleton h-8 w-20 mb-2"/>
      <div className="skeleton h-3 w-32"/>
    </div>
  );
  return (
    <div className="stat-card" style={{ borderColor: c.dimBorder }}>
      <div className="flex items-center justify-between">
        <span className="label">{label}</span>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: c.dimBg, color: c.accent }}>
          {icon}
        </div>
      </div>
      <div className="text-3xl font-bold font-mono tabular-nums" style={{ color: c.accent }}>{value}</div>
      <div className="flex items-center justify-between">
        {sub && <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{sub}</span>}
        {trend !== undefined && (
          <span className="flex items-center gap-1 text-xs font-semibold"
            style={{ color: trend>0?'#34d399':trend<0?'#f87171':'var(--text-muted)' }}>
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
        {sub && <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>{sub}</p>}
      </div>
      {action}
    </div>
  );
}

// ── Progress Bar ────────────────────────────────────────────────────────────
export function Progress({ value, max, color='#3b82f6' }: { value: number; max: number; color?: string }) {
  const pct = Math.min(100, Math.round((value/max)*100));
  return (
    <div className="progress-bar">
      <div className="progress-fill" style={{ width:`${pct}%`, background: color }}/>
    </div>
  );
}

// ── Badge ───────────────────────────────────────────────────────────────────
export function PlatformBadge({ p }: { p: string }) {
  if (p==='CF') return <span className="badge badge-blue">CF</span>;
  if (p==='LC') return <span className="badge badge-amber">LC</span>;
  return <span className="badge badge-purple">{p}</span>;
}

export function DiffBadge({ d }: { d: string|number }) {
  const s = String(d);
  if (s==='Easy')   return <span className="badge badge-green">Easy</span>;
  if (s==='Medium') return <span className="badge badge-amber">Medium</span>;
  if (s==='Hard')   return <span className="badge badge-rose">Hard</span>;
  const n = parseInt(s);
  if (n>=2600) return <span className="badge badge-rose">{s}</span>;
  if (n>=2100) return <span className="badge badge-amber">{s}</span>;
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
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', color: '#60a5fa' }}>
          {icon}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{title}</h1>
            {badge && <span className="badge badge-blue">{badge}</span>}
          </div>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{sub}</p>
        </div>
      </div>
    </div>
  );
}

// ── Empty State ───────────────────────────────────────────────────────────────
export function Empty({ icon, title, desc }: { icon: ReactNode; title: string; desc: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: 'var(--bg-hover)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
        {icon}
      </div>
      <h3 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{title}</h3>
      <p className="text-sm max-w-xs" style={{ color: 'var(--text-muted)' }}>{desc}</p>
    </div>
  );
}

// ── Chart Tooltip ───────────────────────────────────────────────────────────────
export function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{color:string;name:string;value:number}>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="tooltip-box">
      <p className="font-mono mb-2" style={{ color: 'var(--text-muted)' }}>{label}</p>
      {payload.map(p => (
        <p key={p.name} className="font-semibold font-mono" style={{ color:p.color }}>
          {p.name}: {p.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
}
