# Marker Set

This project starts with the same marker family used in the Stemkoski AR.js examples:

- `kanji` marker (`preset="kanji"`)
- Barcode marker `0` (`type="barcode" value="0"`)
- Barcode marker `1` (`type="barcode" value="1"`)
- Barcode marker `2` (`type="barcode" value="2"`)

These are built into AR.js, so no custom `.patt` files are required for the first version.

If you later replace these with custom pattern markers, put your `.patt` files in this folder and update marker definitions in `index.html`.

## Print Marker Artwork

`print-markers/` contains SVG artwork embedded in each frame's `initial-print.svg`:

- `kanji.svg`
- `barcode-0.svg`
- `barcode-1.svg`
- `barcode-2.svg`
