/* ============================================================
   sfx.js — tiny synthesised sound-effect engine (Web Audio API)

   Why synthesised instead of .mp3 files?
   - zero network requests, so nothing can 404 or fail to load
   - works offline and weighs nothing
   - "if audio fails, the site must still work perfectly" is free:
     every call is wrapped so a missing/blocked AudioContext is a no-op.

   Audio is NEVER created until unlock() is called from a real user
   gesture (the START button), which is also what browsers require.
   ============================================================ */

class SoundEngine {
  constructor() {
    this.ctx = null
    this.master = null
    this.muted = false
    this.unlocked = false
  }

  /** Create/resume the AudioContext. Must be called from a user gesture. */
  unlock() {
    try {
      if (!this.ctx) {
        const Ctx = window.AudioContext || window.webkitAudioContext
        if (!Ctx) return false
        this.ctx = new Ctx()
        this.master = this.ctx.createGain()
        this.master.gain.value = this.muted ? 0 : 0.5
        this.master.connect(this.ctx.destination)
      }
      if (this.ctx.state === 'suspended') this.ctx.resume()
      this.unlocked = true
      return true
    } catch {
      return false
    }
  }

  setMuted(muted) {
    this.muted = muted
    if (!this.master || !this.ctx) return
    const now = this.ctx.currentTime
    this.master.gain.cancelScheduledValues(now)
    this.master.gain.setTargetAtTime(muted ? 0 : 0.5, now, 0.02)
  }

  get ready() {
    return Boolean(this.ctx && this.unlocked && !this.muted)
  }

  /** One enveloped oscillator note. */
  _note({
    freq = 440,
    type = 'sine',
    start = 0,
    duration = 0.18,
    gain = 0.25,
    slideTo = null,
    detune = 0,
  }) {
    const ctx = this.ctx
    const t0 = ctx.currentTime + start
    const osc = ctx.createOscillator()
    const env = ctx.createGain()

    osc.type = type
    osc.detune.value = detune
    osc.frequency.setValueAtTime(freq, t0)
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(slideTo, 1), t0 + duration)

    // short attack, smooth decay — keeps everything "cute" not "harsh"
    env.gain.setValueAtTime(0.0001, t0)
    env.gain.exponentialRampToValueAtTime(gain, t0 + 0.012)
    env.gain.exponentialRampToValueAtTime(0.0001, t0 + duration)

    osc.connect(env)
    env.connect(this.master)
    osc.start(t0)
    osc.stop(t0 + duration + 0.05)
  }

  /** Filtered white noise — used for whooshes, sparkle dust, party poppers. */
  _noise({ start = 0, duration = 0.3, gain = 0.2, from = 400, to = 6000, q = 1 }) {
    const ctx = this.ctx
    const t0 = ctx.currentTime + start
    const frames = Math.max(1, Math.floor(ctx.sampleRate * duration))
    const buffer = ctx.createBuffer(1, frames, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < frames; i += 1) data[i] = Math.random() * 2 - 1

    const src = ctx.createBufferSource()
    src.buffer = buffer

    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.Q.value = q
    filter.frequency.setValueAtTime(from, t0)
    filter.frequency.exponentialRampToValueAtTime(Math.max(to, 1), t0 + duration)

    const env = ctx.createGain()
    env.gain.setValueAtTime(0.0001, t0)
    env.gain.exponentialRampToValueAtTime(gain, t0 + 0.02)
    env.gain.exponentialRampToValueAtTime(0.0001, t0 + duration)

    src.connect(filter)
    filter.connect(env)
    env.connect(this.master)
    src.start(t0)
    src.stop(t0 + duration + 0.05)
  }

  /** Safely run a sound recipe. */
  _play(recipe) {
    if (!this.ready) return
    try {
      recipe()
    } catch {
      /* audio problems must never break the party */
    }
  }

  // ---------------------------------------------------------- effects

  /** Tiny UI pop — button clicks. */
  pop() {
    this._play(() => {
      this._note({ freq: 620, slideTo: 1180, type: 'sine', duration: 0.12, gain: 0.3 })
      this._note({ freq: 1240, type: 'triangle', start: 0.02, duration: 0.09, gain: 0.12 })
    })
  }

  /** Cheerful ascending sparkle — the "Aila" / good-thing sound. */
  sparkle() {
    this._play(() => {
      const notes = [784, 988, 1175, 1568] // G5 B5 D6 G6
      notes.forEach((f, i) => {
        this._note({
          freq: f,
          type: 'triangle',
          start: i * 0.06,
          duration: 0.26,
          gain: 0.2,
        })
      })
      this._noise({ start: 0.05, duration: 0.5, gain: 0.06, from: 3000, to: 9000, q: 0.8 })
    })
  }

  /** Comedic wrong-answer buzzer for picking the moon. */
  wrong() {
    this._play(() => {
      this._note({ freq: 196, type: 'square', duration: 0.22, gain: 0.16 })
      this._note({ freq: 190, type: 'sawtooth', duration: 0.22, gain: 0.12, detune: -30 })
      this._note({ freq: 150, type: 'square', start: 0.24, duration: 0.34, gain: 0.16 })
      this._note({ freq: 146, type: 'sawtooth', start: 0.24, duration: 0.34, gain: 0.1, detune: 25 })
    })
  }

  /** Tiny whoosh for the runaway button. Pitch rises as it gets harder. */
  whoosh(intensity = 0) {
    this._play(() => {
      const k = Math.min(intensity, 12)
      this._noise({
        duration: 0.16,
        gain: 0.1,
        from: 700 + k * 90,
        to: 2600 + k * 220,
        q: 1.4,
      })
      this._note({
        freq: 500 + k * 45,
        slideTo: 980 + k * 90,
        type: 'sine',
        duration: 0.13,
        gain: 0.12,
      })
    })
  }

  /** Big comedic reveal for the 20-second punchline. */
  reveal() {
    this._play(() => {
      const chord = [523, 659, 784, 1047] // C major-ish
      chord.forEach((f, i) =>
        this._note({ freq: f, type: 'triangle', start: i * 0.09, duration: 0.55, gain: 0.2 }),
      )
      this._note({ freq: 1568, type: 'sine', start: 0.42, duration: 0.7, gain: 0.18 })
      this._noise({ start: 0.4, duration: 0.8, gain: 0.09, from: 2000, to: 10000, q: 0.7 })
    })
  }

  /** Slider escalation — gets more dramatic with each stage (0..3). */
  escalate(stage = 0) {
    this._play(() => {
      const base = 330 * Math.pow(1.28, stage)
      const steps = 4 + stage
      for (let i = 0; i < steps; i += 1) {
        this._note({
          freq: base * Math.pow(1.26, i),
          type: stage >= 2 ? 'sawtooth' : 'triangle',
          start: i * (0.075 - stage * 0.008),
          duration: 0.24,
          gain: 0.16,
        })
      }
      if (stage >= 2) {
        this._noise({ start: 0.1, duration: 0.6, gain: 0.08, from: 300, to: 5200, q: 0.9 })
      }
    })
  }

  /** Deliberately pathetic "game over" trombone. */
  gameOver() {
    this._play(() => {
      this._note({ freq: 392, slideTo: 330, type: 'sawtooth', duration: 0.24, gain: 0.14 })
      this._note({ freq: 349, slideTo: 294, type: 'sawtooth', start: 0.24, duration: 0.26, gain: 0.14 })
      this._note({ freq: 311, slideTo: 262, type: 'sawtooth', start: 0.5, duration: 0.28, gain: 0.14 })
      this._note({ freq: 262, slideTo: 130, type: 'sawtooth', start: 0.78, duration: 0.75, gain: 0.16 })
    })
  }

  /** Final-screen party sound: popper + happy arpeggio. */
  celebrate() {
    this._play(() => {
      this._noise({ duration: 0.35, gain: 0.16, from: 900, to: 7000, q: 0.6 })
      const melody = [523, 659, 784, 1047, 1319, 1568]
      melody.forEach((f, i) =>
        this._note({ freq: f, type: 'triangle', start: 0.06 + i * 0.085, duration: 0.4, gain: 0.19 }),
      )
      ;[1047, 1319, 1568, 2093].forEach((f, i) =>
        this._note({ freq: f, type: 'sine', start: 0.62, duration: 1.1, gain: 0.1, detune: i * 4 }),
      )
    })
  }
}

export const sfx = new SoundEngine()
