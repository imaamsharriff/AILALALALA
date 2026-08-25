/* ============================================================
   Stickers.jsx — hand-drawn inline SVG "GIF-style" characters.

   These are local vector stickers animated with CSS instead of real GIFs:
   nothing to download, nothing that can 404, crisp on every screen, and
   they still read as cute internet stickers. <CuteGif /> layers optional
   external GIFs on top of these as a progressive enhancement.
   ============================================================ */

import './Stickers.css'

const OUTLINE = '#55223c'

function Sticker({ className = '', size = 140, label, children, style }) {
  return (
    <svg
      className={`sticker ${className}`}
      viewBox="0 0 200 200"
      width={size}
      height={size}
      style={style}
      role={label ? 'img' : 'presentation'}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : 'true'}
      focusable="false"
    >
      {children}
    </svg>
  )
}

/* ---------- shared face pieces ---------- */

function CatHead({ fill = '#ffffff', earFill = '#ffd0e4' }) {
  return (
    <g>
      <path
        d="M42 74 L34 20 L86 50 Z"
        fill={fill}
        stroke={OUTLINE}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path
        d="M158 74 L166 20 L114 50 Z"
        fill={fill}
        stroke={OUTLINE}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path d="M46 66 L42 36 L68 52 Z" fill={earFill} />
      <path d="M154 66 L158 36 L132 52 Z" fill={earFill} />
      <ellipse
        cx="100"
        cy="110"
        rx="74"
        ry="60"
        fill={fill}
        stroke={OUTLINE}
        strokeWidth="5"
      />
    </g>
  )
}

function Whiskers() {
  return (
    <g stroke={OUTLINE} strokeWidth="3.5" strokeLinecap="round" opacity="0.75">
      <line x1="26" y1="100" x2="60" y2="104" />
      <line x1="24" y1="114" x2="58" y2="114" />
      <line x1="26" y1="128" x2="60" y2="124" />
      <line x1="174" y1="100" x2="140" y2="104" />
      <line x1="176" y1="114" x2="142" y2="114" />
      <line x1="174" y1="128" x2="140" y2="124" />
    </g>
  )
}

function Blush() {
  return (
    <g fill="#ff8ec0" opacity="0.55">
      <ellipse cx="58" cy="126" rx="14" ry="9" />
      <ellipse cx="142" cy="126" rx="14" ry="9" />
    </g>
  )
}

function BowShape({ x = 0, y = 0, scale = 1, color = '#ff5fa2', dark = '#c9185f' }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path
        d="M0 0 C-26 -22 -54 -16 -50 2 C-54 20 -26 24 0 0 Z"
        fill={color}
        stroke={dark}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d="M0 0 C26 -22 54 -16 50 2 C54 20 26 24 0 0 Z"
        fill={color}
        stroke={dark}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <ellipse cx="0" cy="1" rx="11" ry="12" fill={color} stroke={dark} strokeWidth="4" />
      <ellipse cx="-4" cy="-3" rx="4" ry="3" fill="#ffffff" opacity="0.85" />
    </g>
  )
}

/* ---------- exported stickers ---------- */

/** Hello-Kitty-*inspired* fan sticker (not affiliated, just cute). */
export function KittyFace({ size = 150, className = '', label = 'A cute white kitty wearing a bow' }) {
  return (
    <Sticker size={size} className={`sticker--kitty ${className}`} label={label}>
      <CatHead />
      <ellipse cx="72" cy="106" rx="8" ry="11" fill={OUTLINE} />
      <ellipse cx="128" cy="106" rx="8" ry="11" fill={OUTLINE} />
      <ellipse cx="69" cy="102" rx="3" ry="3.5" fill="#ffffff" />
      <ellipse cx="125" cy="102" rx="3" ry="3.5" fill="#ffffff" />
      <ellipse cx="100" cy="124" rx="10" ry="7.5" fill="#ffc94d" stroke={OUTLINE} strokeWidth="3" />
      <Whiskers />
      <Blush />
      <g className="sticker__bow">
        <BowShape x={148} y={54} scale={0.85} />
      </g>
    </Sticker>
  )
}

/** Happy dancing cat — arms wave, body bounces. */
export function DancingCat({ size = 150, className = '', label = 'A cat dancing with joy' }) {
  return (
    <Sticker size={size} className={`sticker--dance ${className}`} label={label}>
      <g className="sticker__arm sticker__arm--l">
        <path
          d="M40 118 L10 78"
          stroke={OUTLINE}
          strokeWidth="11"
          strokeLinecap="round"
          fill="none"
        />
        <path d="M40 118 L10 78" stroke="#ffe6f1" strokeWidth="5" strokeLinecap="round" />
      </g>
      <g className="sticker__arm sticker__arm--r">
        <path
          d="M160 118 L190 78"
          stroke={OUTLINE}
          strokeWidth="11"
          strokeLinecap="round"
          fill="none"
        />
        <path d="M160 118 L190 78" stroke="#ffe6f1" strokeWidth="5" strokeLinecap="round" />
      </g>
      <g className="sticker__body">
        <CatHead fill="#fff6fa" earFill="#ffb3d3" />
        <path
          d="M62 104 q10 -12 22 0"
          stroke={OUTLINE}
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M116 104 q10 -12 22 0"
          stroke={OUTLINE}
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M84 126 q16 20 32 0"
          stroke={OUTLINE}
          strokeWidth="5"
          fill="#ff8ec0"
          strokeLinecap="round"
        />
        <Blush />
        <BowShape x={100} y={44} scale={0.6} color="#ffd0e4" dark="#ef2f80" />
      </g>
      <g className="sticker__notes" fill="#a98cff" fontSize="26">
        <text x="4" y="46">♪</text>
        <text x="172" y="52">♫</text>
      </g>
    </Sticker>
  )
}

/** Sobbing cat for the "WRONG" moment. */
export function CryingCat({ size = 150, className = '', label = 'A cat crying dramatically' }) {
  return (
    <Sticker size={size} className={`sticker--cry ${className}`} label={label}>
      <g className="sticker__body">
        <CatHead fill="#fffaf4" earFill="#ded0ff" />
        <path
          d="M60 112 q12 -16 26 0"
          stroke={OUTLINE}
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M114 112 q12 -16 26 0"
          stroke={OUTLINE}
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M84 142 q16 -18 32 0"
          stroke={OUTLINE}
          strokeWidth="5"
          fill="#c9185f"
          strokeLinecap="round"
        />
        <Whiskers />
        <Blush />
      </g>
      <g fill="#6fb6ea" stroke="#3d86bb" strokeWidth="2.5">
        <path className="sticker__tear sticker__tear--1" d="M70 122 q-9 14 0 18 q9 -4 0 -18 Z" />
        <path className="sticker__tear sticker__tear--2" d="M130 122 q-9 14 0 18 q9 -4 0 -18 Z" />
      </g>
    </Sticker>
  )
}

/** Defeated cat for the rating-game punchline. */
export function SadCat({ size = 150, className = '', label = 'A sad little cat' }) {
  return (
    <Sticker size={size} className={`sticker--sad ${className}`} label={label}>
      <g className="sticker__body">
        <CatHead fill="#fff4f9" earFill="#ffd0e4" />
        <path
          d="M60 102 q13 12 26 2"
          stroke={OUTLINE}
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M114 104 q13 -10 26 -2"
          stroke={OUTLINE}
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
        />
        <ellipse cx="73" cy="116" rx="6" ry="7.5" fill={OUTLINE} />
        <ellipse cx="127" cy="116" rx="6" ry="7.5" fill={OUTLINE} />
        <path
          d="M86 144 q14 -14 28 0"
          stroke={OUTLINE}
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
        />
        <Whiskers />
      </g>
      <path
        className="sticker__tear sticker__tear--1"
        d="M73 128 q-8 13 0 17 q8 -4 0 -17 Z"
        fill="#6fb6ea"
        stroke="#3d86bb"
        strokeWidth="2.5"
      />
    </Sticker>
  )
}

/** Birthday cake with flickering candles. */
export function BirthdayCake({ size = 170, className = '', label = 'A pink birthday cake with candles' }) {
  return (
    <Sticker size={size} className={`sticker--cake ${className}`} label={label}>
      <g className="sticker__flames">
        {[68, 100, 132].map((x, i) => (
          <g key={x} className={`sticker__flame sticker__flame--${i + 1}`}>
            <ellipse cx={x} cy="34" rx="9" ry="15" fill="#ffb347" />
            <ellipse cx={x} cy="38" rx="4.5" ry="8" fill="#fff0c2" />
          </g>
        ))}
      </g>
      <g stroke={OUTLINE} strokeWidth="3">
        <rect x="63" y="50" width="10" height="30" rx="4" fill="#ffd0e4" />
        <rect x="95" y="50" width="10" height="30" rx="4" fill="#cdeaff" />
        <rect x="127" y="50" width="10" height="30" rx="4" fill="#c9f4e2" />
      </g>
      {/* frosting + tiers */}
      <path
        d="M40 92 q12 14 24 0 q12 14 24 0 q12 14 24 0 q12 14 24 0 q12 14 24 0 v18 H40 Z"
        fill="#fff6fa"
        stroke={OUTLINE}
        strokeWidth="4.5"
        strokeLinejoin="round"
      />
      <rect x="40" y="108" width="120" height="30" rx="8" fill="#ff8ec0" stroke={OUTLINE} strokeWidth="4.5" />
      <rect x="28" y="136" width="144" height="34" rx="10" fill="#ff5fa2" stroke={OUTLINE} strokeWidth="4.5" />
      <g fill="#fff0c2">
        <circle cx="62" cy="122" r="4" />
        <circle cx="92" cy="127" r="3.4" />
        <circle cx="122" cy="120" r="4" />
        <circle cx="146" cy="128" r="3.4" />
        <circle cx="52" cy="152" r="4" />
        <circle cx="86" cy="157" r="3.6" />
        <circle cx="120" cy="150" r="4" />
        <circle cx="152" cy="157" r="3.6" />
      </g>
    </Sticker>
  )
}

/** Oversized ribbon bow for the finale. */
export function GiantBow({ size = 220, className = '', label = 'A giant pink ribbon bow' }) {
  return (
    <Sticker size={size} className={`sticker--bow ${className}`} label={label}>
      <defs>
        <linearGradient id="bowGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffb3d3" />
          <stop offset="55%" stopColor="#ff5fa2" />
          <stop offset="100%" stopColor="#ef2f80" />
        </linearGradient>
      </defs>
      <path
        d="M100 96 C74 152 42 178 30 166 C18 154 34 122 62 108 Z"
        fill="url(#bowGrad)"
        stroke="#c9185f"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path
        d="M100 96 C126 152 158 178 170 166 C182 154 166 122 138 108 Z"
        fill="url(#bowGrad)"
        stroke="#c9185f"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <g className="sticker__bow-loops">
        <path
          d="M100 92 C58 44 14 56 22 92 C12 128 60 136 100 92 Z"
          fill="url(#bowGrad)"
          stroke="#c9185f"
          strokeWidth="5"
          strokeLinejoin="round"
        />
        <path
          d="M100 92 C142 44 186 56 178 92 C188 128 140 136 100 92 Z"
          fill="url(#bowGrad)"
          stroke="#c9185f"
          strokeWidth="5"
          strokeLinejoin="round"
        />
        <ellipse cx="100" cy="93" rx="19" ry="21" fill="#ff5fa2" stroke="#c9185f" strokeWidth="5" />
        <ellipse cx="93" cy="86" rx="6" ry="4.5" fill="#ffffff" opacity="0.85" />
      </g>
    </Sticker>
  )
}

/** Four-point sparkle used as a decorative accent. */
export function SparkleMark({ size = 40, className = '', color = '#ffd166' }) {
  return (
    <Sticker size={size} className={`sticker--spark ${className}`}>
      <path
        d="M100 8 C112 68 132 88 192 100 C132 112 112 132 100 192 C88 132 68 112 8 100 C68 88 88 68 100 8 Z"
        fill={color}
      />
    </Sticker>
  )
}
