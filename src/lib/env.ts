const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Variabili d\'ambiente mancanti: VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY (vedi .env.example).',
  )
}

export const env = {
  supabaseUrl,
  supabaseAnonKey,
}
