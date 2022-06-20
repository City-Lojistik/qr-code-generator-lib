export const chunkString = (content: string, length: number): string[] => {
  return range(0, Math.ceil(content.length / length)).map((i) =>
    content.substr(i++ * length, length),
  )
}

export const pad0 = (count: number, content: string = '') => {
  return content.padStart(count, '0')
}

export const numToBits = (content: number, count: number) => {
  return pad0(count, content.toString(2))
}
export const bitsToArray = (bits: string) => {
  return [...bits].map(Number)
}

export const range = (from: number, to: number): number[] => {
  return Array.from({ length: to - from }, (_, i) => i + from)
}
export const createMatrix = (dimensions: number): (boolean | null)[][] => {
  const base = range(0, dimensions).map((_) => null)
  return base.map((_) => base.slice())
}
export const cloneMatrix = (matrix: (boolean | null)[][]) => {
  return matrix.slice().map((m) => m.slice())
}
export const mergeMatrices = (
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

export enum MatrixIterationDirection {
  Horizontal,
  Vertical,
}
export const iterateOverMatrix = (
  matrix: (boolean | null)[][],
  fn: (
    value: boolean | null,
    x: number,
    y: number,
    matrix: (boolean | null)[][],
  ) => void,
  fnSecondary: (index: number, matrix: (boolean | null)[][]) => void = () => {},
  direction = MatrixIterationDirection.Horizontal,
) => {
  matrix.forEach(
    (row, y) => (
      row.forEach((val, x) =>
        direction === MatrixIterationDirection.Horizontal
          ? fn(val, x, y, matrix)
          : fn(matrix[x][y], y, x, matrix),
      ),
      fnSecondary(y, matrix)
    ),
  )
}

export const encodeUtf8 = (s: string) => {
  let i = 0,
    ci = 0,
    bytes = [],
    c
  for (; ci != s.length; ci++) {
    c = s.charCodeAt(ci)
    if (c < 128) {
      bytes.push(c)
      continue
    }
    if (c < 2048) {
      bytes.push((c >> 6) | 192)
    } else {
      if (c > 0xd7ff && c < 0xdc00) {
        c = 0x10000 + ((c & 0x03ff) << 10) + (s.charCodeAt(++ci) & 0x03ff)
        bytes.push((c >> 18) | 240)
        bytes.push(((c >> 12) & 63) | 128)
      } else bytes.push((c >> 12) | 224)
      bytes.push(((c >> 6) & 63) | 128)
    }
    bytes.push((c & 63) | 128)
  }
  return bytes
}
