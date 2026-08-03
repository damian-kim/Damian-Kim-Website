import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = fileURLToPath(new URL('.', import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rolldownOptions: {
      input: {
        main: resolve(rootDir, 'index.html'),
        concepts: resolve(rootDir, 'concepts.html'),
        finalists: resolve(rootDir, 'finalists.html'),
        heroLab: resolve(rootDir, 'hero-lab.html'),
        galaxy: resolve(rootDir, 'galaxy.html'),
        dancingCubes: resolve(rootDir, 'dancing-cubes/index.html'),
      },
    },
  },
})
