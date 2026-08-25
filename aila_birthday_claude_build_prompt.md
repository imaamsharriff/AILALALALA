# Claude Build Prompt — Aila's Cute Birthday Website

## Goal

Build a **frontend-only, single-page interactive birthday website** for **Aila**. The site should feel like an over-the-top cute-girl internet aesthetic: pink, bows, sparkles, hearts, cats, Hello Kitty-inspired visuals, cute GIFs, playful animations, sound effects, and silly interactions.

The website is intended as a playful birthday surprise. It should work well on both desktop and mobile.

## Technical Requirements

- Frontend only.
- No backend, database, authentication, or API.
- Use HTML/CSS/JavaScript or the project's existing frontend stack.
- Make it fully responsive.
- Keep the code clean and componentized if using React/Vite.
- Use CSS animations/transitions extensively.
- Prefer local assets where practical.
- For external GIFs/images, use stable public URLs only if appropriate and ensure the page still has a graceful fallback if an asset fails.
- Do not make the page dependent on a paid service.
- Sound should begin only after a user interaction because browsers commonly block autoplay.
- Include a visible mute/unmute button.

## Overall Visual Direction

### Theme

Use an extremely cute pink aesthetic:

- Main colors: pastel pink, hot pink, blush, white, cream, soft lavender.
- Rounded cards and buttons.
- Lots of bows 🎀.
- Hearts 💕.
- Sparkles ✨.
- Cute cats 🐱.
- Hello Kitty-inspired decorative elements.
- Cute stickers.
- Glossy/Y2K-style accents.
- Soft shadows.
- Subtle grain/noise texture.
- Floating decorative elements.
- Occasional animated hearts and sparkles.
- Use playful rounded typography, with a cute handwritten/display font for headings if available.

Do **not** simply make everything pink. Use different shades, white/cream space, borders, stickers, ribbons, and patterns to create visual hierarchy.

### Decorative elements

Scatter animated decorative elements around the page:

- 🎀 bows
- 💕 hearts
- ✨ sparkles
- 🐱 cats
- 🌸 flowers
- ⭐ stars
- Cute sticker-like badges
- Small floating GIFs
- Tiny ribbons

Decorations should move subtly rather than becoming visually overwhelming.

## Page Flow

The experience should happen in a sequence of full-screen/large sections.

Suggested flow:

1. Birthday intro
2. "Who is prettier?" game
3. "How pretty is Aila?" game
4. Final cute message

Use smooth transitions between sections.

---

# Section 1 — Birthday Introduction

The first thing the visitor sees should be a beautiful animated birthday screen.

Large central heading:

> 🎀 HAPPY BIRTHDAY, AILA! 🎀

Add a cute subtitle such as:

> Today is officially Aila Appreciation Day 💕✨

Include:

- Animated confetti.
- Floating hearts.
- Sparkles.
- Bows.
- Cute cat/GIF decorations.
- A birthday cake illustration/GIF.
- A glowing/pulsing "START THE SURPRISE" button.

When the button is clicked:

- Play a short cute sound effect.
- Trigger a burst of hearts/confetti.
- Transition into the first game.

Do not autoplay audio before the user interacts.

---

# Section 2 — "Who is prettier?"

Create a playful game.

Heading:

> WHO IS PRETTIER? 🎀

Subheading:

> Be honest. This is a very serious scientific experiment.

Show two large cute cards/buttons:

### Option 1

> 🌙 MOON

### Option 2

> 🎀 AILA

Make the cards visually distinct but equally attractive.

## If the user clicks MOON

Immediately display a playful error-style message:

> ❌ WRONG.

Then:

> You're wrong 😭

Add a funny animation:

- Screen shakes slightly.
- Red/pink "WRONG" stamp appears.
- Cute crying cat GIF/sticker.
- Play a short comedic sound effect.

Allow them to try again.

Do not permanently lock the game.

## If the user interacts with AILA

This is the main joke.

Aila's card/button should **run away from the cursor/finger**.

### Desktop behavior

When the mouse gets close to or hovers over the Aila option:

- Move the button away.
- Choose a random safe position.
- Animate the movement with a springy/easing effect.
- Do not move it outside the viewport.
- Do not place it somewhere impossible to reach.
- Keep the interaction playful.

Each subsequent attempt should make it harder to catch.

Use random directions and distances, but keep it bounded within the game area.

### Mobile behavior

Because hover doesn't exist on touch devices:

- Detect touch/pointer interaction.
- Move the Aila button when the user attempts to tap it.
- Keep it within the visible game area.

### 20-second punchline

Track how long the visitor has been trying to catch Aila.

After approximately **20 seconds** of the runaway interaction:

Freeze the button.

Display a large cute message:

> LOSER 😭  
> IT'S AILA 🎀

Then add:

> You really thought you could escape the truth?

Trigger:

- Confetti.
- Heart explosion.
- Cat GIF.
- Funny sound effect.
- A cute celebratory animation.

Then reveal a:

> CONTINUE 💕 

button.

Important: the 20-second timer should measure the interaction with the runaway Aila button rather than simply starting immediately when the page loads.

---

# Section 3 — "How pretty is Aila?"

Heading:

> OKAY THEN... HOW PRETTY IS AILA? 🎀

Subheading:

> Rate her from 1–10.

Create a large cute interactive slider.

Initial range:

- Minimum: 1
- Maximum: 10
- Starting value: around 5

Display the current number prominently.

Example:

> AILA IS A 7/10 💕

The user should be able to drag the slider.

## The joke

When the user reaches **10**, immediately change the maximum to:

> 100

The slider should visually react as if the website has realized that 10 isn't enough.

Display something like:

> Hmm... apparently 10 wasn't enough.

When the user reaches **100**, increase the maximum to:

> 1,000

Then:

> 10,000

Continue the escalation until the joke concludes.

Suggested progression:

```text
1–10
↓
100
↓
1,000
↓
10,000
```

Make every escalation animated and increasingly ridiculous.

Use changing text such as:

> 10/10? That's cute.

Then:

> WAIT. WE NEED A BIGGER SCALE.

Then:

> 100/100?!

Then:

> THIS IS GETTING OUT OF HAND.

Then:

> 1,000?!

Then:

> OKAY THIS IS SCIENTIFICALLY UNREASONABLE.

Then:

> 10,000?!

## Final punchline

After the user reaches the end of the 10,000 scale, stop escalating.

Show:

> 10,000/10 🎀

Then:

> aw man thats too bad 😔

The joke should feel deliberately absurd.

Add a dramatic defeated animation:

- Slider deflates/fades.
- Sad cat GIF.
- Tiny falling hearts.
- Funny "game over" style sound.
- Then immediately transition into a cute celebratory state.

---

# Final Section — Aila Appreciation

Create a final oversized cute screen.

Suggested text:

> 🎀 CONCLUSION 🎀

> Aila is officially:
>
> **∞ / 10**

Then:

> Happy Birthday, Aila 💕✨

Add a final message:

> Hope your day is as ridiculously pretty as you are.

Include:

- Giant bow animation.
- Hearts.
- Sparkles.
- Cats.
- Confetti.
- Cute birthday GIF.
- "Replay the chaos" button.

The replay button should restart the experience from the beginning without refreshing the page.

---

# Animation Requirements

Use polished animations throughout.

Include:

- Fade-ins.
- Scale/bounce entrances.
- Floating hearts.
- Sparkles.
- Button hover animations.
- Card tilt/hover effects.
- Confetti bursts.
- Screen shake for jokes.
- Spring-like movement for the runaway Aila button.
- Smooth section transitions.
- Slider escalation animations.
- Cute cursor-following decorations where appropriate.
- Reduced-motion fallback using `prefers-reduced-motion`.

Animations should feel smooth rather than chaotic.

---

# Sound Effects

Include optional cute sound effects.

Possible sounds:

- Button click: tiny pop.
- Correct/Aila interaction: cheerful sparkle.
- Moon selection: comedic wrong/buzzer sound.
- Runaway button: tiny whoosh/pop.
- 20-second punchline: comedic reveal.
- Slider escalation: increasingly dramatic sounds.
- Final screen: cute celebratory sound.

Important:

- Never force audio autoplay.
- Start audio only after the user clicks the initial button.
- Add a persistent mute/unmute control.
- Keep sound effects short and non-annoying.
- If audio files fail to load, the website must still work perfectly.

---

# GIFs / Images / Assets

Use cute internet-style visual assets.

Possible categories:

- Cute cat GIFs.
- Hello Kitty-inspired GIFs.
- Birthday cake GIFs.
- Dancing cats.
- Crying cats.
- Sparkles.
- Pink bows.
- Hearts.
- Cute reaction GIFs.

If using Hello Kitty assets, keep the implementation as decorative fan-style inspiration rather than implying official affiliation.

Do not rely on a single external GIF provider for the entire experience.

Create graceful fallbacks using CSS/emoji/stickers if an image fails.

---

# Interaction Details

The site should feel like a mini game rather than a static birthday card.

Requirements:

- Buttons visibly react to pointer movement.
- Cards respond to hover.
- Touch interactions work on mobile.
- No interaction should cause horizontal scrolling.
- Runaway Aila button must remain inside its game container.
- Prevent accidental page scrolling while interacting with the game on mobile where appropriate.
- The interface should remain usable at widths around 320px and above.
- Use accessible buttons and keyboard focus states.
- Don't rely exclusively on hover for essential functionality.
- Use semantic HTML where possible.

---

# Responsive Design

Desktop:

- Large centered game area.
- Decorative elements around the edges.
- Larger GIFs/stickers.
- Smooth cursor interactions.

Tablet:

- Reduce decoration density.
- Maintain large tap targets.

Mobile:

- Stack cards vertically.
- Use large touch targets.
- Adapt the runaway button to pointer/touch movement.
- Keep text readable.
- Avoid elements extending beyond viewport.
- Keep animations performant.

---

# Suggested Component Structure

If using React:

```text
App
├── BackgroundDecorations
├── SoundController
├── BirthdayIntro
├── PrettyGame
│   ├── MoonOption
│   └── AilaOption
├── RatingGame
├── FinalMessage
└── Confetti
```

Suggested state:

```text
currentSection
soundEnabled
prettyGameStartedAt
wrongAnswerCount
ailaPosition
rating
ratingMax
ratingStage
gameComplete
```

Keep game logic separate from visual components.

---

# Important Game Logic

## Pretty Game

Pseudo-behavior:

```text
When Moon is clicked:
    show "You're wrong"
    shake screen
    play wrong sound

When pointer/touch approaches Aila:
    if elapsed time < 20 seconds:
        move Aila to a new random safe position
        increment interaction count

    if elapsed time >= 20 seconds:
        stop moving Aila
        show "loser its Aila"
        trigger celebration
```

Make sure the random position:

- stays inside the game container,
- doesn't overlap important text,
- doesn't cause the page to scroll,
- remains reachable enough to be funny,
- works with both mouse and touch.

## Rating Game

Pseudo-behavior:

```text
max = 10

When rating reaches max:
    if max == 10:
        max = 100
    else if max == 100:
        max = 1000
    else if max == 1000:
        max = 10000
    else if max == 10000:
        show final punchline
```

The maximum should visibly change so the visitor realizes the joke is escalating.

---

# Performance

- Avoid excessive DOM elements.
- Use CSS transforms for movement where possible.
- Avoid expensive continuous JavaScript animations.
- Respect `prefers-reduced-motion`.
- Lazy-load non-critical GIFs/images.
- Keep the site lightweight.
- No backend.

---

# Code Quality

Provide:

- Clean folder structure.
- Reusable components.
- Meaningful variable names.
- Comments around unusual game logic.
- No hardcoded viewport-specific coordinates.
- No console errors.
- No broken interactions.
- No dependency on backend services.

Before finishing, test:

- Desktop Chrome.
- Mobile-sized viewport.
- Mouse interaction.
- Touch/pointer interaction.
- Keyboard navigation.
- Muted mode.
- Missing image/GIF fallback.
- Reduced-motion mode.
- Replay functionality.

---

# Desired Overall Feeling

The final result should feel like:

**"Someone spent way too much effort making a ridiculous, adorable, pink birthday website specifically to prove that Aila is prettier than everyone."**

It should be cute, funny, interactive, slightly chaotic, and polished—not like a generic birthday template.
