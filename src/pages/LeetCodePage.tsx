import { useEffect, useState } from 'react'
import { StickyNote, CheckCircle2, Trophy, Flame, TrendingUp, RefreshCw, AlertCircle } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Sector } from 'recharts'
import { StatCard, PageHeader, Card, SectionHeader, ChartTooltip } from '../components/ui'
import { useAuth } from '../context/AuthContext'
import { loadLCData, fetchLCData, saveLCData, type LCData } from '../services/api'

const TAG_COLORS = ['#3b82f6','#06b6d4','#f59e0b','#10b981','#a855f7','#f43f5e','#fb923c','#34d399']
const PIE_COLORS = { Easy:'#10b981', Medium:'#f59e0b', Hard:'#f43f5e' }

function ActiveShape(props: any) {
  const { cx,cy,innerRadius,outerRadius,startAngle,endAngle,fill,payload,value } = props
  return (
    <g>
      <text x={cx} y={cy-8} textAnchor="middle" fill="white" style={{fontSize:24,fontWeight:700,fontFamily:'JetBrains Mono'}}>{value}</text>
      <text x={cx} y={cy+14} textAnchor="middle" fill="#6b7280" style={{fontSize:13}}>{payload.name}</text>
      <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius+6} startAngle={startAngle} endAngle={endAngle} fill={fill}/>
      <Sector cx={cx} cy={cy} innerRadius={innerRadius-4} outerRadius={innerRadius-1} startAngle={startAngle} endAngle={endAngle} fill={fill}/>
    </g>
  )
}

export default function LeetCodePage() {
  const { user, profile } = useAuth()
  const [data, setData] = useState<LCData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeIdx, setActiveIdx] = useState(0)

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
      {[...Array(3)].map((_,i) => <div key={i} className="skeleton h-32 rounded-2xl"/>)}
    </div>
  )

  if (!data) return (
    <div className="flex-1 p-5 lg:p-8 flex flex-col items-center justify-center gap-4 text-center">
      <StickyNote size={48} className="text-n-400"/>
      <h2 className="text-xl font-bold text-n-900">No LeetCode data yet</h2>
      <p className="text-n-500 text-sm max-w-xs">Go to Dashboard and connect your LeetCode handle first.</p>
    </div>
  )

  const pie = [
    { name:'Easy',   value:data.easySolved,   color:PIE_COLORS.Easy,   total:data.totalEasy   },
    { name:'Medium', value:data.mediumSolved,  color:PIE_COLORS.Medium, total:data.totalMedium },
    { name:'Hard',   value:data.hardSolved,    color:PIE_COLORS.Hard,   total:data.totalHard   },
  ]

  const tags = Object.entries(data.tagDistribution).sort(([,a],[,b])=>b-a).slice(0,8).map(([topic,solved],i)=>({
    topic, solved, total: Math.ceil(solved * 1.4), color: TAG_COLORS[i]
  }))

  return (
    <div className="flex-1 p-5 lg:p-8 space-y-6 animate-fade-in">
      <div className="flex items-start justify-between">
        <PageHeader title="LeetCode" sub="Real-time data from LeetCode GraphQL" icon={<StickyNote size={20}/>} badge="Live"/>
        <button onClick={refresh} disabled={loading} className="btn-secondary text-xs py-2 mt-1">
          <RefreshCw size={13} className={loading?'animate-spin':''}/> Refresh
        </button>
      </div>

      {error && <div className="flex items-center gap-2 bg-rose/10 border border-rose/20 rounded-xl px-4 py-3 text-rose text-sm"><AlertCircle size={14}/>{error}</div>}

      {/* Profile */}
      <div className="card-p flex flex-col sm:flex-row items-start sm:items-center gap-5 border-amber/20 bg-amber/5">
        <div className="w-[72px] h-[72px] rounded-2xl bg-amber/15 border-2 border-amber/30 flex items-center justify-center overflow-hidden shrink-0">
          {data.avatar ? <img src={data.avatar} alt={data.handle} className="w-full h-full object-cover"/> : <StickyNote size={30} className="text-amber-light"/>}
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3 mb-1">
            <h2 className="text-2xl font-black text-amber-light font-mono">{data.handle}</h2>
            {data.globalRanking > 0 && <span className="badge-amber">Rank #{data.globalRanking.toLocaleString()}</span>}
          </div>
          {data.username && data.username !== data.handle && <p className="text-n-500 text-sm mb-2">{data.username}</p>}
          <div className="flex flex-wrap gap-5 text-sm">
            {[{l:'Contest Rating',v:data.contestRating,c:'text-amber-light'},{l:'Acceptance',v:`${data.acceptanceRate}%`,c:'text-green-light'},{l:'Contests',v:data.totalContests,c:'text-n-900'}].map(x=>(
              <div key={x.l}><span className="text-n-500 text-xs block">{x.l}</span><span className={`font-bold font-mono ${x.c}`}>{x.v}</span></div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Solved"   value={data.totalSolved.toLocaleString()} icon={<CheckCircle2 size={16}/>} color="amber"  sub="All time"/>
        <StatCard label="Contest Rating" value={data.contestRating} icon={<TrendingUp size={16}/>} color="cyan"   sub={`Max: ${data.maxRating}`}/>
        <StatCard label="Acceptance"     value={`${data.acceptanceRate}%`} icon={<Trophy size={16}/>} color="green" sub="Rate"/>
        <StatCard label="Hard Solved"    value={data.hardSolved} icon={<Flame size={16}/>} color="rose" sub={`${data.mediumSolved} Medium`}/>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <Card>
          <SectionHeader title="Difficulty Split"/>
          <ResponsiveContainer width="100%" height={190}>
            <PieChart>
              <Pie data={pie} cx="50%" cy="50%" innerRadius={58} outerRadius={78} dataKey="value"
                {...{activeIndex:activeIdx} as any} activeShape={ActiveShape as any}
                onMouseEnter={(_:any,i:number)=>setActiveIdx(i)}>
                {pie.map(d=><Cell key={d.name} fill={d.color}/>)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {pie.map(d=><div key={d.name} className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor:d.color}}/><span className="text-n-500 text-xs">{d.name}: {d.value}</span></div>)}
          </div>
        </Card>

        <div className="lg:col-span-2">
          <Card>
            <SectionHeader title="Contest Rating History"/>
            <ResponsiveContainer width="100%" height={190}>
              <AreaChart data={data.ratingHistory}>
                <defs><linearGradient id="lcRG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f59e0b" stopOpacity={0.35}/><stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/></linearGradient></defs>
                <XAxis dataKey="date" tick={{fill:'#4b5563',fontSize:10}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fill:'#4b5563',fontSize:11}} axisLine={false} tickLine={false} width={42} domain={['dataMin-100','dataMax+100']}/>
                <Tooltip content={<ChartTooltip/>}/>
                <Area type="monotone" dataKey="rating" stroke="#f59e0b" strokeWidth={2.5} fill="url(#lcRG)" dot={false} name="Rating"/>
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <Card>
          <SectionHeader title="Difficulty Progress"/>
          <div className="space-y-5">
            {pie.map(d => {
              const pct = d.total > 0 ? Math.min(100, Math.round((d.value/d.total)*100)) : 0
              return (
                <div key={d.name}>
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{backgroundColor:d.color}}/><span className="text-n-800 font-semibold text-sm">{d.name}</span></div>
                    <span className="text-n-500 font-mono text-sm">{d.value} / {d.total}</span>
                  </div>
                  <div className="h-2 bg-bg-muted rounded-full overflow-hidden"><div className="h-full rounded-full" style={{width:`${pct}%`,backgroundColor:d.color}}/></div>
                </div>
              )
            })}
          </div>
        </Card>

        <Card>
          <SectionHeader title="Topic Coverage" sub={`${tags.length} topics`}/>
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {tags.map(t => {
              const pct = t.total > 0 ? Math.round((t.solved/t.total)*100) : 0
              return (
                <div key={t.topic}>
                  <div className="flex justify-between mb-1"><span className="text-n-700 text-sm">{t.topic}</span><span className="text-n-500 text-xs font-mono">{t.solved} · {pct}%</span></div>
                  <div className="progress-bar"><div className="progress-fill" style={{width:`${pct}%`,backgroundColor:t.color}}/></div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      {data.contests.length > 0 && (
        <Card>
          <SectionHeader title="Recent Contests"/>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-n-500 text-xs uppercase tracking-wider border-b border-bg-border">
                {['Contest','Date','Rank','Δ Rating'].map(h=><th key={h} className={`py-3 pr-4 font-semibold ${h!=='Contest'?'text-right':''}`}>{h}</th>)}
              </tr></thead>
              <tbody className="divide-y divide-bg-border">
                {data.contests.map((c,i) => (
                  <tr key={i} className="hover:bg-bg-hover transition-colors">
                    <td className="py-3 pr-4 text-n-800 font-medium text-xs">{c.name}</td>
                    <td className="py-3 pr-4 text-right text-n-500 font-mono text-xs">{c.date}</td>
                    <td className="py-3 pr-4 text-right font-bold text-amber font-mono">#{c.rank}</td>
                    <td className="py-3 text-right font-bold font-mono" style={{color:c.delta>0?'#34d399':c.delta<0?'#fb7185':'#6b7280'}}>{c.delta>0?'+':''}{c.delta}</td>
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
