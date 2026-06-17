# Liwen Personal Website — Session Summary (2026-06-17)

## Project Overview

**GitHub:** https://github.com/willee12123/liwen-Personal-website  
**Local path:** `c:/Users/19976/.claude/projects/liwen个人网站`  
**Tech stack:** React 18 + TypeScript + Vite + Tailwind CSS v4 + lucide-react  
**Dev server:** `npm run dev` → `http://localhost:5174`

---

## Architecture

Single-page scroll site, 5 sections stacked vertically, fixed navbar with smooth-scroll navigation.

```
src/
├── App.tsx                         # Main: Navbar + 5 sections, IntersectionObserver
├── main.tsx                        # React 18 entry
├── index.css                       # Fonts (Inter + Playfair Display), animations
├── hooks/
│   └── useBackgroundMusic.ts       # Audio toggle hook (auto-play, loop)
└── components/
    ├── Navbar.tsx                  # Fixed nav, scroll-to-section, audio toggle
    ├── Hero.tsx                    # Page 1: Home section with cursor spotlight
    ├── RevealLayer.tsx             # Canvas-based spotlight mask for Hero
    ├── Experience.tsx              # Page 2: Horizontal expanding cards
    ├── Projects.tsx                # Page 3: Project cards grid (placeholder)
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

## Page 3–5: Placeholder — TO DO

| Page | File | Status | Notes |
|------|------|--------|-------|
| Projects | `src/components/Projects.tsx` | Placeholder | 2×2 card grid, fake geology projects |
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

---

## Next Steps (for next session)

1. **Projects page** — Replace placeholder content with real projects
2. **Skills page** — Replace placeholder with real skills matrix
3. **About Me page** — Add real photo, bio, contact info
4. **Contact Me button** — Wire up action (email / modal / scroll to About)
5. **Git push** — Run `git push -u origin master` from local terminal
6. **Responsive polish** — Test mobile, adjust breakpoints as needed