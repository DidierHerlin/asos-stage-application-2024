import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    // Configuration des types MIME
    mimeTypes: {
      'text/css': ['css']
    }
  },
  build: {
    // Assure le bon traitement des CSS
    cssCodeSplit: true
  }
})
