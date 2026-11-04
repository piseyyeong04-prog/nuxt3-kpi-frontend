// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  ssr: false,

  app: {
    head: {
      title: 'KPI System Baksey',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'format-detection', content: 'telephone=no' },
        {
          hid: 'description',
          name: 'description',
          content:
            "KPI System Baksey",
        },
        {
          name: 'keywords',
          content:
            'starter template,',
        },
      ],
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Hanuman:wght@100;300;400;700;900&family=Titillium+Web:ital,wght@0,200;0,300;0,400;0,600;0,700;0,900;1,200;1,300;1,400;1,600;1,700&display=swap',
        },
        { rel: 'icon', type: 'image/x-icon', href: '/icon-green.svg' },
      ],
    },
  },

  css: ['~/assets/css/main.css', '~/assets/css/index.css'],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  runtimeConfig: {
    facebook: {
      TC: {
        appId: process.env.FACEBOOK_APP_ID,
        appSecret: process.env.FACEBOOK_APP_SECRET,
        pageId: process.env.FACEBOOK_PAGE_ID,
        accessToken: process.env.FACEBOOK_ACCESS_TOKEN,
      },
      BC: {
        appId: process.env.FACEBOOK_APP_ID_BC,
        appSecret: process.env.FACEBOOK_APP_SECRET_BC,
        pageId: process.env.FACEBOOK_PAGE_ID_BC,
        accessToken: process.env.FACEBOOK_ACCESS_TOKEN_BC,
      },
      HC: {
        appId: process.env.FACEBOOK_APP_ID_HC,
        appSecret: process.env.FACEBOOK_APP_SECRET_HC,
        pageId: process.env.FACEBOOK_PAGE_ID_HC,
        accessToken: process.env.FACEBOOK_ACCESS_TOKEN_HC,
      },
    },
    public: {
      API_BASE_URL: process.env.API_BASE_URL,
      GEMINI_API_KEY: process.env.GEMINI_API_KEY,
      TELEGRAM_BOT_TOKEN: process.env.NUXT_PUBLIC_TELEGRAM_BOT_TOKEN,
      TELEGRAM_CHAT_ID: process.env.NUXT_PUBLIC_TELEGRAM_CHAT_ID,
      TELEGRAM_THREAD_ID: process.env.NUXT_PUBLIC_TELEGRAM_THREAD_ID,
      FORM_API_BASE_URL: process.env.FORM_API_BASE_URL,
      // Base URL for desktop installers. Use a GitHub Releases / S3 / R2 prefix
      // in production so large binaries never enter the Git repository.
      DOWNLOAD_BASE_URL:
        process.env.DOWNLOAD_BASE_URL ||
        'https://github.com/ZensYing/kpi-desktop-releases/releases/latest/download',
    },
  },


  plugins: ['~/plugins/iconify.js'],
  modules: ['@pinia/nuxt', '@vite-pwa/nuxt'],

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Baksey',
      short_name: 'Baksey',
      description: 'Track and manage staff KPIs effectively.',
      theme_color: '#10b981',
      background_color: '#ffffff',
      display: 'standalone',
      orientation: 'portrait',
      lang: 'en',
      icons: [
        {
          src: '/icon-green-96.png',
          sizes: '96x96',
          type: 'image/png',
        },
        {
          src: '/icon-green-128.png',
          sizes: '128x128',
          type: 'image/png',
        },
        {
          src: '/icon-green-144.png',
          sizes: '144x144',
          type: 'image/png',
        },
        {
          src: '/icon-green-192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/icon-green-512.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    },
    workbox: {
      cleanupOutdatedCaches: true,
      globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
    },
    devOptions: {
      enabled: false,
    },
  },
});