
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: { DEFAULT:'#060d1f', card:'#0d1829', hover:'#112039', border:'#1a2d4a', muted:'#1e3254' },
        primary: { DEFAULT:'#3b82f6', dark:'#2563eb', light:'#60a5fa', muted:'#1d3a6e' },
        cyan: { DEFAULT:'#06b6d4', dark:'#0891b2', light:'#22d3ee', muted:'#0c3d4a' },
        green: { DEFAULT:'#10b981', light:'#34d399', muted:'#064e3b' },
        amber: { DEFAULT:'#f59e0b', light:'#fcd34d', muted:'#451a03' },
        rose: { DEFAULT:'#f43f5e', light:'#fb7185', muted:'#4c0519' },
        purple: { DEFAULT:'#a855f7', light:'#c084fc', muted:'#3b0764' },
        n: { 900:'#f9fafb', 800:'#f3f4f6', 700:'#d1d5db', 600:'#9ca3af', 500:'#6b7280', 400:'#4b5563', 300:'#374151', 200:'#1f2937', 100:'#111827' },
      },
      fontFamily: { sans:['Inter','system-ui','sans-serif'], mono:['JetBrains Mono','monospace'] },
      boxShadow: { card:'0 4px 24px rgba(0,0,0,0.4)', glow:'0 0 20px rgba(59,130,246,0.25)', 'glow-sm':'0 0 10px rgba(59,130,246,0.2)' },
      animation: { 'fade-in':'fadeIn 0.4s ease forwards', 'slide-up':'slideUp 0.4s ease forwards', 'pulse-slow':'pulse 3s ease-in-out infinite' },
      keyframes: {
        fadeIn:{ from:{opacity:'0'}, to:{opacity:'1'} },
        slideUp:{ from:{opacity:'0',transform:'translateY(16px)'}, to:{opacity:'1',transform:'translateY(0)'} }
      },
    },
  },
  plugins: [],
}
