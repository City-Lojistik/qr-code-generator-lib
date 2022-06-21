# qr-code-generator-lib

A tiny QR Code generator that fits in a QR Code (< 2950 bytes gzipped).
The generated SVG from the default renderer is also quite small.

## Install

```shell
$ npm install qr-code-generator-lib
```

## Usage

### Import

```javascript
import { getMatrix, render } from 'qr-code-generator-lib'
```

### Methods

`getMatrix` generates a 2D array from the input with dark (true) and light (false) items.
`render` renders an SVG string from the 2D array. You can easily write a custom render function.

```javascript
someElement.innerHTML = render(getMatrix('Hello World!'), '#000')
```
