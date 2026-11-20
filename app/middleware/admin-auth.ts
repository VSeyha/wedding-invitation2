export default defineNuxtRouteMiddleware(async (to) => {
  // Allow login page access
  if (to.path === '/admin/login') {
    return
  }

  // Only protect admin routes
  if (!to.path.startsWith('/admin')) {
    return
  }

  const supabase = useSupabase()

  // If Supabase is not configured yet (e.g. initial dev setup without env), allow graceful login access
  if (!supabase) {
    return
  }

  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return navigateTo({
        path: '/admin/login',
        query: { redirect: to.fullPath }
      })
    }
  } catch (error) {
    console.error('Auth verification error:', error)
    return navigateTo('/admin/login')
  }
})
