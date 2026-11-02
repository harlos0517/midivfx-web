import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'

import { ICON_SIZE } from './src/utils/const.ts'

const svgOptions = {
  svgrOptions: {
    icon: ICON_SIZE,
    svgProps: { fill: 'currentColor' },
  },
}

export default defineConfig({
  plugins: [react(), svgr(svgOptions)],
  resolve: {
    alias: {
      '@': resolve(import.meta.dirname, 'src'),
    },
  },
  build: {
    outDir: './docs',
  },
})
