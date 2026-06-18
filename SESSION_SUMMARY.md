# Liwen Personal Website — Session Summary (2026-06-18)

## Project Overview

**GitHub:** https://github.com/willee12123/liwen-Personal-website (public)  
**Live URL:** https://willee12123.github.io/liwen-Personal-website/  
**Local path:** `c:/Users/19976/.claude/projects/liwen个人网站`  
**Tech stack:** React 19 + TypeScript + Vite + Tailwind CSS v4 + lucide-react + framer-motion  
**Dev server:** `npm run dev` → `http://localhost:5173/liwen-Personal-website/`

---

## Architecture

Single-page scroll site, 5 sections stacked vertically, fixed navbar with smooth-scroll navigation.

```
src/
├── App.tsx                         # Main: Navbar + 5 sections, IntersectionObserver
├── main.tsx                        # React 19 entry
├── index.css                       # Fonts (Inter + Playfair Display), animations, scrollbar-fade
├── hooks/
│   └── useBackgroundMusic.ts       # Audio toggle hook (auto-play, user-interaction fallback)
└── components/
    ├── Navbar.tsx                  # Fixed nav, scroll-to-section, audio toggle
    ├── Hero.tsx                    # Page 1: Home section with cursor spotlight
    ├── RevealLayer.tsx             # Canvas-based spotlight mask for Hero
    ├── Experience.tsx              # Page 2: Horizontal expanding cards
    ├── Projects.tsx                # Page 3: Semi-circle rotating carousel (5 cards, all populated)
    ├── Skills.tsx                  # Page 4: 3D rotating card ring with flip interaction
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
- 4 cards side by side:
  - **Collapsed:** ~`flex-[0.6]`, vertical title text
  - **Expanded:** `flex-[5]`, shows year, title, company, description
  - **Default:** First card expanded (`useState(0)`)
  - **Interaction:** `onMouseEnter` to switch, 500ms ease transition
- Bottom dot indicators (click to switch)

### Card Content:

| # | Year | Title | Organization | Description |
|---|------|-------|-------------|-------------|
| 1 | 2023 — Present | IT Product Manager | Olea (SCB & Linklogis JV) | Supply chain finance platform, 70+ countries, AI workflow automation |
| 2 | 2021 — 2023 | Product Manager | Mei Tuan | Enterprise collaboration, 2.0 launch, feature adoption 20%→75% |
| 3 | 2020 — 2021 | Master | UCL | Python, SQL, GIS, quantitative product decision-making |
| 4 | 2015 — 2020 | Undergraduate | Tongji University | Urban planning, national research, Youth League leadership |

---

## Page 3: Projects — UPDATED (2026-06-18)

**File:** `src/components/Projects.tsx`

### Visual Design
- **Background:** `wmremove-transformed.png` at 65% opacity
- **Heading:** "Projects" in a dark glass-morphism pill (`bg-black/50 backdrop-blur-sm rounded-3xl`) on the left
- **Section style:** `rounded-t-[60px] -mt-14 z-10` overlapping Experience section above

### Core Interaction: Semi-circle Rotating Carousel

5 project cards (all populated with real content) arranged along a **right-side semi-circle arc** that slowly rotates.

#### Arc Geometry (DYNAMIC — computed from section height)

| Parameter | Value | Notes |
|-----------|-------|-------|
| arcStart / arcEnd | Computed via `computeArcParams(sectionHeight, radius)` | 15% padding top & bottom |
| Arc center X | `clamp(80vw, 86vw, 92vw)` | Positioned on the right side |
| Arc center Y | `50vh` | Vertically centered |
| Radius range | **220–350px** | Responsive |
| Rotation speed | **0.0096°/ms (~0.58°/s)** | Full cycle ≈ 10 min |
| CLIP_ZONE | 8° | Transition zone at edges |

#### Arc-edge Transition: Smoothstep (CHANGED from clip-path)

Cards at arc edges use **smoothstep easing** instead of clip-path:

| Property | Center | Edge | Easing |
|----------|--------|------|--------|
| opacity | 1.0 | 0 | smoothstep `t²×(3−2t)` |
| scale | 1.0 | 0.9 | via smoothstep |
| blur | 0px | 4px | via smoothstep |
| pointerEvents | auto | none | cutoff at smoothstep > 0.25 |

#### MiniCard (on the arc)

- **Size:** 290px (mobile) / 340px (desktop) wide
- **Style:** `bg-[#0C0C0C]/92 backdrop-blur-md`, border `white/10`, `rounded-3xl`, `shadow-2xl`
- **Content:** Project number (Playfair italic, orange), category, title, first highlight line

#### ExpandedCard (click → left side overlay)

- **Layout:** Title → Keywords → **Project Overview** (bullet list) → **Key Contributions** (bullet list)
- **NO images** — replaced by text content sections
- **Section headers:** Orange (`#e8702a`), uppercase, tracked
- **Max width:** 520–640px
- **Dismiss:** X button or click dark backdrop → card animates back, rotation resumes
- **Scroll lock:** body scroll disabled while expanded

### Project Data (5 cards, all populated)

| # | Title | Keywords | Status |
|---|-------|----------|--------|
| 01 | Global Supply Chain Finance Platform | Supply Chain Finance · Multi-country System | ✅ Complete |
| 02 | Cross-Border E-Commerce & Enterprise System Integration | E-commerce System Integration · Enterprise Connectivity | ✅ Complete |
| 03 | AI-Powered Trade Validation & Workflow Automation | AI Automation · Workflow Optimization | ✅ Complete |
| 04 | Enterprise Collaboration Platform: "Xuecheng Docs 2.0" | Enterprise SaaS · Knowledge System | ✅ Complete |
| 05 | AI-Powered Creative Suite: "AI Play" | AI Video Production · Voice Cloning | ✅ Complete |

---

## Page 4: Skills — REDESIGNED (2026-06-18)

**File:** `src/components/Skills.tsx`

### Visual Design
- **Background:** `wmremove-transformed.png` with `blur-sm scale-110` + `bg-black/70` overlay (matching Experience page)
- **Full screen:** `100dvh`

### Core Interaction: 3D Rotating Card Ring

10 skill cards standing upright in a 3D circular ring, like playing cards arranged in a circle.

#### Ring Parameters

| Parameter | Value | Notes |
|-----------|-------|-------|
| Card count | 10 | `ANGLE_STEP = 36°` |
| Radius | 420px | `translateZ(420px)` |
| Perspective | 1000px | Container perspective |
| Auto-rotation | ~2.5°/s | Pauses when card is flipped |
| Card size | 160×220px | Stands upright |

#### Card Front Face
- Dark gradient background with unique **tint color** (very subtle, ~8% opacity at top)
- Category tag (uppercase, orange tint)
- Skill name (centered)
- 5-dot proficiency indicator

#### Card Back Face
- Slightly darker background with same tint
- Category + skill name header
- Full description text
- Proficiency dots at bottom
- **Scrollable** (`overflow-y-auto`) with `scrollbar-fade` class — scrollbar hidden by default, appears on hover/scroll

#### Interaction
- **Hover:** Ring auto-rotates slowly (~2.5°/s)
- **Click card:** Ring pauses, card flips 180° (CSS `rotateY` transition, 0.6s cubic-bezier)
- **Click again:** Card flips back, ring resumes rotation
- **Back face scroll:** Content overflows scrollable with hidden scrollbar

### Card Tint Colors (10 unique subtle colors)

| # | Skill | Tint |
|---|-------|------|
| 1 | Product Strategy | `#e8702a` (orange) |
| 2 | Platform Architecture | `#3b82b6` (blue) |
| 3 | Supply Chain Finance | `#8b6b4a` (brown) |
| 4 | Cross-border Integration | `#4a7c6b` (teal) |
| 5 | AI Workflow Automation | `#6b5b8a` (purple) |
| 6 | Data Analysis | `#5a8a8a` (cyan-gray) |
| 7 | User Research | `#9a6b6b` (rose) |
| 8 | Agile Delivery | `#7a8a5a` (olive) |
| 9 | Stakeholder Mgmt | `#8a6a5a` (warm brown) |
| 10 | AI Content Creation | `#6a7a8a` (slate blue) |

---

## Page 5: About Me — TO DO

**File:** `src/components/AboutMe.tsx` — Placeholder, not yet implemented.

---

## CSS Additions (index.css)

### `.scrollbar-fade`
Custom scrollbar class for Skills card back faces:
- Scrollbar hidden by default (`scrollbar-width: none` for Firefox)
- WebKit: 4px wide, transparent thumb by default
- On hover/focus: thumb fades in at `rgba(255,255,255,0.15)`

---

## Deployment — GitHub Pages

### Configuration
- **Repo:** Public
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

---

## Images in `public/`

| File | Usage |
|------|-------|
| `hero-background-1.png` | Hero reveal layer + Experience blurred bg |
| `hero-background-2.png` | (unused currently) |
| `hero-background-3.png` | Hero base layer |
| `wmremove-transformed.png` | Projects + Skills section background |
| `bg-5.png` | Available for use |
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
| Card border | `white/10` or `white/[0.07]` |
| Flip transition | 0.6s `cubic-bezier(0.16, 1, 0.3, 1)` |
| Rotate speed (projects) | 0.0096°/ms |
| Rotate speed (skills) | 0.0025°/ms (~2.5°/s) |

---

## Next Steps (for next session)

1. **About Me page** — Implement page 5: real photo, bio, contact info, quick-info cards
2. **Contact Me button** — Wire up action on Hero (email / modal / scroll to About)
3. **Skills content** — Optionally refine skill card descriptions or reorganize
4. **Responsive polish** — Test mobile, adjust 3D ring and semi-circle on small screens
5. **Performance** — Consider converting PNG backgrounds to WebP
6. **Micro-interactions** — Subtle hover glow on cards, parallax on backgrounds