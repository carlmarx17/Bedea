import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite + React. La app es completamente estática: no requiere backend.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: false,
  },
})
