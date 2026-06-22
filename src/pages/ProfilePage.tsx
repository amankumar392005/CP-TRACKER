// import { useState, useEffect } from 'react'
// import { User, Code2, StickyNote, Target, Save, CheckCircle2, Bell, Shield, Trash2, RefreshCw, AlertCircle, Loader2 } from 'lucide-react'
// import { PageHeader, Card, SectionHeader, StatCard } from '../components/ui'
// import { useAuth } from '../context/AuthContext'
// import { loadCFData, loadLCData, fetchCFData, fetchLCData, saveCFData, saveLCData, type CFData, type LCData } from '../services/api'

// export default function ProfilePage() {
//   const { user, profile, updateProfile, signOut } = useAuth()
//   const [cfData, setCfData] = useState<CFData|null>(null)
//   const [lcData, setLcData] = useState<LCData|null>(null)
//   const [activeTab, setActiveTab] = useState<'profile'|'handles'|'notifications'|'security'>('profile')
//   const [saving, setSaving] = useState(false)
//   const [saved, setSaved]   = useState(false)
//   const [error, setError]   = useState('')
//   const [cfVerifying, setCfVerifying] = useState(false)
//   const [lcVerifying, setLcVerifying] = useState(false)

//   const [form, setForm] = useState({
//     display_name: profile?.display_name ?? '',
//     cf_handle: profile?.cf_handle ?? '',
//     lc_handle: profile?.lc_handle ?? '',
//   })

//   useEffect(() => {
//     setForm({ display_name: profile?.display_name ?? '', cf_handle: profile?.cf_handle ?? '', lc_handle: profile?.lc_handle ?? '' })
//     if (user) {
//       loadCFData(user.id).then(d => { if (d) setCfData(d) })
//       loadLCData(user.id).then(d => { if (d) setLcData(d) })
//     }
//   }, [profile, user])

//   const saveProfile = async () => {
//     setSaving(true); setError('')
//     try {
//       await updateProfile({ display_name: form.display_name })
//       setSaved(true); setTimeout(() => setSaved(false), 2500)
//     } catch (e: any) { setError(e.message) }
//     finally { setSaving(false) }
//   }

//   const verifyCF = async () => {
//     if (!form.cf_handle.trim() || !user) return
//     setCfVerifying(true); setError('')
//     try {
//       const d = await fetchCFData(form.cf_handle.trim())
//       await saveCFData(user.id, d)
//       await updateProfile({ cf_handle: form.cf_handle.trim() })
//       setCfData(d)
//     } catch (e: any) { setError(`CF: ${e.message}`) }
//     finally { setCfVerifying(false) }
//   }

//   const verifyLC = async () => {
//     if (!form.lc_handle.trim() || !user) return
//     setLcVerifying(true); setError('')
//     try {
//       const d = await fetchLCData(form.lc_handle.trim())
//       await saveLCData(user.id, d)
//       await updateProfile({ lc_handle: form.lc_handle.trim() })
//       setLcData(d)
//     } catch (e: any) { setError(`LC: ${e.message}`) }
//     finally { setLcVerifying(false) }
//   }

//   const tabs = [
//     { key:'profile',       label:'Profile',       icon:User },
//     { key:'handles',       label:'Handles',       icon:Code2 },
//     { key:'notifications', label:'Notifications', icon:Bell },
//     { key:'security',      label:'Security',      icon:Shield },
//   ] as const

//   const NOTIFS = [
//     { label:'Daily problem reminder',       desc:'Remind me to solve problems each day',         def:true },
//     { label:'Contest alerts (1hr before)',  desc:'CF and LC contest start reminders',             def:true },
//     { label:'Rating change notifications',  desc:'Notify after each rated contest',               def:true },
//     { label:'Weekly progress report',       desc:'Sunday summary of the week',                   def:false },
//     { label:'Streak at risk',               desc:'Alert if no problem solved by 8 PM',           def:true },
//     { label:'Goal milestone reached',       desc:'Celebrate hitting a target',                   def:true },
//   ]

//   return (
//     <div className="flex-1 p-5 lg:p-8 space-y-6 animate-fade-in">
//       <PageHeader title="Profile & Settings" sub="Manage your account and preferences" icon={<User size={20}/>}/>

//       {error && <div className="flex items-center gap-2 bg-rose/10 border border-rose/20 rounded-xl px-4 py-3 text-rose text-sm"><AlertCircle size={14}/>{error}</div>}

//       {/* Profile hero */}
//       <Card className="border-primary/20">
//         <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
//           <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-cyan flex items-center justify-centertext-3xl font-black shadow-glow shrink-0" style={{color:"var(--text-primary)"}}>
//             {(profile?.display_name ?? profile?.email ?? 'U')[0].toUpperCase()}
//           </div>
//           <div className="flex-1">
//             <h2 className="text-xl font-black text-n-900 mb-1">{profile?.display_name ?? 'Your Name'}</h2>
//             <p className="text-n-500 text-sm mb-2">{profile?.email ?? user?.email}</p>
//             <div className="flex flex-wrap gap-2">
//               {profile?.cf_handle && <span className="badge-blue">CF: {profile.cf_handle}</span>}
//               {profile?.lc_handle && <span className="badge-amber">LC: {profile.lc_handle}</span>}
//             </div>
//           </div>
//           <div className="grid grid-cols-2 gap-4 text-center">
//             <div><p className="text-2xl font-black font-mono text-primary-light">{cfData?.rating ?? '—'}</p><p className="text-n-500 text-xs">CF Rating</p></div>
//             <div><p className="text-2xl font-black font-mono text-amber-light">{lcData?.contestRating ?? '—'}</p><p className="text-n-500 text-xs">LC Rating</p></div>
//           </div>
//         </div>
//       </Card>

//       <div className="grid lg:grid-cols-4 gap-5">
//         {/* Tab nav */}
//         <Card className="lg:col-span-1 h-fit">
//           <nav className="space-y-0.5">
//             {tabs.map(({ key, label, icon: Icon }) => (
//               <button key={key} onClick={() => setActiveTab(key)}
//                 className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${activeTab===key?'bg-primary/10 text-primary-light border border-primary/20':'text-n-500 hover:text-n-800 hover:bg-bg-hover'}`}>
//                 <Icon size={15}/>{label}
//               </button>
//             ))}
//           </nav>
//         </Card>

//         <div className="lg:col-span-3 space-y-4">
//           {/* Profile tab */}
//           {activeTab==='profile' && (
//             <Card>
//               <SectionHeader title="Personal Information" sub="Update your display name"/>
//               <div className="space-y-4">
//                 <div>
//                   <label className="label block mb-1.5">Display Name</label>
//                   <input value={form.display_name} onChange={e=>setForm(f=>({...f,display_name:e.target.value}))} className="input" placeholder="Your name"/>
//                 </div>
//                 <div>
//                   <label className="label block mb-1.5">Email</label>
//                   <input value={profile?.email ?? user?.email ?? ''} className="input opacity-60 cursor-not-allowed" readOnly/>
//                   <p className="text-n-500 text-xs mt-1">Email cannot be changed here. Use security settings.</p>
//                 </div>
//                 <button onClick={saveProfile} disabled={saving} className="btn-primary">
//                   {saving?<Loader2 size={14} className="animate-spin"/>:saved?<CheckCircle2 size={14}/>:<Save size={14}/>}
//                   {saved?'Saved!':'Save Changes'}
//                 </button>
//               </div>
//             </Card>
//           )}

//           {/* Handles tab */}
//           {activeTab==='handles' && (
//             <Card>
//               <SectionHeader title="Platform Handles" sub="Connect your competitive programming accounts"/>
//               <div className="space-y-5">
//                 {/* CF */}
//                 <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl space-y-3">
//                   <div className="flex items-center gap-3">
//                     <div className="w-9 h-9 bg-primary/15 rounded-xl flex items-center justify-center"><Code2 size={16} className="text-primary-light"/></div>
//                     <div className="flex-1">
//                       <p className="text-n-800 font-semibold text-sm">Codeforces</p>
//                       {cfData && <p className="text-n-500 text-xs">{cfData.rank} · {cfData.rating} rating · {cfData.totalSolved} solved</p>}
//                     </div>
//                     {cfData && <span className="badge-green">Connected</span>}
//                   </div>
//                   <div className="flex gap-2">
//                     <input value={form.cf_handle} onChange={e=>setForm(f=>({...f,cf_handle:e.target.value}))}
//                       onKeyDown={e=>e.key==='Enter'&&verifyCF()} placeholder="e.g. tourist" className="input font-mono text-sm"/>
//                     <button onClick={verifyCF} disabled={cfVerifying} className="btn-primary text-xs px-3 whitespace-nowrap disabled:opacity-60">
//                       {cfVerifying?<Loader2 size={12} className="animate-spin"/>:<CheckCircle2 size={12}/>}
//                       {cfVerifying?'Verifying…':cfData?'Re-sync':'Connect'}
//                     </button>
//                   </div>
//                 </div>
//                 {/* LC */}
//                 <div className="p-4 bg-amber/5 border border-amber/20 rounded-xl space-y-3">
//                   <div className="flex items-center gap-3">
//                     <div className="w-9 h-9 bg-amber/15 rounded-xl flex items-center justify-center"><StickyNote size={16} className="text-amber-light"/></div>
//                     <div className="flex-1">
//                       <p className="text-n-800 font-semibold text-sm">LeetCode</p>
//                       {lcData && <p className="text-n-500 text-xs">Rank #{lcData.globalRanking} · {lcData.contestRating} rating · {lcData.totalSolved} solved</p>}
//                     </div>
//                     {lcData && <span className="badge-green">Connected</span>}
//                   </div>
//                   <div className="flex gap-2">
//                     <input value={form.lc_handle} onChange={e=>setForm(f=>({...f,lc_handle:e.target.value}))}
//                       onKeyDown={e=>e.key==='Enter'&&verifyLC()} placeholder="e.g. neal_wu" className="input font-mono text-sm"/>
//                     <button onClick={verifyLC} disabled={lcVerifying} className="btn-primary text-xs px-3 whitespace-nowrap disabled:opacity-60">
//                       {lcVerifying?<Loader2 size={12} className="animate-spin"/>:<CheckCircle2 size={12}/>}
//                       {lcVerifying?'Verifying…':lcData?'Re-sync':'Connect'}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </Card>
//           )}

//           {/* Notifications tab */}
//           {activeTab==='notifications' && (
//             <Card>
//               <SectionHeader title="Notification Preferences"/>
//               <div className="space-y-3">
//                 {NOTIFS.map(n => {
//                   const [on, setOn] = useState(n.def)
//                   return (
//                     <div key={n.label} className="flex items-start justify-between gap-4 p-3.5 bg-bg-hover rounded-xl border border-bg-border">
//                       <div><p className="text-n-800 font-semibold text-sm">{n.label}</p><p className="text-n-500 text-xs mt-0.5">{n.desc}</p></div>
//                       <button onClick={()=>setOn(v=>!v)} className={`relative shrink-0 w-10 h-5 rounded-full transition-all ${on?'bg-primary':'bg-bg-muted'}`}>
//                         <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${on?'left-5':'left-0.5'}`}/>
//                       </button>
//                     </div>
//                   )
//                 })}
//               </div>
//             </Card>
//           )}

//           {/* Security tab */}
//           {activeTab==='security' && (
//             <div className="space-y-4">
//               <Card>
//                 <SectionHeader title="Signed In As"/>
//                 <div className="flex items-center gap-4 p-4 bg-bg-hover border border-bg-border rounded-xl">
//                   <div className="w-10 h-10 bg-gradient-to-br from-primary to-cyan rounded-xl flex items-center justify-centerfont-bold" style={{color:"var(--text-primary)"}}>
//                     {(profile?.display_name ?? 'U')[0]}
//                   </div>
//                   <div>
//                     <p className="text-n-800 font-semibold">{profile?.display_name}</p>
//                     <p className="text-n-500 text-sm">{profile?.email ?? user?.email}</p>
//                   </div>
//                   <span className="ml-auto badge-green">Active</span>
//                 </div>
//               </Card>
//               <Card className="border-rose/20">
//                 <SectionHeader title="Danger Zone"/>
//                 <div className="space-y-3">
//                   <button onClick={signOut} className="btn-secondary w-full justify-center border-amber/30 text-amber-light hover:bg-amber/5">
//                     Sign Out of All Devices
//                   </button>
//                   <button className="w-full flex items-center justify-center gap-2 btn-danger py-2.5">
//                     <Trash2 size={14}/> Delete Account Permanently
//                   </button>
//                 </div>
//               </Card>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }
import { useState, useEffect } from 'react'
import { User, Code2, StickyNote, Target, Save, CheckCircle2, Bell, Shield, Trash2, RefreshCw, AlertCircle, Loader2 } from 'lucide-react'
import { PageHeader, Card, SectionHeader, StatCard } from '../components/ui'
import { useAuth } from '../context/AuthContext'
import { loadCFData, loadLCData, fetchCFData, fetchLCData, saveCFData, saveLCData, type CFData, type LCData } from '../services/api'

export default function ProfilePage() {
  const { user, profile, updateProfile, signOut } = useAuth()
  const [cfData, setCfData] = useState<CFData|null>(null)
  const [lcData, setLcData] = useState<LCData|null>(null)
  const [activeTab, setActiveTab] = useState<'profile'|'handles'|'notifications'|'security'>('profile')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved]   = useState(false)
  const [error, setError]   = useState('')
  const [cfVerifying, setCfVerifying] = useState(false)
  const [lcVerifying, setLcVerifying] = useState(false)

  const [form, setForm] = useState({
    display_name: profile?.display_name ?? '',
    cf_handle: profile?.cf_handle ?? '',
    lc_handle: profile?.lc_handle ?? '',
  })

  useEffect(() => {
    setForm({ display_name: profile?.display_name ?? '', cf_handle: profile?.cf_handle ?? '', lc_handle: profile?.lc_handle ?? '' })
    if (user) {
      loadCFData(user.id).then(d => { if (d) setCfData(d) })
      loadLCData(user.id).then(d => { if (d) setLcData(d) })
    }
  }, [profile, user])

  const saveProfile = async () => {
    setSaving(true); setError('')
    try {
      await updateProfile({ display_name: form.display_name })
      setSaved(true); setTimeout(() => setSaved(false), 2500)
    } catch (e: any) { setError(e.message) }
    finally { setSaving(false) }
  }

  const verifyCF = async () => {
    if (!form.cf_handle.trim() || !user) return
    setCfVerifying(true); setError('')
    try {
      const d = await fetchCFData(form.cf_handle.trim())
      await saveCFData(user.id, d)
      await updateProfile({ cf_handle: form.cf_handle.trim() })
      setCfData(d)
    } catch (e: any) { setError(`CF: ${e.message}`) }
    finally { setCfVerifying(false) }
  }

  const verifyLC = async () => {
    if (!form.lc_handle.trim() || !user) return
    setLcVerifying(true); setError('')
    try {
      // Show a status message while trying proxies (can take up to ~24s total)
      const d = await fetchLCData(form.lc_handle.trim())
      await saveLCData(user.id, d)
      await updateProfile({ lc_handle: form.lc_handle.trim() })
      setLcData(d)
    } catch (e: any) {
      // Show only the first line of the error (not the full deployment instructions)
      const msg = (e.message ?? 'Unknown error').split('\n')[0]
      setError(`LeetCode sync failed: ${msg}`)
    }
    finally { setLcVerifying(false) }
  }

  const tabs = [
    { key:'profile',       label:'Profile',       icon:User },
    { key:'handles',       label:'Handles',       icon:Code2 },
    { key:'notifications', label:'Notifications', icon:Bell },
    { key:'security',      label:'Security',      icon:Shield },
  ] as const

  const NOTIFS = [
    { label:'Daily problem reminder',       desc:'Remind me to solve problems each day',         def:true },
    { label:'Contest alerts (1hr before)',  desc:'CF and LC contest start reminders',             def:true },
    { label:'Rating change notifications',  desc:'Notify after each rated contest',               def:true },
    { label:'Weekly progress report',       desc:'Sunday summary of the week',                   def:false },
    { label:'Streak at risk',               desc:'Alert if no problem solved by 8 PM',           def:true },
    { label:'Goal milestone reached',       desc:'Celebrate hitting a target',                   def:true },
  ]

  return (
    <div className="flex-1 p-5 lg:p-8 space-y-6 animate-fade-in">
      <PageHeader title="Profile & Settings" sub="Manage your account and preferences" icon={<User size={20}/>}/>

      {error && <div className="flex items-center gap-2 bg-rose/10 border border-rose/20 rounded-xl px-4 py-3 text-rose text-sm"><AlertCircle size={14}/>{error}</div>}

      {/* Profile hero */}
      <Card className="border-primary/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-cyan flex items-center justify-centertext-3xl font-black shadow-glow shrink-0" style={{color:"var(--text-primary)"}}>
            {(profile?.display_name ?? profile?.email ?? 'U')[0].toUpperCase()}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-black text-n-900 mb-1">{profile?.display_name ?? 'Your Name'}</h2>
            <p className="text-n-500 text-sm mb-2">{profile?.email ?? user?.email}</p>
            <div className="flex flex-wrap gap-2">
              {profile?.cf_handle && <span className="badge-blue">CF: {profile.cf_handle}</span>}
              {profile?.lc_handle && <span className="badge-amber">LC: {profile.lc_handle}</span>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div><p className="text-2xl font-black font-mono text-primary-light">{cfData?.rating ?? '—'}</p><p className="text-n-500 text-xs">CF Rating</p></div>
            <div><p className="text-2xl font-black font-mono text-amber-light">{lcData?.contestRating ?? '—'}</p><p className="text-n-500 text-xs">LC Rating</p></div>
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-4 gap-5">
        {/* Tab nav */}
        <Card className="lg:col-span-1 h-fit">
          <nav className="space-y-0.5">
            {tabs.map(({ key, label, icon: Icon }) => (
              <button key={key} onClick={() => setActiveTab(key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${activeTab===key?'bg-primary/10 text-primary-light border border-primary/20':'text-n-500 hover:text-n-800 hover:bg-bg-hover'}`}>
                <Icon size={15}/>{label}
              </button>
            ))}
          </nav>
        </Card>

        <div className="lg:col-span-3 space-y-4">
          {/* Profile tab */}
          {activeTab==='profile' && (
            <Card>
              <SectionHeader title="Personal Information" sub="Update your display name"/>
              <div className="space-y-4">
                <div>
                  <label className="label block mb-1.5">Display Name</label>
                  <input value={form.display_name} onChange={e=>setForm(f=>({...f,display_name:e.target.value}))} className="input" placeholder="Your name"/>
                </div>
                <div>
                  <label className="label block mb-1.5">Email</label>
                  <input value={profile?.email ?? user?.email ?? ''} className="input opacity-60 cursor-not-allowed" readOnly/>
                  <p className="text-n-500 text-xs mt-1">Email cannot be changed here. Use security settings.</p>
                </div>
                <button onClick={saveProfile} disabled={saving} className="btn-primary">
                  {saving?<Loader2 size={14} className="animate-spin"/>:saved?<CheckCircle2 size={14}/>:<Save size={14}/>}
                  {saved?'Saved!':'Save Changes'}
                </button>
              </div>
            </Card>
          )}

          {/* Handles tab */}
          {activeTab==='handles' && (
            <Card>
              <SectionHeader title="Platform Handles" sub="Connect your competitive programming accounts"/>
              <div className="space-y-5">
                {/* CF */}
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-primary/15 rounded-xl flex items-center justify-center"><Code2 size={16} className="text-primary-light"/></div>
                    <div className="flex-1">
                      <p className="text-n-800 font-semibold text-sm">Codeforces</p>
                      {cfData && <p className="text-n-500 text-xs">{cfData.rank} · {cfData.rating} rating · {cfData.totalSolved} solved</p>}
                    </div>
                    {cfData && <span className="badge-green">Connected</span>}
                  </div>
                  <div className="flex gap-2">
                    <input value={form.cf_handle} onChange={e=>setForm(f=>({...f,cf_handle:e.target.value}))}
                      onKeyDown={e=>e.key==='Enter'&&verifyCF()} placeholder="e.g. tourist" className="input font-mono text-sm"/>
                    <button onClick={verifyCF} disabled={cfVerifying} className="btn-primary text-xs px-3 whitespace-nowrap disabled:opacity-60">
                      {cfVerifying?<Loader2 size={12} className="animate-spin"/>:<CheckCircle2 size={12}/>}
                      {cfVerifying?'Verifying…':cfData?'Re-sync':'Connect'}
                    </button>
                  </div>
                </div>
                {/* LC */}
                <div className="p-4 bg-amber/5 border border-amber/20 rounded-xl space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-amber/15 rounded-xl flex items-center justify-center"><StickyNote size={16} className="text-amber-light"/></div>
                    <div className="flex-1">
                      <p className="text-n-800 font-semibold text-sm">LeetCode</p>
                      {lcData && <p className="text-n-500 text-xs">Rank #{lcData.globalRanking} · {lcData.contestRating} rating · {lcData.totalSolved} solved</p>}
                    </div>
                    {lcData && <span className="badge-green">Connected</span>}
                  </div>
                  <div className="flex gap-2">
                    <input value={form.lc_handle} onChange={e=>setForm(f=>({...f,lc_handle:e.target.value}))}
                      onKeyDown={e=>e.key==='Enter'&&verifyLC()} placeholder="e.g. neal_wu" className="input font-mono text-sm"/>
                    <button onClick={verifyLC} disabled={lcVerifying} className="btn-primary text-xs px-3 whitespace-nowrap disabled:opacity-60">
                      {lcVerifying?<Loader2 size={12} className="animate-spin"/>:<CheckCircle2 size={12}/>}
                      {lcVerifying?'Syncing… (up to 30s)':lcData?'Re-sync':'Connect'}
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Notifications tab */}
          {activeTab==='notifications' && (
            <Card>
              <SectionHeader title="Notification Preferences"/>
              <div className="space-y-3">
                {NOTIFS.map(n => {
                  const [on, setOn] = useState(n.def)
                  return (
                    <div key={n.label} className="flex items-start justify-between gap-4 p-3.5 bg-bg-hover rounded-xl border border-bg-border">
                      <div><p className="text-n-800 font-semibold text-sm">{n.label}</p><p className="text-n-500 text-xs mt-0.5">{n.desc}</p></div>
                      <button onClick={()=>setOn(v=>!v)} className={`relative shrink-0 w-10 h-5 rounded-full transition-all ${on?'bg-primary':'bg-bg-muted'}`}>
                        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${on?'left-5':'left-0.5'}`}/>
                      </button>
                    </div>
                  )
                })}
              </div>
            </Card>
          )}

          {/* Security tab */}
          {activeTab==='security' && (
            <div className="space-y-4">
              <Card>
                <SectionHeader title="Signed In As"/>
                <div className="flex items-center gap-4 p-4 bg-bg-hover border border-bg-border rounded-xl">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-cyan rounded-xl flex items-center justify-centerfont-bold" style={{color:"var(--text-primary)"}}>
                    {(profile?.display_name ?? 'U')[0]}
                  </div>
                  <div>
                    <p className="text-n-800 font-semibold">{profile?.display_name}</p>
                    <p className="text-n-500 text-sm">{profile?.email ?? user?.email}</p>
                  </div>
                  <span className="ml-auto badge-green">Active</span>
                </div>
              </Card>
              <Card className="border-rose/20">
                <SectionHeader title="Danger Zone"/>
                <div className="space-y-3">
                  <button onClick={signOut} className="btn-secondary w-full justify-center border-amber/30 text-amber-light hover:bg-amber/5">
                    Sign Out of All Devices
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 btn-danger py-2.5">
                    <Trash2 size={14}/> Delete Account Permanently
                  </button>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
