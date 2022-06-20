import { range0 } from '../utilities'
import { divPoly, generatorPoly } from './galoisField'
export let getEcWords = (
  message: number[],
  ecCodeWordsCount: number,
): number[] =>
  divPoly(
    message.concat(range0(ecCodeWordsCount).map((_) => 0)),
    generatorPoly(ecCodeWordsCount),
  )
