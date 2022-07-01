import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: "./",
  server: {
    open: true
  },  
  build: {
    outDir: './docs'
  },
  plugins: [react()]
})