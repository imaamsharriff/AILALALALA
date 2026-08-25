# 🎀 Aila's Birthday Website

A frontend-only, single-page interactive birthday surprise. Pink, bows, cats,
sparkles, and a scientifically rigorous proof that Aila is prettier than the
moon.

No backend. No database. No API keys. No paid services.

---

## Run it

```bash
npm install
npm run dev      # then open http://localhost:5173
```

> ⚠️ **Don't double-click `index.html`.** Browsers block ES modules loaded over
> `file://`, so you'll get a blank white page. Open the `http://localhost:5173`
> URL instead — or build the single-file version below.

### One file you can just double-click

```bash
npm run build:single    # → dist/aila-birthday.html
```

This folds all the CSS and JavaScript into one self-contained HTML file
(~215 kB). Double-click it, put it on a USB stick, or email it — it works from
the desktop with no server, no install, and no internet.

### Hosting it

```bash
npm run build    # → dist/
npm run preview  # preview the production build at http://localhost:4173
```

`vite.config.js` sets `base: './'`, so `dist/` works from any subdirectory of
Netlify, Vercel, GitHub Pages, or any static host.

---

## The experience

| # | Section              | What happens                                                                 |
| - | -------------------- | ---------------------------------------------------------------------------- |
| 1 | **Birthday intro**   | Confetti rain, cake, floating charms, a glowing `START THE SURPRISE` button.  |
| 2 | **Who is prettier?** | Pick MOON → `❌ WRONG.`, screen shake, stamp, crying cat. Try to pick AILA → she runs away. After **20 seconds of chasing**: `LOSER 😭 / IT'S AILA 🎀`. |
| 3 | **How pretty?**      | A 1–10 slider. Hit 10 and the scale panics: 10 → 100 → 1,000 → 10,000, then `10,000/10 🎀` and `aw man thats too bad 😔`. |
| 4 | **Conclusion**       | `∞ / 10`, giant bow, endless confetti, and a `REPLAY THE CHAOS` button that restarts everything in-page. |

The 20-second timer starts on the **first escape**, not on page load, and needs
at least a few genuine attempts before it fires — a stray mouse flick won't
trigger the punchline.

---

## Structure

```
src/
├── App.jsx                  section state machine + cross-fade transitions
├── main.jsx
├── components/
│   ├── BackgroundDecorations.jsx   floating charms, blobs, ribbons
│   ├── CursorTrail.jsx             sparkles following the cursor (desktop only)
│   ├── Confetti.jsx                one canvas, all bursts
│   ├── SoundController.jsx         persistent mute / unmute
│   ├── CuteGif.jsx                 GIF slot with sticker fallback
│   ├── Stickers.jsx                hand-drawn animated SVG characters
│   ├── BirthdayIntro.jsx           section 1
│   ├── PrettyGame.jsx              section 2  ├── MoonOption.jsx
│   │                                          └── AilaOption.jsx
│   ├── RatingGame.jsx              section 3
│   └── FinalMessage.jsx            section 4
├── hooks/
│   ├── useReducedMotion.js
│   └── useMediaQuery.js            includes useIsTouch()
├── lib/
│   ├── runaway.js                  pure geometry for the escaping button
│   ├── rating.js                   the escalating-scale joke, as data
│   ├── confetti.js                 imperative bridge + presets
│   ├── sfx.js                      synthesised sound effects
│   └── assets.js                   GIF slot configuration
└── styles/global.css               design tokens, shared UI, animations
```

Game logic lives in `lib/` as plain functions, separate from the components
that draw it.

---

## Sound

All sound effects are **synthesised with the Web Audio API** — there are no
audio files to download, so nothing can 404 and it works offline.

- Nothing is created until you press `START THE SURPRISE`, so autoplay is never
  blocked or unexpected.
- The 🔊 button (top right) mutes/unmutes at any time.
- If `AudioContext` is unavailable or blocked, every call is a silent no-op and
  the site behaves identically.

Effects: button pop, cheerful sparkle, comedic buzzer, escape whoosh (rising in
pitch as the chase gets harder), reveal fanfare, escalating slider stings, a
defeated trombone, and a party popper.

---

## GIFs and images

Every character is a **hand-drawn animated SVG** (`src/components/Stickers.jsx`)
— local, tiny, crisp on any screen, and impossible to break.

To use real GIFs instead, drop files into `public/gifs/` and list them in
`src/lib/assets.js`. See `public/gifs/README.md`. Slots accept multiple sources
(local files and remote mirrors) and fall back to the sticker if a source
fails, 404s, is blocked, or stalls.

---

## Accessibility & responsiveness

- Semantic HTML, real `<button>`s, and a visible focus ring everywhere.
- The escaping button responds to hover, tap **and** keyboard focus, so the
  joke isn't hover-only — and the punchline is announced via `aria-live`.
- Full `prefers-reduced-motion` support: animations, the cursor trail, screen
  shake and confetti volume all scale down, and every section stays usable.
- Works from 320px up. Cards stack on phones, decoration density drops on
  smaller screens, tap targets stay large, and nothing ever causes horizontal
  scrolling.
- The escaping button is always kept inside its arena and never overlaps the
  moon card — no hardcoded viewport coordinates anywhere.

---

## Performance notes

- One `<canvas>` for all confetti, with a RAF loop that stops itself when the
  particle list empties and a hard particle cap.
- The cursor trail recycles a fixed pool of DOM nodes and never re-renders React.
- All movement uses CSS transforms; decorative layers are `pointer-events: none`.
- Background charms animate purely in CSS — zero per-frame JavaScript.
