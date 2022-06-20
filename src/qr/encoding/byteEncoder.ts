import type { QrParameters } from '../parameters'
import { chunkString, numToBits, pad0, encodeUtf8, range } from '../utilities'
import { getEcWords } from '../errorCorrection/reedSolomon'

const encodeSymbols = (content: string) => {
  return [...encodeUtf8(content)].map((el) => numToBits(el, 8)).join('')
}
const createBlocks = (config: QrParameters, encodedData: number[]) => {
  let currentElement = 0
  return config.groups
    .map((group) => {
      return range(0, group.blocks).map((_) =>
        range(0, group.wordsPerBlock).map((_) => encodedData[currentElement++]),
      )
    })
    .flat()
}

const interleave = (blocks: number[][]) => {
  const maxLength = Math.max(...blocks.map((b) => b.length))
  const result = []
  for (let i = 0; i < maxLength; i++)
    for (let j = 0; j < blocks.length; j++)
      if (i < blocks[j].length) result.push(blocks[j][i])

  return result
}

export const encode = (config: QrParameters, content: string) => {
  let encodedData = chunkString(
    fillUpBits(
      config,
      prefix(config.characterCountBits, content) + encodeSymbols(content),
    ),
    8,
  )
  let byteArray = encodedData.map((el) => parseInt(el, 2))

  const blocks = createBlocks(config, byteArray)

  const ecBlocks = blocks.map((b) => getEcWords(b, config.groups[0].ecPerBlock))
  byteArray = interleave(blocks)
  let ecByteArray = interleave(ecBlocks)

  let bits =
    [...byteArray, ...ecByteArray]
      .map((uint) => numToBits(uint, 8))
      .flat()
      .join('') + suffix(config.remainderBits)

  return bits
}

const fillUpBits = (config: QrParameters, bits: string) => {
  const diff = config.requiredNumberOfBits - bits.length
  if (diff > 0) {
    bits += pad0(Math.min(diff, 4)) //fill up to 0000
    bits += pad0(8 - (bits.length % 8)) //fill up to be multiple of 8

    while (bits.length < config.requiredNumberOfBits)
      bits += (60433).toString(2) // '1110110000010001' //fill up until required number of bits
  }
  return bits.substr(0, config.requiredNumberOfBits)
}

const prefix = (characterCountBits: number, content: string) => {
  return '0100' + numToBits(content.length, characterCountBits)
}
const suffix = (remainderBits: number) => {
  return pad0(remainderBits)
}
