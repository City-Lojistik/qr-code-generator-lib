import { QrParameters } from '../parameters'
import { createMatrix, len, range, range0 } from '../utilities'

let applyFinderPatterns = (matrix: (boolean | null)[][]) => {
  let dimensions = len(matrix)
  let dimensionsSubSeven = dimensions - 7
  let drawSquares = (x: number, y: number) => {
    range0(3).map((j) => {
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
    range0(8).map(
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
  range(7, len(matrix) - 7).map(
    (i) => (matrix[6][i] = matrix[i][6] = i % 2 === 0),
  )

let applyDarkModule = (matrix: (boolean | null)[][]) =>
  ((matrix.at(-8) as boolean[])[8] = true)

let applyReservedAreas = (matrix: (boolean | null)[][], version: number) => {
  let dimensions = len(matrix)
  ;[range0(9), range(dimensions - 8, dimensions)]
    .flat()
    .map((i) => (matrix[i][8] = matrix[8][i] = false))

  //for version >=7 codes add additional areas
  if (version >= 7)
    range0(3).map((i) =>
      range0(6).map(
        (j) =>
          (matrix[dimensions - 11 + i][j] = matrix[j][dimensions - 11 + i] =
            false),
      ),
    )
}

let applyAlignmentPatterns = (
  matrix: (boolean | null)[][],
  locations: number[],
) =>
  locations.map((x, i) =>
    locations
      .slice(+(i === 0 || i == len(locations) - 1), i > 0 ? len(locations) : -1)
      //all coordinate combinations,  do not draw if it overlaps the finder patterns
      .map((y) =>
        range0(3).map((j) =>
          range(j, 5 - j).map(
            (i) =>
              (matrix[y - 2 + j][x - 2 + i] =
                matrix[y + 2 - j][x - 2 + i] =
                matrix[y - 2 + i][x - 2 + j] =
                matrix[y - 2 + i][x + 2 - j] =
                  j % 2 === 0),
          ),
        ),
      ),
  )

export let getPatternMatrix = (config: QrParameters) => {
  let patternMatrix = createMatrix(config.dimensions)
  applyFinderPatterns(patternMatrix)
  applyAlignmentPatterns(patternMatrix, config.alignmentPattern)
  applyReservedAreas(patternMatrix, config.version)
  applyTimingPatterns(patternMatrix)
  applyDarkModule(patternMatrix)
  return patternMatrix
}
