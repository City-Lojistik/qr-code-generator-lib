import { range } from '../utilities'

let generateExponentsLookUpTables = () => {
  let exponents: { [key: number]: number } = {}
  let logs: { [key: number]: number } = { 1: 0 }
  range(0, 255).reduce(
    (acc, i) => (
      (logs[(exponents[i] = acc)] = i), acc & 128 ? (acc * 2) ^ 285 : acc * 2
    ),
    1,
  )
  return [exponents, logs]
}
let mul = (x: number, y: number) => {
  return x * y === 0 ? 0 : exponents[(logs[x] + logs[y]) % 255]
}

let mulPoly = (poly1: number[], poly2: number[]) => {
  let result: number[] = []
  poly1.map((p1, j) =>
    poly2.map((p2, i) => (result[j + i] ^= mul(p2, p1))),
  )
  return result
}

export let [exponents, logs] = generateExponentsLookUpTables()

export let divPoly = (dividend: number[], divisor: number[]) => {
  let result = dividend.slice()
  let dl = divisor.length - 1

  range(0, dividend.length - dl).map((i) =>
    range(1, dl + 1).map((j) => (result[i + j] ^= mul(divisor[j], result[i]))),
  )

  //remainder
  return result.slice(result.length - dl)
}

export let generatorPoly = (n: number) => {
  return range(0, n).reduce(
    (acc, i) => mulPoly(acc, [1, exponents[i /* % 255*/]]),
    [1],
  )
}
