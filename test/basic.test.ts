import { assert, expect, test } from 'vitest'

import getMatrix from '../src/qr/matrixGenerator'
import { render } from '../src/renderer/svg'
import expectedUrl from './results/url'
import expectedNumeric from './results/numeric'
import expectedAlphanumeric from './results/alphanumeric'
import expectedByte from './results/byte'
import expectedRender from './results/render'
// Edit an assertion and save to see HMR in action

test('url', () => {
  const result = getMatrix(
    'https://github.com/AlexRuppert/bookmarklet-generator/blob/aaea8a10c11cc3df07517d9112d972999e9e49a1/README.md',
  )
  expect(result).toStrictEqual(expectedUrl)
})
test('byte', () => {
  const result = getMatrix('1👩‍🌾😉我')
  expect(result).toStrictEqual(expectedByte)
})

test('numeric', () => {
  const result = getMatrix('1234567890')
  expect(result).toStrictEqual(expectedNumeric)
})

test('alphanumeric', () => {
  const result = getMatrix('1234567890ABCDEFGYZ')
  expect(result).toStrictEqual(expectedAlphanumeric)
})

test('render', () => {
  const result = render(
    getMatrix(
      'https://github.com/AlexRuppert/bookmarklet-generator/blob/aaea8a10c11cc3df07517d9112d972999e9e49a1/README.md',
    ),
  )
  expect(result).toStrictEqual(expectedRender)
})
