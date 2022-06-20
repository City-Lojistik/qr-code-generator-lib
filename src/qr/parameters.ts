import {
  EcLevels,
  getAlignmentPattern,
  getChracterCountBits,
  getDimensions,
  getGroups,
  getRemainderBits,
  getRequiredNumberOfBits,
} from './definitions'
import { encodeUtf8, range } from './utilities'
export type QrParameters = {
  ecLevel: EcLevels
  version: number
  characterCountBits: number
  requiredNumberOfBits: number
  remainderBits: number
  dimensions: number
  alignmentPattern: number[]
  groups: Array<{ blocks: number; wordsPerBlock: number; ecPerBlock: number }>
}

let versionLookup: {
  ecLevel: number
  version: number
  groups: { blocks: number; wordsPerBlock: number; ecPerBlock: number }[]
  requiredNumberOfBits: number
  characterCountBits: number
  upperLimit: number
  remainderBits: number
  dimensions: number
  alignmentPattern: number[]
}[] = []
let createVersionLookup = () => {
  let requiredNumberOfBits,
    characterCountBits,
    upperLimit,
    groups,
    version = 0

  range(1, 41).map((version) => {
    range(0, 4).map((ecLevel) => {
      groups = getGroups(version, ecLevel)
      requiredNumberOfBits = getRequiredNumberOfBits(groups)
      characterCountBits = getChracterCountBits(version)
      upperLimit = 0 | ((requiredNumberOfBits - (4 + characterCountBits)) / 8)

      versionLookup.push({
        ecLevel,
        version,
        groups,
        requiredNumberOfBits,
        characterCountBits,
        upperLimit,
        remainderBits: getRemainderBits(version),
        dimensions: getDimensions(version),
        alignmentPattern: getAlignmentPattern(version),
      })
    })
  })
}
createVersionLookup()

let getSmallestVersion = (length: number, ecLevel = EcLevels.L) => {
  let lookup = versionLookup.filter(
    (v) => v.ecLevel === ecLevel && v.upperLimit >= length,
  )

  if (!lookup) {
    throw new Error('Input too long!')
  }
  return lookup[0]
}

export let getParameters = (
  content: string,
  ecLevel = EcLevels.L,
): QrParameters => {
  return getSmallestVersion(encodeUtf8(content).length, ecLevel)
}
