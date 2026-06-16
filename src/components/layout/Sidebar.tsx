// import { Link, useLocation, useNavigate } from 'react-router-dom'
// import { useState } from 'react'
// import {
//   LayoutDashboard, Code2, StickyNote, BarChart3, Bot,
//   Users, Target, BookMarked, User, LogOut, RefreshCw,
//   Menu, X, Zap, ChevronRight
// } from 'lucide-react'
// import { useApp } from '../../context/AppContext'

// const NAV = [
//   { to: '/dashboard',  label: 'Dashboard',  icon: LayoutDashboard },
//   { to: '/codeforces', label: 'Codeforces', icon: Code2 },
//   { to: '/leetcode',   label: 'LeetCode',   icon: StickyNote },
//   { to: '/analytics',  label: 'Analytics',  icon: BarChart3 },
//   { to: '/ai-coach',   label: 'AI Coach',   icon: Bot },
//   { to: '/compare',    label: 'Compare',    icon: Users },
//   { to: '/goals',      label: 'Goals',      icon: Target },
//   { to: '/notes',      label: 'Notes',      icon: BookMarked },
//   { to: '/profile',    label: 'Profile',    icon: User },
// ]

// function NavContent({ onClose }: { onClose?: () => void }) {
//   const { pathname } = useLocation()
//   const navigate = useNavigate()
//   const { user } = useApp()

//   const close = () => onClose?.()

//   return (
//     <div className="flex flex-col h-full bg-bg-card border-r border-bg-border">
//       {/* Logo */}
//       <div className="px-4 py-4 border-b border-bg-border">
//         <Link to="/dashboard" onClick={close} className="flex items-center gap-3 group">
//           <div className="w-9 h-9 bg-gradient-to-br from-primary to-cyan rounded-xl flex items-center justify-center shadow-glow-sm group-hover:shadow-glow transition-all shrink-0">
//             <Zap size={17} className="text-white" fill="white" />
//           </div>
//           <div>
//             <p className="font-bold text-n-900 text-sm leading-none">CP Tracker</p>
//             <p className="text-[10px] text-cyan font-mono mt-0.5 tracking-wide">AI POWERED</p>
//           </div>
//         </Link>
//       </div>

//       {/* Nav links */}
//       <nav className="flex-1 px-2.5 py-3 space-y-0.5 overflow-y-auto">
//         {NAV.map(({ to, label, icon: Icon }) => {
//           const active = pathname === to
//           return (
//             <Link
//               key={to}
//               to={to}
//               onClick={close}
//               className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
//                 active
//                   ? 'bg-primary/10 text-primary-light border border-primary/20'
//                   : 'text-n-500 hover:text-n-800 hover:bg-bg-hover'
//               }`}
//             >
//               <Icon size={15} className="shrink-0" />
//               <span>{label}</span>
//               {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-light" />}
//             </Link>
//           )
//         })}
//       </nav>

//       {/* Bottom section */}
//       <div className="px-2.5 pb-3 pt-2.5 border-t border-bg-border space-y-1">
//         {/* Refresh */}
//         <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-n-500 hover:text-n-800 hover:bg-bg-hover w-full transition-all">
//           <RefreshCw size={15} className="shrink-0" />
//           Refresh Data
//         </button>

//         {/* User chip */}
//         <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-bg-hover border border-bg-border">
//           <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-cyan flex items-center justify-center text-white text-xs font-bold shrink-0">
//             {user.name[0]}
//           </div>
//           <div className="flex-1 min-w-0">
//             <p className="text-n-800 text-xs font-semibold truncate leading-none">{user.name}</p>
//             <p className="text-n-500 text-[10px] truncate mt-0.5">{user.email}</p>
//           </div>
//           <ChevronRight size={12} className="text-n-400 shrink-0" />
//         </div>

//         {/* Sign out */}
//         <button
//           onClick={() => { close(); navigate('/') }}
//           className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose hover:bg-rose/10 w-full transition-all"
//         >
//           <LogOut size={15} className="shrink-0" />
//           Sign Out
//         </button>
//       </div>
//     </div>
//   )
// }

// export default function Sidebar() {
//   const [open, setOpen] = useState(false)
//   const { pathname } = useLocation()

//   // Close mobile drawer on route change
//   const currentPage = NAV.find(n => n.to === pathname)

//   return (
//     <>
//       {/* ── Mobile topbar ── */}
//       <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-bg-card border-b border-bg-border flex items-center gap-4 px-4 shadow-card">
//         <button
//           onClick={() => setOpen(true)}
//           className="text-n-500 hover:text-n-900 transition-colors p-1"
//         >
//           <Menu size={20} />
//         </button>
//         <div className="flex items-center gap-2">
//           <div className="w-7 h-7 bg-gradient-to-br from-primary to-cyan rounded-lg flex items-center justify-center">
//             <Zap size={13} className="text-white" fill="white" />
//           </div>
//           <div>
//             <span className="font-bold text-n-900 text-sm">CP Tracker AI</span>
//             {currentPage && (
//               <span className="ml-2 text-n-500 text-xs">/ {currentPage.label}</span>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* ── Mobile drawer overlay ── */}
//       {open && (
//         <div className="lg:hidden fixed inset-0 z-50 flex">
//           <div
//             className="absolute inset-0 bg-black/60 backdrop-blur-sm"
//             onClick={() => setOpen(false)}
//           />
//           <div className="relative w-64 h-full shadow-xl">
//             <button
//               onClick={() => setOpen(false)}
//               className="absolute top-4 right-3 z-10 text-n-500 hover:text-n-900 p-1.5 bg-bg-hover rounded-lg transition-colors"
//             >
//               <X size={16} />
//             </button>
//             <NavContent onClose={() => setOpen(false)} />
//           </div>
//         </div>
//       )}

//       {/* ── Desktop sidebar ── */}
//       <aside className="hidden lg:block w-56 shrink-0 h-screen sticky top-0">
//         <NavContent />
//       </aside>
//     </>
//   )
// }

// import { Link, useLocation, useNavigate } from 'react-router-dom'
// import { useState } from 'react'
// import {
//   LayoutDashboard, Code2, StickyNote, BarChart3, Bot,
//   Users, Target, BookMarked, User, LogOut, RefreshCw,
//   Menu, X, Zap, ChevronRight
// } from 'lucide-react'
// import { useApp } from '../../context/AppContext'
// import { useAuth } from '../../context/AuthContext'

// const NAV = [
//   { to: '/dashboard',  label: 'Dashboard',  icon: LayoutDashboard },
//   { to: '/codeforces', label: 'Codeforces', icon: Code2 },
//   { to: '/leetcode',   label: 'LeetCode',   icon: StickyNote },
//   { to: '/analytics',  label: 'Analytics',  icon: BarChart3 },
//   { to: '/ai-coach',   label: 'AI Coach',   icon: Bot },
//   { to: '/compare',    label: 'Compare',    icon: Users },
//   { to: '/goals',      label: 'Goals',      icon: Target },
//   { to: '/notes',      label: 'Notes',      icon: BookMarked },
//   { to: '/profile',    label: 'Profile',    icon: User },
// ]

// function NavContent({ onClose }: { onClose?: () => void }) {
//   const { pathname } = useLocation()
//   const navigate = useNavigate()
//   const { setSidebarOpen } = useApp()
//   // ── Use real auth data ──────────────────────────────────────────────────
//   const { profile, user, signOut } = useAuth()

//   const displayName = profile?.display_name || user?.email?.split('@')[0] || 'User'
//   const displayEmail = profile?.email || user?.email || ''
//   const avatarLetter = displayName[0]?.toUpperCase() || 'U'

//   const close = () => { setSidebarOpen(false); onClose?.() }

//   const handleSignOut = async () => {
//     close()
//     await signOut()
//     navigate('/')
//   }

//   return (
//     <div className="flex flex-col h-full bg-[#0a1628] border-r border-white/[0.06]">
//       {/* Logo */}
//       <div className="px-4 py-4 border-b border-white/[0.06]">
//         <Link to="/dashboard" onClick={close} className="flex items-center gap-3 group">
//           <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/25 transition-all shrink-0">
//             <Zap size={17} className="text-white" fill="white" />
//           </div>
//           <div>
//             <p className="font-bold text-white text-sm leading-none tracking-tight">CP Tracker</p>
//             <p className="text-[10px] text-cyan-400 font-mono mt-0.5 tracking-widest">AI POWERED</p>
//           </div>
//         </Link>
//       </div>

//       {/* Nav links */}
//       <nav className="flex-1 px-2.5 py-3 space-y-0.5 overflow-y-auto">
//         {NAV.map(({ to, label, icon: Icon }) => {
//           const active = pathname === to
//           return (
//             <Link key={to} to={to} onClick={close}
//               className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
//                 active
//                   ? 'bg-blue-500/15 text-blue-400 border border-blue-500/25'
//                   : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
//               }`}>
//               <Icon size={15} className="shrink-0" />
//               <span>{label}</span>
//               {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400" />}
//             </Link>
//           )
//         })}
//       </nav>

//       {/* Bottom section */}
//       <div className="px-2.5 pb-4 pt-2.5 border-t border-white/[0.06] space-y-1">
//         <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/[0.05] w-full transition-all">
//           <RefreshCw size={15} className="shrink-0" />
//           Refresh Data
//         </button>

//         {/* ── Real user info from Supabase auth ── */}
//         <Link to="/profile" onClick={close}
//           className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.07] hover:bg-white/[0.07] transition-all group w-full">
//           <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow">
//             {avatarLetter}
//           </div>
//           <div className="flex-1 min-w-0">
//             <p className="text-white text-xs font-semibold truncate leading-none">{displayName}</p>
//             <p className="text-slate-500 text-[10px] truncate mt-0.5">{displayEmail}</p>
//           </div>
//           <ChevronRight size={12} className="text-slate-600 shrink-0 group-hover:text-slate-400 transition-colors" />
//         </Link>

//         <button onClick={handleSignOut}
//           className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 w-full transition-all">
//           <LogOut size={15} className="shrink-0" />
//           Sign Out
//         </button>
//       </div>
//     </div>
//   )
// }

// export default function Sidebar() {
//   const { sidebarOpen, setSidebarOpen } = useApp()
//   const { pathname } = useLocation()
//   const currentPage = NAV.find(n => n.to === pathname)

//   return (
//     <>
//       {/* Mobile topbar */}
//       <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-[#0a1628]/95 backdrop-blur-xl border-b border-white/[0.06] flex items-center gap-4 px-4">
//         <button onClick={() => setSidebarOpen(true)} className="text-slate-400 hover:text-white transition-colors p-1">
//           <Menu size={20} />
//         </button>
//         <div className="flex items-center gap-2">
//           <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow">
//             <Zap size={13} className="text-white" fill="white" />
//           </div>
//           <span className="font-bold text-white text-sm">CP Tracker AI</span>
//           {currentPage && <span className="text-slate-500 text-xs">/ {currentPage.label}</span>}
//         </div>
//       </div>

//       {/* Mobile overlay drawer */}
//       {sidebarOpen && (
//         <div className="lg:hidden fixed inset-0 z-50 flex">
//           <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
//           <div className="relative w-64 h-full shadow-2xl">
//             <button onClick={() => setSidebarOpen(false)}
//               className="absolute top-4 right-3 z-10 text-slate-400 hover:text-white p-1.5 bg-white/[0.05] rounded-lg transition-colors">
//               <X size={16} />
//             </button>
//             <NavContent onClose={() => setSidebarOpen(false)} />
//           </div>
//         </div>
//       )}

//       {/* Desktop sidebar */}
//       <aside className="hidden lg:block w-56 shrink-0 h-screen sticky top-0">
//         <NavContent />
//       </aside>
//     </>
//   )
// }



import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import {
  LayoutDashboard, Code2, StickyNote, BarChart3, Bot,
  Users, Target, BookMarked, User, LogOut, RefreshCw,
  Menu, X, Zap, ChevronRight, Sun, Moon
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'

const NAV = [
  { to: '/dashboard',  label: 'Dashboard',  icon: LayoutDashboard },
  { to: '/codeforces', label: 'Codeforces', icon: Code2 },
  { to: '/leetcode',   label: 'LeetCode',   icon: StickyNote },
  { to: '/analytics',  label: 'Analytics',  icon: BarChart3 },
  { to: '/ai-coach',   label: 'AI Coach',   icon: Bot },
  { to: '/compare',    label: 'Compare',    icon: Users },
  { to: '/goals',      label: 'Goals',      icon: Target },
  { to: '/notes',      label: 'Notes',      icon: BookMarked },
  { to: '/profile',    label: 'Profile',    icon: User },
]

function NavContent({ onClose }: { onClose?: () => void }) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { profile, user, signOut } = useAuth()
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'

  const displayName = profile?.display_name || user?.email?.split('@')[0] || 'User'
  const displayEmail = profile?.email || user?.email || ''
  const avatarLetter = displayName[0]?.toUpperCase() || 'U'

  const close = () => onClose?.()

  const handleSignOut = async () => {
    close()
    await signOut()
    navigate('/')
  }

  return (
    <div className="flex flex-col h-full transition-colors duration-300"
      style={{ background: 'var(--sidebar-bg)', borderRight: '1px solid var(--border)' }}>

      {/* Logo */}
      <div className="px-4 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
        <Link to="/dashboard" onClick={close} className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
            <Zap size={17} className="text-white" fill="white" />
          </div>
          <div>
            <p className="font-bold text-sm leading-none" style={{ color: 'var(--text-primary)' }}>CP Tracker</p>
            <p className="text-[10px] font-mono mt-0.5 tracking-widest" style={{ color: '#60a5fa' }}>AI POWERED</p>
          </div>
        </Link>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-2.5 py-3 space-y-0.5 overflow-y-auto">
        {NAV.map(({ to, label, icon: Icon }) => {
          const active = pathname === to
          return (
            <Link key={to} to={to} onClick={close}
              className={active ? 'nav-link nav-link-active' : 'nav-link'}>
              <Icon size={15} className="shrink-0" />
              <span>{label}</span>
              {active && <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: '#60a5fa' }} />}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="px-2.5 pb-4 pt-2.5 space-y-1" style={{ borderTop: '1px solid var(--border)' }}>

        {/* Theme toggle */}
        <button onClick={toggle}
          className="nav-link w-full justify-between"
          style={{ color: 'var(--text-muted)' }}>
          <div className="flex items-center gap-3">
            {isDark ? <Moon size={15} /> : <Sun size={15} />}
            <span>{isDark ? 'Dark Mode' : 'Light Mode'}</span>
          </div>
          <div className="theme-toggle" style={{ width: '40px', height: '22px' }}>
            <div className="theme-toggle-knob" style={{ width: '16px', height: '16px', fontSize: '9px' }}>
              {isDark ? '🌙' : '☀️'}
            </div>
          </div>
        </button>

        <button className="nav-link w-full" onClick={() => {}} style={{ color: 'var(--text-muted)' }}>
          <RefreshCw size={15} className="shrink-0" /> Refresh Data
        </button>

        {/* User chip */}
        <Link to="/profile" onClick={close}
          className="nav-link w-full"
          style={{ background: 'var(--bg-hover)', border: '1px solid var(--border)' }}>
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
            {avatarLetter}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate leading-none" style={{ color: 'var(--text-primary)' }}>{displayName}</p>
            <p className="text-[10px] truncate mt-0.5" style={{ color: 'var(--text-muted)' }}>{displayEmail}</p>
          </div>
          <ChevronRight size={12} style={{ color: 'var(--text-muted)' }} />
        </Link>

        <button onClick={handleSignOut} className="nav-link w-full" style={{ color: '#f87171' }}>
          <LogOut size={15} className="shrink-0" /> Sign Out
        </button>
      </div>
    </div>
  )
}

export default function Sidebar() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const currentPage = NAV.find(n => n.to === pathname)

  return (
    <>
      {/* Mobile topbar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 flex items-center gap-4 px-4 transition-colors"
        style={{ background: 'var(--sidebar-bg)', borderBottom: '1px solid var(--border)' }}>
        <button onClick={() => setOpen(true)} style={{ color: 'var(--text-muted)' }}>
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
            <Zap size={13} className="text-white" fill="white" />
          </div>
          <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>CP Tracker AI</span>
          {currentPage && <span className="text-xs" style={{ color: 'var(--text-muted)' }}>/ {currentPage.label}</span>}
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative w-64 h-full shadow-2xl">
            <button onClick={() => setOpen(false)}
              className="absolute top-4 right-3 z-10 p-1.5 rounded-lg transition-colors"
              style={{ background: 'var(--bg-hover)', color: 'var(--text-muted)' }}>
              <X size={16} />
            </button>
            <NavContent onClose={() => setOpen(false)} />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-56 shrink-0 h-screen sticky top-0">
        <NavContent />
      </aside>
    </>
  )
}
