import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: false, // offline/cache özelliği olmadan
      manifest: {
        name: 'Hisse Portföy',
        short_name: 'Portföy',
        description: 'Hisse portföy yönetim uygulaması',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/android.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/splash.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})
