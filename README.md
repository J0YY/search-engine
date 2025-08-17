## Joy Search (2021 → 2025 refresh) — chaotic front‑end playground

This is a glow‑up of a 2021 side project into a modern, highly‑stylized start page and search UI. It’s primarily front‑end practice and playful experimentation with animations, micro‑interactions, and “chaos” modes. The original repo is in the commit history.

---

<img width="1470" height="753" alt="Screenshot 2025-08-16 at 7 23 15 PM" src="https://github.com/user-attachments/assets/b849729e-ee84-446b-9c6b-5049a862a808" />

---

### What this is
- A beautiful, glassy start page with animated gradients and a customizable search experience
- Lots of optional, opt‑in “chaotic” effects (cute, surprising, but still usable)
- A lightweight Google Custom Search client (no server) with a results page

### Tech stack
- React 17 (Create React App)
- Material‑UI v4
- React Router v5
- Optional: Firebase Hosting config (client SDK removed)

---

## Getting started

### Prerequisites
- Node.js 16 (CRA v4 compatible). If you use nvm:
```bash
nvm use 16
```
- A Google Custom Search Engine (CSE) and API key

### Install and run
```bash
npm ci
npm start
```
App runs at http://localhost:3000

### Configure search API
Create `.env.local` with:
```bash
# Google Custom Search
REACT_APP_GOOGLE_API_KEY=your_google_api_key
REACT_APP_GOOGLE_CSE_CX=your_cx_id
```
`src/useGoogleSearch.js` reads from `process.env`. Rotate any demo keys before publishing.
Then, update `src/useGoogleSearch.js` to read from `process.env` instead of hard‑coded keys. Example usage:
```js
const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
const cx = process.env.REACT_APP_GOOGLE_CSE_CX;
```

Note: The current code contains demo keys checked into source. For production, rotate the keys and use environment variables instead.

### 3) Run locally
```bash
npm start
```
- App runs on `http://localhost:3000`

### Scripts
- `npm start`: start dev server
- `npm test`: run tests (CRA default)
- `npm run build`: production build to `build/`
- `npm run eject`: eject CRA config

---

## What everything does
- Global state: `StateProvider` + `reducer` store the current `term`
- Search: `useGoogleSearch(term)` calls Google CSE and returns `items` and `searchInformation`
- Results page: `pages/SearchPage.js` renders counts and links
- Start page: greeting, live clock, quick links, settings, and playable search bar
- Playground modes (Settings → toggles):
  - Chaos mode: cute runners + floating stickers; Party button boosts intensity
  - Magnetic search: bar avoids cursor until you click/hold it
  - Gravity slider: drop/bounce intensity for the search bar
  - Weight anchor: Left/Center/Right/Caret — subtle tilt follows weight
  - Jiggle feedback: tiny shake on Enter/backspace (optional sounds)
  - Sticker bombs: emoji bursts on keywords: love, cat, star, wow, party…
  - Reactive gradient: hue shifts with query sentiment
  - Warp speed: starfield overlay on search
  - Pet buddy: a tiny friend that follows the cursor and naps on the bar
  - Cursor trail, Parallax blobs, Rain mode (idle letters) for extra vibes


---

## Deploy (optional: Firebase Hosting)
`firebase.json` is preconfigured to serve the CRA build and rewrite all routes to `index.html`.

1. Install the Firebase CLI and log in
```bash
npm install -g firebase-tools
firebase login
```
2. Build
```bash
npm run build
```
3. Deploy
```bash
firebase deploy
```

Tip: If you have multiple Firebase projects, set an alias first:
```bash
firebase use --add
```

---

## Use as your browser start page
Two options:

- Chrome/Edge: install the extension “New Tab Redirect” and set the URL to your deployed site
- Set your homepage to your deployed URL (browser settings) and choose “Open a specific page” on startup

Optional: you can also create a lightweight Chrome extension to override the new tab page. Create an `extension/` folder with a `manifest.json` using `chrome_url_overrides.newtab` pointing to a packaged `newtab.html` that loads your built app, then load it via `chrome://extensions` → “Load unpacked”.

---

## Project structure
```text
search-engine/
  public/               # CRA static assets
  src/
    components/         # Search, Clock, Chaos, Pet, etc.
    pages/              # Home + Search results pages
    useGoogleSearch.js  # Google CSE hook
    StateProvider.js    # Global state provider
    reducer.js          # Reducer with SET_SEARCH_TERM
  firebase.json         # Hosting configuration
  package.json          # Scripts + dependencies
```

---

## Configuration notes and limitations
- Rotate and move any committed API keys to environment variables before public deployment
- Some header options (e.g., Images/Maps/News) are decorative in this build
- Pagination and image search are not implemented

---

## Troubleshooting
- PostCSS export error: use Node 16 (CRA v4). With nvm: `nvm use 16`
- 403 from Google API: verify API is enabled, `key`/`cx` values, and referrer rules

---

## Credits
- Built with Create React App, Material‑UI, and Google Custom Search
- Original 2021 project refreshed in 2025 for UI fun and practice

