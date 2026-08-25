/* ============================================================
   assets.js — optional GIF slots.

   HOW IT WORKS
   Every "GIF" on the site is really a slot. A slot renders a hand-drawn
   animated SVG sticker (local, instant, can never break) unless you give it
   real GIF sources — then it shows the first source that successfully loads
   and keeps the sticker as the fallback.

   ADDING YOUR OWN GIFS  (recommended — takes 30 seconds)
   1. Save the file, e.g.  public/gifs/party-cat.gif
   2. Add it to the slot below:   partyCat: [local('party-cat.gif')]
   That's it. Local files mean no tracking, no rate limits, and it all still
   works offline.

   Remote URLs work too (`'https://…/cat.gif'`), and you can list several as
   mirrors — they're tried in order. They're left empty by default so the site
   makes zero third-party requests and never logs a failed one.
   ============================================================ */

/** Resolve a file in public/gifs/ (respects the Vite base path). */
const local = (file) => `${import.meta.env.BASE_URL}gifs/${file}`

export const GIF_SLOTS = {
  partyCat: {
    sources: [], // e.g. [local('party-cat.gif'), 'https://example.com/party-cat.gif']
    alt: 'A very excited party cat',
  },
  cryingCat: {
    sources: [], // e.g. [local('crying-cat.gif')]
    alt: 'A cat crying about being wrong',
  },
  celebrationCat: {
    sources: [], // e.g. [local('celebration-cat.gif')]
    alt: 'A cat celebrating',
  },
  sadCat: {
    sources: [], // e.g. [local('sad-cat.gif')]
    alt: 'A dramatically sad cat',
  },
  birthdayCat: {
    sources: [], // e.g. [local('birthday-cat.gif')]
    alt: 'A birthday cat with cake',
  },
}

/** Give up on a source that hasn't finished loading in this long. */
export const GIF_TIMEOUT_MS = 6000
