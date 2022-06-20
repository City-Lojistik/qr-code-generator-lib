import { QrParameters } from '../parameters'
import { createMatrix, range } from '../utilities'

let applyFinderPatterns = (matrix: (boolean | null)[][]) => {
  let dimensions = matrix.length
  let dimensionsSubSeven = dimensions - 7
  let drawSquares = (x: number, y: number) => {
    range(0, 3).map((j) => {
      range(j, 7 - j).map(
        (i) =>
          (matrix[y + j][x + i] =
            matrix[y + 6 - j][x + i] =
            matrix[y + i][x + j] =
            matrix[y + i][x + 6 - j] =
              j % 2 == 0),
      )
      matrix[y + 3][x + 3] = true
    })
  }

  let drawGapNextToSquares = () => {
    range(0, 8).map(
      (i) =>
        (matrix[i][7] =
          matrix[dimensions - i - 1][7] =
          matrix[7][i] =
          matrix[7][dimensions - i - 1] =
          matrix[dimensionsSubSeven - 1][i] =
          matrix[i][dimensionsSubSeven - 1] =
            false),
    )
  }

  drawSquares(0, 0)
  drawSquares(0, dimensionsSubSeven)
  drawSquares(dimensionsSubSeven, 0)
  drawGapNextToSquares()
}

let applyTimingPatterns = (matrix: (boolean | null)[][]) =>
  range(7, matrix.length - 7).map(
    (i) => (matrix[6][i] = matrix[i][6] = i % 2 === 0),
  )

let applyDarkModule = (matrix: (boolean | null)[][]) =>
  (matrix[matrix.length - 8][8] = true)

let applyReservedAreas = (matrix: (boolean | null)[][], version: number) => {
  let dimensions = matrix.length
  ;[...range(0, 9), ...range(dimensions - 8, dimensions)].map(
    (i) => (matrix[i][8] = matrix[8][i] = false),
  )

  //for version >=7 codes add additional areas
  if (version >= 7)
    range(0, 3).map((i) =>
      range(0, 6).map(
        (j) =>
          (matrix[dimensions - 11 + i][j] = matrix[j][dimensions - 11 + i] =
            false),
      ),
    )
}

let applyAlignmentPatterns = (
  matrix: (boolean | null)[][],
  locations: number[],
) => {
  let drawPattern = (x: number, y: number) => {
    range(0, 3).map((j) =>
      range(j, 5 - j).map(
        (i) =>
          (matrix[y + j][x + i] =
            matrix[y + 4 - j][x + i] =
            matrix[y + i][x + j] =
            matrix[y + i][x + 4 - j] =
              j % 2 == 0),
      ),
    )
  }

  let [minLocation, maxLocation] = [
    Math.min(...locations),
    Math.max(...locations),
  ]
  locations
    .map((x, i, array) => array.map((y) => [x, y])) //all coordinate combinations
    .flat()
    .filter(
      //do not draw if it overlaps the finder patterns
      ([x, y]) =>
        !(
          (x === minLocation && (y === minLocation || y === maxLocation)) ||
          (y === minLocation && (x === minLocation || x === maxLocation))
        ),
    ) //add -2 offset, as location-coordinates use center, while we use top-left
    .map(([x, y]) => [x - 2, y - 2])
    .map(([x, y]) => drawPattern(x, y))
}

export let getPatternMatrix = (config: QrParameters) => {
  let patternMatrix = createMatrix(config.dimensions)
  applyFinderPatterns(patternMatrix)
  applyAlignmentPatterns(patternMatrix, config.alignmentPattern)
  applyReservedAreas(patternMatrix, config.version)
  applyTimingPatterns(patternMatrix)
  applyDarkModule(patternMatrix)
  return patternMatrix
}
