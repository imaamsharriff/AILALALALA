import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Frontend-only build. Relative base so the dist/ folder can be dropped on
// any static host (or opened from a subdirectory) without extra config.
export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
})
