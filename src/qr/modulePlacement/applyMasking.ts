import { bitsToArray, range0 } from './../utilities'
import { cloneMatrix, iterateOverMatrix, mergeMatrices } from '../utilities'

let score: number = 0
let getLineGroupScore = (matrix: (boolean | null)[][]) => {
  let currentColor = false

  let currentRun = 0

  let scoreLineGroupCondition = () => {
    score += currentRun >= 5 ? currentRun - 2 : 0
    currentRun = 0
  }
  //horizontal & vertical
  ;[0, 1].map((dir) => {
    iterateOverMatrix(
      matrix,
      (value) => {
        if (value !== currentColor) {
          scoreLineGroupCondition()
          currentColor = value as boolean
        }
        currentRun++
      },
      scoreLineGroupCondition,
      dir,
    )
  })
}

let getSquareScore = (matrix: (boolean | null)[][]) => {
  iterateOverMatrix(matrix, (_, x, y) => {
    if (x < matrix.length - 1 && y < matrix.length - 1) {
      let squareBitMask = range0(4).reduce(
        //get current, right, bottom and bottom-right module and merge them to a bitmask
        (acc, dirBitMask, i) =>
          acc |
          (+(matrix[y + (dirBitMask >> 1)][
            x + (dirBitMask & 0b01)
          ] as boolean) <<
            i),
        0,
      )

      // let isSquare = squareBitMask === 0 || squareBitMask === 15
      score += squareBitMask % 15 === 0 ? 3 : 0
    }
  })
}

let getFinderConfusionScore = (matrix: (boolean | null)[][]) => {
  let patterns = [
    { template: bitsToArray('10111010000'), current: 0 },
    { template: bitsToArray('00001011101'), current: 0 },
  ]

  let evaluateFinderConfusionCondition = (value: boolean | null) =>
    patterns.map((pattern) => {
      pattern.current +=
        +(value as boolean) === pattern.template[pattern.current]
          ? 1
          : -pattern.current
      if (pattern.current >= pattern.template.length)
        (score += 40), (pattern.current = 0)
    })

  //horizontal & vertical
  ;[0, 1].map((dir) => {
    iterateOverMatrix(
      matrix,
      (value) => evaluateFinderConfusionCondition(value),
      () => patterns.map((pattern) => (pattern.current = 0)),
      dir,
    )
  })
}

let getColorImbalanceScore = (matrix: (boolean | null)[][]) => {
  let totalCount = matrix.length * matrix.length
  let darkCount = 0
  iterateOverMatrix(matrix, (value) => (darkCount += +(value as boolean)))

  let percentage = +((darkCount / totalCount) * 100)
  let lower = percentage - (percentage & 5)

  score +=
    Math.min(...[lower, lower + 5].map((el) => Math.abs(el - 50) / 5)) * 10 + 5
}

let maskingMethods: Array<(x: number, y: number) => number> = [
  (x, y) => (x + y) % 2,
  (x, y) => y % 2,
  (x, y) => x % 3,
  (x, y) => (x + y) % 3,
  (x, y) => (0 | (y / 2 + (0 | (x / 3)))) % 2,
  (x, y) => ((x * y) % 2) + ((x * y) % 3),
  (x, y) => (((x * y) % 2) + ((x * y) % 3)) % 2,
  (x, y) => (((x + y) % 2) + ((x * y) % 3)) % 2,
]

let evaluateMasking = (matrix: (boolean | null)[][]) => (
  (score = 0),
  getLineGroupScore(matrix),
  getSquareScore(matrix),
  getFinderConfusionScore(matrix),
  getColorImbalanceScore(matrix)
)

let maskMatrix = (
  matrix: (boolean | null)[][],
  condition: { (x: any, y: any): number; (arg0: number, arg1: number): any },
) => {
  let copy = cloneMatrix(matrix)
  iterateOverMatrix(copy, (value, x, y) =>
    !condition(x, y) ? (copy[y][x] = !value) : 0,
  )
  return copy
}

export let applyMasking = (
  patternMatrix: (boolean | null)[][],
  dataMatrix: (boolean | null)[][],
) =>
  maskingMethods
    .map((method) =>
      mergeMatrices(patternMatrix, maskMatrix(dataMatrix, method)),
    )
    .reduce(
      //find the matrix with lowest score
      (acc, matrix, mask) => (
        evaluateMasking(matrix),
        score < acc.score ? { score, mask, matrix } : acc
      ),
      {
        score: 1 << 30,
        mask: 0,
        matrix: [] as (boolean | null)[][],
      },
    )
