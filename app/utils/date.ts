// Khmer & English date formatting utilities for traditional wedding invitations

export const KHMER_DAYS = [
  'ថ្ងៃអាទិត្យ', // 0: Sunday
  'ថ្ងៃច័ន្ទ',    // 1: Monday
  'ថ្ងៃអង្គារ',   // 2: Tuesday
  'ថ្ងៃពុធ',     // 3: Wednesday
  'ថ្ងៃព្រហស្បតិ៍', // 4: Thursday
  'ថ្ងៃសុក្រ',   // 5: Friday
  'ថ្ងៃសៅរ៍'     // 6: Saturday
]

export const KHMER_MONTHS = [
  'ខែមករា',    // 0: January
  'ខែកុម្ភៈ',   // 1: February
  'ខែមីនា',    // 2: March
  'ខែមេសា',   // 3: April
  'ខែឧសភា',   // 4: May
  'ខែមិថុនា',  // 5: June
  'ខែកក្កដា',  // 6: July
  'ខែសីហា',   // 7: August
  'ខែកញ្ញា',   // 8: September
  'ខែតុលា',   // 9: October
  'ខែវិច្ឆិកា',  // 10: November
  'ខែធ្នូ'      // 11: December
]

export const KHMER_DIGITS = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩']

/**
 * Convert western arabic digits (0-9) to traditional Khmer digits (០-៩)
 */
export function toKhmerDigits(num: number | string): string {
  return String(num).replace(/\d/g, (d) => KHMER_DIGITS[parseInt(d, 10)] ?? d)
}

/**
 * Format a date string or Date object into traditional Khmer wedding style:
 * e.g. "ថ្ងៃសុក្រ ទី១៥ ខែមករា ឆ្នាំ២០២៧"
 */
export function formatKhmerDate(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return 'ថ្ងៃសៅរ៍ ទី១៦ ខែមករា ឆ្នាំ២០២៧'
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
  if (isNaN(d.getTime())) return 'ថ្ងៃសៅរ៍ ទី១៦ ខែមករា ឆ្នាំ២០២៧'

  const dayOfWeek = KHMER_DAYS[d.getDay()]
  const dayOfMonth = toKhmerDigits(d.getDate())
  const month = KHMER_MONTHS[d.getMonth()]
  const year = toKhmerDigits(d.getFullYear())

  return `${dayOfWeek} ទី${dayOfMonth} ${month} ឆ្នាំ${year}`
}

/**
 * Format a date string or Date object into formal English wedding style:
 * e.g. "Friday, January 15, 2027"
 */
export function formatEnglishDate(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return 'Saturday, January 16, 2027'
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
  if (isNaN(d.getTime())) return 'Saturday, January 16, 2027'

  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Format wedding celebration date according to active locale preference
 */
export function formatWeddingDate(dateInput: string | Date | null | undefined, isKhmer = true): string {
  return isKhmer ? formatKhmerDate(dateInput) : formatEnglishDate(dateInput)
}
