# Orbit — Design System v3

**Split cleanly in two:** the **structure** (nav, layout, cards, buttons, type scale) still comes from Apple Fitness / Strava / Cashew — that part of v2 stays. The **skin** (color, texture, mood) is now dark and gritty, in the spirit of Jujutsu Kaisen's aesthetic: ink-black, cursed-energy purple, torn paper and brush-stroke texture — not the clean, friendly saturation of v2.

I'm not using JJK characters, logos, or art — this is a palette-and-texture mood only (ink, cursed energy, grunge), so nothing here reproduces the show's actual IP.

## Structure (unchanged from v2 — this is the part you liked)

- **Layout:** overlapping ring hero at the top of Today, activity-feed below it, bottom tab bar on mobile / left icon rail on desktop.
- **Nav:** bottom tab bar — Today / Rings / Feed / Money / Profile — collapses to a slim left rail ≥1024px, icon-only with a label flyout on hover.
- **Cards:** rounded (18–20px radius), no hairline borders, separation by elevation not outlines.
- **Buttons:** pill-shaped primary CTA, solid fill; secondary buttons are outline-only, no fill.
- **Category chips:** icon + label pill on every list row (expense, food, habit, workout type) — this stays, just recolored below.
- **Type scale:** `12 / 14 / 16 / 22 / 34 / 48` px, condensed-bold for stat numerals, regular-weight sans for UI text.

## Skin: dark, gritty, cursed-energy

### Color

Ink-black base, not a "clean" true black — texture and slight noise keep it from reading flat. One cursed-energy purple as the dominant accent, blood red reserved for danger/overdraft/PR-broken states only, and a cold cursed-blue for the "positive/domain expansion" moments (closing all rings, hitting a goal).

| Token | Hex | Use |
|---|---|---|
| `--bg-void` | `#0B0A0C` | App background — near-black with a cold undertone, not warm charcoal |
| `--bg-card` | `#17151A` | Cards, feed items |
| `--bg-card-raised` | `#221E27` | Modals, active/pressed cards |
| `--ink-texture` | `#000000` at 15–25% grain overlay | Subtle noise/brush texture on hero backgrounds only — see Texture below |
| `--text-primary` | `#EDEAF0` | Off-white, slight cool tint — not pure white (too clean for this mood) |
| `--text-secondary` | `#6E6877` | Muted violet-gray for labels/meta |
| `--cursed-purple` | `#7C3AED` | Primary accent — active nav, primary buttons, the dominant ring |
| `--cursed-purple-glow` | `#7C3AED33` | Glow/shadow behind the accent, used sparingly for "cursed energy" feel |
| `--blood-red` | `#B91C1C` | Danger, overdraft, missed streak, broken PR — never decorative |
| `--cursed-blue` | `#38BDF8` | Success / goal-hit / "domain expansion" moment — cold, sharp, used as a flash not a fill |

### Ring colors (same 4 pillars, recolored)

| Ring | Hex | Mood |
|---|---|---|
| Move | `#B91C1C` (blood red) | Exertion, physical strain |
| Fuel | `#8B5CF6` (violet) | Cursed-energy purple, lighter |
| Rest | `#38BDF8` (cursed blue) | Cold, still |
| Focus | `#7C3AED` (core cursed-purple) | The dominant ring — this is "you" |

### Category palette (desaturated, no Cashew-brightness — these should look worn, not candy)

`#6B2B2B` `#5C3A1E` `#4A4A1E` `#2E4A2E` `#1E4A4A` `#2E3A6B` `#4A2E6B` `#6B2E4A`

Each is a dark, muted version of a hue — think dried blood, ash, faded ink — rather than the punchy Cashew brights. Icon inside the chip stays bright white or `cursed-purple` for contrast against the muted fill.

### Typography

- **Stat numerals:** same condensed-bold structure as v2, but consider a slightly more angular/aggressive condensed face if available (e.g. `Oswald` or `Barlow Condensed`) instead of the friendlier `Inter Tight` — sharper terminals read grittier.
- **UI text:** `Inter` stays for legibility — don't sacrifice readability for mood on body text.
- **Section labels / eyebrows:** all-caps, wide tracking, `text-secondary` — small ritualistic labels ("TODAY'S BALANCE", "STREAK — 12") read like incantation tags without literally using Japanese script (avoid appropriative faux-kanji lettering).

### Texture

This is what actually sells "gritty" over just "dark":
- Hero section (ring stack) gets a very subtle noise/grain overlay (`--ink-texture`, low opacity, CSS `background-blend-mode: overlay` or an SVG turbulence filter) — like ink bleeding into paper, not a glossy gradient.
- Card edges: instead of a clean 1px border, use a 1px border at low opacity (`#FFFFFF0D`) — barely-there, like a worn edge.
- Ring stroke: slightly irregular/hand-inked rather than perfectly geometric — a faint wobble or double-stroke on the ring path (SVG filter, subtle) gives it a brushed feel instead of Apple Fitness's clinical precision. Use this filter sparingly — it must not hurt legibility of the fill percentage.
- Avoid: gore, literal violence, blood-drip effects, or replicating specific JJK character marks/symbols — keep it mood (ink, dark, tension) not literal iconography.

### Motion

- Rings still fill on log, but the sweep now has a slight "flicker" at the leading edge (2–3 quick opacity pulses) before settling — reads as cursed energy flaring rather than a smooth UI animation.
- Closing all rings: a sharp `cursed-blue` flash across the screen edge (150ms) instead of v2's confetti-adjacent burst — cold and abrupt, not celebratory-cute.
- Danger states (overdraft, broken streak): a single hard red pulse on the card, no bounce — feels like a warning strike, not a wobble.
- Respect `prefers-reduced-motion` — flicker and flash both degrade to a plain cross-fade.

## Tailwind config additions

```js
// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        void: '#0B0A0C',
        card: '#17151A',
        'card-raised': '#221E27',
        'text-primary': '#EDEAF0',
        'text-secondary': '#6E6877',
        cursed: {
          purple: '#7C3AED',
          'purple-glow': '#7C3AED33',
          blue: '#38BDF8',
        },
        blood: '#B91C1C',
        ring: {
          move: '#B91C1C',
          fuel: '#8B5CF6',
          rest: '#38BDF8',
          focus: '#7C3AED',
        },
        category: {
          rust: '#6B2B2B',
          umber: '#5C3A1E',
          olive: '#4A4A1E',
          moss: '#2E4A2E',
          teal: '#1E4A4A',
          indigo: '#2E3A6B',
          violet: '#4A2E6B',
          maroon: '#6B2E4A',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        display: ['"Barlow Condensed"', '"Oswald"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '20px',
        pill: '999px',
      },
      backgroundImage: {
        grain: "url('/textures/noise.png')", // subtle overlay, low opacity
      },
    },
  },
}
```

## Component notes (structure from v2, restyled)

- **Primary button:** pill radius (kept), `cursed-purple` fill, `--text-primary` text, subtle `cursed-purple-glow` box-shadow on hover — the glow is the one place "cursed energy" becomes a literal effect.
- **Category chip:** pill radius (kept), muted category color as background at full opacity (not 15% like v2 — these are meant to look worn/solid, not bright-and-light), white or purple icon for contrast.
- **Streak/PR badge:** small flame/mark icon + number, `cursed-purple`, appears inline in feed — same placement as v2, recolored.
- **Empty ring state:** ring outline at 8% opacity on `text-secondary`, center text "Nothing logged yet" in `text-secondary` — flatter and more austere than v2's friendlier invitation copy.
- **Danger/overdraft card:** `blood-red` left-edge accent bar (4px) instead of a full-card red fill — keeps red rare and meaningful.
