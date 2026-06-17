# Liwen Personal Website — Session Summary (2026-06-17)

## Project Overview

**GitHub:** https://github.com/willee12123/liwen-Personal-website  
**Local path:** `c:/Users/19976/.claude/projects/liwen个人网站`  
**Tech stack:** React 19 + TypeScript + Vite + Tailwind CSS v4 + lucide-react + framer-motion  
**Dev server:** `npm run dev` → `http://localhost:5174`

---

## Architecture

Single-page scroll site, 5 sections stacked vertically, fixed navbar with smooth-scroll navigation.

```
src/
├── App.tsx                         # Main: Navbar + 5 sections, IntersectionObserver
├── main.tsx                        # React 19 entry
├── index.css                       # Fonts (Inter + Playfair Display), animations
├── hooks/
│   └── useBackgroundMusic.ts       # Audio toggle hook (auto-play, loop)
└── components/
    ├── Navbar.tsx                  # Fixed nav, scroll-to-section, audio toggle
    ├── Hero.tsx                    # Page 1: Home section with cursor spotlight
    ├── RevealLayer.tsx             # Canvas-based spotlight mask for Hero
    ├── Experience.tsx              # Page 2: Horizontal expanding cards
    ├── Projects.tsx                # Page 3: Semi-circle rotating carousel ← NEW
    ├── Skills.tsx                  # Page 4: Skills matrix (placeholder)
    └── AboutMe.tsx                 # Page 5: About Me (placeholder)
```

---

## Page 1: Home (Hero) — COMPLETE

**File:** `src/components/Hero.tsx`

- Full-screen (`100dvh`), cursor-following spotlight effect
- Cursor tracking: `mousemove` → lerp(0.1) in RAF → Canvas radial gradient → maskImage
- Two image layers: Base = `/hero-background-3.png`, Reveal = `/hero-background-1.png`
- Content:
  - Heading: **"Welcome to My"** / **"Space"** (Playfair italic, staggered blur-rise animation)
  - Subtitle: "Building global B2B platforms across supply chain finance and enterprise ecosystems"
  - Bottom-right: 3 lines (Cross-border B2B... / End-to-end supply chain... / AI-driven workflow automation)
  - Button: **Contact Me** (orange `#e8702a`, no action yet)

**File:** `src/components/RevealLayer.tsx`
- Hidden canvas draws radial gradient at cursor position
- `toDataURL()` applied as `maskImage` on reveal div
- SPOTLIGHT_R = 260

---

## Page 2: Experience — COMPLETE

**File:** `src/components/Experience.tsx`

- Horizontal expanding card layout, `100dvh`
- Blurred background: `/hero-background-1.png` with `blur-sm` + `bg-black/70` overlay
- 4 cards side by side:
  - **Collapsed:** ~`flex-[0.6]`, vertical title text
  - **Expanded:** `flex-[5]`, shows year, title, company, description
  - **Default:** First card expanded (`useState(0)`)
  - **Interaction:** `onMouseEnter` to switch, 500ms ease transition
- Bottom dot indicators (click to switch)
- Max width: `max-w-4xl`

### Card Content:

| # | Year | Title | Organization | Description |
|---|------|-------|-------------|-------------|
| 1 | 2023 — Present | IT Product Manager | Olea (SCB & Linklogis JV) | Supply chain finance platform, 70+ countries, AI workflow automation |
| 2 | 2021 — 2023 | Product Manager | Mei Tuan | Enterprise collaboration, 2.0 launch, feature adoption 20%→75% |
| 3 | 2020 — 2021 | Master | UCL | Python, SQL, GIS, quantitative product decision-making |
| 4 | 2015 — 2020 | Undergraduate | Tongji University | Urban planning, national research, Youth League leadership |

---

## Page 3: Projects — COMPLETE (new design)

**File:** `src/components/Projects.tsx`

### Visual Design
- **Background:** `wmremove-transformed.png` at 65% opacity, no global dark overlay
- **Heading:** "Projects" in a dark glass-morphism pill (`bg-black/50 backdrop-blur-sm rounded-3xl`) on the left
- **Section style:** `rounded-t-[60px] -mt-14 z-10` overlapping Experience section above
- **Background:** `#0C0C0C` near-black

### Core Interaction: Semi-circle Rotating Carousel

5 project cards arranged along a **right-side semi-circle arc** that slowly rotates.

#### Arc Geometry (final tuned values)

| Parameter | Value | Notes |
|-----------|-------|-------|
| ARC_START | 132° | Bottom of arc — ~130px padding from section bottom |
| ARC_END | 228° | Top of arc — ~130px padding from section top |
| ARC_RANGE | 96° | Total arc span |
| Card spacing | 19.2° | ARC_RANGE / TOTAL, uniform distribution |
| Radius | 350–500px | Responsive, scales with viewport |
| Arc center X | clamp(80vw, 86vw, 92vw) | Positioned on the right side |
| Arc center Y | 50vh | Vertically centered for symmetric padding |
| Rotation speed | 0.012°/ms (~0.72°/s) | Full cycle ≈ 8 minutes |

#### Card Design

- **Size:** 290px (mobile) / 340px (desktop) wide
- **Style:** `bg-[#0C0C0C]/92 backdrop-blur-md`, border `white/10`, `rounded-3xl`, `shadow-2xl`
- **Content:** Project number (Playfair italic, orange), category, title, first highlight line
- **Overlap:** Cards partially overlap due to tight angular spacing — lower cards (higher y) have higher z-index

#### Rotation & Clip Animation

- **Continuous rotation** via `requestAnimationFrame`, pauses when a card is expanded
- **Seamless wrapping:** Cards that reach ARC_END wrap to ARC_START (and vice versa)
- **Right-side clip (swallow effect):**
  - **Bottom entry (132°–140°):** card emerges from right → `clip-path: inset(0 100% 0 0)` → `inset(0 0% 0 0)`
  - **Middle zone (140°–220°):** fully visible, semi-circle shape clearly seen
  - **Top exit (220°–228°):** card swallowed from right → `inset(0 0% 0 0)` → `inset(0 100% 0 0)`
  - CLIP_ZONE = 8° at each end — brief transitions, separated by ~128° gap (exit and entry don't overlap)
- **No opacity fade** — pure clip-path for the swallow/reveal effect

#### Card Expansion (click)

- **Click card** → rotation pauses, full-size detail card slides in on the **left side** (framer-motion `AnimatePresence`)
- **Expanded card:** max-width 520–640px, shows number, category, title, all highlights, project images (if available)
- **Dismiss:** X button or click dark backdrop → card animates back, rotation resumes
- **Scroll lock:** body scroll disabled while expanded

### Project Data (5 cards)

| # | Title | Category | Status |
|---|-------|----------|--------|
| 01 | Supply Chain Finance Platform Integration | PLATFORM / FINTECH SYSTEM | Complete with images |
| 02 | Enterprise Platform Architecture | PLATFORM / SYSTEM DESIGN | Complete with images |
| 03 | AI Workflow Automation System | AI / AUTOMATION | Complete with images |
| 04 | Project Title — Coming Soon | PLATFORM / ENTERPRISE | Placeholder |
| 05 | Project Title — Coming Soon | PRODUCT / GROWTH | Placeholder |

### Dependencies Added

- **framer-motion** (^12.x) — for scroll-based animations, card expand/collapse transitions

---

## Page 4–5: Placeholder — TO DO

| Page | File | Status | Notes |
|------|------|--------|-------|
| Skills | `src/components/Skills.tsx` | Placeholder | 2×2 matrix, 5-dot skill levels |
| About Me | `src/components/AboutMe.tsx` | Placeholder | Avatar placeholder + bio + 4 quick-info |

---

## Navbar

**File:** `src/components/Navbar.tsx`

- Fixed `z-[100]`, horizontal padding matches bottom-right content (`px-5 sm:px-10 md:px-14`)
- Left: **Wen Li** (Inter font)
- Center pill: Home / Experience / Projects / Skills / About Me (scroll highlight via IntersectionObserver)
- Right: Audio toggle (Volume2/VolumeX, size 22, `p-2`)
- Mobile: Hamburger → dropdown with all items
- Contact Me: Removed from nav (now in Hero section only)

---

## Audio System

**File:** `src/hooks/useBackgroundMusic.ts`

- Audio: `/空灵轻风_no-watermark.mp3` (public folder)
- Auto-play on load, loop, volume 0.3
- Graceful fallback if browser blocks autoplay

---

## Images in `public/`

| File | Usage |
|------|-------|
| `hero-background-1.png` | Hero reveal layer + Experience blurred bg |
| `hero-background-2.png` | (unused currently) |
| `hero-background-3.png` | Hero base layer |
| `wmremove-transformed.png` | Projects section background |
| `空灵轻风_no-watermark.mp3` | Background music |
| `bg-music.wav` | Old placeholder (can delete) |

---

## Key Design Tokens

| Token | Value |
|-------|-------|
| Primary accent | `#e8702a` (orange) |
| Primary hover | `#d2611f` |
| Body font | Inter |
| Display font | Playfair Display (italic) |
| Animation easing | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Dark bg | `#0C0C0C` (near-black) |
| Card border | `#D7E2EA` (light gray-blue) or `white/10` |

---

## Next Steps (for next session)

1. **Projects page** — Update cards 04–05 with real project content + images; optionally add a 6th card
2. **Project card images** — Cards 01–03 have images; verify image URLs still work
3. **Skills page** — Replace placeholder with real skills matrix
4. **About Me page** — Add real photo, bio, contact info
5. **Contact Me button** — Wire up action (email / modal / scroll to About)
6. **Git push** — Run `git push -u origin master` from local terminal (GitHub blocked in current env)
7. **Responsive polish** — Test mobile, adjust breakpoints as needed (especially the semi-circle on small screens)
8. **Micro-interactions** — Optional: hover glow on cards, subtle parallax on background image