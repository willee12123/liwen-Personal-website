import { useState, useEffect, useRef } from 'react'
import { ChevronsRight } from 'lucide-react'

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
    name: 'B2B Platform Product Ownership',
    category: 'Product',
    level: 5,
    tint: '#e8702a',
    detail: 'Owned end‑to‑end product lifecycle for Olea\'s supply chain finance platform – from customer onboarding, asset registration, and dynamic pricing to auto‑reconciliation.\n\nLed the 0‑to‑1 build of core modules (client management, asset management, capital matching), serving 70+ countries and 25+ funders.\n\nDefined product roadmap, prioritised backlog, and coordinated cross‑team resources to deliver key milestones on schedule.',
  },
  {
    name: 'AI‑Powered Workflow Automation',
    category: 'AI',
    level: 5,
    tint: '#3b82b6',
    detail: 'Designed an AI Trade Validation workflow using OCR + LLM to extract and validate invoice fields (date, number, amount), reducing manual review work by ~60% and cutting per‑asset review time from 15–20 min to under 5 min.\n\nBuilt a requirement‑analysis Skill that automatically retrieves historical features and similar solutions when new requests come in.\n\nCreated PRD auto‑generation and visual demo‑generation Skills, accelerating documentation and prototyping while improving cross‑team alignment.',
  },
  {
    name: 'Data‑Driven Decision Making',
    category: 'Analytics',
    level: 4,
    tint: '#8b6b4a',
    detail: 'Analysed transaction data for Amazon SC financing, handling 10,000+ daily invoice records and over 500,000 invoices cumulatively.\n\nUsed SQL and Python to monitor platform performance, identify bottlenecks, and prioritise feature improvements based on usage patterns.\n\nConducted quantitative user research and A/B‑like tests (e.g., on coverage growth) to refine product strategies at Meituan.',
  },
  {
    name: 'System Integration & API Design',
    category: 'Technology',
    level: 4,
    tint: '#4a7c6b',
    detail: 'Architected integration solutions with Amazon, Target, and TJX – flexibly using API, RPA, and file transfers for order, invoice, payment, and reconciliation data flows.\n\nBuilt a scalable asset‑creation process that supports multi‑currency, multi‑country, and multi‑asset‑type management across diverse partners.\n\nFamiliar with EDI, RESTful APIs, and automated data pipelines; ensured seamless connectivity between external platforms and internal financing systems.',
  },
  {
    name: 'Cross‑Functional & Cross‑Border Collaboration',
    category: 'Communication',
    level: 5,
    tint: '#6b5b8a',
    detail: 'Coordinated with client business/tech teams and internal R&D, risk, legal, and operations to independently drive complex projects across time zones.\n\nWorked daily with teams in Singapore, India, Vietnam, and the UK – using English as the working language for requirement discussions and project syncs.\n\nAt Meituan, aligned product, design, engineering, QA, and operations to migrate enterprise content collaboration habits, raising product coverage from 20% to 75%.',
  },
  {
    name: 'Product Strategy & Go‑to‑Market',
    category: 'Strategy',
    level: 4,
    tint: '#5a8a8a',
    detail: 'Defined the strategic direction for Meituan\'s "Xuecheng Document 2.0" – benchmarked against Notion, Google Docs, and Feishu – and drove a 75% adoption rate within 3 months.\n\nDesigned tiered user research and usability tests for different roles and scenarios, shaping feature priorities.\n\nPlanned phased rollouts and training campaigns to accelerate enterprise migration, achieving coverage growth from 20% to 75%.',
  },
  {
    name: 'Complex Business Architecture',
    category: 'Design',
    level: 5,
    tint: '#9a6b6b',
    detail: 'Modeled the full financing lifecycle (customer admission, asset registration, application, risk review, post‑loan management) into reusable platform capabilities.\n\nAbstracted diverse partner business models into a unified dynamic‑pricing and intelligent capital‑matching engine, enhancing system extensibility and reusability.\n\nDesigned a permission system, template marketplace, and document‑referencing features for Meituan\'s large‑scale content collaboration (1.05M new docs/month).',
  },
  {
    name: 'Project Delivery & Milestone Management',
    category: 'Execution',
    level: 4,
    tint: '#7a8a5a',
    detail: 'Independently delivered the Amazon SC financing integration, ensuring on‑time go‑live despite multiple external dependencies and regulatory checks.\n\nManaged priority trade‑offs and resource allocation across parallel workstreams (e.g., asset management, auto‑reconciliation, AI validation).\n\nMaintained rigorous milestone tracking and risk mitigation, consistently meeting quarterly release commitments at both Olea and Meituan.',
  },
  {
    name: 'AI‑Native Exploration',
    category: 'Innovation',
    level: 4,
    tint: '#8a6a5a',
    detail: 'Pioneered AI‑native ways of working: automated requirement analysis, PRD drafting, and interactive demo generation – shifting the team from experience‑driven to knowledge‑driven processes.\n\nBuilt a knowledge‑reuse Skill that reduced repetitive research and handover overhead.\n\nExperimented with LLM‑based document parsing and rule‑based validation, laying the groundwork for broader AI adoption across the product lifecycle.',
  },
  {
    name: 'Global Stakeholder Management',
    category: 'International',
    level: 5,
    tint: '#6a7a8a',
    detail: 'Operated in a truly global supply‑chain finance platform covering 70+ countries, 25+ funders, and 40+ partner institutions.\n\nNavigated multi‑jurisdictional regulatory and compliance requirements while designing financing scenarios for Amazon, Target, and TJX.\n\nLed cross‑time‑zone meetings, wrote bilingual PRDs and integration specs, and built trust with overseas partners through clear, proactive communication.',
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
  const [isHovering, setIsHovering] = useState(false)
  const [isBoosting, setIsBoosting] = useState(false)
  const rotationRef = useRef(0)
  const speedRef = useRef(1)
  const rafRef = useRef<number>(0)
  const isPaused = flippedIndex !== null

  /* ---- Auto-rotate the ring ---- */
  useEffect(() => {
    if (isPaused) return

    let lastTime = performance.now()

    const tick = (now: number) => {
      const dt = Math.min(now - lastTime, 50)
      lastTime = now
      // Normal: ~2.5°/s, Boost: ~18°/s
      rotationRef.current = (rotationRef.current + 0.0025 * speedRef.current * dt) % 360
      setRingRotation(rotationRef.current)
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [isPaused])

  /* ---- Speed boost handlers ---- */
  const startBoost = () => {
    speedRef.current = 7
    setIsBoosting(true)
  }
  const stopBoost = () => {
    speedRef.current = 1
    setIsBoosting(false)
  }

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
        <div
          className="flex-1 flex items-center justify-center overflow-hidden"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => { setIsHovering(false); stopBoost() }}
        >
          <div
            className="relative w-full h-full flex items-center justify-center"
            style={{ perspective: '1000px' }}
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
                        <span className="text-white text-sm sm:text-base font-semibold text-center leading-snug">
                          {card.name}
                        </span>
                        {/* Level indicator */}
                        <DotBar level={card.level} />
                      </div>

                      {/* ── Back face ── */}
                      <div
                        className="absolute inset-0 rounded-2xl border border-white/10
                          flex flex-col p-5 shadow-xl shadow-black/40 overflow-y-auto scrollbar-fade bg-[#0C0C0C]"
                        style={{
                          backfaceVisibility: 'hidden',
                          transform: 'rotateY(180deg)',
                          borderTopColor: `${card.tint}50`,
                          borderTopWidth: '3px',
                        }}
                      >
                        {/* Header */}
                        <span className="text-[#e8702a] text-[9px] tracking-[0.15em] uppercase font-medium mb-1">
                          {card.category}
                        </span>
                        <span className="text-white text-xs font-semibold mb-2">
                          {card.name}
                        </span>

                        {/* Detail text */}
                        <p className="text-white text-[10px] leading-relaxed whitespace-pre-line">
                          {card.detail}
                        </p>

                        {/* Level */}
                        <div className="pt-2 flex items-center justify-between">
                          <span className="text-white text-[9px]">Proficiency</span>
                          <DotBar level={card.level} />
                        </div>
                      </div>
                    </div>
                  </div>
                )})}
            </div>

            {/* Boost button — right side, visible on hover */}
            <div
              className={`absolute right-4 top-1/2 -translate-y-1/2 transition-opacity duration-300 ${
                isHovering && !isPaused ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <button
                onMouseDown={startBoost}
                onMouseUp={stopBoost}
                onMouseLeave={stopBoost}
                onTouchStart={startBoost}
                onTouchEnd={stopBoost}
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 ${
                  isBoosting
                    ? 'bg-[#e8702a] text-white shadow-lg shadow-[#e8702a]/40 scale-110'
                    : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
                }`}
                aria-label="Accelerate rotation"
              >
                <ChevronsRight size={20} />
              </button>
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