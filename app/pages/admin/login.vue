<template>
  <div class="min-h-screen bg-[#641D2D] flex items-center justify-center p-4">
    <div class="max-w-md w-full bg-[#FAF5EE] rounded-2xl p-8 border-2 border-[#C9A24A] shadow-gold-glow-lg text-[#3C2925]">
      <div class="text-center mb-6">
        <div class="text-4xl mb-2">⚜️</div>
        <h1 class="text-2xl font-bold font-khmer-heading text-[#641D2D] mb-1">
          ចូលប្រព័ន្ធគ្រប់គ្រង
        </h1>
        <p class="text-sm font-en-heading text-[#C9A24A] font-semibold">
          Admin Portal Sign In
        </p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold mb-1 uppercase tracking-wider text-[#3C2925]/80">
            Email
          </label>
          <input
            v-model="email"
            type="email"
            required
            class="w-full px-3 py-2 rounded-lg border border-[#C9A24A]/40 bg-white focus:outline-none focus:ring-2 focus:ring-[#641D2D]"
            placeholder="admin@wedding.com"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold mb-1 uppercase tracking-wider text-[#3C2925]/80">
            Password
          </label>
          <input
            v-model="password"
            type="password"
            required
            class="w-full px-3 py-2 rounded-lg border border-[#C9A24A]/40 bg-white focus:outline-none focus:ring-2 focus:ring-[#641D2D]"
            placeholder="••••••••"
          />
        </div>

        <div v-if="errorMessage" class="p-3 rounded-lg bg-red-100 text-red-700 text-xs">
          {{ errorMessage }}
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full py-2.5 rounded-xl bg-[#641D2D] hover:bg-[#7D2438] text-[#F7F0E3] font-medium shadow transition-all disabled:opacity-50"
        >
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')
const supabase = useSupabase()
const route = useRoute()

const handleLogin = async () => {
  if (!supabase) {
    errorMessage.value = 'Supabase credentials are not configured yet in .env.'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value
    })

    if (error) {
      errorMessage.value = error.message
    } else {
      const redirect = (route.query.redirect as string) || '/admin'
      await navigateTo(redirect)
    }
  } catch (err: any) {
    errorMessage.value = err.message || 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>
