/* ============================================================
   inline-build.mjs — bundle dist/ into ONE double-clickable file.

   Browsers block ES modules loaded over file://, so dist/index.html shows a
   blank page if you just double-click it. Inline <script type="module"> is
   allowed though, so folding the JS and CSS into the HTML produces a single
   self-contained file that works from the desktop, a USB stick, or an email
   attachment — no server, no install, no internet.

   Run:  npm run build:single   →  dist/aila-birthday.html
   ============================================================ */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const OUT = join(dist, 'aila-birthday.html')

if (!statSync(dist, { throwIfNoEntry: false })) {
  console.error('✖ dist/ not found — run `npm run build` first.')
  process.exit(1)
}

let html = readFileSync(join(dist, 'index.html'), 'utf8')
const assets = readdirSync(join(dist, 'assets'))

/** A literal </script> inside the bundle would end the inline tag early. */
const safe = (code) => code.replace(/<\/script/gi, '<\\/script')

/**
 * Always replace via a *function*. A plain string replacement would treat
 * `$&`, `$'` and `` $` `` in the bundle as substitution patterns and splice
 * chunks of the document into itself — minified JS is full of `$`.
 */
const inline = (source, pattern, replacement) => source.replace(pattern, () => replacement)

// --- fold the stylesheet in ---
const cssFile = assets.find((f) => f.endsWith('.css'))
if (cssFile) {
  const css = readFileSync(join(dist, 'assets', cssFile), 'utf8')
  html = inline(
    html,
    new RegExp(`\\s*<link[^>]*href="[^"]*${cssFile}"[^>]*>`),
    `\n    <style>\n${css}\n    </style>`,
  )
}

// --- fold the script in ---
const jsFile = assets.find((f) => f.endsWith('.js'))
if (jsFile) {
  const js = readFileSync(join(dist, 'assets', jsFile), 'utf8')
  html = inline(
    html,
    new RegExp(`\\s*<script[^>]*src="[^"]*${jsFile}"[^>]*></script>`),
    `\n    <script type="module">\n${safe(js)}\n    </script>`,
  )
}

if (html.includes('src="./assets/') || html.includes('href="./assets/')) {
  console.error('✖ some assets were not inlined — check the dist/ output.')
  process.exit(1)
}

writeFileSync(OUT, html)

const kb = (Buffer.byteLength(html) / 1024).toFixed(0)
console.log(`✓ ${OUT.replace(`${root}/`, '')}  (${kb} kB, self-contained)`)
console.log('  Double-click it, or send the single file to anyone. 🎀')
