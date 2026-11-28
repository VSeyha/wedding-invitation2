import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/components/**/*.{vue,js,ts}',
    './app/layouts/**/*.vue',
    './app/pages/**/*.vue',
    './app/composables/**/*.{js,ts}',
    './app/plugins/**/*.{js,ts}',
    './app/app.vue'
  ],
  theme: {
    extend: {
      colors: {
        khmer: {
          burgundy: '#641D2D',
          gold: '#C9A24A',
          'gold-light': '#E5C77A',
          'gold-dark': '#A37E2C',
          ivory: '#F7F0E3',
          brown: '#3C2925',
          cream: '#FFFDF9'
        },
        wedding: {
          primary: 'var(--wedding-primary, #641D2D)',
          secondary: 'var(--wedding-secondary, #C9A24A)',
          bg: 'var(--wedding-bg, #F7F0E3)',
          text: 'var(--wedding-text, #3C2925)',
          heading: 'var(--wedding-heading, #641D2D)',
          border: 'var(--wedding-border, #C9A24A)',
          accent: 'var(--wedding-accent, #E5C77A)',
          highlight: 'var(--wedding-highlight, #E5C77A)'
        }
      },
      fontFamily: {
        'khmer-heading': [
          'Moul',
          '"Khmer OS Muol Light"',
          '"Khmer OS Muol"',
          '"Noto Sans Khmer"',
          '"Khmer MN"',
          '"Khmer Sangam MN"',
          '"Khmer UI"',
          'DaunPenh',
          'serif'
        ],
        'khmer-body': [
          '"Kantumruy Pro"',
          '"Noto Sans Khmer"',
          '"Khmer OS Battambang"',
          '"Khmer OS"',
          '"Khmer Sangam MN"',
          '"Khmer MN"',
          '"Khmer UI"',
          '"Leelawadee UI"',
          'DaunPenh',
          'sans-serif'
        ],
        'en-heading': ['"Cormorant Garamond"', 'Georgia', 'serif'],
        'en-body': ['"Plus Jakarta Sans"', 'Inter', 'sans-serif']
      },
      boxShadow: {
        'gold-glow': '0 0 25px rgba(201, 162, 74, 0.35)',
        'gold-glow-lg': '0 0 40px rgba(201, 162, 74, 0.5)',
        'burgundy-glow': '0 0 25px rgba(100, 29, 45, 0.35)'
      }
    }
  },
  plugins: []
} satisfies Config
