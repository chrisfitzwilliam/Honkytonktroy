# Honky Tonk Troy — v4 Site Documentation

## Overview

Custom-built static website for Honky Tonk Troy, a country western bar at 180 North Main Street, Troy, Missouri. No framework, no build step — pure HTML, CSS, and vanilla JS.

**Sister site:** Main Street HonkyTonk, St. Charles (mainstreethonkytonk.com)

---

## Stack

| Layer | Tech |
|-------|------|
| Markup | Single-page HTML (`index.html`) |
| Styles | One stylesheet (`assets/css/site.css`) |
| Scripts | Three vanilla JS files, loaded `defer` |
| Fonts | Google Fonts (loaded via `<link>`) |
| Ordering | Toast Tab (external link) |
| No build step | Drop the folder on a host and it works |

---

## File Structure

```
honky-tonk-troy/          ← deployable root (everything inside goes to web host)
├── index.html
├── assets/
│   ├── css/
│   │   └── site.css      ← all styles, single file
│   ├── js/
│   │   ├── nav.js        ← header scroll shadow, scroll-spy, menu tabs
│   │   ├── slideshow.js  ← leather patch photo grid with crossfade cycling
│   │   └── landing-video.js  ← splash screen intro (Enter button, wheel/key entry)
│   └── video/
│       ├── honky-tonk-troy-landing.mp4       ← full-screen intro video
│       ├── honky-tonk-troy-landing-poster.jpg← video fallback poster frame
│       ├── logo-animated.webm                ← animated logo (splash overlay)
│       └── logo-animated.mp4
└── images/
    ├── gen/              ← AI-generated / processed assets (logos, textures, nav buttons)
    └── *.jpg / *.png     ← photography used across sections
```

---

## Page Sections (by anchor)

| ID | Section |
|----|---------|
| `#top` | Sticky site header |
| *(no id)* | Video splash / landing screen |
| `#content-start` | Hero — first content after splash |
| `#about` | About the bar |
| `#week` | Weekly events schedule |
| `#private` | Private events / downstairs room |
| `#menu` | Kitchen menu with tabbed panels |
| `#gallery` | Photo gallery grid |
| `#visit` | Hours, address, contact |

---

## JavaScript Files

### `nav.js`
- Adds `.is-scrolled` shadow to sticky header once `scrollY > 20`
- Scroll-spy: uses `IntersectionObserver` to highlight the active section in the header nav and mobile bottom tabs
- Menu tab switcher: toggles `.is-active` on `.menu-tab` and `.menu-panel` elements

### `slideshow.js`
- Powers the leather patch photo grid in the Gallery section
- Each patch slot cycles its own deck of photos with a CSS crossfade at a staggered interval
- Respects `prefers-reduced-motion`

### `landing-video.js`
- Controls the splash screen intro
- Entry triggers: Enter button click, scroll wheel down, or keyboard (Enter / Space / ArrowDown / PageDown)
- On entry: removes `splash-active` from `<body>`, adds `splash-entered`, scrolls to top, focuses `#content-start`
- `splash-active` on `<body>` hides the header/tabs and sets `overflow: hidden` — removing it restores normal scrolling

---

## Deployment

The site is fully static. Deploy by uploading the contents of `honky-tonk-troy/` to the web host root.

### Cache Busting

The stylesheet is versioned via a query string:

```html
<link rel="stylesheet" href="assets/css/site.css?v=20260528-nocard">
```

When updating `site.css`, bump the `?v=` value to a new date/label so browsers re-fetch it:

```html
href="assets/css/site.css?v=YYYYMMDD-label"
```

The label suffix (e.g. `-nocard`, `-fix`) is optional but useful for tracking what changed.

### Distribution ZIP

`honky-tonk-troy-website-v4.zip` in this directory is a snapshot of the deployable site folder. Re-zip after changes if the host requires file upload by ZIP.

---

## Changelog

### 2026-05-27
- **Fix: Scrolling locked after clicking nav/anchor links and pressing Back**
  - Root cause: `landing-video.js` was calling `history.pushState({ splash: 'entered' }, '')` on site entry, then listening to `popstate` to restore the splash screen. Any anchor link click (`#menu`, `#week`, `#top`, feature blocks, etc.) pushes a new history entry; pressing Back from there fired `popstate`, which re-added `splash-active` to `<body>`, which set `overflow: hidden` via CSS and locked all scrolling.
  - Fix: Removed `history.pushState` call, removed `popstate` listener, and removed the now-unused `returnToSplash` function from `landing-video.js`. The Back button now navigates browser history normally.
  - File changed: `honky-tonk-troy/assets/js/landing-video.js`

- Added this `SITE.md` documentation file.

---

## Key Content to Update Manually

- **Weekly events** — hardcoded in `index.html` (search `class="week"`). Days, events, and prices are plain HTML.
- **Menu items & prices** — inside `#menu` in `index.html`, organized by `.menu-panel` tab sections.
- **Hours** — inside `#visit` in `index.html`, inside `.hours-list`.
- **Photos** — swap files in `images/`; filenames referenced directly in HTML and `slideshow.js`.
