# qr-code-generator-lib

A tiny QR Code generator that fits in a QR Code (< 2950 bytes gzipped) \*.
The generated SVG from the default renderer is also quite small.

<sup><sub>\* does not support dedicated (alpha)numeric and kanji modes, only utf8/byte mode of the standard i.e. the generated code will be slightly larger in cases where those character sets are used exclusively.</sub></sup>

Demo page:

## Install

```shell
$ npm install qr-code-generator-lib
```

## Usage

### Import

```javascript
import { getMatrix, render, renderPath } from 'qr-code-generator-lib'
```

### Methods

`getMatrix` generates a 2D array from the input with dark (true) and light (false) modules.
`render` renders an SVG string from the 2D array, optional 2nd parameter sets the color of the modules.

```javascript
someElement.innerHTML = render(getMatrix('Hello World!'), '#000')
```

For reactive frameworks you can get the svg path and dimensions directly via `renderPath`

```javascript
const {d, dim} = renderPath(getMatrix('Hello World!'))
//...
<svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${dim} ${dim}`} stroke="#000" stroke-width="1.05">
  <path d={d}/>
</svg>
```
