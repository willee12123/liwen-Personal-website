import { useState, useEffect, useRef } from 'react'

/* ────────────────────────────────────────────
   Skill card data — 10 cards around the ring
   ──────────────────────────────────────────── */

interface SkillCard {
  name: string
  category: string
  level: number
  detail: string
  tint: string  // subtle background tint per card
}

const SKILL_CARDS: SkillCard[] = [
  {
    name: 'Product Strategy',
    category: 'Product',
    level: 5,
    tint: '#e8702a',
    detail: 'End-to-end product strategy definition, market research, competitive analysis, and roadmap planning. Led product vision for global supply chain finance platform serving 70+ countries.',
  },
  {
    name: 'Platform Architecture',
    category: 'Technical',
    level: 5,
    tint: '#3b82b6',
    detail: 'Scalable multi-country, multi-currency platform design. Defined architecture for financing lifecycle: onboarding → asset management → funding → settlement.',
  },
  {
    name: 'Supply Chain Finance',
    category: 'Domain',
    level: 5,
    tint: '#8b6b4a',
    detail: 'Deep expertise in cross-border supply chain finance. Designed invoice processing systems handling 10k+ invoices/day, 500k+ invoices financing scale.',
  },
  {
    name: 'Cross-border Integration',
    category: 'Technical',
    level: 4,
    tint: '#4a7c6b',
    detail: 'Integrated major global platforms (Amazon, Target, TJX) via API, EDI, RPA. Built flexible integration framework for enterprise connectivity.',
  },
  {
    name: 'AI Workflow Automation',
    category: 'Technical',
    level: 4,
    tint: '#6b5b8a',
    detail: 'AI-powered trade validation: OCR + LLM document extraction, automated audit workflows. Reduced manual review time from 20min → 5min, 60% efficiency gain.',
  },
  {
    name: 'Data Analysis',
    category: 'Analytics',
    level: 4,
    tint: '#5a8a8a',
    detail: 'Python, SQL, GIS for quantitative analysis. Data-driven product decision-making backed by statistical methods and visualization.',
  },
  {
    name: 'User Research',
    category: 'Design',
    level: 4,
    tint: '#9a6b6b',
    detail: 'User interviews, usability testing, competitor analysis (Notion, Google Docs, Feishu). Role-based UX optimization that drove adoption 20%→75%.',
  },
  {
    name: 'Agile Delivery',
    category: 'Process',
    level: 4,
    tint: '#7a8a5a',
    detail: 'Cross-functional coordination across engineering, risk, legal, and operations. Defined product ownership model for efficient delivery.',
  },
  {
    name: 'Stakeholder Mgmt',
    category: 'Leadership',
    level: 3,
    tint: '#8a6a5a',
    detail: 'Managing stakeholders across global teams. Balancing business needs with technical constraints in enterprise environments.',
  },
  {
    name: 'AI Content Creation',
    category: 'Creative',
    level: 3,
    tint: '#6a7a8a',
    detail: 'AI video production pipeline: script → storyboard → AI editing → dubbing. Voice cloning & processing for multimedia content. YouTube @Kumi-u7y.',
  },
]

const N = SKILL_CARDS.length
const ANGLE_STEP = 360 / N
const RADIUS = 420 // px — ring radius

/* ────────────────────────────────────────────
   Dot indicator
   ──────────────────────────────────────────── */

function DotBar({ level, max = 5 }: { level: number; max?: number }) {
  return (
    <div className="flex gap-1 justify-center">
      {Array.from({ length: max }, (_, i) => (
        <div
          key={i}
          className={`w-1.5 h-1.5 rounded-full transition-colors ${
            i < level ? 'bg-[#e8702a]' : 'bg-white/15'
          }`}
        />
      ))}
    </div>
  )
}

/* ────────────────────────────────────────────
   Main Skills section
   ──────────────────────────────────────────── */

export default function Skills() {
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null)
  const [ringRotation, setRingRotation] = useState(0)
  const rotationRef = useRef(0)
  const rafRef = useRef<number>(0)
  const isPaused = flippedIndex !== null

  /* ---- Auto-rotate the ring ---- */
  useEffect(() => {
    if (isPaused) return

    let lastTime = performance.now()

    const tick = (now: number) => {
      const dt = Math.min(now - lastTime, 50)
      lastTime = now
      // ~2.5°/s — gentle but noticeable rotation
      rotationRef.current = (rotationRef.current + 0.0025 * dt) % 360
      setRingRotation(rotationRef.current)
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [isPaused])

  /* ---- Flip handler ---- */
  const handleCardClick = (index: number) => {
    if (flippedIndex === index) {
      // Unflip
      setFlippedIndex(null)
    } else {
      setFlippedIndex(index)
    }
  }

  return (
    <section
      id="skills"
      className="relative bg-black overflow-hidden"
      style={{ height: '100dvh' }}
    >
      {/* Blurred background */}
      <div
        className="absolute inset-0 bg-center bg-cover bg-no-repeat blur-sm scale-110"
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}wmremove-transformed.png)` }}
      />
      <div className="absolute inset-0 bg-black/70" />

      <div className="relative z-10 h-full flex flex-col px-5 sm:px-10 md:px-14 py-20 sm:py-24">
        {/* Section heading */}
        <h2 className="font-playfair italic text-4xl sm:text-5xl text-white mb-4 text-center shrink-0">
          Skills
        </h2>
        <p className="text-white/30 text-sm text-center mb-2 shrink-0">
          Click a card to reveal details
        </p>

        {/* ── 3D Ring scene ── */}
        <div className="flex-1 flex items-center justify-center overflow-hidden">
          <div
            className="relative"
            style={{
              perspective: '1000px',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* The rotating ring */}
            <div
              className="relative"
              style={{
                width: '0px',
                height: '0px',
                transformStyle: 'preserve-3d',
                transform: `rotateY(${ringRotation}deg)`,
              }}
            >
              {SKILL_CARDS.map((card, i) => {
                const angle = ANGLE_STEP * i
                const isFlipped = flippedIndex === i

                return (
                  <div
                    key={i}
                    className="absolute"
                    style={{
                      width: '0px',
                      height: '0px',
                      transform: `rotateY(${angle}deg) translateZ(${RADIUS}px)`,
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    {/* Card with front/back faces */}
                    <div
                      className="absolute cursor-pointer"
                      style={{
                        width: '160px',
                        height: '220px',
                        left: '-80px',
                        top: '-110px',
                        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                        transformStyle: 'preserve-3d',
                        transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                      onClick={() => handleCardClick(i)}
                    >
                      {/* ── Front face ── */}
                      <div
                        className="absolute inset-0 rounded-2xl border border-white/10
                          backdrop-blur-sm flex flex-col items-center justify-center
                          gap-3 p-4 shadow-xl shadow-black/40"
                        style={{
                          backfaceVisibility: 'hidden',
                          background: `linear-gradient(180deg, ${card.tint}18 0%, ${card.tint}06 35%, #0C0C0C 100%)`,
                        }}
                      >
                        {/* Category tag */}
                        <span className="text-[10px] tracking-[0.15em] uppercase text-[#e8702a]/70 font-medium">
                          {card.category}
                        </span>
                        {/* Skill name */}
                        <span className="text-white text-base sm:text-lg font-semibold text-center leading-snug">
                          {card.name}
                        </span>
                        {/* Level indicator */}
                        <DotBar level={card.level} />
                      </div>

                      {/* ── Back face ── */}
                      <div
                        className="absolute inset-0 rounded-2xl border border-white/10
                          flex flex-col p-5 shadow-xl shadow-black/40 overflow-y-auto scrollbar-fade"
                        style={{
                          backfaceVisibility: 'hidden',
                          transform: 'rotateY(180deg)',
                          background: `linear-gradient(180deg, ${card.tint}15 0%, ${card.tint}05 30%, #111 100%)`,
                        }}
                      >
                        {/* Header */}
                        <span className="text-[#e8702a] text-[10px] tracking-[0.15em] uppercase font-medium mb-1">
                          {card.category}
                        </span>
                        <span className="text-white text-sm font-semibold mb-3">
                          {card.name}
                        </span>

                        {/* Detail text */}
                        <p className="text-white/55 text-xs leading-relaxed">
                          {card.detail}
                        </p>

                        {/* Level */}
                        <div className="pt-2 flex items-center justify-between">
                          <span className="text-white/25 text-[10px]">Proficiency</span>
                          <DotBar level={card.level} />
                        </div>
                      </div>
                    </div>
                  </div>
                )})}
            </div>
          </div>
        </div>

        {/* Ground shadow / reflection hint */}
        <div className="flex justify-center shrink-0 -mt-2 pb-2">
          <div
            className="h-2 rounded-full bg-white/[0.03] blur-md"
            style={{ width: `${RADIUS * 1.2}px`, maxWidth: '90vw' }}
          />
        </div>
      </div>
    </section>
  )
}