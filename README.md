# qr-code-generator-lib

A tiny QR Code generator that fits in a QR Code (< 2950 bytes gzipped) \*.
The default renderer also generates a very small SVG :)

\* It does not support dedicated (alpha)numeric and kanji modes, only utf8/byte mode of the standard i.e. the generated code will be slightly larger in cases where those character sets are used exclusively.


[Demo Page](https://alexruppert.github.io/qr-code-generator-lib/)

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

* `getMatrix` generates a 2D array from the input with dark (true) and light (false) modules.
* `render` renders an SVG string from the 2D array. The optional 2nd parameter sets the color of the modules.

```javascript
someElement.innerHTML = render(getMatrix('Hello World!'), '#000')
```

* `renderPath` is intended for reactive frameworks and returns the d-attribute of the path together with the SVG view box dimensions.

```javascript
const {d, dim} = renderPath(getMatrix('Hello World!'))
//...
<svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${dim} ${dim}`} stroke="#000" stroke-width="1.05">
  <path d={d}/>
</svg>
```
