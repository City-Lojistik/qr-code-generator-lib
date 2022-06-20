import { range, range0 } from '../utilities'

let exponents: { [key: number]: number } = {}
let logs: { [key: number]: number } = { 1: 0 }
let generateExponentsLookUpTables = () => {
  range0(255).reduce(
    (acc, i) => (
      (logs[(exponents[i] = acc)] = i), acc & 128 ? (acc * 2) ^ 285 : acc * 2
    ),
    1,
  )
}
let mul = (x: number, y: number) =>
  x * y === 0 ? 0 : exponents[(logs[x] + logs[y]) % 255]

let result: number[]
let mulPoly = (poly1: number[], poly2: number[]) => (
  (result = []),
  poly1.map((p1, j) => poly2.map((p2, i) => (result[j + i] ^= mul(p2, p1)))),
  result
)

generateExponentsLookUpTables()
//export let [generateExponentsLookUpTables(), logs] = generateExponentsLookUpTables()

export let divPoly = (dividend: number[], divisor: number[]) => (
  (result = dividend.slice()),
  range0(dividend.length - divisor.length + 1).map((i) =>
    range(1, divisor.length).map(
      (j) => (result[i + j] ^= mul(divisor[j], result[i])),
    ),
  ),
  result.slice(result.length - divisor.length + 1) //remainder
)

export let generatorPoly = (n: number) =>
  range0(n).reduce(
    (acc, i) => mulPoly(acc, [1, exponents[i /* % 255*/]]),
    [1],
  )
