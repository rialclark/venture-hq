import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages project site: https://<user>.github.io/venture-hq/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/venture-hq/',
})
