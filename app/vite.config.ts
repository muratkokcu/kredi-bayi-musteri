import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 5173,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // recharts pulls in react-is (CJS with a conditional require); pre-bundle both
  // so Vite dev exposes react-is named exports (e.g. isFragment) correctly.
  optimizeDeps: {
    include: ['recharts', 'react-is'],
  },
})
