import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from "vite-plugin-singlefile"

export default defineConfig({
  base: "./",
  server: {
    open: true
  },  
  build: {
    outDir: './docs'
  },
  plugins: [react(), viteSingleFile()]
})