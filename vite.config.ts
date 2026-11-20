import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite + React. Base relativa para compatibilidad total con GitHub Pages y vista previa local.
export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    port: 5173,
    open: false,
  },
})
