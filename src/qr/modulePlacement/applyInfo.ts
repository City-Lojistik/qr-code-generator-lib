import { divPoly } from '../errorCorrection/galoisField'
import { QrParameters } from '../parameters'
import { bitsToArray, chunkString, numToBits, pad0, range } from '../utilities'

export let applyFormatInformation = (
  config: QrParameters,
  mask: number,
  matrix: (boolean | null)[][],
) => {
  let bits = chunkString('01001110', 2)[config.ecLevel] + numToBits(mask, 3)
  let message = bitsToArray(bits + pad0(10))
  let generator = bitsToArray('10100110111')
  let remainder = divPoly(message, generator).join('')

  let formatInfo = numToBits(
    parseInt(bits + pad0(10, remainder), 2) ^ 21522,
    15,
  )

  let a = 0,
    b = 0
  //horizontal
  ;[...range(0, 8 + 1), ...range(matrix.length - 7, matrix.length)].map(
    (h, i, arr) => {
      //vertical
      let v = arr[arr.length - 1 - i]

      if (h !== 6) matrix[8][h] = formatInfo[a++] === '1'
      if (v !== 6 && v !== matrix.length - 8)
        matrix[v][8] = formatInfo[b++] === '1'
    },
  )
  return matrix
}

export let applyVerisonInformation = (
  config: QrParameters,
  matrix: (boolean | null)[][],
) => {
  if (config.version < 7) return matrix
  let generator = bitsToArray('1111100100101')
  let bits = numToBits(config.version, 6)
  let message = bitsToArray(bits + pad0(12))
  let remainder = divPoly(message, generator).join('')
  let versionInfo = bits + pad0(12, remainder)
  /* for (let x = 0; x < 6; x++)
    for (let y = 0; y < 3; y++)
      matrix[matrix.length - 9 - y][5 - x] = matrix[5 - x][
        matrix.length - 9 - y
      ] = versionInfo[d++] === '1'*/
  /* for (let i = 18; i--; ) {
    let [x, y] = [matrix.length - 9 - (i % 3), 5 - (0 | (i / 3))]
    matrix[x][y] = matrix[y][x] = versionInfo[i] === '1'
  }*/
  let d = 0
  range(0, 6).map((x) =>
    range(0, 3).map(
      (y) =>
        (matrix[matrix.length - 9 - y][5 - x] = matrix[5 - x][
          matrix.length - 9 - y
        ] =
          versionInfo[d++] === '1'),
    ),
  )

  return matrix
}
