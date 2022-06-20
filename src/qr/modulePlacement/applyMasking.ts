import {
  cloneMatrix,
  iterateOverMatrix,
  mergeMatrices,
  range,
} from '../utilities'

let getLineGroupScore = (matrix: (boolean | null)[][]) => {
  let score = 0
  let currentColor = false
  let currentRun = 0

  let scoreLineGroupCondition = () => {
    score += currentRun >= 5 ? 3 + Math.max(0, currentRun - 5) : 0
    currentRun = 0
  }
  //horizontal & vertical
  ;[0, 1].forEach((dir) => {
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
  return score
}

let getSquareScore = (matrix: (boolean | null)[][]) => {
  let score = 0

  iterateOverMatrix(matrix, (_, x, y) => {
    if (x < matrix.length - 1 && y < matrix.length - 1) {
      let squareBitMask = range(0, 4).reduce(
        //get current, right, bottom and bottom-right module and merge them to a bitmask
        (acc, dirBitMask, i) =>
          acc |
          (+(matrix[y + (dirBitMask >> 1)][
            x + (dirBitMask & 0b01)
          ] as boolean) <<
            i),
        0,
      )
      let isSquare = squareBitMask === 0 || squareBitMask === 15
      score += isSquare ? 3 : 0
    }
  })
  return score
}

let getFinderConfusionScore = (matrix: (boolean | null)[][]) => {
 
  let template = [true, false, true, true, true, false, true, false, false, false, false]
  let patterns = [
    { template, current: 0 },
    { template: template.slice().reverse(), current: 0 },
  ]

  let score = 0
  let evaluateFinderConfusionCondition = (value: boolean | null) => {
    patterns.forEach((pattern) => {
      pattern.current +=
        value === pattern.template[pattern.current] ? 1 : -pattern.current
      if (pattern.current >= pattern.template.length) {
        score += 40
        pattern.current = 0
      }
    })
  }
  //horizontal & vertical
  ;[0, 1].forEach((dir) => {
    iterateOverMatrix(
      matrix,
      (value) => evaluateFinderConfusionCondition(value),
      () => patterns.forEach((pattern) => (pattern.current = 0)),
      dir,
    )
  })
  return score
}

let getColorImbalanceScore = (matrix: (boolean | null)[][]) => {
  let totalCount = matrix.length * matrix.length
  let darkCount = 0
  iterateOverMatrix(matrix, (value) => (darkCount += value ? 1 : 0))

  let percentage = +((darkCount / totalCount) * 100).toFixed(0)
  let lower = percentage - (percentage & 5)
  let higher = lower + 5
  let score =
    Math.min(...[lower, higher].map((el) => Math.abs(el - 50) / 5)) * 10

  return score
}

let evaluateMasking = (matrix: (boolean | null)[][]) => {
  return [
    getLineGroupScore,
    getSquareScore,
    getFinderConfusionScore,
    getColorImbalanceScore,
  ]
    .map((fn) => fn(matrix))
    .reduce((acc, val) => acc + val, 0)
}

export let applyMasking = (
  letalMatrix: (boolean | null)[][],
  dataMatrix: (boolean | null)[][],
) => {
  let maskMatrix = (
    matrix: (boolean | null)[][],
    condition: { (x: any, y: any): boolean; (arg0: number, arg1: number): any },
  ) => {
    let copy = cloneMatrix(matrix)
    iterateOverMatrix(copy, (value, x, y) => {
      if (condition(x, y)) copy[y][x] = !value
    })
    return copy
  }

  let maskingMethods: Array<(x: number, y: number) => boolean> = [
    (x, y) => (x + y) % 2 === 0,
    (x, y) => y % 2 === 0,
    (x, y) => x % 3 === 0,
    (x, y) => (x + y) % 3 === 0,
    (x, y) => (0 | (y / 2 + (0 | (x / 3)))) % 2 === 0,
    (x, y) => ((x * y) % 2) + ((x * y) % 3) === 0,
    (x, y) => (((x * y) % 2) + ((x * y) % 3)) % 2 === 0,
    (x, y) => (((x + y) % 2) + ((x * y) % 3)) % 2 === 0,
  ]

  return maskingMethods
    .map((method) =>
      mergeMatrices(letalMatrix, maskMatrix(dataMatrix, method)),
    )
    .reduce(
      //find the matrix with lowest score
      (acc, matrix, mask) => {
        let score = evaluateMasking(matrix)
        return score < acc.score ? { score, mask, matrix } : acc
      },
      {
        score: 0xffffff,
        mask: 0,
        matrix: [] as (boolean | null)[][],
      },
    )
}
