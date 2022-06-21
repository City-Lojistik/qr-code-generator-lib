import {
  EcLevels,
  getAlignmentPattern,
  getChracterCountBits,
  getDimensions,
  getGroups,
  getRemainderBits,
  getRequiredNumberOfBits,
} from './definitions'
import { encodeUtf8, len, range, range0 } from './utilities'
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

let requiredNumberOfBits, characterCountBits, groups

range(1, 41).map((version) => {
  range0(4).map((ecLevel) => {
    groups = getGroups(version, ecLevel)
    requiredNumberOfBits = getRequiredNumberOfBits(groups)
    characterCountBits = getChracterCountBits(version)

    versionLookup.push({
      ecLevel,
      version,
      groups,
      requiredNumberOfBits,
      characterCountBits,
      upperLimit: 0 | ((requiredNumberOfBits - (4 + characterCountBits)) / 8),
      remainderBits: getRemainderBits(version),
      dimensions: getDimensions(version),
      alignmentPattern: getAlignmentPattern(version),
    })
  })
})

let getSmallestVersion = (length: number, ecLevel: EcLevels) => {
  let lookup = versionLookup.filter(
    (v) => v.ecLevel === ecLevel && v.upperLimit >= length,
  )

  if (!lookup) throw new Error('Input too long!')

  return lookup[0]
}

export let getParameters = (content: string, ecLevel: EcLevels): QrParameters =>
  getSmallestVersion(len(encodeUtf8(content)), ecLevel)
