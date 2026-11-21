<template>
  <div
    v-if="!opened && currentStyle !== 'direct'"
    :class="[
      absolute ? 'absolute inset-0 z-30' : 'fixed inset-0 z-50',
      'flex items-center justify-center p-0 overflow-hidden select-none',
      isOpening && currentStyle !== 'curtain' ? 'opacity-0 pointer-events-none scale-105 transition-all duration-700' : ''
    ]"
    :style="{
      background: currentStyle === 'curtain' ? 'transparent' : 'radial-gradient(circle at 50% 35%, var(--wedding-bg, #F7F0E3) 0%, var(--wedding-primary, #641D2D) 130%)'
    }"
  >
    <!-- Background Texture -->
    <div
      v-if="currentStyle !== 'curtain'"
      class="absolute inset-0 opacity-15 pointer-events-none"
      :style="{
        backgroundImage: 'radial-gradient(var(--wedding-secondary, #C9A24A) 1px, transparent 1px)',
        backgroundSize: '24px 24px'
      }"
    ></div>

    <!-- ============================================================== -->
    <!-- STYLE 1: ROYAL THEATRICAL CURTAINS (Realistic Draped Velvet)    -->
    <!-- ============================================================== -->
    <div v-if="currentStyle === 'curtain'" class="absolute inset-0 z-40 overflow-hidden flex pointer-events-none">
      <!-- Top Royal Khmer Draped Valance / Pelmet (ស្បៃរំយោលក្បាលវាំងនន) -->
      <div
        class="absolute top-0 left-0 right-0 z-30 pointer-events-none transition-transform duration-900 ease-[cubic-bezier(0.25,1,0.5,1)]"
        :class="{ '-translate-y-full': isOpening }"
      >
        <!-- Golden Decorative Arch Pelmet with Scalloped Drapes (Using kbaj-khmer.jpg) -->
        <div class="w-full relative filter drop-shadow-xl">
          <!-- Main Valance Fabric Bar -->
          <div
            class="w-full h-8 sm:h-10 relative overflow-hidden flex items-center justify-between px-3 border-b-2 border-wedding-accent/90"
            :style="{
              backgroundImage: `linear-gradient(180deg, rgba(70,40,5,0.75) 0%, rgba(199,144,21,0.35) 50%, rgba(70,40,5,0.85) 100%), url('/images/backgrounds/kbaj-khmer.jpg')`,
              backgroundSize: 'cover, 320px auto',
              boxShadow: '0 4px 18px rgba(0,0,0,0.7)'
            }"
          >
            <!-- Golden Trim Rope on Top -->
            <div class="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-wedding-accent via-wedding-secondary to-wedding-accent"></div>
            <!-- Bottom Gold Braided Trim -->
            <div class="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-wedding-accent via-wedding-secondary to-wedding-accent"></div>

            <!-- Center Royal Crown / Khmer Kbach Crest -->
            <div class="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center">
              <KhmerKbach :size="24" type="crest" :glow="true" />
            </div>
          </div>

          <!-- 3 Scalloped Draped Swags (រំយោលស្បៃវាំងនន) with kbaj-khmer.jpg -->
          <div class="w-full flex justify-between items-start -mt-0.5 px-0.5 pointer-events-none">
            <!-- Left Swag -->
            <div
              class="flex-1 h-5 sm:h-7 rounded-b-[60px] relative overflow-hidden mx-0.5 border-b-2 border-wedding-accent shadow-md"
              :style="{
                backgroundImage: `radial-gradient(ellipse at 50% 0%, rgba(255,240,180,0.5) 0%, rgba(199,144,21,0.55) 55%, rgba(70,40,5,0.88) 100%), url('/images/backgrounds/kbaj-khmer.jpg')`,
                backgroundSize: 'cover, 220px auto'
              }"
            >
              <div class="absolute inset-0 opacity-25" style="background: repeating-linear-gradient(180deg, transparent, transparent 3px, rgba(0,0,0,0.3) 4px);"></div>
            </div>
            <!-- Center Swag (Deeper) -->
            <div
              class="flex-1 h-7 sm:h-9 rounded-b-[70px] relative overflow-hidden mx-0.5 border-b-2 border-wedding-accent shadow-lg -mt-0.5"
              :style="{
                backgroundImage: `radial-gradient(ellipse at 50% 0%, rgba(255,245,200,0.6) 0%, rgba(209,158,40,0.6) 55%, rgba(85,45,5,0.92) 100%), url('/images/backgrounds/kbaj-khmer.jpg')`,
                backgroundSize: 'cover, 240px auto'
              }"
            >
              <div class="absolute inset-0 opacity-25" style="background: repeating-linear-gradient(180deg, transparent, transparent 3px, rgba(0,0,0,0.3) 4px);"></div>
            </div>
            <!-- Right Swag -->
            <div
              class="flex-1 h-5 sm:h-7 rounded-b-[60px] relative overflow-hidden mx-0.5 border-b-2 border-wedding-accent shadow-md"
              :style="{
                backgroundImage: `radial-gradient(ellipse at 50% 0%, rgba(255,240,180,0.5) 0%, rgba(199,144,21,0.55) 55%, rgba(70,40,5,0.88) 100%), url('/images/backgrounds/kbaj-khmer.jpg')`,
                backgroundSize: 'cover, 220px auto'
              }"
            >
              <div class="absolute inset-0 opacity-25" style="background: repeating-linear-gradient(180deg, transparent, transparent 3px, rgba(0,0,0,0.3) 4px);"></div>
            </div>
          </div>

          <!-- Hanging Golden Fringe & Tassels (រំយោលមាសព្យួរ) -->
          <div class="w-full flex justify-around px-2 -mt-1">
            <span v-for="i in 11" :key="i" class="text-[9px] sm:text-[11px] text-wedding-accent drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] opacity-95 select-none">
              ❖
            </span>
          </div>
        </div>
      </div>

      <!-- Left Real Gold Khmer Brocade Curtain Panel (kbaj-khmer.jpg) -->
      <div
        class="w-1/2 h-full relative overflow-hidden pointer-events-auto origin-left transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] shadow-[15px_0_35px_rgba(0,0,0,0.8)]"
        :class="{ '-translate-x-[92%] scale-x-[0.22]': isOpening }"
        :style="{
          /* 3D Cylindrical Silk/Damask Folds overlaid on authentic kbaj-khmer.jpg */
          backgroundImage: `
            repeating-linear-gradient(90deg, 
              rgba(65,35,4,0.82) 0px, 
              rgba(130,80,10,0.55) 14px, 
              rgba(201,147,26,0.15) 28px, 
              rgba(255,238,168,0.48) 42px, 
              rgba(255,252,220,0.65) 48px, 
              rgba(255,238,168,0.48) 54px, 
              rgba(201,147,26,0.15) 68px, 
              rgba(130,80,10,0.55) 82px, 
              rgba(65,35,4,0.82) 96px
            ),
            url('/images/backgrounds/kbaj-khmer.jpg')
          `,
          backgroundSize: '96px 100%, 360px auto',
          backgroundRepeat: 'repeat-x, repeat'
        }"
      >
        <!-- Soft Ambient Lighting & Shadow from Top to Bottom -->
        <div
          class="absolute inset-0 pointer-events-none"
          :style="{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(245,215,127,0.12) 12%, transparent 35%, rgba(65,35,5,0.45) 80%, rgba(30,15,2,0.85) 100%)'
          }"
        ></div>

        <!-- Inner Vertical Parting Seam: Delicate Golden Tassel Cord -->
        <div class="absolute right-0 top-0 bottom-0 w-2.5 sm:w-3 bg-gradient-to-l from-wedding-accent via-wedding-secondary to-transparent flex flex-col items-center justify-around py-4 opacity-95 shadow-md">
          <span v-for="k in 14" :key="k" class="text-[7px] text-[#3D0A13] font-bold select-none opacity-85">✦</span>
        </div>

        <!-- Left Curtain Side Tieback & Tassel -->
        <div class="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 z-20 pointer-events-none">
          <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-wedding-accent via-wedding-secondary to-[#8F6B1E] p-0.5 shadow-gold-glow flex items-center justify-center">
            <div class="w-full h-full rounded-full bg-[#641D2D] flex items-center justify-center">
              <KhmerKbach :size="14" type="crest" :glow="true" />
            </div>
          </div>
          <!-- Hanging Gold Tassel -->
          <div class="flex flex-col items-center">
            <span class="w-1 h-8 bg-gradient-to-b from-wedding-accent to-wedding-secondary rounded-full shadow"></span>
            <span class="text-[10px] text-wedding-accent -mt-1">❖</span>
          </div>
        </div>
      </div>

      <!-- Right Real Gold Khmer Brocade Curtain Panel (kbaj-khmer.jpg) -->
      <div
        class="w-1/2 h-full relative overflow-hidden pointer-events-auto origin-right transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] shadow-[-15px_0_35px_rgba(0,0,0,0.8)]"
        :class="{ 'translate-x-[92%] scale-x-[0.22]': isOpening }"
        :style="{
          /* 3D Cylindrical Silk/Damask Folds overlaid on authentic kbaj-khmer.jpg */
          backgroundImage: `
            repeating-linear-gradient(90deg, 
              rgba(65,35,4,0.82) 0px, 
              rgba(130,80,10,0.55) 14px, 
              rgba(201,147,26,0.15) 28px, 
              rgba(255,238,168,0.48) 42px, 
              rgba(255,252,220,0.65) 48px, 
              rgba(255,238,168,0.48) 54px, 
              rgba(201,147,26,0.15) 68px, 
              rgba(130,80,10,0.55) 82px, 
              rgba(65,35,4,0.82) 96px
            ),
            url('/images/backgrounds/kbaj-khmer.jpg')
          `,
          backgroundSize: '96px 100%, 360px auto',
          backgroundRepeat: 'repeat-x, repeat'
        }"
      >
        <!-- Soft Ambient Lighting & Shadow from Top to Bottom -->
        <div
          class="absolute inset-0 pointer-events-none"
          :style="{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(245,215,127,0.12) 12%, transparent 35%, rgba(65,35,5,0.45) 80%, rgba(30,15,2,0.85) 100%)'
          }"
        ></div>

        <!-- Inner Vertical Parting Seam: Delicate Golden Tassel Cord -->
        <div class="absolute left-0 top-0 bottom-0 w-2.5 sm:w-3 bg-gradient-to-r from-wedding-accent via-wedding-secondary to-transparent flex flex-col items-center justify-around py-4 opacity-95 shadow-md">
          <span v-for="k in 14" :key="k" class="text-[7px] text-[#3D0A13] font-bold select-none opacity-85">✦</span>
        </div>

        <!-- Right Curtain Side Tieback & Tassel -->
        <div class="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 z-20 pointer-events-none flex-row-reverse">
          <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-wedding-accent via-wedding-secondary to-[#8F6B1E] p-0.5 shadow-gold-glow flex items-center justify-center">
            <div class="w-full h-full rounded-full bg-[#641D2D] flex items-center justify-center">
              <KhmerKbach :size="14" type="crest" :glow="true" />
            </div>
          </div>
          <!-- Hanging Gold Tassel -->
          <div class="flex flex-col items-center">
            <span class="w-1 h-8 bg-gradient-to-b from-wedding-accent to-wedding-secondary rounded-full shadow"></span>
            <span class="text-[10px] text-wedding-accent -mt-1">❖</span>
          </div>
        </div>
      </div>

      <!-- Center Royal Wedding Invitation Card on Curtains (Authentic Cambodian Style) -->
      <div
        class="absolute inset-0 flex flex-col items-center justify-center z-50 transition-all duration-700 ease-out px-3 sm:px-4 pointer-events-auto"
        :class="{ 'opacity-0 scale-90 pointer-events-none': isOpening }"
      >
        <div
          class="relative w-full max-w-[340px] sm:max-w-[430px] max-h-[90vh] rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 bg-gradient-to-b from-[#FFFDF9]/98 via-white/98 to-[#FAF1DF]/98 border-2 border-wedding-secondary shadow-[0_25px_65px_rgba(0,0,0,0.7),0_0_40px_rgba(201,162,74,0.45)] backdrop-blur-md flex flex-col items-center justify-between overflow-hidden text-center select-none"
        >
          <!-- Elegant Inset Gold Borders -->
          <div class="absolute inset-1.5 sm:inset-2.5 border border-[#D4AF37]/70 pointer-events-none rounded-xl sm:rounded-2xl"></div>
          <div class="absolute inset-2 sm:inset-3 border border-dashed border-[#D4AF37]/35 pointer-events-none rounded-lg sm:rounded-xl"></div>

          <!-- 4 Delicate Royal Khmer Kbach Corners -->
          <div class="absolute top-1.5 left-1.5 sm:top-2.5 sm:left-2.5 pointer-events-none opacity-80 z-20">
            <KhmerKbach :size="16" type="corner" position="top-left" />
          </div>
          <div class="absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5 pointer-events-none opacity-80 z-20">
            <KhmerKbach :size="16" type="corner" position="top-right" />
          </div>
          <div class="absolute bottom-1.5 left-1.5 sm:bottom-2.5 sm:left-2.5 pointer-events-none opacity-80 z-20">
            <KhmerKbach :size="16" type="corner" position="bottom-left" />
          </div>
          <div class="absolute bottom-1.5 right-1.5 sm:bottom-2.5 sm:right-2.5 pointer-events-none opacity-80 z-20">
            <KhmerKbach :size="16" type="corner" position="bottom-right" />
          </div>

          <!-- Subtle Background Damask Kbach Watermark -->
          <div
            class="absolute inset-0 opacity-[0.05] pointer-events-none"
            style="background-image: url('/images/backgrounds/royal-kbach.svg'); background-size: 80px 80px;"
          ></div>

          <!-- Top Section: Arch with Sheer Draped Curtains & Floral Bouquets -->
          <div class="w-full flex flex-col items-center flex-shrink-0 z-10 pt-0.5">
            <div class="w-full flex justify-center -mt-1 mb-1 pointer-events-none">
              <svg class="w-full max-w-[270px] sm:max-w-[320px] h-12 sm:h-14" viewBox="0 0 320 80" fill="none">
                <!-- Sheer draped wedding curtains inside arch -->
                <path d="M160 12 C130 14, 70 20, 45 68 C55 64, 75 56, 85 45 C110 32, 140 22, 160 12 Z" fill="url(#curtainSheerL)" opacity="0.85" />
                <path d="M160 12 C190 14, 250 20, 275 68 C265 64, 245 56, 235 45 C210 32, 180 22, 160 12 Z" fill="url(#curtainSheerR)" opacity="0.85" />
                <!-- Curtain tie-back cords (Left & Right) -->
                <path d="M40 50 C48 52, 54 55, 60 52" stroke="#D4AF37" stroke-width="2" stroke-linecap="round" />
                <circle cx="50" cy="52" r="3" fill="#D4AF37" />
                <path d="M280 50 C272 52, 266 55, 260 52" stroke="#D4AF37" stroke-width="2" stroke-linecap="round" />
                <circle cx="270" cy="52" r="3" fill="#D4AF37" />
                
                <!-- Outer Royal Golden Arch (Kbach Filigree) -->
                <path d="M30 75 L30 45 C30 18, 90 6, 160 6 C230 6, 290 18, 290 45 L290 75" stroke="url(#goldGradCover)" stroke-width="2.5" stroke-linecap="round" />
                <path d="M38 75 L38 46 C38 23, 94 12, 160 12 C226 12, 282 23, 282 46 L282 75" stroke="#D4AF37" stroke-width="1" stroke-dasharray="2 3" opacity="0.75" />
                
                <!-- Side Floral Bouquets on Columns -->
                <!-- Left Floral Cluster -->
                <circle cx="30" cy="56" r="6" fill="#F8B4C0" />
                <circle cx="30" cy="56" r="4" fill="#E86A82" />
                <circle cx="24" cy="64" r="5" fill="#FFF2F4" />
                <circle cx="36" cy="63" r="5" fill="#D8B4E2" />
                <circle cx="28" cy="71" r="5" fill="#FAD0C4" />
                <ellipse cx="20" cy="58" rx="4" ry="2" fill="#88A878" transform="rotate(-30 20 58)" />
                <ellipse cx="38" cy="70" rx="4" ry="2" fill="#88A878" transform="rotate(30 38 70)" />
                
                <!-- Right Floral Cluster -->
                <circle cx="290" cy="56" r="6" fill="#F8B4C0" />
                <circle cx="290" cy="56" r="4" fill="#E86A82" />
                <circle cx="284" cy="63" r="5" fill="#D8B4E2" />
                <circle cx="296" cy="64" r="5" fill="#FFF2F4" />
                <circle cx="292" cy="71" r="5" fill="#FAD0C4" />
                <ellipse cx="300" cy="58" rx="4" ry="2" fill="#88A878" transform="rotate(30 300 58)" />
                <ellipse cx="282" cy="70" rx="4" ry="2" fill="#88A878" transform="rotate(-30 282 70)" />

                <!-- Center Golden Crown Crest -->
                <path d="M160 0 L165 10 L176 13 L166 17 L160 27 L154 17 L144 13 L155 10 Z" fill="url(#goldGradCover)" />
                <circle cx="160" cy="13" r="3" fill="#FFFDF8" />
                
                <defs>
                  <linearGradient id="curtainSheerL" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.95"/>
                    <stop offset="60%" stop-color="#FBF7EE" stop-opacity="0.8"/>
                    <stop offset="100%" stop-color="#EEDFBE" stop-opacity="0.6"/>
                  </linearGradient>
                  <linearGradient id="curtainSheerR" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.95"/>
                    <stop offset="60%" stop-color="#FBF7EE" stop-opacity="0.8"/>
                    <stop offset="100%" stop-color="#EEDFBE" stop-opacity="0.6"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <!-- Couple Names with Interlocking Gold Hearts Calligraphy -->
            <div class="text-center mb-0.5 w-full">
              <div class="flex items-center justify-center gap-1.5 text-wedding-primary font-khmer-heading text-sm sm:text-base font-bold leading-tight">
                <span>{{ wedding?.groom_name_km || 'វ៉េត សីហា' }}</span>
                <span class="inline-flex items-center text-[#C9A24A] text-xs animate-pulse filter drop-shadow">
                  <svg class="w-3.5 h-3.5 fill-current inline-block" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </span>
                <span>{{ wedding?.bride_name_km || 'ស ណារី' }}</span>
              </div>
              <div class="text-[9px] sm:text-[10px] font-en-heading text-[#8F6B1E] uppercase tracking-widest mt-0.5 font-semibold">
                {{ wedding?.groom_name_en || 'Vet Seyha' }} & {{ wedding?.bride_name_en || 'Sar Nary' }}
              </div>
            </div>

            <!-- Golden Embossed Celebration Title -->
            <div class="my-0.5 text-center">
              <h2
                class="font-khmer-heading text-base sm:text-lg font-bold tracking-wide"
                style="line-height: 1.6 !important; background: linear-gradient(135deg, #9C6B15 0%, #D4AF37 35%, #FBF3C7 50%, #C9A24A 70%, #7E4F09 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; filter: drop-shadow(0 1px 2px rgba(143,107,30,0.3));"
              >
                សិរីមង្គលអាពាហ៍ពិពាហ៍
              </h2>
              <div class="text-[10px] sm:text-[11px] font-khmer-body font-semibold text-[#641D2D]/85 -mt-0.5">
                សូមគោរពអញ្ជើញ
              </div>
            </div>

            <!-- Ornate Horizontal Gold Divider Bar -->
            <div class="w-36 sm:w-44 flex items-center justify-center gap-1 my-0.5 text-wedding-secondary/70">
              <span class="flex-1 h-px bg-gradient-to-r from-transparent via-wedding-secondary/60 to-wedding-secondary"></span>
              <span class="text-[8px]">❖</span>
              <span class="flex-1 h-px bg-gradient-to-l from-transparent via-wedding-secondary/60 to-wedding-secondary"></span>
            </div>
          </div>

          <!-- Middle Section: Dedicated Guest Name Box & Venue/Date -->
          <div class="w-full flex flex-col items-center flex-shrink-0 my-auto z-10 py-1">
            <div class="w-full max-w-[260px] sm:max-w-[290px] my-0.5">
              <div class="text-[9px] sm:text-[10px] text-wedding-text/70 font-khmer-body mb-0.5">
                សូមគោរពអញ្ជើញ ឯកឧត្តម លោកជំទាវ លោក លោកស្រី អ្នកនាងកញ្ញា
              </div>
              <div
                class="w-full py-1.5 px-3 rounded-xl bg-white/95 border-2 border-wedding-secondary shadow-[0_2px_8px_rgba(201,162,74,0.22)] flex items-center justify-center relative overflow-hidden"
              >
                <div class="absolute top-1 left-1.5 w-1.5 h-1.5 border-t border-l border-wedding-secondary/60"></div>
                <div class="absolute top-1 right-1.5 w-1.5 h-1.5 border-t border-r border-wedding-secondary/60"></div>
                <div class="absolute bottom-1 left-1.5 w-1.5 h-1.5 border-b border-l border-wedding-secondary/60"></div>
                <div class="absolute bottom-1 right-1.5 w-1.5 h-1.5 border-b border-r border-wedding-secondary/60"></div>

                <div class="text-sm sm:text-base font-bold text-wedding-primary font-khmer-heading truncate max-w-full" style="line-height: 1.5 !important;">
                  {{ guestName || 'ភ្ញៀវកិត្តិយស' }}
                </div>
              </div>
            </div>

            <!-- Date & Venue -->
            <div class="my-1 text-center space-y-0.5 text-[#3C2925]/85">
              <div class="text-[10px] sm:text-[11px] font-bold text-wedding-primary font-khmer-heading leading-relaxed">
                {{ isKhmer ? formatKhmerDate(wedding?.wedding_date) : formatEnglishDate(wedding?.wedding_date) }}
                <span class="font-normal text-[9px] text-wedding-secondary ml-1">វេលាម៉ោង ៥:០០ ល្ងាច</span>
              </div>
              <div class="text-[9px] sm:text-[10px] font-khmer-body text-wedding-text/80 leading-normal max-w-[270px] mx-auto truncate">
                នៅ {{ wedding?.venue_name_km || 'The Premier Centre Sen Sok (អគារ F)' }}
              </div>
            </div>
          </div>

          <!-- Bottom Section: Romdoul Flower Curtain Opener Button -->
          <div class="w-full flex flex-col items-center flex-shrink-0 z-10 pb-0.5">
            <button
              type="button"
              @click="triggerOpen"
              class="group relative py-2 px-5 sm:px-6 rounded-full bg-gradient-to-tr from-wedding-accent via-wedding-secondary to-[#8F6B1E] shadow-gold-glow hover:shadow-gold-glow-lg flex items-center gap-2 transform hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
            >
              <span class="absolute inset-0 rounded-full border border-white/60 animate-ping opacity-30"></span>
              <RomdoulFlower :size="24" :glow="true" />
              <div class="flex flex-col text-left">
                <span class="font-khmer-heading text-xs sm:text-sm text-white font-bold drop-shadow leading-tight">
                  {{ isKhmer ? 'បើកវាំងននសិរីមង្គល' : 'Open Royal Curtains' }}
                </span>
                <span class="text-[8px] sm:text-[9px] text-white/90 font-en-heading uppercase tracking-wider">
                  {{ isKhmer ? 'ចុចទីនេះដើម្បីចូលទស្សនា' : 'Touch to Unveil' }}
                </span>
              </div>
            </button>

            <!-- Bottom Blessing Banner -->
            <div class="w-full flex justify-center mt-1.5 pt-1.5 border-t border-wedding-secondary/20 pointer-events-none">
              <div class="flex items-center gap-1.5 text-wedding-secondary/70 text-[9px]">
                <span>🌸</span>
                <span>✦</span>
                <span class="font-khmer-heading text-[9px] text-wedding-secondary/90">សិរីសួស្តី ជ័យមង្គល វិបុលសុខ</span>
                <span>✦</span>
                <span>🌸</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ============================================================== -->
    <!-- STYLE 2, 3, 4, 5: AUTHENTIC CAMBODIAN WEDDING INVITATION COVER  -->
    <!-- Full-Bleed Edge-to-Edge on Mobile and Desktop Screens          -->
    <!-- ============================================================== -->
    <div
      v-else
      class="w-full h-full relative rounded-none px-4 py-3 sm:px-8 sm:py-6 text-center transform transition-all duration-700 interactive-card select-none border-0 flex flex-col items-center justify-between overflow-hidden shadow-none"
      :style="{
        background: 'linear-gradient(180deg, #FFFDF8 0%, #FAF4E6 45%, #F5EBD4 100%)'
      }"
      :class="{ 'translate-y-12 opacity-0': isOpening }"
    >
      <!-- Elegant Outer Gold Border Inset (Full Edge on all screens) -->
      <div class="absolute inset-1.5 sm:inset-3 border border-[#D4AF37]/70 pointer-events-none rounded-none"></div>
      <div class="absolute inset-2.5 sm:inset-4 border border-dashed border-[#D4AF37]/35 pointer-events-none rounded-none"></div>

      <!-- 4 Royal Khmer Kbach Corners at Screen Edges -->
      <div class="absolute top-1.5 left-1.5 sm:top-3 sm:left-3 pointer-events-none opacity-85 z-20">
        <KhmerKbach :size="24" type="corner" position="top-left" />
      </div>
      <div class="absolute top-1.5 right-1.5 sm:top-3 sm:right-3 pointer-events-none opacity-85 z-20">
        <KhmerKbach :size="24" type="corner" position="top-right" />
      </div>
      <div class="absolute bottom-1.5 left-1.5 sm:bottom-3 sm:left-3 pointer-events-none opacity-85 z-20">
        <KhmerKbach :size="24" type="corner" position="bottom-left" />
      </div>
      <div class="absolute bottom-1.5 right-1.5 sm:bottom-3 sm:right-3 pointer-events-none opacity-85 z-20">
        <KhmerKbach :size="24" type="corner" position="bottom-right" />
      </div>

      <!-- Subtle Damask / Royal Kbach Background Watermark -->
      <div
        class="absolute inset-0 opacity-[0.06] pointer-events-none"
        style="background-image: url('/images/backgrounds/royal-kbach.svg'); background-size: 80px 80px;"
      ></div>

      <!-- Top Section: Arch, Names & Celebration Title -->
      <div class="w-full max-w-md sm:max-w-xl flex flex-col items-center flex-shrink-0 z-10 pt-1">
        <!-- Top Ornate Golden Arch with Sheer Draped Curtains & Floral Bouquets -->
        <div class="w-full flex justify-center -mt-1 mb-1 pointer-events-none">
          <svg class="w-full max-w-[280px] sm:max-w-[340px] h-12 sm:h-14" viewBox="0 0 320 80" fill="none">
            <!-- Sheer draped wedding curtains inside arch (វាំងននស្បៃ) -->
            <path d="M160 12 C130 14, 70 20, 45 68 C55 64, 75 56, 85 45 C110 32, 140 22, 160 12 Z" fill="url(#sheerDrapeL)" opacity="0.85" />
            <path d="M160 12 C190 14, 250 20, 275 68 C265 64, 245 56, 235 45 C210 32, 180 22, 160 12 Z" fill="url(#sheerDrapeR)" opacity="0.85" />
            <!-- Curtain tie-back cords (Left & Right) -->
            <path d="M40 50 C48 52, 54 55, 60 52" stroke="#D4AF37" stroke-width="2" stroke-linecap="round" />
            <circle cx="50" cy="52" r="3" fill="#D4AF37" />
            <path d="M280 50 C272 52, 266 55, 260 52" stroke="#D4AF37" stroke-width="2" stroke-linecap="round" />
            <circle cx="270" cy="52" r="3" fill="#D4AF37" />
            
            <!-- Outer Royal Golden Arch (Kbach Filigree) -->
            <path d="M30 75 L30 45 C30 18, 90 6, 160 6 C230 6, 290 18, 290 45 L290 75" stroke="url(#goldGradCover2)" stroke-width="2.5" stroke-linecap="round" />
            <path d="M38 75 L38 46 C38 23, 94 12, 160 12 C226 12, 282 23, 282 46 L282 75" stroke="#D4AF37" stroke-width="1" stroke-dasharray="2 3" opacity="0.75" />
            
            <!-- Side Floral Bouquets on Columns -->
            <!-- Left Floral Cluster -->
            <circle cx="30" cy="56" r="6" fill="#F8B4C0" />
            <circle cx="30" cy="56" r="4" fill="#E86A82" />
            <circle cx="24" cy="64" r="5" fill="#FFF2F4" />
            <circle cx="36" cy="63" r="5" fill="#D8B4E2" />
            <circle cx="28" cy="71" r="5" fill="#FAD0C4" />
            <ellipse cx="20" cy="58" rx="4" ry="2" fill="#88A878" transform="rotate(-30 20 58)" />
            <ellipse cx="38" cy="70" rx="4" ry="2" fill="#88A878" transform="rotate(30 38 70)" />
            
            <!-- Right Floral Cluster -->
            <circle cx="290" cy="56" r="6" fill="#F8B4C0" />
            <circle cx="290" cy="56" r="4" fill="#E86A82" />
            <circle cx="284" cy="63" r="5" fill="#D8B4E2" />
            <circle cx="296" cy="64" r="5" fill="#FFF2F4" />
            <circle cx="292" cy="71" r="5" fill="#FAD0C4" />
            <ellipse cx="300" cy="58" rx="4" ry="2" fill="#88A878" transform="rotate(30 300 58)" />
            <ellipse cx="282" cy="70" rx="4" ry="2" fill="#88A878" transform="rotate(-30 282 70)" />

            <!-- Center Golden Crown Crest -->
            <path d="M160 0 L165 10 L176 13 L166 17 L160 27 L154 17 L144 13 L155 10 Z" fill="url(#goldGradCover2)" />
            <circle cx="160" cy="13" r="3" fill="#FFFDF8" />
            
            <defs>
              <linearGradient id="sheerDrapeL" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.95"/>
                <stop offset="60%" stop-color="#FBF7EE" stop-opacity="0.8"/>
                <stop offset="100%" stop-color="#EEDFBE" stop-opacity="0.6"/>
              </linearGradient>
              <linearGradient id="sheerDrapeR" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.95"/>
                <stop offset="60%" stop-color="#FBF7EE" stop-opacity="0.8"/>
                <stop offset="100%" stop-color="#EEDFBE" stop-opacity="0.6"/>
              </linearGradient>
              <linearGradient id="goldGradCover2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#FBEA9D"/>
                <stop offset="40%" stop-color="#D4AF37"/>
                <stop offset="70%" stop-color="#C9A24A"/>
                <stop offset="100%" stop-color="#8F6B1E"/>
              </linearGradient>
            </defs>
          </svg>
        </div>

        <!-- 1. Couple Names with Interlocking Gold Hearts Calligraphy -->
        <div class="text-center mb-0.5 w-full">
          <div class="flex items-center justify-center gap-2 text-wedding-primary font-khmer-heading text-base sm:text-lg font-bold leading-tight">
            <span>{{ wedding?.groom_name_km || 'វ៉េត សីហា' }}</span>
            <!-- Interlocking Gold Hearts -->
            <span class="inline-flex items-center text-[#C9A24A] text-sm animate-pulse filter drop-shadow">
              <svg class="w-4 h-4 fill-current inline-block" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </span>
            <span>{{ wedding?.bride_name_km || 'ស ណារី' }}</span>
          </div>
          <div class="text-[10px] sm:text-[11px] font-en-heading text-[#8F6B1E] uppercase tracking-widest mt-0.5 font-semibold">
            {{ wedding?.groom_name_en || 'Vet Seyha' }} & {{ wedding?.bride_name_en || 'Sar Nary' }}
          </div>
        </div>

        <!-- 2. Golden Embossed Celebration Title (សិរីមង្គលអាពាហ៍ពិពាហ៍) -->
        <div class="my-0.5 text-center">
          <h2
            class="font-khmer-heading text-lg sm:text-xl font-bold tracking-wide"
            style="line-height: 1.7 !important; background: linear-gradient(135deg, #9C6B15 0%, #D4AF37 35%, #FBF3C7 50%, #C9A24A 70%, #7E4F09 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; filter: drop-shadow(0 1px 2px rgba(143,107,30,0.3));"
          >
            សិរីមង្គលអាពាហ៍ពិពាហ៍
          </h2>
          <div class="text-[11px] sm:text-xs font-khmer-body font-semibold text-[#641D2D]/85 -mt-0.5">
            សូមគោរពអញ្ជើញ
          </div>
        </div>

        <!-- Ornate Horizontal Gold Divider Bar -->
        <div class="w-44 sm:w-52 flex items-center justify-center gap-1.5 my-0.5 text-wedding-secondary/70">
          <span class="flex-1 h-px bg-gradient-to-r from-transparent via-wedding-secondary/60 to-wedding-secondary"></span>
          <span class="text-[9px]">❖</span>
          <span class="flex-1 h-px bg-gradient-to-l from-transparent via-wedding-secondary/60 to-wedding-secondary"></span>
        </div>
      </div>

      <!-- Middle Section: Guest Name Box & Venue/Date -->
      <div class="w-full max-w-md sm:max-w-xl flex flex-col items-center flex-shrink-0 my-auto z-10 py-1">
        <!-- 3. Dedicated Golden Framed Guest Name Badge -->
        <div class="w-full max-w-[280px] sm:max-w-[310px] my-1">
          <div class="text-[10px] text-wedding-text/70 font-khmer-body mb-0.5">
            សូមគោរពអញ្ជើញ ឯកឧត្តម លោកជំទាវ លោក លោកស្រី អ្នកនាងកញ្ញា
          </div>
          <!-- Golden Embossed Stationery Name Box -->
          <div
            class="w-full py-2 px-3 rounded-xl bg-white/95 border-2 border-wedding-secondary shadow-[0_2px_10px_rgba(201,162,74,0.22)] flex items-center justify-center relative overflow-hidden"
          >
            <!-- Gold inner corner marks -->
            <div class="absolute top-1 left-1.5 w-1.5 h-1.5 border-t border-l border-wedding-secondary/60"></div>
            <div class="absolute top-1 right-1.5 w-1.5 h-1.5 border-t border-r border-wedding-secondary/60"></div>
            <div class="absolute bottom-1 left-1.5 w-1.5 h-1.5 border-b border-l border-wedding-secondary/60"></div>
            <div class="absolute bottom-1 right-1.5 w-1.5 h-1.5 border-b border-r border-wedding-secondary/60"></div>

            <div class="text-base sm:text-lg font-bold text-wedding-primary font-khmer-heading truncate max-w-full" style="line-height: 1.6 !important;">
              {{ guestName || 'ភ្ញៀវកិត្តិយស' }}
            </div>
          </div>
        </div>

        <!-- 4. Wedding Date, Time & Venue Inscription -->
        <div class="my-1 text-center space-y-0.5 text-[#3C2925]/85">
          <div class="text-[11px] sm:text-xs font-bold text-wedding-primary font-khmer-heading leading-relaxed">
            {{ isKhmer ? formatKhmerDate(wedding?.wedding_date) : formatEnglishDate(wedding?.wedding_date) }}
            <span class="font-normal text-[10px] text-wedding-secondary ml-1">វេលាម៉ោង ៥:០០ ល្ងាច</span>
          </div>
          <div class="text-[10px] sm:text-[11px] font-khmer-body text-wedding-text/80 leading-normal max-w-[290px] mx-auto truncate">
            នៅ {{ wedding?.venue_name_km || 'The Premier Centre Sen Sok (អគារ F)' }}
          </div>
          <div class="text-[9px] text-[#7A5A1E] font-khmer-body">
            {{ wedding?.venue_address_km || 'រាជធានីភ្នំពេញ' }}
          </div>
        </div>
      </div>

      <!-- Bottom Section: Interactive Action Trigger & Blessing -->
      <div class="w-full max-w-md sm:max-w-xl flex flex-col items-center flex-shrink-0 z-10 pb-1">
        <!-- 5. Interactive Action Mechanism -->
          <!-- VARIANT A: SCRATCH TO REVEAL (Interactive Gold Canvas) -->
          <div v-if="currentStyle === 'scratch'" class="mt-2 flex flex-col items-center w-full">
            <div class="relative w-full max-w-[270px] h-24 rounded-2xl overflow-hidden border-2 border-wedding-secondary/60 shadow-md touch-none">
              <div class="absolute inset-0 bg-gradient-to-br from-[#FFFDF5] to-[#FDF4DC] flex flex-col items-center justify-center p-2 text-center">
                <RomdoulFlower :size="36" :glow="true" custom-class="mb-0.5" />
                <span class="font-khmer-heading text-xs text-wedding-primary font-bold">សូមគោរពអញ្ជើញចូលរួម</span>
                <span class="text-[9px] text-wedding-secondary font-mono tracking-wider">100% UNLOCKED</span>
              </div>
              <canvas
                ref="scratchCanvasRef"
                class="absolute inset-0 w-full h-full cursor-crosshair z-10 transition-opacity duration-500"
                :class="{ 'opacity-0 pointer-events-none': scratchCompleted }"
                @mousedown="startScratch"
                @mousemove="drawScratch"
                @mouseup="stopScratch"
                @mouseleave="stopScratch"
                @touchstart="startScratchTouch"
                @touchmove="drawScratchTouch"
                @touchend="stopScratch"
              ></canvas>
            </div>
            <div class="mt-2 flex items-center justify-between w-full max-w-[270px] text-[11px]">
              <span class="font-khmer-body text-wedding-primary font-semibold flex items-center gap-1">
                <span>✨</span>
                <span>{{ isKhmer ? 'កោសដើម្បីបើក' : 'Scratch to open' }}</span>
              </span>
              <button
                type="button"
                @click="forceRevealScratch"
                class="text-wedding-secondary hover:underline font-bold text-[10px]"
              >
                {{ isKhmer ? 'បើកទាំងអស់' : 'Reveal All' }} ›
              </button>
            </div>
          </div>

          <!-- VARIANT B: SLIDE TO UNLOCK -->
          <div v-else-if="currentStyle === 'slide_unlock'" class="mt-2 flex flex-col items-center w-full">
            <div
              ref="sliderTrackRef"
              class="relative w-full max-w-[280px] h-13 rounded-full bg-white/95 border-2 border-wedding-secondary/60 shadow-inner flex items-center px-1.5 select-none overflow-hidden touch-none"
            >
              <div
                class="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-wedding-accent/30 via-wedding-secondary/40 to-wedding-accent/60 transition-all rounded-full pointer-events-none"
                :style="{ width: `${sliderOffset + 24}px` }"
              ></div>
              <div
                class="absolute inset-0 flex items-center justify-center pointer-events-none text-xs font-bold text-wedding-primary/70 transition-opacity font-khmer-body"
                :style="{ opacity: 1 - sliderProgress }"
              >
                <span class="animate-pulse flex items-center gap-1">
                  <span>👉</span>
                  <span>{{ isKhmer ? 'អូសផ្ការំដួលបើកសំបុត្រ' : 'Slide Romdoul to Open' }}</span>
                </span>
              </div>
              <div
                class="w-10 h-10 rounded-full bg-gradient-to-tr from-wedding-accent via-wedding-secondary to-[#8F6B1E] flex items-center justify-center text-xl shadow-gold-glow cursor-grab active:cursor-grabbing z-10 transition-transform select-none p-1"
                :style="{
                  transform: `translateX(${sliderOffset}px)`,
                  transition: isDraggingSlider ? 'none' : 'transform 0.3s ease'
                }"
                @mousedown="startSliderDrag"
                @touchstart="startSliderTouch"
              >
                <RomdoulFlower :size="26" />
              </div>
            </div>
            <span class="mt-1.5 text-[9px] text-wedding-text/60 font-light font-khmer-body">
              {{ isKhmer ? 'អូសផ្ការំដួលមាសទៅស្តាំដើម្បីបើក' : 'Drag the golden Romdoul to unlock' }}
            </span>
          </div>

          <!-- VARIANT C: 3D ENVELOPE FLAP -->
          <div v-else-if="currentStyle === 'envelope_flap'" class="mt-2 flex flex-col items-center w-full">
            <button
              type="button"
              @click="triggerOpen"
              class="group relative z-10 py-2.5 px-6 rounded-full bg-gradient-to-tr from-wedding-accent via-wedding-secondary to-[#8F6B1E] shadow-gold-glow flex items-center gap-2 transform hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
              :title="t('common.open_invitation')"
            >
              <RomdoulFlower :size="24" :glow="true" />
              <span class="font-khmer-heading text-xs text-white font-bold drop-shadow">
                {{ isKhmer ? 'បត់បើកស្រោមសំបុត្រ' : 'Unfold Envelope' }}
              </span>
            </button>
          </div>

          <!-- VARIANT D: CLASSIC ROMDOUL WAX SEAL (Tap to Open) -->
          <div v-else class="mt-2 flex flex-col items-center">
            <button
              type="button"
              @click="triggerOpen"
              class="group relative w-16 h-16 sm:w-18 sm:h-18 rounded-full flex items-center justify-center shadow-gold-glow hover:shadow-gold-glow-lg transform hover:scale-110 active:scale-90 transition-all duration-300 interactive-btn cursor-pointer p-2"
              :style="{
                background: 'linear-gradient(135deg, var(--wedding-accent, #E5C77A), var(--wedding-secondary, #C9A24A), #8F6B1E)'
              }"
              :title="t('common.open_invitation')"
            >
              <!-- Pulsing Outer Ring -->
              <span
                class="absolute inset-0 rounded-full border-2 animate-ping opacity-35"
                :style="{ borderColor: 'var(--wedding-accent, #E5C77A)' }"
              ></span>
              <!-- Engraved golden filigree rim -->
              <span class="absolute inset-1 rounded-full border border-dashed border-white/60 pointer-events-none"></span>

              <!-- Romdoul Flower SVG -->
              <RomdoulFlower :size="40" :glow="true" custom-class="drop-shadow group-hover:scale-110 group-active:scale-95 transition-transform" />
            </button>

            <span class="mt-2 text-[11px] sm:text-xs font-bold text-wedding-primary font-khmer-heading animate-pulse flex items-center gap-1">
              <span class="text-wedding-secondary">👉</span>
              <span>{{ isKhmer ? 'ចុចទីនេះ ដើម្បីបើកលិខិតអញ្ជើញ' : 'Click Here to Open Invitation' }}</span>
              <span class="text-wedding-secondary">👈</span>
            </span>
          </div>

          <!-- Bottom Floral Garland & Blessing Banner -->
          <div class="w-full flex justify-center mt-2 pt-2 border-t border-wedding-secondary/20 pointer-events-none">
            <div class="flex items-center gap-2 text-wedding-secondary/60 text-[10px]">
              <span>🌸</span>
              <span>✦</span>
              <span class="font-khmer-heading text-[10px] text-wedding-secondary/80">សិរីសួស្តី ជ័យមង្គល វិបុលសុខ</span>
              <span>✦</span>
              <span>🌸</span>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script setup lang="ts">
import RomdoulFlower from './RomdoulFlower.vue'
import KhmerKbach from './KhmerKbach.vue'
import type { WeddingSettings } from '~~/shared/types/wedding'
import type { OpeningAnimationStyle } from '~~/shared/types/appearance'
import { formatKhmerDate, formatEnglishDate } from '~~/app/utils/date'

const props = defineProps<{
  guestName?: string
  wedding?: WeddingSettings | null
  appearance?: any
  absolute?: boolean
}>()

const emit = defineEmits<{
  (e: 'opening'): void
  (e: 'opened'): void
}>()

const { isKhmer, t } = useLocale()
const opened = ref(false)
const isOpening = ref(false)

// Resolve configured style with backward-compatible fallbacks
const currentStyle = computed<OpeningAnimationStyle>(() => {
  const s = props.appearance?.opening_animation_config?.style
  if (!s || s === 'golden_seal' || s === 'romdoul_seal' || s === 'khmer_seal' || s === 'lotus' || s === 'floral' || s === 'fade') {
    return 'click_seal'
  }
  if (s === 'none') return 'direct'
  return s
})

// Play royal crystal chime when opening (if sound enabled)
const playRoyalChime = () => {
  if (!props.appearance?.opening_animation_config?.sound_enabled) return
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioContextClass) return
    const ctx = new AudioContextClass()
    const now = ctx.currentTime

    // Ethereal pentatonic chord (C5, E5, G5, B5, C6)
    const freqs = [523.25, 659.25, 783.99, 987.77, 1046.5]
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now + idx * 0.08)
      gain.gain.setValueAtTime(0, now + idx * 0.08)
      gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.08 + 0.04)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 1.2)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now + idx * 0.08)
      osc.stop(now + idx * 0.08 + 1.25)
    })
  } catch (_) {
    // Ignore audio autoplay restrictions
  }
}

// Master Open Trigger
const triggerOpen = () => {
  if (isOpening.value) return
  isOpening.value = true
  playRoyalChime()
  emit('opening')

  const dur = Math.max((props.appearance?.opening_animation_config?.duration || 1.2) * 1000, 800)
  setTimeout(() => {
    opened.value = true
    emit('opened')
  }, dur)
}

// ==============================================================
// SCRATCH CARD CANVAS LOGIC
// ==============================================================
const scratchCanvasRef = ref<HTMLCanvasElement | null>(null)
const scratchCompleted = ref(false)
let isScratching = false
let scratchCheckCounter = 0

const initScratchCanvas = () => {
  const canvas = scratchCanvasRef.value
  if (!canvas) return
  const rect = canvas.getBoundingClientRect()
  canvas.width = rect.width * 2
  canvas.height = rect.height * 2
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.scale(2, 2)

  // Golden metallic gradient fill
  const grad = ctx.createLinearGradient(0, 0, rect.width, rect.height)
  grad.addColorStop(0, '#E5C77A')
  grad.addColorStop(0.3, '#C9A24A')
  grad.addColorStop(0.6, '#FFF2CE')
  grad.addColorStop(0.85, '#C9A24A')
  grad.addColorStop(1, '#8F6B1E')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, rect.width, rect.height)

  // Decorative border
  ctx.strokeStyle = '#8F6B1E'
  ctx.lineWidth = 3
  ctx.strokeRect(3, 3, rect.width - 6, rect.height - 6)

  // Traditional watermark text
  ctx.fillStyle = '#641D2D'
  ctx.font = 'bold 12px "Kantumruy Pro", sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('✨ កោសផ្ការំដួលបើកសំបុត្រ ✨', rect.width / 2, rect.height / 2 - 8)
  ctx.font = '9px "Inter", sans-serif'
  ctx.fillStyle = '#3C2925'
  ctx.fillText('SCRATCH ROMDOUL TO REVEAL', rect.width / 2, rect.height / 2 + 10)
}

const scratchPoint = (x: number, y: number) => {
  const canvas = scratchCanvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.globalCompositeOperation = 'destination-out'
  ctx.beginPath()
  ctx.arc(x * 2, y * 2, 32, 0, Math.PI * 2)
  ctx.fill()

  // Periodically check scratched percentage
  scratchCheckCounter++
  if (scratchCheckCounter % 8 === 0) {
    checkScratchProgress()
  }
}

const checkScratchProgress = () => {
  const canvas = scratchCanvasRef.value
  if (!canvas || scratchCompleted.value) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  try {
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const totalPixels = imgData.data.length / 4
    let transparentCount = 0

    // Sample every 4th pixel for high performance
    for (let i = 3; i < imgData.data.length; i += 16) {
      if (imgData.data[i] === 0) transparentCount++
    }

    const ratio = transparentCount / (totalPixels / 4)
    if (ratio > 0.32) {
      scratchCompleted.value = true
      setTimeout(() => {
        triggerOpen()
      }, 400)
    }
  } catch (_) {
    // If CORS or tainted canvas, fallback gracefully
  }
}

const forceRevealScratch = () => {
  scratchCompleted.value = true
  triggerOpen()
}

const startScratch = (e: MouseEvent) => {
  isScratching = true
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  scratchPoint(e.clientX - rect.left, e.clientY - rect.top)
}

const drawScratch = (e: MouseEvent) => {
  if (!isScratching) return
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  scratchPoint(e.clientX - rect.left, e.clientY - rect.top)
}

const stopScratch = () => {
  isScratching = false
  checkScratchProgress()
}

const startScratchTouch = (e: TouchEvent) => {
  if (!e.touches[0]) return
  isScratching = true
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  scratchPoint(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top)
}

const drawScratchTouch = (e: TouchEvent) => {
  if (!isScratching || !e.touches[0]) return
  if (e.cancelable) e.preventDefault()
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  scratchPoint(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top)
}

// ==============================================================
// SLIDE TO UNLOCK LOGIC
// ==============================================================
const sliderTrackRef = ref<HTMLElement | null>(null)
const sliderOffset = ref(0)
const isDraggingSlider = ref(false)
let sliderStartX = 0
let sliderMaxDrag = 240

const sliderProgress = computed(() => {
  return Math.min(Math.max(sliderOffset.value / Math.max(sliderMaxDrag, 1), 0), 1)
})

const startSliderDrag = (e: MouseEvent) => {
  isDraggingSlider.value = true
  sliderStartX = e.clientX - sliderOffset.value
  if (sliderTrackRef.value) {
    sliderMaxDrag = sliderTrackRef.value.clientWidth - 56
  }
  window.addEventListener('mousemove', onSliderMouseMove)
  window.addEventListener('mouseup', onSliderMouseUp)
}

const onSliderMouseMove = (e: MouseEvent) => {
  if (!isDraggingSlider.value) return
  const newOffset = Math.min(Math.max(e.clientX - sliderStartX, 0), sliderMaxDrag)
  sliderOffset.value = newOffset
  if (newOffset >= sliderMaxDrag * 0.85) {
    completeSlider()
  }
}

const onSliderMouseUp = () => {
  if (!isDraggingSlider.value) return
  isDraggingSlider.value = false
  window.removeEventListener('mousemove', onSliderMouseMove)
  window.removeEventListener('mouseup', onSliderMouseUp)
  if (sliderOffset.value < sliderMaxDrag * 0.85) {
    sliderOffset.value = 0
  }
}

const startSliderTouch = (e: TouchEvent) => {
  if (!e.touches[0]) return
  isDraggingSlider.value = true
  sliderStartX = e.touches[0].clientX - sliderOffset.value
  if (sliderTrackRef.value) {
    sliderMaxDrag = sliderTrackRef.value.clientWidth - 56
  }
  window.addEventListener('touchmove', onSliderTouchMove, { passive: false })
  window.addEventListener('touchend', onSliderTouchEnd)
}

const onSliderTouchMove = (e: TouchEvent) => {
  if (!isDraggingSlider.value || !e.touches[0]) return
  if (e.cancelable) e.preventDefault()
  const newOffset = Math.min(Math.max(e.touches[0].clientX - sliderStartX, 0), sliderMaxDrag)
  sliderOffset.value = newOffset
  if (newOffset >= sliderMaxDrag * 0.85) {
    completeSlider()
  }
}

const onSliderTouchEnd = () => {
  if (!isDraggingSlider.value) return
  isDraggingSlider.value = false
  window.removeEventListener('touchmove', onSliderTouchMove)
  window.removeEventListener('touchend', onSliderTouchEnd)
  if (sliderOffset.value < sliderMaxDrag * 0.85) {
    sliderOffset.value = 0
  }
}

const completeSlider = () => {
  isDraggingSlider.value = false
  sliderOffset.value = sliderMaxDrag
  window.removeEventListener('mousemove', onSliderMouseMove)
  window.removeEventListener('mouseup', onSliderMouseUp)
  window.removeEventListener('touchmove', onSliderTouchMove)
  window.removeEventListener('touchend', onSliderTouchEnd)
  setTimeout(() => {
    triggerOpen()
  }, 200)
}

// Watch style changes or initialization
watch(
  () => currentStyle.value,
  (newStyle) => {
    if (newStyle === 'direct') {
      opened.value = true
      emit('opened')
    } else if (newStyle === 'scratch') {
      nextTick(() => {
        initScratchCanvas()
      })
    }
  },
  { immediate: true }
)

onMounted(() => {
  if (currentStyle.value === 'direct') {
    opened.value = true
    emit('opened')
  } else if (currentStyle.value === 'scratch') {
    nextTick(() => {
      initScratchCanvas()
    })
  }
})

// External API exposed for admin live preview testing
defineExpose({
  reset: () => {
    opened.value = false
    isOpening.value = false
    scratchCompleted.value = false
    sliderOffset.value = 0
    if (currentStyle.value === 'scratch') {
      nextTick(() => {
        initScratchCanvas()
      })
    }
  }
})
</script>
