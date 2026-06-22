// import { useEffect, useState } from 'react'
// import { StickyNote, CheckCircle2, Trophy, Flame, TrendingUp, RefreshCw, AlertCircle } from 'lucide-react'
// import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Sector } from 'recharts'
// import { StatCard, PageHeader, Card, SectionHeader, ChartTooltip } from '../components/ui'
// import { useAuth } from '../context/AuthContext'
// import { loadLCData, fetchLCData, saveLCData, type LCData } from '../services/api'

// const TAG_COLORS = ['#3b82f6','#06b6d4','#f59e0b','#10b981','#a855f7','#f43f5e','#fb923c','#34d399']
// const PIE_COLORS = { Easy:'#10b981', Medium:'#f59e0b', Hard:'#f43f5e' }

// function ActiveShape(props: any) {
//   const { cx,cy,innerRadius,outerRadius,startAngle,endAngle,fill,payload,value } = props
//   return (
//     <g>
//       <text x={cx} y={cy-8} textAnchor="middle" fill="white" style={{fontSize:24,fontWeight:700,fontFamily:'JetBrains Mono'}}>{value}</text>
//       <text x={cx} y={cy+14} textAnchor="middle" fill="#6b7280" style={{fontSize:13}}>{payload.name}</text>
//       <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius+6} startAngle={startAngle} endAngle={endAngle} fill={fill}/>
//       <Sector cx={cx} cy={cy} innerRadius={innerRadius-4} outerRadius={innerRadius-1} startAngle={startAngle} endAngle={endAngle} fill={fill}/>
//     </g>
//   )
// }

// export default function LeetCodePage() {
//   const { user, profile } = useAuth()
//   const [data, setData] = useState<LCData | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState('')
//   const [activeIdx, setActiveIdx] = useState(0)

//   useEffect(() => {
//     if (!user) return
//     loadLCData(user.id).then(d => { setData(d); setLoading(false) })
//   }, [user])

//   const refresh = async () => {
//     if (!profile?.lc_handle || !user) return
//     setLoading(true); setError('')
//     try {
//       const d = await fetchLCData(profile.lc_handle)
//       await saveLCData(user.id, d)
//       setData(d)
//     } catch (e: any) { setError(e.message) }
//     finally { setLoading(false) }
//   }

//   if (loading) return (
//     <div className="flex-1 p-5 lg:p-8 space-y-6">
//       {[...Array(3)].map((_,i) => <div key={i} className="skeleton h-32 rounded-2xl"/>)}
//     </div>
//   )

//   if (!data) return (
//     <div className="flex-1 p-5 lg:p-8 flex flex-col items-center justify-center gap-4 text-center">
//       <StickyNote size={48} className="text-n-400"/>
//       <h2 className="text-xl font-bold text-n-900">No LeetCode data yet</h2>
//       <p className="text-n-500 text-sm max-w-xs">Go to Dashboard and connect your LeetCode handle first.</p>
//     </div>
//   )

//   const pie = [
//     { name:'Easy',   value:data.easySolved,   color:PIE_COLORS.Easy,   total:data.totalEasy   },
//     { name:'Medium', value:data.mediumSolved,  color:PIE_COLORS.Medium, total:data.totalMedium },
//     { name:'Hard',   value:data.hardSolved,    color:PIE_COLORS.Hard,   total:data.totalHard   },
//   ]

//   const tags = Object.entries(data.tagDistribution).sort(([,a],[,b])=>b-a).slice(0,8).map(([topic,solved],i)=>({
//     topic, solved, total: Math.ceil(solved * 1.4), color: TAG_COLORS[i]
//   }))

//   return (
//     <div className="flex-1 p-5 lg:p-8 space-y-6 animate-fade-in">
//       <div className="flex items-start justify-between">
//         <PageHeader title="LeetCode" sub="Real-time data from LeetCode GraphQL" icon={<StickyNote size={20}/>} badge="Live"/>
//         <button onClick={refresh} disabled={loading} className="btn-secondary text-xs py-2 mt-1">
//           <RefreshCw size={13} className={loading?'animate-spin':''}/> Refresh
//         </button>
//       </div>

//       {error && <div className="flex items-center gap-2 bg-rose/10 border border-rose/20 rounded-xl px-4 py-3 text-rose text-sm"><AlertCircle size={14}/>{error}</div>}

//       {/* Profile */}
//       <div className="card-p flex flex-col sm:flex-row items-start sm:items-center gap-5 border-amber/20 bg-amber/5">
//         <div className="w-[72px] h-[72px] rounded-2xl bg-amber/15 border-2 border-amber/30 flex items-center justify-center overflow-hidden shrink-0">
//           {data.avatar ? <img src={data.avatar} alt={data.handle} className="w-full h-full object-cover"/> : <StickyNote size={30} className="text-amber-light"/>}
//         </div>
//         <div className="flex-1">
//           <div className="flex flex-wrap items-center gap-3 mb-1">
//             <h2 className="text-2xl font-black text-amber-light font-mono">{data.handle}</h2>
//             {data.globalRanking > 0 && <span className="badge-amber">Rank #{data.globalRanking.toLocaleString()}</span>}
//           </div>
//           {data.username && data.username !== data.handle && <p className="text-n-500 text-sm mb-2">{data.username}</p>}
//           <div className="flex flex-wrap gap-5 text-sm">
//             {[{l:'Contest Rating',v:data.contestRating,c:'text-amber-light'},{l:'Acceptance',v:`${data.acceptanceRate}%`,c:'text-green-light'},{l:'Contests',v:data.totalContests,c:'text-n-900'}].map(x=>(
//               <div key={x.l}><span className="text-n-500 text-xs block">{x.l}</span><span className={`font-bold font-mono ${x.c}`}>{x.v}</span></div>
//             ))}
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//         <StatCard label="Total Solved"   value={data.totalSolved.toLocaleString()} icon={<CheckCircle2 size={16}/>} color="amber"  sub="All time"/>
//         <StatCard label="Contest Rating" value={data.contestRating} icon={<TrendingUp size={16}/>} color="cyan"   sub={`Max: ${data.maxRating}`}/>
//         <StatCard label="Acceptance"     value={`${data.acceptanceRate}%`} icon={<Trophy size={16}/>} color="green" sub="Rate"/>
//         <StatCard label="Hard Solved"    value={data.hardSolved} icon={<Flame size={16}/>} color="rose" sub={`${data.mediumSolved} Medium`}/>
//       </div>

//       <div className="grid lg:grid-cols-3 gap-5">
//         <Card>
//           <SectionHeader title="Difficulty Split"/>
//           <ResponsiveContainer width="100%" height={190}>
//             <PieChart>
//               <Pie data={pie} cx="50%" cy="50%" innerRadius={58} outerRadius={78} dataKey="value"
//                 {...{activeIndex:activeIdx} as any} activeShape={ActiveShape as any}
//                 onMouseEnter={(_:any,i:number)=>setActiveIdx(i)}>
//                 {pie.map(d=><Cell key={d.name} fill={d.color}/>)}
//               </Pie>
//             </PieChart>
//           </ResponsiveContainer>
//           <div className="flex justify-center gap-4 mt-2">
//             {pie.map(d=><div key={d.name} className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor:d.color}}/><span className="text-n-500 text-xs">{d.name}: {d.value}</span></div>)}
//           </div>
//         </Card>

//         <div className="lg:col-span-2">
//           <Card>
//             <SectionHeader title="Contest Rating History"/>
//             <ResponsiveContainer width="100%" height={190}>
//               <AreaChart data={data.ratingHistory}>
//                 <defs><linearGradient id="lcRG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f59e0b" stopOpacity={0.35}/><stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/></linearGradient></defs>
//                 <XAxis dataKey="date" tick={{fill:'#4b5563',fontSize:10}} axisLine={false} tickLine={false}/>
//                 <YAxis tick={{fill:'#4b5563',fontSize:11}} axisLine={false} tickLine={false} width={42} domain={['dataMin-100','dataMax+100']}/>
//                 <Tooltip content={<ChartTooltip/>}/>
//                 <Area type="monotone" dataKey="rating" stroke="#f59e0b" strokeWidth={2.5} fill="url(#lcRG)" dot={false} name="Rating"/>
//               </AreaChart>
//             </ResponsiveContainer>
//           </Card>
//         </div>
//       </div>

//       <div className="grid lg:grid-cols-2 gap-5">
//         <Card>
//           <SectionHeader title="Difficulty Progress"/>
//           <div className="space-y-5">
//             {pie.map(d => {
//               const pct = d.total > 0 ? Math.min(100, Math.round((d.value/d.total)*100)) : 0
//               return (
//                 <div key={d.name}>
//                   <div className="flex justify-between mb-2">
//                     <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{backgroundColor:d.color}}/><span className="text-n-800 font-semibold text-sm">{d.name}</span></div>
//                     <span className="text-n-500 font-mono text-sm">{d.value} / {d.total}</span>
//                   </div>
//                   <div className="h-2 bg-bg-muted rounded-full overflow-hidden"><div className="h-full rounded-full" style={{width:`${pct}%`,backgroundColor:d.color}}/></div>
//                 </div>
//               )
//             })}
//           </div>
//         </Card>

//         <Card>
//           <SectionHeader title="Topic Coverage" sub={`${tags.length} topics`}/>
//           <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
//             {tags.map(t => {
//               const pct = t.total > 0 ? Math.round((t.solved/t.total)*100) : 0
//               return (
//                 <div key={t.topic}>
//                   <div className="flex justify-between mb-1"><span className="text-n-700 text-sm">{t.topic}</span><span className="text-n-500 text-xs font-mono">{t.solved} · {pct}%</span></div>
//                   <div className="progress-bar"><div className="progress-fill" style={{width:`${pct}%`,backgroundColor:t.color}}/></div>
//                 </div>
//               )
//             })}
//           </div>
//         </Card>
//       </div>

//       {data.contests.length > 0 && (
//         <Card>
//           <SectionHeader title="Recent Contests"/>
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead><tr className="text-n-500 text-xs uppercase tracking-wider border-b border-bg-border">
//                 {['Contest','Date','Rank','Δ Rating'].map(h=><th key={h} className={`py-3 pr-4 font-semibold ${h!=='Contest'?'text-right':''}`}>{h}</th>)}
//               </tr></thead>
//               <tbody className="divide-y divide-bg-border">
//                 {data.contests.map((c,i) => (
//                   <tr key={i} className="hover:bg-bg-hover transition-colors">
//                     <td className="py-3 pr-4 text-n-800 font-medium text-xs">{c.name}</td>
//                     <td className="py-3 pr-4 text-right text-n-500 font-mono text-xs">{c.date}</td>
//                     <td className="py-3 pr-4 text-right font-bold text-amber font-mono">#{c.rank}</td>
//                     <td className="py-3 text-right font-bold font-mono" style={{color:c.delta>0?'#34d399':c.delta<0?'#fb7185':'#6b7280'}}>{c.delta>0?'+':''}{c.delta}</td>
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


import { useState, useEffect } from 'react'
import { StickyNote, CheckCircle2, Trophy, Flame, TrendingUp, RefreshCw, AlertCircle, ExternalLink } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Sector, BarChart, Bar, CartesianGrid } from 'recharts'
import { StatCard, PageHeader, Card, SectionHeader, ChartTooltip } from '../components/ui'
import { useAuth } from '../context/AuthContext'
import { loadLCData, fetchLCData, saveLCData, type LCData } from '../services/api'

const TAG_COLORS = ['#3b82f6','#06b6d4','#10b981','#f59e0b','#a855f7','#f43f5e','#fb923c','#34d399','#60a5fa','#f472b6','#4ade80','#facc15']

function ActiveShape(props: any) {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props
  return (
    <g>
      <text x={cx} y={cy - 10} textAnchor="middle" fill="white" style={{ fontSize: 28, fontWeight: 800, fontFamily: 'JetBrains Mono' }}>{value.toLocaleString()}</text>
      <text x={cx} y={cy + 14} textAnchor="middle" fill="#94a3b8" style={{ fontSize: 13 }}>{payload.name}</text>
      <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius + 8} startAngle={startAngle} endAngle={endAngle} fill={fill} />
      <Sector cx={cx} cy={cy} innerRadius={innerRadius - 5} outerRadius={innerRadius - 2} startAngle={startAngle} endAngle={endAngle} fill={fill} />
    </g>
  )
}

// Rich tooltip showing real contest details
function RatingTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload
  return (
    <div className="bg-[#0d1f38] border border-white/10 rounded-xl p-3 shadow-2xl max-w-xs">
      <p className="text-xs font-mono mb-1" style={{color:"var(--text-muted)"}}>{label}</p>
      <p className="font-bold text-amber-400 text-sm font-mono">{d?.rating}</p>
      {d?.contestName && <p className="text-xs truncate mt-0.5" style={{color:"var(--text-muted)"}}>{d.contestName}</p>}
      {d?.delta !== undefined && d.delta !== 0 && (
        <p className={`text-xs font-bold mt-0.5 ${d.delta > 0 ? 'text-green-400' : 'text-red-400'}`}>
          {d.delta > 0 ? '+' : ''}{d.delta}
        </p>
      )}
      {d?.rank && <p className="text-xs" style={{color:"var(--text-muted)"}}>Rank: #{d.rank.toLocaleString()}</p>}
    </div>
  )
}

export default function LeetCodePage() {
  const { user, profile } = useAuth()
  const [data, setData] = useState<LCData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeIdx, setActiveIdx] = useState(0)
  const [ratingFilter, setRatingFilter] = useState('ALL')

  useEffect(() => {
    if (!user) return
    loadLCData(user.id).then(d => { setData(d); setLoading(false) })
  }, [user])

  const refresh = async () => {
    if (!profile?.lc_handle || !user) return
    setLoading(true); setError('')
    try {
      const d = await fetchLCData(profile.lc_handle)
      await saveLCData(user.id, d)
      setData(d)
    } catch (e: any) { setError(e.message) }
    finally { setLoading(false) }
  }

  if (loading) return (
    <div className="flex-1 p-5 lg:p-8 space-y-6">
      {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-32 rounded-2xl" />)}
    </div>
  )

  if (!data) return (
    <div className="flex-1 p-5 lg:p-8 flex flex-col items-center justify-center gap-4 text-center">
      <StickyNote size={48} className="text-slate-700" />
      <h2 className="text-xl font-bold" style={{color:"var(--text-primary)"}}>No LeetCode data yet</h2>
      <p className="text-sm max-w-xs" style={{color:"var(--text-muted)"}}>Go to Dashboard and connect your LeetCode username first.</p>
    </div>
  )

  const pieData = [
    { name: 'Easy',   value: data.easySolved,  color: '#10b981', total: data.totalEasy   },
    { name: 'Medium', value: data.mediumSolved, color: '#f59e0b', total: data.totalMedium },
    { name: 'Hard',   value: data.hardSolved,   color: '#f43f5e', total: data.totalHard   },
  ]

  // Tag bars — relative to MAX solved (not fake total = real comparison)
  const allTags = Object.entries(data.tagDistribution).sort(([, a], [, b]) => b - a)
  const topTags = allTags.slice(0, 12)
  const maxTagCount = topTags[0]?.[1] ?? 1

  // Filter rating history
  const now = Date.now()
  const cutoff: Record<string, number> = { '1M': 30, '3M': 90, '6M': 180, '1Y': 365, 'ALL': 99999 }
  const filteredRating = data.ratingHistory.filter(h => {
    const days = (now - new Date(h.fullDate || h.date).getTime()) / 86400000
    return days <= (cutoff[ratingFilter] ?? 99999)
  })

  const filters = ['1M', '3M', '6M', '1Y', 'ALL']

  return (
    <div className="flex-1 p-5 lg:p-8 space-y-6 animate-fade-in">
      <div className="flex items-start justify-between">
        <PageHeader title="LeetCode" sub="Real data from LeetCode GraphQL API" icon={<StickyNote size={20} />} badge="Live" />
        <button onClick={refresh} disabled={loading} className="btn-secondary text-xs py-2 mt-1 disabled:opacity-50">
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {error && (
        <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
          <AlertCircle size={14} className="mt-0.5 shrink-0" /> <span>{error}</span>
        </div>
      )}

      {/* Profile card */}
      <div className="card-p flex flex-col sm:flex-row items-start sm:items-center gap-5 border-amber-500/20 bg-gradient-to-r from-amber-500/8 to-transparent">
        <div className="w-[72px] h-[72px] rounded-2xl bg-amber-500/15 border-2 border-amber-500/30 flex items-center justify-center overflow-hidden shrink-0">
          {data.avatar
            ? <img src={data.avatar} alt={data.handle} className="w-full h-full object-cover rounded-2xl" />
            : <StickyNote size={30} className="text-amber-400" />
          }
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3 mb-1">
            <h2 className="text-2xl font-black text-amber-400 font-mono">{data.handle}</h2>
            {data.globalRanking > 0 && <span className="badge-amber">Global Rank #{data.globalRanking.toLocaleString()}</span>}
          </div>
          {data.username && data.username !== data.handle && <p className="text-sm mb-2" style={{color:"var(--text-muted)"}}>{data.username}</p>}
          <div className="flex flex-wrap gap-5 text-sm">
            {[
              { label: 'Contest Rating', val: data.contestRating,                          color: 'text-amber-400' },
              { label: 'Max Rating',     val: data.maxRating,                               color: 'text-white' },
              { label: 'Acceptance',     val: `${data.acceptanceRate}%`,                   color: 'text-green-400' },
              { label: 'Contests',       val: data.totalContests,                           color: 'text-white' },
            ].map(x => (
              <div key={x.label}>
                <span className="text-xs block" style={{color:"var(--text-muted)"}}>{x.label}</span>
                <span className={`font-bold font-mono ${x.color}`}>{x.val}</span>
              </div>
            ))}
          </div>
        </div>
        <a href={`https://leetcode.com/u/${data.handle}`} target="_blank" rel="noreferrer"
          className="text-slate-600 hover:text-amber-400 transition-colors">
          <ExternalLink size={16} />
        </a>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Solved"    value={data.totalSolved.toLocaleString()}   icon={<CheckCircle2 size={16} />} color="amber"  sub="All problems" />
        <StatCard label="Contest Rating"  value={data.contestRating}                  icon={<TrendingUp size={16} />}   color="cyan"   sub={`Peak: ${data.maxRating}`} />
        <StatCard label="Acceptance Rate" value={`${data.acceptanceRate}%`}           icon={<Trophy size={16} />}       color="green"  sub="Submission success" />
        <StatCard label="Hard Solved"     value={data.hardSolved}                     icon={<Flame size={16} />}        color="rose"   sub={`Medium: ${data.mediumSolved}`} />
      </div>

      {/* Charts row 1 */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Donut chart — real counts */}
        <Card>
          <SectionHeader title="Difficulty Split" sub="Solved by difficulty" />
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80}
                dataKey="value"
                {...{ activeIndex: activeIdx } as any}
                activeShape={ActiveShape as any}
                onMouseEnter={(_: any, i: number) => setActiveIdx(i)}>
                {pieData.map(d => <Cell key={d.name} fill={d.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-1">
            {pieData.map(d => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="" style={{color:"var(--text-muted)"}}>{d.name}: <span className="font-mono font-bold" style={{color:"var(--text-primary)"}}>{d.value}</span></span>
              </div>
            ))}
          </div>
        </Card>

        {/* Rating history with filter — real data */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <SectionHeader title="Contest Rating History" sub={`${filteredRating.length} contests`} />
              <div className="flex gap-1">
                {filters.map(f => (
                  <button key={f} onClick={() => setRatingFilter(f)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      ratingFilter === f ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.05]'
                    }`}>{f}</button>
                ))}
              </div>
            </div>
            {filteredRating.length > 1 ? (
              <>
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={filteredRating} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
                    <defs>
                      <linearGradient id="lcGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#f59e0b" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="date" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                    <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} width={48} domain={['dataMin - 50', 'dataMax + 50']} />
                    <Tooltip content={<RatingTooltip />} />
                    <Area type="monotone" dataKey="rating" stroke="#f59e0b" strokeWidth={2.5}
                      fill="url(#lcGrad)"
                      dot={{ r: 3, fill: '#f59e0b', strokeWidth: 0 }}
                      activeDot={{ r: 5, fill: '#f59e0b' }}
                      name="LC Rating" />
                  </AreaChart>
                </ResponsiveContainer>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.05] text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-0.5 bg-amber-500 rounded-full" />
                    <span className="" style={{color:"var(--text-muted)"}}>Current: <span className="text-amber-400 font-mono font-bold">{data.contestRating}</span></span>
                  </div>
                  <span className="" style={{color:"var(--text-muted)"}}>Peak: <span className="font-mono font-bold" style={{color:"var(--text-primary)"}}>{data.maxRating}</span></span>
                </div>
              </>
            ) : (
              <div className="h-[180px] flex items-center justify-center text-slate-500 text-sm">
                No contest history {ratingFilter !== 'ALL' ? 'in this range' : 'found'}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Difficulty progress — real totals from API */}
      <div className="grid lg:grid-cols-2 gap-5">
        <Card>
          <SectionHeader title="Difficulty Progress" sub="Solved vs total available (real counts from LC API)" />
          <div className="space-y-5 pt-1">
            {pieData.map(d => {
              const pct = d.total > 0 ? Math.min(100, Math.round(d.value / d.total * 100)) : 0
              return (
                <div key={d.name}>
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className="font-semibold text-sm" style={{color:"var(--text-primary)"}}>{d.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold" style={{color:"var(--text-primary)"}}>{d.value.toLocaleString()}</span>
                      <span className="font-mono text-sm" style={{color:"var(--text-muted)"}}> / {d.total.toLocaleString()}</span>
                      <span className="text-xs ml-2" style={{color:"var(--text-muted)"}}>({pct}%)</span>
                    </div>
                  </div>
                  <div className="h-2.5 bg-white/[0.05] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: d.color }} />
                  </div>
                </div>
              )
            })}
            <div className="pt-3 border-t border-white/[0.06] flex justify-between">
              <span className="text-sm" style={{color:"var(--text-muted)"}}>Total Solved</span>
              <span className="font-bold font-mono" style={{color:"var(--text-primary)"}}>{data.totalSolved.toLocaleString()}</span>
            </div>
          </div>
        </Card>

        {/* Topic coverage — relative bars (no fake 71%) */}
        <Card>
          <SectionHeader title="Topic Coverage" sub={`${topTags.length} topics — bar length relative to most solved`} />
          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {topTags.map(([topic, solved], i) => {
              // Bar = solved / max solved topic (shows relative strength)
              const pct = Math.round(solved / maxTagCount * 100)
              return (
                <div key={topic}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm" style={{color:"var(--text-second)"}}>{topic}</span>
                    <span className="text-xs font-mono font-semibold" style={{color:"var(--text-muted)"}}>{solved}</span>
                  </div>
                  <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, backgroundColor: TAG_COLORS[i % TAG_COLORS.length] }} />
                  </div>
                </div>
              )
            })}
          </div>
          <p className="text-slate-600 text-xs mt-3 pt-3 border-t border-white/[0.04]">
            Bar length = relative to your most solved topic ({topTags[0]?.[0] ?? ''}: {topTags[0]?.[1] ?? 0} problems)
          </p>
        </Card>
      </div>

      {/* Recent contests */}
      {data.contests.length > 0 && (
        <Card>
          <SectionHeader title="Recent Contests" sub={`${data.contests.length} contests`} />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-500 text-xs uppercase tracking-wider border-b border-white/[0.06]">
                  <th className="text-left py-2.5 pr-4">Contest</th>
                  <th className="text-right py-2.5 pr-4">Date</th>
                  <th className="text-right py-2.5 pr-4">Rank</th>
                  <th className="text-right py-2.5 pr-4">Rating</th>
                  <th className="text-right py-2.5">Δ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {data.contests.map((c, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-2.5 pr-4text-xs max-w-[220px] truncate" style={{color:"var(--text-second)"}}>{c.name}</td>
                    <td className="py-2.5 pr-4 text-rightfont-mono text-xs" style={{color:"var(--text-muted)"}}>{c.date}</td>
                    <td className="py-2.5 pr-4 text-right font-bold text-amber-400 font-mono">#{c.rank.toLocaleString()}</td>
                    <td className="py-2.5 pr-4 text-rightfont-mono" style={{color:"var(--text-second)"}}>{c.rating}</td>
                    <td className={`py-2.5 text-right font-bold font-mono text-sm ${c.delta > 0 ? 'text-green-400' : c.delta < 0 ? 'text-red-400' : 'text-slate-500'}`}>
                      {c.delta > 0 ? '+' : ''}{c.delta}
                    </td>
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
