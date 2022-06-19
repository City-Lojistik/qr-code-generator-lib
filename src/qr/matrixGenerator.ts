import { getParameters } from './parameters'
import { place } from './modulePlacement/placeModules'
import { ByteEncoder } from './encoding/byteEncoder'

export default function getMatrix(content: string) {
  const config = getParameters(content)
  let bitString = new ByteEncoder(config).encode(content)
  return place(config, bitString)
}
