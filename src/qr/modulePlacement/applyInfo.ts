import { divPoly } from '../errorCorrection/galoisField'
import { QrParameters } from '../parameters'
import { chunkString, numToBits, pad0, range } from '../utilities'

export function applyFormatInformation(
  config: QrParameters,
  mask: number,
  matrix: (boolean | null)[][],
) {
  let bits = chunkString('01001110', 2)[config.ecLevel] + numToBits(mask, 3)

  const bits10 = [...(bits + pad0(10))].map(Number)

  const generator = Uint8Array.from([...'10100110111'].map(Number))
  const message = Uint8Array.from(bits10)
  const remainder = divPoly(message, generator).join('')

  bits += pad0(10, remainder)
  const formatInfo = numToBits(parseInt(bits, 2) ^ 21522, 15)

  const horizontal = [
    ...range(0, 8 + 1),
    ...range(matrix.length - 7, matrix.length),
  ]

  const vertical = horizontal.slice().reverse()
  let j = 0
  horizontal.forEach(
    (h) => (matrix[8][h] = h !== 6 ? formatInfo[j++] === '1' : matrix[8][h]),
  )
  j = 0
  vertical.forEach(
    (v) =>
      (matrix[v][8] =
        v !== 6 && v !== matrix.length - 8
          ? formatInfo[j++] === '1'
          : matrix[v][8]),
  )

  return matrix
}

export function applyVerisonInformation(
  config: QrParameters,
  matrix: (boolean | null)[][],
) {
  if (config.version < 7) return matrix
  const generator = Uint8Array.from([1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 1])
  const bits = numToBits(config.version, 6)
  const bits10 = (bits + pad0(12)).split('').map((el) => +el)
  const message = Uint8Array.from(bits10)
  const remainder = divPoly(message, generator).join('')
  const versionInfo = bits + pad0(12,remainder)

  let d = 0

  for (let x = 0; x < 6; x++)
    for (let y = 0; y < 3; y++)
      matrix[matrix.length - 9 - y][5 - x] = matrix[5 - x][
        matrix.length - 9 - y
      ] = versionInfo[d++] === '1'

  return matrix
}
