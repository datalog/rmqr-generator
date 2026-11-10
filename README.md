# rMQR Code generator

Rectangular Micro QR Code generator in pure JavaScript with compact SVG output. ISO/IEC 23941:2022. No dependencies.

The generator combines Numeric, Alphanumeric, Byte, and Kanji segments to fit your text into the smallest symbol by area. By default, it raises error correction from M to H when the data fits the same version. Pass a string for the default settings or an options object to control encoding and appearance.

### [rMQR Code Generator](https://datalog.github.io/demo/rmqr-generator/) (Live Demo)

Enter your text, adjust the settings, and inspect the decoded segments or SVG contours.

---

*Use [rmqr.min.js](rmqr.min.js) for the full generator or [rmqr.light.min.js](rmqr.light.min.js) for a smaller bundle. The light build omits Kanji mode and encodes Japanese text in UTF-8. Both expose the same API.*

<br>

<p align="center"><a href="https://datalog.github.io/demo/rmqr-generator/"><img
    src="https://datalog.github.io/demo/rmqr-generator/find-joy-in-creating.svg"
        alt="Find joy in creating" width="640"></a></p>

## Quick start

Download [rmqr.min.js](rmqr.min.js), include it in your HTML page, and append the returned SVG element.

```html
<div id="rmqr"></div>
<script src="rmqr.min.js"></script>
<script>

    document.getElementById('rmqr')
        .appendChild( rMQR('Hello World!') );

</script>
```

`rMQR(text)` is shorthand for `rMQR({ msg: text })`. Each call returns a new SVG DOM element.

## Options

```javascript
var svgNode = rMQR({

     msg :  "Hello World!"
    ,dim :   300
    ,pad :   2
    ,ver :  "R11x77"
    ,ecl :  "H"
    ,ecb :   0
    ,pal : ["#000", "#f2f4f8"]
    ,vrb :   0

});

document.getElementById('rmqr')
    .appendChild( svgNode );
```

| Option | Default | Description |
| :--- | :--- | :--- |
| `msg` | `''` | Unicode text to encode. Byte segments use UTF-8, with ECI 26 for non-ASCII text. |
| `dim` | `256` | SVG width in pixels, including the quiet zone. The height follows the rectangular aspect ratio. |
| `pad` | `2` | Quiet zone on each side, measured in modules. Use an integer of at least 2. |
| `ver` | `'auto'` | Select the smallest fitting symbol by area, or specify a version such as `'R11x77'`. The name gives the height and width in modules. |
| `ecl` | `'M'` | Error correction level, either `'M'` or `'H'`. |
| `ecb` | `1` | Boosts error correction from M to H when the data fits the same version. Set to `0` to disable. |
| `pal` | `['#000']` | Foreground and optional background as `#RGB` or `#RRGGBB`. The background is transparent when omitted. |
| `vrb` | `0` | Set to `1` to describe each dark module separately in the SVG path. The encoded matrix stays the same. |

A fixed version throws a `RangeError` when the text exceeds its capacity. All rMQR versions use the same data mask.

## Versions and capacity

The generator supports all 32 rMQR versions. `R11x77`, for example, is 11 modules high and 77 modules wide. Each size has a separate data capacity for M and H.

<details>
<summary>Symbol sizes, capacities, and format tables</summary><br/>

Rows show height and columns show width, both in modules. Each cell lists the number of **data codewords at M / H**. The label `n/a` marks an unavailable size.

|  | 27 | 43 | 59 | 77 | 99 | 139 |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: |
| **7** | n/a | 6 / 3 | 12 / 7 | 20 / 10 | 28 / 14 | 44 / 24 |
| **9** | n/a | 12 / 7 | 21 / 11 | 31 / 17 | 42 / 22 | 63 / 33 |
| **11** | 7 / 5 | 19 / 11 | 31 / 15 | 43 / 23 | 57 / 29 | 84 / 42 |
| **13** | 12 / 7 | 27 / 13 | 38 / 20 | 53 / 29 | 73 / 35 | 106 / 54 |
| **15** | n/a | 33 / 15 | 48 / 26 | 67 / 31 | 88 / 48 | 127 / 69 |
| **17** | n/a | 39 / 21 | 56 / 28 | 78 / 38 | 100 / 56 | 152 / 76 |

Each codeword is eight bits. For example, `R11x77` has 43 data codewords at M, giving 344 bits for the encoded stream. The number of characters that fit depends on the modes used and the bits spent on segment headers and ECI.

### ISO/IEC 23941 tables used by the generator

| Number | What it provides |
| :--- | :--- |
| 1 | Symbol dimensions and total codewords. |
| 3 | Character-count field widths for each version and mode. |
| 6 | Data capacity at levels M and H. |
| 8 | Reed–Solomon block structure. |
| D.1 | Alignment pattern columns for each applicable width. |

</details>

## Kanji support

Kanji mode uses 13 bits per supported character, many of which would otherwise take 24 bits in UTF-8. The embedded table covers kanji, hiragana, katakana, and selected punctuation and symbols. Byte mode can encode text outside this set.

<details>
<summary>How the Kanji lookup works</summary><br/>

JavaScript strings use Unicode. Kanji mode uses 13-bit values derived from two-byte Shift JIS codes. The embedded lookup bridges those two representations without a runtime encoding dependency.

The embedded Base64 string is 13,984 bytes long and represents 8,192 positions, including gaps. On first use, the generator decodes it and caches the lookup. The compression format is documented in [kanji-base64](https://github.com/datalog/kanji-base64).

Seven characters with ambiguous Shift JIS mappings use Byte instead. For example, some readers decode the Shift JIS bytes for `〜` (U+301C) as `～` (U+FF5E). Use an rMQR-compatible reader that honors ECI 26 to preserve the distinction when decoding UTF-8.

</details>

## SVG contours

The default SVG uses **a single path that traces the outlines of the dark regions**. Shared edges disappear, straight runs become single SVG commands, and enclosed light areas stay open. The encoded matrix stays the same. Turn on **Explore SVG contours** in the demo to see the individual routes and the holes they enclose.

<details>
<summary>How contourPath builds the SVG</summary><br/>

For every dark module, `contourPath` checks its four neighbors. It keeps only sides that border a light module or the outside of the matrix. Each retained edge is directed with the dark area on its right. Two adjacent dark modules therefore share an interior edge that contributes nothing to the outline.

### From edges to closed routes

A stack follows the directed edges and joins branches at corners into closed routes. The outer boundary and any enclosed light areas wind in opposite directions, so the SVG fill leaves those holes open. The renderer keeps the turns and writes each straight run as a single relative `h` or `v` command.

### Comparing the output

Set `vrb: 1` to draw a small square for each dark module. Both settings produce the same pattern. For the options example above, the foreground path data is **1,833 characters** with contours and **7,089 characters** with individual squares. The reduction depends on how the dark modules are arranged.

</details>

<br><br><br>

## Credits and license

* The compressed lookup for Kanji mode comes from [kanji-base64](https://github.com/datalog/kanji-base64).
* The Rectangular Micro QR Code format is specified in [ISO/IEC 23941:2022](https://www.iso.org/standard/77404.html).
* Copyright © 2026 Constantine. Released under the [MIT License](LICENSE).
