export function chunkString(content: string, length: number): string[] {
  return Array.from({ length: Math.ceil(content.length / length) }, (_, i) =>
    content.substr(i++ * length, length),
  )
}

export function get0s(count: number) {
  return ''.padStart(count, '0')
}

export function pad0(content: string, length: number) {
  return content.padStart(length, '0')
}

export function numToBits(content: number, length: number) {
  return pad0(content.toString(2), length)
}

export function concatTypedArrays(a: Uint8Array, b: Uint8Array): Uint8Array {
  const c = new Uint8Array(a.length + b.length)
  c.set(a, 0)
  c.set(b, a.length)
  return c
}

export function range(from: number, to: number): number[] {
  return Array(to - from)
    .fill(from)
    .map((x, index) => x + index)
}
export function createMatrix(dimensions: number): boolean[][] {
  return [...new Array(dimensions)].map(() =>
    [...new Array(dimensions)].fill(null),
  )
}
export function cloneMatrix(matrix: boolean[][]) {
  return matrix.slice().map((m) => m.slice())
}
export function mergeMatrices(
  matrix1: boolean[][],
  matrix2: boolean[][],
): boolean[][] {
  let result = cloneMatrix(matrix1)
  iterateOverMatrix(matrix1, (val, x, y) => {
    if (val === null) {
      result[y][x] = matrix2[y][x]
    }
  })
  return result
}

export enum MatrixIterationDirection {
  Horizontal,
  Vertical,
}
export function iterateOverMatrix(
  matrix: boolean[][],
  fn: (value: boolean, x: number, y: number, matrix: boolean[][]) => void,
  fnSecondary: (index: number, matrix: boolean[][]) => void = () => {},
  direction = MatrixIterationDirection.Horizontal,
) {
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix.length; x++) {
      if (direction === MatrixIterationDirection.Horizontal)
        fn(matrix[y][x], x, y, matrix)
      else fn(matrix[x][y], y, x, matrix)
    }
    fnSecondary(y, matrix)
  }
}

export function encodeUtf8(s: string) {
  let i = 0,
    ci = 0,
    bytes = new Uint8Array(s.length * 4)
  for (; ci != s.length; ci++) {
    let c = s.charCodeAt(ci)
    if (c < 128) {
      bytes[i++] = c
      continue
    }
    if (c < 2048) {
      bytes[i++] = (c >> 6) | 192
    } else {
      if (c > 0xd7ff && c < 0xdc00) {
        c = 0x10000 + ((c & 0x03ff) << 10) + (s.charCodeAt(++ci) & 0x03ff)
        bytes[i++] = (c >> 18) | 240
        bytes[i++] = ((c >> 12) & 63) | 128
      } else bytes[i++] = (c >> 12) | 224
      bytes[i++] = ((c >> 6) & 63) | 128
    }
    bytes[i++] = (c & 63) | 128
  }
  return bytes.subarray(0, i)
}
