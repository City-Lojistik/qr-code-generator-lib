import { getParameters } from './parameters'
import { place } from './modulePlacement/placeModules'
import { encode } from './encoding/byteEncoder'
import { EcLevels } from './definitions'
/**
 * Generates a QR code matrix.
 * @param content The content to encode
 * @param ecLevel The error correction level to use
 * @returns The QR code as a matrix, truthy values are dark
 */
export let getMatrix = (content: string, ecLevel = EcLevels.L) => {
  let config = getParameters(content, ecLevel)
  return place(
    config,
    encode(config, content),
  )
}
