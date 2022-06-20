import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  /* esbuild: {
    minify: true,
  },*/

  build: {
    target: 'esnext',
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
