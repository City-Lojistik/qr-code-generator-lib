/**
 * Renders as a SVG string.
 * @param matrix The matrix to convert to SVG
 * @param color  The color of the dark modules
 * @returns The SVG string
 */
export let render = (matrix: (boolean | null)[][], color: string = '#000') => {
  let d = ''
  matrix.map((row, y) => {
    let lastX = 0,
      x = 0,
      len
    d += `M${5} ${y + 5}`
    for (; x < matrix.length; x++) {
      if (row[x]) {
        len = 0
        while (row[++len + x]);
        d += `m${x - lastX} 0h${len}`
        lastX = (x += len - 1) + 1
      }
    }
  })
  return `<svg viewBox="0 0 ${matrix.length + 10} ${
    matrix.length + 10
  }" stroke=${color} stroke-width=1.05 xmlns=http://www.w3.org/2000/svg><path d="${d}"/></svg>`
}
