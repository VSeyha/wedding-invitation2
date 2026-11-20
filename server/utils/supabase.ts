import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let serverClientInstance: SupabaseClient | null = null

export function useServerSupabase(): SupabaseClient | null {
  const config = useRuntimeConfig()
  const url = config.public.supabaseUrl as string
  const serviceRoleKey = config.supabaseServiceRoleKey as string
  const anonKey = config.public.supabaseKey as string

  // Use service role key if available on server, otherwise fallback to anon
  const key = serviceRoleKey || anonKey

  if (!url || !key) {
    return null
  }

  if (!serverClientInstance) {
    serverClientInstance = createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    })
  }

  return serverClientInstance
}
