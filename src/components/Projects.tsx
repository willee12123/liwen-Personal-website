import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

/* ────────────────────────────────────────────
   Types
   ──────────────────────────────────────────── */

interface Project {
  number: string
  category: string
  title: string
  highlights: string[]
  overview: string[]
  contributions: string[]
}

/* ────────────────────────────────────────────
   Data — 6 projects (1–3 detailed, 4–6 placeholder)
   ──────────────────────────────────────────── */

const PROJECTS: Project[] = [
  {
    number: '01',
    category: 'FinTech Platform · Multi-country System',
    title: 'Global Supply Chain Finance Platform',
    highlights: [
      'Global supply chain finance platform',
      'End-to-end financing lifecycle',
      'Multi-country / multi-currency architecture',
      'AI-driven workflow automation',
    ],
    overview: [
      'Led core product design of a global supply chain finance platform serving enterprise clients and financial institutions',
      'Built end-to-end financing lifecycle including onboarding, asset management, funding allocation, pricing, and settlement',
    ],
    contributions: [
      'Designed full financing workflow: customer onboarding → asset registration → financing approval → repayment lifecycle',
      'Built scalable platform architecture supporting multi-country, multi-currency, and multi-partner operations',
      'Designed dynamic pricing and automated reconciliation mechanisms to improve financial efficiency and transparency',
      'Defined product ownership model and coordinated cross-functional delivery (engineering, risk, legal, operations)',
      'Supported platform handling large-scale financial transactions across global supply chain ecosystem',
    ],
  },
  {
    number: '02',
    category: 'E-commerce System Integration · Enterprise Connectivity',
    title: 'Cross-Border E-Commerce & Enterprise System Integration',
    highlights: [
      'Amazon / Target / TJX platform integration',
      'API / EDI / RPA / file-based pipelines',
      '~10,000 invoices/day processing',
      '500,000+ invoices financing scale',
    ],
    overview: [
      'Designed and delivered integration solutions connecting global e-commerce platforms and supply chain finance systems',
      'Enabled seamless data exchange across enterprise systems using API, EDI, RPA, and file-based pipelines',
    ],
    contributions: [
      'Integrated major global platforms (e.g., Amazon, Target, TJX) into financing ecosystem',
      'Designed flexible integration framework supporting API, EDI, RPA, and structured file transfer methods',
      'Built high-throughput invoice processing system supporting ~10,000 invoices per day',
      'Accumulated processing scale exceeding 500,000+ invoices for financing operations',
      'Standardized integration approach across multiple enterprise clients to improve deployment efficiency',
    ],
  },
  {
    number: '03',
    category: 'AI Automation · Workflow Optimization',
    title: 'AI-Powered Trade Validation & Workflow Automation',
    highlights: [
      'AI Trade Validation system',
      'OCR + LLM document extraction',
      'Automated audit workflow',
      '60% efficiency improvement',
    ],
    overview: [
      'Built AI-driven automation system for trade document validation in supply chain finance scenarios',
      'Applied OCR and large language models to automate document extraction and compliance checks',
    ],
    contributions: [
      'Designed AI trade validation workflow: document ingestion → field extraction → rule validation → approval decision',
      'Applied OCR + LLM to extract key invoice fields (date, number, amount) and validate consistency',
      'Reduced manual audit workload by ~60%, significantly improving operational efficiency',
      'Shortened average document review time from 15–20 minutes to under 5 minutes',
      'Improved accuracy and consistency of financial document verification process',
    ],
  },
  {
    number: '04',
    category: 'Enterprise SaaS · Knowledge System',
    title: 'Enterprise Collaboration Platform: "Xuecheng Docs 2.0"',
    highlights: [
      'Meituan internal collaboration platform',
      'Permission management + template marketplace',
      'Adoption from 20% → 75% in 3 months',
      '1M+ documents per month',
    ],
    overview: [
      'Contributed to the design and growth of Meituan\'s internal enterprise collaboration platform "Xuecheng Docs 2.0"',
      'Focused on core collaboration capabilities and enterprise-scale document management system',
    ],
    contributions: [
      'Designed core modules including permission management, template marketplace, and document referencing system',
      'Conducted user research and competitor analysis (Notion, Google Docs, Feishu Docs)',
      'Improved product usability through role-based user experience optimization and testing',
      'Drove platform adoption from ~20% to 75% within 3 months of launch',
      'Supported large-scale content ecosystem handling over 1M+ documents per month',
    ],
  },
  {
    number: '05',
    category: 'AI Video Production · Voice Cloning',
    title: 'AI-Powered Creative Suite: "AI Play"',
    highlights: [
      'End-to-end AI video production pipeline',
      'AI voice cloning & processing system',
      'YouTube channel @Kumi-u7y',
      'Multi-modal AI creative workflow',
    ],
    overview: [
      'Independently developed an end-to-end AI-driven creative suite to explore and validate the application of generative AI in multimedia content creation, spanning from automated video production to personalized voice synthesis.',
    ],
    contributions: [
      'Full-Funnel AI Video Production Pipeline: Architected and executed a complete video creation workflow leveraging multi-modal AI tools. Automated the entire process from script outlining, storyboard generation, and visual asset creation, to AI-powered video editing, dubbing, and final publishing. Successfully launched a dedicated YouTube channel (@Kumi-u7y) to showcase the resulting content.',
      'AI Voice Cloning & Processing System: Designed and deployed a custom skill/automation that accepts audio/video files or web links for advanced voice processing. Implemented voice separation and high-fidelity voice cloning, enabling rapid generation of synthetic speech for non-commercial applications such as video dubbing and narration.',
    ],
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

  // ── Arc-edge smoothstep transition ──
  // Bottom (entry): fades in with scale + blur as card enters the arc
  // Top (exit):    fades out with scale + blur as card leaves the arc
  // Middle:        fully visible (smoothstep = 1)
  let clipFactor = 0
  if (angle < arcStart + CLIP_ZONE) {
    // Bottom: entering — clipFactor 1→0
    clipFactor = 1 - (angle - arcStart) / CLIP_ZONE
  } else if (angle > arcEnd - CLIP_ZONE) {
    // Top: exiting — clipFactor 0→1
    clipFactor = (angle - (arcEnd - CLIP_ZONE)) / CLIP_ZONE
  }

  clipFactor = Math.max(0, Math.min(1, clipFactor))

  // Smoothstep easing: t² × (3 − 2t)
  const t = 1 - clipFactor
  const smoothstep = t * t * (3 - 2 * t)

  return {
    x,
    y,
    zIndex: Math.round(y) + 100,
    opacity: smoothstep,
    scale: 0.9 + 0.1 * smoothstep,
    blur: (1 - smoothstep) * 4,
    pointerEvents: smoothstep > 0.25 ? 'auto' : 'none',
    clipRight: 0,
  }
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

      {/* Project Overview */}
      <div className="mt-6 sm:mt-8">
        <h4 className="text-[#e8702a] text-xs sm:text-sm font-semibold uppercase tracking-[0.15em] mb-3">
          Project Overview
        </h4>
        <ul className="space-y-2.5">
          {project.overview.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-white/55 text-sm sm:text-base">
              <span className="w-1.5 h-1.5 rounded-full bg-[#e8702a]/50 mt-2 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Key Contributions */}
      <div className="mt-6 sm:mt-8">
        <h4 className="text-[#e8702a] text-xs sm:text-sm font-semibold uppercase tracking-[0.15em] mb-3">
          Key Contributions
        </h4>
        <ul className="space-y-2.5">
          {project.contributions.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-white/55 text-sm sm:text-base">
              <span className="w-1.5 h-1.5 rounded-full bg-[#e8702a]/50 mt-2 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>
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
          src={import.meta.env.BASE_URL + 'wmremove-transformed.webp'}
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
            Fintech Platform, Enterprise SAAS, AI workflows
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
                transform: `translate(${pos.x}px, ${pos.y}px) scale(${pos.scale})`,
                transformOrigin: 'center center',
                left: '-170px', // half card width (340px / 2)
                top: '-80px',
                opacity: pos.opacity,
                zIndex: pos.zIndex,
                filter: `blur(${pos.blur}px)`,
                pointerEvents: pos.pointerEvents as React.CSSProperties['pointerEvents'],
                willChange: 'transform, opacity, filter',
                clipPath: 'none',
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