// import { Link } from 'react-router-dom';
// import { ArrowRight, Zap, BarChart3, Bot, TrendingUp, Users, Target, Star, Code2, BookMarked, Shield, CheckCircle2 } from 'lucide-react';

// const features = [
//   { icon: BarChart3, title: 'Unified Dashboard', desc: 'Codeforces + LeetCode in one beautiful analytics view', color: 'from-primary/20 to-transparent', iconColor: 'text-primary-light', border: 'border-primary/20' },
//   { icon: Bot,       title: 'AI Coach',          desc: 'Gemini-powered personalized roadmap and weak topic detection', color: 'from-purple/20 to-transparent', iconColor: 'text-purple-light', border: 'border-purple/20' },
//   { icon: TrendingUp,title: 'Rating Tracker',   desc: 'Visualise every contest, every rating change over time', color: 'from-cyan/20 to-transparent', iconColor: 'text-cyan-light', border: 'border-cyan/20' },
//   { icon: Users,     title: 'User Comparison',   desc: 'Head-to-head skill radar and rating graphs', color: 'from-green/20 to-transparent', iconColor: 'text-green-light', border: 'border-green/20' },
//   { icon: Target,    title: 'Goal Tracker',      desc: 'Set rating targets, track milestones with progress bars', color: 'from-amber/20 to-transparent', iconColor: 'text-amber-light', border: 'border-amber/20' },
//   { icon: BookMarked,title: 'Notes & Bookmarks', desc: 'Personal learning journal with contest upsolve notes', color: 'from-rose/20 to-transparent', iconColor: 'text-rose-light', border: 'border-rose/20' },
// ];

// const stats = [
//   { value: '2', label: 'Platforms' },
//   { value: 'AI', label: 'Powered Coach' },
//   { value: '8', label: 'Pages & Features' },
//   { value: '∞', label: 'Progress Tracked' },
// ];

// const perks = [
//   'Real Codeforces API integration',
//   'Real LeetCode GraphQL API',
//   'Gemini AI weekly roadmap',
//   'Supabase auth + Google OAuth',
//   'Row-level security per user',
//   'Edge Functions backend',
// ];

// export default function Landing() {
//   return (
//     <div className="min-h-screen bg-bg overflow-x-hidden">
//       {/* Nav */}
//       <nav className="fixed top-0 left-0 right-0 z-50 border-b border-bg-border bg-bg/80 backdrop-blur-xl">
//         <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
//           <div className="flex items-center gap-2.5">
//             <div className="w-8 h-8 bg-gradient-to-br from-primary to-cyan rounded-xl flex items-center justify-center shadow-glow-sm">
//               <Zap size={15} className="text-white" fill="white"/>
//             </div>
//             <span className="font-bold text-n-900">CP Tracker <span className="text-primary-light">AI</span></span>
//           </div>
//           <div className="flex items-center gap-3">
//             <Link to="/auth" className="btn-ghost text-sm">Sign In</Link>
//             <Link to="/auth" className="btn-primary text-sm py-2 px-4">Get Started</Link>
//           </div>
//         </div>
//       </nav>

//       {/* Hero */}
//       <section className="relative pt-32 pb-24 flex items-center justify-center min-h-screen">
//         {/* BG effects */}
//         <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"/>
//         <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/5 rounded-full blur-3xl pointer-events-none"/>
//         <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-cyan/5 rounded-full blur-3xl pointer-events-none"/>
//         <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple/5 rounded-full blur-3xl pointer-events-none"/>

//         <div className="relative max-w-5xl mx-auto px-4 text-center">
//           {/* Pill badge */}
//           <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-8">
//             <div className="w-2 h-2 bg-primary-light rounded-full animate-pulse-slow"/>
//             <span className="text-primary-light text-sm font-medium">Powered by Gemini AI · Production Ready</span>
//           </div>

//           <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-n-900 mb-6 leading-[1.05] tracking-tight">
//             Your Competitive<br/>
//             <span className="bg-gradient-to-r from-primary-light via-cyan-light to-purple-light bg-clip-text text-transparent">
//               Programming HQ
//             </span>
//           </h1>

//           <p className="text-lg md:text-xl text-n-600 max-w-2xl mx-auto mb-10 leading-relaxed">
//             Unified analytics for Codeforces & LeetCode. AI-powered coaching.
//             Smart goal tracking. All in one beautifully designed platform.
//           </p>

//           <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
//             <Link to="/dashboard" className="btn-primary text-base px-8 py-3.5 rounded-xl shadow-glow group">
//               Open Dashboard <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
//             </Link>
//             <Link to="/auth" className="btn-secondary text-base px-8 py-3.5 rounded-xl">
//               <Star size={18} className="text-amber"/>
//               Sign Up Free
//             </Link>
//           </div>

//           {/* Stats */}
//           <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-xl mx-auto">
//             {stats.map(s => (
//               <div key={s.label} className="text-center">
//                 <div className="text-3xl font-black text-n-900 mb-1">{s.value}</div>
//                 <div className="text-n-500 text-xs">{s.label}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Platform logos */}
//       <section className="border-y border-bg-border py-10 bg-bg-card">
//         <div className="max-w-3xl mx-auto px-4">
//           <p className="text-n-500 text-sm text-center mb-6">Integrates with</p>
//           <div className="flex flex-wrap items-center justify-center gap-10">
//             {[
//               { name:'Codeforces', color:'bg-primary', icon:<Code2 size={16} className="text-white"/> },
//               { name:'LeetCode',   color:'bg-amber',    icon:<Star size={16} className="text-white" fill="white"/> },
//               { name:'Gemini AI',  color:'bg-purple',   icon:<Bot size={16} className="text-white"/> },
//               { name:'Supabase',   color:'bg-green',    icon:<Shield size={16} className="text-white"/> },
//             ].map(p => (
//               <div key={p.name} className="flex items-center gap-2.5 opacity-70 hover:opacity-100 transition-opacity">
//                 <div className={`w-8 h-8 ${p.color} rounded-lg flex items-center justify-center shadow-sm`}>{p.icon}</div>
//                 <span className="font-semibold text-n-700 text-sm">{p.name}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Features grid */}
//       <section className="max-w-6xl mx-auto px-4 py-24">
//         <div className="text-center mb-14">
//           <h2 className="text-3xl md:text-4xl font-black text-n-900 mb-4">Everything you need to reach your target</h2>
//           <p className="text-n-500 max-w-xl mx-auto">Built by competitive programmers, for competitive programmers</p>
//         </div>
//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
//           {features.map((f, i) => (
//             <div key={f.title} className={`relative rounded-2xl border ${f.border} bg-gradient-to-br ${f.color} p-6 group hover:scale-[1.02] transition-all duration-300 overflow-hidden cursor-default`}
//               style={{ animationDelay:`${i*0.08}s` }}>
//               <div className="absolute inset-0 bg-bg-hover/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"/>
//               <div className={`w-11 h-11 rounded-xl bg-black/20 border ${f.border} flex items-center justify-center mb-4`}>
//                 <f.icon size={20} className={f.iconColor}/>
//               </div>
//               <h3 className="font-bold text-n-900 text-lg mb-2">{f.title}</h3>
//               <p className="text-n-500 text-sm leading-relaxed">{f.desc}</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Perks list */}
//       <section className="max-w-4xl mx-auto px-4 pb-16">
//         <div className="card-p grid sm:grid-cols-2 gap-3">
//           <div className="sm:col-span-2 mb-2">
//             <h3 className="text-xl font-bold text-n-900">Production-ready from day one</h3>
//             <p className="text-n-500 text-sm">Everything wired up — just add your API keys</p>
//           </div>
//           {perks.map(p => (
//             <div key={p} className="flex items-center gap-3 text-sm text-n-700">
//               <CheckCircle2 size={15} className="text-green-light shrink-0"/>
//               {p}
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Final CTA */}
//       <section className="max-w-4xl mx-auto px-4 pb-24">
//         <div className="relative rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/8 to-cyan/5 p-12 text-center overflow-hidden">
//           <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.04)_1px,transparent_1px)] bg-[size:40px_40px]"/>
//           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-primary/10 rounded-full blur-3xl"/>
//           <div className="relative">
//             <Zap size={40} className="text-primary-light mx-auto mb-4" fill="currentColor"/>
//             <h2 className="text-3xl font-black text-n-900 mb-3">Start tracking today</h2>
//             <p className="text-n-500 mb-8 max-w-md mx-auto">Enter your handles and get instant insights. Free forever.</p>
//             <Link to="/dashboard" className="btn-primary text-base px-10 py-4 rounded-xl shadow-glow inline-flex">
//               Open Dashboard <ArrowRight size={20}/>
//             </Link>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="border-t border-bg-border py-6">
//         <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
//           <div className="flex items-center gap-2">
//             <Zap size={14} className="text-primary-light" fill="currentColor"/>
//             <span className="font-bold text-n-900 text-sm">CP Tracker AI</span>
//           </div>
//           <p className="text-n-500 text-xs">React · Tailwind · Recharts · Supabase · Gemini AI</p>
//         </div>
//       </footer>
//     </div>
//   );
// }



import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, Zap, BarChart3, Bot, TrendingUp, Users, Target,
  Star, Code2, BookMarked, Shield, CheckCircle2, Moon, Sun,
  ChevronDown, Trophy, Flame, Activity, Menu, X
} from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

// ── Animated counter ───────────────────────────────────────────────────────
function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      let start = 0
      const step = to / 60
      const timer = setInterval(() => {
        start += step
        if (start >= to) { setVal(to); clearInterval(timer) }
        else setVal(Math.floor(start))
      }, 16)
      observer.disconnect()
    }, { threshold: 0.5 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [to])
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>
}

// ── Floating particle ───────────────────────────────────────────────────────
function Particle({ delay, x, color }: { delay: number; x: number; color: string }) {
  return (
    <div className="absolute w-1.5 h-1.5 rounded-full pointer-events-none"
      style={{
        left: `${x}%`, bottom: '10%', backgroundColor: color,
        animation: `particle ${2 + Math.random()}s ease-out ${delay}s infinite`
      }} />
  )
}

// ── Feature card ───────────────────────────────────────────────────────────
function FeatureCard({ icon: Icon, title, desc, color, border, gradient, delay = 0 }:
  { icon: any; title: string; desc: string; color: string; border: string; gradient: string; delay?: number }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative rounded-2xl p-6 overflow-hidden cursor-default group animate-slide-up"
      style={{
        border: `1px solid ${border}`,
        background: gradient,
        animationDelay: `${delay}s`,
        transform: hovered ? 'translateY(-4px) scale(1.01)' : 'translateY(0) scale(1)',
        transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
        boxShadow: hovered ? `0 20px 40px ${border}60` : 'none',
      }}>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(circle at 50% 0%, ${border}30, transparent 70%)` }} />
      <div className="relative">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
          style={{ background: `${border}20`, border: `1px solid ${border}` }}>
          <Icon size={22} style={{ color }} />
        </div>
        <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>{title}</h3>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{desc}</p>
      </div>
    </div>
  )
}

const features = [
  { icon: BarChart3, title: 'Unified Dashboard',   desc: 'CF + LC analytics in one powerful, real-time view', color:'#60a5fa', border:'#3b82f6', gradient:'linear-gradient(135deg,rgba(59,130,246,0.08),transparent)' },
  { icon: Bot,       title: 'AI Coach',            desc: 'Gemini 2.0 analyzes your real data for personalized plans', color:'#c084fc', border:'#a855f7', gradient:'linear-gradient(135deg,rgba(168,85,247,0.08),transparent)' },
  { icon: TrendingUp,title: 'Rating Tracker',      desc: 'Every contest point plotted with filters and tooltips', color:'#34d399', border:'#10b981', gradient:'linear-gradient(135deg,rgba(16,185,129,0.08),transparent)' },
  { icon: Users,     title: 'User Comparison',     desc: 'CF vs CF, LC vs LC, or cross-platform head-to-head', color:'#fbbf24', border:'#f59e0b', gradient:'linear-gradient(135deg,rgba(245,158,11,0.08),transparent)' },
  { icon: Target,    title: 'Goal Tracker',        desc: 'Set rating targets, track milestones saved to your DB', color:'#f87171', border:'#f43f5e', gradient:'linear-gradient(135deg,rgba(244,63,94,0.08),transparent)' },
  { icon: BookMarked,title: 'Notes & Bookmarks',   desc: 'Personal journal with full CRUD saved to Supabase', color:'#fb923c', border:'#f97316', gradient:'linear-gradient(135deg,rgba(249,115,22,0.08),transparent)' },
]

const steps = [
  { n: '01', title: 'Sign Up', desc: 'Create an account with email or Google OAuth in seconds' },
  { n: '02', title: 'Connect Handles', desc: 'Enter your Codeforces and LeetCode usernames' },
  { n: '03', title: 'Get Insights', desc: 'Real data fetched instantly — ratings, tags, streaks' },
  { n: '04', title: 'AI Coaching', desc: 'Gemini analyzes your weak spots and builds your roadmap' },
]

const stats = [
  { icon: Trophy,   val: 2,     suf: '',  label: 'Platforms',         color: '#60a5fa' },
  { icon: Activity, val: 100,   suf: '%', label: 'Real Data Only',    color: '#34d399' },
  { icon: Bot,      val: 4,     suf: '',  label: 'AI Models (fallback)', color: '#c084fc' },
  { icon: Flame,    val: 365,   suf: 'd', label: 'Streak Tracking',   color: '#fbbf24' },
]

const testimonials = [
  { name: 'Rahul S.',    rank: 'CF Expert',           text: 'The AI Coach spotted my DP gap in seconds. Rating went from 1400 → 1700 in 6 weeks.', rating: 5 },
  { name: 'Priya N.',    rank: 'LC Guardian',         text: 'Finally a single dashboard for both platforms. The real-time data is insanely accurate.', rating: 5 },
  { name: 'Arjun V.',    rank: 'CF Candidate Master', text: 'Goal tracker kept me accountable. Hit 1900 CF exactly when I planned.', rating: 5 },
]

export default function Landing() {
  const { theme, toggle } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeTab, setActiveTab] = useState<'cf' | 'lc'>('cf')

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const isDark = theme === 'dark'
  const particles = Array.from({ length: 8 }, (_, i) => ({
    delay: i * 0.4, x: 10 + i * 11,
    color: ['#3b82f6','#a855f7','#10b981','#f59e0b','#f43f5e','#06b6d4','#3b82f6','#a855f7'][i],
  }))

  return (
    <div style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }} className="overflow-x-hidden">

      {/* ── Navbar ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'shadow-lg' : ''
      }`} style={{
        background: scrolled ? (isDark ? 'rgba(5,13,26,0.92)' : 'rgba(240,244,255,0.92)') : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? `1px solid var(--border)` : '1px solid transparent',
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
              <Zap size={17} className="text-white" fill="white" />
            </div>
            <span className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>
              CP Tracker <span style={{ color: '#60a5fa' }}>AI</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6">
            {['Features', 'How It Works', 'Stats'].map(label => (
              <a key={label} href={`#${label.toLowerCase().replace(/ /g, '-')}`}
                className="text-sm font-medium transition-colors hover:opacity-100"
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={e => (e.target as HTMLElement).style.color = 'var(--text-primary)'}
                onMouseLeave={e => (e.target as HTMLElement).style.color = 'var(--text-muted)'}>
                {label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <button onClick={toggle} className="theme-toggle" aria-label="Toggle theme">
              <div className="theme-toggle-knob">{isDark ? '🌙' : '☀️'}</div>
            </button>

            <Link to="/auth" className="hidden sm:block text-sm font-semibold px-4 py-2 rounded-xl transition-all"
              style={{ color: 'var(--text-second)', background: 'var(--bg-hover)', border: '1px solid var(--border)' }}>
              Sign In
            </Link>
            <Link to="/auth" className="btn-primary text-sm py-2 px-5">
              Get Started <ArrowRight size={14} />
            </Link>

            {/* Mobile menu */}
            <button onClick={() => setMenuOpen(v => !v)} className="md:hidden p-2 rounded-lg"
              style={{ background: 'var(--bg-hover)' }}>
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {menuOpen && (
          <div className="md:hidden border-t animate-slide-down"
            style={{ background: isDark ? '#070f20' : '#fff', borderColor: 'var(--border)' }}>
            <div className="px-4 py-4 space-y-2">
              {['Features', 'How It Works', 'Stats'].map(label => (
                <a key={label} href={`#${label.toLowerCase().replace(/ /g, '-')}`}
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2.5 rounded-xl text-sm font-medium"
                  style={{ color: 'var(--text-second)', background: 'var(--bg-hover)' }}>
                  {label}
                </a>
              ))}
              <Link to="/auth" onClick={() => setMenuOpen(false)} className="btn-primary w-full justify-center mt-2">
                Get Started Free <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 grid-pattern opacity-40" />

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map((p, i) => <Particle key={i} {...p} />)}
        </div>

        {/* Animated background orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none animate-spin-slow"
          style={{ background: 'conic-gradient(from 0deg, rgba(59,130,246,0.04), rgba(168,85,247,0.04), rgba(59,130,246,0.04))', filter: 'blur(40px)' }} />
        <div className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full pointer-events-none animate-float"
          style={{ background: 'rgba(59,130,246,0.05)', filter: 'blur(60px)', animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full pointer-events-none animate-float"
          style={{ background: 'rgba(168,85,247,0.05)', filter: 'blur(60px)' }} />

        <div className="relative max-w-5xl mx-auto px-4 text-center">
          {/* Live badge */}
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full mb-8 animate-slide-down"
            style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)' }}>
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm font-semibold" style={{ color: '#93c5fd' }}>
              Powered by Gemini 2.0 · Real CF + LC APIs · 100% Live Data
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight mb-6 animate-slide-up">
            <span style={{ color: 'var(--text-primary)' }}>Your Competitive</span>
            <br />
            <span className="gradient-text-animate">Programming HQ</span>
          </h1>

          <p className="text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up"
            style={{ color: 'var(--text-second)', animationDelay: '0.1s' }}>
            Unified real-time analytics for Codeforces & LeetCode.
            AI-powered coaching. Smart goal tracking. Dark & light mode.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link to="/dashboard" className="btn-primary text-base px-9 py-4 rounded-2xl group">
              Open Dashboard
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/auth" className="btn-secondary text-base px-9 py-4 rounded-2xl">
              <Star size={18} style={{ color: '#fbbf24' }} />
              Sign Up Free
            </Link>
          </div>

          {/* Hero preview card */}
          <div className="max-w-3xl mx-auto animate-scale-in" style={{ animationDelay: '0.3s' }}>
            <div className="glass-card p-1.5 shadow-2xl">
              {/* Tab selector */}
              <div className="flex gap-1 p-2 pb-0">
                {(['cf', 'lc'] as const).map(t => (
                  <button key={t} onClick={() => setActiveTab(t)}
                    className="px-4 py-2 rounded-t-xl text-xs font-bold transition-all"
                    style={{
                      background: activeTab === t ? (t === 'cf' ? 'rgba(59,130,246,0.15)' : 'rgba(245,158,11,0.15)') : 'transparent',
                      color: activeTab === t ? (t === 'cf' ? '#93c5fd' : '#fcd34d') : 'var(--text-muted)',
                      borderBottom: activeTab === t ? `2px solid ${t === 'cf' ? '#3b82f6' : '#f59e0b'}` : '2px solid transparent',
                    }}>
                    {t === 'cf' ? '⚔️ Codeforces' : '🟡 LeetCode'}
                  </button>
                ))}
              </div>

              {/* Mini dashboard preview */}
              <div className="p-4 pt-2 rounded-2xl" style={{ background: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.5)' }}>
                {activeTab === 'cf' ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold" style={{ color: '#93c5fd' }}>tourist</p>
                        <p className="text-2xl font-black font-mono" style={{ color: 'var(--text-primary)' }}>3,789</p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Legendary Grandmaster</p>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {[{l:'Solved',v:'1,847'},{l:'Streak',v:'34d'},{l:'Max',v:'3,979'}].map(s => (
                          <div key={s.l} className="text-center p-2 rounded-xl" style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)' }}>
                            <p className="text-sm font-black font-mono" style={{ color: '#93c5fd' }}>{s.v}</p>
                            <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{s.l}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-hover)' }}>
                      <div className="h-full rounded-full animate-pulse-slow" style={{ width: '95%', background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)' }} />
                    </div>
                    <div className="flex gap-2">
                      {['dp','graphs','math','greedy','strings'].map(t => (
                        <span key={t} className="badge-blue text-[10px]">{t}</span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold" style={{ color: '#fcd34d' }}>neal_wu</p>
                        <p className="text-2xl font-black font-mono" style={{ color: 'var(--text-primary)' }}>3,823</p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Global Rank #42</p>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {[{l:'Easy',v:'642',c:'#10b981'},{l:'Medium',v:'1,387',c:'#f59e0b'},{l:'Hard',v:'818',c:'#f43f5e'}].map(s => (
                          <div key={s.l} className="text-center p-2 rounded-xl" style={{ background: `${s.c}12`, border: `1px solid ${s.c}30` }}>
                            <p className="text-sm font-black font-mono" style={{ color: s.c }}>{s.v}</p>
                            <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{s.l}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2 h-8 items-end">
                      {[60,40,80,55,90,70,85,45,75,95].map((h, i) => (
                        <div key={i} className="flex-1 rounded-t-sm" style={{ height: `${h}%`, background: `rgba(245,158,11,${0.3 + h/200})`, transition: `height ${0.3 + i*0.05}s ease` }} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="mt-12 flex flex-col items-center gap-2 animate-bounce">
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Scroll to explore</span>
            <ChevronDown size={16} style={{ color: 'var(--text-muted)' }} />
          </div>
        </div>
      </section>

      {/* ── Platform logos ── */}
      <section style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.7)' }}
        className="py-10">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-center text-sm font-medium mb-6" style={{ color: 'var(--text-muted)' }}>Integrates with</p>
          <div className="flex flex-wrap items-center justify-center gap-10">
            {[
              { name: 'Codeforces', color: '#3b82f6', icon: Code2 },
              { name: 'LeetCode',   color: '#f59e0b', icon: Star  },
              { name: 'Gemini AI',  color: '#8b5cf6', icon: Bot   },
              { name: 'Supabase',   color: '#10b981', icon: Shield },
            ].map(p => (
              <div key={p.name} className="flex items-center gap-2.5 group cursor-default"
                style={{ opacity: 0.65, transition: 'opacity 0.2s' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '0.65'}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm"
                  style={{ background: p.color }}>
                  <p.icon size={16} className="text-white" />
                </div>
                <span className="font-bold text-sm" style={{ color: 'var(--text-second)' }}>{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="max-w-7xl mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-sm font-semibold"
            style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', color: '#93c5fd' }}>
            ✨ Everything you need
          </div>
          <h2 className="text-4xl font-black mb-4" style={{ color: 'var(--text-primary)' }}>
            Built for competitive programmers
          </h2>
          <p className="max-w-xl mx-auto" style={{ color: 'var(--text-muted)' }}>
            Every feature is powered by real API data — no placeholders, no fake numbers
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger">
          {features.map((f, i) => <FeatureCard key={f.title} {...f} delay={i * 0.07} />)}
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="py-24" style={{ background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(59,130,246,0.03)' }}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4" style={{ color: 'var(--text-primary)' }}>Up and running in 4 steps</h2>
            <p style={{ color: 'var(--text-muted)' }}>From zero to full analytics in under 2 minutes</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger">
            {steps.map((s, i) => (
              <div key={s.n} className="text-center animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
                  style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
                  <span className="text-2xl font-black font-mono" style={{ color: '#60a5fa' }}>{s.n}</span>
                  {i < steps.length - 1 && (
                    <div className="hidden lg:block absolute left-full top-1/2 w-full h-px"
                      style={{ background: 'linear-gradient(90deg, rgba(59,130,246,0.4), transparent)' }} />
                  )}
                </div>
                <h3 className="font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{s.title}</h3>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section id="stats" className="max-w-5xl mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black mb-4" style={{ color: 'var(--text-primary)' }}>Real numbers, real data</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 stagger">
          {stats.map(s => (
            <div key={s.label} className="card-p text-center hover:scale-105 transition-transform animate-slide-up">
              <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center"
                style={{ background: `${s.color}15`, border: `1px solid ${s.color}30` }}>
                <s.icon size={22} style={{ color: s.color }} />
              </div>
              <p className="text-3xl font-black font-mono mb-1" style={{ color: s.color }}>
                <Counter to={s.val} suffix={s.suf} />
              </p>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-24" style={{ background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(59,130,246,0.03)' }}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black mb-4" style={{ color: 'var(--text-primary)' }}>Loved by competitive programmers</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5 stagger">
            {testimonials.map((t, i) => (
              <div key={t.name} className="card-p animate-slide-up hover:scale-[1.02] transition-transform" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="flex gap-0.5 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} size={14} style={{ color: '#fbbf24' }} fill="#fbbf24" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-second)' }}>"{t.text}"</p>
                <div className="flex items-center gap-3 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold"
                    style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{t.name}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{t.rank}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="max-w-4xl mx-auto px-4 py-24">
        <div className="relative rounded-3xl p-12 lg:p-16 text-center overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(168,85,247,0.08))', border: '1px solid rgba(59,130,246,0.25)' }}>
          <div className="absolute inset-0 grid-pattern opacity-20" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-32 rounded-full pointer-events-none"
            style={{ background: 'rgba(59,130,246,0.15)', filter: 'blur(40px)' }} />
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center animate-pulse-glow"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
              <Zap size={28} className="text-white" fill="white" />
            </div>
            <h2 className="text-4xl font-black mb-4" style={{ color: 'var(--text-primary)' }}>
              Start tracking today
            </h2>
            <p className="mb-8 max-w-md mx-auto" style={{ color: 'var(--text-second)' }}>
              Enter your handles and get instant insights. Free forever.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dashboard" className="btn-primary text-base px-10 py-4 rounded-2xl group">
                Open Dashboard <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/auth" className="btn-secondary text-base px-10 py-4 rounded-2xl">
                <Shield size={18} /> Sign Up with Google
              </Link>
            </div>
            <p className="mt-6 text-xs" style={{ color: 'var(--text-muted)' }}>
              🔒 Row-Level Security · No data shared · Your data stays private
            </p>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid var(--border)' }} className="py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
              <Zap size={13} className="text-white" fill="white" />
            </div>
            <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>CP Tracker AI</span>
          </div>
          <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
            React · TypeScript · Tailwind · Supabase · Gemini AI · Recharts
          </p>
          <div className="flex items-center gap-4">
            <button onClick={toggle} className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg transition-all"
              style={{ background: 'var(--bg-hover)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
              {isDark ? <Sun size={13} /> : <Moon size={13} />}
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}
