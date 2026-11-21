import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let serverClientInstance: SupabaseClient | null = null

export function useServerSupabase(): SupabaseClient | null {
  const config = useRuntimeConfig()
  const url = config.public.supabaseUrl as string
  const serviceRoleKey = config.supabaseServiceRoleKey as string
  const anonKey = config.public.supabaseKey as string

  // Use service role key if available on server, otherwise fallback to anon
  const rawKey = (serviceRoleKey || anonKey || '').trim()
  const rawUrl = (url || '').trim()

  if (!rawUrl || !rawKey) {
    return null
  }

  // Guard against accidental multi-line or command-paste in environment variables
  if (rawKey.includes('\n') || rawKey.includes('\r') || !rawUrl.startsWith('http')) {
    console.error('[Supabase Server Error] Invalid SUPABASE_KEY or SUPABASE_URL configured in environment variables. Key contains newlines or command strings.')
    return null
  }

  if (!serverClientInstance) {
    serverClientInstance = createClient(rawUrl, rawKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    })
  }

  return serverClientInstance
}
