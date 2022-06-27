import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

const BASE = '/qr-code-generator-lib/'
export default defineConfig({
  base: BASE,
  build: {
    target: 'esnext',
    outDir: 'demo',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
    minify: 'terser',
    terserOptions: {
      mangle: {
        properties: {
          reserved: ['getMatrix', 'render', 'renderPath'],
        },
      },
      compress: {
        passes: 10,
        inline: true,
        unsafe: true,
        hoist_vars: true,
      },
    },
  },
  test: {},
})
