# Single QR Multi-Marker AR Exhibition

Static AR.js experience for 4 physical frames. Visitors scan one QR code, open one AR page, and point their device at any frame marker to see a frame-specific overlay.

## Project Structure

- `index.html`: single AR entry page (A-Frame + AR.js).
- `js/scene-config.js`: marker mapping and marker found/lost logs.
- `styles.css`: instruction overlay styling.
- `markers/`: marker documentation and future `.patt` files (if needed).
- `assets/frame-1/` ... `assets/frame-4/`: each frame keeps its own initial print + AR assets.

## Marker Mapping (Initial)

The current setup uses AR.js built-in markers compatible with the Stemkoski starter examples:

- Frame 1 -> `preset="kanji"`
- Frame 2 -> `type="barcode" value="0"`
- Frame 3 -> `type="barcode" value="1"`
- Frame 4 -> `type="barcode" value="2"`

## Local Run

AR camera access requires serving over HTTP(S), not `file://`.

```bash
python3 -m http.server 8080
```

Then open:

- `http://localhost:8080`

## GitHub Pages Deployment

1. Push this repo to GitHub.
2. In repo settings, enable GitHub Pages:
   - Source: `Deploy from a branch`
   - Branch: `main` (root)
3. Wait for deployment, then copy your site URL:
   - `https://<your-username>.github.io/<your-repo>/`

## Single QR Code Setup

1. Generate one QR code pointing to the GitHub Pages URL.
2. Place that same QR code in the exhibition entry point or on each frame label.
3. Visitors scan once and stay on the same page while switching between all 4 markers.

## Replacing Placeholder Assets with Real 3D Content

Each `assets/frame-X/` folder is isolated for that frame's content.

Suggested convention:

- `initial-print.*` for the physical print source
- `scene.glb` (+ textures) for 3D overlay
- optional `audio.*` for ambient sound

After adding your files, update the corresponding marker block in `index.html` to load the real model (for example with `<a-gltf-model>`).
