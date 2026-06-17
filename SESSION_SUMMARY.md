# Liwen Personal Website — Session Summary (2026-06-18)

## Project Overview

**GitHub:** https://github.com/willee12123/liwen-Personal-website (public)  
**Live URL:** https://willee12123.github.io/liwen-Personal-website/  
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
│   └── useBackgroundMusic.ts       # Audio toggle hook (auto-play, user-interaction fallback)
└── components/
    ├── Navbar.tsx                  # Fixed nav, scroll-to-section, audio toggle
    ├── Hero.tsx                    # Page 1: Home section with cursor spotlight
    ├── RevealLayer.tsx             # Canvas-based spotlight mask for Hero
    ├── Experience.tsx              # Page 2: Horizontal expanding cards
    ├── Projects.tsx                # Page 3: Semi-circle rotating carousel
    ├── Skills.tsx                  # Page 4: Skills matrix (placeholder)
    └── AboutMe.tsx                 # Page 5: About Me (placeholder)

.github/workflows/
└── deploy.yml                      # GitHub Actions → auto-deploy to Pages on push
```

---

## Page 1: Home (Hero) — COMPLETE

**File:** `src/components/Hero.tsx`

- Full-screen (`100dvh`), cursor-following spotlight effect
- Cursor tracking: `mousemove` → lerp(0.1) in RAF → Canvas radial gradient → maskImage
- Two image layers: Base = `hero-background-3.png`, Reveal = `hero-background-1.png`
- **IMPORTANT:** Image paths use `import.meta.env.BASE_URL + 'filename'` for GitHub Pages compatibility
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
- Blurred background: `hero-background-1.png` with `blur-sm` + `bg-black/70` overlay
- **IMPORTANT:** Image path uses `import.meta.env.BASE_URL`
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

## Page 3: Projects — UPDATED

**File:** `src/components/Projects.tsx`

### Visual Design
- **Background:** `wmremove-transformed.png` at 65% opacity
- **Heading:** "Projects" in a dark glass-morphism pill (`bg-black/50 backdrop-blur-sm rounded-3xl`) on the left
- **Section style:** `rounded-t-[60px] -mt-14 z-10` overlapping Experience section above
- **Background:** `#0C0C0C` near-black

### Core Interaction: Semi-circle Rotating Carousel

5 project cards arranged along a **right-side semi-circle arc** that slowly rotates.

#### Arc Geometry (DYNAMIC — computed from section height)

| Parameter | Value | Notes |
|-----------|-------|-------|
| arcStart / arcEnd | Computed via `computeArcParams(sectionHeight, radius)` | Dynamically ensures 20% padding top & bottom |
| Arc center X | `clamp(80vw, 86vw, 92vw)` | Positioned on the right side |
| Arc center Y | `50vh` | Vertically centered |
| Radius range | **220–350px** | Responsive, smaller for visible arc shape |
| Rotation speed | **0.0096°/ms (~0.58°/s)** | 0.8× of original, full cycle ≈ 10 min |
| CLIP_ZONE | 8° | Brief transition at edges |

**How dynamic angles work:** `computeArcParams` takes section height and radius → computes `angleFromHorizontal = asin(height * 0.3 / radius)` → arcStart = 180° − angle, arcEnd = 180° + angle. Monitored via `ResizeObserver` on the section element. Default fallback: `DEFAULT_ARC` computed with `window.innerHeight` and radius 280.

#### Card Design

- **Size:** 290px (mobile) / 340px (desktop) wide
- **Style:** `bg-[#0C0C0C]/92 backdrop-blur-md`, border `white/10`, `rounded-3xl`, `shadow-2xl`
- **Content:** Project number (Playfair italic, orange), category, title, first highlight line

#### Rotation & Clip Animation

- **Continuous rotation** via `requestAnimationFrame`, pauses when a card is expanded
- **Seamless wrapping:** Cards that reach arcEnd wrap to arcStart (and vice versa)
- **Right-edge clip:**
  - **Bottom entry:** `inset(0 100%→0 0 0)` — card emerges leftward, right side hidden first
  - **Top exit:** `inset(0 0→100% 0 0)` — card recedes rightward, right side consumed first
  - Only the portion extending past the arc boundary is clipped
- **No opacity fade** — pure clip-path for the arc-edge cut effect

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

---

## Page 4–5: Placeholder — TO DO

| Page | File | Status | Notes |
|------|------|--------|-------|
| Skills | `src/components/Skills.tsx` | Placeholder | 2×2 matrix, 5-dot skill levels |
| About Me | `src/components/AboutMe.tsx` | Placeholder | Avatar placeholder + bio + 4 quick-info |

---

## Deployment — GitHub Pages (NEW)

### Configuration

- **Repo:** Public (changed from private for Pages free tier)
- **Vite base:** `/liwen-Personal-website/` in `vite.config.ts`
- **GitHub Actions:** `.github/workflows/deploy.yml` — auto-build & deploy on push to master
- **Workflow:** `npm ci` → `npm run build` → `upload-pages-artifact` → `deploy-pages`

### Asset Path Fix

All static asset paths must use `import.meta.env.BASE_URL` for GitHub Pages sub-path deployment:

```ts
// ❌ Broken on Pages:
const img = '/hero-background-1.png'

// ✅ Correct:
const img = import.meta.env.BASE_URL + 'hero-background-1.png'
```

**Files updated:** `Hero.tsx`, `Experience.tsx`, `Projects.tsx`, `useBackgroundMusic.ts`

### Image Preloading

`index.html` includes `<link rel="preload">` for critical background images:
- `hero-background-3.png` (fetchpriority="high")
- `hero-background-1.png` (fetchpriority="high")
- `wmremove-transformed.png`

---

## Navbar

**File:** `src/components/Navbar.tsx`

- Fixed `z-[100]`, horizontal padding matches bottom-right content (`px-5 sm:px-10 md:px-14`)
- Left: **Wen Li** (Inter font)
- Center pill: Home / Experience / Projects / Skills / About Me (scroll highlight via IntersectionObserver)
- Right: Audio toggle (Volume2/VolumeX, size 22, `p-2`)
- Mobile: Hamburger → dropdown with all items

---

## Audio System — UPDATED

**File:** `src/hooks/useBackgroundMusic.ts`

- Audio: `空灵轻风_no-watermark.mp3` (public folder)
- **Autoplay strategy:**
  1. Sets `preload='auto'` on Audio element
  2. Waits for `canplay` event + 1.5s fallback timer before attempting play
  3. If browser blocks autoplay → first user click/touch/keypress on page auto-plays
- Loop, volume 0.3
- `isPlayingRef` avoids stale closure issues in toggle callback

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
2. **Skills page** — Replace placeholder with real skills matrix (2×2 matrix, 5-dot skill levels)
3. **About Me page** — Add real photo, bio, contact info, 4 quick-info cards
4. **Contact Me button** — Wire up action (email / modal / scroll to About)
5. **Responsive polish** — Test mobile, adjust breakpoints (especially semi-circle on small screens)
6. **Micro-interactions** — Optional: hover glow on cards, subtle parallax on background
7. **Performance** — Consider converting PNG backgrounds to WebP for faster loading