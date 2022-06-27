import { defineConfig } from 'vitest/config'
import path from 'path'
const BASE = '/qr-code-generator-lib/'

function removeBuggyTerserJs() {
  const replacers = [
    { input: 'dimensions', output: 'pu' },
    { input: 'version', output: 'if' },
    { input: 'mask', output: 'ma' },
    { input: 'matrix', output: 're' },
  ]
  return {
    name: 'removeBuggyTerserJs',
    generateBundle(options, bundle) {
      const jsFiles = Object.keys(bundle)
        .filter((key) => key.endsWith('iife.js') || key.endsWith('cjs'))
        .map((key) => bundle[key])

      jsFiles.forEach((js) => {
        let code = js.code
        replacers.forEach(({ input, output }) => {
          code = code.replaceAll(input, output)
        })
        js.code = code
      })
    },
  }
}

export default defineConfig({
  plugins: [removeBuggyTerserJs()],
  build: {
    target: 'esnext',
    lib: {
      entry: path.resolve(__dirname, 'index.ts'),
      name: 'qrcode',
      fileName: (format) => {
        switch (format) {
          case 'cjs':
            return `qr-code-generator-lib.cjs`
          case 'es':
            return `qr-code-generator-lib.mjs`
          default:
            return `qr-code-generator-lib.${format}.js`
        }
      },

      formats: ['es', 'cjs', 'iife'],
    },
    minify: 'terser',
    terserOptions: {
      mangle: {
        properties: {
          reserved: ['getMatrix', 'render', 'renderPath', 'dim'],
        },
      },
      compress: {
        passes: 5,
        inline: true,
        unsafe: true,
        dead_code: true,
        drop_console: true,
        evaluate: true,
      },
    },
  },
  test: {},
})
