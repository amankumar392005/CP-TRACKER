// import { createContext, useContext, useState, type ReactNode } from 'react';

// interface User {
//   name: string;
//   email: string;
//   avatar: string;
//   cfHandle: string;
//   lcHandle: string;
// }

// interface AppCtx {
//   user: User;
//   setUser: (u: Partial<User>) => void;
//   sidebarOpen: boolean;
//   setSidebarOpen: (v: boolean) => void;
// }

// const Ctx = createContext<AppCtx | null>(null);

// const DEFAULT_USER: User = {
//   name: 'Rahul Sharma',
//   email: 'rahul@example.com',
//   avatar: '',
//   cfHandle: 'tourist',
//   lcHandle: 'neal_wu',
// };

// export function AppProvider({ children }: { children: ReactNode }) {
//   const [user, setUserState] = useState<User>(DEFAULT_USER);
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   const setUser = (u: Partial<User>) => setUserState(prev => ({ ...prev, ...u }));

//   return (
//     <Ctx.Provider value={{ user, setUser, sidebarOpen, setSidebarOpen }}>
//       {children}
//     </Ctx.Provider>
//   );
// }

// export function useApp() {
//   const ctx = useContext(Ctx);
//   if (!ctx) throw new Error('useApp must be inside AppProvider');
//   return ctx;
// }




// AppContext only manages sidebar state now.
// All user data comes from AuthContext (real Supabase auth).
import { createContext, useContext, useState, type ReactNode } from 'react'

interface AppCtx {
  sidebarOpen: boolean
  setSidebarOpen: (v: boolean) => void
}

const Ctx = createContext<AppCtx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  return (
    <Ctx.Provider value={{ sidebarOpen, setSidebarOpen }}>
      {children}
    </Ctx.Provider>
  )
}

export function useApp() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useApp must be inside AppProvider')
  return ctx
}