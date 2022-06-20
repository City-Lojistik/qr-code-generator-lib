import { divPoly } from '../errorCorrection/galoisField'
import { QrParameters } from '../parameters'
import { bitsToArray, chunkString, numToBits, pad0, range } from '../utilities'

export const applyFormatInformation = (
  config: QrParameters,
  mask: number,
  matrix: (boolean | null)[][],
) => {
  const bits = chunkString('01001110', 2)[config.ecLevel] + numToBits(mask, 3)
  const message = bitsToArray(bits + pad0(10))
  const generator = bitsToArray('10100110111')
  const remainder = divPoly(message, generator).join('')

  const formatInfo = numToBits(
    parseInt(bits + pad0(10, remainder), 2) ^ 21522,
    15,
  )

  let a = 0,
    b = 0
  //horizontal
  ;[...range(0, 8 + 1), ...range(matrix.length - 7, matrix.length)].forEach(
    (h, i, arr) => {
      //vertical
      const v = arr[arr.length - 1 - i]

      if (h !== 6) matrix[8][h] = formatInfo[a++] === '1'
      if (v !== 6 && v !== matrix.length - 8)
        matrix[v][8] = formatInfo[b++] === '1'
    },
  )
  return matrix
}

export const applyVerisonInformation = (
  config: QrParameters,
  matrix: (boolean | null)[][],
) => {
  if (config.version < 7) return matrix
  const generator = bitsToArray('1111100100101')
  const bits = numToBits(config.version, 6)
  const message = bitsToArray(bits + pad0(12))
  const remainder = divPoly(message, generator).join('')
  const versionInfo = bits + pad0(12, remainder)
  /* for (let x = 0; x < 6; x++)
    for (let y = 0; y < 3; y++)
      matrix[matrix.length - 9 - y][5 - x] = matrix[5 - x][
        matrix.length - 9 - y
      ] = versionInfo[d++] === '1'*/
  for (let i = 18; i--; ) {
    let [x, y] = [matrix.length - 9 - (i % 3), 5 - (0 | (i / 3))]
    matrix[x][y] = matrix[y][x] = versionInfo[i] === '1'
  }

  return matrix
}
