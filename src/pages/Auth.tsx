import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Loader2, Zap, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  )
}

export default function AuthPage() {
  const { signIn, signUp, signInWithGoogle } = useAuth()
  const [tab, setTab]         = useState<'signin'|'signup'>('signin')
  const [name, setName]       = useState('')
  const [email, setEmail]     = useState('')
  const [pwd, setPwd]         = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [gLoading, setGLoading] = useState(false)
  const [error, setError]     = useState('')
  const [info, setInfo]       = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(''); setInfo('')
    if (!email || !pwd) { setError('Please fill all fields.'); return }
    if (tab === 'signup' && !name) { setError('Please enter your name.'); return }
    if (pwd.length < 6) { setError('Password must be at least 6 characters.'); return }

    setLoading(true)
    try {
      if (tab === 'signup') {
        await signUp(email, pwd, name)
        setInfo('Account created! Check your email to confirm, then sign in.')
        setTab('signin')
        setName(''); setPwd('')
      } else {
        await signIn(email, pwd)
        // AuthContext + ProtectedLayout handles redirect automatically
      }
    } catch (err: any) {
      setError(err.message ?? 'Authentication failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setError('')
    setGLoading(true)
    try {
      await signInWithGoogle()
      // Browser redirects to Google then back — page unmounts here
    } catch (err: any) {
      setError(err.message ?? 'Google sign-in failed.')
      setGLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/8 rounded-full blur-3xl pointer-events-none"/>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-cyan/6 rounded-full blur-3xl pointer-events-none"/>

      <div className="w-full max-w-md animate-slide-up">
        {/* Logo */}
        <Link to="/" className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-primary to-cyan rounded-2xl flex items-center justify-center shadow-glow mb-3">
            <Zap size={26} className="text-inherit" fill="white"/>
          </div>
          <h1 className="text-2xl font-black text-n-900">CP Tracker AI</h1>
          <p className="text-n-500 text-sm mt-1">Competitive Programming Analytics & AI Coaching</p>
        </Link>

        <div className="card-p">
          {/* Tab switcher */}
          <div className="flex bg-bg-hover rounded-xl p-1 mb-5">
            {(['signin','signup'] as const).map(t => (
              <button key={t} onClick={() => { setTab(t); setError(''); setInfo('') }}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${tab===t?'bg-primary text-inherit shadow-glow-sm':'text-n-500 hover:text-n-800'}`}>
                {t==='signin'?'Sign In':'Sign Up'}
              </button>
            ))}
          </div>

          {/* Google button */}
          <button onClick={handleGoogle} disabled={loading||gLoading}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-800 font-semibold px-5 py-3 rounded-xl border border-gray-200 shadow-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed mb-4 text-sm">
            {gLoading ? <Loader2 size={18} className="animate-spin text-gray-400"/> : <GoogleIcon/>}
            {gLoading ? 'Redirecting to Google…' : 'Continue with Google'}
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-bg-border"/>
            <span className="text-n-500 text-xs">or with email</span>
            <div className="flex-1 h-px bg-bg-border"/>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {tab==='signup' && (
              <div className="relative">
                <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-n-500 pointer-events-none"/>
                <input value={name} onChange={e=>setName(e.target.value)}
                  placeholder="Your name" className="input pl-9" autoComplete="name"/>
              </div>
            )}
            <div className="relative">
              <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-n-500 pointer-events-none"/>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
                placeholder="Email address" className="input pl-9" autoComplete="email"/>
            </div>
            <div className="relative">
              <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-n-500 pointer-events-none"/>
              <input type={showPwd?'text':'password'} value={pwd} onChange={e=>setPwd(e.target.value)}
                placeholder="Password (min 6 chars)" className="input pl-9 pr-10"
                autoComplete={tab==='signup'?'new-password':'current-password'}/>
              <button type="button" onClick={()=>setShowPwd(v=>!v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-n-500 hover:text-n-800">
                {showPwd?<EyeOff size={14}/>:<Eye size={14}/>}
              </button>
            </div>

            {error && (
              <div className="flex items-start gap-2 bg-rose/10 border border-rose/20 rounded-xl px-4 py-3 text-rose text-sm">
                <AlertCircle size={14} className="mt-0.5 shrink-0"/>
                <span>{error}</span>
              </div>
            )}
            {info && (
              <div className="flex items-start gap-2 bg-green/10 border border-green/20 rounded-xl px-4 py-3 text-green-light text-sm">
                <CheckCircle2 size={14} className="mt-0.5 shrink-0"/>
                <span>{info}</span>
              </div>
            )}

            <button type="submit" disabled={loading||gLoading} className="btn-primary w-full justify-center py-3 mt-1">
              {loading ? <Loader2 size={16} className="animate-spin"/> : <ArrowRight size={16}/>}
              {tab==='signin'?'Sign In':'Create Account'}
            </button>
          </form>

          <p className="text-center text-n-500 text-xs mt-5">
            🔒 Secured with Supabase · Row-Level Security · Your data is private
          </p>
        </div>
      </div>
    </div>
  )
}
