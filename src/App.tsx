// import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom'
// import { AppProvider } from './context/AppContext'
// import { AuthProvider, useAuth } from './context/AuthContext'
// import Sidebar from './components/layout/Sidebar'
// import Landing from './pages/Landing'
// import AuthPage from './pages/Auth'
// import Dashboard from './pages/Dashboard'
// import CodeforcesPage from './pages/CodeforcesPage'
// import LeetCodePage from './pages/LeetCodePage'
// import ProfilePage from './pages/ProfilePage'
// import { AnalyticsPage, AICoachPage, ComparePage, GoalsPage, NotesPage } from './pages/OtherPages'
// import { Zap } from 'lucide-react'

// // ── Full-screen loading spinner ────────────────────────────────────────────
// function Loading() {
//   return (
//     <div className="min-h-screen bg-bg flex items-center justify-center">
//       <div className="flex flex-col items-center gap-4">
//         <div className="w-14 h-14 bg-gradient-to-br from-primary to-cyan rounded-2xl flex items-center justify-center shadow-glow animate-pulse-slow">
//           <Zap size={26} className="text-white" fill="white" />
//         </div>
//         <div className="flex gap-1.5">
//           {[0,1,2].map(i => (
//             <div key={i} className="w-2 h-2 bg-primary rounded-full animate-bounce"
//               style={{ animationDelay: `${i * 0.15}s` }} />
//           ))}
//         </div>
//         <p className="text-n-500 text-sm">Loading CP Tracker AI…</p>
//       </div>
//     </div>
//   )
// }

// // ── Protected route — redirect to /auth if not logged in ──────────────────
// function ProtectedLayout() {
//   const { user, loading } = useAuth()
//   const location = useLocation()

//   if (loading) return <Loading />
//   if (!user) return <Navigate to="/auth" state={{ from: location }} replace />

//   return (
//     <div className="flex h-screen overflow-hidden bg-bg">
//       <Sidebar />
//       <main className="flex-1 overflow-y-auto lg:pt-0 pt-14">
//         <Outlet />
//       </main>
//     </div>
//   )
// }

// // ── Public route — redirect to /dashboard if already logged in ────────────
// function PublicRoute({ children }: { children: React.ReactNode }) {
//   const { user, loading } = useAuth()
//   if (loading) return <Loading />
//   if (user) return <Navigate to="/dashboard" replace />
//   return <>{children}</>
// }

// function AppRoutes() {
//   return (
//     <Routes>
//       {/* Landing always visible */}
//       <Route path="/" element={<Landing />} />

//       {/* Auth — redirect away if already logged in */}
//       <Route path="/auth" element={
//         <PublicRoute><AuthPage /></PublicRoute>
//       } />

//       {/* Protected app pages */}
//       <Route element={<ProtectedLayout />}>
//         <Route path="/dashboard"  element={<Dashboard />} />
//         <Route path="/codeforces" element={<CodeforcesPage />} />
//         <Route path="/leetcode"   element={<LeetCodePage />} />
//         <Route path="/analytics"  element={<AnalyticsPage />} />
//         <Route path="/ai-coach"   element={<AICoachPage />} />
//         <Route path="/compare"    element={<ComparePage />} />
//         <Route path="/goals"      element={<GoalsPage />} />
//         <Route path="/notes"      element={<NotesPage />} />
//         <Route path="/profile"    element={<ProfilePage />} />
//       </Route>

//       <Route path="*" element={<Navigate to="/" replace />} />
//     </Routes>
//   )
// }

// export default function App() {
//   return (
//     <BrowserRouter>
//       <AuthProvider>
//         <AppProvider>
//           <AppRoutes />
//         </AppProvider>
//       </AuthProvider>
//     </BrowserRouter>
//   )
// }


import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import Sidebar from './components/layout/Sidebar'
import Landing from './pages/Landing'
import AuthPage from './pages/Auth'
import Dashboard from './pages/Dashboard'
import CodeforcesPage from './pages/CodeforcesPage'
import LeetCodePage from './pages/LeetCodePage'
import ProfilePage from './pages/ProfilePage'
import { AnalyticsPage, AICoachPage, ComparePage, GoalsPage, NotesPage } from './pages/OtherPages'
import { Zap } from 'lucide-react'

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-base)' }}>
      <div className="flex flex-col items-center gap-5">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
            <Zap size={28} className="text-white" fill="white" />
          </div>
          <div className="absolute inset-0 rounded-2xl animate-ping opacity-20"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }} />
        </div>
        <div className="flex gap-1.5">
          {[0, 1, 2].map(i => (
            <div key={i} className="w-2 h-2 rounded-full animate-bounce"
              style={{ backgroundColor: '#3b82f6', animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
        <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Loading CP Tracker AI…</p>
      </div>
    </div>
  )
}

function ProtectedLayout() {
  const { user, loading } = useAuth()
  const location = useLocation()
  if (loading) return <Loading />
  if (!user) return <Navigate to="/auth" state={{ from: location }} replace />
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-base)' }}>
      <Sidebar />
      <main className="flex-1 overflow-y-auto lg:pt-0 pt-14">
        <Outlet />
      </main>
    </div>
  )
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <Loading />
  if (user) return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<PublicRoute><AuthPage /></PublicRoute>} />
      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard"  element={<Dashboard />} />
        <Route path="/codeforces" element={<CodeforcesPage />} />
        <Route path="/leetcode"   element={<LeetCodePage />} />
        <Route path="/analytics"  element={<AnalyticsPage />} />
        <Route path="/ai-coach"   element={<AICoachPage />} />
        <Route path="/compare"    element={<ComparePage />} />
        <Route path="/goals"      element={<GoalsPage />} />
        <Route path="/notes"      element={<NotesPage />} />
        <Route path="/profile"    element={<ProfilePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppProvider>
            <AppRoutes />
          </AppProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
