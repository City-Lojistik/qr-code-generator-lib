import { QrParameters } from '../parameters'
import { createMatrix, len } from '../utilities'
import { applyMasking } from './applyMasking'
import { getPatternMatrix } from './applyPatterns'
import {
  applyFormatInformation,
  applyVerisonInformation as applyVersionInformation,
} from './applyInfo'
enum MoveDirection {
  Up = -1,
  Down = 1,
}

let applyData = (patternMatrix: (boolean | null)[][], data: string) => {
  let dataMatrix = createMatrix(len(patternMatrix)),
    MAX = len(patternMatrix) - 1,
    x = MAX,
    y = MAX,
    dx = 0,
    d = 0,
    direction: MoveDirection = MoveDirection.Up

  while (d < len(data)) {
    patternMatrix[y][x - dx] === null &&
      (dataMatrix[y][x - dx] = data[d++] === '1')
    //only empty fields, otherwise skip

    if (dx === 1) {
      y += direction //go up or down
      if (y < 0 || y > MAX) {
        //flip direction if reaching top or bottom, move column to left
        y = (MAX + MAX * direction) / 2
        direction *= -1
        x -= 2
      }
    }
    dx ^= 1 //alternate from right to left in each column
    //next to vertical timing pattern? -> skip
    x >= 6 && x <= 7 && (x = 5)
  }
  return dataMatrix
}

export let place = (config: QrParameters, data: string) => {
  let patternMatrix = getPatternMatrix(config)
  let dataMatrix = applyData(patternMatrix, data)
  let { mask, matrix } = applyMasking(patternMatrix, dataMatrix)
  applyFormatInformation(config.ecLevel, mask, matrix)
  return applyVersionInformation(config.version, matrix)
}
