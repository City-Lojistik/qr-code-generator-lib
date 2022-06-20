import type { QrParameters } from '../parameters'
import {
  chunkString,
  numToBits,
  pad0,
  encodeUtf8,
  range,
  range0,
} from '../utilities'
import { getEcWords } from '../errorCorrection/reedSolomon'

let encodeSymbols = (content: string) =>
  encodeUtf8(content)
    .map((el) => numToBits(el, 8))
    .join('')

let currentElement: number
let createBlocks = (config: QrParameters, encodedData: number[]) => (
  (currentElement = 0),
  config.groups
    .map((group) =>
      range0(group.blocks).map((i) =>
        range0(group.wordsPerBlock).map((j) => encodedData[currentElement++]),
      ),
    )
    .flat()
)
let result: number[]
let interleave = (blocks: number[][]) => (
  (result = []),
  range0(blocks.length).map((j) =>
    range0(blocks[j].length).map(
      (i) => (result[i * blocks.length + j] = blocks[j][i]),
    ),
  ),
  result
)
let blocks, bits
export let encode = (config: QrParameters, content: string) => (
  (blocks = createBlocks(
    config,
    chunkString(
      fillUpBits(
        config.requiredNumberOfBits,
        '0100' +
          numToBits(content.length, config.characterCountBits) +
          encodeSymbols(content),
      ),
      8,
    ).map((el) => parseInt(el, 2)),
  )),
  [
    interleave(blocks),
    interleave(blocks.map((b) => getEcWords(b, config.groups[0].ecPerBlock))),
  ]
    .flat()
    .map((uint) => numToBits(uint, 8))
    .join('') + pad0(config.remainderBits)
)

let fillUpBits = (requiredNumberOfBits: number, bits: string) => {
  bits += pad0(Math.min(requiredNumberOfBits - bits.length, 4)) //fill up to 0000
  bits += pad0(8 - (bits.length % 8)) //fill up to be multiple of 8
  return bits
    .padEnd(requiredNumberOfBits, '1110110000010001')
    .substr(0, requiredNumberOfBits)
}
