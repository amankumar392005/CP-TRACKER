import { useEffect, useState } from 'react'
import { Code2, Trophy, TrendingUp, Hash, Flame, RefreshCw, AlertCircle } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis } from 'recharts'
import { StatCard, PageHeader, Card, SectionHeader, ChartTooltip } from '../components/ui'
import { useAuth } from '../context/AuthContext'
import { loadCFData, fetchCFData, saveCFData, type CFData } from '../services/api'

const TAG_COLORS = ['#3b82f6','#06b6d4','#f59e0b','#10b981','#a855f7','#f43f5e','#fb923c','#34d399','#60a5fa','#f472b6']

export default function CodeforcesPage() {
  const { user, profile } = useAuth()
  const [data, setData] = useState<CFData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return
    loadCFData(user.id).then(d => {
      setData(d)
      setLoading(false)
    })
  }, [user])

  const refresh = async () => {
    if (!profile?.cf_handle || !user) return
    setLoading(true); setError('')
    try {
      const d = await fetchCFData(profile.cf_handle)
      await saveCFData(user.id, d)
      setData(d)
    } catch (e: any) { setError(e.message) }
    finally { setLoading(false) }
  }

  if (loading) return (
    <div className="flex-1 p-5 lg:p-8 space-y-6">
      <div className="skeleton h-10 w-48 rounded-xl"/>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{[...Array(4)].map((_,i)=><div key={i} className="skeleton h-28 rounded-2xl"/>)}</div>
      <div className="grid lg:grid-cols-2 gap-5">{[...Array(2)].map((_,i)=><div key={i} className="skeleton h-64 rounded-2xl"/>)}</div>
    </div>
  )

  if (!data) return (
    <div className="flex-1 p-5 lg:p-8 flex flex-col items-center justify-center gap-4 text-center">
      <Code2 size={48} className="text-n-400"/>
      <h2 className="text-xl font-bold text-n-900">No Codeforces data yet</h2>
      <p className="text-n-500 text-sm max-w-xs">Go to the Dashboard and connect your Codeforces handle first.</p>
    </div>
  )

  const tags = Object.entries(data.tagDistribution).sort(([,a],[,b])=>b-a).slice(0,10).map(([tag,solved],i)=>({ tag, solved, color: TAG_COLORS[i] }))
  const maxTag = tags[0]?.solved ?? 1
  const radarData = tags.slice(0,8).map(t => ({ skill: t.tag.length > 10 ? t.tag.slice(0,8)+'…' : t.tag, val: Math.round((t.solved/maxTag)*100) }))
  const diffData = Object.entries(data.difficultyDist ?? {}).sort(([a],[b])=>parseInt(a)-parseInt(b)).map(([range,count],i)=>({ range, count, color: TAG_COLORS[i % TAG_COLORS.length] }))

  return (
    <div className="flex-1 p-5 lg:p-8 space-y-6 animate-fade-in">
      <div className="flex items-start justify-between">
        <PageHeader title="Codeforces" sub="Real-time data from Codeforces API" icon={<Code2 size={20}/>} badge="Live"/>
        <button onClick={refresh} disabled={loading} className="btn-secondary text-xs py-2 mt-1">
          <RefreshCw size={13} className={loading?'animate-spin':''}/> Refresh
        </button>
      </div>

      {error && <div className="flex items-center gap-2 bg-rose/10 border border-rose/20 rounded-xl px-4 py-3 text-rose text-sm"><AlertCircle size={14}/>{error}</div>}

      {/* Profile card */}
      <div className="card-p flex flex-col sm:flex-row items-start sm:items-center gap-5 border-primary/20 bg-primary/5">
        <div className="w-[72px] h-[72px] rounded-2xl bg-primary/15 border-2 border-primary/30 flex items-center justify-center shrink-0 overflow-hidden">
          {data.avatar ? <img src={data.avatar} alt={data.handle} className="w-full h-full object-cover"/> : <Code2 size={30} className="text-primary-light"/>}
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3 mb-1">
            <h2 className="text-2xl font-black text-primary-light font-mono">{data.handle}</h2>
            <span className="badge-rose">{data.rank}</span>
          </div>
          <p className="text-n-500 text-sm mb-3">{[data.organization, data.country].filter(Boolean).join(' · ')}</p>
          <div className="flex flex-wrap gap-5 text-sm">
            {[{l:'Rating',v:data.rating,c:'text-primary-light'},{l:'Max',v:data.maxRating,c:'text-n-900'},{l:'Contribution',v:`+${data.contribution}`,c:'text-green-light'},{l:'Friends',v:data.friendCount.toLocaleString(),c:'text-n-900'}].map(x=>(
              <div key={x.l}><span className="text-n-500 text-xs block">{x.l}</span><span className={`font-bold font-mono ${x.c}`}>{x.v}</span></div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Rating"      value={data.rating}      icon={<TrendingUp size={16}/>} color="blue"   sub={data.rank}       trend={data.rating - (data.ratingHistory[data.ratingHistory.length-2]?.rating ?? data.rating)}/>
        <StatCard label="Max Rating"  value={data.maxRating}   icon={<Trophy size={16}/>}     color="purple" sub={data.maxRank}/>
        <StatCard label="AC Problems" value={data.totalSolved} icon={<Hash size={16}/>}       color="green"  sub="Unique solved"/>
        <StatCard label="Streak"      value={`${data.streakDays}d`} icon={<Flame size={16}/>} color="amber"  sub="Consecutive days"/>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <Card>
          <SectionHeader title="Rating History" sub={`${data.ratingHistory.length} contests`}/>
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart data={data.ratingHistory}>
              <defs><linearGradient id="cfRG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient></defs>
              <XAxis dataKey="date" tick={{fill:'#4b5563',fontSize:10}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:'#4b5563',fontSize:11}} axisLine={false} tickLine={false} width={42} domain={['dataMin-100','dataMax+100']}/>
              <Tooltip content={<ChartTooltip/>}/>
              <Area type="monotone" dataKey="rating" stroke="#3b82f6" strokeWidth={2.5} fill="url(#cfRG)" dot={false} name="Rating"/>
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {radarData.length > 0 ? (
          <Card>
            <SectionHeader title="Skill Radar" sub="Topic mastery"/>
            <ResponsiveContainer width="100%" height={210}>
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                <PolarGrid stroke="var(--border)"/>
                <PolarAngleAxis dataKey="skill" tick={{fill:'#6b7280',fontSize:9}}/>
                <Radar dataKey="val" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} strokeWidth={2} name="Proficiency"/>
              </RadarChart>
            </ResponsiveContainer>
          </Card>
        ) : <Card><div className="h-[210px] flex items-center justify-center text-n-500 text-sm">No submission data yet</div></Card>}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <Card>
          <SectionHeader title="Tag Analysis" sub={`${tags.length} topics solved`}/>
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {tags.map(t => (
              <div key={t.tag}>
                <div className="flex justify-between mb-1"><span className="text-n-700 text-sm capitalize">{t.tag}</span><span className="text-n-500 text-sm font-mono font-semibold">{t.solved}</span></div>
                <div className="progress-bar"><div className="progress-fill" style={{width:`${Math.round((t.solved/maxTag)*100)}%`,backgroundColor:t.color}}/></div>
              </div>
            ))}
          </div>
        </Card>

        {diffData.length > 0 ? (
          <Card>
            <SectionHeader title="Difficulty Distribution"/>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={diffData} layout="vertical" margin={{left:8}}>
                <XAxis type="number" tick={{fill:'#4b5563',fontSize:11}} axisLine={false} tickLine={false}/>
                <YAxis dataKey="range" type="category" tick={{fill:'#9ca3af',fontSize:10}} axisLine={false} tickLine={false} width={80}/>
                <Tooltip content={<ChartTooltip/>}/>
                <Bar dataKey="count" radius={[0,4,4,0]} name="Solved">{diffData.map(d=><Cell key={d.range} fill={d.color}/>)}</Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        ) : <Card><div className="h-[280px] flex items-center justify-center text-n-500 text-sm">No difficulty data</div></Card>}
      </div>

      {data.contests.length > 0 && (
        <Card>
          <SectionHeader title="Recent Contests" sub={`Last ${data.contests.length} contests`}/>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-n-500 text-xs uppercase tracking-wider border-b border-bg-border">
                {['Contest','Date','Rank','Δ Rating','New Rating'].map(h=>(
                  <th key={h} className={`py-3 pr-4 font-semibold ${h!=='Contest'?'text-right':''}`}>{h}</th>
                ))}
              </tr></thead>
              <tbody className="divide-y divide-bg-border">
                {data.contests.slice(0,10).map((c,i) => (
                  <tr key={i} className="hover:bg-bg-hover transition-colors">
                    <td className="py-3 pr-4 text-n-800 font-medium text-xs">{c.name}</td>
                    <td className="py-3 pr-4 text-right text-n-500 font-mono text-xs">{c.date}</td>
                    <td className="py-3 pr-4 text-right font-bold text-amber font-mono">#{c.rank}</td>
                    <td className={`py-3 pr-4 text-right font-bold font-mono ${c.delta>0?'text-green-light':'text-rose-light'}`}>{c.delta>0?'+':''}{c.delta}</td>
                    <td className="py-3 text-right text-n-700 font-mono">{c.newRating}</td>
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
