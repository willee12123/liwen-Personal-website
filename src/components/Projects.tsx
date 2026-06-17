import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

/* ────────────────────────────────────────────
   Types
   ──────────────────────────────────────────── */

interface ProjectImages {
  col1Top: string
  col1Bottom: string
  col2: string
}

interface Project {
  number: string
  category: string
  title: string
  highlights: string[]
  images?: ProjectImages
}

/* ────────────────────────────────────────────
   Data — 6 projects (1–3 detailed, 4–6 placeholder)
   ──────────────────────────────────────────── */

const PROJECTS: Project[] = [
  {
    number: '01',
    category: 'PLATFORM / FINTECH SYSTEM',
    title: 'Supply Chain Finance Platform Integration',
    highlights: [
      'Amazon / Target / TJX integration',
      'API / EDI / RPA / file-based systems',
      '10k invoices/day processing',
      '500k+ invoices financing scale',
    ],
    images: {
      col1Top:
        'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85',
      col1Bottom:
        'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png&w=1280&q=85',
      col2: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85',
    },
  },
  {
    number: '02',
    category: 'PLATFORM / SYSTEM DESIGN',
    title: 'Enterprise Platform Architecture',
    highlights: [
      'Credit lifecycle system design',
      'Multi-country / multi-currency architecture',
      'Dynamic pricing + auto reconciliation',
      'Platform scalability design',
    ],
    images: {
      col1Top:
        'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png&w=1280&q=85',
      col1Bottom:
        'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png&w=1280&q=85',
      col2: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png&w=1280&q=85',
    },
  },
  {
    number: '03',
    category: 'AI / AUTOMATION',
    title: 'AI Workflow Automation System',
    highlights: [
      'AI Trade Validation system',
      'OCR + LLM document extraction',
      'Automated audit workflow',
      '60% efficiency improvement',
    ],
    images: {
      col1Top:
        'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png&w=1280&q=85',
      col1Bottom:
        'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b.png&w=1280&q=85',
      col2: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png&w=1280&q=85',
    },
  },
  {
    number: '04',
    category: 'PLATFORM / ENTERPRISE',
    title: 'Project Title — Coming Soon',
    highlights: ['Details to be provided'],
  },
  {
    number: '05',
    category: 'PRODUCT / GROWTH',
    title: 'Project Title — Coming Soon',
    highlights: ['Details to be provided'],
  },
]

const TOTAL = PROJECTS.length

/* ────────────────────────────────────────────
   Arc geometry — angles computed dynamically
   from section height to keep 15% padding at
   top and bottom of the section.
   ──────────────────────────────────────────── */

const ROTATION_SPEED = 0.0096 // degrees per ms (~0.58°/s, 0.8× original)
const CLIP_ZONE = 8 // degrees — brief swallow/reveal at edges

interface ArcParams {
  arcStart: number
  arcEnd: number
  arcRange: number
  cardSpacing: number
}

function computeArcParams(sectionHeight: number, radius: number): ArcParams {
  // Cards occupy middle 70% — leaving 15% padding at top & bottom
  const maxDeviation = sectionHeight * 0.3
  // sin(angle) = opposite / radius — clamp to avoid NaN near 90°
  const sinAngle = Math.min(maxDeviation / radius, 0.999)
  const angleFromHorizontal = (Math.asin(sinAngle) * 180) / Math.PI
  const arcStart = 180 - angleFromHorizontal
  const arcEnd = 180 + angleFromHorizontal
  const arcRange = arcEnd - arcStart
  return { arcStart, arcEnd, arcRange, cardSpacing: arcRange / TOTAL }
}

const DEFAULT_ARC = computeArcParams(window.innerHeight, 280)

/* ────────────────────────────────────────────
   Helpers
   ──────────────────────────────────────────── */

function getArcPosition(
  index: number,
  rotation: number,
  radius: number,
  params: ArcParams,
) {
  const { arcStart, arcEnd, arcRange, cardSpacing } = params
  const baseAngle = arcStart + index * cardSpacing
  let angle = baseAngle + rotation

  // Seamless wrap within the visible arc
  while (angle > arcEnd) angle -= arcRange
  while (angle < arcStart) angle += arcRange

  const rad = (angle * Math.PI) / 180
  const x = Math.cos(rad) * radius
  const y = Math.sin(rad) * radius

  // ── Arc-edge clip (right side) ──
  // Bottom (entry): card clipped from right, emerges leftward into arc
  // Top (exit):    card clipped from right, recedes rightward out of arc
  // Middle:        fully visible
  let clipRight = 0
  if (angle < arcStart + CLIP_ZONE) {
    // Bottom: entering — clipRight 100→0, left portion appears first
    const t = (angle - arcStart) / CLIP_ZONE // 0 at edge → 1 at end
    clipRight = (1 - t) * 100 // 100% → 0%
  } else if (angle > arcEnd - CLIP_ZONE) {
    // Top: exiting — clipRight 0→100, right portion consumed first
    const t = (angle - (arcEnd - CLIP_ZONE)) / CLIP_ZONE // 0 at start → 1 at exit
    clipRight = t * 100 // 0% → 100%
  }

  // Cards lower on screen (higher y) overlap those above them
  return { x, y, zIndex: Math.round(y) + 100, opacity: 1, clipRight }
}

/* ────────────────────────────────────────────
   Mini card — shown on the semi-circle arc
   ──────────────────────────────────────────── */

function MiniCard({ project, onClick }: { project: Project; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group block w-[290px] sm:w-[340px] bg-[#0C0C0C]/92 backdrop-blur-md
        border border-white/10 rounded-3xl p-5 sm:p-6
        hover:border-[#e8702a]/35 hover:bg-[#111] transition-all duration-300
        shadow-2xl shadow-black/60 text-left"
    >
      <span className="font-playfair italic text-4xl sm:text-5xl font-bold text-[#e8702a]/65 group-hover:text-[#e8702a] transition-colors duration-300 leading-none">
        {project.number}
      </span>
      <p className="text-[10px] sm:text-[11px] tracking-[0.18em] text-white/25 uppercase mt-2">
        {project.category}
      </p>
      <h4 className="text-white/80 text-base sm:text-lg font-semibold mt-2 leading-snug group-hover:text-white transition-colors">
        {project.title}
      </h4>
      <p className="text-white/30 text-xs sm:text-sm mt-2.5 leading-relaxed line-clamp-2 group-hover:text-white/45 transition-colors">
        {project.highlights[0]}
      </p>
    </button>
  )
}

/* ────────────────────────────────────────────
   Expanded card — shown on the left when a
   mini card is clicked
   ──────────────────────────────────────────── */

function ExpandedCard({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <motion.div
      className="relative w-full bg-[#0C0C0C] border border-white/10 rounded-[40px] p-6 sm:p-8 md:p-10 shadow-2xl shadow-black/50"
      initial={{ opacity: 0, y: 30, scale: 0.93 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 30, scale: 0.93 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10
          text-white/50 hover:text-white transition-colors z-10"
        aria-label="Close"
      >
        <X size={20} />
      </button>

      {/* Number + category */}
      <span className="font-playfair italic text-5xl sm:text-6xl md:text-7xl font-bold text-[#e8702a]/75 leading-none">
        {project.number}
      </span>
      <p className="text-[10px] sm:text-xs tracking-[0.2em] text-white/35 uppercase mt-2 sm:mt-3">
        {project.category}
      </p>
      <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white mt-2 sm:mt-3 leading-tight">
        {project.title}
      </h3>

      {/* Highlights */}
      <ul className="mt-6 sm:mt-8 space-y-2.5">
        {project.highlights.map((h, i) => (
          <li key={i} className="flex items-start gap-3 text-white/55 text-sm sm:text-base">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e8702a]/50 mt-2 flex-shrink-0" />
            {h}
          </li>
        ))}
      </ul>

      {/* Images (if available) */}
      {project.images && (
        <div className="mt-8 sm:mt-10 flex gap-3 sm:gap-4">
          <div className="w-[40%] flex flex-col gap-3 sm:gap-4">
            <img
              src={project.images.col1Top}
              alt=""
              className="w-full rounded-2xl sm:rounded-3xl object-cover"
              style={{ height: 'clamp(80px, 10vw, 150px)' }}
            />
            <img
              src={project.images.col1Bottom}
              alt=""
              className="w-full rounded-2xl sm:rounded-3xl object-cover"
              style={{ height: 'clamp(100px, 14vw, 200px)' }}
            />
          </div>
          <div className="w-[60%]">
            <img
              src={project.images.col2}
              alt=""
              className="w-full h-full rounded-2xl sm:rounded-3xl object-cover min-h-[200px]"
            />
          </div>
        </div>
      )}
    </motion.div>
  )
}

/* ────────────────────────────────────────────
   Main Projects section
   ──────────────────────────────────────────── */

export default function Projects() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const [rotation, setRotation] = useState(0)
  const rotationRef = useRef(0)
  const rafRef = useRef<number>(0)
  const sectionRef = useRef<HTMLElement>(null)
  const [arcParams, setArcParams] = useState<ArcParams>(DEFAULT_ARC)
  const isPaused = expandedIndex !== null

  /* ---- Responsive arc radius ---- */
  const [radius, setRadius] = useState(280)

  useEffect(() => {
    const compute = () => {
      const vw = window.innerWidth
      const vh = window.innerHeight
      // Clamp between 220px and 350px, scale with viewport
      setRadius(Math.min(350, Math.max(220, Math.min(vw * 0.28, vh * 0.36))))
    }
    compute()
    window.addEventListener('resize', compute)
    return () => window.removeEventListener('resize', compute)
  }, [])

  /* ---- Dynamic arc params (15% padding top & bottom) ---- */
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const ro = new ResizeObserver(() => {
      const h = el.offsetHeight
      if (h > 0) setArcParams(computeArcParams(h, radius))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [radius])

  /* ---- Continuous arc rotation ---- */
  useEffect(() => {
    if (isPaused) return

    let lastTime = performance.now()

    const tick = (now: number) => {
      const dt = Math.min(now - lastTime, 50) // cap to avoid jumps on tab-switch
      lastTime = now
      rotationRef.current = (rotationRef.current + ROTATION_SPEED * dt) % 360
      setRotation(rotationRef.current)
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [isPaused])

  /* ---- Expand / collapse ---- */
  const handleExpand = useCallback((index: number) => {
    setExpandedIndex(index)
    document.body.style.overflow = 'hidden'
  }, [])

  const handleCollapse = useCallback(() => {
    setExpandedIndex(null)
    document.body.style.overflow = ''
  }, [])

  // Ensure scroll is restored on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative bg-black overflow-hidden min-h-screen
        rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px]
        -mt-10 sm:-mt-12 md:-mt-14 z-10"
    >
      {/* ── Background image (full opacity, only cards/text have local dark mats) ── */}
      <div className="absolute inset-0 z-0">
        <img
          src={import.meta.env.BASE_URL + 'wmremove-transformed.png'}
          alt=""
          className="w-full h-full object-cover opacity-65"
        />
      </div>

      {/* ── Section heading (left side) with local dark mat ── */}
      <div className="relative z-10 pt-20 sm:pt-28 md:pt-36 px-5 sm:px-10 md:px-14">
        <div className="inline-block bg-black/50 backdrop-blur-sm rounded-3xl px-5 py-4 sm:px-7 sm:py-5">
          <h2 className="font-playfair italic text-4xl sm:text-5xl md:text-6xl font-bold text-white">
            Projects
          </h2>
          <p className="text-white/40 text-sm sm:text-base mt-2 max-w-xs sm:max-w-sm">
            Selected work in platform design, cross-border systems, and AI
            workflows
          </p>
        </div>
        {/* Hint */}
        <p className="text-white/20 text-xs sm:text-sm mt-6 hidden sm:block ml-1">
          Click a card to view details →
        </p>
      </div>

      {/* ── Semi-circle carousel (right side) ── */}
      <div
        className="absolute z-10"
        style={{
          left: 'clamp(80vw, 86vw, 92vw)',
          top: '50vh',
        }}
      >
        {PROJECTS.map((project, i) => {
          const pos = getArcPosition(i, rotation, radius, arcParams)
          return (
            <div
              key={i}
              className="absolute"
              style={{
                transform: `translate(${pos.x}px, ${pos.y}px)`,
                left: '-170px', // half card width (340px / 2)
                top: '-80px',
                opacity: pos.opacity,
                zIndex: pos.zIndex,
                clipPath:
                  pos.clipRight > 0
                    ? `inset(0 ${pos.clipRight}% 0 0)`
                    : 'none',
              }}
            >
              <MiniCard project={project} onClick={() => handleExpand(i)} />
            </div>
          )
        })}
      </div>

      {/* Fade overlay on the right edge for smooth card exit */}
      <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 z-[5] bg-gradient-to-l from-black/30 to-transparent pointer-events-none" />

      {/* ── Expanded overlay ── */}
      <AnimatePresence>
        {expandedIndex !== null && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center sm:justify-start p-4 sm:p-8 sm:pl-[5vw] md:pl-[8vw]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Backdrop — clicking dismisses */}
            <div
              className="absolute inset-0 bg-black/65 backdrop-blur-sm"
              onClick={handleCollapse}
            />

            {/* Expanded card */}
            <div className="relative z-10 w-full max-w-[520px] sm:max-w-[580px] md:max-w-[640px]">
              <ExpandedCard
                project={PROJECTS[expandedIndex]}
                onClose={handleCollapse}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}