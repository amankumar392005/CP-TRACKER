import { Link } from 'react-router-dom';
import { ArrowRight, Zap, BarChart3, Bot, TrendingUp, Users, Target, Star, Code2, BookMarked, Shield, CheckCircle2 } from 'lucide-react';

const features = [
  { icon: BarChart3, title: 'Unified Dashboard', desc: 'Codeforces + LeetCode in one beautiful analytics view', color: 'from-primary/20 to-transparent', iconColor: 'text-primary-light', border: 'border-primary/20' },
  { icon: Bot,       title: 'AI Coach',          desc: 'Gemini-powered personalized roadmap and weak topic detection', color: 'from-purple/20 to-transparent', iconColor: 'text-purple-light', border: 'border-purple/20' },
  { icon: TrendingUp,title: 'Rating Tracker',   desc: 'Visualise every contest, every rating change over time', color: 'from-cyan/20 to-transparent', iconColor: 'text-cyan-light', border: 'border-cyan/20' },
  { icon: Users,     title: 'User Comparison',   desc: 'Head-to-head skill radar and rating graphs', color: 'from-green/20 to-transparent', iconColor: 'text-green-light', border: 'border-green/20' },
  { icon: Target,    title: 'Goal Tracker',      desc: 'Set rating targets, track milestones with progress bars', color: 'from-amber/20 to-transparent', iconColor: 'text-amber-light', border: 'border-amber/20' },
  { icon: BookMarked,title: 'Notes & Bookmarks', desc: 'Personal learning journal with contest upsolve notes', color: 'from-rose/20 to-transparent', iconColor: 'text-rose-light', border: 'border-rose/20' },
];

const stats = [
  { value: '2', label: 'Platforms' },
  { value: 'AI', label: 'Powered Coach' },
  { value: '8', label: 'Pages & Features' },
  { value: '∞', label: 'Progress Tracked' },
];

const perks = [
  'Real Codeforces API integration',
  'Real LeetCode GraphQL API',
  'Gemini AI weekly roadmap',
  'Supabase auth + Google OAuth',
  'Row-level security per user',
  'Edge Functions backend',
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-bg overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-bg-border bg-bg/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-cyan rounded-xl flex items-center justify-center shadow-glow-sm">
              <Zap size={15} className="text-white" fill="white"/>
            </div>
            <span className="font-bold text-n-900">CP Tracker <span className="text-primary-light">AI</span></span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/auth" className="btn-ghost text-sm">Sign In</Link>
            <Link to="/auth" className="btn-primary text-sm py-2 px-4">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 flex items-center justify-center min-h-screen">
        {/* BG effects */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"/>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/5 rounded-full blur-3xl pointer-events-none"/>
        <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-cyan/5 rounded-full blur-3xl pointer-events-none"/>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple/5 rounded-full blur-3xl pointer-events-none"/>

        <div className="relative max-w-5xl mx-auto px-4 text-center">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-8">
            <div className="w-2 h-2 bg-primary-light rounded-full animate-pulse-slow"/>
            <span className="text-primary-light text-sm font-medium">Powered by Gemini AI · Production Ready</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-n-900 mb-6 leading-[1.05] tracking-tight">
            Your Competitive<br/>
            <span className="bg-gradient-to-r from-primary-light via-cyan-light to-purple-light bg-clip-text text-transparent">
              Programming HQ
            </span>
          </h1>

          <p className="text-lg md:text-xl text-n-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Unified analytics for Codeforces & LeetCode. AI-powered coaching.
            Smart goal tracking. All in one beautifully designed platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/dashboard" className="btn-primary text-base px-8 py-3.5 rounded-xl shadow-glow group">
              Open Dashboard <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
            </Link>
            <Link to="/auth" className="btn-secondary text-base px-8 py-3.5 rounded-xl">
              <Star size={18} className="text-amber"/>
              Sign Up Free
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-xl mx-auto">
            {stats.map(s => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-black text-n-900 mb-1">{s.value}</div>
                <div className="text-n-500 text-xs">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform logos */}
      <section className="border-y border-bg-border py-10 bg-bg-card">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-n-500 text-sm text-center mb-6">Integrates with</p>
          <div className="flex flex-wrap items-center justify-center gap-10">
            {[
              { name:'Codeforces', color:'bg-primary', icon:<Code2 size={16} className="text-white"/> },
              { name:'LeetCode',   color:'bg-amber',    icon:<Star size={16} className="text-white" fill="white"/> },
              { name:'Gemini AI',  color:'bg-purple',   icon:<Bot size={16} className="text-white"/> },
              { name:'Supabase',   color:'bg-green',    icon:<Shield size={16} className="text-white"/> },
            ].map(p => (
              <div key={p.name} className="flex items-center gap-2.5 opacity-70 hover:opacity-100 transition-opacity">
                <div className={`w-8 h-8 ${p.color} rounded-lg flex items-center justify-center shadow-sm`}>{p.icon}</div>
                <span className="font-semibold text-n-700 text-sm">{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="max-w-6xl mx-auto px-4 py-24">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-black text-n-900 mb-4">Everything you need to reach your target</h2>
          <p className="text-n-500 max-w-xl mx-auto">Built by competitive programmers, for competitive programmers</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div key={f.title} className={`relative rounded-2xl border ${f.border} bg-gradient-to-br ${f.color} p-6 group hover:scale-[1.02] transition-all duration-300 overflow-hidden cursor-default`}
              style={{ animationDelay:`${i*0.08}s` }}>
              <div className="absolute inset-0 bg-bg-hover/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"/>
              <div className={`w-11 h-11 rounded-xl bg-black/20 border ${f.border} flex items-center justify-center mb-4`}>
                <f.icon size={20} className={f.iconColor}/>
              </div>
              <h3 className="font-bold text-n-900 text-lg mb-2">{f.title}</h3>
              <p className="text-n-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Perks list */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <div className="card-p grid sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2 mb-2">
            <h3 className="text-xl font-bold text-n-900">Production-ready from day one</h3>
            <p className="text-n-500 text-sm">Everything wired up — just add your API keys</p>
          </div>
          {perks.map(p => (
            <div key={p} className="flex items-center gap-3 text-sm text-n-700">
              <CheckCircle2 size={15} className="text-green-light shrink-0"/>
              {p}
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-4xl mx-auto px-4 pb-24">
        <div className="relative rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/8 to-cyan/5 p-12 text-center overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.04)_1px,transparent_1px)] bg-[size:40px_40px]"/>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-primary/10 rounded-full blur-3xl"/>
          <div className="relative">
            <Zap size={40} className="text-primary-light mx-auto mb-4" fill="currentColor"/>
            <h2 className="text-3xl font-black text-n-900 mb-3">Start tracking today</h2>
            <p className="text-n-500 mb-8 max-w-md mx-auto">Enter your handles and get instant insights. Free forever.</p>
            <Link to="/dashboard" className="btn-primary text-base px-10 py-4 rounded-xl shadow-glow inline-flex">
              Open Dashboard <ArrowRight size={20}/>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-bg-border py-6">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-primary-light" fill="currentColor"/>
            <span className="font-bold text-n-900 text-sm">CP Tracker AI</span>
          </div>
          <p className="text-n-500 text-xs">React · Tailwind · Recharts · Supabase · Gemini AI</p>
        </div>
      </footer>
    </div>
  );
}
