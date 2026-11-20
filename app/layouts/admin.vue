<template>
  <div class="min-h-screen bg-[#FDFBF7] text-[#3C2925] flex flex-col md:flex-row">
    <!-- Mobile Header -->
    <header class="md:hidden flex items-center justify-between px-4 py-3 bg-[#641D2D] text-[#F7F0E3] border-b border-[#C9A24A]/40 sticky top-0 z-50">
      <div class="flex items-center gap-2">
        <span class="text-xl">⚜️</span>
        <h1 class="font-bold text-sm tracking-wide">{{ t('admin.title') }}</h1>
      </div>
      <div class="flex items-center gap-2">
        <button
          @click="toggleLocale"
          class="px-2 py-1 text-xs rounded border border-[#C9A24A]/50 text-[#F7F0E3]"
        >
          {{ isKhmer ? 'EN' : 'ខ្មែរ' }}
        </button>
        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="p-1 rounded text-[#F7F0E3] hover:text-[#C9A24A]"
          aria-label="Toggle Navigation"
        >
          <span class="text-xl">☰</span>
        </button>
      </div>
    </header>

    <!-- Sidebar Navigation -->
    <aside
      :class="[
        mobileMenuOpen ? 'block' : 'hidden',
        'md:block w-full md:w-64 bg-[#641D2D] text-[#F7F0E3] flex-shrink-0 border-r border-[#C9A24A]/30 flex flex-col justify-between p-4 z-40'
      ]"
    >
      <div>
        <!-- Logo / Title -->
        <div class="hidden md:flex items-center gap-3 px-2 py-4 border-b border-[#C9A24A]/30 mb-4">
          <div class="w-10 h-10 rounded-full bg-[#C9A24A]/20 border border-[#C9A24A] flex items-center justify-center text-xl">
            ⚜️
          </div>
          <div>
            <h2 class="font-bold text-sm leading-tight text-[#E5C77A]">{{ t('admin.title') }}</h2>
            <p class="text-[11px] text-[#F7F0E3]/70">Admin Management</p>
          </div>
        </div>

        <!-- Nav Links -->
        <nav class="space-y-1">
          <NuxtLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            @click="mobileMenuOpen = false"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-[#C9A24A]/20 hover:text-[#E5C77A]"
            active-class="bg-[#C9A24A]/30 text-[#E5C77A] font-semibold border-l-4 border-[#C9A24A]"
          >
            <span>{{ item.icon }}</span>
            <span>{{ t(item.labelKey) }}</span>
          </NuxtLink>
        </nav>
      </div>

      <!-- Footer Info / Language Toggle / Logout -->
      <div class="pt-4 border-t border-[#C9A24A]/30 space-y-2">
        <div class="hidden md:flex items-center justify-between px-2 py-1 text-xs text-[#F7F0E3]/80">
          <span>{{ t('common.language') }}:</span>
          <button
            @click="toggleLocale"
            class="px-2 py-0.5 rounded border border-[#C9A24A]/40 hover:bg-[#C9A24A]/20 text-[#E5C77A]"
          >
            {{ isKhmer ? 'English' : 'ភាសាខ្មែរ' }}
          </button>
        </div>

        <button
          @click="handleLogout"
          class="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium rounded-lg bg-red-950/60 hover:bg-red-900 border border-red-500/30 text-red-200 transition-colors"
        >
          <span>🚪</span>
          <span>{{ t('admin.logout') }}</span>
        </button>
      </div>
    </aside>

    <!-- Main Content Area -->
    <main class="flex-1 min-w-0 p-4 md:p-8">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const { t, isKhmer, toggleLocale } = useLocale()
const mobileMenuOpen = ref(false)
const supabase = useSupabase()

const navItems = [
  { path: '/admin', labelKey: 'admin.dashboard', icon: '📊' },
  { path: '/admin/guests', labelKey: 'admin.guests', icon: '👥' },
  { path: '/admin/invitations', labelKey: 'admin.invitations', icon: '💌' },
  { path: '/admin/rsvps', labelKey: 'admin.rsvps', icon: '📝' },
  { path: '/admin/programmes', labelKey: 'admin.programmes', icon: '📅' },
  { path: '/admin/gallery', labelKey: 'admin.gallery', icon: '🖼️' },
  { path: '/admin/settings', labelKey: 'admin.settings', icon: '⚙️' },
  { path: '/admin/appearance', labelKey: 'admin.appearance', icon: '🎨' }
]

const handleLogout = async () => {
  if (supabase) {
    await supabase.auth.signOut()
  }
  await navigateTo('/admin/login')
}
</script>
