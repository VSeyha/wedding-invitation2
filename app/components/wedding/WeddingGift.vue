<template>
  <section class="py-14 px-4 max-w-2xl mx-auto" v-if="activeGiftInfo.enabled !== false">
    <!-- Header Title -->
    <div class="text-center mb-8">
      <div class="text-xs uppercase tracking-widest text-wedding-secondary font-bold mb-3 font-en-heading">
        ចំណងដៃមង្គលការ / WEDDING GIFT
      </div>
      <h2 class="font-khmer-heading text-xl sm:text-2xl text-wedding-heading" style="line-height: 2 !important;">
        ចំណងដៃ និងពរជ័យឌីជីថល
      </h2>
      <div class="flex items-center justify-center gap-2 mt-4 text-wedding-secondary">
        <span class="w-12 h-px bg-wedding-secondary/40"></span>
        <span class="text-lg">🪷</span>
        <span class="w-12 h-px bg-wedding-secondary/40"></span>
      </div>
    </div>

    <!-- Outer Khmer Card Frame with Double Gold Border -->
    <div class="rounded-3xl p-1.5 sm:p-2 bg-gradient-to-b from-[#FAF4EB] via-[#FFFDF9] to-[#F5ECE0] border border-[#C9A24A]/30 shadow-gold-glow relative">
      <div class="rounded-[22px] p-6 sm:p-8 bg-[#FFFDF9]/95 border border-[#C9A24A]/40 relative overflow-hidden backdrop-blur-sm text-center">
        <!-- Traditional Corner Fleur-de-lis Accents -->
        <div class="absolute top-2.5 left-2.5 text-[#C9A24A] select-none pointer-events-none transform -rotate-45 drop-shadow-[0_1px_2px_rgba(201,162,74,0.4)]">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C11.5 4 10 6 8.5 7.5C7 9 5.5 10 5 12C4.5 14 5.5 16 7 16.5C8.5 17 10 16 11 15C10.8 17 10.5 19 9 20.5H15C13.5 19 13.2 17 13 15C14 16 15.5 17 17 16.5C18.5 16 19.5 14 19 12C18.5 10 17 9 15.5 7.5C14 6 12.5 4 12 2Z"/>
            <path d="M7 17C6 17 4 18 4 19C4 20 6 21 8 21C9 21 10 20.5 10.5 20C9.5 19.5 8 18.5 7 17Z"/>
            <path d="M17 17C18 17 20 18 20 19C20 20 18 21 16 21C15 21 14 20.5 13.5 20C14.5 19.5 16 18.5 17 17Z"/>
          </svg>
        </div>
        <div class="absolute top-2.5 right-2.5 text-[#C9A24A] select-none pointer-events-none transform rotate-45 drop-shadow-[0_1px_2px_rgba(201,162,74,0.4)]">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C11.5 4 10 6 8.5 7.5C7 9 5.5 10 5 12C4.5 14 5.5 16 7 16.5C8.5 17 10 16 11 15C10.8 17 10.5 19 9 20.5H15C13.5 19 13.2 17 13 15C14 16 15.5 17 17 16.5C18.5 16 19.5 14 19 12C18.5 10 17 9 15.5 7.5C14 6 12.5 4 12 2Z"/>
            <path d="M7 17C6 17 4 18 4 19C4 20 6 21 8 21C9 21 10 20.5 10.5 20C9.5 19.5 8 18.5 7 17Z"/>
            <path d="M17 17C18 17 20 18 20 19C20 20 18 21 16 21C15 21 14 20.5 13.5 20C14.5 19.5 16 18.5 17 17Z"/>
          </svg>
        </div>
        <div class="absolute bottom-2.5 left-2.5 text-[#C9A24A] select-none pointer-events-none transform -rotate-135 drop-shadow-[0_1px_2px_rgba(201,162,74,0.4)]">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C11.5 4 10 6 8.5 7.5C7 9 5.5 10 5 12C4.5 14 5.5 16 7 16.5C8.5 17 10 16 11 15C10.8 17 10.5 19 9 20.5H15C13.5 19 13.2 17 13 15C14 16 15.5 17 17 16.5C18.5 16 19.5 14 19 12C18.5 10 17 9 15.5 7.5C14 6 12.5 4 12 2Z"/>
            <path d="M7 17C6 17 4 18 4 19C4 20 6 21 8 21C9 21 10 20.5 10.5 20C9.5 19.5 8 18.5 7 17Z"/>
            <path d="M17 17C18 17 20 18 20 19C20 20 18 21 16 21C15 21 14 20.5 13.5 20C14.5 19.5 16 18.5 17 17Z"/>
          </svg>
        </div>
        <div class="absolute bottom-2.5 right-2.5 text-[#C9A24A] select-none pointer-events-none transform rotate-135 drop-shadow-[0_1px_2px_rgba(201,162,74,0.4)]">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C11.5 4 10 6 8.5 7.5C7 9 5.5 10 5 12C4.5 14 5.5 16 7 16.5C8.5 17 10 16 11 15C10.8 17 10.5 19 9 20.5H15C13.5 19 13.2 17 13 15C14 16 15.5 17 17 16.5C18.5 16 19.5 14 19 12C18.5 10 17 9 15.5 7.5C14 6 12.5 4 12 2Z"/>
            <path d="M7 17C6 17 4 18 4 19C4 20 6 21 8 21C9 21 10 20.5 10.5 20C9.5 19.5 8 18.5 7 17Z"/>
            <path d="M17 17C18 17 20 18 20 19C20 20 18 21 16 21C15 21 14 20.5 13.5 20C14.5 19.5 16 18.5 17 17Z"/>
          </svg>
        </div>

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
            <div class="text-xs font-bold text-wedding-primary">KHQR Code</div>
            <div class="text-[10px] text-gray-500 mt-1">Upload QR in Admin Settings</div>
          </div>
        </div>

        <!-- KHQR Footer text -->
        <div class="mt-4 text-[11px] font-bold text-[#C9A24A] flex items-center justify-center gap-1.5 font-khmer-body">
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
