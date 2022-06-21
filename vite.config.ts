import { defineConfig } from 'vitest/config'
import { resolve } from 'path'
import path from 'path'
const BASE = '/qr-code-generator-lib/'
export default defineConfig({
  /* esbuild: {
    minify: true,
  },*/
  base: BASE,
  build: {
    target: 'esnext',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
    lib: {
      entry: path.resolve(__dirname, 'index.ts'),
      name: 'qrcode',
      fileName: (format) => `qr-code-generator-lib.${format}.js`,
      formats: ['es', 'umd', 'cjs', 'iife'],
    },

    minify: 'terser',
    terserOptions: {
      mangle: {
        properties: {
          reserved: ['getMatrix', 'render'],
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
  test: {
    // ...
  },
})
