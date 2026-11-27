<template>
  <div class="min-h-screen bg-[#FDFBF7] text-[#3C2925] flex flex-col md:flex-row antialiased">
    <!-- Mobile Top Navigation Header -->
    <header class="md:hidden flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#4A111E] to-[#641D2D] text-[#F7F0E3] border-b border-[#C9A24A]/40 sticky top-0 z-40 shadow-md">
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-full bg-[#C9A24A]/20 border border-[#C9A24A] flex items-center justify-center text-sm shadow-inner text-[#E5C77A]">
          <Crown class="w-4 h-4" />
        </div>
        <div>
          <h1 class="font-bold text-xs leading-tight tracking-wide text-[#E5C77A]">{{ t('admin.title') }}</h1>
          <p class="text-[10px] text-[#F7F0E3]/70 font-mono truncate max-w-[150px]">{{ coupleLabel }}</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button
          @click="toggleLocale"
          type="button"
          class="px-2 py-1 text-xs rounded border border-[#C9A24A]/50 text-[#E5C77A] hover:bg-[#C9A24A]/20 transition-colors font-medium"
        >
          {{ isKhmer ? 'English' : 'ខ្មែរ' }}
        </button>
        <button
          @click="mobileDrawerOpen = true"
          type="button"
          class="p-1.5 rounded-lg text-[#F7F0E3] hover:text-[#C9A24A] hover:bg-white/10 transition-colors"
          aria-label="Open Navigation Menu"
        >
          <Menu class="w-6 h-6" />
        </button>
      </div>
    </header>

    <!-- Mobile Slide-over Drawer Backdrop -->
    <Transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="mobileDrawerOpen"
        class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
        @click="mobileDrawerOpen = false"
      ></div>
    </Transition>

    <!-- Sidebar Navigation (Desktop Fixed / Mobile Slide-over) -->
    <aside
      :class="[
        // Mobile drawer classes
        mobileDrawerOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        // Desktop collapse width classes
        isCollapsed ? 'md:w-20' : 'md:w-68',
        'fixed md:sticky top-0 left-0 h-screen bg-gradient-to-b from-[#4A111E] via-[#641D2D] to-[#3B0E17] text-[#F7F0E3] flex-shrink-0 border-r border-[#C9A24A]/30 flex flex-col justify-between z-50 transition-all duration-300 shadow-xl overflow-hidden'
      ]"
    >
      <!-- Background Decorative Subtle Glow -->
      <div class="absolute -top-20 -left-20 w-48 h-48 bg-[#C9A24A]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-20 -right-20 w-48 h-48 bg-[#C9A24A]/10 rounded-full blur-3xl pointer-events-none"></div>

      <!-- Top Section: Header & Nav -->
      <div class="flex-1 overflow-y-auto px-3 py-4 relative z-10 scrollbar-none">
        <!-- Sidebar Brand Header -->
        <div class="flex items-center justify-between pb-4 mb-4 border-b border-[#C9A24A]/25">
          <div class="flex items-center gap-3 overflow-hidden">
            <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#E5C77A] via-[#C9A24A] to-[#8F6B1E] flex items-center justify-center shadow-gold-glow flex-shrink-0 text-[#641D2D]">
              <Crown class="w-5 h-5 fill-[#641D2D]/20" />
            </div>
            <div v-if="!isCollapsed" class="min-w-0 transition-opacity duration-200">
              <h2 class="font-bold text-sm leading-tight text-[#E5C77A] truncate font-khmer-heading">
                {{ t('admin.title') }}
              </h2>
              <p class="text-[11px] text-[#F7F0E3]/70 truncate font-mono">{{ coupleLabel }}</p>
            </div>
          </div>

          <!-- Mobile Close Button (✕) -->
          <button
            @click="mobileDrawerOpen = false"
            class="md:hidden p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
            aria-label="Close Navigation"
          >
            <X class="w-5 h-5" />
          </button>

          <!-- Desktop Collapse Button -->
          <button
            @click="isCollapsed = !isCollapsed"
            type="button"
            class="hidden md:flex items-center justify-center w-7 h-7 rounded-lg text-white/60 hover:text-[#E5C77A] hover:bg-white/10 transition-colors"
            :title="isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'"
          >
            <ChevronLeft v-if="!isCollapsed" class="w-4 h-4" />
            <ChevronRight v-else class="w-4 h-4" />
          </button>
        </div>

        <!-- Categorized Navigation Groups -->
        <div class="space-y-5">
          <div v-for="group in navGroups" :key="group.title">
            <!-- Group Header (Hidden in collapsed mode) -->
            <div
              v-if="!isCollapsed"
              class="px-2.5 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-[#E5C77A]/60 flex items-center gap-1.5"
            >
              <component :is="group.headerIcon" class="w-3 h-3 text-[#E5C77A]/70" />
              <span>{{ isKhmer ? group.title_km : group.title_en }}</span>
            </div>
            <div v-else class="w-6 h-px bg-[#C9A24A]/20 mx-auto my-2"></div>

            <!-- Nav Links in Group -->
            <nav class="space-y-1">
              <NuxtLink
                v-for="item in group.items"
                :key="item.path"
                :to="item.path"
                @click="mobileDrawerOpen = false"
                class="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all relative overflow-hidden"
                :class="[
                  isCollapsed ? 'justify-center px-0' : '',
                  isActive(item.path)
                    ? 'bg-gradient-to-r from-[#C9A24A]/30 to-[#C9A24A]/10 text-[#E5C77A] font-semibold border-l-4 border-[#C9A24A] shadow-sm'
                    : 'text-[#F7F0E3]/80 hover:bg-[#C9A24A]/15 hover:text-[#E5C77A]'
                ]"
                :title="isCollapsed ? t(item.labelKey) : undefined"
              >
                <!-- Nav Icon -->
                <component
                  :is="item.iconComponent"
                  class="w-4 h-4 flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
                  :class="isActive(item.path) ? 'text-[#E5C77A]' : 'text-[#F7F0E3]/70 group-hover:text-[#E5C77A]'"
                />

                <!-- Nav Label -->
                <span v-if="!isCollapsed" class="truncate font-khmer-body">
                  {{ t(item.labelKey) }}
                </span>

                <!-- Active Indicator Dot (Collapsed Mode) -->
                <span
                  v-if="isCollapsed && isActive(item.path)"
                  class="absolute right-1 w-1.5 h-1.5 rounded-full bg-[#E5C77A]"
                ></span>
              </NuxtLink>
            </nav>
          </div>
        </div>

        <!-- Quick View Live Wedding Website Card -->
        <div v-if="!isCollapsed" class="mt-6 pt-4 border-t border-[#C9A24A]/25">
          <a
            :href="liveInviteUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="group block p-3 rounded-xl bg-gradient-to-r from-[#FAF0E6]/10 to-[#FAF0E6]/5 border border-[#C9A24A]/40 hover:border-[#C9A24A] hover:bg-[#FAF0E6]/15 transition-all text-left shadow-sm"
          >
            <div class="flex items-center justify-between text-xs font-bold text-[#E5C77A] mb-1">
              <span class="flex items-center gap-1.5">
                <Globe class="w-3.5 h-3.5" />
                <span>{{ isKhmer ? 'មើលធៀបការផ្ទាល់' : 'View Live Website' }}</span>
              </span>
              <ExternalLink class="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
            <p class="text-[10px] text-[#F7F0E3]/70 truncate">
              /invite/b1d98750-a2b9...
            </p>
          </a>
        </div>
      </div>

      <!-- Bottom Profile / Settings / Logout -->
      <div class="p-3 border-t border-[#C9A24A]/25 relative z-10 space-y-2 bg-[#3B0E17]/60">
        <!-- Admin Profile Info -->
        <div v-if="!isCollapsed" class="flex items-center justify-between px-2 py-1 text-xs">
          <div class="flex items-center gap-2 min-w-0">
            <div class="w-7 h-7 rounded-full bg-[#C9A24A]/30 border border-[#C9A24A]/50 flex items-center justify-center text-xs font-bold text-[#E5C77A]">
              <User class="w-3.5 h-3.5" />
            </div>
            <div class="truncate">
              <div class="text-[11px] font-bold text-[#F7F0E3] truncate">Admin Officer</div>
              <div class="text-[9px] text-[#E5C77A]/70 truncate font-mono">Wedding Management</div>
            </div>
          </div>
          <!-- Language Toggle Button -->
          <button
            @click="toggleLocale"
            type="button"
            class="px-2 py-1 rounded border border-[#C9A24A]/40 hover:bg-[#C9A24A]/20 text-[#E5C77A] text-[10px] font-bold transition-colors cursor-pointer"
            :title="isKhmer ? 'Switch to English' : 'ប្តូរទៅភាសាខ្មែរ'"
          >
            {{ isKhmer ? 'EN' : 'ខ្មែរ' }}
          </button>
        </div>

        <!-- Logout Button -->
        <button
          @click="handleLogout"
          type="button"
          class="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium rounded-xl bg-red-950/70 hover:bg-red-900 border border-red-500/30 text-red-200 transition-all cursor-pointer shadow-sm active:scale-98"
          :title="isCollapsed ? t('admin.logout') : undefined"
        >
          <LogOut class="w-3.5 h-3.5 flex-shrink-0" />
          <span v-if="!isCollapsed">{{ t('admin.logout') }}</span>
        </button>
      </div>
    </aside>

    <!-- Main Content Area -->
    <main class="flex-1 min-w-0 p-4 md:p-8 overflow-x-hidden">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import {
  Crown,
  User,
  BarChart3,
  Users2,
  CalendarCheck2,
  SlidersHorizontal,
  LayoutDashboard,
  Users,
  Mail,
  CheckSquare,
  Calendar,
  Images,
  Palette,
  Settings,
  Send,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Globe,
  LogOut
} from 'lucide-vue-next'

const route = useRoute()
const { t, isKhmer, toggleLocale } = useLocale()
const supabase = useSupabase()

const mobileDrawerOpen = ref(false)
const isCollapsed = ref(false)
const liveInviteUrl = '/invite/b1d98750-a2b9-4a76-8715-85c0c3ad864d'
const coupleLabel = ref('Vet Seyha & Sar Nary')

onMounted(async () => {
  try {
    const res = await $fetch<any>(`/api/wedding?t=${Date.now()}`)
    const groom = res?.groom_name_en || res?.groom_name_km
    const bride = res?.bride_name_en || res?.bride_name_km
    if (groom && bride) {
      coupleLabel.value = `${groom} & ${bride}`
    }
  } catch {
    // Keep fallback couple label if wedding settings fail to load
  }
})

// Helper to determine active route
const isActive = (path: string) => {
  if (path === '/admin') return route.path === '/admin'
  return route.path.startsWith(path)
}

// Categorized Navigation Groups
const navGroups = [
  {
    title: 'Overview',
    title_en: 'Overview',
    title_km: 'ទិដ្ឋភាពរួម',
    headerIcon: BarChart3,
    items: [
      { path: '/admin', labelKey: 'admin.dashboard', iconComponent: LayoutDashboard }
    ]
  },
  {
    title: 'Guest Management',
    title_en: 'Guest Management',
    title_km: 'ការគ្រប់គ្រងភ្ញៀវ',
    headerIcon: Users2,
    items: [
      { path: '/admin/guests', labelKey: 'admin.guests', iconComponent: Users },
      { path: '/admin/invitations', labelKey: 'admin.invitations', iconComponent: Mail },
      { path: '/admin/telegram', labelKey: 'admin.telegram', iconComponent: Send },
      { path: '/admin/rsvps', labelKey: 'admin.rsvps', iconComponent: CheckSquare }
    ]
  },
  {
    title: 'Wedding Content',
    title_en: 'Wedding Content',
    title_km: 'មាតិកាមង្គលការ',
    headerIcon: CalendarCheck2,
    items: [
      { path: '/admin/programmes', labelKey: 'admin.programmes', iconComponent: Calendar },
      { path: '/admin/gallery', labelKey: 'admin.gallery', iconComponent: Images }
    ]
  },
  {
    title: 'Settings & Appearance',
    title_en: 'Settings & Appearance',
    title_km: 'ការកំណត់ & រចនា',
    headerIcon: SlidersHorizontal,
    items: [
      { path: '/admin/appearance', labelKey: 'admin.appearance', iconComponent: Palette },
      { path: '/admin/settings', labelKey: 'admin.settings', iconComponent: Settings }
    ]
  }
]

const handleLogout = async () => {
  if (supabase) {
    await supabase.auth.signOut()
  }
  await navigateTo('/admin/login')
}
</script>

<style scoped>
/* Hide scrollbar for Chrome, Safari and Opera */
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
/* Hide scrollbar for IE, Edge and Firefox */
.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
