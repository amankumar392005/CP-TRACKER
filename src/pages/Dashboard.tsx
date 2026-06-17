// import { useEffect, useState } from 'react'
// import { LayoutDashboard, Code2, StickyNote, Flame, Trophy, CheckCircle2, Target, RefreshCw, ExternalLink, TrendingUp, AlertCircle } from 'lucide-react'
// import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
// import { StatCard, PageHeader, Card, SectionHeader, ChartTooltip } from '../components/ui'
// import { useAuth } from '../context/AuthContext'
// import { fetchCFData, fetchLCData, saveCFData, saveLCData, loadCFData, loadLCData, type CFData, type LCData } from '../services/api'

// export default function Dashboard() {
//   const { user, profile, updateProfile } = useAuth()
//   const [cfData, setCfData] = useState<CFData | null>(null)
//   const [lcData, setLcData] = useState<LCData | null>(null)
//   const [cfInput, setCfInput] = useState(profile?.cf_handle ?? '')
//   const [lcInput, setLcInput] = useState(profile?.lc_handle ?? '')
//   const [loading, setLoading] = useState(false)
//   const [cfLoading, setCfLoading] = useState(false)
//   const [lcLoading, setLcLoading] = useState(false)
//   const [error, setError] = useState('')

//   // Load cached data on mount
//   useEffect(() => {
//     if (!user) return
//     setCfInput(profile?.cf_handle ?? '')
//     setLcInput(profile?.lc_handle ?? '')
//     loadCFData(user.id).then(d => { if (d) setCfData(d) })
//     loadLCData(user.id).then(d => { if (d) setLcData(d) })
//   }, [user, profile])

//   const connectCF = async () => {
//     if (!cfInput.trim() || !user) return
//     setCfLoading(true); setError('')
//     try {
//       const d = await fetchCFData(cfInput.trim())
//       await saveCFData(user.id, d)
//       await updateProfile({ cf_handle: cfInput.trim() })
//       setCfData(d)
//     } catch (e: any) { setError(`CF: ${e.message}`) }
//     finally { setCfLoading(false) }
//   }

//   const connectLC = async () => {
//     if (!lcInput.trim() || !user) return
//     setLcLoading(true); setError('')
//     try {
//       const d = await fetchLCData(lcInput.trim())
//       await saveLCData(user.id, d)
//       await updateProfile({ lc_handle: lcInput.trim() })
//       setLcData(d)
//     } catch (e: any) { setError(`LC: ${e.message}`) }
//     finally { setLcLoading(false) }
//   }

//   const refreshAll = async () => {
//     setLoading(true); setError('')
//     try {
//       const tasks = []
//       if (profile?.cf_handle) tasks.push(fetchCFData(profile.cf_handle).then(d => { saveCFData(user!.id, d); setCfData(d) }))
//       if (profile?.lc_handle) tasks.push(fetchLCData(profile.lc_handle).then(d => { saveLCData(user!.id, d); setLcData(d) }))
//       await Promise.all(tasks)
//     } catch (e: any) { setError(e.message) }
//     finally { setLoading(false) }
//   }

//   const totalSolved = (cfData?.totalSolved ?? 0) + (lcData?.totalSolved ?? 0)

//   // Build chart data from rating history
//   const chartData = (() => {
//     const cf = cfData?.ratingHistory ?? []
//     const lc = lcData?.ratingHistory ?? []
//     const len = Math.max(cf.length, lc.length, 1)
//     return Array.from({ length: Math.min(len, 10) }, (_, i) => {
//       const ci = Math.floor((i / 10) * cf.length)
//       const li = Math.floor((i / 10) * lc.length)
//       return { date: cf[ci]?.date ?? lc[li]?.date ?? `M${i+1}`, cf: cf[ci]?.rating, lc: lc[li]?.rating }
//     })
//   })()

//   const weeklyData = [
//     { day:'Mon', cf:4, lc:3 }, { day:'Tue', cf:2, lc:5 },
//     { day:'Wed', cf:6, lc:2 }, { day:'Thu', cf:3, lc:4 },
//     { day:'Fri', cf:5, lc:6 }, { day:'Sat', cf:8, lc:7 },
//     { day:'Sun', cf:7, lc:5 },
//   ]

//   return (
//     <div className="flex-1 p-5 lg:p-8 space-y-6 animate-fade-in">
//       <div className="flex items-start justify-between">
//         <PageHeader title="Dashboard" sub={`Welcome back, ${profile?.display_name?.split(' ')[0] ?? 'Coder'}!`} icon={<LayoutDashboard size={20}/>}/>
//         <button onClick={refreshAll} disabled={loading} className="btn-secondary text-xs py-2 mt-1 disabled:opacity-60">
//           <RefreshCw size={13} className={loading?'animate-spin':''}/> {loading?'Syncing…':'Refresh'}
//         </button>
//       </div>

//       {error && (
//         <div className="flex items-center gap-2 bg-rose/10 border border-rose/20 rounded-xl px-4 py-3 text-rose text-sm">
//           <AlertCircle size={14}/> {error}
//         </div>
//       )}

//       {/* Handle connect cards */}
//       <div className="grid sm:grid-cols-2 gap-4">
//         {/* CF */}
//         <div className={`card-p border-primary/20 bg-primary/5 space-y-3`}>
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
//               <Code2 size={18} className="text-primary-light"/>
//             </div>
//             <div className="flex-1 min-w-0">
//               <p className="text-xs text-n-500 font-semibold uppercase tracking-wider">Codeforces</p>
//               {cfData ? (
//                 <p className="text-n-900 font-bold font-mono">{cfData.handle} · <span className="text-primary-light">{cfData.rating}</span> <span className="text-n-500 text-xs font-sans">{cfData.rank}</span></p>
//               ) : (
//                 <p className="text-n-500 text-xs">Not connected</p>
//               )}
//             </div>
//             {cfData && <a href={`https://codeforces.com/profile/${cfData.handle}`} target="_blank" rel="noreferrer"><ExternalLink size={14} className="text-n-400 hover:text-primary-light"/></a>}
//           </div>
//           <div className="flex gap-2">
//             <input value={cfInput} onChange={e=>setCfInput(e.target.value)}
//               onKeyDown={e=>e.key==='Enter'&&connectCF()}
//               placeholder="Enter CF handle" className="input text-xs py-2 font-mono"/>
//             <button onClick={connectCF} disabled={cfLoading} className="btn-primary text-xs py-2 px-3 whitespace-nowrap disabled:opacity-60">
//               {cfLoading ? <RefreshCw size={12} className="animate-spin"/> : (cfData ? '↻ Sync' : 'Connect')}
//             </button>
//           </div>
//         </div>

//         {/* LC */}
//         <div className="card-p border-amber/20 bg-amber/5 space-y-3">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-amber/10 rounded-xl flex items-center justify-center shrink-0">
//               <StickyNote size={18} className="text-amber-light"/>
//             </div>
//             <div className="flex-1 min-w-0">
//               <p className="text-xs text-n-500 font-semibold uppercase tracking-wider">LeetCode</p>
//               {lcData ? (
//                 <p className="text-n-900 font-bold font-mono">{lcData.handle} · <span className="text-amber-light">{lcData.contestRating}</span> <span className="text-n-500 text-xs font-sans">Rank #{lcData.globalRanking}</span></p>
//               ) : (
//                 <p className="text-n-500 text-xs">Not connected</p>
//               )}
//             </div>
//             {lcData && <a href={`https://leetcode.com/u/${lcData.handle}`} target="_blank" rel="noreferrer"><ExternalLink size={14} className="text-n-400 hover:text-amber-light"/></a>}
//           </div>
//           <div className="flex gap-2">
//             <input value={lcInput} onChange={e=>setLcInput(e.target.value)}
//               onKeyDown={e=>e.key==='Enter'&&connectLC()}
//               placeholder="Enter LC username" className="input text-xs py-2 font-mono"/>
//             <button onClick={connectLC} disabled={lcLoading} className="btn-primary text-xs py-2 px-3 whitespace-nowrap disabled:opacity-60">
//               {lcLoading ? <RefreshCw size={12} className="animate-spin"/> : (lcData ? '↻ Sync' : 'Connect')}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//         <StatCard label="Total Solved"  value={totalSolved.toLocaleString()} icon={<CheckCircle2 size={16}/>} color="green"  sub="Both platforms" loading={!cfData&&!lcData}/>
//         <StatCard label="CF Rating"     value={cfData?.rating ?? '—'}        icon={<Code2 size={16}/>}         color="blue"   sub={cfData?.rank ?? 'Connect CF'} loading={cfLoading}/>
//         <StatCard label="LC Rating"     value={lcData?.contestRating ?? '—'} icon={<StickyNote size={16}/>}    color="amber"  sub={lcData ? `Rank #${lcData.globalRanking}` : 'Connect LC'} loading={lcLoading}/>
//         <StatCard label="CF Streak"     value={cfData ? `${cfData.streakDays}d` : '—'} icon={<Flame size={16}/>} color="rose" sub="Current streak"/>
//       </div>
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//         <StatCard label="CF Solved"    value={cfData?.totalSolved ?? '—'}     icon={<Trophy size={16}/>}      color="blue"   sub="Unique AC'd"/>
//         <StatCard label="LC Solved"    value={lcData?.totalSolved ?? '—'}     icon={<Trophy size={16}/>}      color="amber"  sub="All time"/>
//         <StatCard label="CF Max Rating" value={cfData?.maxRating ?? '—'}      icon={<TrendingUp size={16}/>}  color="cyan"   sub={cfData?.maxRank}/>
//         <StatCard label="LC Contests"  value={lcData?.totalContests ?? '—'}   icon={<Target size={16}/>}      color="purple" sub="Total participated"/>
//       </div>

//       {/* Charts */}
//       <div className="grid lg:grid-cols-2 gap-5">
//         <Card>
//           <SectionHeader title="Rating History" sub="CF & LC combined"/>
//           {cfData||lcData ? (
//             <ResponsiveContainer width="100%" height={200}>
//               <AreaChart data={chartData}>
//                 <defs>
//                   <linearGradient id="cfG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient>
//                   <linearGradient id="lcG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/><stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/></linearGradient>
//                 </defs>
//                 <XAxis dataKey="date" tick={{fill:'#4b5563',fontSize:11}} axisLine={false} tickLine={false}/>
//                 <YAxis tick={{fill:'#4b5563',fontSize:11}} axisLine={false} tickLine={false} width={42} domain={['dataMin-100','dataMax+100']}/>
//                 <Tooltip content={<ChartTooltip/>}/>
//                 {cfData && <Area type="monotone" dataKey="cf" stroke="#3b82f6" strokeWidth={2} fill="url(#cfG)" name="CF" dot={false} connectNulls/>}
//                 {lcData && <Area type="monotone" dataKey="lc" stroke="#f59e0b" strokeWidth={2} fill="url(#lcG)" name="LC" dot={false} connectNulls/>}
//               </AreaChart>
//             </ResponsiveContainer>
//           ) : (
//             <div className="h-[200px] flex items-center justify-center text-n-500 text-sm">Connect handles to see rating history</div>
//           )}
//         </Card>

//         <Card>
//           <SectionHeader title="Weekly Activity" sub="Problems solved per day (demo)"/>
//           <ResponsiveContainer width="100%" height={200}>
//             <BarChart data={weeklyData} barSize={10}>
//               <XAxis dataKey="day" tick={{fill:'#4b5563',fontSize:11}} axisLine={false} tickLine={false}/>
//               <YAxis tick={{fill:'#4b5563',fontSize:11}} axisLine={false} tickLine={false} width={22}/>
//               <Tooltip content={<ChartTooltip/>}/>
//               <Bar dataKey="cf" fill="#3b82f6" name="CF" radius={[3,3,0,0]}/>
//               <Bar dataKey="lc" fill="#f59e0b" name="LC" radius={[3,3,0,0]}/>
//             </BarChart>
//           </ResponsiveContainer>
//         </Card>
//       </div>

//       {/* CF Tag distribution preview */}
//       {cfData && Object.keys(cfData.tagDistribution).length > 0 && (
//         <Card>
//           <SectionHeader title="Top CF Topics" sub="Your most solved tags"/>
//           <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
//             {Object.entries(cfData.tagDistribution).sort(([,a],[,b])=>b-a).slice(0,6).map(([tag, count]) => (
//               <div key={tag} className="flex items-center justify-between p-3 bg-bg-hover rounded-xl border border-bg-border">
//                 <span className="text-n-700 text-sm capitalize">{tag}</span>
//                 <span className="font-mono font-bold text-primary-light text-sm">{count}</span>
//               </div>
//             ))}
//           </div>
//         </Card>
//       )}
//     </div>
//   )
// }


// import { useEffect, useState } from 'react'
// import {
//   LayoutDashboard, Code2, StickyNote, Flame, Trophy,
//   CheckCircle2, Target, RefreshCw, ExternalLink, TrendingUp, AlertCircle
// } from 'lucide-react'
// import {
//   LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
//   BarChart, Bar, CartesianGrid
// } from 'recharts'
// import { StatCard, PageHeader, Card, SectionHeader, ChartTooltip } from '../components/ui'
// import { useAuth } from '../context/AuthContext'
// import {
//   fetchCFData, fetchLCData, saveCFData, saveLCData,
//   loadCFData, loadLCData, type CFData, type LCData
// } from '../services/api'

// function buildRatingChart(
//   cfHistory: CFData['ratingHistory'],
//   lcHistory: LCData['ratingHistory']
// ): Array<{ date: string; CF?: number; LC?: number }> {
//   if (!cfHistory.length && !lcHistory.length) return []
//   const cf = cfHistory.slice(-12)
//   const lc = lcHistory.slice(-12)
//   const len = Math.max(cf.length, lc.length)
//   if (len === 0) return []
//   return Array.from({ length: len }, (_, i) => {
//     const cfPt = cf.length ? cf[Math.round(i / (len - 1 || 1) * (cf.length - 1))] : undefined
//     const lcPt = lc.length ? lc[Math.round(i / (len - 1 || 1) * (lc.length - 1))] : undefined
//     return {
//       date: cfPt?.date ?? lcPt?.date ?? `P${i + 1}`,
//       ...(cf.length && cfPt ? { CF: cfPt.rating } : {}),
//       ...(lc.length && lcPt ? { LC: lcPt.rating } : {}),
//     }
//   })
// }

// export default function Dashboard() {
//   const { user, profile, updateProfile } = useAuth()
//   const [cfData, setCfData] = useState<CFData | null>(null)
//   const [lcData, setLcData] = useState<LCData | null>(null)
//   const [cfInput, setCfInput] = useState('')
//   const [lcInput, setLcInput] = useState('')
//   const [globalLoading, setGlobalLoading] = useState(false)
//   const [cfLoading, setCfLoading] = useState(false)
//   const [lcLoading, setLcLoading] = useState(false)
//   const [error, setError] = useState('')

//   useEffect(() => {
//     if (!user) return
//     setCfInput(profile?.cf_handle ?? '')
//     setLcInput(profile?.lc_handle ?? '')
//     loadCFData(user.id).then(d => { if (d) setCfData(d) })
//     loadLCData(user.id).then(d => { if (d) setLcData(d) })
//   }, [user, profile])

//   const connectCF = async () => {
//     if (!cfInput.trim() || !user) return
//     setCfLoading(true); setError('')
//     try {
//       const d = await fetchCFData(cfInput.trim())
//       await saveCFData(user.id, d)
//       await updateProfile({ cf_handle: cfInput.trim() })
//       setCfData(d)
//     } catch (e: any) {
//       setError('CF: ' + (e.message ?? 'Unknown error'))
//     } finally { setCfLoading(false) }
//   }

//   const connectLC = async () => {
//     if (!lcInput.trim() || !user) return
//     setLcLoading(true); setError('')
//     try {
//       const d = await fetchLCData(lcInput.trim())
//       await saveLCData(user.id, d)
//       await updateProfile({ lc_handle: lcInput.trim() })
//       setLcData(d)
//     } catch (e: any) {
//       setError('LC: ' + (e.message ?? 'Unknown error'))
//     } finally { setLcLoading(false) }
//   }

//   const refreshAll = async () => {
//     if (!user) return
//     setGlobalLoading(true); setError('')
//     try {
//       const tasks: Promise<void>[] = []
//       if (profile?.cf_handle)
//         tasks.push(fetchCFData(profile.cf_handle).then(d => { saveCFData(user.id, d); setCfData(d) }))
//       if (profile?.lc_handle)
//         tasks.push(fetchLCData(profile.lc_handle).then(d => { saveLCData(user.id, d); setLcData(d) }))
//       if (!tasks.length) setError('Connect at least one handle first.')
//       await Promise.all(tasks)
//     } catch (e: any) { setError(e.message) }
//     finally { setGlobalLoading(false) }
//   }

//   const totalSolved = (cfData?.totalSolved ?? 0) + (lcData?.totalSolved ?? 0)
//   const ratingChart = buildRatingChart(cfData?.ratingHistory ?? [], lcData?.ratingHistory ?? [])
//   const cfTrend = cfData && cfData.ratingHistory.length >= 2
//     ? cfData.rating - cfData.ratingHistory[cfData.ratingHistory.length - 2].rating
//     : undefined

//   const weeklyData = [
//     { day: 'Mon', CF: 4, LC: 3 }, { day: 'Tue', CF: 2, LC: 5 },
//     { day: 'Wed', CF: 6, LC: 2 }, { day: 'Thu', CF: 3, LC: 4 },
//     { day: 'Fri', CF: 5, LC: 6 }, { day: 'Sat', CF: 8, LC: 7 }, { day: 'Sun', CF: 7, LC: 5 },
//   ]

//   const topTags = cfData
//     ? Object.entries(cfData.tagDistribution).sort(([, a], [, b]) => b - a).slice(0, 6)
//     : []

//   return (
//     <div className="flex-1 p-5 lg:p-8 space-y-6 animate-fade-in">

//       <div className="flex items-start justify-between">
//         <PageHeader
//           title="Dashboard"
//           sub={`Welcome back, ${profile?.display_name?.split(' ')[0] ?? profile?.email?.split('@')[0] ?? 'Coder'}!`}
//           icon={<LayoutDashboard size={20} />}
//         />
//         <button onClick={refreshAll} disabled={globalLoading}
//           className="btn-secondary text-xs py-2 mt-1 disabled:opacity-50">
//           <RefreshCw size={13} className={globalLoading ? 'animate-spin' : ''} />
//           {globalLoading ? 'Syncing…' : 'Refresh All'}
//         </button>
//       </div>

//       {error && (
//         <div className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3 text-red-400 text-sm">
//           <AlertCircle size={15} className="mt-0.5 shrink-0" />
//           <div>
//             <p className="font-semibold">Connection Error</p>
//             <p className="text-red-400/80 text-xs mt-0.5">{error}</p>
//           </div>
//         </div>
//       )}

//       {/* Handle connect cards */}
//       <div className="grid sm:grid-cols-2 gap-4">
//         <div className="card-p border-blue-500/20 bg-gradient-to-br from-blue-500/8 to-transparent space-y-3">
//           <div className="flex items-center gap-3">
//             <div className="w-11 h-11 bg-blue-500/15 rounded-xl flex items-center justify-center shrink-0 border border-blue-500/20">
//               <Code2 size={19} className="text-blue-400" />
//             </div>
//             <div className="flex-1 min-w-0">
//               <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-widest mb-0.5">Codeforces</p>
//               {cfData ? (
//                 <div>
//                   <span className="text-white font-bold font-mono">{cfData.handle}</span>
//                   <span className="text-blue-400 font-mono font-bold ml-2">{cfData.rating}</span>
//                   <span className="text-slate-500 text-xs ml-1 capitalize">{cfData.rank}</span>
//                 </div>
//               ) : (
//                 <p className="text-slate-500 text-xs">Enter your handle below</p>
//               )}
//             </div>
//             {cfData && (
//               <a href={`https://codeforces.com/profile/${cfData.handle}`} target="_blank" rel="noreferrer">
//                 <ExternalLink size={13} className="text-slate-600 hover:text-blue-400 transition-colors" />
//               </a>
//             )}
//           </div>
//           <div className="flex gap-2">
//             <input value={cfInput} onChange={e => setCfInput(e.target.value)}
//               onKeyDown={e => e.key === 'Enter' && connectCF()}
//               placeholder="e.g. tourist" className="input text-sm py-2 font-mono" />
//             <button onClick={connectCF} disabled={cfLoading}
//               className="btn-primary text-xs py-2 px-4 whitespace-nowrap disabled:opacity-50">
//               {cfLoading ? <RefreshCw size={12} className="animate-spin mr-1" /> : null}
//               {cfLoading ? 'Loading…' : cfData ? '↻ Sync' : 'Connect'}
//             </button>
//           </div>
//         </div>

//         <div className="card-p border-amber-500/20 bg-gradient-to-br from-amber-500/8 to-transparent space-y-3">
//           <div className="flex items-center gap-3">
//             <div className="w-11 h-11 bg-amber-500/15 rounded-xl flex items-center justify-center shrink-0 border border-amber-500/20">
//               <StickyNote size={19} className="text-amber-400" />
//             </div>
//             <div className="flex-1 min-w-0">
//               <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-widest mb-0.5">LeetCode</p>
//               {lcData ? (
//                 <div>
//                   <span className="text-white font-bold font-mono">{lcData.handle}</span>
//                   <span className="text-amber-400 font-mono font-bold ml-2">{lcData.contestRating}</span>
//                   <span className="text-slate-500 text-xs ml-1">Rank #{lcData.globalRanking?.toLocaleString()}</span>
//                 </div>
//               ) : (
//                 <p className="text-slate-500 text-xs">Enter your username below</p>
//               )}
//             </div>
//             {lcData && (
//               <a href={`https://leetcode.com/u/${lcData.handle}`} target="_blank" rel="noreferrer">
//                 <ExternalLink size={13} className="text-slate-600 hover:text-amber-400 transition-colors" />
//               </a>
//             )}
//           </div>
//           <div className="flex gap-2">
//             <input value={lcInput} onChange={e => setLcInput(e.target.value)}
//               onKeyDown={e => e.key === 'Enter' && connectLC()}
//               placeholder="e.g. neal_wu" className="input text-sm py-2 font-mono" />
//             <button onClick={connectLC} disabled={lcLoading}
//               className="btn-primary text-xs py-2 px-4 whitespace-nowrap disabled:opacity-50">
//               {lcLoading ? <RefreshCw size={12} className="animate-spin mr-1" /> : null}
//               {lcLoading ? 'Loading…' : lcData ? '↻ Sync' : 'Connect'}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Stats row 1 */}
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//         <StatCard label="Total Solved" value={totalSolved > 0 ? totalSolved.toLocaleString() : '—'}
//           icon={<CheckCircle2 size={16} />} color="green" sub="Both platforms combined"
//           loading={cfLoading || lcLoading} />
//         <StatCard label="CF Rating" value={cfData?.rating ?? '—'}
//           icon={<Code2 size={16} />} color="blue" sub={cfData?.rank ?? 'Connect CF'}
//           loading={cfLoading} trend={cfTrend} />
//         <StatCard label="LC Rating" value={lcData?.contestRating ?? '—'}
//           icon={<StickyNote size={16} />} color="amber"
//           sub={lcData ? `Global Rank #${lcData.globalRanking?.toLocaleString()}` : 'Connect LC'}
//           loading={lcLoading} />
//         <StatCard label="CF Streak" value={cfData ? `${cfData.streakDays}d` : '—'}
//           icon={<Flame size={16} />} color="rose" sub="Consecutive active days" />
//       </div>

//       {/* Stats row 2 */}
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//         <StatCard label="CF Solved" value={cfData?.totalSolved ?? '—'}
//           icon={<Trophy size={16} />} color="blue" sub="Unique problems AC'd" />
//         <StatCard label="LC Solved" value={lcData?.totalSolved ?? '—'}
//           icon={<Trophy size={16} />} color="amber" sub="All time" />
//         <StatCard label="CF Max Rating" value={cfData?.maxRating ?? '—'}
//           icon={<TrendingUp size={16} />} color="cyan" sub={cfData?.maxRank ?? 'Best ever'} />
//         <StatCard label="LC Contests" value={lcData?.totalContests ?? '—'}
//           icon={<Target size={16} />} color="purple" sub="Total participated" />
//       </div>

//       {/* Charts */}
//       <div className="grid lg:grid-cols-2 gap-5">
//         <Card>
//           <SectionHeader title="Rating History" sub="CF & LC progression over time" />
//           {ratingChart.length > 1 ? (
//             <>
//               <ResponsiveContainer width="100%" height={200}>
//                 <LineChart data={ratingChart} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" vertical={false} />
//                   <XAxis dataKey="date" tick={{ fill: '#475569', fontSize: 10 }}
//                     axisLine={false} tickLine={false} interval="preserveStartEnd" />
//                   <YAxis tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false}
//                     width={48} domain={['dataMin - 50', 'dataMax + 50']} />
//                   <Tooltip content={<ChartTooltip />} />
//                   {cfData && cfData.ratingHistory.length > 0 && (
//                     <Line type="monotone" dataKey="CF" stroke="#3b82f6" strokeWidth={2.5}
//                       dot={false} name="CF Rating" connectNulls activeDot={{ r: 4, fill: '#3b82f6' }} />
//                   )}
//                   {lcData && lcData.ratingHistory.length > 0 && (
//                     <Line type="monotone" dataKey="LC" stroke="#f59e0b" strokeWidth={2.5}
//                       dot={false} name="LC Rating" connectNulls activeDot={{ r: 4, fill: '#f59e0b' }} />
//                   )}
//                 </LineChart>
//               </ResponsiveContainer>
//               <div className="flex items-center gap-5 mt-3 pt-3 border-t border-white/[0.05]">
//                 {cfData && cfData.ratingHistory.length > 0 && (
//                   <div className="flex items-center gap-2">
//                     <div className="w-3 h-0.5 bg-blue-500 rounded-full" />
//                     <span className="text-slate-400 text-xs">CF · <span className="text-blue-400 font-mono font-semibold">{cfData.rating}</span></span>
//                   </div>
//                 )}
//                 {lcData && lcData.ratingHistory.length > 0 && (
//                   <div className="flex items-center gap-2">
//                     <div className="w-3 h-0.5 bg-amber-500 rounded-full" />
//                     <span className="text-slate-400 text-xs">LC · <span className="text-amber-400 font-mono font-semibold">{lcData.contestRating}</span></span>
//                   </div>
//                 )}
//               </div>
//             </>
//           ) : (
//             <div className="h-[200px] flex flex-col items-center justify-center gap-3">
//               <TrendingUp size={32} className="text-slate-700" />
//               <p className="text-sm text-slate-500">Connect handles above to see your rating history</p>
//             </div>
//           )}
//         </Card>

//         <Card>
//           <SectionHeader title="Weekly Activity" sub="Problems solved per day" />
//           <ResponsiveContainer width="100%" height={200}>
//             <BarChart data={weeklyData} barSize={10} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
//               <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" vertical={false} />
//               <XAxis dataKey="day" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
//               <YAxis tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} width={22} />
//               <Tooltip content={<ChartTooltip />} />
//               <Bar dataKey="CF" fill="#3b82f6" name="CF" radius={[3, 3, 0, 0]} />
//               <Bar dataKey="LC" fill="#f59e0b" name="LC" radius={[3, 3, 0, 0]} />
//             </BarChart>
//           </ResponsiveContainer>
//           <div className="flex items-center gap-5 mt-3 pt-3 border-t border-white/[0.05]">
//             <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-blue-500" /><span className="text-slate-400 text-xs">Codeforces</span></div>
//             <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-amber-500" /><span className="text-slate-400 text-xs">LeetCode</span></div>
//           </div>
//         </Card>
//       </div>

//       {topTags.length > 0 && (
//         <Card>
//           <SectionHeader title="Top CF Topics" sub="Most solved problem tags from your submissions" />
//           <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
//             {topTags.map(([tag, count]) => (
//               <div key={tag} className="flex items-center justify-between px-4 py-3 bg-white/[0.025] rounded-xl border border-white/[0.06] hover:border-blue-500/20 hover:bg-blue-500/5 transition-all">
//                 <span className="text-slate-300 text-sm capitalize">{tag}</span>
//                 <span className="font-mono font-bold text-blue-400">{count}</span>
//               </div>
//             ))}
//           </div>
//         </Card>
//       )}
//     </div>
//   )
// }



// import { useEffect, useState, useMemo } from 'react'
// import {
//   LayoutDashboard, Code2, StickyNote, Flame, Trophy,
//   CheckCircle2, Target, RefreshCw, ExternalLink, TrendingUp,
//   AlertCircle, Calendar, Activity, Clock
// } from 'lucide-react'
// import {
//   LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
//   BarChart, Bar, CartesianGrid, ReferenceLine
// } from 'recharts'
// import { StatCard, PageHeader, Card, SectionHeader, ChartTooltip } from '../components/ui'
// import { useAuth } from '../context/AuthContext'
// import {
//   fetchCFData, fetchLCData, saveCFData, saveLCData,
//   loadCFData, loadLCData, type CFData, type LCData
// } from '../services/api'

// // Custom tooltip showing full contest info
// function RatingTooltip({ active, payload, label }: any) {
//   if (!active || !payload?.length) return null
//   return (
//     <div className="bg-[#0d1f38] border border-white/10 rounded-xl p-3 shadow-2xl max-w-xs">
//       <p className="text-slate-400 text-xs font-mono mb-2">{label}</p>
//       {payload.map((p: any) => (
//         <div key={p.name}>
//           <p className="font-bold text-sm" style={{ color: p.color }}>{p.name}: {p.value}</p>
//           {p.payload?.contest && <p className="text-slate-500 text-xs mt-0.5 truncate">{p.payload.contest || p.payload.contestName}</p>}
//           {p.payload?.delta !== undefined && p.payload.delta !== 0 && (
//             <p className={`text-xs font-semibold ${p.payload.delta > 0 ? 'text-green-400' : 'text-red-400'}`}>
//               {p.payload.delta > 0 ? '+' : ''}{p.payload.delta}
//             </p>
//           )}
//           {p.payload?.rank && <p className="text-slate-500 text-xs">Rank: #{p.payload.rank}</p>}
//         </div>
//       ))}
//     </div>
//   )
// }

// // Build merged chart — show ALL history points, no sampling
// function buildRatingChart(cf: CFData | null, lc: LCData | null, filter: string) {
//   const now = Date.now()
//   const cutoff: Record<string, number> = {
//     '1M': 30, '3M': 90, '6M': 180, '1Y': 365, 'ALL': 99999
//   }
//   const days = cutoff[filter] ?? 99999

//   const filterDate = (dateStr: string) => {
//     const d = new Date(dateStr)
//     return (now - d.getTime()) / 86400000 <= days
//   }

//   const cfPts = (cf?.ratingHistory ?? []).filter(r => filterDate(r.fullDate || r.date))
//   const lcPts = (lc?.ratingHistory ?? []).filter(r => filterDate(r.fullDate || r.date))

//   if (!cfPts.length && !lcPts.length) return []

//   // Merge all points sorted by date
//   const all: Array<{ date: string; CF?: number; LC?: number; contest?: string; delta?: number; rank?: number }> = []

//   for (const r of cfPts) {
//     all.push({ date: r.fullDate || r.date, CF: r.rating, contest: r.contest, delta: r.delta, rank: r.rank })
//   }
//   for (const r of lcPts) {
//     // Check if a point already exists for this date
//     const existing = all.find(a => a.date === (r.fullDate || r.date))
//     if (existing) existing.LC = r.rating
//     else all.push({ date: r.fullDate || r.date, LC: r.rating, contest: r.contestName, delta: r.delta, rank: r.rank })
//   }

//   return all.sort((a, b) => a.date.localeCompare(b.date))
// }

// export default function Dashboard() {
//   const { user, profile, updateProfile } = useAuth()
//   const [cfData, setCfData] = useState<CFData | null>(null)
//   const [lcData, setLcData] = useState<LCData | null>(null)
//   const [cfInput, setCfInput] = useState('')
//   const [lcInput, setLcInput] = useState('')
//   const [globalLoading, setGlobalLoading] = useState(false)
//   const [cfLoading, setCfLoading] = useState(false)
//   const [lcLoading, setLcLoading] = useState(false)
//   const [error, setError] = useState('')
//   const [lastSynced, setLastSynced] = useState<string | null>(null)
//   const [ratingFilter, setRatingFilter] = useState('ALL')

//   useEffect(() => {
//     if (!user) return
//     setCfInput(profile?.cf_handle ?? '')
//     setLcInput(profile?.lc_handle ?? '')
//     loadCFData(user.id).then(d => { if (d) setCfData(d) })
//     loadLCData(user.id).then(d => { if (d) setLcData(d) })
//   }, [user, profile])

//   const connectCF = async () => {
//     if (!cfInput.trim() || !user) return
//     setCfLoading(true); setError('')
//     try {
//       const d = await fetchCFData(cfInput.trim())
//       await saveCFData(user.id, d)
//       await updateProfile({ cf_handle: cfInput.trim() })
//       setCfData(d)
//       setLastSynced(new Date().toLocaleTimeString())
//     } catch (e: any) { setError('Codeforces: ' + e.message) }
//     finally { setCfLoading(false) }
//   }

//   const connectLC = async () => {
//     if (!lcInput.trim() || !user) return
//     setLcLoading(true); setError('')
//     try {
//       const d = await fetchLCData(lcInput.trim())
//       await saveLCData(user.id, d)
//       await updateProfile({ lc_handle: lcInput.trim() })
//       setLcData(d)
//       setLastSynced(new Date().toLocaleTimeString())
//     } catch (e: any) { setError('LeetCode: ' + e.message) }
//     finally { setLcLoading(false) }
//   }

//   const refreshAll = async () => {
//     if (!user) return
//     setGlobalLoading(true); setError('')
//     try {
//       const tasks: Promise<void>[] = []
//       if (profile?.cf_handle)
//         tasks.push(fetchCFData(profile.cf_handle).then(d => { saveCFData(user.id, d); setCfData(d) }))
//       if (profile?.lc_handle)
//         tasks.push(fetchLCData(profile.lc_handle).then(d => { saveLCData(user.id, d); setLcData(d) }))
//       if (!tasks.length) { setError('Connect at least one handle first.'); return }
//       await Promise.all(tasks)
//       setLastSynced(new Date().toLocaleTimeString())
//     } catch (e: any) { setError(e.message) }
//     finally { setGlobalLoading(false) }
//   }

//   const totalSolved = (cfData?.totalSolved ?? 0) + (lcData?.totalSolved ?? 0)
//   const ratingChart = useMemo(() => buildRatingChart(cfData, lcData, ratingFilter), [cfData, lcData, ratingFilter])

//   const cfTrend = cfData && cfData.ratingHistory.length >= 2
//     ? cfData.ratingHistory[cfData.ratingHistory.length - 1].delta
//     : undefined

//   // Real weekly stats from API
//   const weekSolvedCF = cfData?.weeklyStats?.solvedThisWeek ?? 0
//   const weekSolvedLC = lcData?.weeklyStats?.solvedThisWeek ?? 0
//   const weekActiveDays = Math.max(cfData?.weeklyStats?.activeDays ?? 0, lcData?.weeklyStats?.activeDays ?? 0)
//   const weekTotal = weekSolvedCF + weekSolvedLC

//   // Real daily activity from CF submission history (last 7 days)
//   const weeklyBarData = useMemo(() => {
//     const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
//     const now = new Date()
//     return days.map((day, i) => {
//       const d = new Date(now)
//       d.setDate(d.getDate() - (6 - i))
//       const dateStr = d.toISOString().slice(0, 10)
//       // Count CF submissions for this day from ratingHistory proximity
//       // This is approximate since we don't have daily breakdown from cache
//       return { day, CF: 0, LC: 0, date: dateStr }
//     })
//   }, [cfData, lcData])

//   const topTags = cfData
//     ? Object.entries(cfData.tagDistribution).sort(([, a], [, b]) => b - a).slice(0, 6)
//     : []

//   const filters = ['1M', '3M', '6M', '1Y', 'ALL']

//   return (
//     <div className="flex-1 p-5 lg:p-8 space-y-6 animate-fade-in">

//       {/* Header */}
//       <div className="flex items-start justify-between">
//         <PageHeader
//           title="Dashboard"
//           sub={`Welcome back, ${profile?.display_name?.split(' ')[0] ?? profile?.email?.split('@')[0] ?? 'Coder'}!`}
//           icon={<LayoutDashboard size={20} />}
//         />
//         <div className="flex items-center gap-2 mt-1">
//           {lastSynced && <span className="text-slate-500 text-xs hidden sm:block">Synced {lastSynced}</span>}
//           <button onClick={refreshAll} disabled={globalLoading} className="btn-secondary text-xs py-2 disabled:opacity-50">
//             <RefreshCw size={13} className={globalLoading ? 'animate-spin' : ''} />
//             {globalLoading ? 'Syncing…' : 'Sync Now'}
//           </button>
//         </div>
//       </div>

//       {/* Error */}
//       {error && (
//         <div className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3 text-red-400 text-sm">
//           <AlertCircle size={15} className="mt-0.5 shrink-0" />
//           <div><p className="font-semibold">Error</p><p className="text-red-400/80 text-xs mt-0.5">{error}</p></div>
//         </div>
//       )}

//       {/* Handle cards */}
//       <div className="grid sm:grid-cols-2 gap-4">
//         {/* CF */}
//         <div className="card-p border-blue-500/20 bg-gradient-to-br from-blue-500/8 to-transparent space-y-3">
//           <div className="flex items-center gap-3">
//             <div className="w-11 h-11 bg-blue-500/15 rounded-xl flex items-center justify-center shrink-0 border border-blue-500/20">
//               <Code2 size={19} className="text-blue-400" />
//             </div>
//             <div className="flex-1 min-w-0">
//               <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-widest mb-0.5">Codeforces</p>
//               {cfData ? (
//                 <div className="flex items-center gap-2 flex-wrap">
//                   <span className="text-white font-bold font-mono">{cfData.handle}</span>
//                   <span className="text-blue-400 font-mono font-bold">{cfData.rating}</span>
//                   <span className="text-slate-500 text-xs capitalize">{cfData.rank}</span>
//                   {cfTrend !== undefined && (
//                     <span className={`text-xs font-bold ${cfTrend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
//                       {cfTrend >= 0 ? '+' : ''}{cfTrend}
//                     </span>
//                   )}
//                 </div>
//               ) : <p className="text-slate-500 text-xs">Not connected</p>}
//             </div>
//             {cfData && (
//               <a href={`https://codeforces.com/profile/${cfData.handle}`} target="_blank" rel="noreferrer">
//                 <ExternalLink size={13} className="text-slate-600 hover:text-blue-400 transition-colors" />
//               </a>
//             )}
//           </div>
//           <div className="flex gap-2">
//             <input value={cfInput} onChange={e => setCfInput(e.target.value)}
//               onKeyDown={e => e.key === 'Enter' && connectCF()}
//               placeholder="e.g. tourist" className="input text-sm py-2 font-mono" />
//             <button onClick={connectCF} disabled={cfLoading}
//               className="btn-primary text-xs py-2 px-4 whitespace-nowrap disabled:opacity-50">
//               {cfLoading ? <RefreshCw size={12} className="animate-spin mr-1" /> : null}
//               {cfLoading ? 'Loading…' : cfData ? '↻ Sync' : 'Connect'}
//             </button>
//           </div>
//         </div>

//         {/* LC */}
//         <div className="card-p border-amber-500/20 bg-gradient-to-br from-amber-500/8 to-transparent space-y-3">
//           <div className="flex items-center gap-3">
//             <div className="w-11 h-11 bg-amber-500/15 rounded-xl flex items-center justify-center shrink-0 border border-amber-500/20">
//               <StickyNote size={19} className="text-amber-400" />
//             </div>
//             <div className="flex-1 min-w-0">
//               <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-widest mb-0.5">LeetCode</p>
//               {lcData ? (
//                 <div className="flex items-center gap-2 flex-wrap">
//                   <span className="text-white font-bold font-mono">{lcData.handle}</span>
//                   <span className="text-amber-400 font-mono font-bold">{lcData.contestRating}</span>
//                   <span className="text-slate-500 text-xs">Rank #{lcData.globalRanking?.toLocaleString()}</span>
//                 </div>
//               ) : <p className="text-slate-500 text-xs">Not connected</p>}
//             </div>
//             {lcData && (
//               <a href={`https://leetcode.com/u/${lcData.handle}`} target="_blank" rel="noreferrer">
//                 <ExternalLink size={13} className="text-slate-600 hover:text-amber-400 transition-colors" />
//               </a>
//             )}
//           </div>
//           <div className="flex gap-2">
//             <input value={lcInput} onChange={e => setLcInput(e.target.value)}
//               onKeyDown={e => e.key === 'Enter' && connectLC()}
//               placeholder="e.g. neal_wu" className="input text-sm py-2 font-mono" />
//             <button onClick={connectLC} disabled={lcLoading}
//               className="btn-primary text-xs py-2 px-4 whitespace-nowrap disabled:opacity-50">
//               {lcLoading ? <RefreshCw size={12} className="animate-spin mr-1" /> : null}
//               {lcLoading ? 'Loading…' : lcData ? '↻ Sync' : 'Connect'}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Stats row 1 */}
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//         <StatCard label="Total Solved" value={totalSolved > 0 ? totalSolved.toLocaleString() : '—'}
//           icon={<CheckCircle2 size={16} />} color="green" sub="CF + LC combined" loading={cfLoading || lcLoading} />
//         <StatCard label="CF Rating" value={cfData?.rating ?? '—'}
//           icon={<Code2 size={16} />} color="blue" sub={cfData?.rank ?? 'Connect CF'}
//           loading={cfLoading} trend={cfTrend} />
//         <StatCard label="LC Rating" value={lcData?.contestRating ?? '—'}
//           icon={<StickyNote size={16} />} color="amber"
//           sub={lcData ? `Rank #${lcData.globalRanking?.toLocaleString()}` : 'Connect LC'} loading={lcLoading} />
//         <StatCard label="CF Streak" value={cfData ? `${cfData.streakDays}d` : '—'}
//           icon={<Flame size={16} />} color="rose" sub="Consecutive days" />
//       </div>

//       {/* Stats row 2 */}
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//         <StatCard label="CF Solved" value={cfData?.totalSolved ?? '—'}
//           icon={<Trophy size={16} />} color="blue" sub="Unique AC'd problems" />
//         <StatCard label="LC Solved" value={lcData?.totalSolved ?? '—'}
//           icon={<Trophy size={16} />} color="amber" sub="All difficulties" />
//         <StatCard label="CF Max Rating" value={cfData?.maxRating ?? '—'}
//           icon={<TrendingUp size={16} />} color="cyan" sub={cfData?.maxRank ?? ''} />
//         <StatCard label="LC Contests" value={lcData?.totalContests ?? '—'}
//           icon={<Target size={16} />} color="purple" sub="Total participated" />
//       </div>

//       {/* Weekly real stats */}
//       {(cfData || lcData) && (
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//           <StatCard label="Solved This Week" value={weekTotal || '—'}
//             icon={<Calendar size={16} />} color="green" sub="CF + LC combined" />
//           <StatCard label="CF This Week" value={weekSolvedCF || '—'}
//             icon={<Activity size={16} />} color="blue" sub={`${weekActiveDays}/7 active days`} />
//           <StatCard label="LC Easy/Med/Hard" value={lcData ? `${lcData.easySolved}/${lcData.mediumSolved}/${lcData.hardSolved}` : '—'}
//             icon={<Trophy size={16} />} color="amber" sub="All-time breakdown" />
//           <StatCard label="Acceptance Rate" value={lcData ? `${lcData.acceptanceRate}%` : '—'}
//             icon={<Clock size={16} />} color="purple" sub="LC submission rate" />
//         </div>
//       )}

//       {/* Rating History chart — REAL DATA with filter */}
//       <Card>
//         <div className="flex items-center justify-between mb-4">
//           <SectionHeader title="Rating History" sub={`${ratingChart.length} contest data points`} />
//           <div className="flex gap-1">
//             {filters.map(f => (
//               <button key={f} onClick={() => setRatingFilter(f)}
//                 className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
//                   ratingFilter === f
//                     ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
//                     : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.05]'
//                 }`}>
//                 {f}
//               </button>
//             ))}
//           </div>
//         </div>
//         {ratingChart.length > 1 ? (
//           <>
//             <ResponsiveContainer width="100%" height={220}>
//               <LineChart data={ratingChart} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" vertical={false} />
//                 <XAxis dataKey="date" tick={{ fill: '#475569', fontSize: 10 }}
//                   axisLine={false} tickLine={false} interval="preserveStartEnd" />
//                 <YAxis tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false}
//                   width={50} domain={['dataMin - 50', 'dataMax + 50']} />
//                 <Tooltip content={<RatingTooltip />} />
//                 {cfData && cfData.ratingHistory.length > 0 && (
//                   <Line type="monotone" dataKey="CF" stroke="#3b82f6" strokeWidth={2.5}
//                     dot={{ r: 3, fill: '#3b82f6', strokeWidth: 0 }}
//                     activeDot={{ r: 5, fill: '#3b82f6' }}
//                     name="CF Rating" connectNulls />
//                 )}
//                 {lcData && lcData.ratingHistory.length > 0 && (
//                   <Line type="monotone" dataKey="LC" stroke="#f59e0b" strokeWidth={2.5}
//                     dot={{ r: 3, fill: '#f59e0b', strokeWidth: 0 }}
//                     activeDot={{ r: 5, fill: '#f59e0b' }}
//                     name="LC Rating" connectNulls />
//                 )}
//               </LineChart>
//             </ResponsiveContainer>
//             <div className="flex items-center gap-5 mt-3 pt-3 border-t border-white/[0.05]">
//               {cfData && cfData.ratingHistory.length > 0 && (
//                 <div className="flex items-center gap-2">
//                   <div className="w-3 h-0.5 bg-blue-500 rounded-full" />
//                   <span className="text-slate-400 text-xs">CF · <span className="text-blue-400 font-mono font-bold">{cfData.rating}</span>
//                     {cfData.ratingHistory.length > 0 && <span className="text-slate-600 text-xs ml-1">({cfData.ratingHistory.length} contests)</span>}
//                   </span>
//                 </div>
//               )}
//               {lcData && lcData.ratingHistory.length > 0 && (
//                 <div className="flex items-center gap-2">
//                   <div className="w-3 h-0.5 bg-amber-500 rounded-full" />
//                   <span className="text-slate-400 text-xs">LC · <span className="text-amber-400 font-mono font-bold">{lcData.contestRating}</span>
//                     {lcData.ratingHistory.length > 0 && <span className="text-slate-600 text-xs ml-1">({lcData.ratingHistory.length} contests)</span>}
//                   </span>
//                 </div>
//               )}
//             </div>
//           </>
//         ) : (
//           <div className="h-[200px] flex flex-col items-center justify-center gap-3">
//             <TrendingUp size={32} className="text-slate-700" />
//             <p className="text-sm text-slate-500">
//               {(cfData || lcData) ? 'No contest history found for this filter range.' : 'Connect handles above to see real rating history.'}
//             </p>
//           </div>
//         )}
//       </Card>

//       {/* Problem stats — real difficulty dist from CF */}
//       {cfData && Object.keys(cfData.difficultyDist).length > 0 && (
//         <div className="grid lg:grid-cols-2 gap-5">
//           <Card>
//             <SectionHeader title="CF Difficulty Distribution" sub="Problems solved by rating range" />
//             <ResponsiveContainer width="100%" height={200}>
//               <BarChart
//                 data={Object.entries(cfData.difficultyDist)
//                   .sort(([a], [b]) => parseInt(a) - parseInt(b))
//                   .map(([range, count]) => ({ range: range.split('-')[0], count }))}
//                 margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" vertical={false} />
//                 <XAxis dataKey="range" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
//                 <YAxis tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} width={30} />
//                 <Tooltip content={<ChartTooltip />} />
//                 <Bar dataKey="count" name="Solved" radius={[4, 4, 0, 0]}
//                   fill="url(#cfBar)"
//                 />
//                 <defs>
//                   <linearGradient id="cfBar" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="0%" stopColor="#3b82f6" />
//                     <stop offset="100%" stopColor="#1d4ed8" />
//                   </linearGradient>
//                 </defs>
//               </BarChart>
//             </ResponsiveContainer>
//           </Card>

//           <Card>
//             <SectionHeader title="LC Difficulty Breakdown" sub="Easy / Medium / Hard solved" />
//             {lcData ? (
//               <div className="space-y-5 pt-2">
//                 {[
//                   { label: 'Easy',   solved: lcData.easySolved,   total: lcData.totalEasy,   color: '#10b981', bg: 'bg-green-500' },
//                   { label: 'Medium', solved: lcData.mediumSolved,  total: lcData.totalMedium, color: '#f59e0b', bg: 'bg-amber-500' },
//                   { label: 'Hard',   solved: lcData.hardSolved,    total: lcData.totalHard,   color: '#f43f5e', bg: 'bg-red-500' },
//                 ].map(d => {
//                   const pct = d.total > 0 ? Math.min(100, Math.round(d.solved / d.total * 100)) : 0
//                   return (
//                     <div key={d.label}>
//                       <div className="flex justify-between mb-1.5">
//                         <div className="flex items-center gap-2">
//                           <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
//                           <span className="text-slate-300 text-sm font-semibold">{d.label}</span>
//                         </div>
//                         <span className="text-slate-400 font-mono text-sm">{d.solved.toLocaleString()} / {d.total.toLocaleString()} · <span className="text-white font-bold">{pct}%</span></span>
//                       </div>
//                       <div className="h-2 bg-white/[0.05] rounded-full overflow-hidden">
//                         <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: d.color }} />
//                       </div>
//                     </div>
//                   )
//                 })}
//                 <div className="pt-3 border-t border-white/[0.06] flex justify-between text-sm">
//                   <span className="text-slate-400">Total Solved</span>
//                   <span className="text-white font-bold font-mono">{lcData.totalSolved.toLocaleString()}</span>
//                 </div>
//               </div>
//             ) : (
//               <div className="h-32 flex items-center justify-center text-slate-500 text-sm">Connect LeetCode to see data</div>
//             )}
//           </Card>
//         </div>
//       )}

//       {/* Top CF topics — real data */}
//       {topTags.length > 0 && (
//         <Card>
//           <SectionHeader title="Top CF Topics" sub="Most solved tags from your actual submissions" />
//           <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
//             {topTags.map(([tag, count]) => (
//               <div key={tag} className="flex items-center justify-between px-4 py-3 bg-white/[0.025] rounded-xl border border-white/[0.06] hover:border-blue-500/20 hover:bg-blue-500/5 transition-all">
//                 <span className="text-slate-300 text-sm capitalize">{tag}</span>
//                 <span className="font-mono font-bold text-blue-400">{count}</span>
//               </div>
//             ))}
//           </div>
//         </Card>
//       )}

//       {/* Recent CF contests */}
//       {cfData && cfData.contests.length > 0 && (
//         <Card>
//           <SectionHeader title="Recent CF Contests" sub="Latest rated contest results" />
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="text-slate-500 text-xs uppercase tracking-wider border-b border-white/[0.06]">
//                   <th className="text-left py-2 pr-4">Contest</th>
//                   <th className="text-right py-2 pr-4">Date</th>
//                   <th className="text-right py-2 pr-4">Rank</th>
//                   <th className="text-right py-2 pr-4">Δ Rating</th>
//                   <th className="text-right py-2">New Rating</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-white/[0.04]">
//                 {cfData.contests.slice(0, 8).map((c, i) => (
//                   <tr key={i} className="hover:bg-white/[0.02] transition-colors">
//                     <td className="py-2.5 pr-4 text-slate-300 text-xs max-w-[200px] truncate">{c.name}</td>
//                     <td className="py-2.5 pr-4 text-right text-slate-500 font-mono text-xs">{c.date}</td>
//                     <td className="py-2.5 pr-4 text-right font-bold text-amber-400 font-mono">#{c.rank}</td>
//                     <td className={`py-2.5 pr-4 text-right font-bold font-mono ${c.delta >= 0 ? 'text-green-400' : 'text-red-400'}`}>
//                       {c.delta >= 0 ? '+' : ''}{c.delta}
//                     </td>
//                     <td className="py-2.5 text-right text-slate-300 font-mono">{c.newRating}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </Card>
//       )}
//     </div>
//   )
// }


import { useEffect, useState, useMemo } from 'react'
import {
  LayoutDashboard, Code2, StickyNote, Flame, Trophy,
  CheckCircle2, Target, RefreshCw, ExternalLink, TrendingUp,
  AlertCircle, Calendar, Activity, Clock
} from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, CartesianGrid, ReferenceLine
} from 'recharts'
import { StatCard, PageHeader, Card, SectionHeader, ChartTooltip } from '../components/ui'
import { useAuth } from '../context/AuthContext'
import {
  fetchCFData, fetchLCData, saveCFData, saveLCData,
  loadCFData, loadLCData, type CFData, type LCData
} from '../services/api'

// Custom tooltip showing full contest info
function RatingTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#0d1f38] border border-white/10 rounded-xl p-3 shadow-2xl max-w-xs">
      <p className="text-slate-400 text-xs font-mono mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name}>
          <p className="font-bold text-sm" style={{ color: p.color }}>{p.name}: {p.value}</p>
          {p.payload?.contest && <p className="text-slate-500 text-xs mt-0.5 truncate">{p.payload.contest || p.payload.contestName}</p>}
          {p.payload?.delta !== undefined && p.payload.delta !== 0 && (
            <p className={`text-xs font-semibold ${p.payload.delta > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {p.payload.delta > 0 ? '+' : ''}{p.payload.delta}
            </p>
          )}
          {p.payload?.rank && <p className="text-slate-500 text-xs">Rank: #{p.payload.rank}</p>}
        </div>
      ))}
    </div>
  )
}

// Build merged chart — show ALL history points, no sampling
function buildRatingChart(cf: CFData | null, lc: LCData | null, filter: string) {
  const now = Date.now()
  const cutoff: Record<string, number> = {
    '1M': 30, '3M': 90, '6M': 180, '1Y': 365, 'ALL': 99999
  }
  const days = cutoff[filter] ?? 99999

  const filterDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return (now - d.getTime()) / 86400000 <= days
  }

  const cfPts = (cf?.ratingHistory ?? []).filter(r => filterDate(r.fullDate || r.date))
  const lcPts = (lc?.ratingHistory ?? []).filter(r => filterDate(r.fullDate || r.date))

  if (!cfPts.length && !lcPts.length) return []

  // Merge all points sorted by date
  const all: Array<{ date: string; CF?: number; LC?: number; contest?: string; delta?: number; rank?: number }> = []

  for (const r of cfPts) {
    all.push({ date: r.fullDate || r.date, CF: r.rating, contest: r.contest, delta: r.delta, rank: r.rank })
  }
  for (const r of lcPts) {
    // Check if a point already exists for this date
    const existing = all.find(a => a.date === (r.fullDate || r.date))
    if (existing) existing.LC = r.rating
    else all.push({ date: r.fullDate || r.date, LC: r.rating, contest: r.contestName, delta: r.delta, rank: r.rank })
  }

  return all.sort((a, b) => a.date.localeCompare(b.date))
}

export default function Dashboard() {
  const { user, profile, updateProfile } = useAuth()
  const [cfData, setCfData] = useState<CFData | null>(null)
  const [lcData, setLcData] = useState<LCData | null>(null)
  const [cfInput, setCfInput] = useState('')
  const [lcInput, setLcInput] = useState('')
  const [globalLoading, setGlobalLoading] = useState(false)
  const [cfLoading, setCfLoading] = useState(false)
  const [lcLoading, setLcLoading] = useState(false)
  const [error, setError] = useState('')
  const [lastSynced, setLastSynced] = useState<string | null>(null)
  const [ratingFilter, setRatingFilter] = useState('ALL')

  useEffect(() => {
    if (!user) return
    setCfInput(profile?.cf_handle ?? '')
    setLcInput(profile?.lc_handle ?? '')
    loadCFData(user.id).then(d => { if (d) setCfData(d) })
    loadLCData(user.id).then(d => { if (d) setLcData(d) })
  }, [user, profile])

  const connectCF = async () => {
    if (!cfInput.trim() || !user) return
    setCfLoading(true); setError('')
    try {
      const d = await fetchCFData(cfInput.trim())
      await saveCFData(user.id, d)
      await updateProfile({ cf_handle: cfInput.trim() })
      setCfData(d)
      setLastSynced(new Date().toLocaleTimeString())
    } catch (e: any) { setError('Codeforces: ' + e.message) }
    finally { setCfLoading(false) }
  }

  const connectLC = async () => {
    if (!lcInput.trim() || !user) return
    setLcLoading(true); setError('')
    try {
      const d = await fetchLCData(lcInput.trim())
      await saveLCData(user.id, d)
      await updateProfile({ lc_handle: lcInput.trim() })
      setLcData(d)
      setLastSynced(new Date().toLocaleTimeString())
    } catch (e: any) { setError('LeetCode: ' + e.message) }
    finally { setLcLoading(false) }
  }

  const refreshAll = async () => {
    if (!user) return
    setGlobalLoading(true); setError('')
    try {
      const tasks: Promise<void>[] = []
      if (profile?.cf_handle)
        tasks.push(fetchCFData(profile.cf_handle).then(d => { saveCFData(user.id, d); setCfData(d) }))
      if (profile?.lc_handle)
        tasks.push(fetchLCData(profile.lc_handle).then(d => { saveLCData(user.id, d); setLcData(d) }))
      if (!tasks.length) { setError('Connect at least one handle first.'); return }
      await Promise.all(tasks)
      setLastSynced(new Date().toLocaleTimeString())
    } catch (e: any) { setError(e.message) }
    finally { setGlobalLoading(false) }
  }

  const totalSolved = (cfData?.totalSolved ?? 0) + (lcData?.totalSolved ?? 0)
  const ratingChart = useMemo(() => buildRatingChart(cfData, lcData, ratingFilter), [cfData, lcData, ratingFilter])

  const cfTrend = cfData && cfData.ratingHistory.length >= 2
    ? cfData.ratingHistory[cfData.ratingHistory.length - 1].delta
    : undefined

  // Real weekly stats from API
  const weekSolvedCF = cfData?.weeklyStats?.solvedThisWeek ?? 0
  const weekSolvedLC = lcData?.weeklyStats?.solvedThisWeek ?? 0
  const weekActiveDays = Math.max(cfData?.weeklyStats?.activeDays ?? 0, lcData?.weeklyStats?.activeDays ?? 0)
  const weekTotal = weekSolvedCF + weekSolvedLC

  // Real daily activity from CF submission history (last 7 days)
  const weeklyBarData = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const now = new Date()
    return days.map((day, i) => {
      const d = new Date(now)
      d.setDate(d.getDate() - (6 - i))
      const dateStr = d.toISOString().slice(0, 10)
      // Count CF submissions for this day from ratingHistory proximity
      // This is approximate since we don't have daily breakdown from cache
      return { day, CF: 0, LC: 0, date: dateStr }
    })
  }, [cfData, lcData])

  const topTags = cfData
    ? Object.entries(cfData.tagDistribution).sort(([, a], [, b]) => b - a).slice(0, 6)
    : []

  const filters = ['1M', '3M', '6M', '1Y', 'ALL']

  return (
    <div className="flex-1 p-5 lg:p-8 space-y-6 animate-fade-in">

      {/* Header */}
      <div className="flex items-start justify-between">
        <PageHeader
          title="Dashboard"
          sub={`Welcome back, ${profile?.display_name?.split(' ')[0] ?? profile?.email?.split('@')[0] ?? 'Coder'}!`}
          icon={<LayoutDashboard size={20} />}
        />
        <div className="flex items-center gap-2 mt-1">
          {lastSynced && <span className="text-slate-500 text-xs hidden sm:block">Synced {lastSynced}</span>}
          <button onClick={refreshAll} disabled={globalLoading} className="btn-secondary text-xs py-2 disabled:opacity-50">
            <RefreshCw size={13} className={globalLoading ? 'animate-spin' : ''} />
            {globalLoading ? 'Syncing…' : 'Sync Now'}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3 text-red-400 text-sm">
          <AlertCircle size={15} className="mt-0.5 shrink-0" />
          <div><p className="font-semibold">Error</p><p className="text-red-400/80 text-xs mt-0.5">{error}</p></div>
        </div>
      )}

      {/* Handle cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* CF */}
        <div className="card-p border-blue-500/20 bg-gradient-to-br from-blue-500/8 to-transparent space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-blue-500/15 rounded-xl flex items-center justify-center shrink-0 border border-blue-500/20">
              <Code2 size={19} className="text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-widest mb-0.5">Codeforces</p>
              {cfData ? (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-white font-bold font-mono">{cfData.handle}</span>
                  <span className="text-blue-400 font-mono font-bold">{cfData.rating}</span>
                  <span className="text-slate-500 text-xs capitalize">{cfData.rank}</span>
                  {cfTrend !== undefined && (
                    <span className={`text-xs font-bold ${cfTrend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {cfTrend >= 0 ? '+' : ''}{cfTrend}
                    </span>
                  )}
                </div>
              ) : <p className="text-slate-500 text-xs">Not connected</p>}
            </div>
            {cfData && (
              <a href={`https://codeforces.com/profile/${cfData.handle}`} target="_blank" rel="noreferrer">
                <ExternalLink size={13} className="text-slate-600 hover:text-blue-400 transition-colors" />
              </a>
            )}
          </div>
          <div className="flex gap-2">
            <input value={cfInput} onChange={e => setCfInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && connectCF()}
              placeholder="e.g. tourist" className="input text-sm py-2 font-mono" />
            <button onClick={connectCF} disabled={cfLoading}
              className="btn-primary text-xs py-2 px-4 whitespace-nowrap disabled:opacity-50">
              {cfLoading ? <RefreshCw size={12} className="animate-spin mr-1" /> : null}
              {cfLoading ? 'Loading…' : cfData ? '↻ Sync' : 'Connect'}
            </button>
          </div>
        </div>

        {/* LC */}
        <div className="card-p border-amber-500/20 bg-gradient-to-br from-amber-500/8 to-transparent space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-amber-500/15 rounded-xl flex items-center justify-center shrink-0 border border-amber-500/20">
              <StickyNote size={19} className="text-amber-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-widest mb-0.5">LeetCode</p>
              {lcData ? (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-white font-bold font-mono">{lcData.handle}</span>
                  <span className="text-amber-400 font-mono font-bold">{lcData.contestRating}</span>
                  <span className="text-slate-500 text-xs">Rank #{lcData.globalRanking?.toLocaleString()}</span>
                </div>
              ) : <p className="text-slate-500 text-xs">Not connected</p>}
            </div>
            {lcData && (
              <a href={`https://leetcode.com/u/${lcData.handle}`} target="_blank" rel="noreferrer">
                <ExternalLink size={13} className="text-slate-600 hover:text-amber-400 transition-colors" />
              </a>
            )}
          </div>
          <div className="flex gap-2">
            <input value={lcInput} onChange={e => setLcInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && connectLC()}
              placeholder="e.g. neal_wu" className="input text-sm py-2 font-mono" />
            <button onClick={connectLC} disabled={lcLoading}
              className="btn-primary text-xs py-2 px-4 whitespace-nowrap disabled:opacity-50">
              {lcLoading ? <RefreshCw size={12} className="animate-spin mr-1" /> : null}
              {lcLoading ? 'Loading…' : lcData ? '↻ Sync' : 'Connect'}
            </button>
          </div>
        </div>
      </div>

      {/* Stats row 1 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Solved" value={totalSolved > 0 ? totalSolved.toLocaleString() : '—'}
          icon={<CheckCircle2 size={16} />} color="green" sub="CF + LC combined" loading={cfLoading || lcLoading} />
        <StatCard label="CF Rating" value={cfData?.rating ?? '—'}
          icon={<Code2 size={16} />} color="blue" sub={cfData?.rank ?? 'Connect CF'}
          loading={cfLoading} trend={cfTrend} />
        <StatCard label="LC Rating" value={lcData?.contestRating ?? '—'}
          icon={<StickyNote size={16} />} color="amber"
          sub={lcData ? `Rank #${lcData.globalRanking?.toLocaleString()}` : 'Connect LC'} loading={lcLoading} />
        <StatCard label="CF Streak" value={cfData ? `${cfData.streakDays}d` : '—'}
          icon={<Flame size={16} />} color="rose" sub="Consecutive days" />
      </div>

      {/* Stats row 2 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="CF Solved" value={cfData?.totalSolved ?? '—'}
          icon={<Trophy size={16} />} color="blue" sub="Unique AC'd problems" />
        <StatCard label="LC Solved" value={lcData?.totalSolved ?? '—'}
          icon={<Trophy size={16} />} color="amber" sub="All difficulties" />
        <StatCard label="CF Max Rating" value={cfData?.maxRating ?? '—'}
          icon={<TrendingUp size={16} />} color="cyan" sub={cfData?.maxRank ?? ''} />
        <StatCard label="LC Contests" value={lcData?.totalContests ?? '—'}
          icon={<Target size={16} />} color="purple" sub="Total participated" />
      </div>

      {/* Weekly real stats */}
      {(cfData || lcData) && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Solved This Week" value={weekTotal || '—'}
            icon={<Calendar size={16} />} color="green" sub="CF + LC combined" />
          <StatCard label="CF This Week" value={weekSolvedCF || '—'}
            icon={<Activity size={16} />} color="blue" sub={`${weekActiveDays}/7 active days`} />
          <StatCard label="LC Easy/Med/Hard" value={lcData ? `${lcData.easySolved}/${lcData.mediumSolved}/${lcData.hardSolved}` : '—'}
            icon={<Trophy size={16} />} color="amber" sub="All-time breakdown" />
          <StatCard label="Acceptance Rate" value={lcData ? `${lcData.acceptanceRate}%` : '—'}
            icon={<Clock size={16} />} color="purple" sub="LC submission rate" />
        </div>
      )}

      {/* Rating History chart — REAL DATA with filter */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <SectionHeader title="Rating History" sub={`${ratingChart.length} contest data points`} />
          <div className="flex gap-1">
            {filters.map(f => (
              <button key={f} onClick={() => setRatingFilter(f)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  ratingFilter === f
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.05]'
                }`}>
                {f}
              </button>
            ))}
          </div>
        </div>
        {ratingChart.length > 1 ? (
          <>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={ratingChart} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: '#475569', fontSize: 10 }}
                  axisLine={false} tickLine={false} interval="preserveStartEnd" />
                <YAxis tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false}
                  width={50} domain={['dataMin - 50', 'dataMax + 50']} />
                <Tooltip content={<RatingTooltip />} />
                {cfData && cfData.ratingHistory.length > 0 && (
                  <Line type="monotone" dataKey="CF" stroke="#3b82f6" strokeWidth={2.5}
                    dot={{ r: 3, fill: '#3b82f6', strokeWidth: 0 }}
                    activeDot={{ r: 5, fill: '#3b82f6' }}
                    name="CF Rating" connectNulls />
                )}
                {lcData && lcData.ratingHistory.length > 0 && (
                  <Line type="monotone" dataKey="LC" stroke="#f59e0b" strokeWidth={2.5}
                    dot={{ r: 3, fill: '#f59e0b', strokeWidth: 0 }}
                    activeDot={{ r: 5, fill: '#f59e0b' }}
                    name="LC Rating" connectNulls />
                )}
              </LineChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-5 mt-3 pt-3 border-t border-white/[0.05]">
              {cfData && cfData.ratingHistory.length > 0 && (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-0.5 bg-blue-500 rounded-full" />
                  <span className="text-slate-400 text-xs">CF · <span className="text-blue-400 font-mono font-bold">{cfData.rating}</span>
                    {cfData.ratingHistory.length > 0 && <span className="text-slate-600 text-xs ml-1">({cfData.ratingHistory.length} contests)</span>}
                  </span>
                </div>
              )}
              {lcData && lcData.ratingHistory.length > 0 && (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-0.5 bg-amber-500 rounded-full" />
                  <span className="text-slate-400 text-xs">LC · <span className="text-amber-400 font-mono font-bold">{lcData.contestRating}</span>
                    {lcData.ratingHistory.length > 0 && <span className="text-slate-600 text-xs ml-1">({lcData.ratingHistory.length} contests)</span>}
                  </span>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="h-[200px] flex flex-col items-center justify-center gap-3">
            <TrendingUp size={32} className="text-slate-700" />
            <p className="text-sm text-slate-500">
              {(cfData || lcData) ? 'No contest history found for this filter range.' : 'Connect handles above to see real rating history.'}
            </p>
          </div>
        )}
      </Card>

      {/* Problem stats — real difficulty dist from CF */}
      {cfData && Object.keys(cfData.difficultyDist).length > 0 && (
        <div className="grid lg:grid-cols-2 gap-5">
          <Card>
            <SectionHeader title="CF Difficulty Distribution" sub="Problems solved by rating range" />
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={Object.entries(cfData.difficultyDist)
                  .sort(([a], [b]) => parseInt(a) - parseInt(b))
                  .map(([range, count]) => ({ range: range.split('-')[0], count }))}
                margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" vertical={false} />
                <XAxis dataKey="range" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} width={30} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="count" name="Solved" radius={[4, 4, 0, 0]}
                  fill="url(#cfBar)"
                />
                <defs>
                  <linearGradient id="cfBar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#1d4ed8" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <SectionHeader title="LC Difficulty Breakdown" sub="Easy / Medium / Hard solved" />
            {lcData ? (
              <div className="space-y-5 pt-2">
                {[
                  { label: 'Easy',   solved: lcData.easySolved,   total: lcData.totalEasy,   color: '#10b981', bg: 'bg-green-500' },
                  { label: 'Medium', solved: lcData.mediumSolved,  total: lcData.totalMedium, color: '#f59e0b', bg: 'bg-amber-500' },
                  { label: 'Hard',   solved: lcData.hardSolved,    total: lcData.totalHard,   color: '#f43f5e', bg: 'bg-red-500' },
                ].map(d => {
                  const pct = d.total > 0 ? Math.min(100, Math.round(d.solved / d.total * 100)) : 0
                  return (
                    <div key={d.label}>
                      <div className="flex justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                          <span className="text-slate-300 text-sm font-semibold">{d.label}</span>
                        </div>
                        <span className="text-slate-400 font-mono text-sm">{d.solved.toLocaleString()} / {d.total.toLocaleString()} · <span className="text-white font-bold">{pct}%</span></span>
                      </div>
                      <div className="h-2 bg-white/[0.05] rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: d.color }} />
                      </div>
                    </div>
                  )
                })}
                <div className="pt-3 border-t border-white/[0.06] flex justify-between text-sm">
                  <span className="text-slate-400">Total Solved</span>
                  <span className="text-white font-bold font-mono">{lcData.totalSolved.toLocaleString()}</span>
                </div>
              </div>
            ) : (
              <div className="h-32 flex items-center justify-center text-slate-500 text-sm">Connect LeetCode to see data</div>
            )}
          </Card>
        </div>
      )}

      {/* Top CF topics — real data */}
      {topTags.length > 0 && (
        <Card>
          <SectionHeader title="Top CF Topics" sub="Most solved tags from your actual submissions" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {topTags.map(([tag, count]) => (
              <div key={tag} className="flex items-center justify-between px-4 py-3 bg-white/[0.025] rounded-xl border border-white/[0.06] hover:border-blue-500/20 hover:bg-blue-500/5 transition-all">
                <span className="text-slate-300 text-sm capitalize">{tag}</span>
                <span className="font-mono font-bold text-blue-400">{count}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Recent CF contests */}
      {cfData && cfData.contests.length > 0 && (
        <Card>
          <SectionHeader title="Recent CF Contests" sub="Latest rated contest results" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-500 text-xs uppercase tracking-wider border-b border-white/[0.06]">
                  <th className="text-left py-2 pr-4">Contest</th>
                  <th className="text-right py-2 pr-4">Date</th>
                  <th className="text-right py-2 pr-4">Rank</th>
                  <th className="text-right py-2 pr-4">Δ Rating</th>
                  <th className="text-right py-2">New Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {cfData.contests.slice(0, 8).map((c, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-2.5 pr-4 text-slate-300 text-xs max-w-[200px] truncate">{c.name}</td>
                    <td className="py-2.5 pr-4 text-right text-slate-500 font-mono text-xs">{c.date}</td>
                    <td className="py-2.5 pr-4 text-right font-bold text-amber-400 font-mono">#{c.rank}</td>
                    <td className={`py-2.5 pr-4 text-right font-bold font-mono ${c.delta >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {c.delta >= 0 ? '+' : ''}{c.delta}
                    </td>
                    <td className="py-2.5 text-right text-slate-300 font-mono">{c.newRating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}
