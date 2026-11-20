// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  telemetry: false,
  srcDir: 'app',
  serverDir: 'server',
  dir: {
    public: '../public'
  },

  modules: [
    '@nuxtjs/tailwindcss'
  ],

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: 'Khmer Wedding Invitation',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1' },
        { name: 'description', content: 'Traditional Khmer Wedding Invitation' },
        { name: 'theme-color', content: '#641D2D' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&family=Kantumruy+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&family=Moul&family=Noto+Sans+Khmer:wght@300;400;500;600;700&family=Noto+Serif+Khmer:wght@400;600;700&display=swap'
        }
      ]
    }
  },

  runtimeConfig: {
    // Private keys accessible only on server
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    public: {
      supabaseUrl: process.env.SUPABASE_URL || '',
      supabaseKey: process.env.SUPABASE_KEY || '',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    }
  },

  alias: {
    '~~/shared': '../shared',
    '@@/shared': '../shared',
    '~/shared': '../shared',
    '@shared': '../shared'
  }
})
