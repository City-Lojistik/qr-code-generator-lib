export let chunkString = (content: string, length: number): string[] =>
  range0(Math.ceil(len(content) / length)).map((i) =>
    content.substr(i++ * length, length),
  )

export let pad0 = (count: number, content: string = '') =>
  content.padStart(count, '0')

export let numToBits = (content: number, count: number) =>
  pad0(count, content.toString(2))

export let bitsToArray = (bits: string) => [...bits].map(Number)

export let range = (from: number, to: number): number[] =>
  Array.from({ length: to - from }, (_, i) => i + from)
export let range0 = (to: number): number[] => range(0, to)
export let createMatrix = (dimensions: number): (boolean | null)[][] => {
  let base = range0(dimensions).map((_) => null)
  return base.map((_) => base.slice())
}
export let cloneMatrix = (matrix: (boolean | null)[][]) =>
  matrix.slice().map((m) => m.slice())

export let len = (array: any[] | string) => array.length
export let mergeMatrices = (
  matrix1: (boolean | null)[][],
  matrix2: (boolean | null)[][],
): (boolean | null)[][] => {
  let result = cloneMatrix(matrix1)
  iterateOverMatrix(
    matrix1,
    (val, x, y) => val === null && (result[y][x] = matrix2[y][x]),
  )
  return result
}
/*
export let MatrixIterationDirectionHorizontal = 0
export let MatrixIterationDirectionVertical = 1*/

export let iterateOverMatrix = (
  matrix: (boolean | null)[][],
  fn: (
    value: boolean | null,
    x: number,
    y: number,
    matrix: (boolean | null)[][],
  ) => void,
  fnSecondary: (index: number, matrix: (boolean | null)[][]) => void = () => {},
  direction = 0,
) => {
  matrix.map(
    (row, y) => (
      row.map((val, x) =>
        direction === 0
          ? fn(val, x, y, matrix)
          : fn(matrix[x][y], y, x, matrix),
      ),
      fnSecondary(y, matrix)
    ),
  )
}

export let encodeUtf8 = (s: string) => {
  let ci = 0,
    bytes = [],
    c

  for (; ci < len(s); ci++) {
    if ((c = s.charCodeAt(ci)) < 128 && bytes.push(c)) continue

    if (c < 2048) bytes.push((c >> 6) | 192)
    else {
      if (c > 0xd7ff && c < 0xdc00) {
        c = 0x10000 + ((c & 0x03ff) << 10) + (s.charCodeAt(++ci) & 0x03ff)
        bytes.push((c >> 18) | 240, ((c >> 12) & 63) | 128)
      } else bytes.push((c >> 12) | 224)
      bytes.push(((c >> 6) & 63) | 128)
    }
    bytes.push((c & 63) | 128)
  }
  return bytes
}
