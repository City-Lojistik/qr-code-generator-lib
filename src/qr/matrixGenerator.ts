import { getParameters } from './parameters'
import { place } from './modulePlacement/placeModules'
import { encode } from './encoding/byteEncoder'

export const getMatrix = (content: string) => {
  const config = getParameters(content)
  let bitString = encode(config, content)
  return place(config, bitString)
}
