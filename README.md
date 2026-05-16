# Turnstile

A simple, reliable holder for your paper transit tickets.

Turnstile is a private, local-first **PWA** ticket wallet for reusable printed
transit tickets. It helps you scan or import QR-based paper transit tickets,
preserve the QR payload digitally, organize tickets by status/operator, and
open a clean ticket view later — fully offline after first load.

> Turnstile stores ticket information **locally** for personal organization.
> It does not validate, modify, extend, or authenticate transit tickets.
> Always follow your transit operator’s rules.

---

## ✨ What it does

- 📱 **Mobile-first PWA** — install to your home screen, works offline.
- 🎟️ **Wallet** with `Current` / `Expired` segments, search, sorting, pinning.
- 📷 **Scan** paper-ticket QR codes with your camera, upload a photo, or paste
  the payload manually.
- 🪪 **Ticket detail** view with a large regenerated QR for the gate.
- 🖥️ **Present mode** — high-contrast full-screen QR with key ticket metadata.
- 💾 **Local-first storage** — `localStorage` only, with a clean storage module
  so it can be migrated to IndexedDB later.
- ⤓ Export to **JSON** (full backup) or **Markdown** (human-readable).
- ⤒ Import a JSON backup (replace or merge).
- 🌱 Demo data on first launch and restorable from Settings.
- 🌗 System / Light / Dark appearance.

---

## 🔒 Local-first MVP

- No account.
- No backend.
- No cloud sync.
- No analytics, no remote fonts, no CDNs, no remote images, no remote scripts.
- All third-party dependencies (`jsQR`, `qrcode`, React, etc.) are installed
  through `npm` and bundled into the static build.

Your wallet lives in this browser, in `localStorage`. Clearing your browser
storage will clear your tickets.

---

## 🚀 Run locally

Requires Node.js 20+ and npm.

```bash
npm install
npm run dev
```

Then open the URL printed by Vite (default: <http://localhost:5173>).

### Build

```bash
npm run build
```

The static site is emitted to `dist/`.

### Preview production build

```bash
npm run preview
```

---

## ☁️ Deploy to GitHub Pages

This repo includes a workflow at
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) that builds the
site and publishes it via GitHub Pages on every push to `main`.

**One-time setup**

1. In your repository on GitHub, go to **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions**.
3. Push to `main`. The workflow will build and deploy automatically.

Your app will be served from:

```
https://<your-username>.github.io/turnstile/
```

### Vite base config

GitHub Pages serves repos from a subpath (`/<repo>/`). `vite.config.ts` is
configured for this:

```ts
base: mode === "production" ? "/turnstile/" : "/"
```

If you fork or rename the repo, update the path accordingly. No server
rewrites are required — the app uses internal state navigation, so all routes
resolve from `index.html`.

---

## 🔌 Offline / runtime behavior

- All JavaScript, CSS, fonts (system only), icons (local SVG) and the QR
  libraries are bundled with the app at build time.
- Once the static site has loaded, no further network requests are required to
  use Turnstile.
- Camera access (when scanning) is local to the browser. Uploaded ticket
  photos are decoded **in-page** and discarded after the QR payload is
  extracted — they never leave the device.

---

## 🗝️ Local storage keys

| Key                              | Purpose                                  |
| -------------------------------- | ---------------------------------------- |
| `turnstile:tickets`              | Your saved tickets                       |
| `turnstile:settings`             | App settings (sort, appearance)          |
| `turnstile:onboardingComplete`   | Whether onboarding has been seen         |
| `turnstile:demoDataSeeded`       | Whether demo tickets have been seeded    |

---

## 🌱 Reset / restore demo data

- **Restore demo data:** *Settings → Data → Restore demo data*. This replaces
  your wallet with the original Turnstile demo set.
- **Clear expired tickets:** *Settings → Wallet → Clear expired tickets*.
- **Clear all tickets:** *Settings → Wallet → Clear all tickets*.

To completely reset Turnstile (including onboarding), clear local storage for
the site in your browser dev tools.

---

## 🔁 Import / Export

- **Backup wallet (JSON)** — *Settings → Data → Backup wallet*. Produces a
  versioned JSON file containing every ticket. Save it somewhere safe.
- **Import wallet** — *Settings → Data → Import wallet*. Pick a previously
  exported JSON file. You’ll be asked whether to **replace** or **merge** into
  your existing wallet.
- **Export Markdown** — produces a human-readable `.md` document of every
  ticket, including operator, type, route/zone, status, dates, notes, payload
  and tags. Useful for reimbursements or travel records.

Imports are sanitized: only known icons, allowed colors and supported transit
modes are accepted; everything else falls back to safe defaults. Malformed
files won’t corrupt your wallet.

---

## 🙋 Responsible use

Turnstile is a **personal organizer**, not a ticket system.

- It does not validate or authenticate tickets.
- It does not extend ticket validity.
- It does not modify the QR payload — the text is preserved exactly as
  scanned.
- It does not interact with any transit operator system.
- Always follow your transit operator’s rules.

---

## 📦 Open-source acknowledgements

Turnstile is built with the following open-source packages. **All are bundled
locally with the app and are not loaded from a CDN at runtime.**

### Runtime dependencies

| Package                  | Version  | Purpose                                                    | License    | Project                                                        |
| ------------------------ | -------- | ---------------------------------------------------------- | ---------- | -------------------------------------------------------------- |
| `react`                  | `18.3.1` | UI framework                                               | MIT        | <https://github.com/facebook/react>                            |
| `react-dom`              | `18.3.1` | DOM renderer for React                                     | MIT        | <https://github.com/facebook/react>                            |
| `jsqr`                   | `1.4.0`  | Pure-JS QR decoding for camera frames & uploaded photos    | Apache-2.0 | <https://github.com/cozmo/jsQR>                                |
| `qrcode`                 | `1.5.4`  | Renders the regenerated QR onto a canvas for the wallet    | MIT        | <https://github.com/soldair/node-qrcode>                       |

### Development / build-time dependencies

| Package                  | Version    | Purpose                              | License    | Project                                                            |
| ------------------------ | ---------- | ------------------------------------ | ---------- | ------------------------------------------------------------------ |
| `typescript`             | `5.6.3`    | Typed JavaScript                     | Apache-2.0 | <https://github.com/microsoft/TypeScript>                          |
| `vite`                   | `5.4.10`   | Build tool and dev server            | MIT        | <https://github.com/vitejs/vite>                                   |
| `@vitejs/plugin-react`   | `4.3.3`    | Vite plugin for React (Fast Refresh) | MIT        | <https://github.com/vitejs/vite-plugin-react>                      |
| `@types/react`           | `18.3.12`  | React type definitions               | MIT        | <https://github.com/DefinitelyTyped/DefinitelyTyped>               |
| `@types/react-dom`       | `18.3.1`   | React DOM type definitions           | MIT        | <https://github.com/DefinitelyTyped/DefinitelyTyped>               |
| `@types/qrcode`          | `1.5.5`    | qrcode type definitions              | MIT        | <https://github.com/DefinitelyTyped/DefinitelyTyped>               |

Versions are pinned in [`package.json`](./package.json) and
[`package-lock.json`](./package-lock.json) so installs are reproducible.

Every icon shipped with Turnstile is a **local SVG React component**
([`src/components/icons`](./src/components/icons)). No icon font, sprite, or
remote SVG is referenced at runtime.

---

## 📁 Project structure

```
src/
  app/App.tsx              Top-level app + view router
  components/              UI components
  components/icons/        Local SVG React icons
  data/seedTickets.ts      Demo tickets
  hooks/useTickets.ts      Wallet state + persistence
  hooks/useLocalStorage.ts Generic localStorage hook
  storage/ticketsStorage.ts localStorage module (migratable to IndexedDB)
  types/ticket.ts          TransitTicket model, icons, colors, modes
  utils/exportTickets.ts   JSON + Markdown export/import
  utils/formatTicket.ts    Date formatting and sorting
  utils/qrPayload.ts       QR payload helpers
  utils/sanitize.ts        Safe coercion of imported / malformed data
  utils/searchTickets.ts   Case-insensitive multi-field search
  utils/ticketStatus.ts    Status (Active/Today/Expiring Soon/Expired/Archived)
  styles/globals.css       App design tokens + styles
  main.tsx                 App entrypoint
```

---

## 🛣️ Limitations & follow-ups

- Storage is `localStorage` only. The storage module abstracts read/write so
  a future migration to **IndexedDB** is straightforward.
- The QR scanner uses the browser camera API and `jsQR`; in low light, slow
  devices, or unusual codes, decoding can take a moment — fall back to
  uploading a photo or pasting the payload.
- The PWA manifest registers icons and theme; a service worker for full
  offline caching can be added later as a follow-up.
- Turnstile intentionally never claims operator acceptance and stores only
  the text payload of a QR code.

---

**MVP version.** Made for personal organization, not for use as a transit
ticket validator.
