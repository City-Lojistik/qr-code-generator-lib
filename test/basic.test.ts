import { assert, expect, test } from 'vitest'

import { getMatrix } from '../src/qr/matrixGenerator'
import { render } from '../src/renderer/svg'
import expectedUrl from './results/url'
import expectedNumeric from './results/numeric'
import expectedAlphanumeric from './results/alphanumeric'
import expectedByte from './results/byte'
import expectedByteLong from './results/byteLong'
import expectedRender from './results/render'
import expected0 from './results/0'
import fs from 'fs'
// Edit an assertion and save to see HMR in action

test('url', () => {
  const result = getMatrix(
    'https://github.com/AlexRuppert/bookmarklet-generator/blob/aaea8a10c11cc3df07517d9112d972999e9e49a1/README.md',
  )
// fs.writeFileSync('./test/results/url.js', JSON.stringify(result, null, 2))
  expect(result).toStrictEqual(expectedUrl)
})
test('byte', () => {
  const result = getMatrix('1👩‍🌾😉我')
  expect(result).toStrictEqual(expectedByte)
})

test('byte long', () => {
  const text = ''.padStart(2000, 'a')
  const result = getMatrix(text)
  expect(result).toStrictEqual(expectedByteLong)
})
/*
test('numeric', () => {
  const result = getMatrix('1234567890')
  expect(result).toStrictEqual(expectedNumeric)
})

test('alphanumeric', () => {
  const result = getMatrix('1234567890ABCDEFGYZ')
  expect(result).toStrictEqual(expectedAlphanumeric)
})
*/
test('0', () => {
  const result = getMatrix(String.fromCharCode(0) + String.fromCharCode(0))
  expect(result).toStrictEqual(expected0)
})
test('render', () => {
  const result = render(
    getMatrix(
      'https://github.com/AlexRuppert/bookmarklet-generator/blob/aaea8a10c11cc3df07517d9112d972999e9e49a1/README.md',
    ) as boolean[][],
  )
  expect(result).toStrictEqual(expectedRender)
})

test('x', () => {
  for (let i = 0; i <= 40; i++) {
    //console.log(getAlignmentPattern(i))
  }
})