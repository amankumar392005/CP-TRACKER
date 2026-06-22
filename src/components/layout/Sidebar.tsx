import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import {
  LayoutDashboard, Code2, StickyNote, BarChart3, Bot,
  Users, Target, BookMarked, User, LogOut,
  Menu, X, Zap, ChevronRight, Sun, Moon, Sparkles
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'

const NAV = [
  { to: '/dashboard',  label: 'Dashboard',  icon: LayoutDashboard, group: 'main' },
  { to: '/codeforces', label: 'Codeforces', icon: Code2, group: 'platforms' },
  { to: '/leetcode',   label: 'LeetCode',   icon: StickyNote, group: 'platforms' },
  { to: '/analytics',  label: 'Analytics',  icon: BarChart3, group: 'insights' },
  { to: '/ai-coach',   label: 'AI Coach',   icon: Bot, group: 'insights', badge: 'AI' },
  { to: '/compare',    label: 'Compare',    icon: Users, group: 'insights' },
  { to: '/goals',      label: 'Goals',      icon: Target, group: 'personal' },
  { to: '/notes',      label: 'Notes',      icon: BookMarked, group: 'personal' },
  { to: '/profile',    label: 'Profile',    icon: User, group: 'personal' },
]

const GROUP_LABELS: Record<string, string> = {
  main: '',
  platforms: 'Platforms',
  insights: 'Insights',
  personal: 'Personal',
}

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

  // Group nav items
  const groups = ['main', 'platforms', 'insights', 'personal']

  return (
    <div className="flex flex-col h-full"
      style={{ background: 'var(--sidebar-bg)', borderRight: '1px solid var(--border)' }}>

      {/* ── Logo ── */}
      <div className="px-4 py-5" style={{ borderBottom: '1px solid var(--border)' }}>
        <Link to="/dashboard" onClick={close} className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-lg"
            style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' }}>
            <Zap size={17} className="text-white" fill="white" />
          </div>
          <div>
            <p className="font-extrabold text-sm leading-none tracking-tight" style={{ color: 'var(--text-primary)' }}>
              CP Tracker
            </p>
            <p className="text-[10px] font-mono mt-0.5 tracking-widest" style={{ color: '#818cf8' }}>
              AI POWERED
            </p>
          </div>
        </Link>
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 px-2.5 py-3 overflow-y-auto">
        {groups.map(group => {
          const items = NAV.filter(n => n.group === group)
          const groupLabel = GROUP_LABELS[group]
          return (
            <div key={group} className={group !== 'main' ? 'mt-5' : ''}>
              {groupLabel && (
                <p className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-widest"
                  style={{ color: 'var(--text-muted)' }}>
                  {groupLabel}
                </p>
              )}
              <div className="space-y-0.5">
                {items.map(({ to, label, icon: Icon, badge }) => {
                  const active = pathname === to
                  return (
                    <Link key={to} to={to} onClick={close}
                      className={active ? 'nav-link nav-link-active' : 'nav-link'}>
                      <Icon size={15} className="shrink-0" />
                      <span className="flex-1">{label}</span>
                      {badge && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md"
                          style={{ background: 'rgba(129,140,248,0.18)', color: '#a5b4fc', border: '1px solid rgba(129,140,248,0.2)' }}>
                          {badge}
                        </span>
                      )}
                      {active && !badge && (
                        <div className="w-1.5 h-1.5 rounded-full ml-auto" style={{ background: 'var(--accent)' }} />
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          )
        })}
      </nav>

      {/* ── Bottom ── */}
      <div className="px-2.5 pb-4 pt-3 space-y-1.5" style={{ borderTop: '1px solid var(--border)' }}>

        {/* Theme toggle */}
        <button onClick={toggle}
          className="nav-link w-full justify-between"
          style={{ cursor: 'pointer' }}>
          <div className="flex items-center gap-3">
            {isDark ? <Moon size={14} /> : <Sun size={14} />}
            <span>{isDark ? 'Dark Mode' : 'Light Mode'}</span>
          </div>
          {/* Mini toggle switch */}
          <div className="relative w-9 h-5 rounded-full flex items-center px-0.5 transition-all"
            style={{ background: isDark ? 'rgba(59,130,246,0.25)' : 'rgba(251,191,36,0.25)', border: '1px solid var(--border)' }}>
            <div className="w-4 h-4 rounded-full transition-all flex items-center justify-center text-[9px]"
              style={{
                background: isDark ? '#1e3a5f' : '#fbbf24',
                transform: isDark ? 'translateX(0)' : 'translateX(16px)',
              }}>
              {isDark ? '🌙' : '☀️'}
            </div>
          </div>
        </button>

        {/* User chip */}
        <Link to="/profile" onClick={close}
          className="nav-link w-full"
          style={{ background: 'var(--bg-hover)', border: '1px solid var(--border)' }}>
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
            {avatarLetter}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate leading-none" style={{ color: 'var(--text-primary)' }}>{displayName}</p>
            <p className="text-[10px] truncate mt-0.5" style={{ color: 'var(--text-muted)' }}>{displayEmail}</p>
          </div>
          <ChevronRight size={12} style={{ color: 'var(--text-muted)' }} />
        </Link>

        <button onClick={handleSignOut}
          className="nav-link w-full"
          style={{ color: '#f87171' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(248,113,113,0.08)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
          <LogOut size={14} className="shrink-0" />
          <span>Sign Out</span>
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
      {/* ── Mobile topbar ── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 flex items-center gap-4 px-4"
        style={{ background: 'var(--sidebar-bg)', borderBottom: '1px solid var(--border)', backdropFilter: 'blur(12px)' }}>
        <button onClick={() => setOpen(true)} style={{ color: 'var(--text-muted)' }}>
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center shadow"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
            <Zap size={13} className="text-white" fill="white" />
          </div>
          <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>CP Tracker AI</span>
          {currentPage && (
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>/ {currentPage.label}</span>
          )}
        </div>
      </div>

      {/* ── Mobile drawer ── */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" onClick={() => setOpen(false)} />
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

      {/* ── Desktop sidebar ── */}
      <aside className="hidden lg:block w-58 shrink-0 h-screen sticky top-0" style={{ width: '228px' }}>
        <NavContent />
      </aside>
    </>
  )
}
