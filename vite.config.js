import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  server: {
    // Bind to all interfaces so the dev server is reachable from other
    // devices (e.g. a phone) on the same local network, not just localhost.
    host: true,
  },
  build: {
    rollupOptions: {
      output: {
        // recharts' internal modules get auto-split across chunks with a
        // circular dependency between them, which initializes in the wrong
        // order under Rollup's production build (works fine in dev, where
        // nothing is chunked) and throws "X is not a function" at runtime.
        // Forcing it into one chunk keeps its internal init order intact.
        manualChunks(id) {
          if (/node_modules\/(recharts|d3-|victory-vendor)/.test(id)) {
            return 'recharts-vendor'
          }
        },
      },
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['pwa-192x192.png', 'pwa-512x512.png', 'favicon.svg'],
      manifest: {
        name: 'Orbit',
        short_name: 'Orbit',
        description: 'Personal life operating system for tasks, workouts, sleep, and more.',
        theme_color: '#0B0A0C',
        background_color: '#0B0A0C',
        display: 'standalone',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})
