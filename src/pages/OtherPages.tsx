// import { useEffect, useState } from 'react'
// import {
//   BarChart3, Code2, StickyNote, Trophy, TrendingUp, Zap, AlertCircle,
//   Bot, ExternalLink, BookOpen, Calendar, Users, Search, Target, Plus,
//   CheckCircle, Trash2, BookMarked, Star, Clock, Link, Pencil, Loader2
// } from 'lucide-react'
// import {
//   RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
//   BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid,
//   PieChart, Pie, Cell, Sector
// } from 'recharts'
// import { StatCard, PageHeader, Card, SectionHeader, ChartTooltip } from '../components/ui'
// import { useAuth } from '../context/AuthContext'
// import {
//   loadCFData, loadLCData, fetchCFData, fetchLCData, saveCFData, saveLCData,
//   generateAIPlan, saveAISession, getLatestAISession,
//   getGoals, createGoal, deleteGoal, updateGoal,
//   getNotes, createNote, updateNote as updNote, deleteNote as delNote,
//   type CFData, type LCData, type AIResult, type Goal, type Note
// } from '../services/api'

// // ═══════════════════════════════════════════════════════════════════════════
// // ANALYTICS PAGE
// // ═══════════════════════════════════════════════════════════════════════════
// export function AnalyticsPage() {
//   const { user } = useAuth()
//   const [cfData, setCf] = useState<CFData | null>(null)
//   const [lcData, setLc] = useState<LCData | null>(null)

//   useEffect(() => {
//     if (!user) return
//     loadCFData(user.id).then(d => { if (d) setCf(d) })
//     loadLCData(user.id).then(d => { if (d) setLc(d) })
//   }, [user])

//   const totalSolved = (cfData?.totalSolved ?? 0) + (lcData?.totalSolved ?? 0)

//   const cfTags = Object.entries(cfData?.tagDistribution ?? {}).sort(([, a], [, b]) => b - a).slice(0, 8)
//   const lcTags = Object.entries(lcData?.tagDistribution ?? {}).sort(([, a], [, b]) => b - a).slice(0, 8)
//   const allTagKeys = [...new Set([...cfTags.map(([t]) => t), ...lcTags.map(([t]) => t)])].slice(0, 8)
//   const maxCF = cfTags[0]?.[1] ?? 1
//   const maxLC = lcTags[0]?.[1] ?? 1
//   const radarData = allTagKeys.map(t => ({
//     skill: t.length > 10 ? t.slice(0, 9) + '…' : t,
//     cf: Math.round(((cfData?.tagDistribution ?? {})[t] ?? 0) / maxCF * 100),
//     lc: Math.round(((lcData?.tagDistribution ?? {})[t] ?? 0) / maxLC * 100),
//   }))

//   const ratingChart = (() => {
//     const cf = cfData?.ratingHistory ?? []
//     const lc = lcData?.ratingHistory ?? []
//     const len = Math.min(Math.max(cf.length, lc.length, 1), 12)
//     return Array.from({ length: len }, (_, i) => {
//       const ci = Math.floor(i / len * cf.length)
//       const li = Math.floor(i / len * lc.length)
//       return { m: cf[ci]?.date ?? lc[li]?.date ?? `M${i + 1}`, cf: cf[ci]?.rating, lc: lc[li]?.rating }
//     })
//   })()

//   const weekly = [
//     { day: 'Mon', cf: 4, lc: 3 }, { day: 'Tue', cf: 2, lc: 5 },
//     { day: 'Wed', cf: 6, lc: 2 }, { day: 'Thu', cf: 3, lc: 4 },
//     { day: 'Fri', cf: 5, lc: 6 }, { day: 'Sat', cf: 8, lc: 7 }, { day: 'Sun', cf: 7, lc: 5 },
//   ]

//   const sortedCF = Object.entries(cfData?.tagDistribution ?? {}).sort(([, a], [, b]) => b - a)
//   const strong = sortedCF.slice(0, 5).map(([t]) => t)
//   const weak = sortedCF.slice(-5).map(([t]) => t).reverse()

//   return (
//     <div className="flex-1 p-5 lg:p-8 space-y-6 animate-fade-in">
//       <PageHeader title="Combined Analytics" sub="Your full competitive programming picture" icon={<BarChart3 size={20} />} />

//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//         <StatCard label="Total Solved" value={totalSolved.toLocaleString()} icon={<Trophy size={16} />} color="green" sub="Both platforms" />
//         <StatCard label="CF Solved" value={cfData?.totalSolved ?? '—'} icon={<Code2 size={16} />} color="blue" sub={cfData ? `Rating: ${cfData.rating}` : 'Connect CF'} />
//         <StatCard label="LC Solved" value={lcData?.totalSolved ?? '—'} icon={<StickyNote size={16} />} color="amber" sub={lcData ? `Rating: ${lcData.contestRating}` : 'Connect LC'} />
//         <StatCard label="CF + LC Rating" value={(cfData?.rating ?? 0) + (lcData?.contestRating ?? 0) || '—'} icon={<TrendingUp size={16} />} color="cyan" sub="Combined" />
//       </div>

//       {(strong.length > 0 || weak.length > 0) && (
//         <div className="grid sm:grid-cols-2 gap-4">
//           <Card className="border-green/20 bg-green/5">
//             <SectionHeader title="💪 Strongest Topics (Real Data)" />
//             <div className="space-y-2">
//               {strong.map(s => (
//                 <div key={s} className="flex items-center gap-2 text-sm">
//                   <div className="w-1.5 h-1.5 rounded-full bg-green-light" />
//                   <span className="text-n-700 capitalize">{s}</span>
//                 </div>
//               ))}
//             </div>
//           </Card>
//           <Card className="border-rose/20 bg-rose/5">
//             <SectionHeader title="📉 Weakest Topics (Real Data)" />
//             <div className="space-y-2">
//               {weak.map(s => (
//                 <div key={s} className="flex items-center gap-2 text-sm">
//                   <div className="w-1.5 h-1.5 rounded-full bg-rose-light" />
//                   <span className="text-n-700 capitalize">{s}</span>
//                 </div>
//               ))}
//             </div>
//           </Card>
//         </div>
//       )}

//       <div className="grid lg:grid-cols-2 gap-5">
//         {radarData.length > 0 ? (
//           <Card>
//             <SectionHeader title="Skill Radar" sub="CF vs LC topic mastery" />
//             <ResponsiveContainer width="100%" height={250}>
//               <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
//                 <PolarGrid stroke="#1a2d4a" />
//                 <PolarAngleAxis dataKey="skill" tick={{ fill: '#6b7280', fontSize: 9 }} />
//                 <Radar dataKey="cf" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} strokeWidth={2} name="CF" />
//                 <Radar dataKey="lc" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.15} strokeWidth={2} name="LC" />
//               </RadarChart>
//             </ResponsiveContainer>
//           </Card>
//         ) : (
//           <Card><div className="h-64 flex items-center justify-center text-n-500 text-sm">Connect handles to see skill radar</div></Card>
//         )}

//         <Card>
//           <SectionHeader title="Weekly Activity" sub="Demo data" />
//           <ResponsiveContainer width="100%" height={250}>
//             <BarChart data={weekly}>
//               <CartesianGrid strokeDasharray="3 3" stroke="#1a2d4a" vertical={false} />
//               <XAxis dataKey="day" tick={{ fill: '#4b5563', fontSize: 11 }} axisLine={false} tickLine={false} />
//               <YAxis tick={{ fill: '#4b5563', fontSize: 11 }} axisLine={false} tickLine={false} width={22} />
//               <Tooltip content={<ChartTooltip />} />
//               <Bar dataKey="cf" fill="#3b82f6" name="CF" radius={[4, 4, 0, 0]} stackId="a" />
//               <Bar dataKey="lc" fill="#f59e0b" name="LC" radius={[4, 4, 0, 0]} stackId="a" />
//             </BarChart>
//           </ResponsiveContainer>
//         </Card>
//       </div>

//       {ratingChart.length > 1 && (
//         <Card>
//           <SectionHeader title="Rating History" sub="CF & LC over time" />
//           <ResponsiveContainer width="100%" height={220}>
//             <LineChart data={ratingChart}>
//               <CartesianGrid strokeDasharray="3 3" stroke="#1a2d4a" />
//               <XAxis dataKey="m" tick={{ fill: '#4b5563', fontSize: 10 }} axisLine={false} tickLine={false} />
//               <YAxis tick={{ fill: '#4b5563', fontSize: 11 }} axisLine={false} tickLine={false} width={42} />
//               <Tooltip content={<ChartTooltip />} />
//               {cfData && <Line type="monotone" dataKey="cf" stroke="#3b82f6" strokeWidth={2.5} dot={false} name="CF" connectNulls />}
//               {lcData && <Line type="monotone" dataKey="lc" stroke="#f59e0b" strokeWidth={2.5} dot={false} name="LC" connectNulls />}
//             </LineChart>
//           </ResponsiveContainer>
//         </Card>
//       )}
//     </div>
//   )
// }

// // ═══════════════════════════════════════════════════════════════════════════
// // AI COACH PAGE
// // ═══════════════════════════════════════════════════════════════════════════
// export function AICoachPage() {
//   const { user } = useAuth()
//   const [cfData, setCf] = useState<CFData | null>(null)
//   const [lcData, setLc] = useState<LCData | null>(null)
//   const [result, setResult] = useState<AIResult | null>(null)
//   const [loading, setLoading] = useState(false)
//   const [init, setInit] = useState(true)
//   const [error, setError] = useState('')

//   useEffect(() => {
//     if (!user) return
//     Promise.all([loadCFData(user.id), loadLCData(user.id), getLatestAISession(user.id)])
//       .then(([cf, lc, ai]) => {
//         if (cf) setCf(cf)
//         if (lc) setLc(lc)
//         if (ai) setResult(ai)
//       })
//       .finally(() => setInit(false))
//   }, [user])

//   const generate = async () => {
//     if (!user) return
//     setLoading(true); setError('')
//     try {
//       const plan = await generateAIPlan({
//         cfHandle: cfData?.handle, lcHandle: lcData?.handle,
//         cfRating: cfData?.rating ?? 0, lcContestRating: lcData?.contestRating ?? 0,
//         cfTagDistribution: cfData?.tagDistribution ?? {},
//         lcTagDistribution: lcData?.tagDistribution ?? {},
//         cfTotalSolved: cfData?.totalSolved ?? 0, lcTotalSolved: lcData?.totalSolved ?? 0,
//         lcEasy: lcData?.easySolved ?? 0, lcMedium: lcData?.mediumSolved ?? 0, lcHard: lcData?.hardSolved ?? 0,
//       })
//       await saveAISession(user.id, plan)
//       setResult(plan)
//     } catch (e: any) { setError(e.message) }
//     finally { setLoading(false) }
//   }

//   const tagColorMap: Record<string, string> = {
//     'data structures': 'bg-primary/10 text-primary-light', graphs: 'bg-cyan/10 text-cyan-light',
//     dp: 'bg-purple/10 text-purple-light', math: 'bg-amber/10 text-amber-light',
//     strings: 'bg-green/10 text-green-light', heap: 'bg-amber/10 text-amber-light',
//     geometry: 'bg-rose/10 text-rose-light', bfs: 'bg-cyan/10 text-cyan-light',
//     dfs: 'bg-cyan/10 text-cyan-light', trees: 'bg-green/10 text-green-light',
//   }
//   const priColor: Record<string, string> = { high: 'badge-rose', medium: 'badge-amber', low: 'badge-green' }

//   if (init) return (
//     <div className="flex-1 p-5 lg:p-8 space-y-4">
//       {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-32 rounded-2xl" />)}
//     </div>
//   )

//   return (
//     <div className="flex-1 p-5 lg:p-8 space-y-6 animate-fade-in">
//       <div className="flex items-start justify-between">
//         <PageHeader title="AI Coach" sub="Personalized roadmap powered by Gemini 1.5 Flash" icon={<Bot size={20} />} badge="Gemini AI" />
//         <button onClick={generate} disabled={loading} className="btn-primary text-sm py-2 mt-1 disabled:opacity-60">
//           {loading ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
//           {loading ? 'Generating…' : 'Generate New Plan'}
//         </button>
//       </div>

//       {error && (
//         <div className="flex items-center gap-2 bg-rose/10 border border-rose/20 rounded-xl px-4 py-3 text-rose text-sm">
//           <AlertCircle size={14} /> {error}
//         </div>
//       )}

//       {!result && !loading && (
//         <Card className="border-primary/20 bg-primary/5 text-center py-14">
//           <Bot size={48} className="text-n-400 mx-auto mb-4" />
//           <h3 className="text-n-900 font-bold text-lg mb-2">No AI plan generated yet</h3>
//           <p className="text-n-500 text-sm mb-6 max-w-sm mx-auto">
//             Connect your CF and LC handles on the Dashboard, then generate your personalised AI roadmap.
//           </p>
//           <button onClick={generate} disabled={loading} className="btn-primary disabled:opacity-60">
//             <Zap size={14} /> Generate My Plan
//           </button>
//         </Card>
//       )}

//       {result && (
//         <>
//           {result.weak_topic_analysis && (
//             <Card className="border-rose/20 bg-rose/5">
//               <SectionHeader title="🎯 AI Weak Topic Analysis" />
//               <p className="text-n-600 text-sm leading-relaxed">{result.weak_topic_analysis}</p>
//             </Card>
//           )}

//           {result.daily_problem_sheet && result.daily_problem_sheet.length > 0 && (
//             <Card>
//               <SectionHeader title="📋 Daily Problem Sheet" sub={`${result.daily_problem_sheet.length} handpicked problems`} />
//               <div className="space-y-2">
//                 {result.daily_problem_sheet.map((p, i) => (
//                   <div key={i} className="flex items-center gap-3 p-3.5 bg-bg-hover border border-bg-border rounded-xl hover:border-primary/20 transition-all group">
//                     <div className="w-7 h-7 rounded-lg bg-bg-card border border-bg-border flex items-center justify-center text-n-500 font-mono text-xs font-bold shrink-0">{i + 1}</div>
//                     <div className="flex-1 min-w-0">
//                       <p className="text-n-800 font-semibold text-sm truncate">{p.problem_name}</p>
//                       <div className="flex items-center gap-2 mt-1">
//                         <span className={`badge text-[10px] px-1.5 py-0.5 rounded ${tagColorMap[p.focus_tag] || 'bg-bg-border text-n-500'}`}>{p.focus_tag}</span>
//                         <span className="text-n-500 text-xs font-mono">{p.estimated_difficulty}</span>
//                       </div>
//                     </div>
//                     <span className={`badge shrink-0 ${p.platform === 'Codeforces' ? 'badge-blue' : 'badge-amber'}`}>
//                       {p.platform === 'Codeforces' ? 'CF' : 'LC'}
//                     </span>
//                     <a href={p.url} target="_blank" rel="noreferrer" className="text-n-400 hover:text-primary-light shrink-0 transition-colors">
//                       <ExternalLink size={14} />
//                     </a>
//                   </div>
//                 ))}
//               </div>
//             </Card>
//           )}

//           {result.weekly_roadmap && result.weekly_roadmap.length > 0 && (
//             <Card>
//               <SectionHeader title="🗓️ Weekly Learning Roadmap" sub="7-day personalised study plan" />
//               <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
//                 {result.weekly_roadmap.map(d => (
//                   <div key={d.day} className="bg-bg-hover border border-bg-border rounded-xl p-4 hover:border-primary/20 transition-all">
//                     <span className="label block mb-2">Day {d.day}</span>
//                     <p className="text-n-900 font-bold text-sm mb-1">{d.topic}</p>
//                     <p className="text-n-500 text-xs leading-relaxed">{d.resource_focus}</p>
//                   </div>
//                 ))}
//               </div>
//             </Card>
//           )}
//         </>
//       )}
//     </div>
//   )
// }

// // ═══════════════════════════════════════════════════════════════════════════
// // COMPARE PAGE
// // ═══════════════════════════════════════════════════════════════════════════
// export function ComparePage() {
//   const [h1, setH1] = useState('')
//   const [h2, setH2] = useState('')
//   const [u1cf, setU1cf] = useState<CFData | null>(null)
//   const [u1lc, setU1lc] = useState<LCData | null>(null)
//   const [u2cf, setU2cf] = useState<CFData | null>(null)
//   const [u2lc, setU2lc] = useState<LCData | null>(null)
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState('')

//   const compare = async () => {
//     if (!h1 || !h2) { setError('Enter both handles'); return }
//     setLoading(true); setError('')
//     try {
//       const results = await Promise.allSettled([fetchCFData(h1), fetchLCData(h1), fetchCFData(h2), fetchLCData(h2)])
//       if (results[0].status === 'fulfilled') setU1cf(results[0].value)
//       if (results[1].status === 'fulfilled') setU1lc(results[1].value)
//       if (results[2].status === 'fulfilled') setU2cf(results[2].value)
//       if (results[3].status === 'fulfilled') setU2lc(results[3].value)
//       if (results[0].status === 'rejected' && results[2].status === 'rejected') {
//         setError('Could not fetch data. Check handles.')
//       }
//     } catch (e: any) { setError(e.message) }
//     finally { setLoading(false) }
//   }

//   const fields = [
//     { label: 'CF Rating', u1: u1cf?.rating ?? 0, u2: u2cf?.rating ?? 0 },
//     { label: 'LC Rating', u1: u1lc?.contestRating ?? 0, u2: u2lc?.contestRating ?? 0 },
//     { label: 'CF Solved', u1: u1cf?.totalSolved ?? 0, u2: u2cf?.totalSolved ?? 0 },
//     { label: 'LC Solved', u1: u1lc?.totalSolved ?? 0, u2: u2lc?.totalSolved ?? 0 },
//     { label: 'CF Streak', u1: u1cf?.streakDays ?? 0, u2: u2cf?.streakDays ?? 0 },
//   ]

//   const ratingChart = (() => {
//     const cf1 = u1cf?.ratingHistory ?? []
//     const cf2 = u2cf?.ratingHistory ?? []
//     const len = Math.min(Math.max(cf1.length, cf2.length, 1), 10)
//     return Array.from({ length: len }, (_, i) => ({
//       d: cf1[Math.floor(i / len * cf1.length)]?.date ?? `M${i + 1}`,
//       u1: cf1[Math.floor(i / len * cf1.length)]?.rating,
//       u2: cf2[Math.floor(i / len * cf2.length)]?.rating,
//     }))
//   })()

//   const allTags = [...new Set([...Object.keys(u1cf?.tagDistribution ?? {}), ...Object.keys(u2cf?.tagDistribution ?? {})])].slice(0, 8)
//   const m1 = Math.max(...Object.values(u1cf?.tagDistribution ?? { _: 1 }))
//   const m2 = Math.max(...Object.values(u2cf?.tagDistribution ?? { _: 1 }))
//   const radarCmp = allTags.map(t => ({
//     skill: t.length > 8 ? t.slice(0, 7) + '…' : t,
//     u1: Math.round(((u1cf?.tagDistribution ?? {})[t] ?? 0) / m1 * 100),
//     u2: Math.round(((u2cf?.tagDistribution ?? {})[t] ?? 0) / m2 * 100),
//   }))

//   return (
//     <div className="flex-1 p-5 lg:p-8 space-y-6 animate-fade-in">
//       <PageHeader title="User Comparison" sub="Real-time head-to-head via live APIs" icon={<Users size={20} />} />

//       <Card>
//         <div className="grid sm:grid-cols-2 gap-4 mb-4">
//           {[{ val: h1, set: setH1, label: 'Player 1 Handle' }, { val: h2, set: setH2, label: 'Player 2 Handle' }].map(p => (
//             <div key={p.label}>
//               <label className="label block mb-1.5">{p.label}</label>
//               <div className="relative">
//                 <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-n-500 pointer-events-none" />
//                 <input value={p.val} onChange={e => p.set(e.target.value)}
//                   onKeyDown={e => e.key === 'Enter' && compare()}
//                   placeholder="CF or LC handle" className="input pl-9 font-mono" />
//               </div>
//             </div>
//           ))}
//         </div>
//         {error && (
//           <div className="flex items-center gap-2 bg-rose/10 border border-rose/20 rounded-xl px-3 py-2 text-rose text-sm mb-3">
//             <AlertCircle size={13} /> {error}
//           </div>
//         )}
//         <button onClick={compare} disabled={loading} className="btn-primary disabled:opacity-60">
//           {loading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
//           {loading ? 'Fetching live data…' : 'Compare Now'}
//         </button>
//       </Card>

//       {(u1cf || u2cf) && (
//         <>
//           <div className="grid sm:grid-cols-2 gap-4">
//             {[
//               { u: u1cf, l: u1lc, n: h1, c: '#3b82f6' },
//               { u: u2cf, l: u2lc, n: h2, c: '#06b6d4' },
//             ].map((p, i) => (
//               <div key={i} className="card-p" style={{ borderColor: `${p.c}25`, background: `${p.c}08` }}>
//                 <p className="label mb-2">Player {i + 1}</p>
//                 <h3 className="text-2xl font-black font-mono mb-3" style={{ color: p.c }}>
//                   {p.u?.handle || p.n}
//                 </h3>
//                 <div className="grid grid-cols-3 gap-2 text-center">
//                   <div className="bg-bg-card border border-bg-border rounded-lg p-2">
//                     <p className="font-mono font-bold text-n-900">{p.u?.rating ?? '—'}</p>
//                     <p className="text-n-500 text-xs">CF</p>
//                   </div>
//                   <div className="bg-bg-card border border-bg-border rounded-lg p-2">
//                     <p className="font-mono font-bold text-n-900">{p.l?.contestRating ?? '—'}</p>
//                     <p className="text-n-500 text-xs">LC</p>
//                   </div>
//                   <div className="bg-bg-card border border-bg-border rounded-lg p-2">
//                     <p className="font-mono font-bold text-n-900">{((p.u?.totalSolved ?? 0) + (p.l?.totalSolved ?? 0)) || '—'}</p>
//                     <p className="text-n-500 text-xs">Total</p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <Card>
//             <SectionHeader title="Stats Comparison" sub="Head-to-head real data" />
//             <div className="space-y-4">
//               {fields.map(f => {
//                 const mx = Math.max(f.u1, f.u2, 1)
//                 const p1 = Math.round(f.u1 / mx * 100)
//                 const p2 = Math.round(f.u2 / mx * 100)
//                 return (
//                   <div key={f.label}>
//                     <div className="flex justify-between mb-2 text-sm">
//                       <span className="font-mono font-bold text-primary-light">{f.u1.toLocaleString()}</span>
//                       <span className="text-n-500 font-semibold">{f.label}</span>
//                       <span className="font-mono font-bold text-cyan-light">{f.u2.toLocaleString()}</span>
//                     </div>
//                     <div className="flex gap-1 h-2">
//                       <div className="flex-1 bg-bg-muted rounded-full overflow-hidden flex justify-end">
//                         <div className="h-full bg-primary rounded-full" style={{ width: `${p1}%` }} />
//                       </div>
//                       <div className="w-px bg-bg-border" />
//                       <div className="flex-1 bg-bg-muted rounded-full overflow-hidden">
//                         <div className="h-full bg-cyan rounded-full" style={{ width: `${p2}%` }} />
//                       </div>
//                     </div>
//                   </div>
//                 )
//               })}
//             </div>
//           </Card>

//           <div className="grid lg:grid-cols-2 gap-5">
//             {ratingChart.length > 1 && (
//               <Card>
//                 <SectionHeader title="CF Rating History" />
//                 <ResponsiveContainer width="100%" height={200}>
//                   <LineChart data={ratingChart}>
//                     <CartesianGrid strokeDasharray="3 3" stroke="#1a2d4a" />
//                     <XAxis dataKey="d" tick={{ fill: '#4b5563', fontSize: 10 }} axisLine={false} tickLine={false} />
//                     <YAxis tick={{ fill: '#4b5563', fontSize: 11 }} axisLine={false} tickLine={false} width={42} />
//                     <Tooltip content={<ChartTooltip />} />
//                     <Line type="monotone" dataKey="u1" stroke="#3b82f6" strokeWidth={2} dot={false} name={u1cf?.handle ?? h1} connectNulls />
//                     <Line type="monotone" dataKey="u2" stroke="#06b6d4" strokeWidth={2} dot={false} name={u2cf?.handle ?? h2} connectNulls />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </Card>
//             )}
//             {radarCmp.length > 0 && (
//               <Card>
//                 <SectionHeader title="Skill Radar" />
//                 <ResponsiveContainer width="100%" height={200}>
//                   <RadarChart data={radarCmp} cx="50%" cy="50%" outerRadius="70%">
//                     <PolarGrid stroke="#1a2d4a" />
//                     <PolarAngleAxis dataKey="skill" tick={{ fill: '#6b7280', fontSize: 9 }} />
//                     <Radar dataKey="u1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} strokeWidth={2} name={u1cf?.handle ?? h1} />
//                     <Radar dataKey="u2" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.15} strokeWidth={2} name={u2cf?.handle ?? h2} />
//                   </RadarChart>
//                 </ResponsiveContainer>
//               </Card>
//             )}
//           </div>
//         </>
//       )}
//     </div>
//   )
// }

// // ═══════════════════════════════════════════════════════════════════════════
// // GOALS PAGE — real Supabase CRUD
// // ═══════════════════════════════════════════════════════════════════════════
// export function GoalsPage() {
//   const { user } = useAuth()
//   const [goals, setGoals] = useState<Goal[]>([])
//   const [loading, setLoading] = useState(true)
//   const [showForm, setShowForm] = useState(false)
//   const [form, setForm] = useState<{ title: string; platform: Goal['platform']; target: number; current: number; deadline: string; color: string }>({
//     title: '', platform: 'CF', target: 1600, current: 0, deadline: '', color: '#3b82f6',
//   })

//   useEffect(() => {
//     if (!user) return
//     getGoals(user.id).then(g => { setGoals(g); setLoading(false) })
//   }, [user])

//   const addGoal = async () => {
//     if (!form.title || !user) return
//     const g = await createGoal(user.id, { ...form, achieved: false })
//     setGoals(prev => [g, ...prev])
//     setShowForm(false)
//     setForm({ title: '', platform: 'CF', target: 1600, current: 0, deadline: '', color: '#3b82f6' })
//   }

//   const removeGoal = async (id: string) => {
//     await deleteGoal(id)
//     setGoals(prev => prev.filter(g => g.id !== id))
//   }

//   const toggleAchieved = async (g: Goal) => {
//     await updateGoal(g.id, { achieved: !g.achieved })
//     setGoals(prev => prev.map(x => x.id === g.id ? { ...x, achieved: !x.achieved } : x))
//   }

//   if (loading) return (
//     <div className="flex-1 p-5 lg:p-8 space-y-4">
//       {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-32 rounded-2xl" />)}
//     </div>
//   )

//   const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#a855f7', '#f43f5e', '#06b6d4']

//   return (
//     <div className="flex-1 p-5 lg:p-8 space-y-6 animate-fade-in">
//       <div className="flex items-start justify-between">
//         <PageHeader title="Goal Tracker" sub="Set targets — saved to Supabase database" icon={<Target size={20} />} />
//         <button onClick={() => setShowForm(v => !v)} className="btn-primary text-sm py-2 mt-1">
//           <Plus size={14} /> New Goal
//         </button>
//       </div>

//       {showForm && (
//         <Card className="border-primary/20 animate-fade-in">
//           <SectionHeader title="Add New Goal" />
//           <div className="grid sm:grid-cols-2 gap-4">
//             <div>
//               <label className="label block mb-1.5">Title</label>
//               <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
//                 className="input" placeholder="e.g. Reach CF Expert" />
//             </div>
//             <div>
//               <label className="label block mb-1.5">Platform</label>
//               <select value={form.platform} onChange={e => setForm(f => ({ ...f, platform: e.target.value as Goal['platform'] }))} className="input">
//                 <option value="CF">Codeforces</option>
//                 <option value="LC">LeetCode</option>
//                 <option value="BOTH">Both</option>
//               </select>
//             </div>
//             <div>
//               <label className="label block mb-1.5">Target Value</label>
//               <input type="number" value={form.target} onChange={e => setForm(f => ({ ...f, target: +e.target.value }))} className="input font-mono" />
//             </div>
//             <div>
//               <label className="label block mb-1.5">Current Value</label>
//               <input type="number" value={form.current} onChange={e => setForm(f => ({ ...f, current: +e.target.value }))} className="input font-mono" />
//             </div>
//             <div>
//               <label className="label block mb-1.5">Deadline</label>
//               <input type="date" value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} className="input" />
//             </div>
//             <div>
//               <label className="label block mb-1.5">Colour</label>
//               <div className="flex gap-2 pt-1">
//                 {COLORS.map(c => (
//                   <button key={c} onClick={() => setForm(f => ({ ...f, color: c }))}
//                     className="w-8 h-8 rounded-lg border-2 transition-all"
//                     style={{ backgroundColor: c, borderColor: form.color === c ? 'white' : 'transparent' }} />
//                 ))}
//               </div>
//             </div>
//           </div>
//           <div className="flex gap-3 mt-4">
//             <button onClick={addGoal} className="btn-primary">Save Goal</button>
//             <button onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
//           </div>
//         </Card>
//       )}

//       {goals.length === 0 ? (
//         <Card className="text-center py-14">
//           <Target size={40} className="text-n-400 mx-auto mb-3" />
//           <h3 className="text-n-800 font-bold mb-1">No goals yet</h3>
//           <p className="text-n-500 text-sm">Add your first goal to track your progress!</p>
//         </Card>
//       ) : (
//         <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
//           {goals.map(g => {
//             const pct = g.target > 0 ? Math.min(100, Math.round((g.current / g.target) * 100)) : 0
//             const daysLeft = g.deadline ? Math.ceil((new Date(g.deadline).getTime() - Date.now()) / 86400000) : null
//             return (
//               <div key={g.id} className={`card-p transition-all ${g.achieved ? 'opacity-70' : 'hover:border-primary/20'}`}
//                 style={{ borderColor: `${g.color}25` }}>
//                 <div className="flex justify-between items-start mb-3">
//                   <h3 className="text-n-900 font-bold text-sm leading-tight pr-2 flex-1">{g.title}</h3>
//                   <div className="flex gap-1 shrink-0">
//                     <button onClick={() => toggleAchieved(g)}
//                       className={`p-1 rounded-lg transition-colors ${g.achieved ? 'text-green-light' : 'text-n-400 hover:text-green-light'}`}>
//                       <CheckCircle size={14} />
//                     </button>
//                     <button onClick={() => removeGoal(g.id)} className="p-1 rounded-lg text-n-400 hover:text-rose-light transition-colors">
//                       <Trash2 size={14} />
//                     </button>
//                   </div>
//                 </div>
//                 <div className="flex justify-between mb-2">
//                   <span className="font-mono font-black text-2xl text-n-900">{g.current.toLocaleString()}</span>
//                   <span className="text-n-500 text-sm self-end font-mono">/ {g.target.toLocaleString()}</span>
//                 </div>
//                 <div className="h-2 bg-bg-muted rounded-full mb-2 overflow-hidden">
//                   <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: g.color }} />
//                 </div>
//                 <div className="flex justify-between text-xs text-n-500">
//                   <span className="font-semibold" style={{ color: g.color }}>{pct}%{g.achieved ? ' ✓' : ''}</span>
//                   {daysLeft !== null && <span>{daysLeft > 0 ? `${daysLeft}d left` : 'Overdue'}</span>}
//                 </div>
//                 <span className={`badge text-[10px] mt-2 ${g.platform === 'CF' ? 'badge-blue' : g.platform === 'LC' ? 'badge-amber' : 'badge-purple'}`}>
//                   {g.platform}
//                 </span>
//               </div>
//             )
//           })}
//         </div>
//       )}
//     </div>
//   )
// }

// // ═══════════════════════════════════════════════════════════════════════════
// // NOTES PAGE — real Supabase CRUD
// // ═══════════════════════════════════════════════════════════════════════════
// export function NotesPage() {
//   const { user } = useAuth()
//   const [notes, setNotes] = useState<Note[]>([])
//   const [sel, setSel] = useState<Note | null>(null)
//   const [filter, setFilter] = useState<'all' | 'bookmarked'>('all')
//   const [loading, setLoading] = useState(true)
//   const [newNote, setNewNote] = useState(false)
//   const [editing, setEditing] = useState(false)
//   const [form, setForm] = useState({ title: '', content: '', platform: 'CF' as Note['platform'], tags: '', url: '' })

//   useEffect(() => {
//     if (!user) return
//     getNotes(user.id).then(n => { setNotes(n); setLoading(false) })
//   }, [user])

//   const filtered = filter === 'all' ? notes : notes.filter(n => n.bookmarked)

//   const saveNew = async () => {
//     if (!form.title || !user) return
//     const n = await createNote(user.id, {
//       title: form.title, content: form.content, platform: form.platform,
//       tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
//       url: form.url, bookmarked: false,
//     })
//     setNotes(prev => [n, ...prev]); setSel(n); setNewNote(false)
//     setForm({ title: '', content: '', platform: 'CF', tags: '', url: '' })
//   }

//   const toggleBook = async (id: string) => {
//     const n = notes.find(x => x.id === id); if (!n) return
//     await updNote(id, { bookmarked: !n.bookmarked })
//     setNotes(prev => prev.map(x => x.id === id ? { ...x, bookmarked: !x.bookmarked } : x))
//     if (sel?.id === id) setSel(prev => prev ? { ...prev, bookmarked: !prev.bookmarked } : null)
//   }

//   const delN = async (id: string) => {
//     await delNote(id); setNotes(prev => prev.filter(x => x.id !== id))
//     if (sel?.id === id) setSel(null)
//   }

//   const startEdit = () => {
//     if (!sel) return
//     setForm({ title: sel.title, content: sel.content, platform: sel.platform, tags: sel.tags.join(', '), url: sel.url })
//     setEditing(true); setNewNote(false)
//   }

//   const saveEdit = async () => {
//     if (!sel) return
//     const updated = { ...sel, title: form.title, content: form.content, platform: form.platform, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean), url: form.url }
//     await updNote(sel.id, { title: form.title, content: form.content, platform: form.platform, tags: updated.tags, url: form.url })
//     setNotes(prev => prev.map(x => x.id === sel.id ? updated : x))
//     setSel(updated); setEditing(false)
//   }

//   const getPlatformBadgeClass = (platform: string) => {
//     if (platform === 'CF') return 'badge-blue'
//     if (platform === 'LC') return 'badge-amber'
//     return 'badge-purple'
//   }

//   if (loading) return <div className="flex-1 p-5 lg:p-8"><div className="skeleton h-full min-h-64 rounded-2xl" /></div>

//   return (
//     <div className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-3.5rem)] lg:h-screen overflow-hidden">
//       {/* Sidebar list */}
//       <div className="w-full lg:w-72 shrink-0 border-b lg:border-b-0 lg:border-r border-bg-border flex flex-col bg-bg-card">
//         <div className="p-4 border-b border-bg-border">
//           <div className="flex items-center justify-between mb-3">
//             <h1 className="font-bold text-n-900 flex items-center gap-2 text-sm">
//               <BookMarked size={15} /> Notes ({notes.length})
//             </h1>
//             <button onClick={() => { setNewNote(true); setEditing(false); setSel(null) }}
//               className="btn-primary text-xs py-1.5 px-3">
//               <Plus size={11} /> New
//             </button>
//           </div>
//           <div className="flex gap-1">
//             {(['all', 'bookmarked'] as const).map(f => (
//               <button key={f} onClick={() => setFilter(f)}
//                 className={`flex-1 text-xs py-1.5 rounded-lg font-medium transition-all ${filter === f ? 'bg-primary text-white' : 'text-n-500 hover:bg-bg-hover'}`}>
//                 {f === 'all' ? `All (${notes.length})` : `★ (${notes.filter(n => n.bookmarked).length})`}
//               </button>
//             ))}
//           </div>
//         </div>

//         <div className="flex-1 overflow-y-auto p-2 space-y-1">
//           {filtered.length === 0 && (
//             <div className="text-center py-8 text-n-500 text-sm">
//               {filter === 'bookmarked' ? 'No bookmarked notes' : 'No notes yet'}
//             </div>
//           )}
//           {filtered.map(n => (
//             <button key={n.id} onClick={() => { setSel(n); setNewNote(false); setEditing(false) }}
//               className={`w-full text-left p-3 rounded-xl transition-all ${sel?.id === n.id ? 'bg-primary/10 border border-primary/20' : 'hover:bg-bg-hover border border-transparent'}`}>
//               <div className="flex justify-between mb-1">
//                 <span className="text-n-800 font-semibold text-sm truncate">{n.title}</span>
//                 {n.bookmarked && <Star size={11} className="text-amber shrink-0 ml-1" fill="currentColor" />}
//               </div>
//               <p className="text-n-500 text-xs truncate">{n.content.slice(0, 55)}{n.content.length > 55 ? '…' : ''}</p>
//               <div className="flex items-center gap-2 mt-1.5">
//                 <span className={`badge text-[10px] ${getPlatformBadgeClass(n.platform)}`} style={{ fontSize: '10px', padding: '1px 6px' }}>{n.platform}</span>
//                 <span className="text-n-400 text-[10px] font-mono">{n.created_at?.slice(0, 10)}</span>
//               </div>
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Detail panel */}
//       <div className="flex-1 overflow-y-auto p-5 lg:p-8">
//         {(newNote || editing) ? (
//           <div className="max-w-2xl animate-fade-in">
//             <h2 className="text-n-900 font-bold text-lg mb-5">{editing ? 'Edit Note' : 'New Note'}</h2>
//             <div className="space-y-4">
//               <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
//                 placeholder="Title…" className="input text-base font-semibold" />
//               <div className="flex gap-3">
//                 <select value={form.platform} onChange={e => setForm(f => ({ ...f, platform: e.target.value as Note['platform'] }))} className="input w-28">
//                   <option value="CF">CF</option>
//                   <option value="LC">LC</option>
//                   <option value="BOTH">Both</option>
//                 </select>
//                 <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
//                   placeholder="Tags (comma separated)" className="input flex-1" />
//               </div>
//               <input value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
//                 placeholder="Problem URL (optional)" className="input font-mono text-sm" />
//               <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
//                 placeholder="Write your notes here…" rows={14}
//                 className="input font-mono text-sm resize-none leading-relaxed" />
//               <div className="flex gap-3">
//                 <button onClick={editing ? saveEdit : saveNew} className="btn-primary">
//                   {editing ? 'Save Changes' : 'Save Note'}
//                 </button>
//                 <button onClick={() => { setNewNote(false); setEditing(false) }} className="btn-secondary">Cancel</button>
//               </div>
//             </div>
//           </div>
//         ) : sel ? (
//           <div className="max-w-2xl animate-fade-in">
//             <div className="flex items-start justify-between mb-5">
//               <div className="flex-1 pr-4">
//                 <h2 className="text-n-900 font-black text-xl mb-2">{sel.title}</h2>
//                 <div className="flex flex-wrap gap-2">
//                   <span className={`badge text-xs ${getPlatformBadgeClass(sel.platform)}`}>{sel.platform}</span>
//                   {sel.tags.map(t => <span key={t} className="tag">{t}</span>)}
//                   <span className="flex items-center gap-1 text-n-400 text-xs"><Clock size={9} />{sel.created_at?.slice(0, 10)}</span>
//                   {sel.url && (
//                     <a href={sel.url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-primary-light text-xs hover:underline">
//                       <Link size={9} /> Problem Link
//                     </a>
//                   )}
//                 </div>
//               </div>
//               <div className="flex gap-1.5 shrink-0">
//                 <button onClick={startEdit} className="btn-ghost p-2" title="Edit"><Pencil size={14} /></button>
//                 <button onClick={() => toggleBook(sel.id)} className="btn-ghost p-2" title="Bookmark">
//                   <Star size={14} className={sel.bookmarked ? 'text-amber' : 'text-n-500'} fill={sel.bookmarked ? 'currentColor' : 'none'} />
//                 </button>
//                 <button onClick={() => delN(sel.id)} className="btn-danger p-2" title="Delete"><Trash2 size={14} /></button>
//               </div>
//             </div>
//             <div className="card-p bg-bg-hover whitespace-pre-wrap font-mono text-sm text-n-700 leading-relaxed min-h-[300px]">
//               {sel.content || <span className="text-n-400 italic">Empty note — click edit to add content</span>}
//             </div>
//           </div>
//         ) : (
//           <div className="flex flex-col items-center justify-center h-full text-center">
//             <BookMarked size={40} className="text-n-400 mb-4" />
//             <h3 className="text-n-800 font-bold text-lg mb-2">Select a note</h3>
//             <p className="text-n-500 text-sm max-w-xs">
//               Notes are saved to Supabase — they persist across sessions and devices.
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }



import { useEffect, useState } from 'react'
import {
  BarChart3, Code2, StickyNote, Trophy, TrendingUp, Zap, AlertCircle,
  Bot, ExternalLink, Users, Search, Target, Plus, CheckCircle,
  Trash2, BookMarked, Star, Clock, Link, Pencil, Loader2, RefreshCw,
  ChevronDown, Award, Activity
} from 'lucide-react'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line,
  CartesianGrid, PieChart, Pie, Cell
} from 'recharts'
import { StatCard, PageHeader, Card, SectionHeader, ChartTooltip } from '../components/ui'
import { useAuth } from '../context/AuthContext'
import {
  loadCFData, loadLCData, fetchCFData, fetchLCData,
  saveCFData, saveLCData,
  generateAIPlan, saveAISession, getLatestAISession,
  getGoals, createGoal, deleteGoal, updateGoal,
  getNotes, createNote, updateNote as updNote, deleteNote as delNote,
  type CFData, type LCData, type AIResult, type Goal, type Note
} from '../services/api'

// ═══════════════════════════════════════════════════════════════════════════
// ANALYTICS PAGE
// ═══════════════════════════════════════════════════════════════════════════
export function AnalyticsPage() {
  const { user } = useAuth()
  const [cfData, setCf] = useState<CFData | null>(null)
  const [lcData, setLc] = useState<LCData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    Promise.all([loadCFData(user.id), loadLCData(user.id)])
      .then(([cf, lc]) => { if (cf) setCf(cf); if (lc) setLc(lc) })
      .finally(() => setLoading(false))
  }, [user])

  const totalSolved = (cfData?.totalSolved ?? 0) + (lcData?.totalSolved ?? 0)

  // Real radar data from actual tag distributions
  const cfTags = Object.entries(cfData?.tagDistribution ?? {}).sort(([, a], [, b]) => b - a).slice(0, 8)
  const allTagKeys = [...new Set([...cfTags.map(([t]) => t), ...Object.keys(lcData?.tagDistribution ?? {}).slice(0, 8)])].slice(0, 8)
  const maxCF = cfTags[0]?.[1] ?? 1
  const maxLC = Math.max(...Object.values(lcData?.tagDistribution ?? { _: 1 }))
  const radarData = allTagKeys.map(t => ({
    skill: t.length > 10 ? t.slice(0, 9) + '…' : t,
    CF: Math.round(((cfData?.tagDistribution ?? {})[t] ?? 0) / maxCF * 100),
    LC: Math.round(((lcData?.tagDistribution ?? {})[t] ?? 0) / maxLC * 100),
  }))

  // Real CF difficulty distribution chart
  const diffChart = Object.entries(cfData?.difficultyDist ?? {})
    .sort(([a], [b]) => parseInt(a) - parseInt(b))
    .map(([range, count]) => ({ range: range.split('-')[0], count }))

  // Strong vs weak from real data
  const sortedCF = Object.entries(cfData?.tagDistribution ?? {}).sort(([, a], [, b]) => b - a)
  const strong = sortedCF.slice(0, 5).map(([t, c]) => ({ topic: t, count: c }))
  const weak = sortedCF.slice(-5).reverse().map(([t, c]) => ({ topic: t, count: c }))

  if (loading) return (
    <div className="flex-1 p-5 lg:p-8 space-y-4">
      {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-32 rounded-2xl" />)}
    </div>
  )

  return (
    <div className="flex-1 p-5 lg:p-8 space-y-6 animate-fade-in">
      <PageHeader title="Combined Analytics" sub="Real data from both platforms" icon={<BarChart3 size={20} />} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Solved"    value={totalSolved > 0 ? totalSolved.toLocaleString() : '—'} icon={<Trophy size={16} />} color="green" sub="Both platforms" />
        <StatCard label="CF Solved"       value={cfData?.totalSolved ?? '—'} icon={<Code2 size={16} />} color="blue" sub={cfData ? `Rating: ${cfData.rating}` : 'Not connected'} />
        <StatCard label="LC Solved"       value={lcData?.totalSolved ?? '—'} icon={<StickyNote size={16} />} color="amber" sub={lcData ? `Rating: ${lcData.contestRating}` : 'Not connected'} />
        <StatCard label="LC Acceptance"   value={lcData ? `${lcData.acceptanceRate}%` : '—'} icon={<TrendingUp size={16} />} color="cyan" sub="Submission success rate" />
      </div>

      {/* Strengths & Weaknesses — real data */}
      {(strong.length > 0 || weak.length > 0) && (
        <div className="grid sm:grid-cols-2 gap-4">
          <Card className="border-green-500/20 bg-green-500/5">
            <SectionHeader title="💪 Strongest Topics" sub="Most problems solved (real data)" />
            <div className="space-y-2">
              {strong.map(s => (
                <div key={s.topic} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    <span className="text-slate-300 text-sm capitalize">{s.topic}</span>
                  </div>
                  <span className="text-green-400 font-mono font-bold text-sm">{s.count}</span>
                </div>
              ))}
            </div>
          </Card>
          <Card className="border-red-500/20 bg-red-500/5">
            <SectionHeader title="📉 Weakest Topics" sub="Fewest problems solved (real data)" />
            <div className="space-y-2">
              {weak.map(s => (
                <div key={s.topic} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                    <span className="text-slate-300 text-sm capitalize">{s.topic}</span>
                  </div>
                  <span className="text-red-400 font-mono font-bold text-sm">{s.count}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-5">
        {radarData.length > 2 ? (
          <Card>
            <SectionHeader title="Skill Radar" sub="CF vs LC topic mastery (real data)" />
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                <PolarGrid stroke="#1e2d45" />
                <PolarAngleAxis dataKey="skill" tick={{ fill: '#64748b', fontSize: 9 }} />
                <Radar dataKey="CF" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} strokeWidth={2} name="CF" />
                <Radar dataKey="LC" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.15} strokeWidth={2} name="LC" />
              </RadarChart>
            </ResponsiveContainer>
            <div className="flex gap-5 mt-2">
              <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 bg-blue-500 rounded" /><span className="text-slate-400 text-xs">Codeforces</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 bg-amber-500 rounded" /><span className="text-slate-400 text-xs">LeetCode</span></div>
            </div>
          </Card>
        ) : (
          <Card><div className="h-64 flex items-center justify-center text-slate-500 text-sm">Connect both handles to see skill radar</div></Card>
        )}

        {diffChart.length > 0 ? (
          <Card>
            <SectionHeader title="CF Difficulty Distribution" sub="Problems solved by rating range" />
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={diffChart} margin={{ left: 0, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" vertical={false} />
                <XAxis dataKey="range" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} width={35} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="count" name="Solved" radius={[4, 4, 0, 0]} fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        ) : (
          <Card><div className="h-64 flex items-center justify-center text-slate-500 text-sm">Connect Codeforces to see difficulty data</div></Card>
        )}
      </div>

      {/* LC difficulty pie */}
      {lcData && (
        <Card>
          <SectionHeader title="LeetCode Breakdown" sub="Solved by difficulty" />
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { label: 'Easy',   solved: lcData.easySolved,   total: lcData.totalEasy,   color: '#10b981' },
              { label: 'Medium', solved: lcData.mediumSolved,  total: lcData.totalMedium, color: '#f59e0b' },
              { label: 'Hard',   solved: lcData.hardSolved,    total: lcData.totalHard,   color: '#f43f5e' },
            ].map(d => {
              const pct = d.total > 0 ? Math.min(100, Math.round(d.solved / d.total * 100)) : 0
              return (
                <div key={d.label} className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-sm" style={{ color: d.color }}>{d.label}</span>
                    <span className="text-white font-mono font-bold">{d.solved.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: d.color }} />
                  </div>
                  <p className="text-slate-500 text-xs mt-1">{pct}% of {d.total}</p>
                </div>
              )
            })}
          </div>
        </Card>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// AI COACH PAGE — Fixed with real data passed to Gemini
// ═══════════════════════════════════════════════════════════════════════════
export function AICoachPage() {
  const { user } = useAuth()
  const [cfData, setCf] = useState<CFData | null>(null)
  const [lcData, setLc] = useState<LCData | null>(null)
  const [result, setResult] = useState<AIResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [init, setInit] = useState(true)
  const [error, setError] = useState('')
  const [genTime, setGenTime] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    Promise.all([loadCFData(user.id), loadLCData(user.id), getLatestAISession(user.id)])
      .then(([cf, lc, ai]) => {
        if (cf) setCf(cf)
        if (lc) setLc(lc)
        if (ai) setResult(ai)
      })
      .finally(() => setInit(false))
  }, [user])

  const generate = async () => {
    if (!user) return
    if (!cfData && !lcData) {
      setError('Please connect at least one handle (Codeforces or LeetCode) on the Dashboard first.')
      return
    }
    setLoading(true); setError('')
    try {
      const plan = await generateAIPlan({
        cfHandle: cfData?.handle,
        lcHandle: lcData?.handle,
        cfRating: cfData?.rating ?? 0,
        cfMaxRating: cfData?.maxRating ?? 0,
        lcContestRating: lcData?.contestRating ?? 0,
        cfTagDistribution: cfData?.tagDistribution ?? {},
        lcTagDistribution: lcData?.tagDistribution ?? {},
        cfTotalSolved: cfData?.totalSolved ?? 0,
        lcTotalSolved: lcData?.totalSolved ?? 0,
        cfWeeklySolved: cfData?.weeklyStats?.solvedThisWeek ?? 0,
        lcEasy: lcData?.easySolved ?? 0,
        lcMedium: lcData?.mediumSolved ?? 0,
        lcHard: lcData?.hardSolved ?? 0,
        cfRecentContests: cfData?.contests?.slice(0, 5).map(c => ({
          name: c.name, delta: c.delta, rank: c.rank
        })) ?? [],
        cfDifficultyDist: cfData?.difficultyDist ?? {},
      })
      await saveAISession(user.id, plan)
      setResult(plan)
      setGenTime(new Date().toLocaleString())
    } catch (e: any) { setError(e.message) }
    finally { setLoading(false) }
  }

  if (init) return (
    <div className="flex-1 p-5 lg:p-8 space-y-4">
      {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-32 rounded-2xl" />)}
    </div>
  )

  const diffColor: Record<string, string> = {
    Easy: 'text-green-400', Medium: 'text-amber-400', Hard: 'text-red-400',
  }

  return (
    <div className="flex-1 p-5 lg:p-8 space-y-6 animate-fade-in">
      <div className="flex items-start justify-between">
        <PageHeader title="AI Coach" sub="Personalized roadmap from your real CF + LC data" icon={<Bot size={20} />} badge="Gemini AI" />
        <button onClick={generate} disabled={loading}
          className="btn-primary text-sm py-2 mt-1 disabled:opacity-60">
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
          {loading ? 'Analyzing your data…' : result ? '↻ Regenerate' : 'Generate My Plan'}
        </button>
      </div>

      {/* Show user data summary so they know what AI is using */}
      {(cfData || lcData) && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {cfData && <div className="card-p bg-blue-500/5 border-blue-500/20 py-3">
            <p className="label mb-1">CF Data Ready</p>
            <p className="text-white font-mono font-bold">{cfData.handle} · {cfData.rating}</p>
            <p className="text-slate-500 text-xs">{cfData.totalSolved} solved · {Object.keys(cfData.tagDistribution).length} topics</p>
          </div>}
          {lcData && <div className="card-p bg-amber-500/5 border-amber-500/20 py-3">
            <p className="label mb-1">LC Data Ready</p>
            <p className="text-white font-mono font-bold">{lcData.handle} · {lcData.contestRating}</p>
            <p className="text-slate-500 text-xs">{lcData.totalSolved} solved · E{lcData.easySolved}/M{lcData.mediumSolved}/H{lcData.hardSolved}</p>
          </div>}
          {cfData && Object.keys(cfData.tagDistribution).length > 0 && (
            <div className="card-p py-3">
              <p className="label mb-1">Weakest CF Topic</p>
              <p className="text-white font-semibold capitalize">
                {Object.entries(cfData.tagDistribution).sort(([, a], [, b]) => a - b)[0]?.[0] ?? 'N/A'}
              </p>
              <p className="text-slate-500 text-xs">Least practiced area</p>
            </div>
          )}
          {genTime && <div className="card-p py-3">
            <p className="label mb-1">Last Generated</p>
            <p className="text-white text-xs">{genTime}</p>
            <p className="text-slate-500 text-xs">From your real stats</p>
          </div>}
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3 text-red-400 text-sm">
          <AlertCircle size={15} className="mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">AI Coach Error</p>
            <p className="text-red-400/80 text-xs mt-1">{error}</p>
            {error.includes('GEMINI') && (
              <p className="text-red-400/60 text-xs mt-1">
                Fix: Add <code className="bg-red-500/10 px-1 rounded">VITE_GEMINI_API_KEY=AIzaSy...</code> to your <code className="bg-red-500/10 px-1 rounded">.env</code> file, then restart <code className="bg-red-500/10 px-1 rounded">npm run dev</code>
              </p>
            )}
          </div>
        </div>
      )}

      {!result && !loading && !error && (
        <div className="card-p text-center py-14 border-blue-500/20 bg-blue-500/5">
          <Bot size={48} className="text-slate-600 mx-auto mb-4" />
          <h3 className="text-white font-bold text-lg mb-2">Generate Your Personalized Plan</h3>
          <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
            The AI will analyze your actual Codeforces and LeetCode stats — rating, solved counts, weak topics, recent contests — and build a targeted improvement plan just for you.
          </p>
          <button onClick={generate} disabled={loading} className="btn-primary">
            <Zap size={14} /> Generate My Plan
          </button>
        </div>
      )}

      {result && (
        <>
          {/* Weak topic analysis — from real data */}
          {result.weak_topic_analysis && (
            <Card className="border-red-500/20 bg-red-500/5">
              <SectionHeader title="🎯 AI Analysis of Your Data" />
              <p className="text-slate-300 text-sm leading-relaxed">{result.weak_topic_analysis}</p>
            </Card>
          )}

          {/* Daily problem sheet */}
          {result.daily_problem_sheet?.length > 0 && (
            <Card>
              <SectionHeader title="📋 Daily Problem Sheet" sub={`${result.daily_problem_sheet.length} problems targeting your weak areas`} />
              <div className="space-y-2">
                {result.daily_problem_sheet.map((p, i) => (
                  <div key={i} className="flex items-center gap-3 p-3.5 bg-white/[0.03] border border-white/[0.06] rounded-xl hover:border-blue-500/20 hover:bg-blue-500/5 transition-all group">
                    <div className="w-7 h-7 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-slate-500 font-mono text-xs font-bold shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-sm truncate">{p.problem_name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs bg-white/[0.05] border border-white/[0.08] text-slate-400 px-2 py-0.5 rounded-md capitalize">{p.focus_tag}</span>
                        <span className={`text-xs font-bold font-mono ${diffColor[p.estimated_difficulty] ?? 'text-slate-400'}`}>{p.estimated_difficulty}</span>
                      </div>
                    </div>
                    <span className={`badge shrink-0 ${p.platform === 'Codeforces' ? 'badge-blue' : 'badge-amber'}`}>
                      {p.platform === 'Codeforces' ? 'CF' : 'LC'}
                    </span>
                    <a href={p.url} target="_blank" rel="noreferrer"
                      className="text-slate-600 hover:text-blue-400 shrink-0 transition-colors">
                      <ExternalLink size={14} />
                    </a>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Weekly roadmap */}
          {result.weekly_roadmap?.length > 0 && (
            <Card>
              <SectionHeader title="🗓️ 7-Day Learning Roadmap" sub="Built from your actual performance data" />
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {result.weekly_roadmap.map(d => (
                  <div key={d.day} className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4 hover:border-blue-500/20 hover:bg-blue-500/5 transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">Day {d.day}</span>
                    </div>
                    <p className="text-white font-bold text-sm mb-1.5">{d.topic}</p>
                    <p className="text-slate-500 text-xs leading-relaxed">{d.resource_focus}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPARE PAGE — Fixed with platform selector CF/CF, LC/LC, CF/LC
// ═══════════════════════════════════════════════════════════════════════════
type Platform = 'CF' | 'LC'

export function ComparePage() {
  const [platform1, setPlatform1] = useState<Platform>('CF')
  const [platform2, setPlatform2] = useState<Platform>('CF')
  const [h1, setH1] = useState('')
  const [h2, setH2] = useState('')
  const [data1cf, setData1cf] = useState<CFData | null>(null)
  const [data1lc, setData1lc] = useState<LCData | null>(null)
  const [data2cf, setData2cf] = useState<CFData | null>(null)
  const [data2lc, setData2lc] = useState<LCData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [compared, setCompared] = useState(false)

  const compare = async () => {
    if (!h1.trim() || !h2.trim()) { setError('Enter both handles'); return }
    setLoading(true); setError('')
    setData1cf(null); setData1lc(null); setData2cf(null); setData2lc(null)
    try {
      const fetches: Promise<any>[] = [
        platform1 === 'CF' ? fetchCFData(h1.trim()) : fetchLCData(h1.trim()),
        platform2 === 'CF' ? fetchCFData(h2.trim()) : fetchLCData(h2.trim()),
      ]
      const [r1, r2] = await Promise.all(fetches)
      if (platform1 === 'CF') setData1cf(r1); else setData1lc(r1)
      if (platform2 === 'CF') setData2cf(r2); else setData2lc(r2)
      setCompared(true)
    } catch (e: any) { setError(e.message) }
    finally { setLoading(false) }
  }

  // Build comparison fields based on selected platforms
  const compFields = (() => {
    const fields: Array<{ label: string; v1: number | string; v2: number | string; unit?: string }> = []
    if (platform1 === 'CF' && platform2 === 'CF') {
      fields.push(
        { label: 'CF Rating',      v1: data1cf?.rating ?? 0,       v2: data2cf?.rating ?? 0 },
        { label: 'Max Rating',     v1: data1cf?.maxRating ?? 0,    v2: data2cf?.maxRating ?? 0 },
        { label: 'Problems Solved',v1: data1cf?.totalSolved ?? 0,  v2: data2cf?.totalSolved ?? 0 },
        { label: 'Streak (days)',  v1: data1cf?.streakDays ?? 0,   v2: data2cf?.streakDays ?? 0 },
        { label: 'Contribution',   v1: data1cf?.contribution ?? 0, v2: data2cf?.contribution ?? 0 },
      )
    } else if (platform1 === 'LC' && platform2 === 'LC') {
      fields.push(
        { label: 'Contest Rating', v1: data1lc?.contestRating ?? 0,  v2: data2lc?.contestRating ?? 0 },
        { label: 'Total Solved',   v1: data1lc?.totalSolved ?? 0,    v2: data2lc?.totalSolved ?? 0 },
        { label: 'Easy Solved',    v1: data1lc?.easySolved ?? 0,     v2: data2lc?.easySolved ?? 0 },
        { label: 'Medium Solved',  v1: data1lc?.mediumSolved ?? 0,   v2: data2lc?.mediumSolved ?? 0 },
        { label: 'Hard Solved',    v1: data1lc?.hardSolved ?? 0,     v2: data2lc?.hardSolved ?? 0 },
        { label: 'Global Rank',    v1: data1lc?.globalRanking ?? 0,  v2: data2lc?.globalRanking ?? 0 },
        { label: 'Acceptance %',   v1: data1lc?.acceptanceRate ?? 0, v2: data2lc?.acceptanceRate ?? 0 },
      )
    } else {
      // Cross-platform
      const v1 = platform1 === 'CF' ? data1cf : data1lc
      const v2 = platform2 === 'CF' ? data2cf : data2lc
      fields.push(
        { label: 'Rating',        v1: (data1cf?.rating ?? data1lc?.contestRating ?? 0), v2: (data2cf?.rating ?? data2lc?.contestRating ?? 0) },
        { label: 'Total Solved',  v1: (v1 as any)?.totalSolved ?? 0, v2: (v2 as any)?.totalSolved ?? 0 },
      )
    }
    return fields
  })()

  // Build rating chart — same platform only
  const ratingChart = (() => {
    if (platform1 !== platform2) return []
    const h1Data = platform1 === 'CF' ? data1cf?.ratingHistory : data1lc?.ratingHistory
    const h2Data = platform1 === 'CF' ? data2cf?.ratingHistory : data2lc?.ratingHistory
    if (!h1Data?.length && !h2Data?.length) return []
    const len = Math.min(Math.max(h1Data?.length ?? 0, h2Data?.length ?? 0, 1), 20)
    return Array.from({ length: len }, (_, i) => {
      const i1 = h1Data ? Math.floor(i / len * h1Data.length) : -1
      const i2 = h2Data ? Math.floor(i / len * h2Data.length) : -1
      return {
        date: h1Data?.[i1]?.date ?? h2Data?.[i2]?.date ?? `P${i + 1}`,
        [h1.trim() || 'P1']: h1Data?.[i1]?.rating,
        [h2.trim() || 'P2']: h2Data?.[i2]?.rating,
      }
    })
  })()

  // Radar — same CF/CF platform only
  const radarData = (() => {
    if (platform1 !== 'CF' || platform2 !== 'CF') return []
    const tags = [...new Set([...Object.keys(data1cf?.tagDistribution ?? {}), ...Object.keys(data2cf?.tagDistribution ?? {})])].slice(0, 8)
    const m1 = Math.max(...Object.values(data1cf?.tagDistribution ?? { _: 1 }))
    const m2 = Math.max(...Object.values(data2cf?.tagDistribution ?? { _: 1 }))
    return tags.map(t => ({
      skill: t.length > 8 ? t.slice(0, 7) + '…' : t,
      [h1.trim() || 'P1']: Math.round(((data1cf?.tagDistribution ?? {})[t] ?? 0) / m1 * 100),
      [h2.trim() || 'P2']: Math.round(((data2cf?.tagDistribution ?? {})[t] ?? 0) / m2 * 100),
    }))
  })()

  // Winner analysis
  const winners = compFields.map(f => {
    const v1 = typeof f.v1 === 'string' ? parseFloat(f.v1) : f.v1
    const v2 = typeof f.v2 === 'string' ? parseFloat(f.v2) : f.v2
    // For rank, lower is better
    const isRank = f.label.includes('Rank')
    if (v1 === v2) return 'tie'
    if (isRank) return (v1 as number) < (v2 as number) ? 'p1' : 'p2'
    return (v1 as number) > (v2 as number) ? 'p1' : 'p2'
  })
  const p1wins = winners.filter(w => w === 'p1').length
  const p2wins = winners.filter(w => w === 'p2').length

  const PlatformSelect = ({ value, onChange, label }: { value: Platform; onChange: (v: Platform) => void; label: string }) => (
    <div className="relative">
      <label className="label block mb-1.5">{label}</label>
      <div className="flex gap-1 p-1 bg-white/[0.03] border border-white/[0.07] rounded-xl">
        <button onClick={() => onChange('CF')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${value === 'CF' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'text-slate-500 hover:text-slate-300'}`}>
          <Code2 size={12} /> Codeforces
        </button>
        <button onClick={() => onChange('LC')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${value === 'LC' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'text-slate-500 hover:text-slate-300'}`}>
          <StickyNote size={12} /> LeetCode
        </button>
      </div>
    </div>
  )

  const label1 = h1.trim() || 'Player 1'
  const label2 = h2.trim() || 'Player 2'

  return (
    <div className="flex-1 p-5 lg:p-8 space-y-6 animate-fade-in">
      <PageHeader title="User Comparison" sub="Real-time head-to-head — choose platform per user" icon={<Users size={20} />} />

      {/* Input card */}
      <Card>
        <div className="grid sm:grid-cols-2 gap-6 mb-5">
          {/* Player 1 */}
          <div className="space-y-3">
            <PlatformSelect value={platform1} onChange={setPlatform1} label="Player 1 — Platform" />
            <div>
              <label className="label block mb-1.5">Player 1 Handle</label>
              <input value={h1} onChange={e => setH1(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && compare()}
                placeholder={platform1 === 'CF' ? 'e.g. tourist' : 'e.g. neal_wu'}
                className="input font-mono" />
            </div>
          </div>
          {/* Player 2 */}
          <div className="space-y-3">
            <PlatformSelect value={platform2} onChange={setPlatform2} label="Player 2 — Platform" />
            <div>
              <label className="label block mb-1.5">Player 2 Handle</label>
              <input value={h2} onChange={e => setH2(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && compare()}
                placeholder={platform2 === 'CF' ? 'e.g. jiangly' : 'e.g. uwi'}
                className="input font-mono" />
            </div>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2.5 text-red-400 text-sm mb-4">
            <AlertCircle size={13} /> {error}
          </div>
        )}

        <button onClick={compare} disabled={loading} className="btn-primary disabled:opacity-60">
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
          {loading ? 'Fetching live data…' : `Compare ${platform1} vs ${platform2}`}
        </button>
      </Card>

      {compared && (data1cf || data1lc || data2cf || data2lc) && (
        <>
          {/* Profile cards */}
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { d: platform1 === 'CF' ? data1cf : data1lc, p: platform1, n: label1, c: '#3b82f6', win: p1wins > p2wins },
              { d: platform2 === 'CF' ? data2cf : data2lc, p: platform2, n: label2, c: '#f59e0b', win: p2wins > p1wins },
            ].map((item, i) => (
              <div key={i} className="card-p relative" style={{ borderColor: `${item.c}30`, background: `${item.c}08` }}>
                {item.win && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 text-xs font-bold text-yellow-400">
                    <Award size={14} /> Overall Winner
                  </div>
                )}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center border"
                    style={{ backgroundColor: `${item.c}15`, borderColor: `${item.c}30` }}>
                    {item.p === 'CF' ? <Code2 size={18} style={{ color: item.c }} /> : <StickyNote size={18} style={{ color: item.c }} />}
                  </div>
                  <div>
                    <p className="label">{item.p === 'CF' ? 'Codeforces' : 'LeetCode'}</p>
                    <h3 className="text-xl font-black font-mono" style={{ color: item.c }}>
                      {(item.d as any)?.handle ?? item.n}
                    </h3>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  {item.p === 'CF' && (item.d as CFData) ? (
                    <>
                      <div className="bg-white/[0.04] border border-white/[0.07] rounded-lg p-2">
                        <p className="font-mono font-bold text-white">{(item.d as CFData).rating}</p>
                        <p className="text-slate-500 text-xs">Rating</p>
                      </div>
                      <div className="bg-white/[0.04] border border-white/[0.07] rounded-lg p-2">
                        <p className="font-mono font-bold text-white">{(item.d as CFData).totalSolved}</p>
                        <p className="text-slate-500 text-xs">Solved</p>
                      </div>
                      <div className="bg-white/[0.04] border border-white/[0.07] rounded-lg p-2">
                        <p className="font-mono font-bold text-white">{(item.d as CFData).maxRating}</p>
                        <p className="text-slate-500 text-xs">Max</p>
                      </div>
                    </>
                  ) : item.p === 'LC' && (item.d as LCData) ? (
                    <>
                      <div className="bg-white/[0.04] border border-white/[0.07] rounded-lg p-2">
                        <p className="font-mono font-bold text-white">{(item.d as LCData).contestRating}</p>
                        <p className="text-slate-500 text-xs">Rating</p>
                      </div>
                      <div className="bg-white/[0.04] border border-white/[0.07] rounded-lg p-2">
                        <p className="font-mono font-bold text-white">{(item.d as LCData).totalSolved}</p>
                        <p className="text-slate-500 text-xs">Solved</p>
                      </div>
                      <div className="bg-white/[0.04] border border-white/[0.07] rounded-lg p-2">
                        <p className="font-mono font-bold text-white">#{(item.d as LCData).globalRanking?.toLocaleString()}</p>
                        <p className="text-slate-500 text-xs">Rank</p>
                      </div>
                    </>
                  ) : <div className="col-span-3 text-slate-500 text-sm">No data</div>}
                </div>
              </div>
            ))}
          </div>

          {/* Head to head bars */}
          <Card>
            <SectionHeader title="Head-to-Head Comparison" sub="Real data from live APIs" />
            <div className="space-y-4">
              {compFields.map((f, idx) => {
                const v1 = typeof f.v1 === 'string' ? parseFloat(f.v1) : (f.v1 as number)
                const v2 = typeof f.v2 === 'string' ? parseFloat(f.v2) : (f.v2 as number)
                const mx = Math.max(v1, v2, 1)
                const p1pct = Math.round(v1 / mx * 100)
                const p2pct = Math.round(v2 / mx * 100)
                const w = winners[idx]
                return (
                  <div key={f.label}>
                    <div className="flex justify-between mb-2 text-sm">
                      <span className={`font-mono font-bold ${w === 'p1' ? 'text-blue-400' : 'text-slate-400'}`}>{v1.toLocaleString()}</span>
                      <span className="text-slate-400 font-medium text-xs uppercase tracking-wider">{f.label}</span>
                      <span className={`font-mono font-bold ${w === 'p2' ? 'text-amber-400' : 'text-slate-400'}`}>{v2.toLocaleString()}</span>
                    </div>
                    <div className="flex gap-1.5 h-2.5">
                      <div className="flex-1 bg-white/[0.05] rounded-full overflow-hidden flex justify-end">
                        <div className="h-full bg-blue-500 rounded-full transition-all duration-700" style={{ width: `${p1pct}%` }} />
                      </div>
                      <div className="w-px bg-white/[0.1]" />
                      <div className="flex-1 bg-white/[0.05] rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full transition-all duration-700" style={{ width: `${p2pct}%` }} />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            {/* Winner summary */}
            <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center justify-center gap-3">
              <div className="text-center">
                <p className="text-blue-400 font-mono font-bold text-lg">{p1wins}</p>
                <p className="text-slate-500 text-xs">{label1} wins</p>
              </div>
              <div className="text-slate-600 font-bold">vs</div>
              <div className="text-center">
                <p className="text-amber-400 font-mono font-bold text-lg">{p2wins}</p>
                <p className="text-slate-500 text-xs">{label2} wins</p>
              </div>
            </div>
          </Card>

          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-5">
            {ratingChart.length > 1 && (
              <Card>
                <SectionHeader title="Rating History" sub="Progression over time" />
                <ResponsiveContainer width="100%" height={210}>
                  <LineChart data={ratingChart}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" vertical={false} />
                    <XAxis dataKey="date" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                    <YAxis tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} width={45} domain={['dataMin - 50', 'dataMax + 50']} />
                    <Tooltip content={<ChartTooltip />} />
                    <Line type="monotone" dataKey={label1} stroke="#3b82f6" strokeWidth={2.5} dot={false} connectNulls />
                    <Line type="monotone" dataKey={label2} stroke="#f59e0b" strokeWidth={2.5} dot={false} connectNulls />
                  </LineChart>
                </ResponsiveContainer>
                <div className="flex gap-5 mt-3">
                  <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 bg-blue-500 rounded" /><span className="text-slate-400 text-xs">{label1}</span></div>
                  <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 bg-amber-500 rounded" /><span className="text-slate-400 text-xs">{label2}</span></div>
                </div>
              </Card>
            )}
            {radarData.length > 2 && (
              <Card>
                <SectionHeader title="Topic Skill Radar" sub="CF tag distribution comparison" />
                <ResponsiveContainer width="100%" height={210}>
                  <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                    <PolarGrid stroke="#1e2d45" />
                    <PolarAngleAxis dataKey="skill" tick={{ fill: '#64748b', fontSize: 9 }} />
                    <Radar dataKey={label1} stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} strokeWidth={2} />
                    <Radar dataKey={label2} stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.15} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </Card>
            )}
          </div>
        </>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// GOALS PAGE
// ═══════════════════════════════════════════════════════════════════════════
export function GoalsPage() {
  const { user } = useAuth()
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<{ title: string; platform: Goal['platform']; target: number; current: number; deadline: string; color: string }>({
    title: '', platform: 'CF', target: 1600, current: 0, deadline: '', color: '#3b82f6',
  })

  useEffect(() => {
    if (!user) return
    getGoals(user.id).then(g => { setGoals(g); setLoading(false) })
  }, [user])

  const addGoal = async () => {
    if (!form.title || !user) return
    const g = await createGoal(user.id, { ...form, achieved: false })
    setGoals(prev => [g, ...prev])
    setShowForm(false)
    setForm({ title: '', platform: 'CF', target: 1600, current: 0, deadline: '', color: '#3b82f6' })
  }

  const removeGoal = async (id: string) => {
    await deleteGoal(id); setGoals(prev => prev.filter(g => g.id !== id))
  }

  const toggleAchieved = async (g: Goal) => {
    await updateGoal(g.id, { achieved: !g.achieved })
    setGoals(prev => prev.map(x => x.id === g.id ? { ...x, achieved: !x.achieved } : x))
  }

  if (loading) return (
    <div className="flex-1 p-5 lg:p-8 space-y-4">
      {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-32 rounded-2xl" />)}
    </div>
  )

  const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#a855f7', '#f43f5e', '#06b6d4']

  return (
    <div className="flex-1 p-5 lg:p-8 space-y-6 animate-fade-in">
      <div className="flex items-start justify-between">
        <PageHeader title="Goal Tracker" sub="Set targets — saved to your database" icon={<Target size={20} />} />
        <button onClick={() => setShowForm(v => !v)} className="btn-primary text-sm py-2 mt-1">
          <Plus size={14} /> New Goal
        </button>
      </div>

      {showForm && (
        <Card className="border-blue-500/20 animate-fade-in">
          <SectionHeader title="Add New Goal" />
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="label block mb-1.5">Title</label>
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="input" placeholder="e.g. Reach CF Expert" /></div>
            <div><label className="label block mb-1.5">Platform</label>
              <select value={form.platform} onChange={e => setForm(f => ({ ...f, platform: e.target.value as Goal['platform'] }))} className="input">
                <option value="CF">Codeforces</option><option value="LC">LeetCode</option><option value="BOTH">Both</option>
              </select></div>
            <div><label className="label block mb-1.5">Target Value</label>
              <input type="number" value={form.target} onChange={e => setForm(f => ({ ...f, target: +e.target.value }))} className="input font-mono" /></div>
            <div><label className="label block mb-1.5">Current Value</label>
              <input type="number" value={form.current} onChange={e => setForm(f => ({ ...f, current: +e.target.value }))} className="input font-mono" /></div>
            <div><label className="label block mb-1.5">Deadline</label>
              <input type="date" value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} className="input" /></div>
            <div><label className="label block mb-1.5">Colour</label>
              <div className="flex gap-2 pt-1">{COLORS.map(c => (
                <button key={c} onClick={() => setForm(f => ({ ...f, color: c }))}
                  className="w-8 h-8 rounded-lg border-2 transition-all"
                  style={{ backgroundColor: c, borderColor: form.color === c ? 'white' : 'transparent' }} />
              ))}</div></div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={addGoal} className="btn-primary">Save Goal</button>
            <button onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
          </div>
        </Card>
      )}

      {goals.length === 0 ? (
        <div className="card-p text-center py-14">
          <Target size={40} className="text-slate-600 mx-auto mb-3" />
          <h3 className="text-white font-bold mb-1">No goals yet</h3>
          <p className="text-slate-500 text-sm">Add a goal to track your progress!</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals.map(g => {
            const pct = g.target > 0 ? Math.min(100, Math.round(g.current / g.target * 100)) : 0
            const daysLeft = g.deadline ? Math.ceil((new Date(g.deadline).getTime() - Date.now()) / 86400000) : null
            return (
              <div key={g.id} className={`card-p transition-all ${g.achieved ? 'opacity-60' : 'hover:border-white/[0.15]'}`}
                style={{ borderColor: `${g.color}25` }}>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-white font-bold text-sm leading-tight pr-2 flex-1">{g.title}</h3>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => toggleAchieved(g)}
                      className={`p-1.5 rounded-lg transition-colors ${g.achieved ? 'text-green-400' : 'text-slate-500 hover:text-green-400'}`}>
                      <CheckCircle size={14} />
                    </button>
                    <button onClick={() => removeGoal(g.id)} className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="font-mono font-black text-2xl text-white">{g.current.toLocaleString()}</span>
                  <span className="text-slate-500 text-sm self-end font-mono">/ {g.target.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-white/[0.05] rounded-full mb-2 overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: g.color }} />
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span className="font-semibold" style={{ color: g.color }}>{pct}%{g.achieved ? ' ✓' : ''}</span>
                  {daysLeft !== null && <span>{daysLeft > 0 ? `${daysLeft}d left` : 'Overdue'}</span>}
                </div>
                <span className={`badge text-[10px] mt-2 ${g.platform === 'CF' ? 'badge-blue' : g.platform === 'LC' ? 'badge-amber' : 'badge-purple'}`}>
                  {g.platform}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// NOTES PAGE
// ═══════════════════════════════════════════════════════════════════════════
export function NotesPage() {
  const { user } = useAuth()
  const [notes, setNotes] = useState<Note[]>([])
  const [sel, setSel] = useState<Note | null>(null)
  const [filter, setFilter] = useState<'all' | 'bookmarked'>('all')
  const [loading, setLoading] = useState(true)
  const [newNote, setNewNote] = useState(false)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ title: '', content: '', platform: 'CF' as Note['platform'], tags: '', url: '' })

  useEffect(() => {
    if (!user) return
    getNotes(user.id).then(n => { setNotes(n); setLoading(false) })
  }, [user])

  const filtered = filter === 'all' ? notes : notes.filter(n => n.bookmarked)

  const saveNew = async () => {
    if (!form.title || !user) return
    const n = await createNote(user.id, {
      title: form.title, content: form.content, platform: form.platform,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean), url: form.url, bookmarked: false,
    })
    setNotes(prev => [n, ...prev]); setSel(n); setNewNote(false)
    setForm({ title: '', content: '', platform: 'CF', tags: '', url: '' })
  }

  const toggleBook = async (id: string) => {
    const n = notes.find(x => x.id === id); if (!n) return
    await updNote(id, { bookmarked: !n.bookmarked })
    setNotes(prev => prev.map(x => x.id === id ? { ...x, bookmarked: !x.bookmarked } : x))
    if (sel?.id === id) setSel(prev => prev ? { ...prev, bookmarked: !prev.bookmarked } : null)
  }

  const delN = async (id: string) => {
    await delNote(id); setNotes(prev => prev.filter(x => x.id !== id))
    if (sel?.id === id) setSel(null)
  }

  const startEdit = () => {
    if (!sel) return
    setForm({ title: sel.title, content: sel.content, platform: sel.platform, tags: sel.tags.join(', '), url: sel.url })
    setEditing(true); setNewNote(false)
  }

  const saveEdit = async () => {
    if (!sel) return
    const updated = { ...sel, title: form.title, content: form.content, platform: form.platform, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean), url: form.url }
    await updNote(sel.id, { title: form.title, content: form.content, platform: form.platform, tags: updated.tags, url: form.url })
    setNotes(prev => prev.map(x => x.id === sel.id ? updated : x))
    setSel(updated); setEditing(false)
  }

  const badgeClass = (p: string) => p === 'CF' ? 'badge-blue' : p === 'LC' ? 'badge-amber' : 'badge-purple'

  if (loading) return <div className="flex-1 p-5 lg:p-8"><div className="skeleton h-64 rounded-2xl" /></div>

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-3.5rem)] lg:h-screen overflow-hidden">
      {/* List sidebar */}
      <div className="w-full lg:w-72 shrink-0 border-b lg:border-b-0 lg:border-r border-white/[0.06] flex flex-col bg-[#0a1628]">
        <div className="p-4 border-b border-white/[0.06]">
          <div className="flex items-center justify-between mb-3">
            <h1 className="font-bold text-white flex items-center gap-2 text-sm"><BookMarked size={15} />Notes ({notes.length})</h1>
            <button onClick={() => { setNewNote(true); setEditing(false); setSel(null) }}
              className="btn-primary text-xs py-1.5 px-3"><Plus size={11} />New</button>
          </div>
          <div className="flex gap-1">
            {(['all', 'bookmarked'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`flex-1 text-xs py-1.5 rounded-lg font-medium transition-all ${filter === f ? 'bg-blue-500 text-white' : 'text-slate-500 hover:bg-white/[0.05] hover:text-slate-300'}`}>
                {f === 'all' ? `All (${notes.length})` : `★ (${notes.filter(n => n.bookmarked).length})`}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 && <div className="text-center py-8 text-slate-500 text-sm">{filter === 'bookmarked' ? 'No bookmarked notes' : 'No notes yet'}</div>}
          {filtered.map(n => (
            <button key={n.id} onClick={() => { setSel(n); setNewNote(false); setEditing(false) }}
              className={`w-full text-left p-3 rounded-xl transition-all ${sel?.id === n.id ? 'bg-blue-500/15 border border-blue-500/25' : 'hover:bg-white/[0.04] border border-transparent'}`}>
              <div className="flex justify-between mb-1">
                <span className="text-white font-semibold text-sm truncate">{n.title}</span>
                {n.bookmarked && <Star size={11} className="text-amber-400 shrink-0 ml-1" fill="currentColor" />}
              </div>
              <p className="text-slate-500 text-xs truncate">{n.content.slice(0, 55)}{n.content.length > 55 ? '…' : ''}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className={`badge text-[10px] ${badgeClass(n.platform)}`} style={{ fontSize: '10px', padding: '1px 6px' }}>{n.platform}</span>
                <span className="text-slate-600 text-[10px] font-mono">{n.created_at?.slice(0, 10)}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Detail panel */}
      <div className="flex-1 overflow-y-auto p-5 lg:p-8">
        {(newNote || editing) ? (
          <div className="max-w-2xl animate-fade-in">
            <h2 className="text-white font-bold text-lg mb-5">{editing ? 'Edit Note' : 'New Note'}</h2>
            <div className="space-y-4">
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Title…" className="input text-base font-semibold" />
              <div className="flex gap-3">
                <select value={form.platform} onChange={e => setForm(f => ({ ...f, platform: e.target.value as Note['platform'] }))} className="input w-28">
                  <option value="CF">CF</option><option value="LC">LC</option><option value="BOTH">Both</option>
                </select>
                <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="Tags (comma separated)" className="input flex-1" />
              </div>
              <input value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} placeholder="Problem URL (optional)" className="input font-mono text-sm" />
              <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                placeholder="Write your notes here…" rows={14} className="input font-mono text-sm resize-none leading-relaxed" />
              <div className="flex gap-3">
                <button onClick={editing ? saveEdit : saveNew} className="btn-primary">{editing ? 'Save Changes' : 'Save Note'}</button>
                <button onClick={() => { setNewNote(false); setEditing(false) }} className="btn-secondary">Cancel</button>
              </div>
            </div>
          </div>
        ) : sel ? (
          <div className="max-w-2xl animate-fade-in">
            <div className="flex items-start justify-between mb-5">
              <div className="flex-1 pr-4">
                <h2 className="text-white font-black text-xl mb-2">{sel.title}</h2>
                <div className="flex flex-wrap gap-2">
                  <span className={`badge text-xs ${badgeClass(sel.platform)}`}>{sel.platform}</span>
                  {sel.tags.map(t => <span key={t} className="tag">{t}</span>)}
                  <span className="flex items-center gap-1 text-slate-500 text-xs"><Clock size={9} />{sel.created_at?.slice(0, 10)}</span>
                  {sel.url && <a href={sel.url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-blue-400 text-xs hover:underline"><Link size={9} />Problem</a>}
                </div>
              </div>
              <div className="flex gap-1.5 shrink-0">
                <button onClick={startEdit} className="btn-ghost p-2"><Pencil size={14} /></button>
                <button onClick={() => toggleBook(sel.id)} className="btn-ghost p-2">
                  <Star size={14} className={sel.bookmarked ? 'text-amber-400' : 'text-slate-500'} fill={sel.bookmarked ? 'currentColor' : 'none'} />
                </button>
                <button onClick={() => delN(sel.id)} className="btn-danger p-2"><Trash2 size={14} /></button>
              </div>
            </div>
            <div className="card-p bg-white/[0.025] whitespace-pre-wrap font-mono text-sm text-slate-300 leading-relaxed min-h-[300px]">
              {sel.content || <span className="text-slate-600 italic">Empty note — click edit to add content</span>}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <BookMarked size={40} className="text-slate-700 mb-4" />
            <h3 className="text-white font-bold text-lg mb-2">Select a note</h3>
            <p className="text-slate-500 text-sm max-w-xs">Notes save to Supabase — they persist across sessions.</p>
          </div>
        )}
      </div>
    </div>
  )
}
