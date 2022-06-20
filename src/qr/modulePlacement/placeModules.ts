import { QrParameters } from '../parameters'
import { createMatrix } from '../utilities'
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
  let dataMatrix = createMatrix(patternMatrix.length)
  let MAX = patternMatrix.length - 1
  let x = MAX
  let y = MAX
  let dx = 0
  let d = 0
  let direction: MoveDirection = MoveDirection.Up

  while (d < data.length) {
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
  applyFormatInformation(config, mask, matrix)
  return applyVersionInformation(config, matrix)
}
