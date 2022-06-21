import { EcLevels } from './../definitions'
import { divPoly } from '../errorCorrection/galoisField'
import {
  bitsToArray,
  chunkString,
  len,
  numToBits,
  pad0,
  range,
  range0,
} from '../utilities'

export let applyFormatInformation = (
  ecLevel: EcLevels,
  mask: number,
  matrix: (boolean | null)[][],
) => {
  let bits = chunkString('01001110', 2)[ecLevel] + numToBits(mask, 3)

  let formatInfo = numToBits(
    parseInt(
      bits +
        pad0(
          10,
          divPoly(
            bitsToArray(bits + pad0(10)),
            bitsToArray('10100110111'),
          ).join(''),
        ),
      2,
    ) ^ 21522,
    15,
  )

  let a = 0,
    b = 0
  //horizontal
  ;[range0(8 + 1), range(len(matrix) - 7, len(matrix))]
    .flat()
    .map((h, i, arr) => {
      //vertical
      let v = arr.at(-1 - i) as number

      if (h !== 6) matrix[8][h] = formatInfo[a++] === '1'
      if (v !== 6 && v !== len(matrix) - 8)
        matrix[v][8] = formatInfo[b++] === '1'
    })
  return matrix
}

export let applyVerisonInformation = (
  version: number,
  matrix: (boolean | null)[][],
) => {
  if (version < 7) return matrix
  let bits = numToBits(version, 6)

  let versionInfo =
    bits +
    pad0(
      12,
      divPoly(bitsToArray(bits + pad0(12)), bitsToArray('1111100100101')).join(
        '',
      ),
    )
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
  range0(6).map((x) =>
    range0(3).map(
      (y) =>
        ((matrix.at(-9 - y) as boolean[])[5 - x] = matrix[5 - x][
          len(matrix) - 9 - y
        ] =
          versionInfo[d++] === '1'),
    ),
  )

  return matrix
}
