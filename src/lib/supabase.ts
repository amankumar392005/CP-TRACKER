import { createClient } from '@supabase/supabase-js'

const url  = import.meta.env.VITE_SUPABASE_URL  as string
const key  = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!url || url.includes('your-project'))  console.warn('⚠ Set VITE_SUPABASE_URL in .env')
if (!key || key.includes('your-anon'))     console.warn('⚠ Set VITE_SUPABASE_ANON_KEY in .env')

export const supabase = createClient(url, key)

export type { User, Session } from '@supabase/supabase-js'
