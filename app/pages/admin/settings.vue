<template>
  <div>
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 class="text-2xl font-bold text-[#641D2D] font-en-heading">{{ t('admin.settings') }}</h1>
        <p class="text-sm text-[#3C2925]/60 mt-1">Edit wedding details shown on the public invitation.</p>
      </div>
      <button @click="save" :disabled="saving" class="btn-primary self-start">
        {{ saving ? 'Saving...' : '💾 ' + t('admin.save') }}
      </button>
    </div>

    <div v-if="loading" class="text-center py-8 text-[#3C2925]/50">Loading...</div>
    <form v-else @submit.prevent="save" class="space-y-6 max-w-2xl">
      <!-- Couple Names -->
      <section class="bg-white rounded-xl border border-[#C9A24A]/20 p-5 shadow-sm">
        <h2 class="text-sm font-bold uppercase tracking-wider text-[#641D2D] mb-4">👰 Couple Names</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label class="form-label">Bride Name (Khmer)</label><input v-model="form.bride_name_km" class="input-field" /></div>
          <div><label class="form-label">Bride Name (English)</label><input v-model="form.bride_name_en" class="input-field" /></div>
          <div><label class="form-label">Groom Name (Khmer)</label><input v-model="form.groom_name_km" class="input-field" /></div>
          <div><label class="form-label">Groom Name (English)</label><input v-model="form.groom_name_en" class="input-field" /></div>
        </div>
      </section>

      <!-- Date & Venue -->
      <section class="bg-white rounded-xl border border-[#C9A24A]/20 p-5 shadow-sm">
        <h2 class="text-sm font-bold uppercase tracking-wider text-[#641D2D] mb-4">📅 Date & Venue</h2>
        <div class="space-y-4">
          <div><label class="form-label">Wedding Date & Time</label><input v-model="form.wedding_date" type="datetime-local" class="input-field" /></div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label class="form-label">Venue Name (Khmer)</label><input v-model="form.venue_name_km" class="input-field" /></div>
            <div><label class="form-label">Venue Name (English)</label><input v-model="form.venue_name_en" class="input-field" /></div>
            <div><label class="form-label">Venue Address (Khmer)</label><textarea v-model="form.venue_address_km" rows="2" class="input-field" /></div>
            <div><label class="form-label">Venue Address (English)</label><textarea v-model="form.venue_address_en" rows="2" class="input-field" /></div>
          </div>
          <div><label class="form-label">Google Maps URL</label><input v-model="form.google_maps_url" type="url" class="input-field" placeholder="https://maps.google.com/..." /></div>
        </div>
      </section>

      <!-- Invitation Message -->
      <section class="bg-white rounded-xl border border-[#C9A24A]/20 p-5 shadow-sm">
        <h2 class="text-sm font-bold uppercase tracking-wider text-[#641D2D] mb-4">💌 Invitation Message</h2>
        <div class="space-y-4">
          <div>
            <label class="form-label">Message (Khmer)</label>
            <textarea v-model="form.invitation_message_km" rows="4" class="input-field font-khmer-body" />
          </div>
          <div>
            <label class="form-label">Message (English)</label>
            <textarea v-model="form.invitation_message_en" rows="4" class="input-field" />
          </div>
        </div>
      </section>

      <div v-if="successMsg" class="text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-2 text-sm">{{ successMsg }}</div>
      <div v-if="errorMsg" class="text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-sm">{{ errorMsg }}</div>

      <button type="submit" :disabled="saving" class="btn-primary">{{ saving ? 'Saving...' : '💾 Save Changes' }}</button>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin-auth' })
const { t } = useLocale()
const supabase = useSupabase()

const loading = ref(true)
const saving = ref(false)
const successMsg = ref('')
const errorMsg = ref('')
const form = ref({
  bride_name_km: '', bride_name_en: '', groom_name_km: '', groom_name_en: '',
  wedding_date: '', venue_name_km: '', venue_name_en: '',
  venue_address_km: '', venue_address_en: '', google_maps_url: '',
  invitation_message_km: '', invitation_message_en: ''
})

const getToken = async () => {
  if (!supabase) return ''
  const { data } = await supabase.auth.getSession()
  return data.session?.access_token || ''
}

onMounted(async () => {
  const token = await getToken()
  const { data } = await $fetch<any>('/api/wedding', { headers: { authorization: `Bearer ${token}` } }).catch(() => ({ data: null }))
  if (data) {
    Object.assign(form.value, {
      ...data,
      wedding_date: data.wedding_date ? new Date(data.wedding_date).toISOString().slice(0, 16) : ''
    })
  }
  loading.value = false
})

const save = async () => {
  saving.value = true; successMsg.value = ''; errorMsg.value = ''
  const token = await getToken()
  try {
    const payload = { ...form.value, wedding_date: form.value.wedding_date ? new Date(form.value.wedding_date).toISOString() : null }
    await $fetch('/api/wedding', { method: 'PUT', headers: { authorization: `Bearer ${token}` }, body: payload })
    successMsg.value = '✓ Wedding settings saved successfully.'
  } catch (e: any) { errorMsg.value = e?.data?.statusMessage || 'Error saving settings.' }
  saving.value = false
}
</script>

<style scoped>
.btn-primary { @apply px-4 py-2 rounded-lg bg-[#641D2D] text-[#F7F0E3] font-medium hover:bg-[#7D2438] transition-colors text-sm disabled:opacity-50; }
.input-field { @apply w-full px-3 py-2 rounded-lg border border-[#C9A24A]/40 bg-white focus:outline-none focus:ring-2 focus:ring-[#641D2D]/30 text-sm; }
.form-label { @apply block text-xs font-semibold uppercase tracking-wider text-[#3C2925]/70 mb-1; }
</style>
