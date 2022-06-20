import { getParameters } from './parameters'
import { place } from './modulePlacement/placeModules'
import { encode } from './encoding/byteEncoder'

export let getMatrix = (content: string) => {
  let config = getParameters(content)
  let bitString = encode(config, content)
  return place(config, bitString)
}
