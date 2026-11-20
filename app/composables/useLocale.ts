import en from '~~/locales/en.json'
import km from '~~/locales/km.json'

export type Locale = 'km' | 'en'

const dictionaries: Record<Locale, any> = { km, en }

export function useLocale() {
  const currentLocale = useState<Locale>('app-locale', () => 'km')

  const setLocale = (locale: Locale) => {
    currentLocale.value = locale
    if (import.meta.client) {
      try {
        localStorage.setItem('wedding_locale', locale)
        document.documentElement.lang = locale
      } catch {
        // Ignore storage errors
      }
    }
  }

  const toggleLocale = () => {
    setLocale(currentLocale.value === 'km' ? 'en' : 'km')
  }

  // Initialize from storage on client mount
  if (import.meta.client) {
    const saved = localStorage.getItem('wedding_locale') as Locale | null
    if (saved && (saved === 'km' || saved === 'en') && currentLocale.value !== saved) {
      currentLocale.value = saved
      document.documentElement.lang = saved
    }
  }

  const t = (path: string): string => {
    const keys = path.split('.')
    let current: any = dictionaries[currentLocale.value] || dictionaries.km

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key]
      } else {
        // Fallback to English, then path itself
        let fallback: any = dictionaries.en
        for (const fKey of keys) {
          if (fallback && typeof fallback === 'object' && fKey in fallback) {
            fallback = fallback[fKey]
          } else {
            return path
          }
        }
        return typeof fallback === 'string' ? fallback : path
      }
    }
    return typeof current === 'string' ? current : path
  }

  const localeText = (kmText?: string | null, enText?: string | null): string => {
    if (currentLocale.value === 'km') {
      return kmText || enText || ''
    }
    return enText || kmText || ''
  }

  return {
    locale: currentLocale,
    setLocale,
    toggleLocale,
    t,
    localeText,
    isKhmer: computed(() => currentLocale.value === 'km')
  }
}
