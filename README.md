# Single QR Multi-Marker AR Exhibition

Static AR.js experience for 4 physical frames. Visitors scan one QR code, open one AR page, and point their device at any frame marker to see a frame-specific overlay.

## Project Structure

- `index.html`: single AR entry page (A-Frame + AR.js).
- `js/scene-config.js`: marker mapping, version label, marker found/lost logs.
- `styles.css`: instruction overlay styling.
- `VERSION`: single-line fallback label (e.g. `v0.1.0`) when the Pages build has no matching `v*` tag yet.
- `version.txt`: plain text the UI fetches to show the release label; the Actions workflow overwrites this in the published artifact from the latest `v*` tag when possible.
- `markers/`: marker documentation and future `.patt` files (if needed).
- `assets/frame-1/` ... `assets/frame-4/`: each frame keeps its own initial print + AR assets.

## Git and GitHub

**Get a copy of the project (first time only)**

1. Install [Git](https://git-scm.com/downloads) on your computer.
2. On GitHub, open this repository and click the green **Code** button.
3. Copy the **HTTPS** URL (looks like `https://github.com/<user>/<repo>.git`).
4. In a terminal, go to the folder where you keep projects, then run (paste your URL):

   ```bash
   git clone https://github.com/<user>/<repo>.git
   cd <repo>
   ```

**Save your edits and send them to GitHub**

1. Open a terminal in the project folder (`cd` into the repo if needed).
2. See what changed:

   ```bash
   git status
   ```

3. Stage the files you want to include (`.` means “everything that changed”):

   ```bash
   git add .
   ```

4. Commit with a short message describing the change:

   ```bash
   git commit -m "Describe your change in plain language"
   ```

5. Upload commits to GitHub:

   ```bash
   git push origin main
   ```

If GitHub says the branch is behind, pull others’ work first, then push again:

```bash
git pull origin main
git push origin main
```

If you prefer a graphical app, [GitHub Desktop](https://desktop.github.com/) can clone, commit, and push without using the terminal.

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

### HTTPS (phones, secure context)

Mobile browsers treat many device APIs as [secure contexts](https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts) only: **HTTPS** or `http://localhost` on the same device.

**iPhones and self-signed TLS:** Safari often still blocks or degrades access even after you tap through warnings, so **use GitHub Pages (real HTTPS)** for phone testing and for the exhibition QR URL—not a self-signed dev server.

For laptop-only testing with a self-signed cert, see `serve_https.py` and `./scripts/gen_dev_cert.sh` in the repo.

## GitHub Pages Deployment

GitHub serves the site over **HTTPS** with a normal certificate, which satisfies iOS and camera access.

### Option A — GitHub Actions (recommended)

This repo includes a workflow that publishes only the static site files (`index.html`, `styles.css`, `js/`, `assets/`, `markers/`, `.nojekyll`) and writes `version.txt` from the latest reachable **`v*`** git tag (falling back to the first line of `VERSION`).

1. Push the repo to GitHub (default branch `main`).
2. **Repository → Settings → Pages**
   - **Build and deployment → Source:** **GitHub Actions** (not “Deploy from a branch”).
3. Open **Actions**, confirm the **Deploy GitHub Pages** workflow run succeeded.
4. Your site URL (Settings → Pages, or the workflow summary):
   - `https://<your-username>.github.io/<your-repo>/`

The first run may need you to approve workflow permissions once if GitHub prompts you.

### Option B — Deploy from branch

1. Push this repo to GitHub.
2. **Settings → Pages → Source:** **Deploy from a branch**
   - Branch: `main`, folder **/** (root)
3. Wait for the deployment, then open:
   - `https://<your-username>.github.io/<your-repo>/`

The `.nojekyll` file at the repo root disables Jekyll so all static paths are served as-is.

## Releasing

1. Commit your changes and push `main`.
2. Create an annotated or lightweight tag, e.g. `git tag v0.2.0` then `git push origin v0.2.0` (and `git push origin main` if needed).
3. For **branch-based Pages**, also set the first line of `VERSION` and `version.txt` to match so the badge stays correct.
4. After the Pages deploy finishes, reload the site; the top-left **Version** label fetches `version.txt` with `cache: no-store` so you can confirm the new build.

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
