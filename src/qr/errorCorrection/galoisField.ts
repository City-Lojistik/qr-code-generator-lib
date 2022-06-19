import { range } from '../utilities'

function generateExponentsLookUpTables() {
  const exponents: { [key: number]: number } = {}
  const logs: { [key: number]: number } = { 1: 0 }
  range(0, 255).reduce(
    (acc, i) => (
      (logs[(exponents[i] = acc)] = i), acc & 128 ? (acc * 2) ^ 285 : acc * 2
    ),
    1,
  )
  return { exponents, logs }
}
function mul(x: number, y: number) {
  return x * y === 0 ? 0 : exponents[(logs[x] + logs[y]) % 255]
}

function mulPoly(poly1: Uint8Array, poly2: number[]) {
  let result: number[] = []
  poly1.forEach((p1, j) =>
    poly2.forEach((p2, i) => (result[j + i] ^= mul(p2, p1))),
  )
  return Uint8Array.from(result)
}

export const { exponents, logs } = generateExponentsLookUpTables()

export function divPoly(dividend: Uint8Array, divisor: Uint8Array) {
  let result = dividend.slice()
  let dl = divisor.length - 1
  for (let i = 0; i < dividend.length - dl; i++)
    for (let j = 1; j < dl + 1; j++) result[i + j] ^= mul(divisor[j], result[i])
  //remainder
  return result.slice(result.length - dl)
}

export function generatorPoly(n: number) {
  return range(0, n).reduce(
    (acc, i) => mulPoly(acc, [1, exponents[i /* % 255*/]]),
    Uint8Array.from([1]),
  )
}
