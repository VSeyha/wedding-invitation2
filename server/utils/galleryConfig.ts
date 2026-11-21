import fs from 'node:fs'
import path from 'node:path'

export interface GalleryConfig {
  layout?: 'grid' | 'masonry' | 'carousel' | 'featured'
  columns_mobile?: 1 | 2
  columns_desktop?: 2 | 3 | 4
  aspect_ratio?: 'square' | 'portrait' | 'landscape' | 'natural'
  card_style?: 'gold-frame' | 'rounded' | 'glass' | 'minimal'
  gap?: 'compact' | 'normal' | 'relaxed'
  max_display?: number | 'all'
}

export const DEFAULT_GALLERY_CONFIG: GalleryConfig = {
  layout: 'grid',
  columns_mobile: 2,
  columns_desktop: 3,
  aspect_ratio: 'square',
  card_style: 'gold-frame',
  gap: 'normal',
  max_display: 'all'
}

const CONFIG_FILE_PATH = path.resolve(process.cwd(), '.gallery_config.json')

export const getStoredGalleryConfig = (): GalleryConfig => {
  try {
    if (fs.existsSync(CONFIG_FILE_PATH)) {
      const raw = fs.readFileSync(CONFIG_FILE_PATH, 'utf-8')
      return { ...DEFAULT_GALLERY_CONFIG, ...JSON.parse(raw) }
    }
  } catch (e) {
    console.warn('Failed to read stored gallery config:', e)
  }
  return DEFAULT_GALLERY_CONFIG
}

export const saveStoredGalleryConfig = (cfg: Partial<GalleryConfig>): GalleryConfig => {
  try {
    const current = getStoredGalleryConfig()
    const merged = { ...current, ...cfg }
    fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(merged, null, 2), 'utf-8')
    return merged
  } catch (e) {
    console.warn('Failed to write stored gallery config:', e)
  }
  return { ...DEFAULT_GALLERY_CONFIG, ...cfg }
}
