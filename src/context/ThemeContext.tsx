
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

type Theme = 'dark' | 'light'
interface ThemeCtx { theme: Theme; toggle: () => void; setTheme: (t: Theme) => void }
const Ctx = createContext<ThemeCtx | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('cp-theme') as Theme | null
    if (saved) return saved
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('dark', 'light')
    root.classList.add(theme)
    root.setAttribute('data-theme', theme)
    localStorage.setItem('cp-theme', theme)
  }, [theme])

  const toggle = () => setThemeState(t => t === 'dark' ? 'light' : 'dark')
  const setTheme = (t: Theme) => setThemeState(t)

  return <Ctx.Provider value={{ theme, toggle, setTheme }}>{children}</Ctx.Provider>
}

export function useTheme() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useTheme must be inside ThemeProvider')
  return ctx
}
