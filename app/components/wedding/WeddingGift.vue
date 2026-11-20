<template>
  <section class="py-14 px-4 max-w-2xl mx-auto" v-if="activeGiftInfo.enabled !== false">
    <!-- Header Title -->
    <div class="text-center mb-8">
      <div class="text-xs uppercase tracking-widest text-wedding-secondary font-bold mb-1">
        ចំណងដៃមង្គលការ / WEDDING GIFT
      </div>
      <h2 class="font-khmer-heading text-2xl sm:text-3xl text-wedding-heading">
        ចំណងដៃ និងពរជ័យឌីជីថល
      </h2>
      <div class="flex items-center justify-center gap-2 mt-3 text-wedding-secondary">
        <span class="w-12 h-px bg-wedding-secondary/40"></span>
        <span class="text-lg">🪷</span>
        <span class="w-12 h-px bg-wedding-secondary/40"></span>
      </div>
    </div>

    <!-- Outer Khmer Card Frame -->
    <div class="khmer-card rounded-3xl p-6 sm:p-10 border-2 border-wedding-secondary/40 shadow-gold-glow relative text-center">
      <!-- Traditional Corner Filigree -->
      <div class="absolute top-2 left-2 text-wedding-secondary/50 text-xl select-none">⚜️</div>
      <div class="absolute top-2 right-2 text-wedding-secondary/50 text-xl select-none">⚜️</div>
      <div class="absolute bottom-2 left-2 text-wedding-secondary/50 text-xl select-none">⚜️</div>
      <div class="absolute bottom-2 right-2 text-wedding-secondary/50 text-xl select-none">⚜️</div>

      <!-- Intro Envelope Badge & Message -->
      <div class="mb-8 max-w-lg mx-auto">
        <div class="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#FAF0E6] border border-[#E5C77A]/60 text-xs font-bold text-wedding-primary mb-3">
          <span>💌</span>
          <span>ស្រោមសំបុត្រចំណងដៃ</span>
        </div>
        <p class="font-khmer-body text-xs sm:text-sm text-wedding-text/80 leading-relaxed">
          {{ activeGiftInfo.message_km || 'សម្រាប់ឯកឧត្តម លោកជំទាវ លោក លោកស្រី និងភ្ញៀវកិត្តិយសទាំងអស់ ដែលមានបំណងចូលរួមចំណងដៃតាមរយៈការស្កេន KHQR ឬផ្ទេរប្រាក់តាមគណនីធនាគារ' }}
        </p>
      </div>

      <!-- KHQR Display Card (Uploaded file already contains KHQR header, name, and QR) -->
      <div class="max-w-[320px] mx-auto mb-8 bg-white/95 rounded-3xl border-2 border-[#E5C77A]/40 shadow-lg p-4 sm:p-5 transition-transform hover:scale-[1.01]">
        <!-- The uploaded KHQR Card Image -->
        <div class="w-full rounded-2xl overflow-hidden bg-white shadow-inner border border-gray-100 flex items-center justify-center">
          <img
            v-if="activeGiftInfo.qr_code_url"
            :src="activeGiftInfo.qr_code_url"
            alt="KHQR Payment"
            class="w-full h-auto object-contain block"
          />
          <!-- Fallback decorative placeholder when no custom QR uploaded yet -->
          <div v-else class="text-center py-10 px-4">
            <div class="text-4xl mb-2 text-[#E1251B]">📱</div>
            <div class="text-xs font-bold text-[#641D2D]">KHQR Code</div>
            <div class="text-[10px] text-gray-500 mt-1">Upload QR in Admin Settings</div>
          </div>
        </div>

        <!-- KHQR Footer text -->
        <div class="mt-4 text-[11px] font-bold text-[#C9A24A] tracking-wider uppercase flex items-center justify-center gap-1.5 font-khmer-body">
          <span>✦</span>
          <span>ស្កេនទូទាត់តាម KHQR</span>
          <span>✦</span>
        </div>
      </div>

      <!-- Bank Account Information -->
      <div class="max-w-md mx-auto space-y-4">
        <!-- Badge -->
        <div class="inline-block px-3 py-1 rounded-full bg-[#FAF0E6] text-[11px] font-bold uppercase tracking-wider text-wedding-secondary border border-wedding-secondary/30">
          គណនីធនាគារ / BANK ACCOUNT
        </div>

        <!-- Bank & Account Name -->
        <div class="font-khmer-heading text-lg sm:text-xl text-wedding-primary">
          {{ activeGiftInfo.bank_name || 'ABA Bank' }} ({{ activeGiftInfo.account_name_km || 'វ៉ែត សីហា & ស ណារី' }})
        </div>

        <!-- Account Number -->
        <div class="font-mono text-2xl sm:text-3xl font-bold tracking-widest text-wedding-heading">
          {{ activeGiftInfo.account_number || '007 342 922' }}
        </div>

        <!-- Copy Account Number Button -->
        <div class="pt-2">
          <button
            type="button"
            @click="copyAccountNumber"
            class="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-wedding-primary hover:bg-wedding-primary/90 text-wedding-bg font-medium shadow-md transition-all transform hover:scale-105 active:scale-95 text-xs sm:text-sm font-khmer-body"
          >
            <span>📋</span>
            <span>{{ isCopied ? '✓ បានចម្លងលេខគណនីរួចរាល់!' : `ចម្លងលេខគណនី ${activeGiftInfo.bank_name || 'ABA'}` }}</span>
          </button>
        </div>

        <!-- Footer Gratitude Message -->
        <p class="text-[11px] sm:text-xs text-wedding-text/70 font-khmer-body pt-4 leading-relaxed italic">
          សូមថ្លែងអំណរគុណយ៉ាងជ្រាលជ្រៅបំផុត សម្រាប់ការចូលរួម និងទឹកចិត្តដ៏ថ្លៃថ្លារបស់លោកអ្នក!
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { WeddingGiftInfo } from '~~/shared/types/wedding'

const props = defineProps<{
  giftInfo?: WeddingGiftInfo | null
}>()

const isCopied = ref(false)

const DEFAULT_GIFT_INFO: WeddingGiftInfo = {
  enabled: true,
  qr_code_url: '/images/khqr-default.jpg',
  account_name_en: 'SEYHA VET',
  bank_name: 'ABA Bank',
  account_name_km: 'វ៉ែត សីហា & ស ណារី',
  account_number: '007 342 922',
  message_km: 'សម្រាប់ឯកឧត្តម លោកជំទាវ លោក លោកស្រី និងភ្ញៀវកិត្តិយសទាំងអស់ ដែលមានបំណងចូលរួមចំណងដៃតាមរយៈការស្កេន KHQR ឬផ្ទេរប្រាក់តាមគណនីធនាគារ',
  message_en: 'For guests who wish to send wedding blessings and digital gifts via KHQR or bank transfer.'
}

const activeGiftInfo = computed(() => {
  if (props.giftInfo) {
    return {
      ...DEFAULT_GIFT_INFO,
      ...props.giftInfo
    }
  }
  return DEFAULT_GIFT_INFO
})

const copyAccountNumber = async () => {
  const num = activeGiftInfo.value.account_number || '007 342 922'
  const cleanNum = num.replace(/\s+/g, '')
  try {
    await navigator.clipboard.writeText(cleanNum)
    isCopied.value = true
    setTimeout(() => {
      isCopied.value = false
    }, 3000)
  } catch (err) {
    console.error('Failed to copy account number:', err)
  }
}
</script>
