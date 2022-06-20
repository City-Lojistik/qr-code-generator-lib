import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  build: {
    target: 'esnext',
    lib: {
      entry: path.resolve(__dirname, 'index.ts'),
      name: 'qrcode-generator-lib',
      fileName: (format) => `qrcode-generator-lib.${format}.js`,
    },
    minify: 'terser',
    terserOptions: {
      mangle: {
        properties: {
          reserved: ['encode'],
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
