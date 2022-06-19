import { divPoly, generatorPoly } from './galoisField'
export function getEcWords(
  message: Uint8Array,
  ecCodeWordsCount: number,
): Uint8Array {
  return divPoly(
    new Uint8Array([...message, ...new Uint8Array(ecCodeWordsCount)]),
    generatorPoly(ecCodeWordsCount),
  )
}
