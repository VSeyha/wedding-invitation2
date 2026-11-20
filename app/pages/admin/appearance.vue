<template>
  <div>
    <!-- Top Action Bar -->
    <div class="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-[#641D2D] font-en-heading">{{ t('admin.appearance') }}</h1>
        <p class="text-sm text-[#3C2925]/60 mt-1">Customize Khmer themes, colors, background styling, particle animations, and test live in real time.</p>
      </div>
      <div class="flex flex-wrap items-center gap-2 self-start">
        <span v-if="config.is_published" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200 mr-2">
          <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          Live Website Active
        </span>
        <span v-else class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 mr-2">
          <span>📝</span> Draft Mode
        </span>
        <button @click="resetToDefault" class="btn-secondary text-xs">
          🔄 Restore Default
        </button>
        <button @click="save(false)" :disabled="saving" class="btn-secondary text-xs">
          {{ saving ? 'Saving...' : '💾 Save Draft' }}
        </button>
        <button @click="save(true)" :disabled="saving" class="btn-primary text-xs">
          {{ saving ? 'Publishing...' : '🚀 ' + t('admin.publish') }}
        </button>
      </div>
    </div>

    <!-- Layout: Settings Controls on Left (7 cols), Live Interactive Preview on Right (5 cols) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <!-- Settings Column (7 cols) -->
      <div class="lg:col-span-7 space-y-6">
        <!-- 1. Preset Themes -->
        <div class="bg-white rounded-xl border border-[#C9A24A]/20 p-5 shadow-sm">
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-sm font-bold uppercase tracking-wider text-[#641D2D] flex items-center gap-2">
              <span>🎨</span> Preset Khmer Themes
            </h2>
            <span class="text-xs text-[#3C2925]/60 font-medium">Click any preset to preview instantly</span>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <button
              v-for="(preset, key) in PRESET_THEMES"
              :key="key"
              @click="applyPreset(key, preset)"
              class="p-3.5 rounded-xl border text-left transition-all relative overflow-hidden group hover:shadow-md cursor-pointer"
              :class="config.theme_name === preset.name ? 'border-[#641D2D] ring-2 ring-[#641D2D]/30 shadow-md bg-[#FAF0E6]/30' : 'border-gray-200 hover:border-[#C9A24A]/70 bg-white'"
            >
              <div class="flex items-center gap-2 mb-2">
                <span class="w-4 h-4 rounded-full border border-black/10 shadow-sm" :style="{ backgroundColor: preset.colors.primary }"></span>
                <span class="w-4 h-4 rounded-full border border-black/10 shadow-sm" :style="{ backgroundColor: preset.colors.secondary }"></span>
                <span class="w-4 h-4 rounded-full border border-black/10 shadow-sm" :style="{ backgroundColor: preset.colors.bg }"></span>
                <span class="w-4 h-4 rounded-full border border-black/10 shadow-sm" :style="{ backgroundColor: preset.colors.accent }"></span>
              </div>
              <div class="text-xs font-bold text-[#3C2925] truncate">{{ preset.name }}</div>
              <div class="text-[11px] text-[#641D2D] font-khmer-body truncate mt-0.5">{{ preset.name_km }}</div>
              <div v-if="config.theme_name === preset.name" class="absolute top-2 right-2 text-xs text-[#641D2D] font-bold">
                ✓
              </div>
            </button>
          </div>
        </div>

        <!-- 2. Color Palette Customizer -->
        <div class="bg-white rounded-xl border border-[#C9A24A]/20 p-5 shadow-sm">
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-sm font-bold uppercase tracking-wider text-[#641D2D] flex items-center gap-2">
              <span>🖌️</span> Custom Palette Colors
            </h2>
            <span class="text-xs text-[#3C2925]/60 font-mono">Real-time Preview</span>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div v-for="(val, colKey) in config.theme_config" :key="colKey" class="flex flex-col gap-1">
              <label class="text-[11px] font-medium text-[#3C2925]/70 capitalize flex items-center justify-between">
                <span>{{ colKey }}</span>
              </label>
              <div class="flex items-center gap-2 border border-gray-200 rounded-lg p-1.5 bg-gray-50/60 focus-within:ring-2 focus-within:ring-[#641D2D]/20 transition-all">
                <input
                  type="color"
                  v-model="config.theme_config[colKey]"
                  class="w-7 h-7 rounded border-0 cursor-pointer p-0 bg-transparent flex-shrink-0"
                />
                <input
                  type="text"
                  v-model="config.theme_config[colKey]"
                  class="w-18 text-xs font-mono uppercase bg-transparent focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- 3. Background Settings -->
        <div class="bg-white rounded-xl border border-[#C9A24A]/20 p-5 shadow-sm">
          <h2 class="text-sm font-bold uppercase tracking-wider text-[#641D2D] mb-3 flex items-center gap-2">
            <span>🖼️</span> Background Type & Styling
          </h2>
          <div class="space-y-4">
            <div>
              <label class="form-label">Background Style Type</label>
              <div class="grid grid-cols-3 sm:grid-cols-5 gap-2">
                <button
                  v-for="bType in ['none', 'solid', 'gradient', 'image', 'animated']"
                  :key="bType"
                  type="button"
                  @click="config.background_config.type = bType as any"
                  class="px-3 py-1.5 rounded-lg border text-xs capitalize transition-all cursor-pointer font-medium"
                  :class="config.background_config.type === bType ? 'bg-[#641D2D] text-white border-[#641D2D] shadow-sm' : 'bg-gray-50 border-gray-200 text-[#3C2925] hover:border-[#C9A24A]'"
                >
                  {{ bType }}
                </button>
              </div>
            </div>

            <!-- Gradient settings -->
            <div v-if="config.background_config.type === 'gradient'" class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label class="form-label">Gradient Direction</label>
                <select v-model="config.background_config.gradient_direction" class="input-field">
                  <option value="to bottom">To Bottom (Top to Bottom)</option>
                  <option value="to bottom right">Diagonal (To Bottom Right)</option>
                  <option value="to right">Horizontal (To Right)</option>
                  <option value="135deg">Luxury 135° Angle</option>
                </select>
              </div>
              <div>
                <label class="form-label">Gradient Depth ({{ Math.round((config.background_config.overlay_opacity || 0.15) * 100) }}%)</label>
                <input type="range" min="0.05" max="0.8" step="0.05" v-model.number="config.background_config.overlay_opacity" class="w-full accent-[#641D2D] mt-2" />
              </div>
            </div>

            <!-- Image settings -->
            <div v-if="config.background_config.type === 'image'" class="space-y-3 pt-2">
              <div>
                <label class="form-label">Background Pattern / Image URL</label>
                <input v-model="config.background_config.image_url" placeholder="https://example.com/khmer-pattern.jpg" class="input-field" />
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="form-label">Image Opacity ({{ Math.round((config.background_config.opacity || 0.15) * 100) }}%)</label>
                  <input type="range" min="0.05" max="1" step="0.05" v-model.number="config.background_config.opacity" class="w-full accent-[#641D2D] mt-2" />
                </div>
                <div>
                  <label class="form-label">Overlay Color</label>
                  <div class="flex items-center gap-2 border border-gray-200 rounded-lg p-1.5 bg-gray-50">
                    <input type="color" v-model="config.background_config.overlay_color" class="w-7 h-7 rounded border-0 cursor-pointer p-0 bg-transparent" />
                    <input type="text" v-model="config.background_config.overlay_color" class="w-18 text-xs font-mono uppercase bg-transparent" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 4. Background Animation Settings -->
        <div class="bg-white rounded-xl border border-[#C9A24A]/20 p-5 shadow-sm">
          <div class="flex items-center justify-between mb-3">
            <div>
              <h2 class="text-sm font-bold uppercase tracking-wider text-[#641D2D] flex items-center gap-2">
                <span>✨</span> Falling Particle Animation
              </h2>
              <p class="text-xs text-[#3C2925]/60 mt-0.5">Golden petals and luxury floating dust particles</p>
            </div>
            <label class="inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="config.animation_config.enabled" class="sr-only peer" />
              <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#641D2D]"></div>
              <span class="ml-2 text-xs font-medium text-[#3C2925]">{{ config.animation_config.enabled ? 'Enabled' : 'Disabled' }}</span>
            </label>
          </div>

          <div v-if="config.animation_config.enabled" class="space-y-4 pt-2">
            <div>
              <label class="form-label">Particle Preset</label>
              <select v-model="config.animation_config.preset" class="input-field">
                <option value="lotus_petals">🪷 Golden Lotus Petals (Falling petals)</option>
                <option value="particles">✨ Sparkling Golden Dust (Floating glitter)</option>
                <option value="hearts">💖 Romantic Hearts (Soft drifting)</option>
                <option value="lights">💫 Floating Bokeh Lights</option>
                <option value="none">Static (None)</option>
              </select>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label class="form-label">Speed ({{ config.animation_config.speed }}x)</label>
                <input type="range" min="0.3" max="2.5" step="0.1" v-model.number="config.animation_config.speed" class="w-full accent-[#641D2D] mt-2" />
              </div>
              <div>
                <label class="form-label">Quantity ({{ config.animation_config.particle_quantity }} particles)</label>
                <input type="range" min="10" max="60" step="5" v-model.number="config.animation_config.particle_quantity" class="w-full accent-[#641D2D] mt-2" />
              </div>
              <div>
                <label class="form-label">Opacity ({{ Math.round(config.animation_config.opacity * 100) }}%)</label>
                <input type="range" min="0.2" max="1" step="0.05" v-model.number="config.animation_config.opacity" class="w-full accent-[#641D2D] mt-2" />
              </div>
            </div>
          </div>
        </div>

        <!-- 5. Opening Envelope Animation -->
        <div class="bg-white rounded-xl border border-[#C9A24A]/20 p-5 shadow-sm">
          <div class="flex items-center justify-between mb-3">
            <div>
              <h2 class="text-sm font-bold uppercase tracking-wider text-[#641D2D] flex items-center gap-2">
                <span>💌</span> Opening Royal Seal Envelope
              </h2>
              <p class="text-xs text-[#3C2925]/60 mt-0.5">Custom envelope seal presented to guests upon opening</p>
            </div>
            <button
              type="button"
              @click="testOpeningAnimation"
              class="px-3 py-1.5 rounded-lg bg-[#FAF0E6] text-[#641D2D] border border-[#C9A24A]/40 text-xs font-bold hover:bg-[#EDE5D4] transition-all"
            >
              ▶ Test In Preview
            </button>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="form-label">Seal Motif Style</label>
              <select v-model="config.opening_animation_config.style" class="input-field">
                <option value="golden_seal">Golden Royal Lotus Seal (សិរីមង្គលផ្កាឈូក)</option>
                <option value="khmer_seal">Traditional Khmer Motif (ក្បាច់បុរាណ)</option>
                <option value="lotus">Royal Blossom (ផ្កាឈូកមាស)</option>
                <option value="fade">Simple Elegant Fade</option>
                <option value="none">Direct Open (No Envelope)</option>
              </select>
            </div>
            <div>
              <label class="form-label">Animation Duration ({{ config.opening_animation_config.duration }}s)</label>
              <input type="range" min="0.8" max="3" step="0.2" v-model.number="config.opening_animation_config.duration" class="w-full accent-[#641D2D] mt-2" />
            </div>
          </div>
        </div>
      </div>

      <!-- Live Interactive Preview Column (5 cols) -->
      <div class="lg:col-span-5">
        <div class="sticky top-6 space-y-3">
          <!-- Live Preview Control Header -->
          <div class="bg-white rounded-xl border border-[#C9A24A]/20 p-3 shadow-sm flex flex-col gap-2">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                <span class="text-xs font-bold uppercase tracking-wider text-[#641D2D]">Interactive Live Preview</span>
              </div>
              <!-- Mobile / Desktop Switcher -->
              <div class="flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg text-xs">
                <button
                  @click="previewDevice = 'mobile'"
                  class="px-2.5 py-1 rounded-md transition-all cursor-pointer font-medium"
                  :class="previewDevice === 'mobile' ? 'bg-white shadow-sm font-bold text-[#641D2D]' : 'text-gray-500 hover:text-black'"
                >
                  📱 Mobile
                </button>
                <button
                  @click="previewDevice = 'desktop'"
                  class="px-2.5 py-1 rounded-md transition-all cursor-pointer font-medium"
                  :class="previewDevice === 'desktop' ? 'bg-white shadow-sm font-bold text-[#641D2D]' : 'text-gray-500 hover:text-black'"
                >
                  💻 Desktop
                </button>
              </div>
            </div>

            <!-- Section Selector Pills -->
            <div class="flex items-center gap-1 overflow-x-auto pb-1 text-[11px] scrollbar-none">
              <button
                v-for="sec in previewSections"
                :key="sec.id"
                @click="activeSection = sec.id"
                class="px-2.5 py-1 rounded-full whitespace-nowrap transition-all cursor-pointer"
                :class="activeSection === sec.id ? 'bg-[#641D2D] text-white font-bold shadow-sm' : 'bg-gray-100 text-[#3C2925]/70 hover:bg-gray-200'"
              >
                {{ sec.label }}
              </button>
            </div>
          </div>

          <!-- Realistic Device Frame -->
          <div class="flex justify-center">
            <!-- Mobile Frame Container -->
            <div
              v-if="previewDevice === 'mobile'"
              class="w-[340px] sm:w-[360px] h-[640px] rounded-[42px] border-[10px] border-[#221815] shadow-2xl overflow-hidden relative flex flex-col transition-all duration-300 bg-[#221815]"
            >
              <!-- iPhone Top Speaker / Dynamic Notch Bar -->
              <div class="h-6 w-full bg-[#221815] flex items-center justify-between px-6 pt-1 select-none z-40 relative flex-shrink-0 text-white text-[10px] font-mono">
                <span>9:41</span>
                <div class="w-20 h-4 bg-black rounded-full flex items-center justify-center">
                  <span class="w-2 h-2 rounded-full bg-neutral-800 mr-2"></span>
                  <span class="w-1.5 h-1.5 rounded-full bg-blue-900/50"></span>
                </div>
                <span>5G 􀛨</span>
              </div>

              <!-- Live Mobile Viewport -->
              <div
                class="flex-1 w-full overflow-y-auto relative transition-colors duration-300"
                :style="[previewCssVars, previewBackgroundStyle]"
              >
                <!-- Live Particle Animation inside Preview -->
                <WeddingCanvasBackground
                  v-if="config.animation_config.enabled"
                  :config="config.animation_config"
                  :absolute="true"
                />

                <!-- Simulated Opening Envelope in Preview -->
                <div
                  v-if="showOpeningTest"
                  class="absolute inset-0 z-30 flex items-center justify-center p-4 transition-all duration-500"
                  :style="{ backgroundColor: config.theme_config.primary }"
                >
                  <div
                    class="w-full rounded-3xl p-6 border-2 border-wedding-secondary shadow-2xl text-center relative"
                    :style="{ backgroundColor: config.theme_config.bg }"
                  >
                    <div class="text-xs uppercase tracking-widest font-bold mb-1" :style="{ color: config.theme_config.secondary }">
                      WEDDING INVITATION
                    </div>
                    <div class="font-khmer-heading text-lg font-bold mb-2" :style="{ color: config.theme_config.primary }">
                      សិរីមង្គលអាពាហ៍ពិពាហ៍
                    </div>
                    <div class="text-xs text-wedding-text/70 mb-4">
                      {{ weddingData.groom_name_km }} & {{ weddingData.bride_name_km }}
                    </div>
                    <button
                      type="button"
                      @click="showOpeningTest = false"
                      class="w-16 h-16 rounded-full mx-auto flex items-center justify-center text-2xl shadow-gold-glow animate-pulse"
                      :style="{ background: 'linear-gradient(135deg, #E5C77A, #C9A24A, #8F6B1E)' }"
                    >
                      🪷
                    </button>
                    <div class="mt-3 text-[11px] font-bold" :style="{ color: config.theme_config.primary }">
                      ចុចបើកលិខិតអញ្ជើញ (Click to Open)
                    </div>
                  </div>
                </div>

                <!-- Preview Content by Section -->
                <div class="relative z-10 p-4 space-y-6">
                  <!-- Section: Hero & Countdown -->
                  <div v-if="activeSection === 'all' || activeSection === 'hero'" class="text-center pt-2">
                    <div class="text-2xl mb-1 select-none" :style="{ color: config.theme_config.secondary }">⚜️</div>
                    <div class="text-[10px] uppercase tracking-widest font-bold mb-1" :style="{ color: config.theme_config.secondary }">
                      THE WEDDING CELEBRATION
                    </div>
                    <h2 class="font-khmer-heading text-xl font-bold mb-1" :style="{ color: config.theme_config.heading }">
                      សិរីមង្គលអាពាហ៍ពិពាហ៍
                    </h2>
                    <div class="font-en-heading text-lg font-bold" :style="{ color: config.theme_config.primary }">
                      {{ weddingData.groom_name_en || 'Vet Seyha' }} & {{ weddingData.bride_name_en || 'Sar Nary' }}
                    </div>
                    <div class="font-khmer-heading text-sm mt-0.5" :style="{ color: config.theme_config.heading }">
                      {{ weddingData.groom_name_km }} & {{ weddingData.bride_name_km }}
                    </div>

                    <!-- Live Countdown Timer -->
                    <div class="grid grid-cols-4 gap-1.5 max-w-[280px] mx-auto mt-4">
                      <div class="p-2 rounded-xl bg-white/80 border border-wedding-secondary/30 shadow-sm text-center">
                        <div class="text-base font-bold font-mono" :style="{ color: config.theme_config.primary }">{{ countdown.days }}</div>
                        <div class="text-[9px] uppercase tracking-wider text-[#3C2925]/60">Days</div>
                      </div>
                      <div class="p-2 rounded-xl bg-white/80 border border-wedding-secondary/30 shadow-sm text-center">
                        <div class="text-base font-bold font-mono" :style="{ color: config.theme_config.primary }">{{ countdown.hours }}</div>
                        <div class="text-[9px] uppercase tracking-wider text-[#3C2925]/60">Hours</div>
                      </div>
                      <div class="p-2 rounded-xl bg-white/80 border border-wedding-secondary/30 shadow-sm text-center">
                        <div class="text-base font-bold font-mono" :style="{ color: config.theme_config.primary }">{{ countdown.minutes }}</div>
                        <div class="text-[9px] uppercase tracking-wider text-[#3C2925]/60">Mins</div>
                      </div>
                      <div class="p-2 rounded-xl bg-white/80 border border-wedding-secondary/30 shadow-sm text-center">
                        <div class="text-base font-bold font-mono" :style="{ color: config.theme_config.primary }">{{ countdown.seconds }}</div>
                        <div class="text-[9px] uppercase tracking-wider text-[#3C2925]/60">Secs</div>
                      </div>
                    </div>
                  </div>

                  <!-- Section: Couple -->
                  <div v-if="activeSection === 'all' || activeSection === 'couple'" class="space-y-3 pt-2">
                    <div class="text-center">
                      <div class="text-[10px] font-bold uppercase tracking-wider" :style="{ color: config.theme_config.secondary }">GROOM & BRIDE</div>
                      <div class="font-khmer-heading text-base" :style="{ color: config.theme_config.heading }">កូនកម្លោះ & កូនក្រមុំ</div>
                    </div>
                    <div class="grid grid-cols-2 gap-2">
                      <!-- Groom -->
                      <div class="p-3 rounded-2xl bg-white/80 border border-wedding-secondary/30 text-center shadow-sm">
                        <div class="w-16 h-16 rounded-full mx-auto border-2 border-wedding-secondary overflow-hidden bg-gray-100 flex items-center justify-center mb-2 shadow-inner">
                          <img v-if="weddingData.groom_photo_url" :src="weddingData.groom_photo_url" alt="Groom" class="w-full h-full object-cover" />
                          <span v-else class="text-xl">🤵‍♂️</span>
                        </div>
                        <div class="font-khmer-heading text-xs font-bold" :style="{ color: config.theme_config.primary }">{{ weddingData.groom_name_km }}</div>
                        <div class="text-[10px] text-gray-500 font-mono">{{ weddingData.groom_name_en }}</div>
                      </div>
                      <!-- Bride -->
                      <div class="p-3 rounded-2xl bg-white/80 border border-wedding-secondary/30 text-center shadow-sm">
                        <div class="w-16 h-16 rounded-full mx-auto border-2 border-wedding-secondary overflow-hidden bg-gray-100 flex items-center justify-center mb-2 shadow-inner">
                          <img v-if="weddingData.bride_photo_url" :src="weddingData.bride_photo_url" alt="Bride" class="w-full h-full object-cover" />
                          <span v-else class="text-xl">👰‍♀️</span>
                        </div>
                        <div class="font-khmer-heading text-xs font-bold" :style="{ color: config.theme_config.primary }">{{ weddingData.bride_name_km }}</div>
                        <div class="text-[10px] text-gray-500 font-mono">{{ weddingData.bride_name_en }}</div>
                      </div>
                    </div>
                  </div>

                  <!-- Section: Our Story -->
                  <div v-if="activeSection === 'all' || activeSection === 'story'" class="space-y-2 pt-2">
                    <div class="text-center mb-2">
                      <div class="text-[10px] font-bold uppercase tracking-wider" :style="{ color: config.theme_config.secondary }">OUR STORY</div>
                      <div class="font-khmer-heading text-sm" :style="{ color: config.theme_config.heading }">ដំណើររឿងរបស់យើងខ្ញុំ</div>
                    </div>
                    <div class="p-3 rounded-2xl bg-white/85 border border-wedding-secondary/30 shadow-sm space-y-2">
                      <div class="flex items-start gap-2.5 text-left">
                        <span class="text-sm">🌸</span>
                        <div>
                          <div class="font-khmer-heading text-[11px] font-bold" :style="{ color: config.theme_config.primary }">ថ្ងៃដែលយើងបានជួបគ្នា (២០១៩)</div>
                          <div class="text-[10px] text-[#3C2925]/70 font-khmer-body">ការជួបគ្នាដោយចៃដន្យ នៃថ្ងៃប្រឡងបាក់ឌុបឆ្នាំ២០១៩...</div>
                        </div>
                      </div>
                      <div class="border-t border-dashed border-gray-200 pt-2 flex items-start gap-2.5 text-left">
                        <span class="text-sm">💍</span>
                        <div>
                          <div class="font-khmer-heading text-[11px] font-bold" :style="{ color: config.theme_config.primary }">ថ្ងៃជ័យមង្គលអាពាហ៍ពិពាហ៍ (១៦.០១.២០២៧)</div>
                          <div class="text-[10px] text-[#3C2925]/70 font-khmer-body">ថ្ងៃសៅរ៍ ទី១៦ ខែមករា ឆ្នាំ២០២៧ ជាការចាប់ផ្តើមទំព័រជីវិតថ្មី...</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Section: KHQR Digital Gift -->
                  <div v-if="activeSection === 'all' || activeSection === 'gift'" class="space-y-2 pt-2">
                    <div class="text-center mb-1">
                      <div class="text-[10px] font-bold uppercase tracking-wider" :style="{ color: config.theme_config.secondary }">WEDDING GIFT</div>
                      <div class="font-khmer-heading text-sm" :style="{ color: config.theme_config.heading }">ចំណងដៃ និងពរជ័យឌីជីថល</div>
                    </div>
                    <div class="p-3.5 rounded-2xl bg-white/90 border border-wedding-secondary/40 shadow-sm text-center">
                      <div class="w-36 mx-auto rounded-xl overflow-hidden border border-gray-200 shadow-sm mb-2 bg-white">
                        <img :src="weddingData.gift_info?.qr_code_url || '/images/khqr-default.jpg'" alt="KHQR" class="w-full h-auto object-contain block" />
                      </div>
                      <div class="font-khmer-heading text-xs" :style="{ color: config.theme_config.primary }">
                        {{ weddingData.gift_info?.bank_name || 'ABA Bank' }} ({{ weddingData.gift_info?.account_name_km || 'វ៉េត សីហា & ស ណារី' }})
                      </div>
                      <div class="font-mono text-sm font-bold tracking-wider mt-0.5" :style="{ color: config.theme_config.heading }">
                        {{ weddingData.gift_info?.account_number || '007 342 922' }}
                      </div>
                      <button
                        type="button"
                        class="mt-2.5 px-4 py-1.5 rounded-full text-[11px] font-medium shadow-sm transition-transform active:scale-95"
                        :style="{
                          backgroundColor: config.theme_config.primary,
                          color: config.theme_config.bg
                        }"
                      >
                        📋 ចម្លងលេខគណនី ABA
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Bottom Bar Notch -->
                <div class="py-4 text-center">
                  <span class="inline-block w-24 h-1 bg-black/20 rounded-full"></span>
                </div>
              </div>
            </div>

            <!-- Desktop Viewport Frame -->
            <div
              v-else
              class="w-full h-[640px] rounded-2xl border-4 border-[#3C2925] shadow-2xl overflow-hidden flex flex-col bg-white"
            >
              <!-- Browser Mockup Window Bar -->
              <div class="h-8 bg-gray-100 border-b border-gray-200 flex items-center px-3 gap-2 flex-shrink-0 select-none">
                <div class="flex items-center gap-1.5">
                  <span class="w-3 h-3 rounded-full bg-red-400"></span>
                  <span class="w-3 h-3 rounded-full bg-amber-400"></span>
                  <span class="w-3 h-3 rounded-full bg-green-400"></span>
                </div>
                <div class="flex-1 mx-2">
                  <div class="bg-white rounded-md px-3 py-0.5 text-[10px] text-gray-500 font-mono border border-gray-200 flex items-center gap-1.5 truncate">
                    <span>🔒</span>
                    <span class="text-gray-700">wedding.cambodia/invite/b1d98750-a2b9-4a76...</span>
                  </div>
                </div>
                <span class="text-xs text-gray-400">100%</span>
              </div>

              <!-- Desktop Content Viewport -->
              <div
                class="flex-1 w-full overflow-y-auto relative transition-colors duration-300 p-6"
                :style="[previewCssVars, previewBackgroundStyle]"
              >
                <!-- Live Particle Animation -->
                <WeddingCanvasBackground
                  v-if="config.animation_config.enabled"
                  :config="config.animation_config"
                  :absolute="true"
                />

                <div class="max-w-md mx-auto relative z-10 text-center space-y-6">
                  <!-- Header Title -->
                  <div class="pt-4">
                    <div class="text-3xl mb-1" :style="{ color: config.theme_config.secondary }">⚜️</div>
                    <div class="text-xs uppercase tracking-widest font-bold" :style="{ color: config.theme_config.secondary }">
                      THE WEDDING CELEBRATION
                    </div>
                    <h2 class="font-khmer-heading text-2xl font-bold mt-1" :style="{ color: config.theme_config.heading }">
                      សិរីមង្គលអាពាហ៍ពិពាហ៍
                    </h2>
                    <div class="font-en-heading text-xl font-bold mt-1" :style="{ color: config.theme_config.primary }">
                      {{ weddingData.groom_name_en || 'Vet Seyha' }} & {{ weddingData.bride_name_en || 'Sar Nary' }}
                    </div>
                  </div>

                  <!-- Countdown -->
                  <div class="grid grid-cols-4 gap-2 max-w-xs mx-auto">
                    <div class="p-2.5 rounded-xl bg-white/80 border border-wedding-secondary/30 shadow-sm text-center">
                      <div class="text-lg font-bold font-mono" :style="{ color: config.theme_config.primary }">{{ countdown.days }}</div>
                      <div class="text-[10px] uppercase text-[#3C2925]/60">Days</div>
                    </div>
                    <div class="p-2.5 rounded-xl bg-white/80 border border-wedding-secondary/30 shadow-sm text-center">
                      <div class="text-lg font-bold font-mono" :style="{ color: config.theme_config.primary }">{{ countdown.hours }}</div>
                      <div class="text-[10px] uppercase text-[#3C2925]/60">Hours</div>
                    </div>
                    <div class="p-2.5 rounded-xl bg-white/80 border border-wedding-secondary/30 shadow-sm text-center">
                      <div class="text-lg font-bold font-mono" :style="{ color: config.theme_config.primary }">{{ countdown.minutes }}</div>
                      <div class="text-[10px] uppercase text-[#3C2925]/60">Mins</div>
                    </div>
                    <div class="p-2.5 rounded-xl bg-white/80 border border-wedding-secondary/30 shadow-sm text-center">
                      <div class="text-lg font-bold font-mono" :style="{ color: config.theme_config.primary }">{{ countdown.seconds }}</div>
                      <div class="text-[10px] uppercase text-[#3C2925]/60">Secs</div>
                    </div>
                  </div>

                  <!-- Venue card -->
                  <div class="p-4 rounded-2xl bg-white/80 border border-wedding-secondary/30 shadow-sm text-center">
                    <div class="text-xs font-bold" :style="{ color: config.theme_config.heading }">
                      {{ weddingData.venue_name_km || 'The Premier Centre Sen Sok (អគារ F)' }}
                    </div>
                    <div class="text-[11px] text-[#3C2925]/70 mt-1 font-khmer-body">
                      ថ្ងៃសៅរ៍ ទី១៦ ខែមករា ឆ្នាំ២០២៧
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="text-center text-xs text-[#3C2925]/60">
            Colors, particles, and backgrounds update instantaneously inside this live frame.
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <div v-if="toast" class="toast">{{ toast }}</div>
  </div>
</template>

<script setup lang="ts">
import {
  PRESET_THEMES,
  DEFAULT_THEME_COLORS,
  type WeddingAppearance,
  type ThemeColors
} from '~~/shared/types/appearance'
import type { WeddingSettings } from '~~/shared/types/wedding'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })
const { t } = useLocale()
const supabase = useSupabase()

const saving = ref(false)
const toast = ref('')
const previewDevice = ref<'mobile' | 'desktop'>('mobile')
const activeSection = ref<'all' | 'hero' | 'couple' | 'story' | 'gift'>('all')
const showOpeningTest = ref(false)

const previewSections = [
  { id: 'all', label: '🌟 Full Page' },
  { id: 'hero', label: '👑 Hero' },
  { id: 'couple', label: '👫 Couple' },
  { id: 'story', label: '📖 Story' },
  { id: 'gift', label: '🎁 KHQR' }
] as const

const weddingData = ref<WeddingSettings>({
  id: '',
  groom_name_km: 'វ៉េត សីហា',
  groom_name_en: 'Vet Seyha',
  bride_name_km: 'ស ណារី',
  bride_name_en: 'Sar Nary',
  wedding_date: '2027-01-16T04:26:00.000Z',
  venue_name_km: 'The Premier Centre Sen Sok (អគារ F)',
  venue_name_en: 'The Premier Centre Sen Sok (Building F)',
  venue_address_km: 'រាជធានីភ្នំពេញ',
  venue_address_en: 'Phnom Penh, Cambodia',
  groom_photo_url: '',
  bride_photo_url: '',
  our_story: [],
  gift_info: {
    enabled: true,
    qr_code_url: '/images/khqr-default.jpg',
    account_name_en: 'SEYHA VET',
    bank_name: 'ABA Bank',
    account_name_km: 'វ៉េត សីហា & ស ណារី',
    account_number: '007 342 922'
  }
})

const config = ref<WeddingAppearance>({
  id: '',
  theme_name: 'Khmer Royal Burgundy & Gold',
  theme_config: { ...DEFAULT_THEME_COLORS },
  background_config: {
    type: 'none',
    opacity: 0.15,
    overlay_color: '#641D2D',
    overlay_opacity: 0.15
  },
  animation_config: {
    enabled: true,
    preset: 'lotus_petals',
    speed: 1,
    particle_quantity: 30,
    object_size: 24,
    opacity: 0.7,
    direction: 'down',
    intensity: 1,
    desktop_quality: 'high',
    mobile_quality: 'medium'
  },
  opening_animation_config: {
    style: 'golden_seal',
    duration: 1.6,
    speed: 1,
    sound_enabled: false
  },
  is_published: true
})

// Real-time CSS Variables applied to the preview frame
const previewCssVars = computed(() => {
  const c = config.value.theme_config
  return {
    '--wedding-primary': c.primary,
    '--wedding-secondary': c.secondary,
    '--wedding-bg': c.bg,
    '--wedding-text': c.text,
    '--wedding-heading': c.heading,
    '--wedding-border': c.border,
    '--wedding-accent': c.accent,
    '--wedding-highlight': c.highlight
  }
})

// Real-time Background styling for the preview frame
const previewBackgroundStyle = computed(() => {
  const bg = config.value.background_config
  const c = config.value.theme_config

  if (bg.type === 'solid') {
    return { backgroundColor: bg.overlay_color || c.bg }
  }
  if (bg.type === 'gradient') {
    const dir = bg.gradient_direction || 'to bottom'
    return {
      background: `linear-gradient(${dir}, ${c.bg}, ${c.primary})`
    }
  }
  if (bg.type === 'image' && bg.image_url) {
    return {
      backgroundImage: `url(${bg.image_url})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }
  }
  return { backgroundColor: c.bg }
})

// Live Countdown timer
const now = ref(Date.now())
let clockTimer: any = null

const countdown = computed(() => {
  const target = new Date(weddingData.value.wedding_date || '2027-01-16T04:26:00Z').getTime()
  const diff = Math.max(0, target - now.value)
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)
  return { days, hours, minutes, seconds }
})

const showToast = (msg: string) => {
  toast.value = msg
  setTimeout(() => { toast.value = '' }, 3500)
}

const getToken = async () => {
  if (!supabase) return ''
  const { data } = await supabase.auth.getSession()
  return data.session?.access_token || ''
}

const applyPreset = (key: string, preset: { name: string; colors: ThemeColors }) => {
  config.value.theme_name = preset.name
  config.value.theme_config = { ...preset.colors }
  showToast(`Applied preset: ${preset.name}`)
}

const resetToDefault = () => {
  config.value.theme_name = 'Khmer Royal Burgundy & Gold'
  config.value.theme_config = { ...DEFAULT_THEME_COLORS }
  config.value.background_config = { type: 'none', opacity: 0.15, overlay_color: '#641D2D', overlay_opacity: 0.15 }
  config.value.animation_config.preset = 'lotus_petals'
  config.value.animation_config.enabled = true
  config.value.opening_animation_config.style = 'golden_seal'
  showToast('Restored default Khmer Royal Burgundy & Gold.')
}

const testOpeningAnimation = () => {
  showOpeningTest.value = true
}

const loadData = async () => {
  // Fetch real wedding details
  try {
    const wedRes = await $fetch<any>('/api/wedding').catch(() => null)
    if (wedRes?.data) {
      weddingData.value = {
        ...weddingData.value,
        ...wedRes.data,
        gift_info: wedRes.data.gift_info || weddingData.value.gift_info
      }
    }
  } catch (e) {
    console.error('Error fetching wedding:', e)
  }

  // Fetch admin appearance
  try {
    const token = await getToken()
    const res = await $fetch<any>('/api/admin/appearance', {
      headers: token ? { authorization: `Bearer ${token}` } : {}
    }).catch(() => $fetch<any>('/api/appearance'))

    if (res?.data) {
      if (res.data.theme_name) config.value.theme_name = res.data.theme_name
      if (res.data.theme_config) config.value.theme_config = { ...DEFAULT_THEME_COLORS, ...res.data.theme_config }
      if (res.data.background_config) config.value.background_config = res.data.background_config
      if (res.data.animation_config) config.value.animation_config = res.data.animation_config
      if (res.data.opening_animation_config) config.value.opening_animation_config = res.data.opening_animation_config
      if (typeof res.data.is_published === 'boolean') config.value.is_published = res.data.is_published
    }
  } catch (err) {
    console.error('Error loading appearance:', err)
  }
}

const save = async (publish: boolean) => {
  saving.value = true
  const token = await getToken()
  config.value.is_published = publish

  try {
    await $fetch('/api/admin/appearance', {
      method: 'PUT',
      headers: { authorization: `Bearer ${token}` },
      body: config.value
    })
    showToast(publish ? '🚀 Theme published to live website!' : '💾 Draft appearance saved.')
  } catch (err: any) {
    showToast(err?.data?.statusMessage || 'Failed to save appearance.')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadData()
  clockTimer = setInterval(() => { now.value = Date.now() }, 1000)
})

onUnmounted(() => {
  if (clockTimer) clearInterval(clockTimer)
})
</script>

<style scoped>
.btn-primary { @apply px-4 py-2 rounded-lg bg-[#641D2D] text-[#F7F0E3] font-medium hover:bg-[#7D2438] transition-colors text-sm disabled:opacity-50 cursor-pointer shadow-sm; }
.btn-secondary { @apply px-4 py-2 rounded-lg bg-[#F7F0E3] text-[#641D2D] font-medium border border-[#C9A24A]/40 hover:bg-[#EDE5D4] transition-colors text-sm disabled:opacity-50 cursor-pointer shadow-sm; }
.input-field { @apply w-full px-3 py-2 rounded-lg border border-[#C9A24A]/40 bg-white focus:outline-none focus:ring-2 focus:ring-[#641D2D]/30 text-sm; }
.form-label { @apply block text-xs font-semibold uppercase tracking-wider text-[#3C2925]/70 mb-1; }
.toast { @apply fixed bottom-6 right-6 bg-[#641D2D] text-[#F7F0E3] px-4 py-2 rounded-xl shadow-lg text-sm z-50 animate-bounce; }
</style>
