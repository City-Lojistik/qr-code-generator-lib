import { range } from '../utilities'
import { divPoly, generatorPoly } from './galoisField'
export const getEcWords = (
  message: number[],
  ecCodeWordsCount: number,
): number[] => {
  return divPoly(
    message.concat(range(0, ecCodeWordsCount).map((_) => 0)),
    generatorPoly(ecCodeWordsCount),
  )
}
