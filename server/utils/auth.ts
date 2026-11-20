import type { H3Event } from 'h3'
import { useServerSupabase } from './supabase'

/**
 * Validates that the request has a valid authenticated Supabase session.
 * Throws 401 if not authenticated.
 */
export async function requireAdmin(event: H3Event): Promise<string> {
  const authHeader = getHeader(event, 'authorization') || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null

  const supabase = useServerSupabase()
  if (!supabase) {
    throw createError({ statusCode: 503, statusMessage: 'Database not configured' })
  }

  // For admin-action API routes we validate via Supabase getUser()
  if (token) {
    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (!error && user) {
      return user.id
    }
  }

  // Also try cookie-based session (SSR)
  const cookieHeader = getHeader(event, 'cookie') || ''
  const accessTokenMatch = cookieHeader.match(/sb-[^-]+-auth-token=([^;]+)/)
  if (accessTokenMatch) {
    try {
      const parsed = JSON.parse(decodeURIComponent(accessTokenMatch[1]))
      const sessionToken = Array.isArray(parsed) ? parsed[0] : parsed?.access_token
      if (sessionToken) {
        const { data: { user }, error } = await supabase.auth.getUser(sessionToken)
        if (!error && user) {
          return user.id
        }
      }
    } catch {
      // Cookie parse failed
    }
  }

  throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
}
