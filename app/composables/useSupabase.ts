import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let clientInstance: SupabaseClient | null = null

export function useSupabase(): SupabaseClient | null {
  const config = useRuntimeConfig()
  const url = config.public.supabaseUrl as string
  const key = config.public.supabaseKey as string

  if (!url || !key) {
    return null
  }

  if (!clientInstance) {
    clientInstance = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  }

  return clientInstance
}
